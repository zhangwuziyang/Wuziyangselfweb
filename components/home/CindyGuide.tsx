"use client";

import { useEffect, useRef, useState } from "react";
import { useOpenProfileChat } from "@/components/ProfileChatLauncher";
import { useLang } from "@/context/LangContext";
import CindyAvatar from "./CindyAvatar";
import { mountCindy } from "./cindy-motion";
import { CINDY_BITMAP } from "./cindy-sprite";
import "./cindy-guide.css";
import { CINDY_EGG, CINDY_REPLIES, CINDY_SCENES, CINDY_SKILLS, type Chapter, type CindyReaction } from "./cindy-scenes";

export default function CindyGuide() {
  const { lang } = useLang();
  const openChat = useOpenProfileChat();
  const [chapter, setChapter] = useState<Chapter>("hero");
  const [reaction, setReaction] = useState<CindyReaction>(null);
  const overlay = useRef<HTMLElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const sprite = useRef<HTMLCanvasElement>(null);
  const motion = useRef<HTMLSpanElement>(null);
  const note = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlay.current || !dock.current || !button.current || !sprite.current || !motion.current || !note.current) return;
    return mountCindy({
      overlay: overlay.current, dock: dock.current, button: button.current, sprite: sprite.current,
      motion: motion.current, note: note.current, onChapter: setChapter, onReaction: setReaction, openChat,
    });
  }, [openChat]);

  const label = lang === "zh" ? "和 Cindy 聊聊" : "Ask Cindy";
  const isContact = chapter === "contact";
  const scene = CINDY_SCENES[chapter];
  const reply = reaction === "sleep" ? "… zzz"
    : (reaction === "egg" ? CINDY_EGG : typeof reaction === "number" ? CINDY_REPLIES[reaction] : undefined)?.[lang];
  const prompt = lang === "zh" ? "点我聊聊。" : "Tap to chat.";
  const cue = reaction === "sleep" ? "zzz" : reaction === "egg" ? "✦"
    : typeof reaction === "number" ? (lang === "zh" ? "嗨！" : "Hi!")
      : scene.cue[lang];

  return (
    <aside ref={overlay} className="cindy-overlay" aria-label={lang === "zh" ? "Cindy 网站导览" : "Cindy’s site guide"}>
      <div ref={dock} className="cindy-dock">
        <div className="cindy-orbit" aria-hidden="true">
          {CINDY_SKILLS.map(skill => <span key={skill.en}>{skill[lang]}</span>)}
        </div>
        <div className="cindy-notes" aria-hidden="true"><span>♪</span><span>♫</span></div>
        <div className="cindy-shadow" aria-hidden="true" />
        <div className="cindy-actor">
          <button
            ref={button}
            className="cindy-sprite"
            type="button"
            aria-label={isContact ? label : lang === "zh" ? "和 Cindy 打招呼" : "Say hello to Cindy"}
            aria-haspopup={isContact ? "dialog" : undefined}
          >
            <span ref={motion} className="cindy-sprite__motion" aria-hidden="true">
              <span className="cindy-sprite__breath">
                <span className="cindy-sprite__fallback"><CindyAvatar size={40} /></span>
                <canvas ref={sprite} width={CINDY_BITMAP} height={CINDY_BITMAP} />
              </span>
            </span>
          </button>
        </div>
        <div ref={note} className="cindy-dialogue">
          <div className="cindy-note-sample cindy-note--wide">
            <span className="cindy-note__name">Cindy</span>
            <p className="cindy-note__full">{reply ?? scene.line[lang]}</p>
            <p className="cindy-note__short">{reply ?? scene.short[lang]}</p>
          </div>
          <div className="cindy-note-sample cindy-note--compact">
            <span className="cindy-note__name">Cindy</span>
            <p className="cindy-note__full">{reply ?? (isContact ? scene.line[lang] : scene.short[lang])}</p>
            <p className="cindy-note__short">{reply ?? scene.short[lang]}</p>
          </div>
          <div className="cindy-note-sample cindy-note--edge">
            <p>{cue}</p>
          </div>
          <div className="cindy-note-sample cindy-note--docked">
            <p>{prompt}</p>
          </div>
        </div>
        <span className="sr-only" role="status">{typeof reaction === "number" || reaction === "egg" ? reply : ""}</span>
      </div>
    </aside>
  );
}
