"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

const INFO_KEYS = ["Email", "Location", "University", "Status"] as const;

export default function Contact() {
  const { lang } = useLang();
  const c = i18n.contact;

  const infoValues: Record<string, string> = {
    Email:      "wuziyang@wisc.edu",
    Location:   tx(c.infoValues.Location, lang),
    University: tx(c.infoValues.University, lang),
    Status:     tx(c.infoValues.Status, lang),
  };

  return (
    <section id="contact" className="py-32 md:py-52" style={{ background: "#000" }}>
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="max-w-[800px]">

          <ScrollReveal>
            <p className="section-label-dark mb-10">{tx(c.label, lang)}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h2
              className="font-semibold leading-[1.04] tracking-tight mb-8"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", color: "#f5f5f7", letterSpacing: "-0.03em" }}
            >
              {tx(c.headline1, lang)}
              <br />{tx(c.headline2, lang)}
              <br /><span style={{ color: "#424245" }}>{tx(c.headline3, lang)}</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p
              className="font-light leading-[1.8] mb-14 max-w-xl"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.125rem)", color: "#6e6e73" }}
            >
              {tx(c.body, lang)}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.22}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-20">
              <a
                href="mailto:wuziyang@wisc.edu"
                className="group inline-flex items-center gap-2 text-sm font-medium rounded-full transition-colors duration-300 px-7 py-3 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-white"
              >
                {tx(c.sendEmail, lang)}
                <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/wuziyang-zhang"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium rounded-full transition-[background,border-color] duration-300 px-7 py-3 text-[#f5f5f7] border border-white/[0.18] hover:bg-white/[0.08] hover:border-white/[0.35]"
              >
                {tx(c.linkedin, lang)}
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium rounded-full transition-[background,border-color] duration-300 px-7 py-3 text-[#f5f5f7] border border-white/[0.18] hover:bg-white/[0.08] hover:border-white/[0.35]"
              >
                {tx(c.resume, lang)}
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.28}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {INFO_KEYS.map((key) => (
                <div key={key}>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: "#48484a" }}>
                    {tx(c.infoLabels[key], lang)}
                  </p>
                  <p className="text-sm font-medium" style={{ color: "#d1d1d6" }}>{infoValues[key]}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
