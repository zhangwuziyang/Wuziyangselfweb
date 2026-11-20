import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";
import healthAgent from "@/lib/projectData/health-agent-copy.json";
import offerRadar from "@/lib/projectData/offer-radar-copy.json";
import offerRadarPoster from "@/public/projects/offer-radar-poster.jpg";

const projects = [
  { href: "/projects/offer-radar", card: offerRadar.card, poster: offerRadarPoster },
  { href: "/projects/health-agent", card: healthAgent.card },
];

function renderPoints(points: readonly string[]) {
  return points.map((point) => (
    <li key={point} className="flex items-start gap-2.5 text-sm font-light leading-relaxed text-[#6e6e73]">
      <span aria-hidden="true" className="mt-[3px] shrink-0 text-[#0071e3]">—</span>
      <span>{point}</span>
    </li>
  ));
}

function renderTechTags(tags: readonly string[]) {
  return tags.map((tag) => (
    <span key={tag} className="rounded-full border border-black/10 bg-[#f5f5f7] px-2.5 py-1 text-[11px] text-[#6e6e73]">
      {tag}
    </span>
  ));
}

function HealthWatchIllustration() {
  return (
    <div aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#e2dafb,#f5f3fb_75%)]">
      <div className="relative grid h-64 w-40 place-items-center">
        <div className="absolute inset-y-0 w-24 rounded-[36px] bg-linear-to-r from-[#aca0c4] via-[#ccc1e3] to-[#aca0c4] shadow-md" />
        <div className="absolute right-[-2px] top-[78px] h-7 w-3 rounded-md bg-[#6b6279]" />
        <div className="relative grid h-40 w-36 place-items-center rounded-[38px] border-[5px] border-[#706780] bg-[#1a1523] shadow-[0_14px_36px_rgba(44,32,64,0.3)]">
          <span className="absolute size-24 rounded-full bg-[conic-gradient(from_-90deg,#c4a6ff_0_81%,#39304b_81%_100%)] mask-[radial-gradient(circle_closest-side,transparent_calc(100%-8px),black_calc(100%-8px))]" />
          <span className="absolute size-[72px] rounded-full bg-[conic-gradient(from_-90deg,#73e4c1_0_70%,#273b3a_70%_100%)] mask-[radial-gradient(circle_closest-side,transparent_calc(100%-8px),black_calc(100%-8px))]" />
          <span className="absolute size-12 rounded-full bg-[conic-gradient(from_-90deg,#7ab7ff_0_87%,#29364b_87%_100%)] mask-[radial-gradient(circle_closest-side,transparent_calc(100%-8px),black_calc(100%-8px))]" />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const p = i18n.projects;

  return (
    <section id="projects" data-nav-surface="light" style={{ background: "#f5f5f7" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">
        <ScrollReveal>
          <p className="section-label mb-4"><Localized {...p.label} /></p>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <ScrollReveal delay={80}>
            <h2 className="font-semibold leading-[1.04] tracking-tight" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}>
              <Localized {...p.headline} />
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="text-sm font-light max-w-xs leading-relaxed" style={{ color: "#6e6e73" }}>
              <Localized en={p.tagline.en.split("\n")[0]} zh={p.tagline.zh.split("\n")[0]} />
            </p>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-5">
          {projects.map(({ href, card: { en, zh }, poster }, index) => (
            <ScrollReveal key={href} delay={60 * (index + 1)}>
              <article className="grid grid-cols-1 overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-[400ms] hover:-translate-y-[3px] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] lg:grid-cols-2">
                <div className={index === 0 ? "relative min-h-[280px] lg:order-2" : "relative min-h-[280px]"}>
                  {poster ? (
                    <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-[#e1d9fb] via-[#f4eff9] to-[#d5eff6]">
                      <Image
                        src={poster}
                        alt=""
                        className="h-auto w-full"
                        sizes="(max-width:1023px) calc(100vw - 40px), (max-width:1100px) calc(50vw - 20px), 530px"
                      />
                    </div>
                  ) : <HealthWatchIllustration />}
                </div>
                <div className="flex flex-col justify-center p-10 md:p-14">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#0071e3]/20 bg-[#0071e3]/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#0071e3]">
                      <Localized en={en.tag1} zh={zh.tag1} />
                    </span>
                    <span className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-2.5 py-1 text-[11px] font-semibold text-[#1d1d1f]">
                      <Localized en={en.tag2} zh={zh.tag2} />
                    </span>
                  </div>
                  <h3 className="mb-3 font-semibold text-[#1d1d1f]" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.02em" }}>
                    <Localized en={en.title} zh={zh.title} />
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#6e6e73]"><Localized en={en.desc} zh={zh.desc} /></p>
                  <ul className="mb-8 space-y-2">
                    <Localized en={renderPoints(en.points)} zh={renderPoints(zh.points)} />
                  </ul>
                  <div className="mb-8 flex flex-wrap gap-2">
                    <Localized en={renderTechTags(en.techTags)} zh={renderTechTags(zh.techTags)} />
                  </div>
                  <Link href={href} className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#0071e3]">
                    <Localized en={en.cta} zh={zh.cta} />
                    <span className="sr-only"><Localized en={` ${en.title}`} zh={` ${zh.title}`} /></span>
                    <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
