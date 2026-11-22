import StoryHeading from "@/components/home/StoryHeading";
import CindyStation from "@/components/home/CindyStation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

const INFO_KEYS = ["Email", "Location", "University", "Status"] as const;

export default function Contact() {
  const c = i18n.contact;

  const emails = { en: "zhangwuziyang@gmail.com", zh: "3168661545@qq.com" };
  const infoValues = { ...c.infoValues, Email: emails };

  function renderEmail(lang: "en" | "zh") {
    return (
      <a
        href={`mailto:${emails[lang]}`}
        className="group inline-flex items-center gap-2 text-sm font-medium rounded-full px-7 py-3 story-button-primary"
      >
        {c.sendEmail[lang]}
        <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">↗</span>
      </a>
    );
  }

  return (
    <section id="contact" className="story-chapter">
      <div className="story-shell">
        <div>

          <StoryHeading label={c.label}>
            <Localized {...c.headline1} />
            <br /><Localized {...c.headline2} />
            <br /><span className="story-title-accent"><Localized {...c.headline3} /></span>
          </StoryHeading>

          <div className="cindy-station-row mb-10">
            <CindyStation chapter="contact" reverse />
            <ScrollReveal>
              <p
                className="story-body mb-8 max-w-xl"
              >
                <Localized {...c.body} />
              </p>

              <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
                <Localized en={renderEmail("en")} zh={renderEmail("zh")} />
                <a
                  href="https://www.linkedin.com/in/wuziyang-zhang-7b547229b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-7 py-3 story-button-secondary"
                >
                  <Localized {...c.linkedin} />
                </a>
                <a
                  href="/resume-wuziyang-zhang.pdf"
                  download="Wuziyang-Zhang-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-7 py-3 story-button-secondary"
                >
                  <Localized {...c.resume} />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 xl:grid-cols-4" style={{ borderTop: "1px solid var(--story-edge)" }}>
              {INFO_KEYS.map((key) => (
                <div key={key}>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: "var(--story-dim)" }}>
                    <Localized {...c.infoLabels[key]} />
                  </p>
                  <p className="break-words text-sm font-medium" style={{ color: "var(--story-muted)" }}><Localized {...infoValues[key]} /></p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
