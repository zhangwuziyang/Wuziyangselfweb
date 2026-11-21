"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import CindyAvatar from "@/components/home/CindyAvatar";
import { useLang } from "@/context/LangContext";

type ChatPanel = typeof import("./ProfileChat").default;

const OpenProfileChat = createContext<(trigger: HTMLButtonElement) => void>(() => {});

export function useOpenProfileChat() {
  return useContext(OpenProfileChat);
}

export default function ProfileChatLauncher({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const openLabel = lang === "zh" ? "和 Cindy 聊聊" : "Ask Cindy";
  const [Panel, setPanel] = useState<ChatPanel | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<ChatPanel | null>(null);
  const loadingRef = useRef(false);

  const closeChat = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => {
      if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
    });
  }, []);

  const openChat = useCallback(async (trigger: HTMLButtonElement) => {
    if (loadingRef.current) return;
    openerRef.current = trigger;
    if (!panelRef.current) {
      loadingRef.current = true;
      setLoading(true);
      setLoadFailed(false);
      try {
        const { default: LoadedPanel } = await import("./ProfileChat");
        panelRef.current = LoadedPanel;
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
  }, []);

  return (
    <OpenProfileChat.Provider value={openChat}>
      {children}
      <div
        className="profile-chat-launcher fixed right-4 z-[101] md:right-6"
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
          onClick={event => openChat(event.currentTarget)}
          className="flex h-[50px] w-[50px] items-center justify-end rounded-full border border-white/15 bg-[#121318] p-[5px] text-white shadow-xl sm:w-auto sm:min-w-[120px] sm:justify-between sm:gap-2.5 sm:pl-4"
        >
          <span className="hidden whitespace-nowrap text-[11px] font-semibold tracking-[0.02em] text-white/80 sm:block">
            {openLabel}
          </span>
          <span className="grid size-[38px] shrink-0 place-items-center rounded-full border border-white/10 bg-[#26272c]">
            <CindyAvatar />
          </span>
        </button>
      </div>
      <span className="sr-only" role="status">
        {loadFailed && (lang === "zh" ? "对话加载失败，请重试。" : "Chat failed to load. Try again.")}
      </span>
      {Panel && <Panel open={open} onClose={closeChat} />}
    </OpenProfileChat.Provider>
  );
}
