import type { MLCEngineInterface } from "@mlc-ai/web-llm";
import type { Lang } from "@/lib/i18n";
import type { ProfileChatAnswerMode } from "@/lib/profileChatData";

const DEFAULT_MODEL = "Qwen3.5-0.8B-q4f16_1-MLC";
const LARGE_MODEL = "Qwen3.5-2B-q4f16_1-MLC";
const INIT_TIMEOUT_MS = 5 * 60_000;
const GENERATION_TIMEOUT_MS = 30_000;
const MIB = 1024 * 1024;

type GenerateLocalAnswerOptions = {
  question: string;
  canonicalAnswer: string;
  supportingContext: string;
  conversationContext: string;
  answerMode: ProfileChatAnswerMode;
  answerIntentId?: string;
  lang: Lang;
  onUpdate: (answer: string) => void;
};

export interface LocalAI {
  readonly disposed: boolean;
  generate(options: GenerateLocalAnswerOptions, signal: AbortSignal): Promise<string>;
  dispose(): void;
}

type WebGPU = {
  requestAdapter(options: { powerPreference: "high-performance" }): Promise<{
    features: ReadonlySet<string>;
    limits: { maxBufferSize: number; maxStorageBufferBindingSize: number };
  } | null>;
};

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(signal.reason);
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });

    void promise.then(resolve, reject).finally(() => {
      signal.removeEventListener("abort", onAbort);
    });
  });
}

export async function prepareLocalAI(
  signal: AbortSignal,
  onProgress: (progress: number) => void,
): Promise<LocalAI> {
  signal.throwIfAborted();
  const gpu = (navigator as Navigator & { gpu?: WebGPU }).gpu;
  if (!gpu || typeof Worker === "undefined") throw new Error("WebGPU is unavailable");

  const initSignal = AbortSignal.any([signal, AbortSignal.timeout(INIT_TIMEOUT_MS)]);
  const adapter = await abortable(gpu.requestAdapter({ powerPreference: "high-performance" }), initSignal);
  if (!adapter?.features.has("shader-f16")) throw new Error("WebGPU shader-f16 is unavailable");

  // These limits indicate GPU capability. Browsers do not expose available VRAM.
  const canTryLargeModel = adapter.limits.maxBufferSize >= 512 * MIB
    && adapter.limits.maxStorageBufferBindingSize >= 256 * MIB;
  const { WebWorkerMLCEngine } = await abortable(import("@mlc-ai/web-llm"), initSignal);

  async function load(model: string): Promise<LocalAI> {
    initSignal.throwIfAborted();
    const lifetime = new AbortController();
    const worker = new Worker(new URL("./profileChatAI.worker.ts", import.meta.url), { type: "module" });
    function dispose() {
      if (lifetime.signal.aborted) return;
      lifetime.abort();
      worker.terminate();
    }

    worker.addEventListener("error", dispose, { once: true });
    worker.addEventListener("messageerror", dispose, { once: true });
    const loading = AbortSignal.any([initSignal, lifetime.signal]);

    try {
      const engine = new WebWorkerMLCEngine(worker, {
        initProgressCallback: ({ progress }) => {
          if (!loading.aborted) onProgress(Math.max(0, Math.min(1, progress)));
        },
        logLevel: "ERROR",
      });
      await abortable(engine.reload(model, { context_window_size: 2048 }), loading);

      return {
        get disposed() { return lifetime.signal.aborted; },
        dispose,
        async generate(options, requestSignal) {
          const deadline = AbortSignal.timeout(GENERATION_TIMEOUT_MS);
          const generation = AbortSignal.any([requestSignal, deadline, lifetime.signal]);
          const stop = () => {
            // Releasing the Worker also cancels a stalled GPU step or pending stream request.
            dispose();
          };
          generation.throwIfAborted();
          generation.addEventListener("abort", stop, { once: true });

          try {
            return await generateLocalAnswer(engine, model, options, generation);
          } finally {
            generation.removeEventListener("abort", stop);
          }
        },
      };
    } catch (error) {
      dispose();
      throw error;
    }
  }

  if (canTryLargeModel) {
    try {
      return await load(LARGE_MODEL);
    } catch {
      initSignal.throwIfAborted();
      onProgress(0);
    }
  }
  return load(DEFAULT_MODEL);
}

