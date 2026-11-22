"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLang } from "@/context/LangContext";

/* ─── Data ──────────────────────────────────────────────────── */

const RANKINGS = [
  {
    value: "#2",
    label: { en: "US Public University", zh: "美国公立大学" },
    source: { en: "Time Magazine 2026",  zh: "《时代》周刊 2026" },
  },
  {
    value: "#20",
    label: { en: "Worldwide",            zh: "全球排名" },
    source: { en: "Time Magazine 2026",  zh: "《时代》周刊 2026" },
  },
  {
    value: "#36",
    label: { en: "National University",  zh: "全美综合大学" },
    source: { en: "US News 2026",        zh: "US News 2026" },
  },
  {
    value: "1848",
    label: { en: "Founded",              zh: "创校年份" },
    source: { en: "Madison, Wisconsin",  zh: "威斯康星州麦迪逊" },
  },
  {
    value: "~49K",
    label: { en: "Students",             zh: "在读学生" },
    source: { en: "Undergraduate + Grad", zh: "本科生 + 研究生" },
  },
  {
    value: "20+",
    label: { en: "Nobel Laureates",      zh: "诺贝尔奖得主" },
    source: { en: "Affiliated scholars", zh: "校友及教职" },
  },
];

const UW_ABOUT = {
  en: [
    "The University of Wisconsin–Madison sits on the southern shore of Lake Mendota, in the heart of Madison, one of America's most consistently livable cities. Founded in 1848, the same year Wisconsin became a state, it was built on the idea that a university belongs to the wider public as much as to its students.",
    "That ethos, known as the Wisconsin Idea, still defines the place. Research here rarely stays inside the ivory tower; it flows into policy, industry, and the wider world. UW regularly ranks among the top five research universities in the United States, with depth across medicine, engineering, social sciences, and the humanities.",
    "For me, it offers the right balance: rigorous enough to stretch how I think, and open enough to let me work across disciplines.",
  ],
  zh: [
    "威斯康星大学麦迪逊分校坐落在门多塔湖南岸、麦迪逊市中心，这是美国一向以宜居著称的城市。学校创办于 1848 年，与威斯康星州建州同年，建校伊始便笃信：大学既服务于学生，更要回馈整个社会。",
    "这份被称为「威斯康星理念」的精神，至今仍在塑造这所学校。这里的学术研究很少停留在象牙塔里，而是不断流入公共政策、产业实践与更广阔的现实世界。UW 长期位列全美前五研究型大学，在医学、工程、社会科学与人文领域都底蕴深厚。",
    "对我而言，这里有种恰到好处的平衡：严谨到足以打磨我的思考方式，又开放到允许我跨学科地探索与创造。",
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
        "The training goes well past pure theory, building the habit of reasoning from data, modeling uncertainty, and stress-testing assumptions.",
        "It taught me why markets fail, how incentives steer behavior, and how to read a situation clearly before deciding how to move.",
      ],
      zh: [
        "全美顶尖经济学系之一，在计量经济学、行为经济学与应用微观经济学领域尤为突出。",
        "这里的训练不止于纸面理论，更让我养成了一套思维习惯：从数据出发推演、为不确定性建模、反复检验每一个前提假设。",
        "它让我看清市场为何失灵、激励如何左右人的选择，也教会我在出手之前先把局势读透。",
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
        "CDIS is UW's interdisciplinary home for computing, data systems, and human-centered technology, where Information Science brings together people, systems, and society.",
        "Coursework spans data management, AI and machine learning, human-computer interaction, information architecture, and digital ethics.",
        "It gave me the technical fluency and systems lens to move from strategy to real products, bridging analysis and hands-on building.",
      ],
      zh: [
        "CDIS 是 UW 汇聚计算、数据系统与以人为本技术的跨学科核心学院；信息科学专业立足于人、系统与社会的交汇处。",
        "课程涵盖数据管理、AI 与机器学习、人机交互、信息架构与数字伦理。",
        "它补齐了我从战略走向产品所需的技术语言与系统视角，让我既能诊断问题，也能亲手把方案做出来。",
      ],
    },
    courses: {
      en: ["Information Systems", "Human-Computer Interaction", "Data & Algorithms", "AI for Information Problems", "Information Architecture"],
      zh: ["信息系统", "人机交互", "数据与算法", "AI 信息应用", "信息架构"],
    },
  },
];

