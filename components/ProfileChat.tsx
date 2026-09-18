"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import {
  detectProfileChatLanguage,
  findProfileResponse,
  PROFILE_CHAT_COPY,
  type ProfileChatAction,
} from "@/lib/profileChatData";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
  kind?: "greeting";
  typing?: boolean;
  action?: ProfileChatAction;
};

type LocalAIStatus = "idle" | "loading" | "ready" | "fallback";
type LocalAIModule = typeof import("@/lib/profileChatAI");

function ChatMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.15 17.2 4.7 20l3.05-1.18c1.2.62 2.65.98 4.25.98 4.75 0 8.6-3.38 8.6-7.55S16.75 4.7 12 4.7s-8.6 3.38-8.6 7.55c0 1.88.78 3.6 2.08 4.92"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m17.65 3.15.48 1.36 1.37.49-1.37.48-.48 1.37-.49-1.37L15.8 5l1.36-.49.49-1.36Z"
        fill="currentColor"
      />
      <path d="M8.25 12.45h.01M12 12.45h.01M15.75 12.45h.01" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
    </svg>
  );
}

export default function ProfileChat() {
  const { lang } = useLang();
  const copy = PROFILE_CHAT_COPY;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<LocalAIStatus>("idle");
  const [aiProgress, setAiProgress] = useState(0);
  const nextId = useRef(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const aiModuleRef = useRef<LocalAIModule | null>(null);
  const aiStartedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 260);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || aiStartedRef.current) return;
    aiStartedRef.current = true;
    setAiStatus("loading");

    void import("@/lib/profileChatAI")
      .then(async (localAI) => {
        aiModuleRef.current = localAI;
        if (!localAI.canUseLocalAI()) {
          setAiStatus("fallback");
          return;
        }

        await localAI.prepareLocalAI((report) => {
          setAiProgress(report.progress);
        });
        setAiProgress(1);
        setAiStatus("ready");
      })
      .catch(() => {
        setAiStatus("fallback");
      });
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const openChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{
        id: nextId.current++,
        role: "assistant",
        content: copy.greeting[lang],
        kind: "greeting",
      }]);
    }
  };

  const typeAnswer = (answer: string, messageId: number, answerLang: "en" | "zh") => {
    const characters = Array.from(answer);
    let index = 0;
    setIsTyping(true);

    const tick = () => {
      index += 1;
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...message, content: characters.slice(0, index).join(""), typing: index < characters.length }
            : message,
        ),
      );

      if (index < characters.length) {
        timerRef.current = setTimeout(tick, answerLang === "zh" ? 24 : 14);
      } else {
        timerRef.current = null;
        setIsTyping(false);
      }
    };

    timerRef.current = setTimeout(tick, 320);
  };

  const sendMessage = async (rawValue: string) => {
    const question = rawValue.trim();
    if (!question || isTyping) return;

    const userId = nextId.current++;
    const assistantId = nextId.current++;
    const answerLang = detectProfileChatLanguage(question, lang);
    const recentUserContext = messages
      .filter((message) => message.role === "user")
      .slice(-1)
      .map((message) => message.content)
      .join(" ");
    const response = findProfileResponse(question, answerLang, recentUserContext);
    const conversationContext = response.useConversationContext
      ? messages
          .slice(-2)
          .map((message) => `${message.role === "user" ? "User" : "Wuziyang"}: ${message.content}`)
          .join("\n")
      : "";

    setInput("");
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", content: question },
      {
        id: assistantId,
        role: "assistant",
        content: "",
        typing: true,
        action: response.action,
      },
    ]);

    if (
      aiStatus === "ready"
      && aiModuleRef.current
      && response.intentId
      && response.intentId !== "quick-summary"
      && response.mode !== "reflection"
    ) {
      setIsTyping(true);
      try {
        const answer = await aiModuleRef.current.generateLocalAnswer({
          question,
          canonicalAnswer: response.answer,
          supportingContext: response.context,
          conversationContext,
          answerMode: response.mode,
          answerIntentId: response.intentId,
          lang: answerLang,
          onUpdate: (partialAnswer) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: partialAnswer, typing: true }
                  : message,
              ),
            );
          },
        });

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: answer, typing: false }
              : message,
          ),
        );
        setIsTyping(false);
      } catch {
        setAiStatus("fallback");
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: "", typing: true }
              : message,
          ),
        );
        typeAnswer(response.answer, assistantId, answerLang);
      }
      return;
    }

    typeAnswer(response.answer, assistantId, answerLang);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label={copy.close[lang]}
              className="fixed inset-0 z-[90] bg-black/35 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.section
              id="profile-chat-dialog"
              role="dialog"
              aria-label={copy.title[lang]}
              aria-modal="false"
              className="fixed left-4 right-4 z-[100] flex overflow-hidden rounded-[26px] border border-white/[0.13] md:left-auto md:right-6 md:w-[390px]"
              style={{
                bottom: "calc(env(safe-area-inset-bottom) + 5.5rem)",
                height: "min(600px, calc(100dvh - 7.5rem))",
                background: "linear-gradient(160deg, rgba(29,29,31,0.98), rgba(8,8,9,0.985))",
                boxShadow: "0 28px 90px rgba(0,0,0,0.55), 0 8px 28px rgba(0,0,0,0.35)",
                backdropFilter: "blur(28px)",
              }}
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex min-h-0 w-full flex-col">
                <header className="relative flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                      style={{ background: "linear-gradient(135deg, #0071e3, #7c3aed)" }}
                    >
                      <ChatMark size={22} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-white">
                        {copy.title[lang]}
                      </h2>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            aiStatus === "loading"
                              ? "animate-pulse bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                              : aiStatus === "ready"
                                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                                : "bg-white/45"
                          }`}
                        />
                        <p className="truncate text-[10px] font-medium tracking-[0.06em] text-white/45">
                          {aiStatus === "loading"
                            ? copy.aiLoading[lang]
                            : aiStatus === "ready"
                              ? copy.aiReady[lang]
                              : aiStatus === "fallback"
                                ? copy.aiFallback[lang]
                                : copy.status[lang]}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={copy.close[lang]}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {aiStatus === "loading" && (
                    <span
                      className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#1689ff] to-[#8854e8] transition-[width] duration-300"
                      style={{ width: `${Math.max(2, Math.round(aiProgress * 100))}%` }}
                    />
                  )}
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[86%] px-3.5 py-2.5 text-[13px] leading-[1.65] ${
                            message.role === "user"
                              ? "rounded-[18px] rounded-br-[6px] bg-[#0071e3] text-white"
                              : "rounded-[18px] rounded-bl-[6px] border border-white/[0.08] bg-white/[0.07] text-white/90"
                          }`}
                        >
                          {message.kind === "greeting" ? copy.greeting[lang] : message.content}
                          {message.typing && (
                            <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-white/65" />
                          )}
                          {message.role === "assistant" && message.action && !message.typing && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.22 }}
                            >
                              <Link
                                href={message.action.href}
                                onClick={() => setIsOpen(false)}
                                className="mt-2.5 flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.12] bg-white/[0.07] px-3 py-2 text-[11px] font-semibold text-white transition-[background,border-color,transform] hover:border-white/25 hover:bg-white/[0.12] active:scale-[0.98]"
                              >
                                <span>{message.action.label}</span>
                                <span aria-hidden="true" className="text-white/55">→</span>
                              </Link>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {messages.length <= 1 && (
                    <div className="mt-5">
                      <div className="mb-4 rounded-2xl border border-sky-400/15 bg-sky-400/[0.055] px-3.5 py-3">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-[9px] font-semibold text-sky-300">
                            i
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-white/80">
                              {copy.chatNowTitle[lang]}
                            </p>
                            <p className="mt-1 text-[10px] leading-[1.55] text-white/45">
                              {aiStatus === "loading"
                                ? copy.chatNowLoading[lang]
                                : aiStatus === "ready"
                                  ? copy.chatNowReady[lang]
                                  : copy.chatNowFallback[lang]}
                            </p>
                            <div className="mt-2.5 border-t border-white/[0.07] pt-2.5">
                              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-1">
                                {copy.howItWorksSteps[lang].map((step, index, steps) => (
                                  <div
                                    key={step.title}
                                    className="flex flex-col gap-1.5 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:gap-1"
                                  >
                                    <div className="flex min-h-12 items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-2.5 py-2 sm:h-[76px] sm:min-h-0 sm:flex-1 sm:flex-col sm:justify-center sm:gap-1 sm:overflow-hidden sm:px-1.5 sm:text-center">
                                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sky-300/20 bg-sky-400/[0.12] text-[10px] font-semibold text-sky-200">
                                        {step.symbol}
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block text-[9px] font-semibold leading-3.5 text-white/75">
                                          {step.title}
                                        </span>
                                        <span className="mt-0.5 block text-[8px] leading-3 text-white/35">
                                          {step.detail}
                                        </span>
                                      </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                      <span className="self-center text-[11px] text-sky-300/40" aria-hidden="true">
                                        <span className="sm:hidden">↓</span>
                                        <span className="hidden sm:inline">→</span>
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-amber-300/15 bg-amber-300/[0.035] px-2.5 py-1.5 text-[8px] leading-3.5 text-white/40">
                                <span className="shrink-0 font-semibold text-amber-200/55" aria-hidden="true">↳</span>
                                <span>{copy.howItWorksNoMatch[lang]}</span>
                              </div>
                              <details className="group mt-2">
                                <summary className="cursor-pointer list-none text-[9px] font-medium text-sky-300/65 transition-colors hover:text-sky-200 [&::-webkit-details-marker]:hidden">
                                  <span className="inline-flex items-center gap-1">
                                    {copy.howItWorks[lang]}
                                    <span className="text-[8px] transition-transform group-open:rotate-90" aria-hidden="true">→</span>
                                  </span>
                                </summary>
                                <p className="mt-1.5 border-l border-sky-300/15 pl-2.5 text-[8px] leading-[1.55] text-white/35">
                                  {copy.howItWorksBody[lang]}
                                </p>
                              </details>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/35">
                        {copy.suggestionsLabel[lang]}
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {copy.suggestions[lang].map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => sendMessage(suggestion)}
                            className="flex min-h-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.045] px-3 py-2 text-center text-[10px] leading-4 text-white/65 transition-[background,color,border-color,transform] hover:border-sky-300/20 hover:bg-sky-300/[0.07] hover:text-white active:scale-[0.98]"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                <footer className="border-t border-white/[0.08] px-3.5 pb-3 pt-3">
                  <form
                    onSubmit={onSubmit}
                    className="flex items-center gap-2 rounded-2xl border border-white/[0.11] bg-white/[0.06] p-1.5 pl-3.5 focus-within:border-[#0071e3]/70 focus-within:bg-white/[0.08]"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      disabled={isTyping}
                      maxLength={180}
                      placeholder={isTyping ? (lang === "zh" ? "正在回复…" : "Replying…") : copy.placeholder[lang]}
                      aria-label={copy.placeholder[lang]}
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/30 disabled:cursor-wait"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      aria-label={copy.send[lang]}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0071e3] text-white transition-[opacity,transform,background] hover:bg-[#0077ed] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M8 12.5v-9M4.5 7 8 3.5 11.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </form>
                </footer>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed right-4 z-[101] md:right-6"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <motion.button
              type="button"
              aria-label={copy.open[lang]}
              aria-expanded={false}
              aria-controls="profile-chat-dialog"
              onClick={openChat}
              className="group relative flex h-[50px] w-[50px] items-center justify-end overflow-hidden rounded-full border border-white/[0.16] p-[5px] text-white backdrop-blur-2xl sm:w-auto sm:min-w-[120px] sm:justify-between sm:gap-2.5 sm:pl-4"
              style={{
                background: "linear-gradient(145deg, rgba(20,20,22,0.86), rgba(4,4,5,0.72))",
                boxShadow: "0 10px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
              }}
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="hidden whitespace-nowrap text-[11px] font-semibold tracking-[0.02em] text-white/80 sm:block">
                {copy.open[lang]}
              </span>

              <span
                className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{
                  background: "linear-gradient(140deg, #1689ff 0%, #4f67f2 48%, #8854e8 100%)",
                  boxShadow: "0 5px 14px rgba(61,91,238,0.34), inset 0 1px 1px rgba(255,255,255,0.38)",
                }}
              >
                <span className="absolute -inset-2 rounded-full bg-[#4f67f2]/25 blur-lg transition-opacity duration-300 group-hover:opacity-80" />
                <span className="absolute left-2 right-2 top-1 h-2 rounded-full bg-gradient-to-b from-white/30 to-transparent blur-[1px]" />
                <span className="relative flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
                  <ChatMark size={22} />
                </span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
