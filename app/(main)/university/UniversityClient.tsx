"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

const EASE = [0.25, 0.1, 0.25, 1.0] as const;

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ──────────────────────────────────────────────────── */

const RANKINGS = [
  {
    value: "#2",
    label: { en: "US Public University", zh: "美国公立大学" },
    source: { en: "Time Magazine 2026",  zh: "时代杂志 2026" },
  },
  {
    value: "#20",
    label: { en: "Worldwide",            zh: "全球排名" },
    source: { en: "Time Magazine 2026",  zh: "时代杂志 2026" },
  },
  {
    value: "#36",
    label: { en: "National University",  zh: "全美大学" },
    source: { en: "US News 2026",        zh: "US News 2026" },
  },
  {
    value: "1848",
    label: { en: "Founded",              zh: "创校年份" },
    source: { en: "Madison, Wisconsin",  zh: "威斯康星·麦迪逊" },
  },
  {
    value: "~49K",
    label: { en: "Students",             zh: "在读学生" },
    source: { en: "Undergraduate + Grad", zh: "本科生 + 研究生" },
  },
  {
    value: "20+",
    label: { en: "Nobel Laureates",      zh: "诺贝尔奖得主" },
    source: { en: "Faculty affiliated",  zh: "关联教职人员" },
  },
];

const UW_ABOUT = {
  en: [
    "The University of Wisconsin–Madison sits on the western shore of Lake Mendota, in the heart of Madison — one of America's most consistently livable cities. Founded in 1848, the same year Wisconsin became a state, it was built on the belief that a university should serve not just its students, but society.",
    "That philosophy — known as the Wisconsin Idea — still defines the place. Research here isn't siloed. It bleeds into policy, industry, and the wider world. UW is regularly ranked among the top five research universities in the United States, with strength across medicine, engineering, social sciences, and the humanities.",
    "For me, it's the right tension: rigorous enough to challenge how I think, open enough to let me build across disciplines.",
  ],
  zh: [
    "威斯康星大学麦迪逊分校坐落于门多塔湖西岸，位于麦迪逊市中心——美国最宜居的城市之一。创建于 1848 年，与威斯康星州建州同年，其创立理念是：大学的使命不仅服务于学生，更服务于整个社会。",
    "这一理念——即「威斯康星理念」——至今仍定义着这所学校。这里的研究不局限于象牙塔，它渗透进政策制定、产业实践与更广泛的社会议题。UW 长期跻身美国顶尖研究型大学行列，在医学、工程、社会科学与人文领域均有深厚积累。",
    "对我而言，这里提供了恰到好处的张力：足够严格，挑战我的思维方式；足够开放，让我跨学科地构建与创造。",
  ],
};

const PROGRAMS = [
  {
    name:   { en: "Economics",            zh: "经济学" },
    school: { en: "College of Letters & Science", zh: "文理学院" },
    color:  "#c5050c",
    icon:   "◈",
    points: {
      en: [
        "One of the top economics departments in the country, with particular strength in econometrics, behavioral economics, and applied microeconomics.",
        "The training goes beyond theory — it builds the habit of reasoning from data, modeling uncertainty, and stress-testing assumptions.",
        "It taught me how markets fail, how incentives shape behavior, and how to read a situation before deciding how to act in it.",
      ],
      zh: [
        "全美顶尖经济学系之一，在计量经济学、行为经济学与应用微观经济学领域尤为突出。",
        "这里的训练不止于理论——它培养的是从数据推理、对不确定性建模、对假设进行压力测试的思维习惯。",
        "它教会了我市场如何失灵、激励如何塑造行为，以及在采取行动前如何透彻地理解一个情境。",
      ],
    },
    courses: {
      en: ["Microeconomic Theory", "Econometrics", "Industrial Organization", "Behavioral Economics", "Financial Economics"],
      zh: ["微观经济学理论", "计量经济学", "产业组织", "行为经济学", "金融经济学"],
    },
  },
  {
    name:   { en: "Information Science",  zh: "信息科学" },
    school: { en: "School of Computer, Data & Information Sciences (CDIS)", zh: "计算机、数据与信息科学学院（CDIS）" },
    color:  "#0071e3",
    icon:   "◇",
    points: {
      en: [
        "CDIS is UW's interdisciplinary home for computing, data systems, and human-centered technology. The Information Science program sits at the intersection of people, systems, and society.",
        "Coursework spans data management, AI and machine learning, human-computer interaction, information architecture, and digital ethics.",
        "It gave me the technical vocabulary and systems-thinking lens I needed to move from strategy to actual product — to not just diagnose, but build.",
      ],
      zh: [
        "CDIS 是 UW 跨学科整合计算、数据系统与以人为本技术的核心学院。信息科学专业处于人、系统与社会的交叉地带。",
        "课程涵盖数据管理、AI 与机器学习、人机交互、信息架构与数字伦理。",
        "它给了我从战略走向产品所需的技术语言和系统思维视角——不只是诊断问题，而是真正去构建解决方案。",
      ],
    },
    courses: {
      en: ["Information Systems", "Human-Computer Interaction", "Data & Algorithms", "AI for Information Problems", "Information Architecture"],
      zh: ["信息系统", "人机交互", "数据与算法", "AI 信息应用", "信息架构"],
    },
  },
];