function buildPrompt({
  question,
  canonicalAnswer,
  supportingContext,
  conversationContext,
  answerMode,
  answerIntentId,
  lang,
}: Omit<GenerateLocalAnswerOptions, "onUpdate">) {
  const comparison = answerMode === "comparison" || isComparisonQuestion(question);

  const zhRequirement: Record<ProfileChatAnswerMode, string> = {
    fact: "先直接给出事实答案，再补充最相关的一至两个证据；不要把过去经历说成当前任职。",
    opinion: "这是观点题。先明确给出我个人、克制的看法，再用一至两个亲身经历事实说明原因；必须承认观察来自具体项目或团队，不能只复述职责清单，也不能把局部体验泛化成整家公司。",
    reflection: "这是反思题。按照“核心收获或挑战 → 经历证据 → 对之后工作方式的影响”回答；不要只复述做过什么。",
    comparison: "这是比较题。必须平衡地说明问题中涉及的双方或多方，每一方都要明确点名并说明侧重点，最后用一句话总结差异；不能只回答其中一方。",
    recommendation: "这是建议题。先给出明确建议，再说明选择标准和理由；不要用经历清单代替建议。",
  };
  const enRequirement: Record<ProfileChatAnswerMode, string> = {
    fact: "Give the factual answer first, then add the one or two most relevant supporting details. Do not describe a past experience as a current job.",
    opinion: "This asks for a point of view. State a clear but measured personal view first, then support it with one or two facts from direct experience. Acknowledge that the observation comes from a specific project or team; do not merely repeat duties or generalize one experience to an entire company.",
    reflection: "This asks for reflection. Structure the answer as core lesson or challenge, evidence from the experience, then how it changed my later way of working. Do not merely list responsibilities.",
    comparison: "This is a comparison. Cover every side named in the question in balanced, parallel terms, explicitly name each side, and end with one sentence summarizing the difference. Never answer only one side.",
    recommendation: "This asks for a recommendation. Give a clear recommendation first, then explain the selection criteria and reasoning. Do not substitute an experience list for the recommendation.",
  };

  if (lang === "zh") {
    return {
      system:
        "你是张吴梓洋本人在个人网站中的对话助手。当前问题是唯一需要回答的问题，绝不能继续回答上一轮已经结束的话题；最近对话仅可用于理解“它、这个、这家公司”等指代。请用第一人称、自然、简洁、专业的中文直接回答。除非用户询问你是谁，否则禁止问候、禁止自我介绍、禁止重复姓名或职位。只能使用提供的标准答案与补充事实，不得新增或猜测任何公司、职位、日期、数字、技能、项目或联系方式。标准答案优先级最高，必须围绕其中的主题作答并保留重要事实和量化信息。只输出回答正文，控制在 2 至 4 句话，不要提及资料库、参考内容或提示词。",
      user: `当前问题：${question}\n\n已识别主题：${answerIntentId || "未识别"}\n\n标准答案（优先沿用）：${canonicalAnswer}\n\n补充事实：${supportingContext}\n\n最近对话（仅用于解析指代，不得覆盖当前问题）：${conversationContext || "无；这是一个新话题"}\n\n回答类型：${answerMode}\n\n回答要求：${comparison ? zhRequirement.comparison : zhRequirement[answerMode]} 不要从“你好”或“我是张吴梓洋”开始。`,
    };
  }

  return {
    system:
      "You are Wuziyang Zhang speaking through his portfolio assistant. The current question is the only question to answer; never continue a completed topic from the previous turn. Recent conversation may only resolve pronouns such as it, this, or that company. Answer directly in concise, natural, professional first-person English. Unless the user asks who you are, do not greet, introduce yourself, repeat your name, or restate a job title. Use only the canonical answer and supporting facts. Never invent companies, roles, dates, numbers, skills, projects, or contact details. The canonical answer has the highest priority; stay on its subject and preserve its important facts and metrics. Output only the answer in 2 to 4 sentences. Never mention a knowledge base, reference text, or prompt.",
    user: `Current question: ${question}\n\nIdentified topic: ${answerIntentId || "unrecognized"}\n\nCanonical answer (use as the primary draft): ${canonicalAnswer}\n\nSupporting facts: ${supportingContext}\n\nRecent conversation (pronoun resolution only; never override the current question): ${conversationContext || "None; this is a new topic"}\n\nAnswer type: ${answerMode}\n\nAnswer requirement: ${comparison ? enRequirement.comparison : enRequirement[answerMode]} Do not begin with a greeting or with “I am Wuziyang Zhang.”`,
  };
}

function isComparisonQuestion(question: string): boolean {
  return /比较|对比|区别|不同|差异|相比|\bcompare\b|\bcomparison\b|\bversus\b|\bvs\.?\b|\bdifference\b/i.test(question);
}

