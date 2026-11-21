import healthCopy from "./health-agent-copy.json";
import type { ProjectStoryConfig } from "./storyTypes";

const { detail } = healthCopy;

export const healthAgentStory: ProjectStoryConfig = {
  slug: "health-agent",
  device: "iphone",
  mascotIcon: {
    src: "/images/projects/health-agent/h-000.webp",
    alt: {
      zh: "健康助理应用图标",
      en: "My Health Agent mascot icon",
    },
  },
  title: {
    zh: detail.zh.title,
    en: detail.en.title,
  },
  subtitle: {
    zh: detail.zh.subtitle,
    en: detail.en.subtitle,
  },
  badges: {
    zh: [detail.zh.tag1, detail.zh.tag2],
    en: [detail.en.tag1, detail.en.tag2],
  },
  status: {
    zh: "核心功能已完成，准备上架 App Store · 计划先上线国内区",
    en: "Core features complete, preparing for App Store launch",
  },
  baseBackground: "#fbfaf6",
  endingBackground: "#090d11",
  accentLight: "#0f8f66",
  accentDark: "#38d9a9",
  darkTransition: [0.64, 0.7],
  openingPose: {
    xPct: 0,
    yVh: 34,
    scale: 0.92,
    rotateY: 0,
    rotateX: 7,
  },
  openingScreen: {
    src: "/images/projects/health-agent/h-001.webp",
    alt: {
      zh: "健康助理主界面：身体电量 65%、运动 37%、睡眠 91% 与今日行动建议",
      en: "My Health Agent home screen showing Energy 65%, Activity 37%, Sleep 91%, and daily recommendations",
    },
  },
  backdropLayers: [
    {
      id: "opening-pearl",
      fadeIn: [0, 0.01],
      background: "#fbfaf6",
      glow: "radial-gradient(62% 52% at 50% 62%, rgba(244, 189, 89, 0.18), rgba(114, 178, 255, 0.08) 48%, transparent 76%)",
    },
    {
      id: "ch1-sunrise",
      fadeIn: [0.1, 0.16],
      background: "#f6f0e6",
      glow: "radial-gradient(56% 56% at 72% 50%, rgba(235, 166, 52, 0.22), rgba(248, 219, 164, 0.08) 54%, transparent 78%)",
    },
    {
      id: "ch2-mist",
      fadeIn: [0.28, 0.34],
      background: "#eef4f8",
      glow: "radial-gradient(56% 56% at 28% 50%, rgba(34, 197, 139, 0.16), rgba(88, 166, 255, 0.12) 52%, transparent 78%)",
    },
    {
      id: "ch3-lavender",
      fadeIn: [0.46, 0.52],
      background: "#f1eff7",
      glow: "radial-gradient(56% 56% at 72% 50%, rgba(124, 106, 239, 0.16), rgba(92, 198, 168, 0.08) 52%, transparent 78%)",
    },
    {
      id: "ch4-obsidian-emerald",
      fadeIn: [0.64, 0.7],
      background: "#0a1412",
      glow: "radial-gradient(54% 54% at 28% 50%, rgba(22, 185, 129, 0.22), rgba(76, 134, 244, 0.1) 52%, transparent 76%)",
    },
    {
      id: "ch5-midnight",
      fadeIn: [0.82, 0.88],
      background: "#0b0f17",
      glow: "radial-gradient(54% 54% at 72% 50%, rgba(129, 108, 248, 0.2), rgba(56, 189, 248, 0.08) 54%, transparent 78%)",
    },
    {
      id: "ending-carbon",
      fadeIn: [0.95, 0.995],
      background: "#090d11",
      glow: "radial-gradient(60% 42% at 50% 18%, rgba(45, 212, 191, 0.1), transparent 72%)",
    },
  ],
  chapters: [
    {
      id: "scores",
      indexLabel: "01",
      eyebrow: {
        zh: "从满屏图表到大白话",
        en: "BEYOND RAW CHARTS",
      },
      headline: {
        zh: "十几项手表指标，\n只合成三个分数。",
        en: "A dozen Watch signals.\nThree clear scores.",
      },
      body: {
        zh: "很多人每天戴着 Apple Watch 记录心率、睡眠与运动，却不知道今天该怎么安排。健康助理只和自己过去 60 天对比，把复杂指标合成「身体电量、运动、睡眠」，一眼读懂原因。",
        en: "Apple Watch records heart rate, sleep, and workouts every day—yet raw charts rarely tell you how to pace today. Compared strictly against your own 60-day baseline, a dozen signals distill into Energy, Activity, and Sleep.",
      },
      details: {
        zh: ["60 天个人基准", "零术语大白话", "打开即对话"],
        en: ["60-day personal baseline", "Zero clinical jargon", "Opens straight to chat"],
      },
      accent: "#c97a16",
      textSide: "left",
      surface: "light",
      screen: {
        src: "/images/projects/health-agent/h-002.webp",
        alt: {
          zh: "身体电量 65% 详情页，展示身体放松度、安静心率与昨晚睡眠原因拆解",
          en: "65% Energy score ring breakdown showing relaxation, resting heart rate, and last night's sleep",
        },
      },
      pose: {
        xPct: 23,
        yVh: 0,
        scale: 1,
        rotateY: -7,
        rotateX: 2,
      },
    },
    {
      id: "compute-first",
      indexLabel: "02",
      eyebrow: {
        zh: "先算后说 · 绝不编数字",
        en: "COMPUTE FIRST, COACH SECOND",
      },
      headline: {
        zh: "数字手机先算好，\nAI 只负责讲清楚。",
        en: "Math runs locally.\nAI speaks on grounded truth.",
      },
      body: {
        zh: "通用 AI 不了解你的身体，还容易编出危险的热量建议。这里所有分数与热量安全下限都先在手机本地按规则算好；你想少吃一点，AI 也会守住安全红线、展示前后对比，并支持一键撤销。",
        en: "Generic AI chats lack your baseline and can hallucinate unsafe targets. Every score and calorie safety floor is computed on-device first—so when you ask to eat lighter, AI stays within safe bounds, shows a clear diff, and offers instant undo.",
      },
      details: {
        zh: ["热量安全下限兜底", "改前改后清晰对照", "随时一键撤销"],
        en: ["Calorie safety floors", "Before / after diff", "One-tap undo"],
      },
      accent: "#0d9468",
      textSide: "right",
      surface: "light",
      screen: {
        src: "/images/projects/health-agent/h-009.webp",
        alt: {
          zh: "对话中调整饮食计划，展示 1650 到 1575 千卡改前改后对照、安全范围提示与撤销按钮",
          en: "In-chat plan revision showing calorie adjustment from 1650 to 1575 kcal with safety-bound notice and Undo button",
        },
      },
      pose: {
        xPct: -23,
        yVh: -1,
        scale: 1.02,
        rotateY: 7,
        rotateX: 1,
      },
    },
    {
      id: "memory-safety",
      indexLabel: "03",
      eyebrow: {
        zh: "长期记忆与安全边界",
        en: "MEMORY & SAFEGUARDS",
      },
      headline: {
        zh: "记得你的旧伤与作息，\n也懂何时该克制。",
        en: "Remembers real life.\nKnows when to step back.",
      },
      body: {
        zh: "左膝跑步超 5 公里会疼、晚饭常在公司吃——这些长期记忆都安静留在手机里，随时左滑可删。遇到进食障碍、孕期等敏感场景会自动隐藏全部热量，识别急症关键词则直接给出当地急救电话。",
        en: "A sore left knee past 5 km, late weeknights, dietary habits—long-term memory stays editable right on your phone. For sensitive groups like pregnancy or disordered eating, calorie numbers disappear automatically; urgent keywords surface local emergency hotlines instead of AI.",
      },
      details: {
        zh: ["本地长期记忆随时可删", "敏感场景自动隐藏热量", "急症直出当地急救电话"],
        en: ["Editable on-device memory", "Auto-hides calories when sensitive", "Direct local emergency hotlines"],
      },
      accent: "#6c5ce7",
      textSide: "left",
      surface: "light",
      screen: {
        src: "/images/projects/health-agent/h-016.webp",
        alt: {
          zh: "健康助理记住的事列表：长期睡眠习惯、左膝旧伤与饮食偏好，保存在手机本地",
          en: "On-device long-term memory list storing sleep habits, left knee injury notes, and food preferences",
        },
      },
      pose: {
        xPct: 23,
        yVh: 1,
        scale: 1,
        rotateY: -6,
        rotateX: -1,
      },
    },
    {
      id: "calendar-night",
      indexLabel: "04",
      eyebrow: {
        zh: "主动复盘 · 日夜相伴",
        en: "PROACTIVE RHYTHM",
      },
      headline: {
        zh: "吃、动、睡三环，\n把每天连成趋势。",
        en: "Eat, Move, Sleep.\nEvery day in quiet focus.",
      },
      body: {
        zh: "不必靠意志力每天想起提问：早间同步睡眠后给结论，锻炼后与晚间主动复盘。每一天的饮食、运动与睡眠都浓缩进三层同心圆环，全页面原生支持深色模式，晚上回看也柔和不刺眼。",
        en: "No willpower required to check in. Morning conclusions follow your sleep sync, paired with post-workout and evening recaps. Each day's Eat, Move, and Sleep goals form concentric rings in a native dark calendar built for calm nighttime review.",
      },
      details: {
        zh: ["吃 / 动 / 睡三层同心环", "早晚与运动后主动复盘", "全页面原生深色模式"],
        en: ["Eat / Move / Sleep rings", "Morning & evening recaps", "Native full dark mode"],
      },
      accent: "#38d9a9",
      textSide: "right",
      surface: "dark",
      screen: {
        src: "/images/projects/health-agent/h-021.webp",
        alt: {
          zh: "深色模式计划日历，按天以橙蓝紫三色圆环展示吃、动、睡完成度",
          en: "Dark-mode plan calendar visualizing daily Eat, Move, and Sleep progress in luminous concentric rings",
        },
        darkScreen: true,
      },
      pose: {
        xPct: -23,
        yVh: 0,
        scale: 1.02,
        rotateY: 7,
        rotateX: 1,
      },
    },
    {
      id: "privacy-region",
      indexLabel: "05",
      eyebrow: {
        zh: "本地优先 · 双区域合规",
        en: "LOCAL-FIRST PRIVACY",
      },
      headline: {
        zh: "你的数据，\n始终由你做主。",
        en: "Your health data.\nAlways on your terms.",
      },
      body: {
        zh: "对苹果「健康」严格只读，算分与加密对话留在手机本地；FastAPI 后端仅转发必要摘要、不存健康或聊天原文。首次引导拆分健康数据与 AI 授权，双区域自动分流：国内通义千问数据不出境，海外接入 Claude。",
        en: "Apple Health stays strictly read-only while scoring and encrypted chats remain on iPhone. The FastAPI backend only forwards compact summaries without storing conversations—splitting Health and AI consent upfront, routing China to Qwen onshore and overseas users to Claude.",
      },
      details: {
        zh: ["HealthKit 严格只读", "国内通义千问 · 海外 Claude", "不开启 AI 仍可用核心功能"],
        en: ["Read-only HealthKit", "Qwen in China · Claude abroad", "Core features work without AI"],
      },
      accent: "#a594ff",
      textSide: "left",
      surface: "dark",
      screen: {
        src: "/images/projects/health-agent/h-022.webp",
        alt: {
          zh: "你的数据你做主隐私引导页，拆分健康数据处理与 AI 服务独立授权勾选",
          en: "Privacy onboarding screen separating HealthKit processing consent from optional AI service consent",
        },
      },
      pose: {
        xPct: 23,
        yVh: 0,
        scale: 1.01,
        rotateY: -6,
        rotateX: 0,
      },
    },
  ],
  galleryHeading: {
    zh: "更多真实界面",
    en: "A closer look inside.",
  },
  gallerySubheading: {
    zh: "从数据总览、拍照记饮食到对话日历与隐私开关，每一个细节都为日常低负担而做。",
    en: "From pinned metrics and meal-photo logging to searchable history and one-tap AI privacy controls.",
  },
  gallery: [
    {
      src: "/images/projects/health-agent/h-003.webp",
      title: { zh: "常看的数据", en: "Data Overview" },
      caption: {
        zh: "自定义置顶三项核心分数，一眼看清热量、蛋白质与安静心率区间。",
        en: "Pin your top three metrics alongside calorie, protein, and resting heart-rate bounds.",
      },
      alt: {
        zh: "常看的数据页面，展示置顶分数与今日热量蛋白质进度条",
        en: "Data overview screen with pinned scores, calories, protein bars, and resting heart rate",
      },
    },
    {
      src: "/images/projects/health-agent/h-015.webp",
      title: { zh: "拍照记一餐", en: "Snap a Meal" },
      caption: {
        zh: "拍下碗盘自动估算营养，支持吃前吃后对照，省去繁琐表单。",
        en: "Snap a photo to estimate portions and macros—no tedious manual food entry.",
      },
      alt: {
        zh: "记一餐拍照估算界面，提示拍全碗盘以便更准估算热量",
        en: "Meal photo logging screen with guidance for accurate portion estimation",
      },
    },
    {
      src: "/images/projects/health-agent/h-018.webp",
      title: { zh: "可搜索对话日历", en: "Searchable Chat Calendar" },
      caption: {
        zh: "按天回溯所有记录与聊天摘要，支持关键词检索与按月跳转。",
        en: "Revisit any day's concentric rings and conversation history with instant search.",
      },
      alt: {
        zh: "浅色对话日历界面，顶部带搜索框与每日三色同心环",
        en: "Light-mode chat calendar with search bar and daily concentric health rings",
      },
    },
    {
      src: "/images/projects/health-agent/h-024.webp",
      title: { zh: "独立隐私开关", en: "Granular AI Switch" },
      caption: {
        zh: "随时关闭 AI 数据发送，本地分数、提醒与记录依然照常运行。",
        en: "Toggle AI sharing off anytime—local scoring, reminders, and tracking keep working.",
      },
      alt: {
        zh: "隐私和数据设置页，提供独立的 AI 开关与产品改进开关",
        en: "Privacy and data settings screen with independent switches for AI sharing and diagnostics",
      },
    },
  ],
  statsHeading: {
    zh: "系统规格与工程底座",
    en: "Built for trust, end to end.",
  },
  stats: [
    {
      value: "60d",
      label: { zh: "个人滚动基准", en: "Personal baseline" },
      note: {
        zh: "所有分数只和自己过去 60 天对比，不与他人攀比",
        en: "Every score compares solely against your own 60-day history",
      },
    },
    {
      value: "3",
      label: { zh: "大白话核心分数", en: "Plain-language scores" },
      note: {
        zh: "身体电量、运动、睡眠，屏蔽 HRV 等晦涩术语",
        en: "Energy, Activity, and Sleep—distilled from 12+ Watch signals",
      },
    },
    {
      value: "0",
      label: { zh: "服务器留存原文", en: "Stored chats on server" },
      note: {
        zh: "算分与加密对话留本地，后端只做无状态摘要转发",
        en: "Encrypted chats & scoring live locally; server forwards summaries only",
      },
    },
    {
      value: "2x",
      label: { zh: "双区域模型分流", en: "Dual-region routing" },
      note: {
        zh: "国内阿里云通义千问数据不出境，海外自动路由 Claude",
        en: "Mainland China routes to Qwen onshore; overseas routes to Claude",
      },
    },
  ],
  metaPills: {
    zh: detail.zh.meta,
    en: detail.en.meta,
  },
  techTags: {
    zh: detail.zh.techTags,
    en: detail.en.techTags,
  },
  disclaimer: {
    zh: detail.zh.disclaimer,
    en: detail.en.disclaimer,
  },
  sibling: {
    href: "/projects/offer-radar",
    eyebrow: { zh: "下一个项目", en: "Next Project" },
    title: { zh: "Offer 雷达", en: "Offer Radar" },
  },
};
