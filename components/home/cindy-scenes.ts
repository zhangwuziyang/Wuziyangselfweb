import type { CindyExpression, CindyPose } from "./cindy-sprite";

export const CHAPTERS = ["hero", "about", "experience", "projects", "global", "music", "skills", "philosophy", "contact"] as const;
export type Chapter = typeof CHAPTERS[number];
type Line = { en: string; zh: string };
export type RGB = readonly [number, number, number];
export type Side = "left" | "right";
type Scene = {
  pose: CindyPose;
  expression: CindyExpression;
  side: Side;
  color: RGB;
  line: Line;
  short: Line;
};

export const CINDY_SCENES: Record<Chapter, Scene> = {
  hero: {
    pose: "hello", expression: "happy", side: "left", color: [249, 244, 235],
    line: { en: "Hi, I’m Cindy. I’ll show you around Wuziyang’s portfolio.", zh: "嗨，我是 Cindy。我来带你逛逛梓洋的作品集。" },
    short: { en: "Hi, I’m Cindy.", zh: "嗨，我是 Cindy。" },
  },
  about: {
    pose: "perch", expression: "neutral", side: "left", color: [248, 242, 232],
    line: { en: "Let me show you what Wuziyang studies at UW–Madison.", zh: "我先带你看看梓洋在威斯康星大学麦迪逊分校学什么。" },
    short: { en: "I’ll show you UW–Madison.", zh: "我带你看校园。" },
  },
  experience: {
    pose: "timeline", expression: "wink", side: "left", color: [246, 241, 233],
    line: { en: "I’ll follow his work across strategy, research, and finance.", zh: "我沿时间线带你看他的战略、研究和金融经历。" },
    short: { en: "I’ll light the timeline.", zh: "我来点亮时间线。" },
  },
  projects: {
    pose: "flag", expression: "neutral", side: "right", color: [245, 240, 232],
    line: { en: "I picked two stops here, Offer Radar and My Health Agent.", zh: "我在这里安排了两站，Offer 雷达和健康助理。" },
    short: { en: "I’ve got two demos.", zh: "我带你看两个项目。" },
  },
  global: {
    pose: "earth", expression: "surprise", side: "right", color: [244, 237, 226],
    line: { en: "I’ve got stories to share from his travels across more than 20 countries.", zh: "我想跟你分享他走过二十多个国家的故事。" },
    short: { en: "I’ll take you traveling.", zh: "我带你去旅行。" },
  },
  music: {
    pose: "music", expression: "happy", side: "right", color: [235, 226, 213],
    line: { en: "I hear the years he spent at the piano in how he thinks about rhythm.", zh: "我听得出，多年练琴塑造了他对节奏的感觉。" },
    short: { en: "I’m listening to piano.", zh: "我在听钢琴。" },
  },
  skills: {
    pose: "skills", expression: "wink", side: "right", color: [242, 234, 223],
    line: { en: "I’ve gathered his tools for strategy, product, data, and design.", zh: "我把他的战略、产品、数据和设计工具都找来了。" },
    short: { en: "I found his toolkit.", zh: "我找齐了他的工具。" },
  },
  philosophy: {
    pose: "think", expression: "think", side: "left", color: [245, 239, 230],
    line: { en: "I like his test for good work. Make it useful, elegant, and memorable.", zh: "我喜欢他的标准。做得实用、优雅，也让人记得住。" },
    short: { en: "I’ll pause and think.", zh: "我也停下来想想。" },
  },
  contact: {
    pose: "bye", expression: "shy", side: "right", color: [248, 241, 231],
    line: { en: "I enjoyed showing you around. I’m here if you’d like to chat.", zh: "我很高兴带你逛完这一路。还想聊的话，点我就好。" },
    short: { en: "I’m here to chat.", zh: "我还在，点我聊聊。" },
  },
};

export const CINDY_REPLIES: readonly Line[] = [
  { en: "I can show you more.", zh: "我还有更多想给你看。" },
  { en: "I’m glad you stopped by.", zh: "很高兴你来逛逛。" },
  { en: "I picked my own stripes.", zh: "条纹衫是我自己挑的。" },
  { en: "I know a shortcut!", zh: "我知道一条近路！" },
];

export type CindyReaction = number | "egg" | "sleep" | null;
export const CINDY_EGG = { en: "You found my secret!", zh: "你找到彩蛋啦！" };

export const CINDY_SKILLS: readonly Line[] = [
  { en: "Strategy", zh: "战略" }, { en: "Product", zh: "产品" },
  { en: "Data", zh: "数据" }, { en: "Design", zh: "设计" },
];
