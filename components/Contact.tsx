import StoryHeading from "@/components/home/StoryHeading";
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
        className="group inline-flex items-center gap-2 text-sm font-medium rounded-full px-7 py-3 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-white"
      >
        {c.sendEmail[lang]}
        <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">↗</span>
      </a>
    );
  }

  return (
    <section id="contact" className="story-chapter">
      <div className="story-shell">
        <div className="max-w-[800px]">

          <StoryHeading label={c.label}>
            <Localized {...c.headline1} />
            <br /><Localized {...c.headline2} />
            <br /><span className="story-title-accent"><Localized {...c.headline3} /></span>
          </StoryHeading>

          <ScrollReveal>
            <p
              className="story-body mb-8 max-w-xl"
            >
              <Localized {...c.body} />
            </p>

            <div className="mb-10 flex flex-col flex-wrap gap-3 sm:flex-row">
              <Localized en={renderEmail("en")} zh={renderEmail("zh")} />
              <a
                href="https://www.linkedin.com/in/wuziyang-zhang-7b547229b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-7 py-3 text-[#f5f5f7] border border-white/[0.18] hover:bg-white/[0.08] hover:border-white/[0.35]"
              >
                <Localized {...c.linkedin} />
              </a>
              <a
                href="/resume-wuziyang-zhang.pdf"
                download="Wuziyang-Zhang-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-7 py-3 text-[#f5f5f7] border border-white/[0.18] hover:bg-white/[0.08] hover:border-white/[0.35]"
              >
                <Localized {...c.resume} />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-2 gap-6 pt-8 xl:grid-cols-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
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
