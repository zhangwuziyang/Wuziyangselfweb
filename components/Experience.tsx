import StoryHeading from "@/components/home/StoryHeading";
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

        <ExperienceTimeline>
          {TIMELINE.map((exp, i) => {
            const year = exp.start.slice(0, 4);
            const newYear = i === 0 || TIMELINE[i - 1].start.slice(0, 4) !== year;

            return (
              <ScrollReveal as="li" key={exp.slug} className="relative grid grid-cols-[24px_1fr] lg:grid-cols-[180px_64px_1fr] gap-x-4 lg:gap-x-0 pb-10 last:pb-0">

                {/* Date column (desktop) */}
                <div className="hidden lg:block pt-7 pr-6 text-right">
                  {newYear && (
                    <p className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
                      {year}
                    </p>
                  )}
                  <p className="text-sm whitespace-nowrap" style={{ color: "var(--story-muted)" }}><Localized {...exp.period} /></p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--story-dim)" }}><Localized {...exp.location} /></p>
                </div>

                {/* Node */}
                <div className="relative flex justify-center pt-8 md:pt-9">
                  <span className="relative flex h-[11px] w-[11px]">
                    <span
                      className="relative h-[11px] w-[11px] rounded-full"
                      style={{ background: exp.accent, boxShadow: `0 0 0 4px #111b31, 0 0 14px ${exp.accent}80` }}
                    />
                  </span>
                </div>

                {/* Card */}
                <div className="min-w-0">
                  {/* Date line (mobile) */}
                  <p className="lg:hidden text-xs mb-3 pt-7" style={{ color: "var(--story-muted)" }}>
                    <span className="font-semibold" style={{ color: "#f5f5f7" }}><Localized {...exp.period} /></span>
                    <span className="mx-1.5">·</span>
                    <Localized {...exp.location} />
                  </p>

                  <Link href={`/experience/${exp.slug}`}>
                    <article
                      className="story-panel group relative overflow-hidden rounded-2xl p-5 hover:border-white/25 sm:p-7"
                    >
                      {/* Ambient glow */}
                      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.04] blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500" style={{ background: exp.accent }} />

                      <div className="flex items-start gap-5 mb-4">
                        {/* Logo */}
                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                          <Image src={exp.logo} alt={exp.company} width={56} height={56} className="object-contain w-11 h-11 p-1" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                              className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                              style={{ color: exp.accent, background: `${exp.accent}18`, border: `1px solid ${exp.accent}30` }}
                            >
                              <Localized {...exp.category} />
                            </span>
                            {exp.current && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ color: "#30d158", background: "#30d15814", border: "1px solid #30d15830" }}>
                                <Localized en="Current" zh="进行中" />
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold tracking-tight" style={{ color: "#f5f5f7", letterSpacing: "-0.015em" }}>
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
                            <span className="font-semibold" style={{ color: exp.accent }}>{m.value}</span>
                            <span style={{ color: "var(--story-muted)" }}><Localized {...m.label} /></span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: exp.accent }}>
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
    </section>
  );
}
