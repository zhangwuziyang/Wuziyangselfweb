import StoryHeading from "@/components/home/StoryHeading";
import CindyStation from "@/components/home/CindyStation";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

export default function Music() {
  const m = i18n.music;

  return (
    <section id="music" className="story-chapter">
      <div className="story-shell">
        <StoryHeading label={m.label}>
          <Localized {...m.headline1} /><br />
          <Localized {...m.headline2} /><br />
          <span className="story-title-accent"><Localized {...m.headline3} /></span>
        </StoryHeading>
        <ScrollReveal className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-9 xl:gap-14">
          <div>
            <div className="space-y-4 font-light leading-[1.8] mb-10" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "var(--story-muted)" }}>
              <p><Localized {...m.p1} /></p>
              <p><Localized {...m.p2} /></p>
              <p><Localized {...m.p3} /></p>
            </div>
            <div className="mb-2">
              <CindyStation chapter="music" reverse />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {m.credentials.map((item) => (
                <div key={item.key} className="story-panel rounded-2xl p-4"
                >
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--story-ink)" }}><Localized {...item.name} /></p>
                  <p className="text-xs font-medium" style={{ color: "var(--story-muted)" }}><Localized {...item.credential} /></p>
                  <p className="text-[11px] font-mono mt-1" style={{ color: "var(--story-dim)" }}><Localized {...item.meta} /></p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden story-photo-shadow">
            <Image
              src="/photos/music-piano.jpg"
              alt="Playing piano"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1100px) calc(50vw - 68px), 482px"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
