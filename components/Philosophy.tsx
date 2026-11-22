import StoryHeading from "@/components/home/StoryHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

export default function Philosophy() {
  const ph = i18n.philosophy;

  return (
    <section id="philosophy" className="story-chapter">
      <div className="story-shell">

        <StoryHeading label={ph.label}>
          <Localized {...ph.headline} />
        </StoryHeading>

        <ScrollReveal className="max-w-3xl border-l border-[var(--story-edge)] pl-5 sm:pl-8">
          <blockquote
            data-cindy-anchor=""
            className="mb-8 text-[clamp(1.7rem,3.5vw,3.65rem)] font-medium leading-[1.12] tracking-tight"
          >
            <Localized en={
              <>&ldquo;I want to build things that are<span className="story-title-accent"> useful, elegant,</span>
                <br className="hidden md:block" /> and hard to forget.&rdquo;</>
            } zh={
              <>「我想做出<span className="story-title-accent">实用、优雅，</span>
                <br className="hidden md:block" />又让人念念不忘的作品。」</>
            } />
          </blockquote>

          <div className="space-y-4 font-light leading-[1.8] max-w-lg mx-auto" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "var(--story-muted)" }}>
            <p><Localized {...ph.p1} /></p>
            <p><Localized {...ph.p2} /></p>
          </div>

          <div className="mt-9 flex items-center gap-4">
            <div className="h-px w-10 bg-[var(--story-edge)]" />
            <span data-cindy-content="" className="text-xs font-medium tracking-[0.22em]" style={{ color: "var(--story-dim)" }}>
              <Localized {...ph.signature} />
            </span>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
