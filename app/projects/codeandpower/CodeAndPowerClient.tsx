"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

const EASE = [0.25, 0.1, 0.25, 1.0] as const;
const ACCENT = "#a78bfa"; // violet

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

const content = {
  tagline: {
    en: "If we aren't intersectional, some of us, the most vulnerable, are going to fall through the cracks.",
    zh: "如果我们不采用交叉性视角，其中一些最脆弱的群体将会被遗漏在缝隙之中。",
  },
  taglineAuthor: "— Kimberlé Crenshaw",
  overview: {
    en: "Code and Power is an educational website exploring how implicit bias shapes the digital systems we build and use every day. Built as an academic project with Matt Steines, it frames technology not as a neutral tool but as a reflection of the values — and blind spots — of its creators.",
    zh: "《Code and Power》是一个探讨隐性偏见如何塑造我们日常所用数字系统的教育性网站。该项目与 Matt Steines 合作完成，将技术定义为其创造者价值观与盲区的映射，而非中立工具。",
  },
  sections: [
    {
      title: { en: "The Core Question", zh: "核心议题" },
      points: {
        en: [
          "Who builds technology — and whose needs does it center? Every design decision encodes assumptions about the user.",
          "Implicit biases in machine learning datasets, hiring pipelines, and product teams compound over time, producing systems that serve some users well and others poorly.",
          "Recognizing this isn't pessimism — it's the first step toward building more equitable tools.",
        ],
        zh: [
          "谁在构建技术——它以谁的需求为中心？每一个设计决策都隐含着对用户的假设。",
          "机器学习数据集、招聘流程和产品团队中的隐性偏见会随时间累积，产生对某些用户友好、对另一些用户不友好的系统。",
          "认识到这一点并非悲观主义——而是构建更公平工具的第一步。",
        ],
      },
    },
    {
      title: { en: "Intersectionality & Design", zh: "交叉性与设计" },
      points: {
        en: [
          "Kimberlé Crenshaw's framework of intersectionality — originally developed for legal theory — translates directly into product thinking: a single-axis view of \"the user\" erases people who sit at overlapping margins.",
          "The site profiles innovators who actively work to advance equity across race, class, and gender, demonstrating that inclusion is an engineering constraint, not an afterthought.",
          "Educational resources on the site are designed for first-year students encountering these ideas for the first time, prioritizing clarity over jargon.",
        ],
        zh: [
          "金伯利·克伦肖的交叉性框架——最初为法律理论所开发——可直接转化为产品思维：单轴\"用户\"视角会抹去处于多重边缘的人群。",
          "网站收录了积极推动种族、阶层与性别平等的创新者，证明包容性是工程约束，而非事后想法。",
          "站内教育资源面向首次接触这些理念的大一学生设计，以清晰表达优先，避免术语堆砌。",
        ],
      },
    },
    {
      title: { en: "Machine Learning in Practice", zh: "机器学习实践" },
      points: {
        en: [
          "Using Google's Teachable Machine and TensorFlow.js, I trained a four-class image classifier to distinguish between two alpacas and two badgers — entirely from self-photographed images (548+ photos taken across varying lighting, angles, and distances).",
          "The model revealed a common ML trap: it learned shortcuts. It keyed on object size and camera distance rather than the animals' actual features — a fragile system that broke under new conditions.",
          "This connected directly to Joy Buolamwini's concept of the \"coded gaze\": when training data lacks diversity, the model inherits those gaps. Omission is itself a form of bias.",
          "Training happened entirely in-browser via MobileNet transfer learning, each iteration completing in 30–60 seconds — fast enough to iterate, slow enough to see where each version failed.",
        ],
        zh: [
          "通过 Google Teachable Machine 与 TensorFlow.js，我训练了一个四分类图像识别模型，用于区分两只羊驼和两只獾——所有训练图像均为自拍照片（共 548 张以上，涵盖不同光线、角度与距离）。",
          "模型暴露了一个常见的 ML 陷阱：它学会了走捷径。它依赖物体大小和拍摄距离，而非动物本身的特征——一个脆弱的系统，在新场景下随时崩溃。",
          "这与 Joy Buolamwini 提出的「编码凝视」概念直接相关：当训练数据缺乏多样性，模型便继承了这些缺口。遗漏本身，就是一种偏见。",
          "训练完全在浏览器内通过 MobileNet 迁移学习完成，每次迭代仅需 30–60 秒——快到可以反复试验，慢到足以观察每个版本的失败之处。",
        ],
      },
    },
    {
      title: { en: "What I Learned", zh: "我的收获" },
      points: {
        en: [
          "Framing is a design choice. The way a problem is presented shapes which solutions feel possible — and which populations stay invisible.",
          "Collaboration across different disciplines produces better work. Matt brought a different lens; the friction was generative.",
          "Writing for a general audience is harder than writing for experts. Reducing complexity without losing accuracy is a skill I kept returning to.",
        ],
        zh: [
          "框架本身是一种设计选择。问题的呈现方式决定了哪些解决方案看起来可行——以及哪些群体依然隐形。",
          "跨学科合作能产出更好的作品。Matt 带来了不同的视角，这种摩擦是有价值的。",
          "为普通读者写作比为专家写作更难。在不失准确性的前提下化繁为简，是我一直在打磨的能力。",
        ],
      },
    },
  ],
  tools: ["HTML", "CSS", "GitHub Pages", "Teachable Machine", "TensorFlow.js", "MobileNet", "Transfer Learning", "Intersectional Design Thinking"],
};

