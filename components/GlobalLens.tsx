"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CountUp } from "@/components/ui/CountUp";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

const STATS = [
  { end: 20,  suffix: "+", labelKey: "Countries"  },
  { end: 100, suffix: "+", labelKey: "Cities"     },
  { end: 5,   suffix: "",  labelKey: "Continents" },
];

export default function GlobalLens() {
  const { lang } = useLang();
  const g = i18n.global;

  return (
    <section id="global" style={{ background: "#000" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">

        <ScrollReveal>
          <p className="section-label-dark mb-4">{tx(g.label, lang)}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2 className="font-semibold leading-[1.04] tracking-tight mb-6" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#f5f5f7", letterSpacing: "-0.025em" }}>
            {tx(g.headline1, lang)}<br />
            <span style={{ color: "#424245" }}>{tx(g.headline2, lang)}</span>
          </h2>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.14}>
          <div className="flex flex-wrap gap-14 mb-16">
            {STATS.map((s) => (
              <div key={s.labelKey}>
                <p className="font-semibold leading-none tracking-tight" style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", color: "#f5f5f7", letterSpacing: "-0.03em" }}>
                  <CountUp end={s.end} suffix={s.suffix} duration={2.4} />
                </p>
                <p className="text-xs mt-2 tracking-[0.15em] uppercase font-medium" style={{ color: "#6e6e73" }}>
                  {tx(g.statLabels[s.labelKey as keyof typeof g.statLabels], lang)}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Cinematic image */}
        <ScrollReveal delay={0.18}>
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-14">
            <Image src="/photos/travel-machu-picchu.jpg" alt="Machu Picchu, Peru" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
            <p className="absolute bottom-4 right-5 text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              {lang === "en" ? "Machu Picchu, Peru" : "马丘比丘，秘鲁"}
            </p>
          </div>
        </ScrollReveal>

        {/* Copy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 mb-14">
          <ScrollReveal delay={0.2}>
            <p className="font-light leading-[1.8]" style={{ fontSize: "clamp(1rem, 1.6vw, 1.1rem)", color: "#d1d1d6" }}>
              {tx(g.p1, lang)}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.26}>
            <p className="font-light leading-[1.8]" style={{ fontSize: "clamp(1rem, 1.6vw, 1.125rem)", color: "#6e6e73" }}>
              {tx(g.p2, lang)}
            </p>
          </ScrollReveal>
        </div>

        {/* City photo grid */}
        <ScrollReveal delay={0.28}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {g.cityPhotos.map((item) => (
              <div key={item.src} className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src={item.src} alt={tx(item.city, lang)} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-[600ms]" sizes="(max-width:640px) 50vw, 25vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-sm font-medium leading-none mb-0.5">{tx(item.city, lang)}</p>
                  <p className="text-[11px]" style={{ color: "#86868b" }}>{tx(item.note, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Text city grid */}
        <ScrollReveal delay={0.33}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {g.cityGrid.map((item) => (
              <div key={tx(item.city, "en")} className="rounded-xl p-4 transition-[background,transform] duration-300 hover:scale-[1.02] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07]"
              >
                <p className="font-medium text-sm mb-0.5" style={{ color: "#f5f5f7" }}>{tx(item.city, lang)}</p>
                <p className="text-xs" style={{ color: "#6e6e73" }}>{tx(item.note, lang)}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
