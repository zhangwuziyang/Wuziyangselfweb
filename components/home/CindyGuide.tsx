"use client";

import { useEffect, useRef, useState } from "react";
import { useOpenProfileChat } from "@/components/ProfileChatLauncher";
import { useLang } from "@/context/LangContext";
import CindyAvatar from "./CindyAvatar";
import { mountCindy } from "./cindy-motion";
import { CINDY_EGG, CINDY_REPLIES, CINDY_SCENES, type Chapter, type CindyReaction } from "./cindy-scenes";

export default function CindyGuide() {
  const { lang } = useLang();
  const openChat = useOpenProfileChat();
  const [chapter, setChapter] = useState<Chapter>("hero");
  const [reaction, setReaction] = useState<CindyReaction>(null);
  const rail = useRef<HTMLElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const actor = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const sprite = useRef<HTMLCanvasElement>(null);
  const motion = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!rail.current || !dock.current || !actor.current || !button.current || !sprite.current || !motion.current) return;
    return mountCindy({
      rail: rail.current, dock: dock.current, actor: actor.current, button: button.current,
      sprite: sprite.current, motion: motion.current, onChapter: setChapter, onReaction: setReaction, openChat,
    });
  }, [openChat]);

  const label = lang === "zh" ? "和 Cindy 聊聊" : "Ask Cindy";
  const isContact = chapter === "contact";
  const line = reaction === "sleep" ? "… zzz" :
    (reaction === "egg" ? CINDY_EGG : typeof reaction === "number" ? CINDY_REPLIES[reaction] : CINDY_SCENES[chapter].line)[lang];

  return (
    <aside ref={rail} className="cindy-rail" aria-label={lang === "zh" ? "Cindy 网站导览" : "Cindy’s site guide"}>
      <div ref={dock} className="cindy-dock">
        <div ref={actor} className="cindy-actor">
          <button
            ref={button}
            className="cindy-sprite"
            type="button"
            aria-label={isContact ? label : lang === "zh" ? "和 Cindy 打招呼" : "Say hello to Cindy"}
            aria-haspopup={isContact ? "dialog" : undefined}
          >
            <span ref={motion} className="cindy-sprite__motion" aria-hidden="true">
              <span className="cindy-sprite__fallback"><CindyAvatar size={40} /></span>
              <canvas ref={sprite} width={64} height={64} />
            </span>
          </button>
        </div>
        <div className="cindy-note">
          <button
            type="button"
            className="cindy-note__chat"
            aria-label={label}
            aria-haspopup="dialog"
            onClick={event => openChat(event.currentTarget)}
          >
            Cindy <span aria-hidden="true">↗</span>
          </button>
          <p className="cindy-note__line">{line}</p>
          <span className="sr-only" role="status">{typeof reaction === "number" || reaction === "egg" ? line : ""}</span>
        </div>
      </div>
    </aside>
  );
}
