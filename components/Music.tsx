"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

export default function Music() {
  const { lang } = useLang();
  const m = i18n.music;

  return (
    <section id="music" style={{ background: "#fff" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div>
            <ScrollReveal>
              <p className="section-label mb-4">{tx(m.label, lang)}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="font-semibold leading-[1.04] tracking-tight mb-7" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}>
                {tx(m.headline1, lang)}<br />
                {tx(m.headline2, lang)}<br />
                <span style={{ color: "#86868b" }}>{tx(m.headline3, lang)}</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.14}>
              <div className="space-y-4 font-light leading-[1.8] mb-10" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "#6e6e73" }}>
                <p>{tx(m.p1, lang)}</p>
                <p>{tx(m.p2, lang)}</p>
                <p>{tx(m.p3, lang)}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                {m.credentials.map((item) => (
                  <div key={item.key} className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <p className="font-semibold text-sm mb-1" style={{ color: "#1d1d1f" }}>{tx(item.name, lang)}</p>
                    <p className="text-xs font-medium" style={{ color: "#6e6e73" }}>{tx(item.credential, lang)}</p>
                    <p className="text-[11px] font-mono mt-1" style={{ color: "#86868b" }}>{tx(item.meta, lang)}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.18}>
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/photos/music-piano.jpg"
                alt="Playing piano"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
