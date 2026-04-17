"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

export default function Skills() {
  const { lang } = useLang();
  const s = i18n.skills;

  return (
    <section id="skills" style={{ background: "#1d1d1f" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">

        <ScrollReveal>
          <p className="section-label-dark mb-4">{tx(s.label, lang)}</p>
        </ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-20">
          <ScrollReveal delay={0.08}>
            <h2 className="font-semibold leading-[1.04] tracking-tight" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#f5f5f7", letterSpacing: "-0.025em" }}>
              {tx(s.headline, lang)}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.14}>
            <p className="text-sm font-light max-w-xs leading-relaxed" style={{ color: "#6e6e73" }}>
              {tx(s.tagline, lang)}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {s.groups.map((group, i) => (
            <ScrollReveal key={i} delay={i * 0.07}>
              <div
                className="rounded-2xl p-8 h-full transition-[background,transform] duration-300 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg select-none" style={{ color: "#48484a" }}>{group.symbol}</span>
                  <h3 className="font-medium text-[15px] tracking-tight" style={{ color: "#f5f5f7" }}>
                    {tx(group.category, lang)}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills[lang].map((skill) => (
                    <span key={skill} className="text-[13px] px-3 py-1.5 rounded-full cursor-default transition-[color,border-color,transform] duration-200 hover:scale-[1.04] bg-white/[0.05] border text-[#86868b] border-white/[0.08] hover:text-[#f5f5f7] hover:border-white/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
