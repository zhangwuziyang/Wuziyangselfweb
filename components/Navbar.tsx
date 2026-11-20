"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import type { i18n } from "@/lib/i18n";

const NAV_KEYS = [
  { key: "about",      href: "#about"      },
  { key: "experience", href: "#experience" },
  { key: "projects",   href: "#projects"   },
  { key: "global",     href: "#global"     },
  { key: "contact",    href: "#contact"    },
] as const;

export default function Navbar({ copy }: { copy: typeof i18n.nav }) {
  const { lang, toggle } = useLang();
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(width >= 48rem)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        data-site-nav="top"
        data-menu-open={open}
        className="fixed top-0 inset-x-0 z-50 transition-[background,color,border-color] duration-300"
      >
        <div className="max-w-[1200px] mx-auto px-5 h-12 grid grid-cols-3 items-center">

          {/* Left — logo */}
          <Link
            href="/"
            className="nav-link text-sm font-semibold tracking-[0.2em] uppercase transition-colors duration-200 w-fit"
          >
            WZ
          </Link>

          {/* Center — nav links (desktop only) */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            {NAV_KEYS.map(({ key, href }) => (
              <a
                key={href}
                href={href}
                className="nav-link text-[13px] font-light transition-colors duration-200"
              >
                {copy[key][lang]}
              </a>
            ))}
          </nav>

          {/* Right — language + CTA */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={toggle}
              className="hidden md:block nav-link text-[13px] font-light transition-colors duration-200 px-3 py-1.5 rounded-full border border-current/20 hover:border-current/40"
            >
              {copy.lang[lang]}
            </button>
            <a
              href="#contact"
              className="hidden md:inline-flex items-center text-[13px] font-medium px-4 py-1.5 rounded-full bg-current/10 hover:bg-current/15 transition-all duration-200"
              style={{ backdropFilter: "blur(4px)" }}
            >
              {copy.cta[lang]}
            </a>

            {/* Mobile hamburger */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="md:hidden w-7 h-7 flex flex-col items-center justify-center gap-[5px]"
            >
              <span className={`block w-[20px] h-[1.5px] bg-current transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`block w-[20px] h-[1.5px] bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-[20px] h-[1.5px] bg-current transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          className="mobile-nav fixed inset-0 z-40 flex flex-col items-center justify-center gap-7"
          style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(24px)" }}
        >
          {NAV_KEYS.map(({ key, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-white text-[28px] font-light tracking-tight hover:text-white/60 transition-colors"
            >
              {copy[key][lang]}
            </a>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={toggle}
              className="text-white/50 text-sm border border-white/15 px-5 py-2 rounded-full hover:border-white/30 hover:text-white/80 transition-all"
            >
              {copy.lang[lang]}
            </button>
            <a
              href={lang === "zh" ? "mailto:3168661545@qq.com" : "mailto:zhangwuziyang@gmail.com"}
              className="text-white/50 text-sm font-mono"
            >
              {lang === "zh" ? "3168661545@qq.com" : "zhangwuziyang@gmail.com"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
