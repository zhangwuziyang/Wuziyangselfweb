"use client";

import { type FormEvent, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import CindyAvatar from "@/components/home/CindyAvatar";
import { useLang } from "@/context/LangContext";
import type { LocalAI } from "@/lib/profileChatAI";
import { collapsedChatFrame, type ChatOrigin } from "./profile-chat-motion";
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

const MOBILE_CHAT = "(width < 48rem), (hover: none) and (pointer: coarse) and (height < 34rem)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const CHAT_LABELS = {
  en: {
    status: "Here to introduce you to Wuziyang",
    conversation: "Conversation with Cindy",
    you: "You",
    suggestions: ["What projects has he built?", "What’s his internship experience?", "How can I contact him?"],
    settings: "Chat settings",
    enableAI: "Enable local AI",
    retryAI: "Retry local AI",
    replying: "Replying…",
    stop: "Stop generating",
  },
  zh: {
    status: "随时为你介绍梓洋",
    conversation: "与 Cindy 的对话",
    you: "你",
    suggestions: ["他做过哪些项目？", "他的实习经历？", "怎么联系他？"],
    settings: "聊天设置",
    enableAI: "启用本地 AI",
    retryAI: "重试本地 AI",
    replying: "正在回复…",
    stop: "停止生成",
  },
} as const;

