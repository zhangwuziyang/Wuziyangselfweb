import type { ReactNode } from "react";
import { Localized } from "@/components/ui/Localized";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function StoryHeading({ label, children }: { label: { en: string; zh: string }; children: ReactNode }) {
  return (
    <header className="story-heading" data-story-pin-track="">
      <div className="story-heading__pin">
        <ScrollReveal>
          <p className="story-eyebrow"><Localized {...label} /></p>
          <h2 className="story-title">{children}</h2>
        </ScrollReveal>
      </div>
    </header>
  );
}
