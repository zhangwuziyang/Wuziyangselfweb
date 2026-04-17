"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { i18n, tx } from "@/lib/i18n";

const NAV_KEYS = [
  { key: "about",      href: "#about"      },
  { key: "experience", href: "#experience" },
  { key: "projects",   href: "#projects"   },
  { key: "global",     href: "#global"     },
  { key: "contact",    href: "#contact"    },
] as const;

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const { lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(0,0,0,0.82)] backdrop-blur-2xl backdrop-saturate-150"
            : "bg-transparent"
        }`}
        style={{ borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none" }}
      >
        <div className="max-w-[1200px] mx-auto px-5 h-12 grid grid-cols-3 items-center">

          {/* Left — logo */}
          <Link
            href="/"
            className="text-white/90 text-sm font-semibold tracking-[0.2em] uppercase hover:text-white transition-colors duration-200 w-fit"
          >
            WZ
          </Link>

          {/* Center — nav links (desktop only) */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            {NAV_KEYS.map(({ key, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="text-[13px] font-light text-white/70 hover:text-white transition-colors duration-200"
              >
                {tx(i18n.nav[key as keyof typeof i18n.nav] as { en: string; zh: string }, lang)}
              </button>
            ))}
          </nav>

          {/* Right — language + CTA */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={toggle}
              className="hidden md:block text-[13px] font-light text-white/60 hover:text-white transition-colors duration-200 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25"
            >
              {tx(i18n.nav.lang, lang)}
            </button>
            <button
              onClick={() => scrollTo("#contact")}
              className="hidden md:inline-flex items-center text-[13px] font-medium px-4 py-1.5 rounded-full text-white bg-white/10 hover:bg-white/18 transition-all duration-200"
              style={{ backdropFilter: "blur(4px)" }}
            >
              {tx(i18n.nav.cta, lang)}
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="md:hidden w-7 h-7 flex flex-col items-center justify-center gap-[5px]"
            >
              <span className={`block w-[20px] h-[1.5px] bg-white transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`block w-[20px] h-[1.5px] bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-[20px] h-[1.5px] bg-white transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7"
            style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(24px)" }}
          >
            {NAV_KEYS.map(({ key, href }, i) => (
              <motion.button
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.05, duration: 0.4, ease: [0.25,0.1,0.25,1] }}
                onClick={() => { setOpen(false); scrollTo(href); }}
                className="text-white text-[28px] font-light tracking-tight hover:text-white/60 transition-colors"
              >
                {tx(i18n.nav[key as keyof typeof i18n.nav] as { en: string; zh: string }, lang)}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-4 mt-4"
            >
              <button
                onClick={toggle}
                className="text-white/50 text-sm border border-white/15 px-5 py-2 rounded-full hover:border-white/30 hover:text-white/80 transition-all"
              >
                {tx(i18n.nav.lang, lang)}
              </button>
              <a
                href="mailto:wuziyang@wisc.edu"
                className="text-white/50 text-sm font-mono"
              >
                wuziyang@wisc.edu
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
