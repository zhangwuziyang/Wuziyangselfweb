import type { CindyExpression, CindyPose } from "./cindy-sprite";

export const CHAPTERS = ["hero", "about", "experience", "projects", "global", "music", "skills", "philosophy", "contact"] as const;
export type Chapter = typeof CHAPTERS[number];
type Line = { en: string; zh: string };
type Scene = {
  pose: CindyPose;
  expression: CindyExpression;
  position: readonly [x: number, y: number];
  line: Line;
};

export const CINDY_SCENES: Record<Chapter, Scene> = {
  hero: {
    pose: "hello", expression: "happy", position: [0, .34],
    line: { en: "Hi, I’m Cindy. I’ll show you around.", zh: "你好，我是 Cindy。我带你逛逛这里。" },
  },
  about: {
    pose: "point", expression: "neutral", position: [-6, .46],
    line: { en: "Economics and information science at UW–Madison.", zh: "梓洋在威斯康星大学麦迪逊分校读经济学和信息科学。" },
  },
  experience: {
    pose: "timeline", expression: "think", position: [5, .59],
    line: { en: "From strategy and research to finance.", zh: "沿时间线看看他做过的战略、研究和金融工作。" },
  },
  projects: {
    pose: "laptop", expression: "neutral", position: [-5, .43],
    line: { en: "Two things he built: Offer Radar and My Health Agent.", zh: "来看看他做的两个产品，Offer 雷达和健康助理。" },
  },
  global: {
    pose: "earth", expression: "surprise", position: [5, .61],
    line: { en: "20+ countries, 100+ cities. Each taught him something.", zh: "他走过 20 多个国家、100 多座城市，每一站都有新发现。" },
  },
  music: {
    pose: "music", expression: "happy", position: [-6, .48],
    line: { en: "Years at the piano taught him to work with rhythm.", zh: "多年练琴，教会了他怎么把握节奏。" },
  },
  skills: {
    pose: "skills", expression: "wink", position: [5, .58],
    line: { en: "Strategy, product, data, and design.", zh: "这是他的四组工具，涵盖战略、产品、数据和设计。" },
  },
  philosophy: {
    pose: "think", expression: "think", position: [-4, .39],
    line: { en: "Useful, elegant things that stay with you.", zh: "他想做实用、优雅、让人记得住的东西。" },
  },
  contact: {
    pose: "bye", expression: "shy", position: [0, .68],
    line: { en: "Thanks for stopping by. Tap me to chat.", zh: "谢谢你逛到这里。想聊的话，点我就好。" },
  },
};

export const CINDY_REPLIES: readonly Line[] = [
  { en: "Shall we keep going?", zh: "要继续往下看看吗？" },
  { en: "I’m glad you stopped by.", zh: "很高兴你来逛逛。" },
  { en: "I picked the stripes myself.", zh: "这件条纹衫是我自己挑的。" },
  { en: "I know a shortcut. Try the links up top.", zh: "我知道一条近路，试试顶部的导航。" },
];

export type CindyReaction = number | "egg" | "sleep" | null;

export const CINDY_EGG = { en: "You found my little secret.", zh: "你找到我的小彩蛋了。" };
