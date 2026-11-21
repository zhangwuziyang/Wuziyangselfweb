import StoryHeading from "@/components/home/StoryHeading";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

function renderTags(tags: readonly string[]) {
  return tags.map((tag) => (
    <span
      key={tag}
      className="story-panel rounded-full px-3 py-1.5 text-sm text-[var(--story-muted)]"
    >
      {tag}
    </span>
  ));
}

export default function About() {
  const a = i18n.about;

  return (
    <section id="about" className="story-chapter">
      <div className="story-shell">

        <StoryHeading label={a.label}>
          <Localized en={
            <>I turn messy<br />questions into<br /><span className="story-title-accent">working products.</span></>
          } zh={
            <>把理不清的问题，<br />做成用得上的<br /><span className="story-title-accent">好产品。</span></>
          } />
        </StoryHeading>

        <ScrollReveal className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,.78fr)_minmax(0,1fr)] md:gap-9 xl:gap-14 items-start">

          {/* Portrait */}
          <div className="story-about-perch">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden story-photo-shadow" data-cindy-anchor="" data-cindy-perch="">
              <Image
                src="/photos/portrait.jpg"
                alt="Wuziyang Zhang"
                fill
                className="object-cover object-center"
                sizes="(max-width: 767px) 67vw, 384px"
              />
            </div>
          </div>

          {/* Copy */}
          <div className="lg:pt-2">
            <div className="story-body space-y-4">
              <p>
                <Localized en={
                  <>
                    I study Economics and Information Science at the{" "}
                    <a
                      href="https://www.wisc.edu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors duration-200"
                      style={{ color: "var(--story-tint)" }}
                    >
                      University of Wisconsin–Madison
                    </a>
                    , splitting my time between market research, data analysis, and building AI products.
                  </>
                } zh={
                  <>
                    我在
                    <a
                      href="https://www.wisc.edu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors duration-200"
                      style={{ color: "var(--story-tint)" }}
                    >
                      威斯康星大学麦迪逊分校
                    </a>
                    读经济学与信息科学，平时把时间花在市场研究、数据分析和打造 AI 产品上。
                  </>
                } />
              </p>
              <p><Localized {...a.p2} /></p>
              <p><Localized {...a.p3} /></p>
              <p><Localized {...a.p4} /></p>
            </div>

            <div className="mt-9 flex flex-wrap gap-2">
              <Localized en={renderTags(a.tags.en)} zh={renderTags(a.tags.zh)} />
            </div>

            {/* University card — links to /university */}
            <div className="mt-6">
              <Link
                href="/university"
                className="story-panel group flex flex-wrap items-center justify-between gap-4 rounded-2xl px-4 py-3 story-interactive"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-9 h-9 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5">
                    <Image src="/photos/uw-logo.jpg" alt="UW" width={32} height={32} className="object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-snug" style={{ color: "var(--story-ink)" }}>
                      <Localized en="University of Wisconsin–Madison" zh="威斯康星大学麦迪逊分校" />
                    </p>
                    <p className="text-[11px] mt-1 font-mono" style={{ color: "var(--story-dim)" }}>
                      <Localized en="Economics · Information Science · CDIS" zh="经济学 · 信息科学 · CDIS" />
                    </p>
                  </div>
                </div>
                <span
                  className="shrink-0 text-sm font-medium transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: "var(--story-tint)" }}
                >
                  <Localized en="Learn more →" zh="了解更多 →" />
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal className="story-about-media">
          <figure>
            <div className="story-about-media__image">
              <Image src="/photos/uw-campus.jpg" alt="University of Wisconsin–Madison campus" fill
                sizes="(max-width: 767px) 90vw, 50vw" className="object-cover" />
            </div>
            <figcaption><Localized en="UW–Madison campus" zh="威斯康星大学麦迪逊分校校园" /></figcaption>
          </figure>
          <figure>
            <div className="story-about-media__image">
              <Image src="/photos/uw-ranking.jpg" alt="UW–Madison ranking graphic" fill
                sizes="(max-width: 767px) 90vw, 26vw" className="object-contain" />
            </div>
            <figcaption><Localized en="UW–Madison ranking" zh="威斯康星大学麦迪逊分校排名" /></figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}