export default function CodeAndPowerClient() {
  const { lang, toggle } = useLang();

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>

      {/* Top nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{ height: 48, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link
          href="/#projects"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 text-[#6e6e73] hover:text-[#f5f5f7]"
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
          {lang === "en" ? "Projects" : "项目"}
        </Link>
        <button
          onClick={toggle}
          className="text-xs font-semibold tracking-[0.08em] px-3 py-1.5 rounded-full transition-[color,border-color] duration-200 text-[#86868b] border border-white/[0.12] hover:text-[#f5f5f7] hover:border-white/30"
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 px-5">
        <div className="max-w-[900px] mx-auto">

          <FadeUp>
            <div className="flex items-center gap-3 mb-10">
              <span
                className="text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                style={{ color: ACCENT, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}
              >
                {lang === "en" ? "Academic" : "学术项目"}
              </span>
              <span
                className="text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                style={{ color: "#86868b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {lang === "en" ? "Ethics & Tech" : "科技伦理"}
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1
              className="font-semibold leading-[1.04] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", color: "#f5f5f7", letterSpacing: "-0.03em" }}
            >
              Code and Power
            </h1>
          </FadeUp>

          <FadeUp delay={0.14}>
            <div className="flex flex-wrap gap-3 mb-10">
              {(lang === "en"
                ? ["Collaborative Project", "Matt Steines", "HTML / CSS", "GitHub Pages"]
                : ["合作项目", "Matt Steines", "HTML / CSS", "GitHub Pages"]
              ).map((item) => (
                <span key={item} className="text-sm px-3 py-1.5 rounded-full" style={{ color: "#86868b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {item}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="font-light leading-[1.8] max-w-2xl" style={{ fontSize: "clamp(1rem, 1.6vw, 1.1rem)", color: "#a1a1a6" }}>
              {content.overview[lang]}
            </p>
          </FadeUp>
        </div>
      </header>

      {/* Accent divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        style={{ height: 1, background: `linear-gradient(90deg, ${ACCENT}60, transparent)`, transformOrigin: "left" }}
      />

      {/* Screenshot */}
      <section className="py-16 px-5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: "16/9", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Image
              src="/photos/screenshot-codeandpower.png"
              alt="Code and Power website screenshot"
              fill
              className="object-cover object-top"
              sizes="(max-width:900px) 100vw, 900px"
            />
          </motion.div>

          {/* Pull quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mt-10 pl-6"
            style={{ borderLeft: `2px solid ${ACCENT}` }}
          >
            <p className="font-light leading-[1.8] italic mb-2" style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "#86868b" }}>
              "{content.tagline[lang]}"
            </p>
            <p className="text-sm" style={{ color: "#48484a" }}>{content.taglineAuthor}</p>
          </motion.blockquote>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 px-5 pb-16">
        <div className="max-w-[900px] mx-auto space-y-16">
          {content.sections.map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.85, delay: i * 0.05, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8"
            >
              <div className="md:pt-1">
                <div className="w-5 h-0.5 mb-3 rounded-full" style={{ background: ACCENT }} />
                <h3 className="text-sm font-semibold tracking-tight" style={{ color: "#86868b" }}>
                  {sec.title[lang]}
                </h3>
              </div>
              <ul className="space-y-4">
                {sec.points[lang].map((pt, j) => (
                  <li key={j} className="flex items-start gap-3 font-light leading-[1.75]" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", color: "#d1d1d6" }}>
                    <span className="shrink-0 mt-[6px] w-1 h-1 rounded-full" style={{ background: ACCENT }} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools & live link */}
      <section className="px-5 pb-20">
        <div className="max-w-[900px] mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="rounded-3xl p-10"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-6" style={{ color: "#48484a" }}>
              {lang === "en" ? "Tools & Stack" : "工具与技术"}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.tools.map((tool) => (
                <span key={tool} className="text-sm px-3.5 py-1.5 rounded-full" style={{ color: "#86868b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <a
              href="https://mcsteines.github.io/lis500project3-1stiteration/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-8 py-5 rounded-2xl transition-[background,border-color] duration-300"
              style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <span className="text-sm font-medium" style={{ color: "#f5f5f7" }}>
                {lang === "en" ? "View live project" : "访问在线项目"}
              </span>
              <span className="text-sm group-hover:translate-x-0.5 transition-transform duration-200 inline-block" style={{ color: ACCENT }}>→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Bottom nav */}
      <div className="px-5 pb-20">
        <div className="max-w-[900px] mx-auto pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 text-[#6e6e73] hover:text-[#f5f5f7]"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200 inline-block">←</span>
            {lang === "en" ? "Back to all projects" : "返回全部项目"}
          </Link>
        </div>
      </div>

    </div>
  );
}
