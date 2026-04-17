"use client";

import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";
import { EXPERIENCE_DATA, t } from "@/lib/experienceData";

export default function Experience() {
  const { lang } = useLang();
  const e = i18n.experience;

  return (
    <section id="experience" style={{ background: "#000" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">

        <ScrollReveal>
          <p className="section-label-dark mb-4">{tx(e.label, lang)}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2
            className="font-semibold leading-[1.04] tracking-tight mb-20"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#f5f5f7", letterSpacing: "-0.025em" }}
          >
            {tx(e.headline, lang)}
          </h2>
        </ScrollReveal>

        <div className="space-y-4">
          {EXPERIENCE_DATA.map((exp, i) => (
            <ScrollReveal key={exp.slug} delay={i * 0.06}>
              <Link href={`/experience/${exp.slug}`}>
                <article
                  className="group relative rounded-2xl p-8 md:p-10 cursor-pointer overflow-hidden transition-[background,border-color,transform] duration-[400ms] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] hover:-translate-y-0.5"
                >
                  {/* Accent left bar */}
                  <div className="absolute top-0 left-0 w-[3px] h-full rounded-l-2xl" style={{ background: exp.accent }} />
                  {/* Ambient glow */}
                  <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.04] blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500" style={{ background: exp.accent }} />

                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    {/* Logo */}
                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                      <Image src={exp.logo} alt={exp.company} width={56} height={56} className="object-contain w-12 h-12 p-1" />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <span
                            className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full mb-2"
                            style={{ color: exp.accent, background: `${exp.accent}18`, border: `1px solid ${exp.accent}30` }}
                          >
                            {t(exp.category, lang)}
                          </span>
                          <h3 className="text-xl font-semibold tracking-tight" style={{ color: "#f5f5f7", letterSpacing: "-0.015em" }}>
                            {exp.company}
                          </h3>
                          <p className="text-sm font-light mt-0.5" style={{ color: "#86868b" }}>{t(exp.role, lang)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm" style={{ color: "#6e6e73" }}>{t(exp.period, lang)}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#48484a" }}>{t(exp.location, lang)}</p>
                        </div>
                      </div>

                      {/* Tagline */}
                      <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "#6e6e73" }}>
                        {t(exp.tagline, lang)}
                      </p>

                      {/* Metric chips */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {exp.metrics.slice(0, 4).map((m) => (
                          <div key={m.value} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: `${exp.accent}0f`, border: `1px solid ${exp.accent}20` }}>
                            <span className="font-semibold" style={{ color: exp.accent }}>{m.value}</span>
                            <span style={{ color: "#6e6e73" }}>{t(m.label, lang)}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-2.5" style={{ color: exp.accent }}>
                        {lang === "en" ? "View full case" : "查看详细案例"}
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
