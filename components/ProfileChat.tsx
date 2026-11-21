"use client";

import { type FormEvent, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import CindyAvatar from "@/components/home/CindyAvatar";
import { useLang } from "@/context/LangContext";
import type { LocalAI } from "@/lib/profileChatAI";
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
  typing?: boolean;
  actions?: ProfileChatAction[];
};

type LocalAIStatus = "idle" | "loading" | "ready" | "failed" | "unsupported";

export default function ProfileChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang();
  const copy = PROFILE_CHAT_COPY;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [announcement, setAnnouncement] = useState<{ id: number; content: string } | null>(null);
  const [aiStatus, setAiStatus] = useState<LocalAIStatus>("idle");
  const [aiProgress, setAiProgress] = useState(0);
  const nextId = useRef(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const followBottom = useRef(false);
  const aiRef = useRef<LocalAI | null>(null);
  const loadingRef = useRef<AbortController | null>(null);
  const generationRef = useRef<AbortController | null>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const mobile = window.matchMedia("(width < 48rem)");

    function show() {
      if (!dialog) return;
      const focused = document.activeElement;
      if (dialog.open) dialog.close();
      if (mobile.matches) dialog.showModal();
      else dialog.show();

      if (focused instanceof HTMLElement && dialog.contains(focused)) {
        focused.focus({ preventScroll: true });
      } else {
        (mobile.matches ? closeRef.current : inputRef.current)?.focus({ preventScroll: true });
      }
    }

    show();
    mobile.addEventListener("change", show);
    return () => {
      mobile.removeEventListener("change", show);
      dialog.close();
      loadingRef.current?.abort();
      generationRef.current?.abort();
      aiRef.current?.dispose();
      aiRef.current = null;
    };
  }, [open]);

  useLayoutEffect(() => {
    const container = messagesRef.current;
    if (open && container && followBottom.current) container.scrollTop = container.scrollHeight;
  }, [messages, open]);

  function closeChat() {
    loadingRef.current?.abort();
    generationRef.current?.abort();
    aiRef.current?.dispose();
    aiRef.current = null;
    generationRef.current = null;
    loadingRef.current = null;
    setMessages((current) => current.at(-1)?.typing ? current.slice(0, -2) : current);
    setIsTyping(false);
    setAiStatus("idle");
    setAnnouncement(null);
    dialogRef.current?.close();
    onClose();
  }

  async function enableLocalAI() {
    if (loadingRef.current || aiRef.current) return;
    if (!("gpu" in navigator) || typeof Worker === "undefined") {
      setAiStatus("unsupported");
      return;
    }

    const request = new AbortController();
    loadingRef.current = request;
    setAiProgress(0);
    setAiStatus("loading");
    closeRef.current?.focus({ preventScroll: true });

    try {
      const { prepareLocalAI } = await import("@/lib/profileChatAI");
      if (request.signal.aborted) return;
      const session = await prepareLocalAI(request.signal, setAiProgress);
      if (request.signal.aborted) {
        session.dispose();
        return;
      }
      aiRef.current = session;
      setAiStatus("ready");
    } catch {
      if (!request.signal.aborted) setAiStatus("failed");
    } finally {
      if (loadingRef.current === request) loadingRef.current = null;
    }
  }

  function stopGeneration() {
    generationRef.current?.abort();
    inputRef.current?.focus({ preventScroll: true });
  }

  function onMessagesScroll() {
    const container = messagesRef.current;
    if (container) {
      followBottom.current = container.scrollHeight - container.scrollTop - container.clientHeight < 24;
    }
  }

  async function sendMessage(rawValue: string) {
    const question = rawValue.trim();
    if (!question || generationRef.current) return;

    const answerLang = detectProfileChatLanguage(question, lang);
    const recentQuestion = messages.findLast((message) => message.role === "user")?.content;
    const response = findProfileResponse(question, answerLang, recentQuestion);
    const conversationContext = response.useConversationContext
      ? messages.slice(-2)
          .map((message) => `${message.role === "user" ? "User" : "Wuziyang"}: ${message.content}`)
          .join("\n")
      : "";
    const localAI = aiRef.current;
    const useModel = localAI && response.intentId && response.intentId !== "quick-summary"
      && !response.verbatim && response.mode !== "reflection";

    const userMessage: ChatMessage = { id: nextId.current++, role: "user", content: question };
    const assistantMessage: ChatMessage = {
      id: nextId.current++,
      role: "assistant",
      content: response.answer,
      actions: response.actions,
    };

    setInput("");
    onMessagesScroll();
    inputRef.current?.focus({ preventScroll: true });
    if (!useModel) {
      setMessages((current) => [...current, userMessage, assistantMessage]);
      setAnnouncement(assistantMessage);
      return;
    }

    const request = new AbortController();
    generationRef.current = request;
    setIsTyping(true);
    setMessages((current) => [...current, userMessage, { ...assistantMessage, content: "", typing: true }]);
    let answer = response.answer;
    try {
      answer = await localAI.generate({
        question,
        canonicalAnswer: response.answer,
        supportingContext: response.context,
        conversationContext,
        answerMode: response.mode,
        answerIntentId: response.intentId,
        lang: answerLang,
        onUpdate: (content) => {
          if (generationRef.current !== request || request.signal.aborted) return;
          setMessages((current) => current.map((message) =>
            message.id === assistantMessage.id ? { ...message, content } : message,
          ));
        },
      }, request.signal);
    } catch {
      if (generationRef.current === request && localAI.disposed) {
        aiRef.current = null;
        setAiStatus(request.signal.aborted ? "idle" : "failed");
      }
    } finally {
      if (generationRef.current === request) {
        generationRef.current = null;
        const complete = { ...assistantMessage, content: answer };
        setMessages((current) => current.map((message) =>
          message.id === assistantMessage.id ? complete : message,
        ));
        setAnnouncement(complete);
        setIsTyping(false);
      }
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  const conversation: ChatMessage[] = [{ id: 0, role: "assistant", content: copy.greeting[lang] }, ...messages];

  return (
    <dialog
      id="profile-chat-dialog"
      ref={dialogRef}
      aria-label={copy.title[lang]}
      onCancel={(event) => {
        event.preventDefault();
        closeChat();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeChat();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeChat();
      }}
      className="profile-chat-dialog fixed z-[100] overflow-hidden rounded-[26px] border border-white/[0.13] text-white"
      style={{
        background: "linear-gradient(160deg, rgba(29,29,31,0.98), rgba(8,8,9,0.985))",
        boxShadow: "0 28px 90px rgba(0,0,0,0.55), 0 8px 28px rgba(0,0,0,0.35)",
        backdropFilter: "blur(28px)",
      }}
    >
      <div className="flex min-h-0 w-full flex-col">
        <header className="relative flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5"
            >
              <CindyAvatar />
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
                      : (aiStatus === "failed" || aiStatus === "unsupported")
                        ? copy.aiFallback[lang]
                        : copy.status[lang]}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={closeChat}
            ref={closeRef}
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

        <div
          ref={messagesRef}
          onScroll={onMessagesScroll}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        >
          <div className="space-y-3">
            {conversation.map((message) => (
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
                  <span className="whitespace-pre-wrap">{message.content}</span>
                  {message.typing && (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-white/65" />
                  )}
                  {!message.typing && message.actions?.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onNavigate={closeChat}
                      className="mt-2.5 flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.12] bg-white/[0.07] px-3 py-2 text-[11px] font-semibold text-white transition-[background,border-color,transform] hover:border-white/25 hover:bg-white/[0.12] active:scale-[0.98]"
                    >
                      <span>{action.label}</span>
                      <span aria-hidden="true" className="text-white/55">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {messages.length === 0 && (
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
                    onClick={() => void sendMessage(suggestion)}
                    className="flex min-h-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.045] px-3 py-2 text-center text-[10px] leading-4 text-white/65 transition-[background,color,border-color,transform] hover:border-sky-300/20 hover:bg-sky-300/[0.07] hover:text-white active:scale-[0.98]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement && <span key={announcement.id}>{announcement.content}</span>}
        </div>
        <footer className="border-t border-white/[0.08] px-3.5 pb-3 pt-3">
          {(aiStatus === "idle" || aiStatus === "failed") && (
            <button
              type="button"
              onClick={() => void enableLocalAI()}
              className="mb-2 text-xs text-sky-300 hover:underline"
            >
              {aiStatus === "failed"
                ? (lang === "zh" ? "重试本地 AI" : "Retry local AI")
                : (lang === "zh" ? "启用本地 AI" : "Enable local AI")}
            </button>
          )}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 rounded-2xl border border-white/[0.11] bg-white/[0.06] p-1.5 pl-3.5 focus-within:border-[#0071e3]/70 focus-within:bg-white/[0.08]"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              readOnly={isTyping}
              maxLength={180}
              placeholder={isTyping ? (lang === "zh" ? "正在回复…" : "Replying…") : copy.placeholder[lang]}
              aria-label={copy.placeholder[lang]}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/30 disabled:cursor-wait"
            />
            {isTyping ? (
              <button
                type="button"
                onClick={stopGeneration}
                aria-label={lang === "zh" ? "停止生成" : "Stop generating"}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0071e3] text-white"
              >
                <span className="h-2.5 w-2.5 rounded-sm bg-current" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label={copy.send[lang]}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0071e3] text-white transition-[opacity,transform,background] hover:bg-[#0077ed] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 12.5v-9M4.5 7 8 3.5 11.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </form>
        </footer>
      </div>
    </dialog>
  );
}
