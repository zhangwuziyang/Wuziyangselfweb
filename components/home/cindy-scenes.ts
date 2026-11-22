import type { CindyExpression, CindyPose } from "./cindy-sprite";

export const CHAPTERS = ["hero", "about", "experience", "projects", "global", "music", "skills", "philosophy", "contact"] as const;
export type Chapter = typeof CHAPTERS[number];
export type RGB = readonly [number, number, number];

type Scene = {
  pose: CindyPose;
  expression: CindyExpression;
  entrance: "walk" | "peek" | "slide" | "hop" | "sway";
  color: RGB;
  line: { en: string; zh: string };
};

export const CINDY_SCENES: Record<Chapter, Scene> = {
  hero: {
    pose: "hello", expression: "happy", entrance: "walk", color: [249, 244, 235],
    line: { en: "Wuziyang Zhang works in AI business analytics and builds AI products himself.", zh: "张吴梓洋专注 AI 商业分析，也亲手打造 AI 产品。" },
  },
  about: {
    pose: "book", expression: "neutral", entrance: "peek", color: [227, 216, 198],
    line: { en: "He studies economics and information science, and carries analysis through to execution.", zh: "他主修经济学与信息科学，习惯把分析推进到落地。" },
  },
  experience: {
    pose: "timeline", expression: "happy", entrance: "slide", color: [246, 239, 229],
    line: { en: "In every internship, he turned analysis into guides and tools his team could reuse.", zh: "每段实习，他都把分析沉淀为团队可复用的指南与工具。" },
  },
  projects: {
    pose: "flag", expression: "neutral", entrance: "walk", color: [224, 213, 201],
    line: { en: "His AI products compute first and explain second, so the numbers never come from guesswork.", zh: "他的 AI 产品坚持先计算后解读，数字不交给模型编造。" },
  },
  global: {
    pose: "earth", expression: "surprise", entrance: "hop", color: [243, 239, 231],
    line: { en: "He has traveled to 20+ countries, paying close attention to how people live and choose.", zh: "他走过二十多个国家，更关注当地人如何生活与选择。" },
  },
  music: {
    pose: "music", expression: "happy", entrance: "sway", color: [225, 212, 192],
    line: { en: "Grade 9 piano training gave him patience and restraint in every product detail.", zh: "钢琴九级的训练，让他在产品细节上更有耐心与分寸。" },
  },
  skills: {
    pose: "skills", expression: "neutral", entrance: "peek", color: [245, 237, 223],
    line: { en: "He builds a shared language between business, data, and technology.", zh: "他擅长在业务、数据与技术之间建立共同语言。" },
  },
  philosophy: {
    pose: "think", expression: "think", entrance: "slide", color: [222, 211, 197],
    line: { en: "To him, rigorous logic is only half the job; a product must also feel natural to use.", zh: "在他看来，逻辑严谨之外，产品还必须用起来顺手。" },
  },
  contact: {
    pose: "bye", expression: "shy", entrance: "walk", color: [247, 237, 223],
    line: { en: "Whether it’s an opportunity or an idea, Wuziyang Zhang would be glad to hear from you.", zh: "无论是工作机会还是想法交流，都欢迎联系张吴梓洋。" },
  },
};
