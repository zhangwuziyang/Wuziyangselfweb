"use client";

import { useCallback, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";
import { ChatMark } from "@/components/ui/ChatMark";

type ChatPanel = typeof import("./ProfileChat").default;

export default function ProfileChatLauncher() {
  const { lang } = useLang();
  const openLabel = lang === "zh" ? "问问我" : "Ask me";
  const [Panel, setPanel] = useState<ChatPanel | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef(false);

  const closeChat = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }, []);

  async function openChat() {
    if (loadingRef.current) return;
    if (!Panel) {
      loadingRef.current = true;
      setLoading(true);
      setLoadFailed(false);
      try {
        const { default: LoadedPanel } = await import("./ProfileChat");
        setPanel(() => LoadedPanel);
      } catch {
        setLoadFailed(true);
        return;
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    }
    setOpen(true);
  }

  return (
    <>
      <div
        className="fixed right-4 z-[101] md:right-6"
        hidden={open}
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
      >
        <button
          type="button"
          aria-label={openLabel}
          aria-expanded={open}
          aria-controls={Panel ? "profile-chat-dialog" : undefined}
          aria-haspopup="dialog"
          aria-busy={loading}
          ref={triggerRef}
          onClick={openChat}
          className="group relative flex h-[50px] w-[50px] items-center justify-end overflow-hidden rounded-full border border-white/[0.16] p-[5px] text-white backdrop-blur-2xl sm:w-auto sm:min-w-[120px] sm:justify-between sm:gap-2.5 sm:pl-4"
          style={{
            background: "linear-gradient(145deg, rgba(20,20,22,0.86), rgba(4,4,5,0.72))",
            boxShadow: "0 10px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
          }}
        >
          <span className="hidden whitespace-nowrap text-[11px] font-semibold tracking-[0.02em] text-white/80 sm:block">
            {openLabel}
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
        </button>
      </div>
      <span className="sr-only" role="status">
        {loadFailed && (lang === "zh" ? "对话加载失败，请重试。" : "Chat failed to load. Try again.")}
      </span>
      {Panel && <Panel open={open} onClose={closeChat} />}
    </>
  );
}
