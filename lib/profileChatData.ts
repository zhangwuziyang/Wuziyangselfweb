import type { Lang } from "@/lib/i18n";

type LocalizedText = Record<Lang, string>;

interface ProfileChatIntent {
  id: string;
  keywords: string[];
  answer: LocalizedText;
}

export interface ProfileChatAction {
  href: string;
  label: string;
}

export type ProfileChatAnswerMode =
  | "fact"
  | "opinion"
  | "reflection"
  | "comparison"
  | "recommendation";

export interface ProfileChatResponse {
  answer: string;
  context: string;
  mode: ProfileChatAnswerMode;
  intentId?: string;
  useConversationContext: boolean;
  action?: ProfileChatAction;
}

type DestinationKey =
  | "about"
  | "university"
  | "experience"
  | "alibaba"
  | "bytedance"
  | "rolandBerger"
  | "guoyuan"
  | "chartCreator"
  | "codeAndPower"
  | "skills"
  | "global"
  | "music"
  | "philosophy"
  | "contact";

export const PROFILE_CHAT_COPY = {
  title: { en: "Ask Wuziyang", zh: "问问梓洋" },
  subtitle: { en: "About me", zh: "关于我" },
  status: { en: "Portfolio assistant", zh: "个人网站助手" },
  aiLoading: { en: "Ask now · Local AI warming up", zh: "可直接提问 · 本地 AI 后台准备中" },
  aiReady: { en: "Local AI ready", zh: "本地 AI 已就绪" },
  aiFallback: { en: "Instant knowledge mode", zh: "即时知识模式" },
  chatNowTitle: { en: "You can start right away", zh: "无需等待，可以直接提问" },
  chatNowLoading: {
    en: "The portfolio knowledge base answers immediately while the local AI finishes preparing in the background.",
    zh: "本地 AI 会在后台继续准备；加载期间由站内知识库即时回答，不影响正常对话。",
  },
  chatNowReady: {
    en: "Verified facts in, natural answers generated locally on your device.",
    zh: "知识库提供事实，本地 AI 在设备端生成自然回答。",
  },
  chatNowFallback: {
    en: "This device is using the instant knowledge base, so you can still ask about any experience, project, or skill.",
    zh: "当前设备使用即时知识库模式，仍可正常询问任何经历、项目或能力。",
  },
  howItWorks: { en: "Technical details", zh: "技术细节" },
  howItWorksBody: {
    en: "The system first classifies intent and resolves only explicit conversational references, then retrieves the most relevant verified profile facts. WebLLM performs generation entirely in the browser, and the output is checked for topic consistency and response language. Low-confidence retrieval or off-topic generation falls back to a canonical answer or a transparent no-match message.",
    zh: "系统会先识别问题意图，并仅对明确的上下文指代进行消歧，再从已核实的个人资料中检索最相关事实。WebLLM 完全在浏览器端完成语言生成，输出还会经过主题一致性与回答语言校验；若检索置信度不足或生成偏题，系统会回退到标准答案或明确的未命中说明。",
  },
  howItWorksSteps: {
    en: [
      { symbol: "?", title: "Interpret", detail: "Intent + language" },
      { symbol: "⌕", title: "Retrieve", detail: "Verified facts" },
      { symbol: "✦", title: "Generate", detail: "Local WebLLM" },
      { symbol: "✓", title: "Validate", detail: "Topic + language" },
    ],
    zh: [
      { symbol: "?", title: "语义解析", detail: "识别意图与回答语言" },
      { symbol: "⌕", title: "知识检索", detail: "匹配已验证的个人资料" },
      { symbol: "✦", title: "本地生成", detail: "WebLLM 本地运行" },
      { symbol: "✓", title: "回答校验", detail: "检查主题与语言一致性" },
    ],
  },
  howItWorksNoMatch: {
    en: "No reliable match → explain the knowledge gap; never guess.",
    zh: "低置信度或未命中 → 停止生成，并明确说明知识库暂无对应信息。",
  },
  greeting: {
    en: "Hi — I’m Wuziyang, and you can also think of me as this portfolio’s interactive guide. I can introduce who I am, unpack my experience and projects, compare my skills, recommend what to explore, or help you find the right way to contact me.",
    zh: "你好，我是梓洋，也可以把我当作这份个人网站的互动向导。我可以介绍我是谁、讲清每段经历与项目、总结能力特点、推荐浏览路线，也能帮你找到合适的联系方式。",
  },
  placeholder: { en: "Ask a question…", zh: "输入你想问的问题…" },
  send: { en: "Send", zh: "发送" },
  open: { en: "Ask me", zh: "问问我" },
  close: { en: "Close chat", zh: "关闭对话" },
  suggestionsLabel: { en: "Try asking", zh: "可以试着问" },
  suggestions: {
    en: [
      "Introduce yourself in one sentence",
      "What did you do at Alibaba?",
      "What are your strongest skills?",
      "Where should I start?",
    ],
    zh: [
      "用一句话介绍自己",
      "你在阿里巴巴做了什么？",
      "你最擅长什么？",
      "我应该从哪里开始看？",
    ],
  },
  fallback: {
    en: "Here’s how I work: I first search this portfolio’s knowledge base for relevant information, then a WebLLM running locally in your browser turns the retrieved facts into a conversational answer. I couldn’t find this question in the knowledge base, so I can’t give you a reliable answer yet. You can rephrase it or ask about my education, experience, projects, skills, or contact details.",
    zh: "我的工作方式是先在这份个人网站的知识库中检索相关资料，再由浏览器本地运行的 WebLLM 把找到的事实整理成对话式回答。这个问题目前没有在知识库中找到对应信息，因此我暂时无法给出可靠答案。你可以换一种问法，或询问我的教育、经历、项目、能力与联系方式。",
  },
} as const;

