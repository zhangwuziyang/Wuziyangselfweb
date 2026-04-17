"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

const EASE = [0.25, 0.1, 0.25, 1.0] as const;
const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.0, delay, ease: EASE },
});

export default function Hero() {
  const { lang } = useLang();
  const h = i18n.hero;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0602" }}
    >
      {/* Full-bleed portrait */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
        className="absolute inset-0"
      >
        <Image
          src="/images/background.jpg"
          alt="Wuziyang Zhang"
          fill
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Top dark fade — sky behind text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,4,1,0.55) 0%, rgba(8,4,1,0.25) 36%, rgba(8,4,1,0.05) 56%, rgba(8,4,1,0.35) 80%, rgba(8,4,1,0.75) 100%)",
        }}
      />
      {/* Side vignette — symmetric left/right depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 100% at 50% 50%, transparent 38%, rgba(8,4,1,0.4) 100%)",
        }}
      />

      {/* Centered content */}
      <div className="relative z-20 flex flex-col items-center text-center px-5 w-full max-w-[860px] mx-auto -mt-16">
        <motion.p
          {...fade(0.2)}
          className="text-[10px] font-medium tracking-[0.42em] uppercase mb-6"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {lang === "en" ? "Portfolio · Wuziyang Zhang" : "张吴梓洋 · 个人作品集"}
        </motion.p>

        <div style={{ lineHeight: 0.92, letterSpacing: "-0.04em" }}>
          <motion.div
            {...fade(0.32)}
            className="font-semibold"
            style={{
              fontSize: lang === "zh" ? "clamp(3.6rem, 12vw, 9.5rem)" : "clamp(4rem, 13vw, 9.5rem)",
              color: "#f5ede0",
              letterSpacing: "0.02em",
              textShadow: "0 2px 30px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.3)",
            }}
          >
            {lang === "en" ? "Wuziyang" : "张吴梓洋"}
          </motion.div>
          {lang === "en" && (
            <motion.div
              {...fade(0.44)}
              className="font-semibold relative -z-10"
              style={{
                fontSize: "clamp(4rem, 13vw, 9.5rem)",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Zhang
            </motion.div>
          )}
        </div>

        <motion.p
          {...fade(0.56)}
          className="font-light mt-5 tracking-widest"
          style={{
            fontSize: "clamp(0.78rem, 1.3vw, 0.92rem)",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.22em",
          }}
        >
          {lang === "en"
            ? "Economics · Information Science · AI Products"
            : "经济学 · 信息科学 · AI 产品"}
        </motion.p>

        <motion.div
          {...fade(0.72)}
          className="flex flex-col sm:flex-row gap-3 mt-9 justify-center items-center"
        >
          <button
            onClick={() =>
              document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" })
            }
            className="group flex items-center gap-2 text-sm font-medium rounded-full transition-[background,transform] duration-300 hover:scale-[1.03] active:scale-[0.97] px-[30px] py-[11px] text-[#1a1a1a] bg-white/90 hover:bg-white"
          >
            {tx(h.cta1, lang)}
            <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200">
              ↗
            </span>
          </button>
          <button
            onClick={() =>
              document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-sm font-medium rounded-full transition-[background,transform] duration-300 hover:scale-[1.03] active:scale-[0.97] px-[30px] py-[11px] text-[#f5ede0] bg-transparent hover:bg-white/10"
            style={{ border: "1.5px solid rgba(255,255,255,0.7)" }}
          >
            {tx(h.cta2, lang)}
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 1.2 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          className="text-[10px] tracking-[0.5em] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {tx(h.scroll, lang)}
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          className="w-px h-7"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
