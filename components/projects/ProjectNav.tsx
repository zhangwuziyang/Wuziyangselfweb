"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useLang } from "@/context/LangContext";
import type { LocalizedText } from "@/lib/projectData/storyTypes";

interface ProjectNavProps {
  title: LocalizedText;
  progress: MotionValue<number>;
  darkTransition: [number, number];
  accentLight: string;
  accentDark: string;
}

export function ProjectNav({
  title,
  progress,
  darkTransition,
  accentLight,
  accentDark,
}: ProjectNavProps) {
  const { lang, toggle } = useLang();
  const zh = lang === "zh";
  const midpoint = (darkTransition[0] + darkTransition[1]) / 2;

  const [isDark, setIsDark] = useState(false);

  useMotionValueEvent(progress, "change", (latest) => {
    const nextDark = latest >= midpoint;
    setIsDark((prev) => (prev === nextDark ? prev : nextDark));
  });

  const darkBackdropOpacity = useTransform(
    progress,
    [0, darkTransition[0], darkTransition[1], 1],
    [0, 0, 1, 1]
  );
  const titleOpacity = useTransform(progress, [0, 0.06, 0.12, 1], [0, 0, 1, 1]);

  return (
    <nav
      aria-label={zh ? "项目页面导航" : "Project navigation"}
      className="fixed inset-x-0 top-0 z-50 h-12"
    >
      {/* Light frosted backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-b border-black/[0.07] bg-[#fbfaf8]/78 backdrop-blur-2xl"
      />

      {/* Dark frosted backdrop cross-fades cleanly in sync with twilight glide */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-b border-white/[0.08] bg-[#0a0e16]/86 backdrop-blur-2xl"
        style={{ opacity: darkBackdropOpacity }}
      />

      {/* Interactive bar content */}
      <div
        className={`relative mx-auto grid h-full max-w-[1320px] grid-cols-3 items-center px-5 transition-colors duration-300 md:px-8 ${
          isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]"
        }`}
      >
        <Link
          href="/#projects"
          className={`inline-flex w-fit items-center gap-2 text-[13px] font-medium transition-opacity duration-200 hover:opacity-100 ${
            isDark ? "text-white/80" : "text-black/70"
          }`}
        >
          <span aria-hidden="true" className="text-base leading-none">
            ←
          </span>
          <span>{zh ? "项目" : "Projects"}</span>
        </Link>

        <motion.span
          className="truncate text-center text-[13px] font-medium tracking-[-0.01em]"
          style={{ opacity: titleOpacity }}
        >
          {title[lang]}
        </motion.span>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggle}
            lang={zh ? "en" : "zh-CN"}
            aria-label={zh ? "Switch to English" : "切换至中文"}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.08em] transition-colors duration-200 ${
              isDark
                ? "border-white/20 text-white/85 hover:border-white/40 hover:text-white"
                : "border-black/15 text-black/75 hover:border-black/35 hover:text-black"
            }`}
          >
            {zh ? "EN" : "中文"}
          </button>
        </div>
      </div>

      {/* Scroll progress hairline (GPU scaleX only) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left"
        style={{
          scaleX: progress,
          background: isDark ? accentDark : accentLight,
          opacity: 0.72,
        }}
      />
    </nav>
  );
}
