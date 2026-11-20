import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

export default function Philosophy() {
  const ph = i18n.philosophy;

  return (
    <section id="philosophy" data-nav-surface="light" style={{ background: "#f5f5f7" }} className="py-36 md:py-52">
      <div className="max-w-[1100px] mx-auto px-5">

        {/* Header — left-aligned, consistent with other sections */}
        <ScrollReveal>
          <p className="section-label mb-4"><Localized {...ph.label} /></p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h2
            className="font-semibold leading-[1.04] tracking-tight mb-20"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}
          >
            <Localized {...ph.headline} />
          </h2>
        </ScrollReveal>

        {/* Blockquote — centered, max width */}
        <ScrollReveal delay={60} className="max-w-[800px] mx-auto text-center">
          <blockquote
            className="font-semibold leading-[1.08] tracking-tight mb-12"
            style={{ fontSize: "clamp(1.8rem, 4.2vw, 3.6rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}
          >
            <Localized en={
              <>&ldquo;I want to build things that are<span style={{ color: "#86868b" }}> useful, elegant,</span>
                <br className="hidden md:block" /> and hard to forget.&rdquo;</>
            } zh={
              <>「我想做出<span style={{ color: "#86868b" }}>实用、优雅，</span>
                <br className="hidden md:block" />又让人念念不忘的作品。」</>
            } />
          </blockquote>

          <div className="space-y-4 font-light leading-[1.8] max-w-lg mx-auto" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "#6e6e73" }}>
            <p><Localized {...ph.p1} /></p>
            <p><Localized {...ph.p2} /></p>
          </div>

          <div className="mt-16 flex items-center justify-center gap-5">
            <div className="h-px w-10 bg-[#d2d2d7]" />
            <span className="text-xs font-medium tracking-[0.22em]" style={{ color: "#86868b" }}>
              <Localized {...ph.signature} />
            </span>
            <div className="h-px w-10 bg-[#d2d2d7]" />
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