const WHY = {
  en: "Choosing both majors was deliberate. Economics sharpened my analytical lens: framing messy problems, weighing evidence, and reasoning through trade-offs under uncertainty. Information Science gave me the systems vocabulary to act on those insights, design products, think in architectures, and work where technology meets human behavior. Together, they form the foundation behind everything I do.",
  zh: "选择这两个专业并非一时兴起。经济学磨炼了我的分析眼光：拆解问题、权衡证据、在不确定性里算清取舍；信息科学则给了我将洞察落地的系统语言，让我能以架构的眼光思考，在技术与人的交汇处把产品真正做出来。两者合在一处，正是我做每一件事的底层根基。",
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
            preload
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
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md shrink-0 flex items-center justify-center p-1">
                <Image src="/photos/uw-logo.jpg" alt="UW Logo" width={36} height={36} className="object-contain" />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/80">
                {lang === "en" ? "University · Madison, Wisconsin" : "大学 · 威斯康星州麦迪逊"}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1
              className="font-semibold leading-[1.04] tracking-tight mb-4 text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.025em", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
            >
              {lang === "en" ? "University of Wisconsin–Madison" : "威斯康星大学麦迪逊分校"}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <p
              className="font-light text-white/80 max-w-xl"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.1rem)", lineHeight: 1.7, textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
            >
              {lang === "en"
                ? "Economics & Information Science — sharpening how I think and build."
                : "在这里修读经济学与信息科学，打磨我的思考与创造。"}
            </p>
          </ScrollReveal>
        </div>
      </header>

      {/* ── Rankings grid ── */}
      <section style={{ background: "#fff" }} className="py-16 px-5">
        <div className="max-w-[900px] mx-auto">
          <div data-scroll-reveal="">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-8" style={{ color: "#c5050c" }}>
              {lang === "en" ? "Rankings & Numbers" : "排名与数据"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px" style={{ background: "rgba(0,0,0,0.07)", borderRadius: 16, overflow: "hidden" }}>
              {RANKINGS.map((r) => (
                <div
                  key={r.value}
                  data-scroll-reveal=""
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About UW ── */}
      <section style={{ background: "#f5f5f7" }} className="py-20 px-5">
        <div className="max-w-[900px] mx-auto">
          <div data-scroll-reveal="">
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
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section style={{ background: "#fff" }} className="py-20 px-5 pb-32">
        <div className="max-w-[900px] mx-auto">
          <p
            data-scroll-reveal=""
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-14"
            style={{ color: "#0071e3" }}
          >
            {lang === "en" ? "My Programs" : "我的专业"}
          </p>

          <div className="space-y-16">
            {PROGRAMS.map((prog, pi) => (
              <div
                key={prog.name.en}
                data-scroll-reveal=""
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why this combination ── */}
      <section style={{ background: "#1d1d1f" }} className="py-20 px-5">
        <div className="max-w-[900px] mx-auto">
          <div data-scroll-reveal="">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-8" style={{ color: "#c5050c" }}>
              {lang === "en" ? "Why This Combination" : "为何选择这两个专业"}
            </p>
            <p
              className="font-light leading-[1.8] max-w-2xl"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", color: "#d1d1d6" }}
            >
              {lang === "en" ? WHY.en : WHY.zh}
            </p>
          </div>
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
            {lang === "en" ? "Back to About" : "返回关于板块"}
          </Link>
        </div>
      </div>

    </div>
  );
}
