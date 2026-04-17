"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

export default function Philosophy() {
  const { lang } = useLang();
  const ph = i18n.philosophy;

  return (
    <section id="philosophy" style={{ background: "#f5f5f7" }} className="py-36 md:py-52">
      <div className="max-w-[1100px] mx-auto px-5">

        {/* Header — left-aligned, consistent with other sections */}
        <ScrollReveal>
          <p className="section-label mb-4">{tx(ph.label, lang)}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2
            className="font-semibold leading-[1.04] tracking-tight mb-20"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}
          >
            {tx(ph.headline, lang)}
          </h2>
        </ScrollReveal>

        {/* Blockquote — centered, max width */}
        <div className="max-w-[800px] mx-auto text-center">
          <ScrollReveal delay={0.14}>
            <blockquote
              className="font-semibold leading-[1.08] tracking-tight mb-12"
              style={{ fontSize: "clamp(1.8rem, 4.2vw, 3.6rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}
            >
              {lang === "en" ? (
                <>&ldquo;I want to create things that are<span style={{ color: "#86868b" }}> useful, elegant,</span>
                  <br className="hidden md:block" /> and impossible to forget.&rdquo;</>
              ) : (
                <>「我想创造<span style={{ color: "#86868b" }}>有用、优雅，</span>
                  <br className="hidden md:block" />且令人难以忘怀的事物。」</>
              )}
            </blockquote>
          </ScrollReveal>

          <ScrollReveal delay={0.22}>
            <div className="space-y-4 font-light leading-[1.8] max-w-lg mx-auto" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "#6e6e73" }}>
              <p>{tx(ph.p1, lang)}</p>
              <p>{tx(ph.p2, lang)}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="mt-16">
            <div className="flex items-center justify-center gap-5">
              <div className="h-px w-10 bg-[#d2d2d7]" />
              <span className="text-xs font-medium tracking-[0.22em]" style={{ color: "#86868b" }}>
                {tx(ph.signature, lang)}
              </span>
              <div className="h-px w-10 bg-[#d2d2d7]" />
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
