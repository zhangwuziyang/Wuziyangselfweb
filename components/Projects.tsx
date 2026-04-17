"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

export default function Projects() {
  const { lang } = useLang();
  const p = i18n.projects;
  const cc = p.chartcreator;
  const cap = p.codeandpower;

  return (
    <section id="projects" style={{ background: "#f5f5f7" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">

        <ScrollReveal>
          <p className="section-label mb-4">{tx(p.label, lang)}</p>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <ScrollReveal delay={0.08}>
            <h2 className="font-semibold leading-[1.04] tracking-tight" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}>
              {tx(p.headline, lang)}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.14}>
            <p className="text-sm font-light max-w-xs leading-relaxed" style={{ color: "#6e6e73" }}>
              {tx(p.tagline, lang).split("\n")[0]}
            </p>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-5">

          {/* ChartCreator */}
          <ScrollReveal delay={0.1}>
            <article
              className="rounded-3xl overflow-hidden transition-[box-shadow,transform] duration-[400ms] bg-white hover:-translate-y-[3px] shadow-[0_2px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="lg:order-2 relative min-h-[280px] lg:min-h-0" style={{ background: "#f0f0f2" }}>
                  <Image src="/photos/screenshot-chartcreator.png" alt="ChartCreator UI" fill className="object-cover object-top" sizes="(max-width:1024px) 100vw, 50vw" />
                </div>
                <div className="p-10 md:p-14 flex flex-col justify-center lg:order-1">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ color: "#0071e3", background: "rgba(0,113,227,0.08)", border: "1px solid rgba(0,113,227,0.2)" }}>
                      {tx(cc.tag1, lang)}
                    </span>
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ color: "#1d1d1f", background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.08)" }}>
                      {tx(cc.tag2, lang)}
                    </span>
                  </div>
                  <h3 className="font-semibold tracking-tight mb-3" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                    ChartCreator
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "#6e6e73" }}>{tx(cc.desc, lang)}</p>
                  <ul className="space-y-2 mb-8">
                    {cc.points[lang].map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-light leading-relaxed" style={{ color: "#6e6e73" }}>
                        <span style={{ color: "#0071e3" }} className="shrink-0 mt-[3px]">—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["Next.js", "Tailwind CSS", "AI APIs", "Figma", "Prompt Engineering"].map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: "#6e6e73", border: "1px solid rgba(0,0,0,0.1)", background: "#f5f5f7" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link href="/experience/chartcreator" className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 w-fit" style={{ color: "#0071e3" }}>
                    {tx(cc.cta, lang)}
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">→</span>
                  </Link>
                </div>
              </div>
            </article>
          </ScrollReveal>

          {/* Code and Power */}
          <ScrollReveal delay={0.1}>
            <article
              className="rounded-3xl overflow-hidden transition-[box-shadow,transform] duration-[400ms] bg-white hover:-translate-y-[3px] shadow-[0_2px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="lg:order-1 relative min-h-[280px] lg:min-h-0" style={{ background: "#f0f0f2" }}>
                  <Image src="/photos/screenshot-codeandpower.png" alt="Code and Power" fill className="object-cover object-top" sizes="(max-width:1024px) 100vw, 50vw" />
                </div>
                <div className="p-10 md:p-14 flex flex-col justify-center lg:order-2">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ color: "#6e6e73", background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.08)" }}>
                      {tx(cap.tag1, lang)}
                    </span>
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ color: "#6e6e73", background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.08)" }}>
                      {tx(cap.tag2, lang)}
                    </span>
                  </div>
                  <h3 className="font-semibold tracking-tight mb-3" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                    Code and Power
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "#6e6e73" }}>{tx(cap.desc, lang)}</p>
                  <ul className="space-y-2 mb-8">
                    {cap.points[lang].map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-light leading-relaxed" style={{ color: "#6e6e73" }}>
                        <span style={{ color: "#0071e3" }} className="shrink-0 mt-[3px]">—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["HTML", "CSS", "Teachable Machine", "TensorFlow.js", "GitHub Pages"].map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: "#6e6e73", border: "1px solid rgba(0,0,0,0.1)", background: "#f5f5f7" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link href="/projects/codeandpower" className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 w-fit" style={{ color: "#0071e3" }}>
                    {tx(cap.cta, lang)}
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">→</span>
                  </Link>
                </div>
              </div>
            </article>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
