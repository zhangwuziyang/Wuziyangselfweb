import StoryHeading from "@/components/home/StoryHeading";
import CindyStation from "@/components/home/CindyStation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

function renderSkills(skills: readonly string[]) {
  return skills.map((skill) => (
    <span key={skill} className="rounded-full border border-[var(--story-edge)] bg-[var(--story-soft)] px-3 py-1.5 text-[13px] text-[var(--story-muted)]"
    >
      {skill}
    </span>
  ));
}

export default function Skills() {
  const s = i18n.skills;

  return (
    <section id="skills" className="story-chapter">
      <div className="story-shell">

        <StoryHeading label={s.label}>
          <Localized {...s.headline} />
        </StoryHeading>
        <ScrollReveal className="mb-8">
          <p className="story-body max-w-lg"><Localized {...s.tagline} /></p>
        </ScrollReveal>
        <div className="cindy-station-row cindy-station-row--leading">
          <CindyStation chapter="skills" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {s.groups.map((group) => (
              <ScrollReveal key={group.symbol}>
                <div
                  className="story-panel h-full rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-lg select-none" style={{ color: "var(--story-tint)" }}>{group.symbol}</span>
                    <h3 className="font-medium text-[15px] tracking-tight" style={{ color: "var(--story-ink)" }}>
                      <Localized {...group.category} />
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Localized en={renderSkills(group.skills.en)} zh={renderSkills(group.skills.zh)} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
