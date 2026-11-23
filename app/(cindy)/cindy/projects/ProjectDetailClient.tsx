"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";
import type { Lang } from "@/lib/i18n";

interface ProjectDetailCopy {
  title: string;
  subtitle: string;
  paragraphs: string[];
  techTags: string[];
  status?: string;
  tag1?: string;
  tag2?: string;
  meta?: string[];
  highlights?: string[];
  disclaimer?: string;
}

interface ProjectDetailProps {
  copy: Record<Lang, ProjectDetailCopy>;
  video?: { src: string; poster: string };
}

const chipClass = "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-[#a1a1a6]";

export default function ProjectDetailClient({ copy, video }: ProjectDetailProps) {
  const { lang, toggle } = useLang();
  const detail = copy[lang];
  const zh = lang === "zh";
  const tags = [detail.tag1, detail.tag2, detail.status].filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <nav className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-white/[0.06] bg-black/[0.82] px-5 backdrop-blur-[24px]">
        <Link href="/cindy#projects" className="inline-flex items-center gap-2 text-sm font-medium text-[#a1a1a6] transition-colors hover:text-white">
          <span aria-hidden="true" className="text-lg">←</span>
          {zh ? "项目" : "Projects"}
        </Link>
        <button
          type="button"
          onClick={toggle}
          lang={zh ? "en" : "zh-CN"}
          aria-label={zh ? "Switch to English" : "切换至中文"}
          className="rounded-full border border-white/[0.12] px-3 py-1.5 text-xs font-semibold tracking-[0.08em] text-[#a1a1a6] transition-colors hover:border-white/30 hover:text-white"
        >
          {zh ? "EN" : "中文"}
        </button>
      </nav>

      <main>
        <header className="px-5 pb-16 pt-32">
          <div className="mx-auto max-w-[900px]">
            <ScrollReveal>
              <div className="mb-8 flex flex-wrap items-center gap-3">
                {tags.map((tag, index) => (
                  <span key={tag} className={index === 0 ? "rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 text-sm text-violet-300" : chipClass}>
                    {tag}
                  </span>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h1 className="mb-6 text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
                {detail.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-[#a1a1a6]">{detail.subtitle}</p>
            </ScrollReveal>
            {detail.meta && (
              <ScrollReveal delay={180}>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {detail.meta.map((item) => <li key={item} className={chipClass}>{item}</li>)}
                </ul>
              </ScrollReveal>
            )}
          </div>
        </header>

        <div aria-hidden="true" className="h-px bg-linear-to-r from-violet-400/40 to-transparent" />

        {video && (
          <section className="bg-white/[0.02] px-5 py-16" aria-label={zh ? "项目演示" : "Project demo"}>
            <ScrollReveal className="mx-auto max-w-[900px]">
              <video
                className="aspect-video w-full rounded-2xl border border-white/[0.08] bg-black shadow-2xl"
                aria-label={zh ? `${detail.title}演示视频` : `${detail.title} demo video`}
                poster={video.poster}
                preload="none"
                playsInline
                controls
              >
                <source src={video.src} type="video/mp4" />
              </video>
            </ScrollReveal>
          </section>
        )}

        <div className="px-5 py-16 md:py-20">
          <div className="mx-auto max-w-[900px] space-y-10">
            <ScrollReveal className="max-w-3xl space-y-5 text-base font-light leading-[1.8] text-[#d1d1d6]">
              {detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </ScrollReveal>

            {detail.highlights && (
              <ScrollReveal>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {detail.highlights.map((highlight) => (
                    <li key={highlight} className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.07] px-5 py-4 text-base text-[#d1d1d6]">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            )}

            <ScrollReveal className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-10">
              <h2 className="mb-5 text-sm font-semibold text-[#a1a1a6]">{zh ? "工具与技术" : "Tools & Stack"}</h2>
              <ul className="flex flex-wrap gap-2">
                {detail.techTags.map((tag) => <li key={tag} className={chipClass}>{tag}</li>)}
              </ul>
            </ScrollReveal>

            {detail.disclaimer && (
              <ScrollReveal>
                <p className="max-w-3xl text-sm leading-relaxed text-[#a1a1a6]">{detail.disclaimer}</p>
              </ScrollReveal>
            )}
          </div>
        </div>
      </main>

      <div className="px-5 pb-20">
        <div className="mx-auto max-w-[900px] border-t border-white/[0.06] pt-12">
          <Link href="/cindy#projects" className="inline-flex items-center gap-2 text-sm font-medium text-[#a1a1a6] transition-colors hover:text-white">
            <span aria-hidden="true">←</span>
            {zh ? "返回全部项目" : "Back to all projects"}
          </Link>
        </div>
      </div>
    </div>
  );
}