export function detectProfileChatLanguage(question: string, fallback: Lang): Lang {
  const chineseCharacters = question.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const englishWords = question.match(/[a-z]+(?:'[a-z]+)?/gi)?.length ?? 0;
  const hasEnglishQuestionStructure = /\b(?:what|why|how|where|when|who|which|tell|introduce|compare|describe|do|does|did|is|are|can|could|would|should)\b/i.test(question);

  if (chineseCharacters === 0 && englishWords > 0) return "en";
  if (hasEnglishQuestionStructure && englishWords >= 2 && chineseCharacters <= 3) return "en";
  if (chineseCharacters > 0) return "zh";
  return fallback;
}

const DESTINATIONS: Record<DestinationKey, { href: string; label: LocalizedText }> = {
  about: {
    href: "/#about",
    label: { en: "View About me", zh: "查看关于我" },
  },
  university: {
    href: "/university",
    label: { en: "View my education", zh: "查看教育背景" },
  },
  experience: {
    href: "/#experience",
    label: { en: "View my experience", zh: "查看工作经历" },
  },
  alibaba: {
    href: "/experience/alibaba-international",
    label: { en: "View Alibaba experience", zh: "查看阿里经历" },
  },
  bytedance: {
    href: "/experience/bytedance",
    label: { en: "View ByteDance experience", zh: "查看字节经历" },
  },
  rolandBerger: {
    href: "/experience/roland-berger",
    label: { en: "View Roland Berger experience", zh: "查看罗兰贝格经历" },
  },
  guoyuan: {
    href: "/experience/guoyuan-securities",
    label: { en: "View Guoyuan experience", zh: "查看国元证券经历" },
  },
  chartCreator: {
    href: "/experience/chartcreator",
    label: { en: "Explore ChartCreator", zh: "查看 ChartCreator" },
  },
  codeAndPower: {
    href: "/projects/codeandpower",
    label: { en: "Explore Code and Power", zh: "查看 Code and Power" },
  },
  skills: {
    href: "/#skills",
    label: { en: "View my capabilities", zh: "查看能力图谱" },
  },
  global: {
    href: "/#global",
    label: { en: "View global perspective", zh: "查看全球视野" },
  },
  music: {
    href: "/#music",
    label: { en: "View music and interests", zh: "查看音乐与兴趣" },
  },
  philosophy: {
    href: "/#philosophy",
    label: { en: "View how I think", zh: "查看我的思维方式" },
  },
  contact: {
    href: "/#contact",
    label: { en: "View contact details", zh: "查看联系方式" },
  },
};

const DESTINATION_BY_INTENT: Record<string, DestinationKey> = {
  intro: "about",
  education: "university",
  majors: "university",
  "why-majors": "university",
  courses: "university",
  location: "university",
  "experience-overview": "experience",
  "projects-overview": "experience",
  "experience-timeline": "experience",
  alibaba: "alibaba",
  "alibaba-view": "alibaba",
  "alibaba-learning": "alibaba",
  "alibaba-causal": "alibaba",
  "alibaba-agent": "alibaba",
  "alibaba-workbench": "alibaba",
  "alibaba-gpu": "alibaba",
  bytedance: "bytedance",
  "bytedance-view": "bytedance",
  "bytedance-learning": "bytedance",
  "bytedance-monetization": "bytedance",
  "roland-berger": "rolandBerger",
  "roland-view": "rolandBerger",
  "roland-learning": "rolandBerger",
  "roland-methods": "rolandBerger",
  "roland-deliverables": "rolandBerger",
  guoyuan: "guoyuan",
  "guoyuan-view": "guoyuan",
  "guoyuan-learning": "guoyuan",
  "guoyuan-methods": "guoyuan",
  chartcreator: "chartCreator",
  "chartcreator-view": "chartCreator",
  "chartcreator-learning": "chartCreator",
  "chartcreator-origin": "chartCreator",
  "chartcreator-process": "chartCreator",
  "vibe-coding": "chartCreator",
  "ai-collaboration": "skills",
  "code-and-power": "codeAndPower",
  "skills-overview": "skills",
  "measurable-results": "experience",
  "data-skills": "skills",
  "strategy-skills": "skills",
  "product-ai-skills": "skills",
  "design-communication": "skills",
  tools: "skills",
  "problem-solving": "philosophy",
  personality: "philosophy",
  global: "global",
  "interests-beyond-music": "global",
  music: "music",
  philosophy: "philosophy",
  opportunities: "contact",
  "role-fit": "contact",
  contact: "contact",
  email: "contact",
  linkedin: "contact",
  resume: "contact",
  language: "about",
  greeting: "about",
  "assistant-identity": "about",
  "assistant-capabilities": "about",
  "quick-summary": "about",
  "where-to-start": "experience",
  "why-hire-me": "skills",
  "proudest-work": "chartCreator",
  "interesting-fact": "music",
  "current-focus": "experience",
  "collaboration-style": "skills",
  thanks: "contact",
  goodbye: "contact",
  "how-are-you": "about",
  "assistant-technology": "about",
  "assistant-privacy": "about",
  "assistant-limits": "about",
  "uw-fit": "university",
  "career-arc": "experience",
  "overall-learning": "experience",
  "experience-compare": "experience",
  "alibaba-segments": "alibaba",
  "alibaba-attribution": "alibaba",
  "bytedance-platforms": "bytedance",
  "bytedance-product": "bytedance",
  "bytedance-output": "bytedance",
  "roland-segments": "rolandBerger",
  "roland-impact": "rolandBerger",
  "guoyuan-thesis": "guoyuan",
  "chartcreator-audience": "chartCreator",
  "chartcreator-stack": "chartCreator",
  "chartcreator-ownership": "chartCreator",
  "code-and-power-ml": "codeAndPower",
  "code-and-power-learning": "codeAndPower",
  "consulting-fit": "skills",
  "product-fit": "skills",
  "analytics-fit": "skills",
  "independent-building": "chartCreator",
  "global-detail": "global",
};

const INTENTS: ProfileChatIntent[] = [
  {
    id: "greeting",
    keywords: ["你好", "您好", "嗨", "哈喽", "在吗", "hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    answer: {
      en: "Hi, nice to meet you. I’m Wuziyang, speaking through this interactive portfolio guide. You can treat this as a conversation rather than a menu — ask naturally about who I am, what I’ve built, where I’ve worked, or what I’m looking for next.",
      zh: "你好，很高兴认识你。我是梓洋，正在通过这个互动向导和你交流。你不必把这里当成菜单，可以像聊天一样自然地问我是谁、做过什么、有哪些项目，或者接下来想寻找什么机会。",
    },
  },
  {
    id: "assistant-identity",
    keywords: ["你是ai吗", "你是机器人吗", "你是真人吗", "你是什么助手", "这是ai吗", "are you ai", "are you a robot", "are you real", "what kind of assistant are you"],
    answer: {
      en: "I’m Wuziyang’s interactive presence inside this portfolio. I answer questions about my experience, skills, and projects using the information on this site, then point you to the most relevant page. Think of me as a conversational guide to my work, not a general-purpose chatbot.",
      zh: "我是梓洋在这份个人网站里的互动分身，会基于站内信息回答关于我的经历、能力和项目，再把你带到最相关的页面。可以把我理解为一个会对话的作品集向导，而不是通用聊天机器人。",
    },
  },
  {
    id: "assistant-capabilities",
    keywords: ["你能做什么", "你会做什么", "能问你什么", "你可以回答什么", "怎么用", "帮助", "帮帮我", "what can you do", "what can i ask", "how can you help", "help", "how do i use this"],
    answer: {
      en: "I can give a quick introduction, explain any experience or project, summarize skills and measurable results, describe how I work with AI, recommend where to start, discuss role fit, and guide you to the exact page or contact channel behind each answer.",
      zh: "我可以快速自我介绍，解释任意一段经历或项目，总结技能与量化成果，说明我如何与 AI 协作，推荐浏览顺序，讨论适合的岗位，并在回答后带你前往对应页面或联系方式。",
    },
  },
  {
    id: "quick-summary",
    keywords: ["一句话介绍", "用一句话介绍自己", "简短介绍", "快速介绍", "30秒介绍", "电梯陈述", "one sentence", "short introduction", "quick intro", "elevator pitch", "summarize yourself"],
    answer: {
      en: "I’m Wuziyang Zhang, a UW–Madison Economics and Information Science student who combines strategy, data, and AI product building to turn complex business questions into measurable decisions and usable systems.",
      zh: "我是张吴梓洋，就读于威斯康星大学麦迪逊分校，主修经济学与信息科学，专注于结合战略、数据与 AI 产品能力，把复杂商业问题转化为可量化的决策和可使用的系统。",
    },
  },
  {
    id: "where-to-start",
    keywords: ["从哪里开始", "先看什么", "推荐看什么", "怎么浏览", "浏览顺序", "先了解什么", "where should i start", "what should i see first", "recommend something", "show me around", "guide me"],
    answer: {
      en: "If you have two minutes, start with my experience timeline, then open Alibaba for analytics and AI agents, Roland Berger for consulting impact, and ChartCreator for end-to-end product building. Together, those three show the range most clearly.",
      zh: "如果只有两分钟，建议先看我的经历时间线，再分别打开阿里经历了解数据分析与 AI Agent、罗兰贝格经历了解咨询影响，以及 ChartCreator 了解端到端产品构建。这三部分最能完整呈现我的能力跨度。",
    },
  },
  {
    id: "why-hire-me",
    keywords: ["为什么选择你", "为什么招你", "为什么雇佣你", "你的竞争力", "你的独特之处", "你和别人有什么不同", "why hire you", "why choose you", "what makes you different", "competitive advantage"],
    answer: {
      en: "My edge is range with follow-through. I can move from market research and quantitative analysis to product structure, communication, and implementation without losing the business question. That lets me connect teams that often speak different languages — strategy, data, design, and technology.",
      zh: "我的差异化在于能力跨度和落地闭环。我能从市场研究与定量分析继续推进到产品结构、表达和实现，同时不丢失最初的业务问题。这让我可以连接战略、数据、设计与技术这些常常使用不同语言的团队。",
    },
  },
  {
    id: "proudest-work",
    keywords: ["最自豪的项目", "最喜欢的项目", "最有代表性的项目", "哪个项目最能代表你", "代表作", "proudest project", "favorite project", "best project", "most representative project"],
    answer: {
      en: "ChartCreator best represents how I like to work. I found a real user pain point, researched the market, designed the product flow and architecture, used AI-assisted development, and moved from idea to a deployed MVP in four weeks.",
      zh: "ChartCreator 最能代表我的工作方式。我从真实用户痛点出发，完成市场调研、产品流程与架构设计，再通过 AI 辅助开发，在四周内把想法推进到可使用的 MVP。",
    },
  },
  {
    id: "interesting-fact",
    keywords: ["有趣的事", "有趣的一面", "冷知识", "说点有意思的", "除了工作", "fun fact", "something interesting", "outside work", "tell me something fun"],
    answer: {
      en: "A useful clue about how I think: I reached Grade 9 in piano, studied music theory, and have traveled across 20+ countries. Music taught me structure and timing; travel taught me that user behavior changes with context. Both show up in how I design products and frame strategy.",
      zh: "一个能解释我思维方式的小线索：我取得过钢琴九级、学习过乐理，也走访了 20 多个国家。音乐让我理解结构与时机，旅行让我看到用户行为会随情境变化——两者都会进入我的产品与战略思考。",
    },
  },
  {
    id: "current-focus",
    keywords: ["最近在做什么", "现在在做什么", "当前关注", "最近关注什么", "目前方向", "what are you working on", "current focus", "what are you doing now", "recent work"],
    answer: {
      en: "My current focus is the overlap of AI products and business analytics: making AI useful inside real workflows, building reusable agent capabilities, and translating analysis into decisions rather than isolated dashboards or reports.",
      zh: "我目前最关注 AI 产品与商业分析的交叉：让 AI 真正进入业务工作流，构建可复用的 Agent 能力，并让分析结果直接支持决策，而不是停留在孤立的看板或报告里。",
    },
  },
  {
    id: "collaboration-style",
    keywords: ["怎么和团队合作", "团队合作方式", "合作风格", "如何沟通", "和你合作是什么感觉", "teamwork", "collaboration style", "how do you work with a team", "communication style"],
    answer: {
      en: "I collaborate by making the problem and decision criteria explicit early, then keeping evidence, ownership, and next steps visible. I’m comfortable translating between business and technical perspectives, and I prefer short feedback loops over long periods of silent work.",
      zh: "我习惯在合作开始时先把问题和决策标准说清楚，再让证据、责任人与下一步保持可见。我能在业务与技术视角之间做翻译，也更偏好短反馈循环，而不是长时间封闭工作后一次性交付。",
    },
  },
  {
    id: "thanks",
    keywords: ["谢谢", "感谢", "明白了", "知道了", "有帮助", "thank you", "thanks", "helpful", "got it", "makes sense"],
    answer: {
      en: "You’re welcome. If something here connects with what you’re building or hiring for, the contact section has the fastest ways to continue the conversation.",
      zh: "不客气。如果这里的经历与你正在做的项目或招聘方向有契合，联系区提供了继续交流的最快方式。",
    },
  },
  {
    id: "goodbye",
    keywords: ["再见", "回头见", "下次聊", "拜拜", "bye", "goodbye", "see you", "talk later"],
    answer: {
      en: "See you. The portfolio will be here whenever you want to explore another project — and you can reach me directly if you’d rather continue the conversation person to person.",
      zh: "再见。想继续了解其他项目时，随时可以回来；如果你更想直接交流，也可以通过联系区找到我。",
    },
  },
  {
    id: "how-are-you",
    keywords: ["你好吗", "最近怎么样", "状态怎么样", "how are you", "how is it going", "whats up", "what's up"],
    answer: {
      en: "I’m doing well — learning, building, and looking for the next problem worth solving. Right now I’m especially energized by work that connects AI capability with a concrete business outcome.",
      zh: "我状态不错，正在持续学习、构建，也在寻找下一个值得解决的问题。目前最让我有动力的，是把 AI 能力与具体业务结果真正连接起来。",
    },
  },
  {
    id: "assistant-technology",
    keywords: ["这个机器人怎么做的", "用了什么模型", "什么模型", "webllm", "本地模型", "技术原理", "机器人技术", "how does this chatbot work", "what model", "local model", "chatbot technology"],
    answer: {
      en: "This assistant combines a structured portfolio knowledge base with a 4-bit Qwen2.5 0.5B model running locally through WebLLM. The knowledge base supplies the facts; the model turns them into a more natural first-person answer and streams it into the conversation.",
      zh: "这个助手把结构化个人知识库与通过 WebLLM 本地运行的 4-bit Qwen2.5 0.5B 模型结合起来。知识库负责提供准确事实，小模型负责把它组织成自然的第一人称回答并流式输出。",
    },
  },
  {
    id: "assistant-privacy",
    keywords: ["隐私", "数据会上传吗", "会发送数据吗", "问题发到哪里", "本地运行", "离线", "privacy", "data transfer", "where does my question go", "runs locally", "on device"],
    answer: {
      en: "My questions are processed on the visitor’s device once the local model is ready; they are not sent to a hosted AI API. The browser downloads and caches the model files, while the portfolio knowledge and generation stay inside the browser session.",
      zh: "本地模型准备好后，你的问题会直接在访问设备上处理，不会发送到托管式 AI API。浏览器只需下载并缓存模型文件，个人知识与生成过程都留在浏览器会话中。",
    },
  },
  {
    id: "assistant-limits",
    keywords: ["你不知道什么", "有什么限制", "能上网吗", "会不会编造", "知识截止", "局限", "limitations", "what can you not do", "can you browse", "hallucinate", "knowledge limits"],
    answer: {
      en: "I’m intentionally limited to information supported by this portfolio. I don’t browse the web, invent missing personal details, or act as a general-purpose assistant; if the knowledge base cannot support an answer, I should say so and guide you to a relevant topic instead.",
      zh: "我的回答范围被有意限制在这份个人网站能够支持的信息内。我不会联网搜索、补写缺失的个人事实，也不是通用助手；知识库无法支持的问题，我会说明不确定并引导你查看相关主题。",
    },
  },
  {
    id: "intro",
    keywords: ["你是谁", "他是谁", "介绍一下你自己", "介绍一下自己", "介绍梓洋", "介绍张吴梓洋", "自我介绍", "个人简介", "关于梓洋", "who is wuziyang", "introduce yourself", "introduce wuziyang", "about him", "personal profile", "personal background"],
    answer: {
      en: "I’m Wuziyang Zhang, a UW–Madison student and builder working where business strategy, data analysis, and AI products meet. I like turning ambiguous questions into structured, usable outcomes — with equal attention to logic and experience.",
      zh: "我是张吴梓洋，就读于威斯康星大学麦迪逊分校，关注商业战略、数据分析与 AI 产品的交叉地带。我擅长把模糊问题拆成清晰结构，并进一步做成可执行、好使用的成果。",
    },
  },
  {
    id: "education",
    keywords: ["教育背景", "你的教育", "你的学校", "哪里读书", "在哪里上学", "什么学校", "威斯康星", "威斯康星大学", "威斯康星大学麦迪逊分校", "介绍威斯康星大学麦迪逊分校", "麦迪逊", "uw", "uw madison", "university of wisconsin madison", "your education", "your university", "where do you study"],
    answer: {
      en: "I study at the University of Wisconsin–Madison, combining Economics with Information Science. The first sharpens how I frame incentives and evidence; the second helps me turn those insights into systems and products.",
      zh: "我就读于威斯康星大学麦迪逊分校，主修经济学与信息科学。经济学训练我理解激励、证据与取舍，信息科学则帮助我把洞察转化为系统和产品。",
    },
  },
  {
    id: "uw-fit",
    keywords: ["为什么选择uw", "为什么选择威斯康星", "为什么去麦迪逊", "学校带给你什么", "威斯康星理念", "wisconsin idea", "why uw madison", "why wisconsin", "why did you choose uw", "university fit"],
    answer: {
      en: "UW–Madison gives me the tension I value: rigorous enough to challenge my reasoning and open enough to build across disciplines. Its Wisconsin Idea — connecting university work with society — also fits how I want research and technology to become useful beyond the classroom.",
      zh: "UW–Madison 提供了我很重视的张力：既足够严谨，持续挑战我的推理方式，也足够开放，让我跨学科构建。学校强调知识服务社会的“威斯康星理念”，也契合我希望研究与技术走出课堂、产生实际价值的方向。",
    },
  },
  {
    id: "majors",
    keywords: ["专业", "你的专业", "介绍你的专业", "主修", "你的主修", "经济学", "信息科学", "双专业", "major", "your major", "majors", "economics", "information science", "cdis"],
    answer: {
      en: "My two majors are Economics and Information Science. My coursework and interests span econometrics, industrial organization, data systems, human-computer interaction, AI, and information architecture.",
      zh: "我的两个主修专业是经济学与信息科学，学习和关注方向包括计量经济学、产业组织、数据系统、人机交互、AI 与信息架构。",
    },
  },
  {
    id: "why-majors",
    keywords: ["为什么选这两个专业", "为什么选择这两个专业", "为什么选经济学和信息科学", "为什么学经济学", "为什么学信息科学", "专业组合", "双专业原因", "why these majors", "why economics", "why information science", "combine majors"],
    answer: {
      en: "I chose the combination deliberately. Economics trained me to frame incentives, evidence, and trade-offs; Information Science gave me the systems vocabulary to turn those insights into products. Together, they let me move from diagnosing a problem to building a response.",
      zh: "我有意识地选择了这个专业组合。经济学训练我理解激励、证据与取舍，信息科学则给我把洞察转化为产品的系统语言。两者结合，让我能从诊断问题继续走到构建解决方案。",
    },
  },
  {
    id: "courses",
    keywords: ["学过什么课", "课程", "核心课程", "喜欢的课程", "coursework", "courses", "classes", "what does he study", "what do you study"],
    answer: {
      en: "My coursework includes microeconomic theory, econometrics, industrial organization, behavioral and financial economics, information systems, human-computer interaction, data and algorithms, AI for information problems, and information architecture.",
      zh: "我的课程包括微观经济学理论、计量经济学、产业组织、行为与金融经济学，以及信息系统、人机交互、数据与算法、AI 信息应用和信息架构。",
    },
  },
  {
    id: "location",
    keywords: ["在哪里", "所在地", "哪个城市", "location", "where does he live", "based", "madison", "wisconsin"],
    answer: {
      en: "I’m currently based in Madison, Wisconsin, where I study at UW–Madison.",
      zh: "我目前在美国威斯康星州麦迪逊市学习与生活，就读于 UW–Madison。",
    },
  },
  {
    id: "experience-overview",
    keywords: ["工作经历", "实习经历", "经历概览", "做过什么", "所有经历", "experience", "work history", "internships", "career history", "where has he worked"],
    answer: {
      en: "My selected experience spans Alibaba International, ByteDance, Roland Berger, and Guoyuan Securities, plus building ChartCreator. The common thread is using research, data, and product thinking to turn complex business questions into decisions or working systems.",
      zh: "我的代表经历包括阿里国际、字节跳动、罗兰贝格、国元证券，以及独立构建 ChartCreator。共同主线是用研究、数据与产品思维，把复杂商业问题转化为决策依据或可运行的系统。",
    },
  },
  {
    id: "projects-overview",
    keywords: ["你的项目", "做过哪些项目", "项目概览", "项目经历", "介绍你的项目", "有哪些项目", "your projects", "project overview", "what projects have you built", "tell me about your projects"],
    answer: {
      en: "My two clearest independent projects are ChartCreator, an AI-assisted visualization product I took from research to a deployed MVP, and Code and Power, an educational site examining implicit bias and equity in digital systems. My internships also included project-based work in logistics analytics, platform strategy, user growth, and financial research.",
      zh: "我最具代表性的两个独立项目是 ChartCreator——一款从调研推进到 MVP 上线的 AI 数据可视化产品，以及 Code and Power——一个讨论数字系统中隐性偏见与公平议题的教育网站。除此之外，我的实习也覆盖物流分析、平台战略、用户增长与金融研究等项目型工作。",
    },
  },
  {
    id: "experience-timeline",
    keywords: ["经历顺序", "实习时间", "工作时间线", "哪年实习", "先后顺序", "timeline", "when did you work", "internship dates", "experience order"],
    answer: {
      en: "My selected timeline runs from Guoyuan Securities in summer 2024, Roland Berger in May–August 2025, ChartCreator from August 2025 to April 2026, ByteDance from December 2025 to February 2026, and Alibaba International from May to August 2026.",
      zh: "我的代表经历时间线是：2024 年暑期国元证券，2025 年 5–8 月罗兰贝格，2025 年 8 月至 2026 年 4 月构建 ChartCreator，2025 年 12 月至 2026 年 2 月字节跳动，以及 2026 年 5–8 月阿里国际。",
    },
  },
  {
    id: "career-arc",
    keywords: ["经历主线", "职业路径", "经历之间有什么联系", "为什么跨度这么大", "从金融到咨询到科技", "成长路径", "career arc", "career path", "connect your experiences", "finance consulting technology"],
    answer: {
      en: "My path moves from financial research at Guoyuan, to data-driven consulting at Roland Berger, to platform strategy at ByteDance, and then to AI-enabled business analytics at Alibaba — while ChartCreator gave me direct product ownership. Each step added a layer: evaluate markets, shape decisions, understand platforms, build intelligent workflows, and ship products.",
      zh: "我的路径从国元证券的金融研究，走到罗兰贝格的数据驱动咨询、字节的平台战略，再到阿里的 AI 商业分析；与此同时，ChartCreator 让我获得了直接的产品所有权。每一步都增加了一层能力：判断市场、支持决策、理解平台、构建智能工作流，再把产品真正做出来。",
    },
  },
  {
    id: "overall-learning",
    keywords: ["你学到了什么", "你最大的收获", "总体学到了什么", "这些经历学到了什么", "整体收获", "what have you learned", "biggest overall lesson", "overall takeaway", "what did these experiences teach you"],
    answer: {
      en: "My biggest overall lesson is that analysis creates value only when it enters a real decision or user workflow. Guoyuan built my research discipline; Roland Berger taught me to turn models into client action; ByteDance trained me to judge platforms under uncertainty; Alibaba connected analytics with AI workflows; and ChartCreator gave me end-to-end product ownership. Together, they shaped how I work now: clarify the problem and criteria, use evidence to move forward, and finish with something people can actually use.",
      zh: "总体来说，我最重要的收获是：分析只有进入真实决策或使用场景，才真正产生价值。国元训练了我的研究纪律，罗兰贝格让我把模型转成客户行动，字节让我在不完整信息中判断平台机会，阿里让我把分析连接到 AI 工作流，而 ChartCreator 让我完整承担从问题定义到产品上线。它们共同塑造了我现在的工作方式：先明确问题与标准，再用证据推进，最后交付真正可使用的结果。",
    },
  },
  {
    id: "experience-compare",
    keywords: ["比较这些经历", "这些经历有什么不同", "阿里和罗兰贝格", "字节和阿里", "咨询和科技", "哪段经历最偏战略", "哪段最偏数据", "compare your experiences", "alibaba versus roland berger", "bytedance versus alibaba", "consulting versus tech"],
    answer: {
      en: "The experiences emphasize different parts of the same operating system. Guoyuan is strongest in financial and industry research; Roland Berger in analytical strategy and client-ready systems; ByteDance in platform and competitive strategy; Alibaba in causal analytics and AI agents; ChartCreator in end-to-end product ownership.",
      zh: "这些经历对应同一套能力体系的不同侧面：国元证券更偏金融与行业研究，罗兰贝格更偏定量战略与客户交付，字节更偏平台与竞品战略，阿里更偏因果分析与 AI Agent，而 ChartCreator 最能体现端到端产品所有权。",
    },
  },
  {
    id: "alibaba",
    keywords: ["阿里", "阿里巴巴", "阿里国际", "alibaba", "aliexpress", "最新经历", "最近实习", "latest experience", "most recent internship"],
    answer: {
      en: "At Alibaba International, I worked as an AI Business Analytics Intern supporting AliExpress logistics and supply chain. I combined causal analysis, an AI-readable metrics layer, and monitoring agents to quantify delivery improvements and speed up exception diagnosis.",
      zh: "在阿里国际，我担任 AI 商业分析实习生，支持 AliExpress 物流与供应链业务。我把因果分析、AI 可读指标库和异常监测 Agent 结合起来，用于量化履约改善价值并加快异常定位。",
    },
  },
  {
    id: "alibaba-view",
    keywords: ["怎么看阿里", "觉得阿里怎么样", "阿里印象", "阿里工作体验", "what do you think of alibaba", "alibaba impression", "how was alibaba"],
    answer: {
      en: "Based on my experience with Alibaba International’s logistics and supply-chain team, my strongest impression is that analysis is expected to move quickly into an operating workflow. I liked that causal analysis, a metrics layer, and AI agents could be connected rather than treated as separate experiments. That view comes from one specific team and project, so I would not generalize it to every part of Alibaba.",
      zh: "基于我在阿里国际物流与供应链团队的经历，我最直接的感受是：分析需要很快进入真实业务工作流。我很喜欢因果分析、指标语义层与 AI Agent 可以被串成一套可复用能力，而不是彼此割裂的实验。当然，这只是我基于具体团队和项目形成的观察，不能代表阿里的所有业务。",
    },
  },
  {
    id: "alibaba-learning",
    keywords: ["在阿里学到了什么", "阿里收获", "阿里最大的挑战", "阿里反思", "what did you learn at alibaba", "alibaba takeaway", "alibaba challenge"],
    answer: {
      en: "Alibaba taught me that a strong analysis is only the beginning: the real value appears when definitions, data lineage, diagnosis, and deployment become reusable by a team. I also learned to translate between business constraints, causal methods, and AI tooling without losing the decision the work was meant to support.",
      zh: "阿里让我更明确地认识到，一次高质量分析只是起点；只有把指标定义、数据血缘、异常诊断与部署流程沉淀成团队可复用的能力，价值才真正持续。我也学会了在业务约束、因果方法与 AI 工具之间做翻译，同时始终不丢失分析需要支持的决策。",
    },
  },
  {
    id: "alibaba-causal",
    keywords: ["gmv", "gps", "did", "因果", "履约时效", "妥投", "10天", "十天", "阿里分析", "delivery analysis", "causal analysis", "fulfilment"],
    answer: {
      en: "For Alibaba’s US cross-border users, I designed a three-window cohort study and used Generalized Propensity Score with Difference-in-Differences. The analysis identified an approximately 10-day tolerance threshold and quantified a potential monthly GMV opportunity of about $1.265M from faster delivery.",
      zh: "在阿里的美国跨境用户分析中，我设计三窗口队列实验，并结合广义倾向得分（GPS）与双重差分（DID）。研究识别出约 10 天的履约容忍阈值，并测算提速可带来约 126.5 万美元的月度 GMV 增益空间。",
    },
  },
  {
    id: "alibaba-agent",
    keywords: ["物流agent", "物流智能体", "物流异常", "物流异常怎么监测", "怎么监测", "异常监测", "异常定位", "指标库", "语义层", "血缘", "agent", "metrics library", "logistics sentinel", "monitoring", "lineage", "yaml"],
    answer: {
      en: "I built an AI-readable logistics metrics layer in Markdown and YAML, plus reusable workflows for definition extraction and SQL lineage. My daily sentinel monitored six fulfilment stages and supported country → route → carrier drill-down, bringing root-cause diagnosis to roughly 30 seconds.",
      zh: "我用 Markdown 与 YAML 搭建 AI 可读的物流指标语义层，并制作指标抽取与 SQL 血缘追踪流程。每日监测 Agent 覆盖六段履约，可从国家下钻到线路与承运商，将根因定位缩短至约 30 秒。",
    },
  },
  {
    id: "alibaba-workbench",
    keywords: ["ai应用台", "workbench", "操作指南", "灰度上线", "odps连接", "团队赋能", "部署分析", "deployment guide"],
    answer: {
      en: "I wrote an AI Workbench operations guide covering repository setup, ODPS connectivity, dependency installation, debugging, and grey-release deployment. The goal was to help the team turn one-off analyses into reusable, maintainable capabilities.",
      zh: "我编写了《AI 应用台操作指南》，覆盖代码建仓、ODPS 数据源连接、依赖安装、调试与灰度上线，目标是帮助团队把一次性分析沉淀为可复用、可维护的能力。",
    },
  },
  {
    id: "alibaba-gpu",
    keywords: ["gpu", "cuopt", "qwen", "车辆路径", "路径规划", "vrp", "nvidia", "route optimization", "vehicle routing"],
    answer: {
      en: "I deployed and tested NVIDIA cuOpt with Qwen2.5-7B for vehicle-routing optimization. My role was to translate business constraints into solver-ready models and then turn GPU outputs back into decision-oriented explanations.",
      zh: "我使用 Qwen2.5-7B 配合 NVIDIA cuOpt 开展车辆路径规划实验，把业务约束转化为可求解模型，再将 GPU 计算结果还原为面向决策的业务解释。",
    },
  },
  {
    id: "alibaba-segments",
    keywords: ["阿里用户分层", "高价值用户", "83%", "用户价值", "哪些用户受影响", "alibaba user segments", "high value users", "83 percent", "who drove the gmv opportunity"],
    answer: {
      en: "The delivery analysis showed that high- and ultra-high-value users were most sensitive once delivery passed the roughly 10-day tolerance threshold. In the modeled opportunity from shortening delivery above 12 days to 10 days, about 83% of the potential GMV gain came from high-value segments.",
      zh: "履约分析显示，超过约 10 天容忍阈值后，高价值与超高价值用户的 GMV 损失最明显。在把 12 天以上妥投时长缩短到 10 天的机会测算中，约 83% 的潜在 GMV 增益来自高价值用户群体。",
    },
  },
  {
    id: "alibaba-attribution",
    keywords: ["外部归因", "港口关闭", "罢工", "航空管制", "为什么物流异常", "事件归因", "external attribution", "port closure", "strike", "aviation control", "logistics external cause"],
    answer: {
      en: "I extended the logistics agent with bilingual web attribution. It matched the geography and timing of an anomaly against external events such as port closures, strikes, and aviation controls, giving operators a faster way to distinguish internal performance issues from outside disruption.",
      zh: "我为物流 Agent 扩展了中英双语外部归因能力，通过异常发生的地理位置与时间匹配港口关闭、罢工、航空管制等事件，帮助运营人员更快区分内部履约问题与外部扰动。",
    },
  },
  {
    id: "bytedance",
    keywords: ["字节", "字节跳动", "bytedance", "小游戏", "mini game", "minigame", "海外游戏"],
    answer: {
      en: "At ByteDance, I worked on overseas mini-game strategy. I mapped the 2018–2025 market, compared 10+ platforms, analyzed IAA, IAP, and hybrid monetization, and contributed to a 100+ page industry report used in internal strategy discussions.",
      zh: "在字节跳动，我参与海外小游戏战略研究，梳理 2018–2025 年市场，对比 10+ 国内外平台，分析 IAA、IAP 与混合变现模式，并参与产出 100+ 页行业研究报告。",
    },
  },
  {
    id: "bytedance-view",
    keywords: ["怎么看字节", "觉得字节怎么样", "字节印象", "字节工作体验", "what do you think of bytedance", "bytedance impression", "how was bytedance"],
    answer: {
      en: "From the overseas mini-game strategy project, I saw ByteDance as a place where product structure, platform economics, and market timing have to be considered together. The work was intellectually demanding because the market was still forming, so the team needed to build a decision framework from incomplete signals rather than apply a settled playbook. This is my project-level impression, not a claim about every ByteDance team.",
      zh: "从海外小游戏战略项目来看，我对字节最深的印象是，产品结构、平台经济与市场时机必须放在一起判断。由于市场仍在形成，工作难点不是套用成熟框架，而是从不完整信号中搭建可供决策的结构。这个感受来自我参与的具体项目，并不代表字节所有团队。",
    },
  },
  {
    id: "bytedance-learning",
    keywords: ["在字节学到了什么", "字节收获", "字节最大的挑战", "字节反思", "what did you learn at bytedance", "bytedance takeaway", "bytedance challenge"],
    answer: {
      en: "ByteDance strengthened my ability to reason about a platform before the market has fully stabilized. I learned to connect traffic entry points, developer incentives, monetization, and content supply into one system, then turn broad research into a decision-ready point of view.",
      zh: "字节的经历提升了我在市场尚未稳定时判断平台机会的能力。我学会了把流量入口、开发者激励、变现方式与内容供给放进同一个系统分析，再把广泛研究收敛为可供决策的观点。",
    },
  },
  {
    id: "bytedance-monetization",
    keywords: ["小游戏怎么赚钱", "变现模式", "iaa", "iap", "混变", "游戏商业模式", "monetization", "mini-game business model", "hybrid monetization"],
    answer: {
      en: "In my ByteDance research, I compared three core mini-game monetization models: IAA through advertising, IAP through in-game purchases, and hybrid models combining both. I used them as part of a wider framework for evaluating platform positioning and supply efficiency.",
      zh: "在字节跳动的研究中，我重点比较了三类小游戏变现模式：广告驱动的 IAA、内购驱动的 IAP，以及二者结合的混合模式，并把它们纳入平台定位与内容供给效率的评估框架。",
    },
  },
  {
    id: "bytedance-platforms",
    keywords: ["字节研究了哪些平台", "小游戏竞品", "微信快手facebook", "telegram小游戏", "kwai", "平台对比", "which platforms", "mini-game competitors", "wechat kuaishou facebook telegram", "platform benchmarking"],
    answer: {
      en: "I benchmarked more than ten mini-game platforms across China and international markets, including WeChat, Kuaishou, Facebook, Telegram, and Kwai. I compared traffic entry points, revenue-sharing mechanisms, developer policies, and how each platform tried to improve content supply.",
      zh: "我对比了 10 多个国内外小游戏平台，包括微信、快手、Facebook、Telegram 与 Kwai，重点比较流量入口、分成机制、开发者政策，以及各平台提升内容供给效率的方式。",
    },
  },
  {
    id: "bytedance-product",
    keywords: ["字节产品分析", "接入路径", "功能入口", "转化效率", "内容分发", "产品优化", "bytedance product analysis", "onboarding path", "entry point design", "content distribution"],
    answer: {
      en: "Beyond market sizing, I examined platform architecture and onboarding paths from a product perspective. I evaluated how entry-point design affected conversion and content distribution, then extracted opportunities to reduce friction and shorten the path from developer supply to user reach.",
      zh: "除市场研究外，我还从产品视角分析平台功能结构与接入路径，评估入口设计对转化效率和内容分发的影响，并提炼出降低门槛、缩短开发者供给到用户触达路径的优化机会。",
    },
  },
  {
    id: "bytedance-output",
    keywords: ["字节产出", "100页报告", "百页报告", "行业报告内容", "内部策略", "bytedance deliverable", "100 page report", "industry report output", "strategy material"],
    answer: {
      en: "The main output was a 100+ page overseas mini-game industry report, supported by additional thematic briefs. The work became foundational research for internal discussion about ByteDance’s overseas mini-game direction during an active strategy-formation stage.",
      zh: "主要成果是一份 100+ 页的海外小游戏行业研究报告，以及多份专题材料。在业务仍处于战略形成阶段时，这些内容成为字节内部讨论海外小游戏方向的基础研究。",
    },
  },
  {
    id: "roland-berger",
    keywords: ["罗兰贝格", "东风本田", "koc", "roland berger", "honda", "consulting", "咨询经历"],
    answer: {
      en: "At Roland Berger, I supported Dongfeng Honda’s KOC user-growth strategy. I processed three years of operating data, built regression and random-forest models with R² = 0.86, clustered 500+ user profiles, and helped drive a 27% increase in UGC output the following month.",
      zh: "在罗兰贝格，我参与东风本田 KOC 用户增长项目，处理三年运营数据，构建回归与随机森林模型（R² = 0.86），聚类 500+ 用户画像，并支持次月 UGC 产出提升 27%。",
    },
  },
  {
    id: "roland-view",
    keywords: ["怎么看罗兰贝格", "觉得罗兰贝格怎么样", "罗兰贝格印象", "罗兰贝格工作体验", "what do you think of roland berger", "roland berger impression", "how was roland berger"],
    answer: {
      en: "Based on the Dongfeng Honda project, my impression of Roland Berger is that rigorous analysis matters most when it becomes something a client can actually operate. I liked the combination of modeling, user segmentation, and client-ready systems rather than analysis that ends with a slide or a model. That is a personal view formed through one engagement, not a blanket judgment about the whole firm.",
      zh: "基于东风本田项目，我对罗兰贝格最直接的印象是：严谨分析最终要变成客户真正能执行的东西。我很喜欢模型、用户分群与客户运营体系被连在一起，而不是让分析停在一页汇报或一个模型上。当然，这是我通过一个具体项目形成的个人感受，不是对整家公司的笼统判断。",
    },
  },
  {
    id: "roland-learning",
    keywords: ["在罗兰贝格学到了什么", "罗兰贝格收获", "罗兰贝格最大的挑战", "罗兰贝格反思", "what did you learn at roland berger", "roland berger takeaway", "roland berger challenge"],
    answer: {
      en: "Roland Berger taught me to carry quantitative work all the way from evidence to client adoption. The important lesson was not just how to build a model, but how to turn its output into differentiated actions, clear materials, and a repeatable operating system.",
      zh: "罗兰贝格让我学会把定量工作从证据一直推进到客户采纳。最大的收获不只是如何建模，而是如何把模型结果转化为差异化行动、清晰的交付材料，以及可以持续执行的运营体系。",
    },
  },
  {
    id: "roland-methods",
    keywords: ["罗兰贝格用了什么模型", "东风本田模型", "随机森林", "kmeans", "k-means", "回归模型", "r平方", "r2", "roland berger methods"],
    answer: {
      en: "I used pandas and NumPy for cleaning, multiple regression and random forest for forecasting, and K-Means for segmenting 500+ users and content types. The forecasting model reached R² = 0.86, while clustering surfaced three actionable KOC segments.",
      zh: "我使用 pandas 与 NumPy 清洗数据，以多元回归和随机森林进行预测，并通过 K-Means 对 500+ 用户及内容类型做分群。预测模型达到 R² = 0.86，聚类则识别出三类可落地的 KOC 人群。",
    },
  },
  {
    id: "roland-deliverables",
    keywords: ["罗兰贝格产出", "97页", "运营体系", "体系文件", "客户交付", "consulting deliverables", "97 pages", "operation manual"],
    answer: {
      en: "Beyond the analysis, I helped translate the project into a 97-page Dongfeng Honda KOC digital-operation system and a 15-page Word operating guide. The point was to make the strategy trainable and repeatable after the consulting engagement ended.",
      zh: "除分析外，我还参与把项目沉淀为 97 页东风本田 KOC 数字化运营体系文件和 15 页 Word 操作指南，让策略在咨询项目结束后仍能被培训、复用与持续执行。",
    },
  },
  {
    id: "roland-segments",
    keywords: ["三类koc", "koc分群", "美图种草", "日常分享", "用车心得", "钻石模型", "three koc segments", "koc clustering", "diamond model", "aesthetic seeding"],
    answer: {
      en: "K-Means clustering separated more than 500 KOC profiles and content types into three actionable groups: Aesthetic Seeding, Daily Sharing, and Usage Insights. I then combined those segments with the Diamond Model and regression results to support differentiated strategies by vehicle type, region, and KOC level.",
      zh: "K-Means 将 500+ KOC 用户画像与内容类型识别为“美图种草”“日常分享”“用车心得”三类人群。我再结合钻石模型与回归结果，支持按车型、地区和 KOC 层级制定差异化策略。",
    },
  },
  {
    id: "roland-impact",
    keywords: ["罗兰贝格产生了什么影响", "ugc为什么提升", "27%怎么来的", "客户采纳", "咨询项目效果", "roland berger impact", "27 percent ugc", "client adoption", "consulting outcome"],
    answer: {
      en: "The analysis moved into operating decisions rather than stopping at a model. Forecasting informed quarterly targets and resource allocation, the client adopted the analytical presentation materials, and the differentiated KOC strategy was followed by a 27% increase in UGC output the next month.",
      zh: "这项分析没有停留在模型层面：预测结果进入季度目标与资源配置，相关汇报材料被客户采纳，差异化 KOC 策略落地后，次月 UGC 产出提升了 27%。",
    },
  },
  {
    id: "guoyuan",
    keywords: ["国元", "国元证券", "白酒", "茅台", "五粮液", "汾酒", "guoyuan", "securities", "baijiu", "financial research"],
    answer: {
      en: "At Guoyuan Securities, I researched China’s baijiu sector, covering 15+ listed consumer companies. I built financial indicator databases, used DCF and PE valuation, and independently wrote a 2024 mid-year strategy report whose sections entered the team’s portfolio discussion.",
      zh: "在国元证券，我研究白酒板块，覆盖 15+ 家消费品上市公司，搭建财务指标数据库并使用 DCF 与 PE 估值。我独立完成的 2024 年中策略报告有部分内容被纳入团队组合策略讨论。",
    },
  },
  {
    id: "guoyuan-view",
    keywords: ["怎么看国元", "觉得国元怎么样", "国元证券印象", "国元工作体验", "what do you think of guoyuan", "guoyuan impression", "how was guoyuan"],
    answer: {
      en: "My Guoyuan experience showed me the discipline of forming a view only after financial, channel, policy, and demand signals have been checked against one another. I valued that research was expected to end in an explicit investment thesis, not a collection of disconnected facts. This impression is based on my consumer-research work rather than the entire firm.",
      zh: "国元的经历让我感受到，研究判断需要在财务、渠道、政策与需求信号之间反复交叉验证。我很认同研究最终必须收敛成明确投资观点，而不是停留在互不相连的信息堆积上。这个感受主要来自我所在的消费研究工作，并不能概括整家公司。",
    },
  },
  {
    id: "guoyuan-learning",
    keywords: ["在国元学到了什么", "国元收获", "国元最大的挑战", "国元反思", "what did you learn at guoyuan", "guoyuan takeaway", "guoyuan challenge"],
    answer: {
      en: "Guoyuan taught me to separate evidence, assumptions, and valuation judgments. Building the database and writing an independent sector report trained me to move from scattered company information to a defensible thesis with clear upside, risk, and timing logic.",
      zh: "国元让我学会区分证据、假设与估值判断。搭建数据库并独立撰写行业报告的过程，训练我把分散的公司信息收敛成一套能够自证、同时说明机会、风险与时点逻辑的观点。",
    },
  },
  {
    id: "guoyuan-methods",
    keywords: ["国元怎么研究", "白酒估值", "dcf", "pe估值", "wind", "ifind", "财务建模", "baijiu valuation", "guoyuan methods"],
    answer: {
      en: "I combined Wind, iFind, company filings, time-series comparisons, and channel data to track the baijiu sector. I then used DCF and PE valuation alongside PESTEL analysis to connect company fundamentals with policy, demand, and channel dynamics.",
      zh: "我结合 Wind、iFind、公司财报、时间序列对比与渠道数据跟踪白酒行业，再使用 DCF、PE 估值和 PESTEL 分析，把公司基本面与政策、需求及渠道变化联系起来。",
    },
  },
  {
    id: "guoyuan-thesis",
    keywords: ["国元投资观点", "白酒观点", "高端稳增长", "次高端修复", "年中策略报告", "baijiu thesis", "investment thesis", "premium growth", "mid-year strategy report"],
    answer: {
      en: "My independent 2024 mid-year baijiu report argued for steady growth in premium brands and a structural recovery in the sub-premium segment. Selected sections were incorporated into the team’s quarterly portfolio-strategy discussion.",
      zh: "我在独立完成的 2024 年白酒板块中期策略报告中提出“高端稳增长、次高端结构性修复”的判断，其中部分内容被纳入团队季度组合策略讨论。",
    },
  },
  {
    id: "chartcreator",
    keywords: ["chartcreator", "图表项目", "图表产品", "数据可视化平台", "可视化项目", "ai chart", "visualization product", "flagship project"],
    answer: {
      en: "ChartCreator is my AI-powered data-visualization product for non-technical users who need polished, presentation-ready charts. I designed the Upload → AI Recommend → Customize → Export flow and built the MVP from research to deployed interface in four weeks.",
      zh: "ChartCreator 是我面向非技术用户打造的 AI 数据可视化产品，目标是快速生成可直接用于汇报的精美图表。我设计了“上传 → AI 推荐 → 自定义 → 导出”的完整流程，并在四周内从调研推进到 MVP 上线。",
    },
  },
  {
    id: "chartcreator-view",
    keywords: ["怎么看chartcreator", "觉得chartcreator怎么样", "喜欢chartcreator吗", "chartcreator评价", "what do you think of chartcreator", "chartcreator opinion", "how do you feel about chartcreator"],
    answer: {
      en: "ChartCreator is the project I feel most personally attached to because it tested the full loop from identifying a real pain point to shipping a usable product. I am proud of the speed and ownership behind the four-week MVP, while also seeing it as an evolving product whose value depends on continued user feedback rather than the first release alone.",
      zh: "ChartCreator 是我个人投入感最强的项目，因为它完整检验了从发现真实痛点到交付可用产品的全过程。我对四周完成 MVP 的速度与端到端所有权很自豪，但也把它看作一个仍需持续通过用户反馈迭代的产品，而不是首版上线就已经完成。",
    },
  },
  {
    id: "chartcreator-learning",
    keywords: ["chartcreator学到了什么", "chartcreator收获", "chartcreator最大挑战", "chartcreator反思", "what did you learn from chartcreator", "chartcreator takeaway", "chartcreator challenge"],
    answer: {
      en: "ChartCreator taught me that speed comes from making product decisions explicit, not from skipping them. Defining the user, flow, architecture, and acceptance criteria first made AI-assisted development much more effective, while real feedback kept the build anchored to a user problem.",
      zh: "ChartCreator 让我认识到，速度来自把产品决策说清楚，而不是跳过这些决策。先明确用户、流程、架构与验收标准，AI 辅助开发才真正高效；真实反馈则确保构建过程始终围绕用户问题，而不是围绕技术本身。",
    },
  },
  {
    id: "chartcreator-origin",
    keywords: ["为什么做chartcreator", "chartcreator起源", "chartcreator解决什么问题", "chartcreator有什么用", "解决什么问题", "产品痛点", "why chartcreator", "what problem does chartcreator solve", "problem it solves", "product origin", "user pain point"],
    answer: {
      en: "I started ChartCreator after seeing non-technical professionals spend too much time fighting chart formatting instead of interpreting data. The product is designed to reduce that friction and produce polished, presentation-ready output quickly.",
      zh: "我做 ChartCreator，是因为看到许多非技术用户把大量时间耗在图表样式调整上，而不是数据洞察本身。这个产品希望降低操作摩擦，更快产出可直接用于汇报的精美图表。",
    },
  },
  {
    id: "chartcreator-process",
    keywords: ["chartcreator怎么做的", "产品流程", "用户调研", "竞品分析", "figma", "产品设计过程", "how did you build chartcreator", "product process", "user flow"],
    answer: {
      en: "I began with competitor analysis of Graphy, Canva, and Graphmaker, then interviewed people in consulting, finance, and sales. I mapped the system in Visio, prototyped in Figma, defined interface logic with the backend, and iterated toward the four-step user flow.",
      zh: "我先分析 Graphy、Canva、Graphmaker 等竞品，再访谈咨询、金融和销售从业者；随后用 Visio 梳理系统逻辑、用 Figma 制作原型，与后端明确接口，再围绕四步用户流程持续迭代。",
    },
  },
  {
    id: "chartcreator-audience",
    keywords: ["chartcreator给谁用", "目标用户", "谁需要chartcreator", "咨询金融销售", "非技术用户", "target users", "who is chartcreator for", "consulting finance sales", "nontechnical users"],
    answer: {
      en: "ChartCreator is designed for non-technical professionals — especially people in consulting, finance, and sales — who need polished, presentation-ready charts without spending hours on formatting. User interviews highlighted inconsistent formatting, complex tools, and poor export quality as recurring pain points.",
      zh: "ChartCreator 面向需要高质量汇报图表的非技术用户，尤其是咨询、金融与销售从业者。访谈中反复出现的痛点包括格式不一致、工具操作复杂，以及导出质量不理想。",
    },
  },
  {
    id: "chartcreator-stack",
    keywords: ["chartcreator技术栈", "chartcreator用了什么", "nextjs tailwind", "产品架构", "前后端接口", "chartcreator tech stack", "how is chartcreator built", "next.js tailwind", "product architecture"],
    answer: {
      en: "I built the ChartCreator frontend with Next.js and Tailwind CSS, designed prototypes in Figma, mapped system interactions in Visio, and used Claude Code and Codex as the primary development tools. I also defined interface logic and API standards with the backend side of the product.",
      zh: "ChartCreator 前端采用 Next.js 与 Tailwind CSS，原型使用 Figma，系统交互通过 Visio 梳理，并以 Claude Code 与 Codex 作为主要开发工具。我也参与定义了与后端协作所需的接口逻辑和 API 标准。",
    },
  },
  {
    id: "chartcreator-ownership",
    keywords: ["一个人做的吗", "独立开发", "你的职责", "产品所有权", "从0到1", "四周上线", "did you build it alone", "solo builder", "product ownership", "zero to one", "four week mvp"],
    answer: {
      en: "I owned the product from zero to one: user research, competitor analysis, product flow, information architecture, prototyping, interface implementation, and deployment. The MVP reached launch in four weeks, with the frontend produced through a prompt-driven development workflow using Claude Code and Codex.",
      zh: "我承担了从 0 到 1 的完整产品工作，包括用户研究、竞品分析、产品流程、信息架构、原型、界面实现与部署。MVP 在四周内上线，前端通过 Claude Code 与 Codex 驱动的提示词开发流程完成。",
    },
  },
  {
    id: "vibe-coding",
    keywords: ["vibe coding", "氛围编程", "怎么开发", "claude code", "codex", "prompt engineering", "提示词开发", "ai编程"],
    answer: {
      en: "I use a vibe-coding workflow: define the product blueprint and architecture, write structured prompts, review the generated implementation, then iterate against real product behavior. I built ChartCreator with Claude Code and Codex as my core development tools.",
      zh: "我的 Vibe Coding 流程是先明确产品蓝图与架构，再通过结构化 Prompt 生成实现、审查结果，并围绕真实产品表现持续迭代。ChartCreator 主要使用 Claude Code 与 Codex 完成开发。",
    },
  },
  {
    id: "ai-collaboration",
    keywords: ["怎么和ai合作", "如何使用ai", "ai协作", "人机分工", "用ai做什么", "work with ai", "ai collaboration", "human ai", "how do you use ai"],
    answer: {
      en: "I use AI as a structured collaborator, not a substitute for judgment. I define the problem, constraints, and acceptance criteria; AI accelerates research, coding, and iteration; then I verify the logic, test the output, and make the final product decisions.",
      zh: "我把 AI 当作结构化协作者，而不是判断力的替代品。我负责定义问题、约束和验收标准，AI 加速研究、编码与迭代；最后由我核验逻辑、测试结果并做产品决策。",
    },
  },
  {
    id: "code-and-power",
    keywords: ["code and power", "科技伦理", "隐性偏见", "intersectionality", "implicit bias", "academic project", "学术项目"],
    answer: {
      en: "Code and Power is an educational website about implicit bias, intersectionality, and equity in digital systems. I built it with Matt Steines using HTML/CSS, with resources and a Tech Hero profile that encourage more equitable design thinking.",
      zh: "Code and Power 是一个讨论数字系统中隐性偏见、交叉性与公平议题的教育网站。我与 Matt Steines 使用 HTML/CSS 合作完成，并通过教育资源与人物专题倡导更公平的设计思维。",
    },
  },
  {
    id: "code-and-power-ml",
    keywords: ["code and power机器学习", "羊驼和獾", "548张", "teachable machine", "mobilenet", "图像分类", "coded gaze", "image classifier", "alpaca badger", "548 photos", "transfer learning"],
    answer: {
      en: "For Code and Power, I trained a four-class image classifier with Google Teachable Machine, TensorFlow.js, and MobileNet transfer learning using more than 548 self-photographed images of two alpacas and two badgers. The model exposed shortcut learning: it relied on size and camera distance instead of robust animal features, connecting directly to the project’s lesson about biased or incomplete training data.",
      zh: "在 Code and Power 中，我使用 Google Teachable Machine、TensorFlow.js 与 MobileNet 迁移学习训练了一个四分类图像模型，数据来自 548 张以上自拍的两只羊驼和两只獾。模型暴露了“捷径学习”问题：它依赖物体大小与拍摄距离，而非稳定的动物特征，这也直接对应训练数据偏差与遗漏的主题。",
    },
  },
  {
    id: "code-and-power-learning",
    keywords: ["code and power学到了什么", "项目收获", "交叉性设计", "技术偏见", "公平设计", "what did you learn from code and power", "project learning", "intersectional design", "technology bias"],
    answer: {
      en: "The project taught me that framing is itself a design decision, inclusion is an engineering constraint rather than an afterthought, and simplifying an idea for a general audience is harder than writing for experts. It also made the relationship between training-data omissions and real product failures tangible.",
      zh: "这个项目让我更明确地认识到：问题框架本身就是设计决策，包容性应当是工程约束而非事后补充，而面向普通读者准确地化繁为简，往往比面向专家写作更难。它也让我直观看到训练数据的遗漏如何转化为真实的产品失效。",
    },
  },
  {
    id: "skills-overview",
    keywords: ["擅长什么", "能力", "技能", "优势", "核心能力", "strongest skills", "skills", "capabilities", "strengths", "good at"],
    answer: {
      en: "My strongest combination is strategy + data + product execution. I can research a market, structure an ambiguous problem, analyze it with quantitative tools, and translate the result into a clear report, workflow, prototype, or working product.",
      zh: "我最突出的能力组合是“战略 + 数据 + 产品落地”：既能研究市场、框架化模糊问题，也能用定量工具分析，并把结论转化为清晰报告、工作流、原型或可运行产品。",
    },
  },
  {
    id: "measurable-results",
    keywords: ["代表成果", "量化成果", "有什么成绩", "关键数据", "最有影响的结果", "biggest results", "measurable impact", "key achievements", "metrics"],
    answer: {
      en: "A few measurable outcomes: about $1.265M in monthly GMV opportunity quantified at Alibaba; root-cause drill-down reduced to roughly 30 seconds; R² = 0.86 and a 27% UGC lift in the Roland Berger project; a 100+ page ByteDance report; and a four-week MVP launch for ChartCreator.",
      zh: "几项可量化成果包括：在阿里测算约 126.5 万美元月度 GMV 增益空间，将异常根因下钻缩短至约 30 秒；罗兰贝格项目模型 R² = 0.86、次月 UGC 提升 27%；参与字节 100+ 页报告；ChartCreator 四周完成 MVP 上线。",
    },
  },
  {
    id: "data-skills",
    keywords: ["数据分析", "数据能力", "数据工具", "哪些数据工具", "会哪些数据工具", "python", "sql", "stata", "excel", "r语言", "data analysis", "data tools", "quantitative", "econometrics"],
    answer: {
      en: "My data toolkit includes Python, R, SQL, Stata, advanced Excel, econometrics, causal analysis, financial modeling, machine learning, and data storytelling. I use the method that best fits the decision rather than treating analysis as an end in itself.",
      zh: "我的数据工具包括 Python、R、SQL、Stata、高级 Excel、计量分析、因果分析、财务建模、机器学习与数据叙事。我更关注方法是否服务于决策，而不是为了分析而分析。",
    },
  },
  {
    id: "strategy-skills",
    keywords: ["战略", "研究能力", "市场研究", "商业分析", "竞品", "行业研究", "strategy", "market research", "business analysis", "competitive analysis", "industry research"],
    answer: {
      en: "My strategy and research work covers market sizing, industry mapping, competitive benchmarking, user segmentation, financial modeling, and executive reporting. I’m especially comfortable turning scattered evidence into a decision-ready structure.",
      zh: "我的战略与研究能力覆盖市场规模判断、行业图谱、竞品分析、用户分层、财务建模与高层汇报，尤其擅长把分散证据整理成可以直接支持决策的结构。",
    },
  },
  {
    id: "product-ai-skills",
    keywords: ["ai产品", "产品能力", "产品经理", "工作流", "product", "ai product", "product strategy", "workflow", "information architecture", "user research"],
    answer: {
      en: "On product and AI, I work across product strategy, user research, information architecture, AI workflow design, prompt engineering, prototyping, and implementation. I care about both the system logic and how the experience feels to use.",
      zh: "在产品与 AI 方向，我覆盖产品战略、用户研究、信息架构、AI 工作流设计、提示词工程、原型与实现。我既关注系统内部逻辑，也重视最终使用体验。",
    },
  },
  {
    id: "design-communication",
    keywords: ["设计能力", "表达能力", "写作", "ppt", "ui", "ux", "沟通", "design", "communication", "presentation", "report writing", "prototype"],
    answer: {
      en: "My design and communication toolkit includes UI/UX thinking, PowerPoint design, report writing, data visualization, prototyping, and cross-cultural communication. My goal is to make complex reasoning feel clear rather than merely look polished.",
      zh: "我的设计与表达能力包括 UI/UX 思维、PPT 设计、报告写作、数据可视化、原型设计与跨文化沟通。我的目标不是只把内容做得好看，而是让复杂逻辑更容易被理解。",
    },
  },
  {
    id: "tools",
    keywords: ["会用什么工具", "会哪些工具", "用过什么工具", "技术栈", "软件", "tools", "tech stack", "technologies", "software"],
    answer: {
      en: "Across my projects I’ve used Python, SQL, R, Stata, Excel, Next.js, Tailwind CSS, Figma, Wind, iFind, ODPS, YAML, Claude Code, Codex, Qwen, and NVIDIA cuOpt — alongside methods such as DID, clustering, regression, and valuation.",
      zh: "我的项目工具包括 Python、SQL、R、Stata、Excel、Next.js、Tailwind CSS、Figma、Wind、iFind、ODPS、YAML、Claude Code、Codex、Qwen 与 NVIDIA cuOpt，也使用 DID、聚类、回归和估值等方法。",
    },
  },
  {
    id: "problem-solving",
    keywords: ["如何工作", "工作方式", "解决问题", "方法论", "思考方式", "how does he work", "problem solving", "approach", "methodology", "working style"],
    answer: {
      en: "My default approach is: find structure in ambiguity, define the decision that matters, gather the right evidence, test assumptions, and turn the conclusion into something others can actually use. I value clarity, speed, and taste in equal measure.",
      zh: "我的默认方法是：先在模糊中找到结构，明确真正需要支持的决策，再收集证据、检验假设，最后把结论做成别人能够直接使用的成果。我同样重视清晰、速度与品味。",
    },
  },
  {
    id: "personality",
    keywords: ["你是怎样的人", "你是一个怎样的人", "怎么看自己", "如何评价自己", "你的性格", "性格特点", "三个词形容自己", "what kind of person are you", "how would you describe yourself", "describe your personality", "your personality"],
    answer: {
      en: "I would describe myself as curious, structured, and strongly oriented toward making things useful. I enjoy finding order in ambiguous problems, but I also care about how the result feels to the person using it. In teams, I tend to make the question and decision criteria explicit, then move through short feedback loops until the work becomes actionable.",
      zh: "我认为自己是一个好奇、重视结构，也很在意结果是否真正有用的人。我喜欢在模糊问题中找到秩序，但同时会关注最终使用者的感受。团队合作中，我通常会先把问题与决策标准说清楚，再通过短反馈循环把事情推进到可执行。",
    },
  },
  {
    id: "global",
    keywords: ["旅行", "去过哪里", "全球视野", "国家", "城市", "travel", "countries", "global perspective", "international", "world"],
    answer: {
      en: "I’ve traveled across 20+ countries. For me, travel is field research: observing how people make decisions, how markets differ, and what users value in unfamiliar contexts. I treat global perspective as a method, not a credential.",
      zh: "我走访过 20 多个国家。对我而言，旅行更像田野研究：观察不同文化中的决策方式、市场差异和用户价值取向。全球视野是一种方法，而不是一项标签。",
    },
  },
  {
    id: "interests-beyond-music",
    keywords: ["还有什么其他爱好", "除了音乐还有什么", "还有别的兴趣吗", "其他兴趣", "别的爱好", "what other interests", "anything besides music", "other hobbies", "what else do you enjoy"],
    answer: {
      en: "Beyond music, travel is another important interest of mine. I’ve visited more than 20 countries and 100 cities across five continents, and I treat those trips as a form of field research — noticing how people make decisions, how markets differ, and what users value in different contexts.",
      zh: "除了音乐，我也很喜欢旅行。我走访过 20 多个国家、100 多座城市，覆盖五大洲；对我来说，旅行也像一种田野研究，让我观察不同文化中的决策方式、市场差异，以及用户在不同情境下真正重视什么。",
    },
  },
  {
    id: "global-detail",
    keywords: ["去过多少地方", "多少国家", "多少城市", "几个大洲", "去过哪些城市", "纽约东京巴黎", "how many countries", "how many cities", "continents", "cities visited", "where have you traveled"],
    answer: {
      en: "I’ve traveled across more than 20 countries, 100 cities, and five continents. The portfolio highlights places including New York, Istanbul, Toronto, Lima, Tokyo, Paris, Singapore, London, Seoul, Berlin, and Machu Picchu in Peru.",
      zh: "我走访过 20 多个国家、100 多座城市，覆盖五大洲。网站中展示或提到的地点包括纽约、伊斯坦布尔、多伦多、利马、东京、巴黎、新加坡、伦敦、首尔、柏林，以及秘鲁马丘比丘。",
    },
  },
  {
    id: "music",
    keywords: ["音乐", "钢琴", "吉他", "葫芦丝", "兴趣爱好", "爱好", "music", "piano", "guitar", "hobby", "interests"],
    answer: {
      en: "Music has shaped how I think about structure and flow. I reached National Grade 9 in piano and Grade 6 in music theory, also play acoustic guitar, and have experience with hulusi. I carry rhythm, restraint, and timing into product and writing.",
      zh: "音乐塑造了我对结构与节奏的理解。我取得全国钢琴九级与乐理六级，也弹木吉他并接触葫芦丝。我会把音乐中的节奏、克制与时机带入产品和写作。",
    },
  },
  {
    id: "philosophy",
    keywords: ["理念", "价值观", "相信什么", "座右铭", "审美", "philosophy", "values", "belief", "taste", "quote"],
    answer: {
      en: "I believe the best work sits where logic meets taste: useful, elegant, and memorable. Technology is most powerful when it becomes intuitive enough to disappear and starts acting as something people think with.",
      zh: "我相信最好的作品位于逻辑与品味的交汇处：有用、优雅，并且令人难忘。技术在足够直觉、几乎消隐时最有力量——它不再只是工具，而成为人思考的一部分。",
    },
  },
  {
    id: "opportunities",
    keywords: ["找工作", "求职", "机会", "实习", "全职", "合作", "open to work", "opportunities", "internship", "full time", "collaboration", "hiring"],
    answer: {
      en: "I’m open to internships, full-time roles, research collaborations, and thoughtful conversations — especially where strategy, analytics, AI products, and global business overlap.",
      zh: "我目前对实习、全职岗位、研究合作和有价值的交流保持开放，尤其关注战略、数据分析、AI 产品与全球商业的交叉方向。",
    },
  },
  {
    id: "role-fit",
    keywords: ["适合什么岗位", "想做什么工作", "职业方向", "求职方向", "目标岗位", "role fit", "ideal role", "career direction", "what role do you want"],
    answer: {
      en: "I’m most interested in roles that combine strategy, analytics, and product execution — such as AI product strategy, business analytics, growth strategy, product management, or technology-focused consulting. I’m especially drawn to work with real ownership and cross-market complexity.",
      zh: "我最关注能结合战略、分析与产品落地的岗位，例如 AI 产品战略、商业分析、增长战略、产品管理或科技方向咨询。我尤其喜欢有真实业务责任、同时涉及跨市场复杂度的工作。",
    },
  },
  {
    id: "consulting-fit",
    keywords: ["适合咨询吗", "为什么适合咨询", "咨询能力", "咨询岗位", "战略咨询匹配", "fit for consulting", "why consulting", "consulting skills", "strategy consulting role"],
    answer: {
      en: "I fit consulting work because I can structure ambiguous questions, combine qualitative research with quantitative evidence, and translate analysis into executive-ready recommendations. Roland Berger shows the full chain: data cleaning, modeling, segmentation, strategy design, client materials, and an operating system the client could continue using.",
      zh: "我适合咨询工作的原因，是能够结构化模糊问题，把定性研究与定量证据结合，再转化为面向决策者的建议。罗兰贝格经历呈现了完整链条：数据清洗、建模、用户分群、策略设计、客户汇报，以及可持续使用的运营体系。",
    },
  },
  {
    id: "product-fit",
    keywords: ["适合产品经理吗", "为什么适合产品", "ai产品岗位", "产品经理能力", "产品经验", "fit for product management", "why product", "ai product role", "product manager skills"],
    answer: {
      en: "My product fit comes from combining user research, information architecture, workflow design, technical collaboration, and hands-on implementation. ChartCreator is the clearest example: I identified the pain point, validated it with users, designed the flow and architecture, and moved the MVP to launch in four weeks.",
      zh: "我的产品能力来自用户研究、信息架构、工作流设计、技术协作与实际实现的结合。ChartCreator 是最清晰的例子：我识别痛点、通过访谈验证需求、设计流程与架构，并在四周内把 MVP 推进上线。",
    },
  },
  {
    id: "analytics-fit",
    keywords: ["适合数据分析吗", "为什么适合商业分析", "商业分析岗位", "数据分析案例", "analytics role", "business analytics fit", "why analytics", "data analyst skills"],
    answer: {
      en: "I bring analytics beyond dashboard production. At Alibaba I used causal methods to quantify a GMV opportunity; at Roland Berger I connected forecasting and clustering to operating strategy; and at Guoyuan I linked financial models with industry and channel evidence. The common goal is a decision, not just a result table.",
      zh: "我的分析能力不止于制作看板。在阿里，我用因果方法量化 GMV 机会；在罗兰贝格，我把预测与聚类连接到运营策略；在国元证券，我把财务模型与行业、渠道证据结合。共同目标都是支持决策，而不只是输出结果表。",
    },
  },
  {
    id: "independent-building",
    keywords: ["独立完成过什么", "自主推动", "主人翁意识", "ownership案例", "从想法到落地", "what did you build independently", "ownership example", "self directed", "idea to launch"],
    answer: {
      en: "ChartCreator is my strongest ownership example: I carried it from a user pain point through research, product design, architecture, implementation, and deployment. The Alibaba workbench guide and reusable agent workflows are another example of turning individual analysis into capabilities a wider team could operate.",
      zh: "ChartCreator 是我最完整的所有权案例：从用户痛点出发，推进调研、产品设计、架构、实现与部署。阿里的 AI 应用台指南和可复用 Agent 工作流，则体现了我如何把个人分析沉淀为团队能够持续使用的能力。",
    },
  },
  {
    id: "contact",
    keywords: ["怎么联系", "联系方式", "联系他", "找他", "contact", "get in touch", "reach him", "reach out"],
    answer: {
      en: "The easiest ways to reach me are email or LinkedIn. My English-facing email is zhangwuziyang@gmail.com, and my LinkedIn profile is linked in the Contact section at the bottom of the site.",
      zh: "最方便的方式是邮件或 LinkedIn。中文联系我可使用 3168661545@qq.com；英文联系可使用 zhangwuziyang@gmail.com，网站底部的联系区也有 LinkedIn 入口。",
    },
  },
  {
    id: "email",
    keywords: ["邮箱", "邮件", "email", "mail address", "电子邮件"],
    answer: {
      en: "My email is zhangwuziyang@gmail.com. For Chinese-language contact, you can also use 3168661545@qq.com.",
      zh: "我的中文联系邮箱是 3168661545@qq.com；英文联系可使用 zhangwuziyang@gmail.com。",
    },
  },
  {
    id: "linkedin",
    keywords: ["领英", "linkedin", "社交账号", "professional profile"],
    answer: {
      en: "My LinkedIn is linkedin.com/in/wuziyang-zhang-7b547229b. You can also open it directly from the Contact section of this site.",
      zh: "我的 LinkedIn 地址是 linkedin.com/in/wuziyang-zhang-7b547229b，也可以从网站底部的联系区直接打开。",
    },
  },
  {
    id: "resume",
    keywords: ["简历", "下载简历", "resume", "résumé", "cv", "download resume"],
    answer: {
      en: "You can download my résumé from the Contact section near the bottom of the homepage. Look for the “Download Résumé” button.",
      zh: "可以在首页底部的联系区下载我的简历，点击“下载简历”按钮即可。",
    },
  },
  {
    id: "language",
    keywords: ["中文", "英文", "语言", "can you speak chinese", "language", "english", "bilingual"],
    answer: {
      en: "Yes. I can answer here in either English or Chinese, and my portfolio is fully bilingual.",
      zh: "可以。我能在这里用中文或英文回答，我的个人网站也支持完整的双语浏览。",
    },
  },
];

function normalize(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/[^a-z0-9\u3400-\u9fff]+/g, "");
}

function tokenize(value: string): string[] {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .match(/[a-z0-9]+|[\u3400-\u9fff]/g) ?? [];
}

function diceCoefficient(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const pairs = new Map<string, number>();
  for (let i = 0; i < a.length - 1; i += 1) {
    const pair = a.slice(i, i + 2);
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
  }

  let overlap = 0;
  for (let i = 0; i < b.length - 1; i += 1) {
    const pair = b.slice(i, i + 2);
    const count = pairs.get(pair) ?? 0;
    if (count > 0) {
      overlap += 1;
      pairs.set(pair, count - 1);
    }
  }

  return (2 * overlap) / (a.length + b.length - 2);
}

function keywordScore(query: string, keyword: string): number {
  const q = normalize(query);
  const k = normalize(keyword);
  if (!q || !k) return 0;
  if (q === k) return 100;

  let score = diceCoefficient(q, k) * 46;
  if (q.includes(k)) score = Math.max(score, 62 + Math.min(k.length, 18));
  if (q.length >= 2 && k.includes(q)) score = Math.max(score, 42 + Math.min(q.length, 14));

  const queryTokens = new Set(tokenize(query));
  const keywordTokens = new Set(tokenize(keyword));
  const tokenOverlap = [...queryTokens].filter((token) => keywordTokens.has(token)).length;
  const tokenBase = Math.max(queryTokens.size, keywordTokens.size, 1);
  score = Math.max(score, (tokenOverlap / tokenBase) * 38);

  return score;
}

function isExplicitExperienceComparison(query: string): boolean {
  const comparisonLanguage = /比较|对比|区别|差异|不同|相比|compare|comparison|versus|\bvs\.?\b|difference/i.test(query);
  const mentionedExperiences = [
    /阿里|alibaba/i,
    /罗兰贝格|roland\s*berger/i,
    /字节|bytedance/i,
    /国元|guoyuan/i,
    /chart\s*creator/i,
    /code\s*and\s*power/i,
  ].filter((pattern) => pattern.test(query)).length;
  return comparisonLanguage && mentionedExperiences >= 2;
}

const EXPERIENCE_SUBJECTS = [
  { pattern: /阿里|alibaba/i, opinionId: "alibaba-view", reflectionId: "alibaba-learning" },
  { pattern: /字节|bytedance/i, opinionId: "bytedance-view", reflectionId: "bytedance-learning" },
  { pattern: /罗兰贝格|roland\s*berger/i, opinionId: "roland-view", reflectionId: "roland-learning" },
  { pattern: /国元|guoyuan/i, opinionId: "guoyuan-view", reflectionId: "guoyuan-learning" },
  { pattern: /chart\s*creator/i, opinionId: "chartcreator-view", reflectionId: "chartcreator-learning" },
] as const;

const EXPERIENCE_COMPARISON_PROFILES = [
  {
    pattern: /阿里|alibaba/i,
    zh: "阿里经历更偏因果分析、物流商业分析与 AI Agent，重点是把分析接入日常运营",
    en: "Alibaba emphasized causal analytics, logistics business analysis, and AI agents that moved analysis into daily operations",
  },
  {
    pattern: /罗兰贝格|roland\s*berger/i,
    zh: "罗兰贝格经历更偏定量战略、用户分群与客户交付，重点是把模型转成可执行的 KOC 运营体系",
    en: "Roland Berger emphasized quantitative strategy, user segmentation, and turning models into a client-ready KOC operating system",
  },
  {
    pattern: /字节|bytedance/i,
    zh: "字节经历更偏平台、竞品与产品战略，重点是在尚未稳定的市场中搭建决策框架",
    en: "ByteDance emphasized platform, competitive, and product strategy in a market that was still taking shape",
  },
  {
    pattern: /国元|guoyuan/i,
    zh: "国元证券经历更偏金融与行业研究，重点是把财务、渠道与宏观信号收敛成投资观点",
    en: "Guoyuan Securities emphasized financial and industry research that turned company, channel, and macro signals into an investment thesis",
  },
  {
    pattern: /chart\s*creator/i,
    zh: "ChartCreator 更偏端到端产品所有权，重点是从用户研究一路推进到可部署的 MVP",
    en: "ChartCreator emphasized end-to-end product ownership from user research through a deployed MVP",
  },
] as const;

function buildExperienceComparisonAnswer(query: string, lang: Lang): string | undefined {
  const compared = EXPERIENCE_COMPARISON_PROFILES
    .map((profile) => ({ profile, index: query.search(profile.pattern) }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index)
    .map(({ profile }) => profile);
  if (compared.length < 2) return undefined;

  if (lang === "zh") {
    return `${compared.map(({ zh }) => zh).join("；")}。共同点是都用数据支持真实决策，核心差异在于它们分别落在业务运营、客户交付、平台判断、投资研究或产品构建的不同环节。`;
  }
  return `${compared.map(({ en }) => en).join("; ")}. They all used evidence to support real decisions, but each placed me at a different point between operating workflows, client delivery, platform judgment, investment research, and product building.`;
}

function findExperienceSubject(value: string) {
  return EXPERIENCE_SUBJECTS.find(({ pattern }) => pattern.test(value));
}

function resolveExplicitIntentId(query: string): string | undefined {
  const rules: Array<{ id: string; pattern: RegExp }> = [
    {
      id: "projects-overview",
      pattern: /(?:你的|他的|梓洋的)(?:代表)?项目|做过哪些项目|有哪些项目|项目概览|项目经历|your projects|what projects have you built|project overview/i,
    },
    {
      id: "experience-overview",
      pattern: /(?:你的|他的|梓洋的)(?:工作|实习)?经历|介绍.*(?:工作|实习)经历|工作经历|实习经历|work history|internship experience|career history/i,
    },
    {
      id: "why-majors",
      pattern: /为什么.*(?:专业|主修|经济学|信息科学)|专业.*为什么|why.*(?:major|economics|information science)/i,
    },
    {
      id: "courses",
      pattern: /课程|学过什么课|喜欢什么课|coursework|courses|classes|what do you study/i,
    },
    {
      id: "uw-fit",
      pattern: /为什么.*(?:威斯康星|麦迪逊|uw)|学校.*(?:带给|影响)|威斯康星理念|wisconsin idea|why (?:uw|wisconsin)|university fit/i,
    },
    {
      id: "location",
      pattern: /(?:学校|大学|uw).*(?:在哪|位置|城市)|麦迪逊在哪|where.*(?:university|uw).*(?:located|based)/i,
    },
    {
      id: "majors",
      pattern: /(?:你的|他的|梓洋的)?(?:专业|主修)|双专业|经济学.*信息科学|major|economics.*information science/i,
    },
    {
      id: "education",
      pattern: /威斯康星大学|麦迪逊分校|uw[-\s–—]?madison|university of wisconsin|教育背景|(?:介绍|说说)(?:一下)?(?:你的|我的)?学校|你的学校|哪里读书|在哪里上学|什么学校|your (?:school|university|education)|tell me about (?:your|the) school/i,
    },
    {
      id: "intro",
      pattern: /你是谁|他是谁|介绍(?:一下)?你(?:自己)?(?:[？?。.]|$)|介绍(?:一下)?(?:自己|梓洋|张吴梓洋)|自我介绍|个人简介|who is wuziyang|introduce yourself|introduce wuziyang/i,
    },
  ];
  return rules.find(({ pattern }) => pattern.test(query))?.id;
}

function isContextualFollowUp(query: string): boolean {
  return /^(?:那|那么|然后|还有|继续|再展开|具体说|具体呢|为什么呢|怎么做到|是怎么|哪些呢|这个|这家|这段|这项|那个|那家|它|其中|前者|后者|刚才|前面)|(?:这个|这家|这段|这项|那个|那家|该公司|该项目|上述|刚才提到).*(?:怎么样|是什么|做了什么|为什么|怎么|哪些|影响|结果)|^(?:你)?(?:学到了什么|学会了什么|有什么收获|最大的挑战是什么)|^(?:tell me more|what did you learn|what was your takeaway|what about (?:it|that)|how about (?:it|that)|and (?:then|what else)|why is that|how did (?:you|it))/i.test(query.trim());
}

function resolveContextualExpansionIntentId(
  query: string,
  recentUserContext: string,
): string | undefined {
  const asksForSomethingElse = /还有.*(?:其他|别的)|除此之外|别的呢|其他的吗|what else|anything else|other (?:interests|hobbies)/i.test(query);
  const followsInterestTopic = /兴趣|爱好|音乐|钢琴|吉他|葫芦丝|music|piano|guitar|hobb/i.test(recentUserContext);
  if (asksForSomethingElse && followsInterestTopic) return "interests-beyond-music";
  return undefined;
}

function detectAnswerMode(query: string, recentUserContext: string): ProfileChatAnswerMode {
  if (/比较|对比|区别|差异|不同|相比|compare|comparison|versus|\bvs\.?\b|difference/i.test(query)) {
    return "comparison";
  }

  if (/学到|学会|收获|反思|启发|挑战|困难|最难|takeaway|learn(?:ed|t)?|lesson|challenge|reflection/i.test(query)) {
    return "reflection";
  }

  if (/推荐|建议|应该|适合|值不值得|先看|recommend|suggest|should|best fit|worth/i.test(query)) {
    return "recommendation";
  }

  const asksForOpinion = /你觉得|怎么看|如何评价|评价一下|印象|感受|公司怎么样|这段经历怎么样|what do you think|your view|opinion|impression|how was (?:alibaba|bytedance|roland|guoyuan)/i.test(query);
  const hasExperienceSubject = Boolean(findExperienceSubject(query));
  const refersToRecentExperience = /这家(?:公司)?|这个公司|这段经历|这个项目|它怎么样/i.test(query)
    && Boolean(findExperienceSubject(recentUserContext));
  if (asksForOpinion && (hasExperienceSubject || refersToRecentExperience)) {
    return "opinion";
  }

  return "fact";
}

function resolveFocusedIntentId(
  query: string,
  recentUserContext: string,
  mode: ProfileChatAnswerMode,
  allowRecentContext: boolean,
): string | undefined {
  if (mode === "comparison" && isExplicitExperienceComparison(query)) {
    return "experience-compare";
  }
  if (mode !== "opinion" && mode !== "reflection") return undefined;

  const subject = findExperienceSubject(query)
    ?? (allowRecentContext ? findExperienceSubject(recentUserContext) : undefined);
  if (!subject) return undefined;
  return mode === "opinion" ? subject.opinionId : subject.reflectionId;
}

export function findProfileResponse(
  query: string,
  lang: Lang,
  recentUserContext = "",
): ProfileChatResponse {
  const mode = detectAnswerMode(query, recentUserContext);
  const explicitIntentId = resolveExplicitIntentId(query);
  const hasExplicitExperience = Boolean(findExperienceSubject(query));
  const useConversationContext = !explicitIntentId
    && !hasExplicitExperience
    && isContextualFollowUp(query);
  const focusedIntentId = explicitIntentId
    ?? (useConversationContext
      ? resolveContextualExpansionIntentId(query, recentUserContext)
      : undefined)
    ?? resolveFocusedIntentId(query, recentUserContext, mode, useConversationContext);
  const rankedIntents = INTENTS.map((intent) => {
    const directScore = Math.max(...intent.keywords.map((keyword) => keywordScore(query, keyword)));
    const contextScore = useConversationContext && recentUserContext
      ? Math.max(...intent.keywords.map((keyword) => keywordScore(recentUserContext, keyword))) * 0.38
      : 0;
    const focusedScore = intent.id === focusedIntentId ? 125 : 0;
    return { intent, directScore, score: Math.max(directScore, contextScore, focusedScore) };
  }).sort((a, b) => b.score - a.score);

  const bestMatch = rankedIntents[0];
  const genericIntroductionDrift = Boolean(
    bestMatch
    && ["intro", "education", "majors"].includes(bestMatch.intent.id)
    && /介绍(?:一下)?|tell me about|introduce/i.test(query)
    && !explicitIntentId,
  );
  if (!bestMatch || bestMatch.score < 24 || genericIntroductionDrift) {
    return {
      answer: PROFILE_CHAT_COPY.fallback[lang],
      context: PROFILE_CHAT_COPY.fallback[lang],
      mode,
      useConversationContext,
    };
  }

  const bestIntent = bestMatch.intent;
  const destinationKey = DESTINATION_BY_INTENT[bestIntent.id];
  const destination = destinationKey ? DESTINATIONS[destinationKey] : undefined;
  const resolvedAnswer = bestIntent.id === "experience-compare"
    ? buildExperienceComparisonAnswer(query, lang) ?? bestIntent.answer[lang]
    : bestIntent.answer[lang];
  const supportingAnswers = [
    resolvedAnswer,
    ...rankedIntents
      .filter(({ intent, directScore }) => (
        intent.id !== bestIntent.id
        && directScore >= Math.max(48, bestMatch.directScore * 0.72)
        && DESTINATION_BY_INTENT[intent.id] === destinationKey
      ))
      .slice(0, 1)
      .map(({ intent }) => intent.answer[lang]),
  ];

  return {
    answer: resolvedAnswer,
    context: supportingAnswers.join("\n\n"),
    mode,
    intentId: bestIntent.id,
    useConversationContext,
    action: destination
      ? { href: destination.href, label: destination.label[lang] }
      : undefined,
  };
}
