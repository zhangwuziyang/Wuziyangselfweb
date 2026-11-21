"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { useLang } from "@/context/LangContext";

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
    <Image src={frames[index]} alt={title} fill sizes="(max-width: 832px) 32vw, 224px" className="object-contain" />
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
          <div className="project-phone phone-shell"><div className="phone-shell__screen">{image}</div></div>
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
