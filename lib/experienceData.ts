import type { Lang } from "@/lib/i18n";
import { tx } from "@/lib/i18n";

export interface ExperienceDetail {
  slug:       string;
  company:    string;
  logo:       string;
  role:       { en: string; zh: string };
  period:     { en: string; zh: string };
  location:   { en: string; zh: string };
  category:   { en: string; zh: string };
  /** One-line teaser shown on the card */
  tagline:    { en: string; zh: string };
  /** Accent colour for left border + glow */
  accent:     string;
  /** High-level overview paragraph */
  overview:   { en: string; zh: string };
  /** Notable metrics to display prominently */
  metrics: Array<{
    value: string;
    label: { en: string; zh: string };
  }>;
  /** Detailed contribution sections */
  sections: Array<{
    title:  { en: string; zh: string };
    points: { en: string[]; zh: string[] };
  }>;
  tools: string[];
}

export const EXPERIENCE_DATA: ExperienceDetail[] = [
  {
    slug:     "roland-berger",
    company:  "Roland Berger",
    logo:     "/photos/logo-roland-berger.jpeg",
    role:     { en: "Project Consulting Intern", zh: "项目咨询实习生" },
    period:   { en: "May – Aug 2025", zh: "2025年5月 – 8月" },
    location: { en: "Wuhan, Hubei, China", zh: "中国 · 湖北武汉" },
    category: { en: "Strategy Consulting", zh: "战略咨询" },
    tagline:  {
      en: "Data-driven KOC user-growth strategy for Dongfeng Honda",
      zh: "东风本田 KOC 数字化用户增长与数据驱动战略",
    },
    accent: "#6366f1",
    overview: {
      en: "Embedded in Roland Berger's automotive user-growth practice, I led quantitative analysis for a flagship engagement with Dongfeng Honda — helping the client translate three years of KOC ecosystem data into a deployable growth strategy.",
      zh: "在罗兰贝格汽车用户增长业务线，我主导了东风本田旗舰项目的定量分析工作，帮助客户将三年 KOC 生态数据转化为可落地的增长策略。",
    },
    metrics: [
      { value: "R² = 0.86",   label: { en: "Model accuracy",       zh: "模型拟合度"   } },
      { value: "500+",        label: { en: "User profiles clustered", zh: "用户画像聚类" } },
      { value: "27%",         label: { en: "UGC output increase",   zh: "UGC 产出提升" } },
      { value: "97 pages",    label: { en: "Operation system manual", zh: "运营体系文件" } },
    ],
    sections: [
      {
        title: { en: "Data Processing", zh: "数据处理" },
        points: {
          en: [
            "Integrated 3 years of sales and user operations data for Dongfeng Honda across 10 dimensions including KOC engagement, content creation, and referral rates.",
            "Used Python (pandas, NumPy) to clean and validate data, detect anomalies, and identify key growth factors to support the brand's private-domain growth strategy.",
          ],
          zh: [
            "系统整合东风本田三年用户运营与销售数据，覆盖 KOC 互动、内容产出、转介率等 10 个维度。",
            "使用 Python（pandas、NumPy）进行数据清洗、异常值处理与关键增长因子识别，为品牌私域增长策略提供数据依据。",
          ],
        },
      },
      {
        title: { en: "Model Development", zh: "数据建模" },
        points: {
          en: [
            "Built multiple linear regression and random-forest models to forecast new KOC growth and content output trends.",
            "Achieved R² = 0.86, directly informing quarterly operation targets and resource allocation decisions.",
            "Produced 10+ slide decks summarising model results — all adopted by the client.",
          ],
          zh: [
            "构建多元回归模型与随机森林模型，预测 KOC 新增人数与内容产出变化趋势。",
            "模型 R² = 0.86，有效支撑客户季度运营目标制定与资源投入决策。",
            "产出 10+ 页文档报告，最终被客户全部采纳。",
          ],
        },
      },
      {
        title: { en: "Strategy Optimisation", zh: "策略优化" },
        points: {
          en: [
            "Co-authored multiple rounds of executive-level presentation materials and designed KOC growth paths and UGC incentive tiering systems.",
            "Applied K-Means clustering to 500+ user profiles and content types, identifying three core segments: \"Aesthetic Seeding,\" \"Daily Sharing,\" and \"Usage Insights.\"",
            "Updated the KOC grading system using the Diamond Model and proposed differentiated strategies by vehicle type and region — raising UGC output by 27% in the following month.",
          ],
          zh: [
            "联合项目组撰写多轮高层汇报材料，协助设计 KOC 成长路径与 UGC 激励分层策略等施策机制。",
            "对 500+ 用户画像与内容类型进行 K-Means 聚类，识别出「美图种草」「日常分享」「用车心得」三类核心人群。",
            "结合「钻石模型」与回归结果更新 KOC 分级体系，提出分车型、分地区、分层级的差异化策略，次月 UGC 产出提升 27%。",
          ],
        },
      },
      {
        title: { en: "System Building", zh: "体系搭建" },
        points: {
          en: [
            "Led creation of the 97-page Dongfeng Honda KOC Digital Operation System Manual (PowerPoint), converting project insights into a standardised operational framework.",
            "Produced a 15-page Word standard operation guide for internal training and process standardisation.",
          ],
          zh: [
            "参与搭建《东风本田保客达人 KOC 数字化运营体系文件》（97 页 PPT），将项目洞察沉淀为标准化运营框架。",
            "将模型结果与洞察系统化转化为 Word 运营体系文件（15 页），用于企业内部培训与流程标准化。",
          ],
        },
      },
    ],
    tools: ["Python", "pandas", "NumPy", "K-Means", "Random Forest", "Multiple Regression", "PowerPoint", "Excel"],
  },

  {
    slug:     "guoyuan-securities",
    company:  "Guoyuan Securities",
    logo:     "/photos/logo-guoyuan.png",
    role:     { en: "Industry Research Intern", zh: "行业研究实习生" },
    period:   { en: "Jun – Aug 2024", zh: "2024年6月 – 8月" },
    location: { en: "Hefei, Anhui, China", zh: "中国 · 安徽合肥" },
    category: { en: "Financial Research", zh: "金融研究" },
    tagline:  {
      en: "Deep-dive baijiu sector research covering Moutai, Wuliangye and Fenjiu",
      zh: "覆盖茅台、五粮液、汾酒的白酒板块深度行研",
    },
    accent: "#14b8a6",
    overview: {
      en: "Joined the consumer industry coverage team at Guoyuan Securities, focusing on China's premium baijiu market during a pivotal period of consumption upgrading. Built the financial infrastructure and authored an independent strategy report that was incorporated into the team's quarterly portfolio discussion.",
      zh: "加入国元证券消费品行业覆盖团队，在消费升级关键时期深入研究中国高端白酒市场。构建了完整的金融基础设施，并独立完成一份被纳入季度组合策略讨论的策略报告。",
    },
    metrics: [
      { value: "15+",   label: { en: "Companies covered",    zh: "覆盖上市公司" } },
      { value: "3",     label: { en: "Valuation models",     zh: "估值模型"     } },
      { value: "1",     label: { en: "Independent strategy report", zh: "独立策略报告" } },
      { value: "2024",  label: { en: "Mid-year report published", zh: "年中报告发布" } },
    ],
    sections: [
      {
        title: { en: "Research Focus", zh: "研究方向" },
        points: {
          en: [
            "Analysed China's white liquor (baijiu) sector covering leading brands including Kweichow Moutai, Wuliangye, and Fenjiu.",
            "Focused on premium and sub-premium market structure, consumption upgrading trends, and channel dynamics.",
          ],
          zh: [
            "聚焦白酒板块，覆盖茅台、五粮液、山西汾酒等龙头企业。",
            "重点研究高端与次高端酒市场格局、消费升级趋势及渠道动态。",
          ],
        },
      },
      {
        title: { en: "Data & Modelling", zh: "数据与建模" },
        points: {
          en: [
            "Built a financial indicator database (revenue growth, net margin, inventory turnover ratio, etc.) using Wind, iFind, and quarterly reports across 15+ listed consumer staples companies.",
            "Performed time-series and YoY/MoM comparisons in Excel to track raw material costs, sales channels, and holiday demand fluctuations.",
            "Applied DCF and PE models to assess fair-value estimates and investment positioning.",
          ],
          zh: [
            "基于 Wind、iFind 和上市公司季度财报，建立覆盖 15 家以上消费品公司的核心财务指标数据库（营收增速、净利率、渠道库存周转率等）。",
            "在 Excel 中进行时间序列分析与同比环比对比，追踪原料价格、渠道动销及节假日销售波动。",
            "运用 DCF 和 PE 估值模型测算核心标的合理区间，形成投资建议。",
          ],
        },
      },
      {
        title: { en: "Report Writing & Output", zh: "研报写作与成果" },
        points: {
          en: [
            "Assisted in drafting in-depth industry reports and monthly strategy briefs, summarising channel research and terminal sales data using the PESTEL framework for macro analysis.",
            "Independently authored the Mid-Year Strategy Report on the Baijiu Sector (2024), advocating a \"steady growth in premium, structural recovery in sub-premium\" investment thesis.",
            "Selected sections of the report were featured in the team's quarterly portfolio strategy discussion.",
          ],
          zh: [
            "参与撰写行业深度研究报告及月度策略简报，结合 PESTEL 模型分析宏观政策与消费趋势。",
            "独立完成《白酒板块 2024 年中期策略报告》，提出「高端稳增长、次高端结构性修复」的投资判断。",
            "报告节选被导师纳入季度组合策略讨论材料。",
          ],
        },
      },
    ],
    tools: ["Wind", "iFind", "Excel", "DCF", "PE Valuation", "PESTEL", "Financial Modelling"],
  },

  {
    slug:     "bytedance",
    company:  "ByteDance",
    logo:     "/photos/logo-bytedance.png",
    role:     { en: "Strategy Analysis Intern", zh: "战略分析实习生" },
    period:   { en: "Dec 2025 – Feb 2026", zh: "2025年12月 – 2026年2月" },
    location: { en: "China", zh: "中国" },
    category: { en: "Product Strategy", zh: "产品战略" },
    tagline:  {
      en: "Overseas mini-game platform strategy during active market formation",
      zh: "处于战略形成期的海外小游戏平台战略研究",
    },
    accent: "#f59e0b",
    overview: {
      en: "Joined ByteDance's overseas mini-game business unit at a pivotal stage — when the team was forming its competitive strategy for international markets. Conducted systematic industry research and produced a 100+ page report that became foundational reference material for internal strategic discussions.",
      zh: "在字节跳动海外小游戏业务单元的战略形成关键阶段加入，系统开展行业研究，产出 100+ 页行业研究报告，成为内部战略讨论的基础参考材料。",
    },
    metrics: [
      { value: "10+",      label: { en: "Platforms benchmarked", zh: "竞品平台分析" } },
      { value: "100+",     label: { en: "Page industry report",  zh: "页行研报告"   } },
      { value: "2018–25",  label: { en: "Historical data span",  zh: "历史数据跨度" } },
      { value: "3",        label: { en: "Monetisation models",   zh: "变现模式"     } },
    ],
    sections: [
      {
        title: { en: "Market Research", zh: "市场研究" },
        points: {
          en: [
            "Systematically mapped the domestic and overseas mini-game industry from 2018–2025, covering market size, user structure, and key growth drivers.",
            "Analysed three core monetisation models: IAA (in-app advertising), IAP (in-app purchase), and hybrid — building a framework to evaluate platform positioning.",
          ],
          zh: [
            "系统梳理国内及海外小游戏行业 2018–2025 年发展现状，搭建涵盖市场规模、用户结构与增长驱动因素的核心指标分析框架。",
            "分析三大变现模式（IAA / IAP / 混变），构建平台战略定位评估框架。",
          ],
        },
      },
      {
        title: { en: "Competitive Intelligence", zh: "竞品监控" },
        points: {
          en: [
            "Benchmarked 10+ mini-game platforms across domestic (WeChat, Kuaishou) and international markets (Facebook, Telegram, Kwai).",
            "Tracked traffic sources, revenue-sharing mechanisms, and developer policies across platforms.",
            "Identified competitive landscape dynamics and stage-specific opportunities in the overseas market.",
          ],
          zh: [
            "对微信、快手、Facebook、Telegram、Kwai 等 10+ 国内外小游戏平台进行系统对比分析。",
            "持续跟踪流量入口、分成机制与开发者政策，评估平台在提升内容供给效率方面的策略差异。",
            "识别竞争格局与阶段性机会，为业务决策提供依据。",
          ],
        },
      },
      {
        title: { en: "Product Optimisation Analysis", zh: "产品优化分析" },
        points: {
          en: [
            "Evaluated the functional architecture and onboarding paths of multiple platforms from a product lens.",
            "Assessed how different entry-point designs impacted user conversion efficiency and content distribution reach.",
            "Extracted actionable insights around reducing friction and shortening reach paths to improve platform supply efficiency.",
          ],
          zh: [
            "从产品视角分析多款小游戏平台的功能结构与接入路径。",
            "评估不同功能入口设计对用户转化效率与内容分发效果的影响。",
            "提炼通过降低使用门槛、缩短触达路径来提升平台内容供给与使用效率的产品优化思路。",
          ],
        },
      },
      {
        title: { en: "Output", zh: "成果产出" },
        points: {
          en: [
            "Participated in systematic overseas mini-game industry research, producing a 100+ page Overseas Mini-Game Industry Research Report.",
            "Also produced multiple thematic briefs used as foundational research for ByteDance's overseas mini-game business direction and internal strategy discussions.",
          ],
          zh: [
            "参与海外小游戏行业系统性研究，形成《海外小游戏行业研究报告》（100+ 页）。",
            "产出多份专题材料，作为字节内部海外小游戏方向的基础研究与策略参考。",
          ],
        },
      },
    ],
    tools: ["Strategic Analysis", "Competitive Benchmarking", "Industry Mapping", "Python", "Excel"],
  },

  {
    slug:     "chartcreator",
    company:  "ChartCreator",
    logo:     "/photos/logo-chartcreator.jpg",
    role:     { en: "AI Product Manager & Builder", zh: "AI 产品经理 & 开发者" },
    period:   { en: "Aug 2025 – Present", zh: "2025年8月 – 至今" },
    location: { en: "Remote", zh: "远程" },
    category: { en: "AI Product", zh: "AI 产品" },
    tagline:  {
      en: "Founder-built AI data visualisation platform via vibe coding",
      zh: "通过 Vibe Coding 独立构建的 AI 数据可视化平台",
    },
    accent: "#8b5cf6",
    overview: {
      en: "Founded ChartCreator as a response to a real pain point: non-technical professionals spending hours wrestling with chart styling instead of focusing on insights. Built the entire product — from user research to deployed interface — using Claude Code, Codex and a vibe coding workflow.",
      zh: "创立 ChartCreator 源于真实痛点：非技术用户耗费大量时间在图表样式调整上而非洞察本身。使用 Claude Code、Codex 与 Vibe Coding 工作流，独立完成从用户研究到部署上线的全流程。",
    },
    metrics: [
      { value: "1",    label: { en: "Person team",             zh: "人团队"           } },
      { value: "4",    label: { en: "Week MVP to launch",      zh: "周内 MVP 上线"    } },
      { value: "100%", label: { en: "Vibe-coded frontend",     zh: "Vibe Coding 前端" } },
      { value: "0",    label: { en: "Lines written manually",  zh: "行手写代码"       } },
    ],
    sections: [
      {
        title: { en: "Market Research", zh: "市场调研" },
        points: {
          en: [
            "Conducted competitive analysis of Graphy, Canva, and Graphmaker to map feature gaps and positioning opportunities.",
            "Interviewed professionals from consulting, finance, and sales sectors to understand data presentation pain points — format inconsistency, complex operations, poor export quality.",
          ],
          zh: [
            "对 Graphy、Canva、Graphmaker 等竞品进行深度对比分析，识别功能缺口与定位机会。",
            "与咨询、金融、销售行业从业者深度访谈，了解数据展示痛点：格式不一致、操作复杂、导出质量差。",
          ],
        },
      },
      {
        title: { en: "Product Design", zh: "产品设计" },
        points: {
          en: [
            "Designed the complete user flow: \"Upload → AI Recommend → Customize → Export\" — optimised for minimal friction.",
            "Mapped system logic using Visio swim-lane diagrams to clarify front-end, back-end, and user-side interactions.",
            "Built UI mockups and interactive prototypes in Figma before development.",
          ],
          zh: [
            "设计完整产品流程：「用户上传数据 → AI 智能推荐 → 自定义编辑 → 图表导出」，以最低摩擦为优化目标。",
            "使用 Visio 泳道流程图梳理前端、后端与用户端的交互路径，明确跨层级协作关系。",
            "在开发前使用 Figma 构建 UI 原型与交互模型。",
          ],
        },
      },
      {
        title: { en: "Vibe Coding Development", zh: "Vibe Coding 开发" },
        points: {
          en: [
            "Used Claude Code and Codex as primary development tools — writing structured prompts to drive the full frontend: product blueprint → tech stack selection → information architecture → core feature code.",
            "Defined API standards and interface logic during architecture design; collaborated with the backend team on feasibility reviews.",
            "Applied Agile and CI/CD principles to accelerate iteration and stabilise delivery.",
          ],
          zh: [
            "以 Claude Code、Codex 为主要开发工具，通过结构化 Prompt 设计完成前端全流程：产品 Blueprint → 技术选型 → 信息架构 → 核心功能代码生成。",
            "在系统架构设计阶段参与前后端接口规范制定，明确 API 调用逻辑与数据交互标准。",
            "应用 Agile 与 CI/CD 原则，加速迭代节奏，稳定交付质量。",
          ],
        },
      },
    ],
    tools: ["Claude Code", "Codex", "Next.js", "Tailwind CSS", "Figma", "Agile", "CI/CD", "Prompt Engineering"],
  },
];

export const t = tx;
export type { Lang };
