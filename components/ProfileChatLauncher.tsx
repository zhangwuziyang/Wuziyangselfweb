"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import CindyAvatar from "@/components/home/CindyAvatar";
import { useLang } from "@/context/LangContext";
import type { ChatOrigin } from "./profile-chat-motion";
import "./profile-chat.css";

type ChatPanel = typeof import("./ProfileChat").default;

const OpenProfileChat = createContext<(trigger: HTMLButtonElement) => void>(() => {});

function readTrigger(button: HTMLButtonElement | null): ChatOrigin | null {
  if (!button?.isConnected || button.getAttribute("aria-hidden") === "true") return null;
  const rect = button.getBoundingClientRect();
  if (!rect.width || !rect.height || rect.right <= 0 || rect.bottom <= 0
    || rect.left >= window.innerWidth || rect.top >= window.innerHeight) return null;
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

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
  const originRef = useRef<ChatOrigin | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<ChatPanel | null>(null);
  const loadingRef = useRef(false);
  const openRef = useRef(false);

  const readOrigin = useCallback((closing: boolean) => closing
    ? readTrigger(openerRef.current) ?? readTrigger(launcherRef.current) ?? originRef.current
    : originRef.current, []);

  const closeChat = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    requestAnimationFrame(() => {
      if (openRef.current) return;
      const opener = openerRef.current;
      const target = readTrigger(opener) && opener && opener.tabIndex >= 0 ? opener : launcherRef.current;
      target?.focus({ preventScroll: true });
    });
  }, []);

  const openChat = useCallback(async (trigger: HTMLButtonElement) => {
    if (openRef.current || loadingRef.current) return;
    openerRef.current = trigger;
    originRef.current = readTrigger(trigger) ?? readTrigger(launcherRef.current);
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
    openRef.current = true;
    setOpen(true);
  }, []);

  return (
    <OpenProfileChat.Provider value={openChat}>
      {children}
      <div className="profile-chat-launcher" data-open={open ? "" : undefined}>
        <button
          ref={launcherRef}
          type="button"
          tabIndex={open ? -1 : 0}
          aria-label={openLabel}
          aria-expanded={open}
          aria-controls={Panel ? "profile-chat-dialog" : undefined}
          aria-haspopup="dialog"
          aria-busy={loading}
          onClick={event => openChat(event.currentTarget)}
          className="profile-chat-launcher__button"
        >
          <span className="profile-chat-launcher__label">
            {openLabel}
          </span>
          <span className="profile-chat-launcher__avatar">
            <CindyAvatar />
          </span>
          <svg className="profile-chat-launcher__glyph" aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.5 11.5a8 8 0 0 1-8 8H4l1.5-4A8 8 0 1 1 20.5 11.5Z" />
            <path d="M9 11.5h.01m3.5 0h.01m3.5 0h.01" />
          </svg>
        </button>
      </div>
      <span className="sr-only" role="status">
        {loadFailed && (lang === "zh" ? "对话加载失败，请重试。" : "Chat failed to load. Try again.")}
      </span>
      {Panel && <Panel open={open} readOrigin={readOrigin} onClose={closeChat} />}
    </OpenProfileChat.Provider>
  );
}