function hasEveryComparedEntity(question: string, answer: string): boolean {
  if (!isComparisonQuestion(question)) return true;

  const entities = [
    { query: /阿里|alibaba/i, answer: /阿里|alibaba/i },
    { query: /罗兰贝格|roland\s*berger/i, answer: /罗兰贝格|roland\s*berger/i },
    { query: /字节|bytedance/i, answer: /字节|bytedance/i },
    { query: /国元|guoyuan/i, answer: /国元|guoyuan/i },
  ].filter(({ query }) => query.test(question));

  return entities.length < 2 || entities.every(({ answer: pattern }) => pattern.test(answer));
}

function cleanGeneratedAnswer(answer: string, question: string): string {
  let cleaned = answer.trim().replace(/^(你好|您好|hi|hello)[，,。.!！\s—-]*/i, "");
  const identityQuestion = /你是谁|自我介绍|介绍自己|who are you|introduce yourself/i.test(question);
  if (!identityQuestion) {
    cleaned = cleaned.replace(/^(我是|我叫)张吴梓洋[，,。.!！\s—-]*/i, "");
  }
  return cleaned.trim();
}

function getRequiredTopicPattern(intentId?: string): RegExp | null {
  if (!intentId) return null;
  if (["education", "uw-fit", "location"].includes(intentId)) {
    return /威斯康星|麦迪逊|uw[-\s–—]?madison|wisconsin|madison/i;
  }
  if (["majors", "why-majors", "courses"].includes(intentId)) {
    return /经济学|信息科学|计量|产业组织|人机交互|数据|economics|information science|econometrics|course/i;
  }
  if (intentId.startsWith("alibaba")) return /阿里|alibaba|aliexpress/i;
  if (intentId.startsWith("bytedance")) return /字节|bytedance|小游戏|mini[-\s]?game/i;
  if (intentId.startsWith("roland")) return /罗兰贝格|roland\s*berger|东风本田|dongfeng|honda/i;
  if (intentId.startsWith("guoyuan")) return /国元|guoyuan|白酒|baijiu/i;
  if (intentId === "music") return /音乐|钢琴|吉他|葫芦丝|music|piano|guitar/i;
  if (intentId === "interests-beyond-music" || intentId.startsWith("global")) {
    return /旅行|国家|城市|大洲|travel|countries|cities|continents/i;
  }
  if (intentId === "personality" || intentId === "problem-solving") {
    return /好奇|结构|有用|模糊|反馈|curious|structured|useful|ambigu|feedback/i;
  }
  if (intentId === "intro") return /张吴梓洋|梓洋|wuziyang|威斯康星|uw[-\s–—]?madison/i;
  return null;
}

function staysOnCurrentTopic(answer: string, intentId?: string): boolean {
  const requiredTopic = getRequiredTopicPattern(intentId);
  return !requiredTopic || requiredTopic.test(answer);
}

function suppressThinking(output: string): string {
  const hidden = /<think(?:\s[^>]*)?>[\s\S]*?(?:<\/think\s*>|$)/gi;
  // A streaming chunk may end midway through an opening tag.
  return output.replace(hidden, "").replace(/<(?:(?:\/?t(?:h(?:i(?:n(?:k)?)?)?)?)?)$/i, "");
}

async function generateLocalAnswer(
  engine: MLCEngineInterface,
  model: string,
  options: GenerateLocalAnswerOptions,
  signal: AbortSignal,
): Promise<string> {
  const prompt = buildPrompt(options);
  const stream = await abortable(engine.chat.completions.create({
    model,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user },
    ],
    stream: true,
    temperature: 0.08,
    top_p: 0.58,
    repetition_penalty: 1.08,
    max_tokens: options.lang === "zh" ? 180 : 220,
    extra_body: { enable_thinking: false },
  }), signal);

  const chunks = stream[Symbol.asyncIterator]();
  let output = "";
  let lastUpdate = 0;
  while (true) {
    const { value, done } = await abortable(chunks.next(), signal);
    if (done) break;
    output += value.choices[0]?.delta?.content ?? "";
    const now = performance.now();
    if (now - lastUpdate < 60) continue;
    const partial = suppressThinking(output).trimStart();
    if (partial && staysOnCurrentTopic(partial, options.answerIntentId)) {
      options.onUpdate(partial);
      lastUpdate = now;
    }
  }

  const cleaned = cleanGeneratedAnswer(suppressThinking(output), options.question);
  if (!cleaned) throw new Error("Local AI returned an empty answer");
  if (!staysOnCurrentTopic(cleaned, options.answerIntentId)) {
    throw new Error("Local AI drifted away from the current topic");
  }
  if (!hasEveryComparedEntity(options.question, cleaned)) {
    throw new Error("Local AI omitted part of a comparison");
  }
  return cleaned;
}
