import StoryHeading from "@/components/home/StoryHeading";
import CindyStation from "@/components/home/CindyStation";
import Link from "next/link";
import Image from "next/image";
import { ExperienceTimeline } from "@/components/ui/ExperienceTimeline";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";
import { EXPERIENCE_DATA } from "@/lib/experienceData";

/* Newest first */
const TIMELINE = EXPERIENCE_DATA
  .filter((exp) => exp.slug !== "chartcreator")
  .sort((a, b) => b.start.localeCompare(a.start));

export default function Experience() {
  const e = i18n.experience;

  return (
    <section id="experience" className="story-chapter">
      <div className="story-shell">

        <StoryHeading label={e.label}>
          <Localized {...e.headline} />
        </StoryHeading>

        <div className="cindy-station-row cindy-station-row--leading cindy-station-row--top">
          <CindyStation chapter="experience" />
          <ExperienceTimeline>
            {TIMELINE.map((exp, i) => {
              const year = exp.start.slice(0, 4);
              const newYear = i === 0 || TIMELINE[i - 1].start.slice(0, 4) !== year;

              return (
                <ScrollReveal as="li" key={exp.slug} className="relative grid grid-cols-[16px_minmax(0,1fr)] gap-x-2 pb-10 last:pb-0 sm:gap-x-4">

                  <div className="flex justify-center pt-3 sm:pt-4">
                    <span className="story-timeline-node" data-cindy-node="" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <p className="story-experience-date">
                      {newYear && <span className="story-experience-year">{year}</span>}
                      <Localized {...exp.period} />
                      <span aria-hidden="true">·</span>
                      <Localized {...exp.location} />
                    </p>

                    <Link href={`/experience/${exp.slug}`}>
                      <article
                        className="story-panel group relative overflow-hidden rounded-2xl story-interactive p-3.5 sm:p-7"
                      >
                        {/* Ambient glow */}
                        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.04] blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500" style={{ background: exp.accent }} />

                        <div className="flex flex-wrap items-start gap-3 mb-4 sm:gap-5">
                          {/* Logo */}
                          <div className="shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                            <Image src={exp.logo} alt={exp.company} width={56} height={56} className="object-contain w-11 h-11 p-1" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span
                                className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                                style={{ color: "var(--story-tint)" }}
                              >
                                <Localized {...exp.category} />
                              </span>
                              {exp.current && (
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ color: "var(--story-tint)" }}>
                                  <Localized en="Current" zh="进行中" />
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold tracking-tight" style={{ color: "var(--story-ink)", letterSpacing: "-0.015em" }}>
                              {exp.company}
                            </h3>
                            <p className="text-sm font-light mt-0.5" style={{ color: "var(--story-dim)" }}><Localized {...exp.role} /></p>
                          </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "var(--story-muted)" }}>
                          <Localized {...exp.tagline} />
                        </p>

                        {/* Metric chips */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {exp.metrics.slice(0, 4).map((m) => (
                            <div key={m.value} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: `${exp.accent}0f`, border: `1px solid ${exp.accent}20` }}>
                              <span className="font-semibold" style={{ color: "var(--story-tint)" }}>{m.value}</span>
                              <span style={{ color: "var(--story-muted)" }}><Localized {...m.label} /></span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--story-tint)" }}>
                          <Localized en="View details" zh="查看详情" />
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </span>
                      </article>
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </ExperienceTimeline>
        </div>
      </div>
    </section>
  );
}
