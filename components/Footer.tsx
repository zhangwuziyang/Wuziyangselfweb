import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

const FOOTER_LINKS = [
  { href: "https://www.linkedin.com/in/wuziyang-zhang-7b547229b", key: "linkedin" as const, label: { en: "LinkedIn", zh: "LinkedIn" }, external: true },
  { href: "mailto:zhangwuziyang@gmail.com",              key: "email"    as const, label: i18n.footer.email,                    external: false },
  { href: "/resume-wuziyang-zhang.pdf",                  key: "resume"   as const, label: i18n.footer.resume,                   external: true  },
];

export default async function Footer() {
  "use cache";
  const f = i18n.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--story-edge)] text-[var(--story-dim)]" data-cindy-finish="">
      <div className="story-shell py-10 flex flex-col md:flex-row items-center justify-between gap-5">

        <p className="text-sm">
          © {year} <Localized {...f.copy} />
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm hover:underline"
            >
              <Localized {...link.label} />
            </a>
          ))}
        </div>

        <p className="text-xs font-mono tracking-widest">
          <Localized {...f.mono} />
        </p>
      </div>
    </footer>
  );
}
