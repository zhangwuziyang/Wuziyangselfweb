"use client";

import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

const FOOTER_LINKS = [
  { href: "https://www.linkedin.com/in/wuziyang-zhang", key: "linkedin" as const, label: { en: "LinkedIn", zh: "LinkedIn" }, external: true },
  { href: "mailto:wuziyang@wisc.edu",                   key: "email"    as const, label: i18n.footer.email,                    external: false },
  { href: "/resume.pdf",                                 key: "resume"   as const, label: i18n.footer.resume,                   external: true  },
];

export default function Footer() {
  const { lang } = useLang();
  const f = i18n.footer;
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#1d1d1f", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-[1100px] mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-5">

        <p className="text-sm" style={{ color: "#48484a" }}>
          © {year} {tx(f.copy, lang)}
        </p>

        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm transition-colors duration-200 text-[#48484a] hover:text-[#86868b]"
            >
              {tx(link.label, lang)}
            </a>
          ))}
        </div>

        <p className="text-xs font-mono tracking-widest" style={{ color: "#48484a" }}>
          {tx(f.mono, lang)}
        </p>
      </div>
    </footer>
  );
}
