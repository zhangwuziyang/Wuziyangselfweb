"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import { useLang } from "@/context/LangContext";

/* Phone frame geometry lives inline so it holds even if the stylesheet loads
   late. Screenshots are full-screen 560x1217 captures that already contain the
   status bar and Dynamic Island, so the screen box uses exactly that ratio
   (no bands, no crop) and no fake island is drawn on top.
   Shell = screen + 2 x (7px bezel + 1px border). Height capped at
   min(600px, 64svh) (home-story.css lowers it via --phone-max-h to fit the
   short mobile scrollport); width at 72vw on phones. */
const SHOT_RATIO = 560 / 1217;
const PHONE_EDGE = 8;
const PHONE_MAX_H = "var(--phone-max-h, min(600px, 64svh))";
const PHONE_WRAP_STYLE: CSSProperties = {
  boxSizing: "border-box",
  inlineSize: `min(100%, 72vw, calc((${PHONE_MAX_H} - ${2 * PHONE_EDGE}px) * ${SHOT_RATIO.toFixed(5)} + ${2 * PHONE_EDGE}px))`,
  maxBlockSize: PHONE_MAX_H,
  containerType: "inline-size",
};
/* iPhone screen corner radius ≈ 14% of screen width; shell is concentric. */
const SCREEN_RADIUS = `calc((100cqi - ${2 * PHONE_EDGE}px) * 0.14)`;
const PHONE_SHELL_STYLE: CSSProperties = {
  position: "relative",
  boxSizing: "border-box",
  inlineSize: "100%",
  aspectRatio: "auto",
  padding: PHONE_EDGE - 1,
  borderRadius: `calc(${SCREEN_RADIUS} + ${PHONE_EDGE}px)`,
};
const PHONE_SCREEN_STYLE: CSSProperties = {
  position: "relative",
  inset: "auto",
  inlineSize: "100%",
  aspectRatio: "560 / 1217",
  overflow: "hidden",
  borderRadius: SCREEN_RADIUS,
};

export default function ProjectPreview({ frames, phone, name }: {
  frames: readonly string[];
  phone: boolean;
  name: { en: string; zh: string };
}) {
  const { lang } = useLang();
  const [index, setIndex] = useState(0);
  const app = name[lang];
  const title = lang === "zh" ? `${app} 截图 ${index + 1} / ${frames.length}` :
    `${app} screenshot ${index + 1} of ${frames.length}`;
  const image = phone ? (
    <Image
      src={frames[index]}
      alt={title}
      fill
      sizes="(max-width: 832px) 72vw, 280px"
      style={{ objectFit: "cover", objectPosition: "center" }}
    />
  ) : (
    <Image
      src={frames[index]}
      alt={title}
      width={1800}
      height={1125}
      sizes="(max-width: 832px) 84vw, (max-width: 1440px) 39vw, 610px"
      className="block h-auto w-full"
    />
  );
  function step(event: MouseEvent<HTMLButtonElement>, direction: number) {
    setIndex(current => (current + direction + frames.length) % frames.length);
    event.currentTarget.dispatchEvent(new CustomEvent("cindy:preview", { bubbles: true }));
  }

  return (
    <>
      <div className="story-project__screen">
        {phone ? (
          <div className="project-phone" style={PHONE_WRAP_STYLE}>
            <div className="phone-shell" style={PHONE_SHELL_STYLE}>
              <div className="phone-shell__screen" style={PHONE_SCREEN_STYLE}>{image}</div>
            </div>
          </div>
        ) : (
          <div className="project-browser">
            <div className="project-browser__chrome" aria-hidden="true"><span /><span /><span /></div>
            {image}
          </div>
        )}
      </div>
      <div className="story-project__controls">
        <button type="button" aria-label={lang === "zh" ? `${app} 上一张截图` : `Previous ${app} screenshot`} onClick={event => step(event, -1)}>←</button>
        <span role="status" aria-label={title}>{index + 1} / {frames.length}</span>
        <button type="button" aria-label={lang === "zh" ? `${app} 下一张截图` : `Next ${app} screenshot`} onClick={event => step(event, 1)}>→</button>
      </div>
    </>
  );
}