export default function ProfileChat({ open, readOrigin, onClose }: {
  open: boolean;
  readOrigin: (closing: boolean) => ChatOrigin | null;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const copy = PROFILE_CHAT_COPY;
  const labels = CHAT_LABELS[lang];
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
  const animationRef = useRef<Animation | null>(null);
  const closingRef = useRef(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const mobile = window.matchMedia(MOBILE_CHAT);
    const motion = window.matchMedia(REDUCED_MOTION);
    const viewport = window.visualViewport;
    closingRef.current = false;
    dialog.inert = false;
    delete dialog.dataset.closing;

    function fitViewport() {
      if (!dialog || !viewport) return;
      if (mobile.matches) {
        dialog.style.setProperty("--profile-chat-vh", `${viewport.height}px`);
        dialog.style.setProperty("--profile-chat-vtop", `${viewport.offsetTop}px`);
      } else {
        dialog.style.removeProperty("--profile-chat-vh");
        dialog.style.removeProperty("--profile-chat-vtop");
      }
    }

    function show(animate: boolean) {
      if (!dialog) return;
      const focused = document.activeElement;
      if (dialog.open) dialog.close();
      fitViewport();
      if (mobile.matches) dialog.showModal();
      else dialog.show();

      if (focused instanceof HTMLElement && dialog.contains(focused)) {
        focused.focus({ preventScroll: true });
      } else {
        (mobile.matches ? closeRef.current : inputRef.current)?.focus({ preventScroll: true });
      }

      if (animate && !motion.matches && typeof dialog.animate === "function") {
        animationRef.current = dialog.animate([
          collapsedChatFrame(dialog.getBoundingClientRect(), readOrigin(false), mobile.matches),
          { transform: "none", opacity: 1, ...(mobile.matches ? { borderRadius: "0px" } : {}) },
        ], { duration: 300, easing: "cubic-bezier(.21,.75,.32,1)" });
      }
    }

    function changeLayout() {
      if (closingRef.current) return;
      animationRef.current?.cancel();
      show(false);
    }

    function reduceMotion() {
      if (motion.matches) animationRef.current?.cancel();
    }

    show(true);
    mobile.addEventListener("change", changeLayout);
    motion.addEventListener("change", reduceMotion);
    viewport?.addEventListener("resize", fitViewport);
    viewport?.addEventListener("scroll", fitViewport);
    return () => {
      mobile.removeEventListener("change", changeLayout);
      motion.removeEventListener("change", reduceMotion);
      viewport?.removeEventListener("resize", fitViewport);
      viewport?.removeEventListener("scroll", fitViewport);
      const animation = animationRef.current;
      animationRef.current = null;
      animation?.cancel();
      if (dialog.open) dialog.close();
      loadingRef.current?.abort();
      generationRef.current?.abort();
      aiRef.current?.dispose();
      aiRef.current = null;
    };
  }, [open, readOrigin]);

  useLayoutEffect(() => {
    const container = messagesRef.current;
    if (open && container && followBottom.current) container.scrollTop = container.scrollHeight;
  }, [messages, open]);

  function closeChat(animate = true) {
    if (closingRef.current) return;
    closingRef.current = true;
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
    const dialog = dialogRef.current;
    const finish = () => {
      if (dialog?.open) dialog.close();
      onClose();
    };
    if (!animate || !dialog?.open || typeof dialog.animate !== "function" || window.matchMedia(REDUCED_MOTION).matches) {
      finish();
      return;
    }

    const styles = getComputedStyle(dialog);
    const firstFrame = { opacity: styles.opacity, transform: styles.transform, borderRadius: styles.borderRadius };
    animationRef.current?.cancel();
    const mobile = window.matchMedia(MOBILE_CHAT).matches;
    const lastFrame = collapsedChatFrame(dialog.getBoundingClientRect(), readOrigin(true), mobile);
    dialog.dataset.closing = "";
    dialog.inert = true;
    const animation = dialog.animate([firstFrame, lastFrame], {
      duration: 210, easing: "cubic-bezier(.4,0,.65,1)", fill: "forwards",
    });
    animationRef.current = animation;
    void animation.finished.then(
      () => { if (animationRef.current === animation) finish(); },
      () => { if (animationRef.current === animation) finish(); },
    );
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
    if (!question || generationRef.current || closingRef.current) return;

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
    followBottom.current = true;
    if (window.matchMedia(MOBILE_CHAT).matches && document.activeElement !== inputRef.current) {
      messagesRef.current?.focus({ preventScroll: true });
    } else {
      inputRef.current?.focus({ preventScroll: true });
    }
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
  const modeLabel = aiStatus === "loading" ? copy.aiLoading[lang]
    : aiStatus === "ready" ? copy.aiReady[lang] : copy.aiFallback[lang];
  const modeDescription = aiStatus === "loading" ? copy.chatNowLoading[lang]
    : aiStatus === "ready" ? copy.chatNowReady[lang] : copy.chatNowFallback[lang];

  return (
    <dialog
      id="profile-chat-dialog"
      ref={dialogRef}
      aria-labelledby="profile-chat-title"
      aria-describedby="profile-chat-status"
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
      className="profile-chat-dialog"
    >
      <div className="profile-chat-dialog__layout">
        <header className="profile-chat-header">
          <div className="profile-chat-header__avatar"><CindyAvatar size={40} /></div>
          <div className="profile-chat-header__identity">
            <h2 id="profile-chat-title">{copy.title[lang]}</h2>
            <p id="profile-chat-status">{labels.status}</p>
          </div>
          <button
            type="button"
            onClick={() => closeChat()}
            ref={closeRef}
            aria-label={copy.close[lang]}
            className="profile-chat-header__close"
          >
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div
          ref={messagesRef}
          tabIndex={-1}
          role="region"
          aria-label={labels.conversation}
          onScroll={onMessagesScroll}
          className="profile-chat-thread"
        >
          <ol className="profile-chat-messages">
            {conversation.map((message) => (
              <li key={message.id} className="profile-chat-message" data-role={message.role}>
                <div className="profile-chat-message__bubble">
                  <span className="sr-only">{message.role === "assistant" ? copy.title[lang] : labels.you} </span>
                  <span className="profile-chat-message__text">{message.content}</span>
                  {message.typing && <span className="profile-chat-message__cursor" aria-hidden="true" />}
                  {!message.typing && message.actions?.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onNavigate={() => closeChat(false)}
                      className="profile-chat-message__link"
                    >
                      <span>{action.label}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          {messages.length === 0 && (
            <div className="profile-chat-start">
              <p id="profile-chat-suggestions">{copy.suggestionsLabel[lang]}</p>
              <div className="profile-chat-prompts" role="group" aria-labelledby="profile-chat-suggestions">
                {labels.suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => void sendMessage(suggestion)}>
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

        <footer className="profile-chat-footer">
          <form onSubmit={onSubmit} className="profile-chat-composer">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              readOnly={isTyping}
              maxLength={180}
              autoComplete="off"
              enterKeyHint="send"
              placeholder={isTyping ? labels.replying : copy.placeholder[lang]}
              aria-label={copy.placeholder[lang]}
            />
            {isTyping ? (
              <button type="button" onClick={stopGeneration} aria-label={labels.stop} className="profile-chat-composer__send">
                <span className="profile-chat-composer__stop" aria-hidden="true" />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} aria-label={copy.send[lang]} className="profile-chat-composer__send">
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 15.5v-11m-4 4 4-4 4 4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </form>
          <div className="profile-chat-footer__mode">
            <span role="status">{modeLabel}</span>
          </div>
          {aiStatus === "loading" && (
            <progress className="profile-chat-footer__progress" value={aiProgress} max={1} aria-label={copy.aiLoading[lang]} />
          )}
          <details className="profile-chat-details">
            <summary>{labels.settings}</summary>
            <div className="profile-chat-details__body">
              <p>{modeDescription}</p>
              {(aiStatus === "idle" || aiStatus === "failed") && (
                <button type="button" onClick={() => void enableLocalAI()}>
                  {aiStatus === "failed" ? labels.retryAI : labels.enableAI}
                </button>
              )}
              <details>
                <summary>{copy.howItWorks[lang]}</summary>
                <p>{copy.howItWorksBody[lang]}</p>
              </details>
            </div>
          </details>
        </footer>
      </div>
    </dialog>
  );
}
