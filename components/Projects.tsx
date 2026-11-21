import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import ProjectPreview from "@/components/home/ProjectPreview";
import { HEALTH_FRAMES, OFFER_FRAMES } from "@/components/home/story-media";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";
import healthAgent from "@/lib/projectData/health-agent-copy.json";
import offerRadar from "@/lib/projectData/offer-radar-copy.json";

const projects = [
  { slug: "offer-radar", card: offerRadar.card, frames: [OFFER_FRAMES[1], OFFER_FRAMES[0], ...OFFER_FRAMES.slice(2)], device: "browser" },
  { slug: "health-agent", card: healthAgent.card, frames: HEALTH_FRAMES, device: "phone" },
];

function renderPoints(points: readonly string[]) {
  return points.map((point) => (
    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--story-muted)]">
      <span aria-hidden="true" className="mt-[3px] shrink-0 text-[var(--story-tint)]">—</span>
      <span>{point}</span>
    </li>
  ));
}

function renderTechTags(tags: readonly string[]) {
  return tags.map((tag) => (
    <span key={tag} className="rounded-full border border-[var(--story-edge)] px-2.5 py-1 text-xs text-[var(--story-muted)]">
      {tag}
    </span>
  ));
}

export default function Projects() {
  const p = i18n.projects;

  return (
    <section id="projects" className="story-chapter story-projects">
      <header className="story-projects__caption story-shell">
        <p className="story-eyebrow"><Localized {...p.label} /></p>
        <h2 className="story-title"><Localized {...p.headline} /></h2>
        <p className="story-body">
          <Localized en={p.tagline.en.split("\n")[0]} zh={p.tagline.zh.split("\n")[0]} />
        </p>
      </header>

      <div id="project-gallery" className="story-projects__gallery story-shell">
        {projects.map(({ slug, card: { en, zh }, frames, device }) => (
          <ScrollReveal key={slug}>
            <article className="story-project story-panel">
              <div className="flex min-w-0 flex-col justify-center p-3.5 sm:p-7 xl:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[var(--story-edge)] bg-[var(--story-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--story-tint)]">
                    <Localized en={en.tag1} zh={zh.tag1} />
                  </span>
                  <span className="rounded-full border border-[var(--story-edge)] px-2.5 py-1 text-xs text-[var(--story-muted)]">
                    <Localized en={en.tag2} zh={zh.tag2} />
                  </span>
                </div>
                <h3 className="mb-3 text-[clamp(1.7rem,3.3vw,3rem)] font-semibold leading-tight tracking-tight">
                  <Localized en={en.title} zh={zh.title} />
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--story-muted)]"><Localized en={en.desc} zh={zh.desc} /></p>
                <ul className="mb-5 space-y-2">
                  <Localized en={renderPoints(en.points)} zh={renderPoints(zh.points)} />
                </ul>
                <div className="mb-5 flex flex-wrap gap-2">
                  <Localized en={renderTechTags(en.techTags)} zh={renderTechTags(zh.techTags)} />
                </div>
                <Link href={`/projects/${slug}`} className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--story-tint)] hover:underline">
                  <Localized en={en.cta} zh={zh.cta} />
                  <span className="sr-only"><Localized en={` ${en.title}`} zh={` ${zh.title}`} /></span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
              <div className="story-project__media" data-cindy-anchor="">
                <ProjectPreview frames={frames} phone={device === "phone"} name={{ en: en.title, zh: zh.title }} />
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
