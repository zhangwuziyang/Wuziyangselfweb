import type { ReactNode } from "react";
import { Localized } from "@/components/ui/Localized";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import CindyStation from "./CindyStation";
import type { Chapter } from "./cindy-scenes";

export default function StoryHeading({ label, children, station }: {
  label: { en: string; zh: string }; children: ReactNode; station?: Chapter;
}) {
  return (
    <header className={station ? "story-heading cindy-station-row" : "story-heading"}>
      <ScrollReveal>
        <p className="story-eyebrow"><Localized {...label} /></p>
        <h2 className="story-title">{children}</h2>
      </ScrollReveal>
      {station && <CindyStation chapter={station} />}
    </header>
  );
}
