"use client";

import { useEffect, useRef } from "react";
import { useOpenProfileChat } from "@/components/ProfileChatLauncher";
import { useLang } from "@/context/LangContext";
import CindyAvatar from "./CindyAvatar";
import { mountCindy } from "./cindy-motion";
import { CINDY_BITMAP } from "./cindy-sprite";
import "./cindy-guide.css";

export default function CindyGuide() {
  const { lang } = useLang();
  const openChat = useOpenProfileChat();
  const dock = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const sprite = useRef<HTMLCanvasElement>(null);
  const note = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!dock.current || !button.current || !sprite.current || !note.current) return;
    return mountCindy({ dock: dock.current, button: button.current, sprite: sprite.current, note: note.current });
  }, []);

  return (
    <aside className="cindy-overlay" aria-label={lang === "zh" ? "Cindy 网站导览" : "Cindy’s site guide"}>
      <div ref={dock} className="cindy-dock">
        <div className="cindy-shadow" aria-hidden="true" />
        <button
          ref={button}
          className="cindy-sprite"
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          aria-label={lang === "zh" ? "和 Cindy 聊聊" : "Ask Cindy"}
          aria-haspopup="dialog"
          onClick={event => openChat(event.currentTarget)}
        >
          <span className="cindy-sprite__art" aria-hidden="true">
            <span className="cindy-sprite__fallback"><CindyAvatar size={40} /></span>
            <canvas ref={sprite} width={CINDY_BITMAP} height={CINDY_BITMAP} />
          </span>
        </button>
        <p className="cindy-hint" aria-hidden="true">
          {lang === "zh" ? "可以随时和我聊聊" : "Tap me to chat anytime"}
        </p>
        <p ref={note} className="cindy-note" aria-hidden="true" />
      </div>
    </aside>
  );
}
