"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import type { ExperienceDetail } from "@/lib/experienceData";

interface Props {
  exp: ExperienceDetail;
}

export default function ExperienceDetailClient({ exp }: Props) {
  const { lang, toggle } = useLang();

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>

      {/* Top nav bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{ height: 48, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link
          href="/cindy#experience"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 text-[#6e6e73] hover:text-[#f5f5f7]"
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
          {lang === "en" ? "Experience" : "经历"}
        </Link>
        <button
          onClick={toggle}
          className="text-xs font-semibold tracking-[0.08em] px-3 py-1.5 rounded-full transition-[color,border-color] duration-200 text-[#86868b] border border-white/[0.12] hover:text-[#f5f5f7] hover:border-white/30"
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 px-5">
        <div className="max-w-[900px] mx-auto">

          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Image src={exp.logo} alt={exp.company} width={56} height={56} className="object-contain w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-0.5" style={{ color: exp.accent }}>{exp.category[lang]}</p>
                <p className="font-semibold text-lg" style={{ color: "#f5f5f7" }}>{exp.company}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1
              className="font-semibold leading-[1.04] tracking-tight mb-6"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", color: "#f5f5f7", letterSpacing: "-0.03em" }}
            >
              {exp.role[lang]}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <div className="flex flex-wrap gap-3 mb-10">
              {[exp.period[lang], exp.location[lang]].map((item) => (
                <span key={item} className="text-sm px-3 py-1.5 rounded-full" style={{ color: "#86868b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {item}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <p className="font-light leading-[1.8] max-w-2xl" style={{ fontSize: "clamp(1rem, 1.6vw, 1.1rem)", color: "#a1a1a6" }}>
              {exp.overview[lang]}
            </p>
          </ScrollReveal>
        </div>
      </header>

      {/* Accent divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${exp.accent}60, transparent)`, transformOrigin: "left" }} />

      {/* Metrics */}
      <section className="py-20 px-5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-[900px] mx-auto">
          <div
            data-scroll-reveal=""
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {exp.metrics.map((m, i) => (
              <div
                key={i}
                data-scroll-reveal=""
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="font-semibold leading-none tracking-tight mb-2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: exp.accent, letterSpacing: "-0.02em" }}>
                  {m.value}
                </p>
                <p className="text-xs font-medium leading-relaxed" style={{ color: "#6e6e73" }}>{m.label[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 px-5 pb-32">
        <div className="max-w-[900px] mx-auto space-y-16">
          {exp.sections.map((sec, i) => (
            <div
              key={i}
              data-scroll-reveal=""
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8"
            >
              {/* Section title */}
              <div className="md:pt-1">
                <div className="w-5 h-0.5 mb-3 rounded-full" style={{ background: exp.accent }} />
                <h3 className="text-sm font-semibold tracking-tight" style={{ color: "#86868b" }}>
                  {sec.title[lang]}
                </h3>
              </div>
              {/* Points */}
              <ul className="space-y-4">
                {sec.points[lang].map((pt, j) => (
                  <li key={j} className="flex items-start gap-3 font-light leading-[1.75]" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", color: "#d1d1d6" }}>
                    <span className="shrink-0 mt-[6px] w-1 h-1 rounded-full" style={{ background: exp.accent }} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="px-5 pb-32">
        <div className="max-w-[900px] mx-auto">
          <div
            data-scroll-reveal=""
            className="rounded-3xl p-10"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-6" style={{ color: "#48484a" }}>
              {lang === "en" ? "Tools & Methods" : "工具与方法"}
            </p>
            <div className="flex flex-wrap gap-2">
              {exp.tools.map((tool) => (
                <span key={tool} className="text-sm px-3.5 py-1.5 rounded-full" style={{ color: "#86868b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom nav */}
      <div className="px-5 pb-20">
        <div className="max-w-[900px] mx-auto pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            href="/cindy#experience"
            className="group inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 text-[#6e6e73] hover:text-[#f5f5f7]"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200 inline-block">←</span>
            {lang === "en" ? "Back to all experience" : "返回全部经历"}
          </Link>
        </div>
      </div>

    </div>
  );
}
