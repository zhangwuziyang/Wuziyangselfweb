import type { Lang } from "@/lib/i18n";
import { tx } from "@/lib/i18n";

export interface ExperienceDetail {
  slug:       string;
  company:    string;
  logo:       string;
  role:       { en: string; zh: string };
  period:     { en: string; zh: string };
  /** Start month (YYYY-MM), used to order the timeline */
  start:      string;
  /** True while the role is ongoing */
  current?:   boolean;
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
    slug:     "alibaba-international",
    start:    "2026-05",
    company:  "Alibaba International",
    logo:     "/photos/logo-alibaba.png",
    role:     { en: "AI Business Analytics Intern", zh: "AI 商业分析实习生" },
    period:   { en: "May – Aug 2026", zh: "2026年5月 – 8月" },
    location: { en: "China", zh: "中国" },
    category: { en: "AI & Business Analytics", zh: "AI 与商业分析" },
    tagline:  {
      en: "AI logistics analytics tying delivery performance to global e-commerce growth.",
      zh: "用 AI 与物流履约分析，打通妥投表现与全球电商增长。",
    },
    accent: "#ff6a00",
    overview: {
      en: "Joined Alibaba International's BI team supporting AliExpress logistics and supply chain. I brought together causal inference, a semantic metrics layer, and AI agents to quantify what faster delivery is worth, standardize metric definitions, and speed up global logistics diagnostics.",
      zh: "加入阿里国际 BI-AE 物流与供应链团队，把因果分析、语义化数据基础设施与 AI Agent 落到国际电商场景中：量化履约改善带来的商业价值、拉齐指标口径，并加快全球物流异常的诊断效率。",
    },
    metrics: [
      { value: "$1.27M", label: { en: "Monthly GMV opportunity quantified", zh: "月度 GMV 增益空间" } },
      { value: "1.4M",   label: { en: "Users in delivery analysis", zh: "履约分析用户样本" } },
      { value: "6",      label: { en: "Delivery stages monitored", zh: "履约分段监测" } },
      { value: "30 sec", label: { en: "Root-cause drill-down", zh: "异常根因定位" } },
    ],
    sections: [
      {
        title: { en: "Fulfillment & GMV Analysis", zh: "履约时效与 GMV 分析" },
        points: {
          en: [
            "Designed a three-window cohort study of US cross-border users, pairing Generalized Propensity Score (GPS) with Difference-in-Differences (DID) to estimate the causal impact of delivery time on subsequent GMV.",
            "Pinpointed a roughly 10-day tolerance threshold: once delivery stretched past it, GMV loss accelerated sharply, hitting high- and ultra-high-value users hardest.",
            "Estimated that bringing delivery times above 12 days down to 10 days could unlock roughly $40.8K in daily GMV ($1.265M monthly), with 83% of the upside coming from high-value segments.",
          ],
          zh: [
            "面向美国跨境用户设计三窗口队列研究，结合广义倾向得分（GPS）与双重差分（DID），测算妥投时效对后续 GMV 的因果影响。",
            "识别出约 10 天的用户容忍阈值：妥投一旦超过这个节点，GMV 流失便加速扩大，其中高价值与超高价值用户受影响最深。",
            "测算显示，将妥投超过 12 天的用户时效压到 10 天，日均可释放约 4.08 万美元 GMV、月均约 126.5 万美元，其中 83% 的增量来自高价值人群。",
          ],
        },
      },
      {
        title: { en: "AI-Native Metrics Library", zh: "AI 原生指标库" },
        points: {
          en: [
            "Built an AI-readable logistics and supply-chain metrics layer in Markdown and YAML, unifying a searchable index, standardized definitions, calculation logic, data lineage, and a business glossary.",
            "Built reusable Skills that pull metric definitions straight from reports and trace SQL from result tables through intermediate layers back to ADS source tables, outputting field-level lineage reports.",
            "Designed an agent workflow covering metric lookup, definition audits in documents, and change requests, wired into Devix and DingTalk for cloud-hosted, version-controlled access.",
          ],
          zh: [
            "用 Markdown 和 YAML 搭起一套 AI 可直接读取的物流供应链指标语义层，把总索引、标准定义、计算口径、数据血缘和业务词典收拢在一起。",
            "封装可复用的指标抽取与 SQL 溯源 Skills：从业务文档提取标准化指标，并从结果表穿透中间层一路追到 ADS 源表，输出字段级血缘报告。",
            "设计指标查询、文档口径核查与指标增改申请三类 Agent 工作流，接入 Devix 与钉钉，实现云端托管和版本管理。",
          ],
        },
      },
      {
        title: { en: "Logistics Sentinel Agent", zh: "物流异常监测 Agent" },
        points: {
          en: [
            "Built a daily monitoring workflow that scans six fulfillment stages across countries against SLA targets, seven-day trends, and thirty-day baselines, pushing exception summaries straight to DingTalk.",
            "Designed a three-step diagnostic path from country and fulfillment stage down to the ten weakest routes and their lowest-performing carriers, cutting root-cause drill-down to about 30 seconds.",
            "Added bilingual web attribution that cross-checks location and event timing to flag external disruptions like port closures, strikes, and aviation controls.",
          ],
          zh: [
            "搭建每日物流监测流程，扫描全球各国六段履约达成率，对照 SLA 目标、7 天趋势与 30 天基线交叉比对，并将异常摘要直推钉钉。",
            "设计三层诊断下钻路径：从国家与履约环节切入，锁定最差 TOP10 线路，再定位低表现承运商，将异常根因排查压到约 30 秒。",
            "补齐中英双语联网归因能力，结合地理与时间双重匹配外部事件，辅助排查港口关闭、罢工和航空管制等外部影响。",
          ],
        },
      },
      {
        title: { en: "AI & GPU Capability Building", zh: "AI 与 GPU 能力建设" },
        points: {
          en: [
            "Wrote an AI Workbench operations guide covering repository setup, ODPS connectivity, dependency installation, debugging, and gray-release deployment so the team could operationalize reusable analyses.",
            "Deployed and tested NVIDIA cuOpt alongside Qwen2.5-7B for vehicle-routing optimization, translating business constraints into solver-ready models and turning GPU outputs back into clear operational takeaways.",
          ],
          zh: [
            "编写《AI 应用台操作指南》，覆盖代码建仓、ODPS 数据源连接、依赖安装、Debug 到灰度上线，帮团队把可复用分析真正跑成持续运行的能力。",
            "用 Qwen2.5-7B 搭配 NVIDIA cuOpt 跑通车辆路径规划实验：把业务约束转译为求解模型，再将 GPU 算出的结果翻译成面向决策的业务说明。",
          ],
        },
      },
    ],
    tools: ["Python", "SQL", "ODPS", "GPS", "DID", "YAML", "Devix", "DingTalk", "Qwen2.5-7B", "NVIDIA cuOpt"],
  },

  {
    slug:     "roland-berger",
    start:    "2025-05",
    company:  "Roland Berger",
    logo:     "/photos/logo-roland-berger.jpeg",
    role:     { en: "Project Consulting Intern", zh: "项目咨询实习生" },
    period:   { en: "May – Aug 2025", zh: "2025年5月 – 8月" },
    location: { en: "Wuhan, Hubei, China", zh: "中国 · 湖北武汉" },
    category: { en: "Strategy Consulting", zh: "战略咨询" },
    tagline:  {
      en: "KOC-led user growth strategy for Dongfeng Honda, backed by user clustering and modeling.",
      zh: "以用户聚类与数据建模驱动的东风本田 KOC 增长战略。",
    },
    accent: "#6366f1",
    overview: {
      en: "Embedded in Roland Berger's automotive user-growth practice, I led the quantitative analysis for a flagship Dongfeng Honda engagement, turning three years of KOC ecosystem data into a growth strategy the client could run.",
      zh: "加入罗兰贝格汽车用户增长团队，主导东风本田旗舰项目的定量分析，帮客户把三年沉淀的 KOC 生态数据梳理成真正跑得起来的增长打法。",
    },
    metrics: [
      { value: "R² = 0.86",   label: { en: "Model accuracy",       zh: "模型拟合度"   } },
      { value: "500+",        label: { en: "User profiles clustered", zh: "用户画像聚类" } },
      { value: "27%",         label: { en: "UGC output increase",   zh: "UGC 产出提升" } },
      { value: "97 pages",    label: { en: "Operations manual", zh: "运营体系文件" } },
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
            "用 Python（pandas、NumPy）完成数据清洗、异常值排查并提炼关键增长因子，为品牌私域增长策略夯实数据依据。",
          ],
        },
      },
      {
        title: { en: "Model Development", zh: "数据建模" },
        points: {
          en: [
            "Built multiple linear regression and random-forest models to forecast new KOC growth and content output trends.",
            "Reached R² = 0.86, directly guiding quarterly operating targets and resource allocation.",
            "Delivered 10+ slide decks summarizing the model findings, all adopted by the client.",
          ],
          zh: [
            "构建多元回归模型与随机森林模型，预测 KOC 新增人数与内容产出变化趋势。",
            "模型拟合度达 R² = 0.86，直接支撑客户制定季度运营目标与资源分配方案。",
            "围绕模型结论输出 10+ 页分析报告，全部获客户采纳。",
          ],
        },
      },
      {
        title: { en: "Strategy Optimization", zh: "策略优化" },
        points: {
          en: [
            "Co-authored multiple rounds of executive presentations and helped design KOC growth paths and tiered UGC incentive systems.",
            "Applied K-Means clustering to 500+ user profiles and content types, identifying three core segments: \"Aesthetic Seeding,\" \"Daily Sharing,\" and \"Usage Insights.\"",
            "Revamped the KOC grading framework using the Diamond Model and tailored playbooks by vehicle model and region, lifting UGC output by 27% the following month.",
          ],
          zh: [
            "联合项目组打磨多轮高层汇报材料，协助搭建 KOC 成长路径与 UGC 分层激励机制。",
            "对 500+ 用户画像与内容类型进行 K-Means 聚类，识别出「美图种草」「日常分享」「用车心得」三类核心人群。",
            "结合「钻石模型」与回归结果更新 KOC 分级体系，提出分车型、分地区、分层级的差异化策略，次月 UGC 产出提升 27%。",
          ],
        },
      },
      {
        title: { en: "System Building", zh: "体系搭建" },
        points: {
          en: [
            "Led the creation of the 97-page Dongfeng Honda KOC Digital Operations Manual (PowerPoint), turning project insights into a standardized operating framework.",
            "Authored a 15-page Word operating guide for internal training and process standardization.",
          ],
          zh: [
            "参与搭建《东风本田保客达人 KOC 数字化运营体系文件》（97 页 PPT），将项目洞察沉淀为标准化运营框架。",
            "将模型结论与运营洞察整理为 15 页 Word 操作手册，供客户内部培训与流程标准化落地。",
          ],
        },
      },
    ],
    tools: ["Python", "pandas", "NumPy", "K-Means", "Random Forest", "Multiple Regression", "PowerPoint", "Excel"],
  },

  {
    slug:     "guoyuan-securities",
    start:    "2024-06",
    company:  "Guoyuan Securities",
    logo:     "/photos/logo-guoyuan.png",
    role:     { en: "Industry Research Intern", zh: "行业研究实习生" },
    period:   { en: "Jun – Aug 2024", zh: "2024年6月 – 8月" },
    location: { en: "Hefei, Anhui, China", zh: "中国 · 安徽合肥" },
    category: { en: "Financial Research", zh: "金融研究" },
    tagline:  {
      en: "Baijiu sector research and valuation covering Moutai, Wuliangye, and Fenjiu.",
      zh: "覆盖茅台、五粮液与汾酒的白酒行业研究及估值分析。",
    },
    accent: "#14b8a6",
    overview: {
      en: "Joined Guoyuan Securities' consumer coverage team to research China's premium baijiu market during a key phase of consumption upgrading. Built the financial tracking database and authored an independent strategy report whose findings entered the team's quarterly portfolio discussions.",
      zh: "加入国元证券消费行研团队，在消费升级的关键阶段深入研究中国高端白酒市场。期间搭起核心财务数据追踪体系，并独立撰写策略报告，部分内容被纳入团队季度组合策略讨论。",
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
            "Analyzed China's baijiu sector across leading brands including Kweichow Moutai, Wuliangye, and Fenjiu.",
            "Focused on premium and sub-premium market structure, consumption upgrading trends, and channel dynamics.",
          ],
          zh: [
            "聚焦白酒板块，覆盖茅台、五粮液、山西汾酒等龙头企业。",
            "重点研究高端与次高端酒市场格局、消费升级趋势及渠道动态。",
          ],
        },
      },
      {
        title: { en: "Data & Modeling", zh: "数据与建模" },
        points: {
          en: [
            "Built a core financial metrics database covering revenue growth, net margin, and inventory turnover across 15+ listed consumer staples companies using Wind, iFind, and quarterly filings.",
            "Performed time-series and YoY/MoM comparisons in Excel to track raw material costs, sales channels, and holiday demand fluctuations.",
            "Applied DCF and PE models to estimate fair value and inform investment positioning.",
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
            "Contributed to in-depth industry reports and monthly strategy briefs, summarizing channel research and end-market sales data alongside PESTEL macro analysis.",
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
    tools: ["Wind", "iFind", "Excel", "DCF", "PE Valuation", "PESTEL", "Financial Modeling"],
  },

  {
    slug:     "bytedance",
    start:    "2025-12",
    company:  "ByteDance",
    logo:     "/photos/logo-bytedance.png",
    role:     { en: "Strategy Analysis Intern", zh: "战略分析实习生" },
    period:   { en: "Dec 2025 – Feb 2026", zh: "2025年12月 – 2026年2月" },
    location: { en: "China", zh: "中国" },
    category: { en: "Product Strategy", zh: "产品战略" },
    tagline:  {
      en: "Platform strategy for overseas mini-games as the market was still taking shape.",
      zh: "趁市场格局尚未定型，梳理海外小游戏平台的战略打法。",
    },
    accent: "#f59e0b",
    overview: {
      en: "Joined ByteDance's overseas mini-game unit just as the team was shaping its international strategy. I conducted systematic industry research and produced a 100+ page report that became a core reference for internal strategy discussions.",
      zh: "在字节跳动海外小游戏业务起势与定调的关键阶段加入团队，系统梳理行业格局，产出 100+ 页行研报告，成为内部战略讨论的核心参考底稿。",
    },
    metrics: [
      { value: "10+",      label: { en: "Platforms benchmarked", zh: "竞品平台分析" } },
      { value: "100+",     label: { en: "Page industry report",  zh: "页行研报告"   } },
      { value: "2018–25",  label: { en: "Historical data span",  zh: "历史数据跨度" } },
      { value: "3",        label: { en: "Monetization models",   zh: "变现模式"     } },
    ],
    sections: [
      {
        title: { en: "Market Research", zh: "市场研究" },
        points: {
          en: [
            "Mapped the domestic and overseas mini-game industry from 2018 to 2025, covering market size, user structure, and key growth drivers.",
            "Analyzed three core monetization models: IAA (in-app advertising), IAP (in-app purchase), and hybrid, turning the findings into a framework for evaluating platform positioning.",
          ],
          zh: [
            "系统梳理 2018–2025 年国内外小游戏行业发展脉络，搭建覆盖市场规模、用户结构与增长动因的核心分析框架。",
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
            "Mapped competitive shifts and stage-specific openings across overseas markets.",
          ],
          zh: [
            "对微信、快手、Facebook、Telegram、Kwai 等 10+ 国内外小游戏平台进行系统对比分析。",
            "持续跟踪流量入口、分成机制与开发者政策，评估平台在提升内容供给效率方面的策略差异。",
            "理清竞争格局演变与阶段性窗口机会，为业务决策提供支撑。",
          ],
        },
      },
      {
        title: { en: "Product Optimization Analysis", zh: "产品优化分析" },
        points: {
          en: [
            "Evaluated feature architecture and onboarding flows across multiple mini-game platforms from a product perspective.",
            "Assessed how different entry-point designs affected user conversion and content distribution reach.",
            "Distilled practical recommendations for cutting friction and shortening user paths to boost content supply efficiency.",
          ],
          zh: [
            "从产品视角分析多款小游戏平台的功能结构与接入路径。",
            "评估不同功能入口设计对用户转化效率与内容分发效果的影响。",
            "提炼出降低使用门槛、缩短触达路径的产品优化方向，助力提升平台内容供给与使用效率。",
          ],
        },
      },
      {
        title: { en: "Output", zh: "成果产出" },
        points: {
          en: [
            "Contributed to systematic industry research, producing the 100+ page Overseas Mini-Game Industry Research Report.",
            "Produced additional thematic briefs used as baseline research for ByteDance's overseas mini-game direction and internal strategy reviews.",
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
    start:    "2025-08",
    company:  "ChartCreator",
    logo:     "/photos/logo-chartcreator.jpg",
    role:     { en: "AI Product Manager & Builder", zh: "AI 产品经理 & 开发者" },
    period:   { en: "Aug 2025 – Apr 2026", zh: "2025年8月 – 2026年4月" },
    location: { en: "Remote", zh: "远程" },
    category: { en: "AI Product", zh: "AI 产品" },
    tagline:  {
      en: "AI data visualization platform, built solo through vibe coding.",
      zh: "以 Vibe Coding 独立打造的 AI 数据可视化平台。",
    },
    accent: "#8b5cf6",
    overview: {
      en: "Built ChartCreator out of a real frustration: non-technical professionals spending hours wrestling with chart formatting instead of focusing on the insight itself. I took the product from user research to a live interface using Claude Code, Codex, and a vibe coding workflow.",
      zh: "做 ChartCreator 起于一个很具体的痛点：不少非技术从业者把大把时间耗在了调图表样式上，反而无暇打磨洞察本身。我借助 Claude Code、Codex 与 Vibe Coding 工作流，独立走完了从用户研究到部署上线的全流程。",
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
            "Interviewed professionals in consulting, finance, and sales to pinpoint their data presentation frustrations: inconsistent formatting, clunky workflows, and low-quality exports.",
          ],
          zh: [
            "对 Graphy、Canva、Graphmaker 等竞品进行深度对比分析，识别功能缺口与定位机会。",
            "访谈咨询、金融与销售一线从业者，摸清数据呈现的三大痛点：格式难统一、操作繁琐、导出画质不佳。",
          ],
        },
      },
      {
        title: { en: "Product Design", zh: "产品设计" },
        points: {
          en: [
            "Designed the end-to-end user flow (\"Upload → AI Recommend → Customize → Export\"), optimized to keep friction as low as possible.",
            "Mapped system logic with Visio swimlane diagrams to clarify interactions across the frontend, backend, and user journey.",
            "Built UI mockups and interactive prototypes in Figma before development.",
          ],
          zh: [
            "梳理出完整交互链路：「用户上传数据 → AI 智能推荐 → 自定义编辑 → 图表导出」，尽可能压低上手门槛。",
            "使用 Visio 泳道流程图梳理前端、后端与用户端的交互路径，明确跨层级协作关系。",
            "在开发前使用 Figma 构建 UI 原型与交互模型。",
          ],
        },
      },
      {
        title: { en: "Vibe Coding Development", zh: "Vibe Coding 开发" },
        points: {
          en: [
            "Used Claude Code and Codex as my primary build tools, writing structured prompts to drive the entire frontend from product blueprint and tech stack selection through information architecture and core feature code.",
            "Defined API standards and interface logic during architecture design; collaborated with the backend team on feasibility reviews.",
            "Applied Agile and CI/CD practices to speed up iteration and stabilize delivery.",
          ],
          zh: [
            "以 Claude Code 和 Codex 为主力开发工具，通过结构化 Prompt 驱动前端全流程：从产品蓝图、技术选型到信息架构与核心功能代码生成。",
            "在系统架构设计阶段参与前后端接口规范制定，明确 API 调用逻辑与数据交互标准。",
            "引入 Agile 与 CI/CD 实践，加快迭代节奏并稳住交付质量。",
          ],
        },
      },
    ],
    tools: ["Claude Code", "Codex", "Next.js", "Tailwind CSS", "Figma", "Agile", "CI/CD", "Prompt Engineering"],
  },
];

export const t = tx;
export type { Lang };
