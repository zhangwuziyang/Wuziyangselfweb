import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import StoryHeading from "@/components/home/StoryHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";
import healthAgent from "@/lib/projectData/health-agent-copy.json";
import offerRadar from "@/lib/projectData/offer-radar-copy.json";

const projects = [
  { slug: "offer-radar", card: offerRadar.card },
  { slug: "health-agent", card: healthAgent.card },
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
    <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-[var(--story-muted)]">
      {tag}
    </span>
  ));
}

export default function Projects() {
  const p = i18n.projects;

  return (
    <section id="projects" className="story-chapter">
      <div className="story-shell">
        <StoryHeading label={p.label}><Localized {...p.headline} /></StoryHeading>
        <ScrollReveal>
          <p className="story-body mb-9 max-w-xl">
            <Localized en={p.tagline.en.split("\n")[0]} zh={p.tagline.zh.split("\n")[0]} />
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-6">
          {projects.map(({ slug, card: { en, zh } }) => {
            const asset = `images/projects/${slug}/cover.webp`;
            const hasCover = existsSync(join(process.cwd(), "public", asset));

            return (
              <ScrollReveal key={slug}>
                <article className="story-project story-panel">
                  <div className={`story-project__media story-project__media--${slug}`} data-project-cover={`/${asset}`}>
                    {hasCover ? (
                      <Image src={`/${asset}`} alt="" fill className="object-contain p-5" sizes="(max-width: 767px) 90vw, 38vw" />
                    ) : (
                      <div className="story-project__placeholder" aria-hidden="true" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7 xl:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#9cbbff]/25 bg-[#9cbbff]/10 px-2.5 py-1 text-xs font-semibold text-[#c4d8ff]">
                        <Localized en={en.tag1} zh={zh.tag1} />
                      </span>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-[var(--story-muted)]">
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
                    <Link href={`/projects/${slug}`} className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--story-tint)] hover:text-white">
                      <Localized en={en.cta} zh={zh.cta} />
                      <span className="sr-only"><Localized en={` ${en.title}`} zh={` ${zh.title}`} /></span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