const WHY = {
  en: "The combination isn't accidental. Economics trained my analytical lens — how to frame a problem, weight evidence, and reason about trade-offs under uncertainty. Information Science gave me the systems vocabulary to act on those insights — to build products, think in architectures, and navigate the intersection of technology and human behavior. Together, they're the intellectual infrastructure behind everything I do.",
  zh: "这两个专业的组合不是偶然。经济学训练了我的分析视角——如何框架问题、权衡证据、在不确定性中推理得失。信息科学给了我将洞察付诸实践的系统语言——构建产品、以架构思考、在技术与人类行为的交叉地带工作。两者合在一起，是我所做一切的智识基础。",
};

/* ─── Component ─────────────────────────────────────────────── */

export default function UniversityClient() {
  const { lang, toggle } = useLang();

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* ── Top nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{
          height: 48,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <Link
          href="/#about"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 text-[#86868b] hover:text-[#1d1d1f]"
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
          {lang === "en" ? "About" : "关于"}
        </Link>
        <button
          onClick={toggle}
          className="text-xs font-semibold tracking-[0.08em] px-3 py-1.5 rounded-full transition-[color,border-color] duration-200 text-[#86868b] border border-black/[0.12] hover:text-[#1d1d1f] hover:border-black/25"
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
      </nav>

      {/* ── Hero ── */}
      <header className="relative pt-12 overflow-hidden" style={{ minHeight: "60vh" }}>
        {/* Ranking photo as full-bleed background */}
        <div className="absolute inset-0">
          <Image
            src="/photos/uw-campus.jpg"
            alt="University of Wisconsin–Madison"
            fill
            className="object-cover"
            style={{ objectPosition: "center 85%" }}
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(255,255,255,0) 70%, rgba(255,255,255,1) 100%)",
            }}
          />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-[900px] mx-auto px-5 pt-20 pb-44">
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md shrink-0 flex items-center justify-center p-1">
                <Image src="/photos/uw-logo.jpg" alt="UW Logo" width={36} height={36} className="object-contain" />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/80">
                {lang === "en" ? "University · Madison, Wisconsin" : "大学 · 威斯康星州麦迪逊市"}
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1
              className="font-semibold leading-[1.04] tracking-tight mb-4 text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.025em", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
            >
              {lang === "en" ? "University of Wisconsin–Madison" : "威斯康星大学麦迪逊分校"}
            </h1>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p
              className="font-light text-white/80 max-w-xl"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.1rem)", lineHeight: 1.7, textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
            >
              {lang === "en"
                ? "Economics · Information Science — where I think and build."
                : "经济学 · 信息科学——我思考与创造的地方。"}
            </p>
          </FadeUp>
        </div>
      </header>

      {/* ── Rankings grid ── */}
      <section style={{ background: "#fff" }} className="py-16 px-5">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-8" style={{ color: "#c5050c" }}>
              {lang === "en" ? "Rankings & Numbers" : "排名与数据"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px" style={{ background: "rgba(0,0,0,0.07)", borderRadius: 16, overflow: "hidden" }}>
              {RANKINGS.map((r, i) => (
                <motion.div
                  key={r.value}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + i * 0.06, ease: EASE }}
                  className="px-6 py-5"
                  style={{ background: "#fff" }}
                >
                  <p className="font-semibold leading-none mb-1.5" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#c5050c", letterSpacing: "-0.02em" }}>
                    {r.value}
                  </p>
                  <p className="text-sm font-medium leading-tight mb-1" style={{ color: "#1d1d1f" }}>
                    {lang === "en" ? r.label.en : r.label.zh}
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: "#86868b" }}>
                    {lang === "en" ? r.source.en : r.source.zh}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── About UW ── */}
      <section style={{ background: "#f5f5f7" }} className="py-20 px-5">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#c5050c" }}>
              {lang === "en" ? "About the University" : "关于这所大学"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-5">
                {(lang === "en" ? UW_ABOUT.en : UW_ABOUT.zh).map((para, i) => (
                  <p key={i} className="font-light leading-[1.8]" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)", color: "#3a3a3c" }}>
                    {para}
                  </p>
                ))}
                <a
                  href="https://www.wisc.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-colors duration-200 mt-2"
                  style={{ color: "#c5050c" }}
                >
                  {lang === "en" ? "Visit wisc.edu" : "访问 wisc.edu"}
                  <span>↗</span>
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/photos/uw-logo.jpg"
                  alt="University of Wisconsin–Madison"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  style={{ background: "#fff", padding: "2rem" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section style={{ background: "#fff" }} className="py-20 px-5 pb-32">
        <div className="max-w-[900px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-14"
            style={{ color: "#0071e3" }}
          >
            {lang === "en" ? "My Programs" : "我的专业"}
          </motion.p>

          <div className="space-y-16">
            {PROGRAMS.map((prog, pi) => (
              <motion.div
                key={prog.name.en}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{ duration: 0.85, delay: pi * 0.06, ease: EASE }}
              >
                {/* Program header */}
                <div className="flex items-start gap-4 mb-8">
                  <div
                    className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                    style={{ background: prog.color }}
                  >
                    {prog.icon}
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl tracking-tight mb-0.5" style={{ color: "#1d1d1f", letterSpacing: "-0.018em" }}>
                      {lang === "en" ? prog.name.en : prog.name.zh}
                    </h2>
                    <p className="text-sm font-mono" style={{ color: "#86868b" }}>
                      {lang === "en" ? prog.school.en : prog.school.zh}
                    </p>
                  </div>
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-10 items-start">
                  {/* Points */}
                  <div className="space-y-4">
                    {(lang === "en" ? prog.points.en : prog.points.zh).map((pt, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ background: prog.color }} />
                        <p className="font-light leading-[1.8]" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)", color: "#3a3a3c" }}>
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Courses chip list */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#86868b" }}>
                      {lang === "en" ? "Key Courses" : "核心课程"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(lang === "en" ? prog.courses.en : prog.courses.zh).map((c) => (
                        <span
                          key={c}
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{ color: prog.color, background: `${prog.color}0d`, border: `1px solid ${prog.color}25` }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {prog.name.en === "Information Science" && (
                  <a
                    href="https://cdis.wisc.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-colors duration-200 mt-6"
                    style={{ color: "#0071e3" }}
                  >
                    {lang === "en" ? "Explore CDIS" : "了解 CDIS 学院"}
                    <span>↗</span>
                  </a>
                )}

                {pi < PROGRAMS.length - 1 && (
                  <div className="mt-14 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why this combination ── */}
      <section style={{ background: "#1d1d1f" }} className="py-20 px-5">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-8" style={{ color: "#c5050c" }}>
              {lang === "en" ? "Why This Combination" : "为何选择这两个专业"}
            </p>
            <p
              className="font-light leading-[1.8] max-w-2xl"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", color: "#d1d1d6" }}
            >
              {lang === "en" ? WHY.en : WHY.zh}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Bottom nav ── */}
      <div style={{ background: "#1d1d1f", borderTop: "1px solid rgba(255,255,255,0.06)" }} className="px-5 py-12">
        <div className="max-w-[900px] mx-auto">
          <Link
            href="/#about"
            className="group inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 text-[#6e6e73] hover:text-[#f5f5f7]"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200 inline-block">←</span>
            {lang === "en" ? "Back to About" : "返回关于"}
          </Link>
        </div>
      </div>

    </div>
  );
}
