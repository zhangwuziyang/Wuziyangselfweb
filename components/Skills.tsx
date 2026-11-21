import StoryHeading from "@/components/home/StoryHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

function renderSkills(skills: readonly string[]) {
  return skills.map((skill) => (
    <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] text-[var(--story-muted)]"
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
        <ScrollReveal>
          <p className="story-body mb-9 max-w-2xl"><Localized {...s.tagline} /></p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {s.groups.map((group) => (
            <ScrollReveal key={group.symbol}>
              <div
                className="story-panel h-full rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg select-none" style={{ color: "var(--story-tint)" }}>{group.symbol}</span>
                  <h3 className="font-medium text-[15px] tracking-tight" style={{ color: "#f5f5f7" }}>
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
    </section>
  );
}
