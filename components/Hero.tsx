import Image from "next/image";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

export default function Hero() {
  const h = i18n.hero;

  return (
    <section
      id="hero" data-nav-surface="dark"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0602" }}
    >
      {/* Full-bleed portrait */}
      <div className="absolute inset-0">
        <Image
          src="/images/background.jpg"
          alt="Wuziyang Zhang"
          fill
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
          preload
          sizes="100vw"
        />
      </div>

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
        <p
          className="text-[10px] font-medium tracking-[0.42em] uppercase mb-6"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <Localized en="Portfolio · Wuziyang Zhang" zh="张吴梓洋 · 个人作品集" />
        </p>

        <div style={{ lineHeight: 0.92, letterSpacing: "-0.04em" }}>
          <div className="hero-name font-semibold">
            <Localized en="Wuziyang" zh="张吴梓洋" />
          </div>
          <Localized en={
            <div
              className="font-semibold relative -z-10"
              style={{ fontSize: "clamp(4rem, 13vw, 9.5rem)", color: "rgba(255,255,255,0.15)" }}
            >
              Zhang
            </div>
          } zh={null} />
        </div>

        <p
          className="font-light mt-5 tracking-widest"
          style={{
            fontSize: "clamp(0.78rem, 1.3vw, 0.92rem)",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.22em",
          }}
        >
          <Localized en="Economics · Information Science · AI Products" zh="经济学 · 信息科学 · AI 产品" />
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 mt-9 justify-center items-center"
        >
          <a
            href="#experience"
            className="group flex items-center gap-2 text-sm font-medium rounded-full transition-[background,transform] duration-300 hover:scale-[1.03] active:scale-[0.97] px-[30px] py-[11px] text-[#1a1a1a] bg-white/90 hover:bg-white"
          >
            <Localized {...h.cta1} />
            <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200">
              ↗
            </span>
          </a>
          <a
            href="#about"
            className="text-sm font-medium rounded-full transition-[background,transform] duration-300 hover:scale-[1.03] active:scale-[0.97] px-[30px] py-[11px] text-[#f5ede0] bg-transparent hover:bg-white/10"
            style={{ border: "1.5px solid rgba(255,255,255,0.7)" }}
          >
            <Localized {...h.cta2} />
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="section-transition absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white" />

      {/* Scroll indicator */}
      <div
        data-scroll-indicator=""
        className="hero-scroll-indicator absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span
          className="text-[10px] tracking-[0.5em] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <Localized {...h.scroll} />
        </span>
        <div
          className="w-px h-7"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
          }}
        />
      </div>
    </section>
  );
}
