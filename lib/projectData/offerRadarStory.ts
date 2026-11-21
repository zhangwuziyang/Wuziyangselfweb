import offerCopy from "./offer-radar-copy.json";
import type { ProjectStoryConfig } from "./storyTypes";

const { card, detail } = offerCopy;

export const offerRadarStory: ProjectStoryConfig = {
  slug: "offer-radar",
  device: "macbook",
  browserDomain: "offerradar.cn",
  title: {
    zh: detail.zh.title,
    en: detail.en.title,
  },
  subtitle: {
    zh: detail.zh.subtitle,
    en: detail.en.subtitle,
  },
  badges: {
    zh: [card.zh.tag1, card.zh.tag2],
    en: [card.en.tag1, card.en.tag2],
  },
  status: {
    zh: detail.zh.status,
    en: detail.en.status,
  },
  baseBackground: "#f7f8fc",
  endingBackground: "#090c15",
  accentLight: "#4f46e5",
  accentDark: "#818cf8",
  darkTransition: [0.81, 0.87],
  openingPose: {
    xPct: 0,
    yVh: 30,
    scale: 0.96,
    rotateY: 0,
    rotateX: 7,
  },
  openingScreen: {
    src: "/images/projects/offer-radar/o-003.webp",
    alt: {
      zh: "Offer 雷达首页，展示品牌标志与 AI 对话助手小雷的启动输入框",
      en: "Offer Radar landing workspace featuring the brand mark and Xiao Lei AI assistant prompt bar",
    },
  },
  backdropLayers: [
    {
      id: "opening-ice",
      fadeIn: [0, 0.01],
      background: "#f7f8fc",
      glow: "radial-gradient(64% 52% at 50% 60%, rgba(99, 102, 241, 0.16), rgba(56, 189, 248, 0.1) 48%, transparent 76%)",
    },
    {
      id: "ch1-workspace",
      fadeIn: [0.1, 0.16],
      background: "#f1f4fc",
      glow: "radial-gradient(56% 56% at 72% 50%, rgba(79, 70, 229, 0.14), rgba(56, 189, 248, 0.1) 52%, transparent 78%)",
    },
    {
      id: "ch2-radar",
      fadeIn: [0.28, 0.34],
      background: "#edf2fb",
      glow: "radial-gradient(56% 56% at 28% 50%, rgba(59, 130, 246, 0.16), rgba(99, 102, 241, 0.1) 52%, transparent 78%)",
    },
    {
      id: "ch3-resume-amber",
      fadeIn: [0.46, 0.52],
      background: "#f7f4ec",
      glow: "radial-gradient(58% 54% at 72% 50%, rgba(234, 179, 8, 0.18), rgba(99, 102, 241, 0.06) 56%, transparent 80%)",
    },
    {
      id: "ch4-interview-violet",
      fadeIn: [0.64, 0.7],
      background: "#eff0fa",
      glow: "radial-gradient(56% 54% at 28% 50%, rgba(124, 58, 237, 0.15), rgba(79, 70, 229, 0.08) 54%, transparent 78%)",
    },
    {
      id: "ch5-midnight",
      fadeIn: [0.81, 0.87],
      background: "#0b0e19",
      glow: "radial-gradient(56% 54% at 72% 50%, rgba(99, 102, 241, 0.24), rgba(56, 189, 248, 0.12) 52%, transparent 78%)",
    },
    {
      id: "ending-obsidian",
      fadeIn: [0.95, 0.995],
      background: "#090c15",
      glow: "radial-gradient(60% 42% at 50% 18%, rgba(99, 102, 241, 0.14), transparent 72%)",
    },
  ],
  chapters: [
    {
      id: "workspace",
      indexLabel: "01",
      eyebrow: {
        zh: "校招时间线 · 一处收拢",
        en: "ONE PERSISTENT WORKSPACE",
      },
      headline: {
        zh: "找公司、改简历、跟进度，\n不再四处奔波。",
        en: "Every stage of recruiting,\nheld in one timeline.",
      },
      body: {
        zh: "校招季要同时盯几十上百家官网、按岗改简历、记笔面试截止时间，而通用 AI 每次都忘光你的经历。Offer 雷达让搭载 21 个工具的助手「小雷」常驻工作台，每天打开就知道最该推进哪一步。",
        en: "Campus recruiting pulls students across scattered portals, tailored resumes, and tight test deadlines—while generic AI forgets your story every session. Xiao Lei, a 21-tool LangGraph assistant, keeps your full profile and surfaces today's top actions.",
      },
      details: {
        zh: ["21 个工具 LangGraph 助手", "持久记住经历与进度", "所有写入先确认再执行"],
        en: ["21-tool LangGraph agent", "Persistent profile & timeline", "Confirms every write first"],
      },
      accent: "#4f46e5",
      textSide: "left",
      surface: "light",
      screen: {
        src: "/images/projects/offer-radar/o-001.webp",
        alt: {
          zh: "Offer 雷达今日工作台：小雷每日提醒、18 个投递进度条、行动建议与右侧日程跟踪",
          en: "Offer Radar Today dashboard with Xiao Lei briefing, application progress bars, action list, and deadline calendar",
        },
      },
      pose: {
        xPct: 21,
        yVh: 0,
        scale: 1,
        rotateY: -6,
        rotateX: 1.5,
      },
    },
    {
      id: "company-radar",
      indexLabel: "02",
      eyebrow: {
        zh: "839 家招聘主体库",
        en: "839 VERIFIED EMPLOYERS",
      },
      headline: {
        zh: "13 个行业分层筛选，\n冲稳保清清楚楚。",
        en: "13 industries mapped into\nreach, match, and safety.",
      },
      body: {
        zh: "围绕「偏好 → 行业 → 公司」三步收窄选择：内置 13 个行业 839 家招聘主体与官网入口，自动分好冲一冲、比较稳与保底，还能贴入任意 JD 做 0–100 分匹配分析。只推荐，绝不背着你自动代投。",
        en: "Move through a three-step funnel from preferences to industries to curated picks. Backed by 839 hiring entities across 13 industries with official links, batch-apply lists, and 0–100 JD match scoring—recommending clearly while never auto-applying.",
      },
      details: {
        zh: ["13 个行业 · 839 家主体", "冲稳保 + 海投清单", "0–100 分 JD 匹配分析"],
        en: ["839 entities · 13 industries", "Reach / Match / Safety tiers", "0–100 JD match scoring"],
      },
      accent: "#2563eb",
      textSide: "right",
      surface: "light",
      screen: {
        src: "/images/projects/offer-radar/o-015.webp",
        alt: {
          zh: "岗位雷达页面：聊偏好、选行业、看公司三步漏斗与冲稳保公司卡片、官网入口",
          en: "Job Radar screen showing the 3-step preference funnel, tiered employer cards, official portal links, and Xiao Lei panel",
        },
      },
      pose: {
        xPct: -21,
        yVh: -1,
        scale: 1.01,
        rotateY: 6,
        rotateX: 1,
      },
    },
    {
      id: "resume-studio",
      indexLabel: "03",
      eyebrow: {
        zh: "简历工作室 · 守住真实底线",
        en: "HONEST ONE-PAGE RESUMES",
      },
      headline: {
        zh: "每家公司一页纸，\n靠拢写法全标黄。",
        en: "One page per company.\nEvery stretch flagged yellow.",
      },
      body: {
        zh: "改写前先聊清经历背景，后台用 LibreOffice 实测排版保证精准一页。原文没有的数字留作【X1】占位绝不瞎编，向岗位靠拢的表达一律标黄并附真实做法，未填完占位符禁止导出，让你投得踏实。",
        en: "Each target role receives a true one-page resume measured through real LibreOffice layout. Missing metrics stay explicit [X1] placeholders—never invented—and stretch edits turn yellow with concrete steps to earn them before export unlocks.",
      },
      details: {
        zh: ["LibreOffice 实测一页排版", "【X1】占位符绝不编数字", "靠拢写法标黄并附做法"],
        en: ["Real LibreOffice page fit", "Zero fabricated metrics", "Yellow-flagged stretch guides"],
      },
      accent: "#b45309",
      textSide: "left",
      surface: "light",
      screen: {
        src: "/images/projects/offer-radar/o-023.webp",
        alt: {
          zh: "简历工作室定制一页简历界面，黄色高亮标出靠拢写法与 X1、X2、X3 数字占位符",
          en: "Resume Studio showing a tailored one-page Meituan resume with yellow-highlighted stretch edits and [X1]–[X3] placeholders",
        },
      },
      pose: {
        xPct: 21,
        yVh: 1,
        scale: 1.01,
        rotateY: -5.5,
        rotateX: -1,
      },
    },
    {
      id: "interview-prep",
      indexLabel: "04",
      eyebrow: {
        zh: "投递联动 · 30 类岗位备面",
        en: "TRACKING TO INTERVIEW PREP",
      },
      headline: {
        zh: "顺着你的简历追问，\n把每一面练到心里有底。",
        en: "Deep-dive drills built\nstraight from your resume.",
      },
      body: {
        zh: "看板联动邮件识别，经你确认即自动更新笔面试日程；进入面试准备，覆盖 30 类岗位面经，为每段经历拆出深挖追问、口语化自我介绍，还能让小雷扮面试官一问一评、练完生成复盘。",
        en: "User-confirmed recruiting emails keep your Kanban board and calendar current. When interviews land, prep packs spanning 30 job tracks generate spoken intros, bullet-by-bullet deep-dive questions, and one-question-at-a-time mock rounds.",
      },
      details: {
        zh: ["邮箱识别确认后同步日程", "30 类岗位面经要点", "小雷逐题模拟面试复盘"],
        en: ["Confirmed email-to-calendar sync", "30 job-track interview guides", "1-on-1 mock rounds with recap"],
      },
      accent: "#6d28d9",
      textSide: "right",
      surface: "light",
      screen: {
        src: "/images/projects/offer-radar/o-037.webp",
        alt: {
          zh: "美团商业分析师面试准备深挖清单：Q1 至 Q5 针对简历经历与占位数字的追问",
          en: "Meituan Business Analyst interview prep deep-dive list with Q1–Q5 tailored resume follow-up questions",
        },
      },
      pose: {
        xPct: -21,
        yVh: 0,
        scale: 1.01,
        rotateY: 6,
        rotateX: 1,
      },
    },
    {
      id: "dark-onshore",
      indexLabel: "05",
      eyebrow: {
        zh: "深色专注 · 境内合规底座",
        en: "NIGHT FOCUS · BUILT TO SHIP",
      },
      headline: {
        zh: "深夜冲刺也舒适，\n832 项测试护航上线。",
        en: "Built for late-night sprints.\nBacked by 832 tests.",
      },
      body: {
        zh: "全站支持原生深色模式，深夜刷题改简历依然清晰柔和。基于 Next.js、FastAPI、LangGraph 与 PostgreSQL 构建，模型与数据全部留在境内阿里云百炼，配 718 项后端与 114 项前端自动化测试。",
        en: "Full native dark mode keeps late-night prep effortless. Engineered on Next.js, FastAPI, LangGraph, and PostgreSQL—running 100% onshore via Alibaba Bailian and verified by 718 backend plus 114 frontend tests.",
      },
      details: {
        zh: ["模型与数据全部留在境内", "718 后端 + 114 前端测试", "全工作台原生深色模式"],
        en: ["100% onshore via Bailian", "718 backend + 114 frontend tests", "Full native dark workspace"],
      },
      accent: "#818cf8",
      textSide: "left",
      surface: "dark",
      screen: {
        src: "/images/projects/offer-radar/o-043.webp",
        alt: {
          zh: "Offer 雷达深色模式今日工作台，深夜靛蓝界面展示投递进度与小雷对话栏",
          en: "Offer Radar dark-mode Today dashboard in deep midnight indigo with glowing progress bars and Xiao Lei chat",
        },
        darkScreen: true,
      },
      pose: {
        xPct: 21,
        yVh: 0,
        scale: 1.01,
        rotateY: -5.5,
        rotateX: 0,
      },
    },
  ],
  video: {
    src: "/projects/offer-radar-web.mp4",
    poster: "/projects/offer-radar-poster.jpg",
    eyebrow: { zh: "产品实录", en: "PRODUCT WALKTHROUGH" },
    title: { zh: "100 秒看懂完整校招流", en: "See the full workflow in motion." },
    caption: {
      zh: "演示画面中的人物与数据均为模拟，配音为 AI 合成。",
      en: "Simulated candidate profile and data; voiceover synthesized with AI.",
    },
  },
  galleryHeading: {
    zh: "更多真实工作台",
    en: "Every step, built for real seasons.",
  },
  gallerySubheading: {
    zh: "海投批量筛选、改前经历访谈、邮件联动看板与深色简历工作室——没有概念稿，全部实机截屏。",
    en: "Batch-apply sheets, pre-rewrite context interviews, email-synced Kanban tracking, and dark-mode Resume Studio.",
  },
  gallery: [
    {
      src: "/images/projects/offer-radar/o-017.webp",
      title: { zh: "海投清单与表格导出", en: "Batch-Apply List" },
      caption: {
        zh: "按行业、冲稳保与开放状态筛选，一次批量收藏至看板或导出 Excel。",
        en: "Filter by industry, tier, and open window—bookmark in bulk or export to Excel.",
      },
      alt: {
        zh: "岗位雷达全部可投海投清单，带行业与冲稳保筛选器及导出表格按钮",
        en: "Job Radar batch-apply list with industry and tier filters plus Excel export",
      },
    },
    {
      src: "/images/projects/offer-radar/o-025.webp",
      title: { zh: "先聊背景，再改简历", en: "Context Before Rewriting" },
      caption: {
        zh: "语音或打字聊清业务背景，一次沉淀即可在多份公司定制简历间长期复用。",
        en: "Capture real project context by voice or text once—reused cleanly across every tailored resume.",
      },
      alt: {
        zh: "经历背景访谈弹窗，支持语音与文字向小雷说明项目背景与职责",
        en: "Experience context modal capturing business background by voice or text before tailoring",
      },
    },
    {
      src: "/images/projects/offer-radar/o-027.webp",
      title: { zh: "投递看板与邮箱识别", en: "Kanban & Email Sync" },
      caption: {
        zh: "拖拽卡片更新全阶段进度；绑定邮箱自动提取笔面试通知，经确认才写入。",
        en: "Drag cards across every recruiting stage; linked email alerts pause for confirmation before updating.",
      },
      alt: {
        zh: "投递与日程看板界面，顶部提示绑定邮箱后经确认更新进度，下方展示各阶段公司卡片",
        en: "Application Kanban board with recruiting email sync banner and stage columns",
      },
    },
    {
      src: "/images/projects/offer-radar/o-045.webp",
      title: { zh: "深色模式简历工作室", en: "Dark-Mode Resume Studio" },
      caption: {
        zh: "深色工作区衬托真实 A4 白纸，黄标靠拢修改与行容量尺清晰聚焦。",
        en: "A crisp A4 sheet floats against a dark workspace, keeping yellow stretch edits unmistakable.",
      },
      alt: {
        zh: "深色模式下的简历工作室界面，突出展示 A4 纸面与黄色靠拢高亮标记",
        en: "Dark-mode Resume Studio framing the white A4 resume sheet with yellow-flagged stretch edits",
      },
      darkScreen: true,
    },
  ],
  statsHeading: {
    zh: "规模、精度与测试覆盖",
    en: "Engineered with discipline.",
  },
  stats: [
    {
      value: "839",
      label: { zh: "招聘主体库", en: "Hiring entities" },
      note: { zh: detail.zh.highlights[0], en: detail.en.highlights[0] },
    },
    {
      value: "21",
      label: { zh: "LangGraph 工具", en: "Agent tools" },
      note: { zh: detail.zh.highlights[1], en: detail.en.highlights[1] },
    },
    {
      value: "30",
      label: { zh: "岗位面经与模拟", en: "Interview tracks" },
      note: { zh: detail.zh.highlights[2], en: detail.en.highlights[2] },
    },
    {
      value: "832",
      label: { zh: "自动化测试", en: "Automated tests" },
      note: { zh: detail.zh.highlights[3], en: detail.en.highlights[3] },
    },
  ],
  techTags: {
    zh: card.zh.techTags,
    en: card.en.techTags,
  },
  sibling: {
    href: "/projects/health-agent",
    eyebrow: { zh: "下一个项目", en: "Next Project" },
    title: { zh: "健康助理", en: "My Health Agent" },
  },
};
