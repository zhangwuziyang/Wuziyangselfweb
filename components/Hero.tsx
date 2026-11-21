import Image from "next/image";
import StoryName from "@/components/home/StoryName";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

export default function Hero() {
  const h = i18n.hero;

  return (
    <section id="hero" className="story-hero">
      <div className="story-shell story-hero__track">
        <div className="story-hero__copy">
          <p className="story-eyebrow">
            <Localized en="Selected Works · 2024–2026" zh="个人作品集 · 2024–2026" />
          </p>
          <h1 className="story-hero__name"><StoryName /></h1>
          <p className="story-hero__sub">
            <Localized en="Economics & Information Science · Building AI Products" zh="经济学与信息科学 · 打造 AI 产品" />
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
            <a href="#experience" className="group inline-flex items-center gap-2 rounded-full bg-[#e6eefc] px-5 py-3 text-sm font-medium text-[#10192c] hover:bg-white sm:px-7">
              <Localized {...h.cta1} />
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">↗</span>
            </a>
            <a href="#about" className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white hover:border-white/55 sm:px-7">
              <Localized {...h.cta2} />
            </a>
          </div>
        </div>
        <div className="story-hero__portrait">
          <Image
            src="/photos/self-cutout.png"
            alt="Wuziyang Zhang"
            fill
            sizes="(max-width: 767px) 78vw, (max-width: 1280px) 39vw, 520px"
            className="object-contain object-bottom"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
