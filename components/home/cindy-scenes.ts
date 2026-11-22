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
    line: { en: "I’ll show you how Wuziyang turns questions into products.", zh: "我带你看看梓洋怎样把问题做成产品。" },
  },
  about: {
    pose: "book", expression: "neutral", entrance: "peek", color: [227, 216, 198],
    line: { en: "I opened his UW–Madison notes on econ and info science.", zh: "我翻到梓洋在麦迪逊学经济和信息科学这页。" },
  },
  experience: {
    pose: "timeline", expression: "happy", entrance: "slide", color: [246, 239, 229],
    line: { en: "I’ve marked his ByteDance and Alibaba stops on the timeline.", zh: "我沿时间线带你看他在字节和阿里的经历。" },
  },
  projects: {
    pose: "flag", expression: "neutral", entrance: "walk", color: [224, 213, 201],
    line: { en: "I’ll show you his two demos: Offer Radar and My Health Agent.", zh: "我带你试试他做的求职雷达和健康助理。" },
  },
  global: {
    pose: "earth", expression: "surprise", entrance: "hop", color: [243, 239, 231],
    line: { en: "I picked Machu Picchu from his travels across 20-plus countries.", zh: "我从他去过的二十多国挑了马丘比丘。" },
  },
  music: {
    pose: "music", expression: "happy", entrance: "sway", color: [225, 212, 192],
    line: { en: "I’ll cue the piano. He practised all the way to Grade 9!", zh: "我给你听听他练到九级的钢琴功夫。" },
  },
  skills: {
    pose: "skills", expression: "neutral", entrance: "peek", color: [245, 237, 223],
    line: { en: "I’ve got my lens on his data and product skills.", zh: "我用放大镜找到了他的数据和产品本领。" },
  },
  philosophy: {
    pose: "think", expression: "think", entrance: "slide", color: [222, 211, 197],
    line: { en: "I wrote down his rule: make it useful, elegant, and memorable.", zh: "我记下他的准则，实用、优雅，还要让人记住。" },
  },
  contact: {
    pose: "bye", expression: "shy", entrance: "walk", color: [247, 237, 223],
    line: { en: "I’ve laid out his email and résumé. Come say hello!", zh: "我替梓洋备好了邮箱和简历，聊聊吧。" },
  },
};
