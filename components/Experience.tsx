"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";
import { EXPERIENCE_DATA, t } from "@/lib/experienceData";

/* Newest first */
const TIMELINE = [...EXPERIENCE_DATA].sort((a, b) => b.start.localeCompare(a.start));

export default function Experience() {
  const { lang } = useLang();
  const e = i18n.experience;

  /* Rail fills in as the timeline scrolls through the viewport */
  const railRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 75%", "end 60%"] });
  const railFill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

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

        <ol ref={railRef} className="relative">
          {/* Rail: faint track + scroll-driven fill. x = centre of the node column */}
          <div className="absolute top-2 bottom-2 left-[11px] md:left-[171px] w-px bg-white/[0.08]" aria-hidden />
          <motion.div
            className="absolute top-2 bottom-2 left-[11px] md:left-[171px] w-px origin-top"
            style={{ scaleY: railFill, background: "linear-gradient(to bottom, #f5f5f7, rgba(245,245,247,0.25))" }}
            aria-hidden
          />

          {TIMELINE.map((exp, i) => {
            const year = exp.start.slice(0, 4);
            const newYear = i === 0 || TIMELINE[i - 1].start.slice(0, 4) !== year;

            return (
              <li key={exp.slug} className="relative grid grid-cols-[24px_1fr] md:grid-cols-[140px_64px_1fr] gap-x-4 md:gap-x-0 pb-10 last:pb-0">

                {/* Date column (desktop) */}
                <ScrollReveal delay={0.04} className="hidden md:block pt-7 pr-6 text-right">
                  {newYear && (
                    <p className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
                      {year}
                    </p>
                  )}
                  <p className="text-sm" style={{ color: "#6e6e73" }}>{t(exp.period, lang)}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#48484a" }}>{t(exp.location, lang)}</p>
                </ScrollReveal>

                {/* Node */}
                <div className="relative flex justify-center pt-8 md:pt-9">
                  <span className="relative flex h-[11px] w-[11px]">
                    {exp.current && (
                      <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: exp.accent }} />
                    )}
                    <span
                      className="relative h-[11px] w-[11px] rounded-full"
                      style={{ background: exp.accent, boxShadow: `0 0 0 4px #000, 0 0 14px ${exp.accent}80` }}
                    />
                  </span>
                </div>

                {/* Card */}
                <ScrollReveal delay={0.08} className="min-w-0">
                  {/* Date line (mobile) */}
                  <p className="md:hidden text-xs mb-3 pt-7" style={{ color: "#6e6e73" }}>
                    <span className="font-semibold" style={{ color: "#f5f5f7" }}>{t(exp.period, lang)}</span>
                    <span className="mx-1.5">·</span>
                    {t(exp.location, lang)}
                  </p>

                  <Link href={`/experience/${exp.slug}`}>
                    <article
                      className="group relative rounded-2xl p-6 md:p-8 cursor-pointer overflow-hidden transition-[background,border-color,transform] duration-[400ms] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] hover:-translate-y-0.5"
                    >
                      {/* Ambient glow */}
                      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.04] blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500" style={{ background: exp.accent }} />

                      <div className="flex items-start gap-5 mb-4">
                        {/* Logo */}
                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                          <Image src={exp.logo} alt={exp.company} width={56} height={56} className="object-contain w-11 h-11 p-1" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                              className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                              style={{ color: exp.accent, background: `${exp.accent}18`, border: `1px solid ${exp.accent}30` }}
                            >
                              {t(exp.category, lang)}
                            </span>
                            {exp.current && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ color: "#30d158", background: "#30d15814", border: "1px solid #30d15830" }}>
                                {lang === "en" ? "Current" : "进行中"}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold tracking-tight" style={{ color: "#f5f5f7", letterSpacing: "-0.015em" }}>
                            {exp.company}
                          </h3>
                          <p className="text-sm font-light mt-0.5" style={{ color: "#86868b" }}>{t(exp.role, lang)}</p>
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
                    </article>
                  </Link>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
