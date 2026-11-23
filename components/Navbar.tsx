"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import type { i18n } from "@/lib/i18n";

const NAV_KEYS = [
  { key: "about",      href: "#about"      },
  { key: "experience", href: "#experience" },
  { key: "projects",   href: "#projects"   },
  { key: "global",     href: "#global"     },
  { key: "music",      href: "#music"      },
  { key: "skills",     href: "#skills"     },
  { key: "philosophy", href: "#philosophy" },
  { key: "contact",    href: "#contact"    },
] as const;

type ChapterKey = (typeof NAV_KEYS)[number]["key"];
const SPY_IDS = ["hero", ...NAV_KEYS.map(item => item.key)] as const;
// Hold the clicked chapter while a smooth anchor scroll passes the chapters in between.
const CLICK_LOCK_MS = 1_600;

/**
 * Follows the homepage chapters with a reading line just above the middle of the scrollport.
 * Desktop scrolls the window; the single-column layout scrolls .story-content instead. The
 * desktop crossing gaps between chapters belong to no section, so the current item simply holds
 * while Cindy walks across and never flickers back and forth.
 */
function useChapterSpy() {
  const [active, setActive] = useState<ChapterKey | null>(null);
  const visible = useRef(new Map<string, boolean>());
  const lockUntil = useRef(0);

  const settle = useCallback(() => {
    const current = SPY_IDS.find(id => visible.current.get(id));
    if (current) setActive(current === "hero" ? null : current);
  }, []);

  useEffect(() => {
    const single = window.matchMedia("(width < 48rem)");
    const events = new AbortController();
    let observer: IntersectionObserver | undefined;
    let release = 0;

    function connect() {
      observer?.disconnect();
      visible.current.clear();
      const root = single.matches ? document.querySelector<HTMLElement>(".story-content") : null;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) visible.current.set(entry.target.id, entry.isIntersecting);
        if (performance.now() >= lockUntil.current) settle();
      }, { root, rootMargin: "-45% 0px -54% 0px", threshold: 0 });
      for (const id of SPY_IDS) {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      }
    }

    const unlock = () => {
      if (!lockUntil.current) return;
      lockUntil.current = 0;
      window.clearTimeout(release);
      settle();
    };
    const onLock = () => {
      window.clearTimeout(release);
      release = window.setTimeout(unlock, CLICK_LOCK_MS);
    };

    connect();
    single.addEventListener("change", connect, { signal: events.signal });
    window.addEventListener("scrollend", unlock, { signal: events.signal });
    document.querySelector(".story-content")?.addEventListener("scrollend", unlock, { signal: events.signal });
    window.addEventListener("wz-nav-lock", onLock, { signal: events.signal });
    return () => {
      events.abort();
      observer?.disconnect();
      window.clearTimeout(release);
    };
  }, [settle]);

  const jump = useCallback((key: ChapterKey) => {
    lockUntil.current = performance.now() + CLICK_LOCK_MS;
    setActive(key);
    window.dispatchEvent(new Event("wz-nav-lock"));
  }, []);

  return { active, jump };
}

export default function Navbar({ copy }: { copy: typeof i18n.nav }) {
  const { lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const { active, jump } = useChapterSpy();
  const links = useRef<HTMLElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const shown = useRef(false);

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

  // Slide the hairline under the current link. It appears in place the first time and slides after.
  useLayoutEffect(() => {
    const nav = links.current;
    const line = marker.current;
    if (!nav || !line) return;
    const place = () => {
      const link = active ? nav.querySelector<HTMLElement>(`[data-chapter="${active}"]`) : null;
      if (!link || !link.offsetWidth) {
        line.removeAttribute("data-active");
        line.removeAttribute("data-ready");
        shown.current = false;
        return;
      }
      if (!shown.current) line.removeAttribute("data-ready");
      line.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
      line.setAttribute("data-active", "");
      if (!shown.current) {
        void line.offsetWidth;
        shown.current = true;
      }
      line.setAttribute("data-ready", "");
    };
    place();
    const sizes = new ResizeObserver(() => {
      line.removeAttribute("data-ready");
      shown.current = false;
      place();
    });
    sizes.observe(nav);
    return () => sizes.disconnect();
  }, [active, lang]);

  return (
    <>
      <header
        data-menu-open={open}
        className="story-nav fixed top-0 inset-x-0 z-50"
      >
        <div className="max-w-[1200px] mx-auto px-5 h-12 flex items-center gap-4 lg:gap-6">

          {/* Left — logo */}
          <Link
            href="/"
            className="nav-link shrink-0 text-sm font-semibold tracking-[0.2em] uppercase transition-colors duration-200 w-fit"
          >
            WZ
          </Link>

          {/* Center — chapter links (desktop only) */}
          <nav
            ref={links}
            aria-label={lang === "zh" ? "首页章节" : "Homepage chapters"}
            className="story-nav__links hidden md:flex flex-1"
          >
            {NAV_KEYS.map(({ key, href }) => (
              <a
                key={href}
                href={href}
                data-chapter={key}
                aria-current={active === key ? "location" : undefined}
                onClick={() => jump(key)}
                className="story-nav__link"
              >
                {copy[key][lang]}
              </a>
            ))}
            <span ref={marker} className="story-nav__marker" aria-hidden="true" />
          </nav>

          {/* Right — language + CTA */}
          <div className="ml-auto md:ml-0 flex shrink-0 items-center justify-end gap-3">
            <button
              onClick={toggle}
              className="hidden md:block nav-link text-[13px] font-light transition-colors duration-200 px-3 py-1.5 rounded-full border border-current/20 hover:border-current/40"
            >
              {copy.lang[lang]}
            </button>
            {/* "Contact" is already a chapter link; the extra CTA returns once there is room. */}
            <a
              href="#contact"
              onClick={() => jump("contact")}
              className="hidden lg:inline-flex items-center text-[13px] font-medium px-4 py-1.5 rounded-full bg-current/10 hover:bg-current/15 transition-all duration-200"
              style={{ backdropFilter: "blur(4px)" }}
            >
              {copy.cta[lang]}
            </a>

            {/* Mobile hamburger */}
            <button
              aria-label={lang === "zh" ? (open ? "关闭菜单" : "打开菜单") : (open ? "Close menu" : "Open menu")}
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
          className="mobile-nav fixed inset-0 z-40 flex flex-col items-center justify-center gap-5"
          style={{ background: "var(--story-nav)", color: "var(--story-ink)" }}
        >
          {NAV_KEYS.map(({ key, href }) => (
            <a
              key={href}
              href={href}
              aria-current={active === key ? "location" : undefined}
              onClick={() => { jump(key); setOpen(false); }}
              className="text-[24px] font-light tracking-tight hover:text-[var(--story-tint)] transition-colors"
            >
              {copy[key][lang]}
            </a>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={toggle}
              className="text-[var(--story-muted)] text-sm border border-[var(--story-control)] px-5 py-2 rounded-full hover:text-[var(--story-ink)] transition-all"
            >
              {copy.lang[lang]}
            </button>
            <a
              href={lang === "zh" ? "mailto:3168661545@qq.com" : "mailto:zhangwuziyang@gmail.com"}
              className="text-[var(--story-muted)] text-sm font-mono"
            >
              {lang === "zh" ? "3168661545@qq.com" : "zhangwuziyang@gmail.com"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
