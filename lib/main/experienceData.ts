import type { Lang } from "@/lib/main/i18n";
import { tx } from "@/lib/main/i18n";

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
      en: "AI-driven logistics analytics connecting delivery performance to global e-commerce growth.",
      zh: "以 AI 与物流履约分析连接妥投表现与全球电商增长。",
    },
    accent: "#ff6a00",
    overview: {
      en: "I joined Alibaba International's BI team supporting AliExpress logistics and supply chain. I combined causal inference, a semantic metrics layer, and AI agents to quantify the commercial impact of faster delivery, standardize metric definitions, and accelerate global logistics exception diagnostics.",
      zh: "我加入阿里国际 BI 团队，支持速卖通（AliExpress）物流与供应链业务。我将因果分析、语义化数据基础设施与 AI Agent 应用于国际电商场景，量化履约提速的商业价值，统一指标口径，并提升全球物流异常的诊断效率。",
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
            "Identified an approximately 10-day tolerance threshold: once delivery extended past it, GMV loss accelerated sharply, with the steepest impact on high- and ultra-high-value users.",
            "Estimated that reducing delivery times above 12 days to 10 days could unlock roughly $40.8K in daily GMV ($1.265M monthly), with 83% of the upside coming from high-value segments.",
          ],
          zh: [
            "面向美国跨境用户设计三窗口队列研究，结合广义倾向得分（GPS）与双重差分（DID），评估妥投时效对用户后续 GMV 的因果影响。",
            "识别出约 10 天的用户容忍阈值：妥投时长一旦超过该节点，GMV 流失显著加速，其中高价值与超高价值用户受影响最深。",
            "测算将妥投超过 12 天的用户时效缩短至 10 天，可释放约 4.08 万美元日均、126.5 万美元月均 GMV 增益空间，其中 83% 来自高价值用户群体。",
          ],
        },
      },
      {
        title: { en: "AI-Native Metrics Library", zh: "AI 原生指标库" },
        points: {
          en: [
            "Built an AI-readable logistics and supply-chain metrics layer in Markdown and YAML, unifying a searchable index, standardized definitions, calculation logic, data lineage, and a business glossary.",
            "Developed reusable Skills that extract metric definitions directly from business reports and trace SQL from result tables through intermediate layers back to ADS source tables, generating field-level lineage reports.",
            "Designed an agent workflow covering metric lookup, document-definition audits, and change requests, integrated with Devix and DingTalk for cloud-hosted, version-controlled access.",
          ],
          zh: [
            "基于 Markdown 与 YAML 构建 AI 可直接解析的物流供应链指标语义层，整合总索引、标准定义、计算口径、数据血缘与业务术语词典。",
            "封装可复用的指标抽取与 SQL 溯源 Skills，从业务文档提取标准化指标定义，并从结果表穿透中间层追踪至 ADS 源表，输出字段级血缘报告。",
            "设计指标查询、文档口径核查与指标增改申请三类 Agent 工作流，接入 Devix 与钉钉，实现云端托管与版本管理。",
          ],
        },
      },
      {
        title: { en: "Logistics Sentinel Agent", zh: "物流异常监测 Agent" },
        points: {
          en: [
            "Built a daily monitoring workflow scanning six fulfillment stages across countries against SLA targets, seven-day trends, and thirty-day baselines, delivering exception summaries directly to DingTalk.",
            "Designed a three-level diagnostic path from country and fulfillment stage to the ten weakest routes and their lowest-performing carriers, reducing root-cause drill-down to approximately 30 seconds.",
            "Extended diagnostics with bilingual web attribution, cross-referencing geography and event timing to identify external disruptions such as port closures, strikes, and aviation controls.",
          ],
          zh: [
            "搭建每日物流监测流程，扫描全球各国六段履约达成率，对照 SLA 目标、7 天趋势与 30 天基线交叉比对，并将异常摘要推送至钉钉。",
            "设计从国家与履约环节、最差 10 条线路到低表现承运商的三层诊断下钻路径，将异常根因定位时间缩短至约 30 秒。",
            "扩展中英双语联网归因能力，结合地理位置与事件时间匹配外部扰动，辅助识别港口关闭、罢工与航空管制等外部因素。",
          ],
        },
      },
      {
        title: { en: "AI & GPU Capability Building", zh: "AI 与 GPU 能力建设" },
        points: {
          en: [
            "Authored an AI Workbench operations guide covering repository setup, ODPS connectivity, dependency installation, debugging, and gray-release deployment to help the team operationalize reusable analyses.",
            "Deployed and tested NVIDIA cuOpt alongside Qwen2.5-7B for vehicle-routing optimization, translating business constraints into solver-ready models and converting GPU outputs into decision-oriented operational explanations.",
          ],
          zh: [
            "编写《AI 应用台操作指南》，覆盖代码建仓、ODPS 数据源连接、依赖安装、调试与灰度上线，帮助团队将一次性分析沉淀为可复用、可持续运行的工具。",
            "结合 Qwen2.5-7B 与 NVIDIA cuOpt 开展车辆路径规划实验，将业务约束转化为求解模型，并将 GPU 计算结果还原为面向决策的业务说明。",
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
      en: "Data-driven KOC user-growth strategy for Dongfeng Honda, backed by user clustering and predictive modeling.",
      zh: "以用户聚类与数据建模驱动的东风本田 KOC 用户增长战略。",
    },
    accent: "#6366f1",
    overview: {
      en: "Embedded in Roland Berger's automotive user-growth practice, I led the quantitative analysis for a flagship Dongfeng Honda engagement, translating three years of KOC ecosystem data into an actionable growth strategy.",
      zh: "我在罗兰贝格汽车用户增长业务线主导了东风本田旗舰项目的定量分析工作，帮助客户将三年沉淀的 KOC 生态数据转化为可落地的增长战略。",
    },
    metrics: [
      { value: "R² = 0.86",   label: { en: "Model accuracy",          zh: "模型拟合度"   } },
      { value: "500+",        label: { en: "User profiles clustered", zh: "用户画像聚类" } },
      { value: "27%",         label: { en: "UGC output increase",     zh: "UGC 产出提升" } },
      { value: "97 pages",    label: { en: "Operations manual",       zh: "运营体系文件" } },
    ],
    sections: [
      {
        title: { en: "Data Processing", zh: "数据处理" },
        points: {
          en: [
            "Integrated 3 years of sales and user operations data for Dongfeng Honda across 10 dimensions including KOC engagement, content creation, and referral rates.",
            "Used Python (pandas, NumPy) to clean and validate data, detect anomalies, and identify key growth factors supporting the brand's private-domain growth strategy.",
          ],
          zh: [
            "系统整合东风本田三年用户运营与销售数据，覆盖 KOC 互动、内容产出、转介率等 10 个维度。",
            "使用 Python（pandas、NumPy）完成数据清洗、异常值校验与关键增长因子识别，为品牌私域增长策略提供数据依据。",
          ],
        },
      },
      {
        title: { en: "Model Development", zh: "数据建模" },
        points: {
          en: [
            "Built multiple linear regression and random-forest models to forecast new KOC growth and content output trends.",
            "Achieved R² = 0.86, directly informing quarterly operating targets and resource allocation decisions.",
            "Delivered 10+ analytical slides summarizing model findings, all adopted by the client.",
          ],
          zh: [
            "构建多元回归模型与随机森林模型，预测 KOC 新增规模与内容产出变化趋势。",
            "模型拟合度达 R² = 0.86，直接支撑客户制定季度运营目标与资源投入方案。",
            "围绕模型结论产出 10+ 页分析报告，全部获得客户采纳。",
          ],
        },
      },
      {
        title: { en: "Strategy Optimization", zh: "策略优化" },
        points: {
          en: [
            "Co-authored multiple rounds of executive presentations and helped design KOC growth paths and tiered UGC incentive systems.",
            "Applied K-Means clustering to 500+ user profiles and content types, identifying three core segments: \"Aesthetic Seeding,\" \"Daily Sharing,\" and \"Usage Insights.\"",
            "Updated the KOC grading framework using the Diamond Model and proposed differentiated strategies by vehicle model, region, and KOC tier, lifting UGC output by 27% in the following month.",
          ],
          zh: [
            "联合项目组撰写多轮高层汇报材料，协助设计 KOC 成长路径与 UGC 分层激励机制。",
            "对 500+ 用户画像与内容类型进行 K-Means 聚类，识别出「美图种草」「日常分享」「用车心得」三类核心人群。",
            "结合「钻石模型」与回归结果更新 KOC 分级体系，提出分车型、分地区、分层级的差异化策略，次月 UGC 产出提升 27%。",
          ],
        },
      },
      {
        title: { en: "System Building", zh: "体系搭建" },
        points: {
          en: [
            "Co-authored the 97-page Dongfeng Honda KOC Digital Operations Manual (PowerPoint), converting project insights into a standardized operating framework.",
            "Authored a 15-page Word operating guide for internal training and process standardization.",
          ],
          zh: [
            "参与搭建《东风本田保客达人 KOC 数字化运营体系文件》（97 页 PPT），将项目洞察沉淀为标准化运营框架。",
            "将模型结论与运营洞察整理为 15 页 Word 操作手册，用于客户内部培训与流程标准化落地。",
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
      zh: "覆盖茅台、五粮液与山西汾酒的白酒行业深度研究及估值分析。",
    },
    accent: "#14b8a6",
    overview: {
      en: "I joined Guoyuan Securities' consumer coverage team to research China's premium baijiu market during a pivotal phase of consumption upgrading. I built the core financial tracking database and authored an independent strategy report whose findings were incorporated into the team's quarterly portfolio discussions.",
      zh: "我加入国元证券消费品行业研究团队，在消费升级的关键阶段深入研究中国高端白酒市场。期间我搭建核心财务数据追踪体系，并独立撰写策略报告，部分内容被纳入团队季度组合策略讨论。",
    },
    metrics: [
      { value: "15+",   label: { en: "Companies covered",           zh: "覆盖上市公司" } },
      { value: "3",     label: { en: "Valuation models",            zh: "估值模型"     } },
      { value: "1",     label: { en: "Independent strategy report", zh: "独立策略报告" } },
      { value: "2024",  label: { en: "Mid-year report published",   zh: "年中报告发布" } },
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
            "聚焦白酒板块，覆盖贵州茅台、五粮液、山西汾酒等龙头企业。",
            "重点研究高端与次高端白酒市场格局、消费升级趋势及渠道动态。",
          ],
        },
      },
      {
        title: { en: "Data & Modeling", zh: "数据与建模" },
        points: {
          en: [
            "Built a core financial metrics database covering revenue growth, net margin, and inventory turnover across 15+ listed consumer staples companies using Wind, iFind, and quarterly filings.",
            "Performed time-series and YoY/MoM comparisons in Excel to track raw material costs, sales channels, and holiday demand fluctuations.",
            "Applied DCF and PE valuation models to estimate fair-value ranges and inform investment positioning.",
          ],
          zh: [
            "基于 Wind、iFind 与上市公司季度财报，建立覆盖 15 家以上消费品公司的核心财务指标数据库，追踪营收增速、净利率与渠道库存周转率等关键指标。",
            "在 Excel 中开展时间序列分析与同比、环比对比，持续跟踪原料成本、渠道动销及节假日销售波动。",
            "运用 DCF 与 PE 估值模型测算核心标的合理估值区间，形成投资建议。",
          ],
        },
      },
      {
        title: { en: "Report Writing & Output", zh: "研报写作与成果" },
        points: {
          en: [
            "Contributed to in-depth industry reports and monthly strategy briefs, synthesizing channel research and end-market sales data alongside PESTEL macro analysis.",
            "Independently authored the Mid-Year Strategy Report on the Baijiu Sector (2024), advocating a \"steady growth in premium, structural recovery in sub-premium\" investment thesis.",
            "Selected sections of the report were featured in the team's quarterly portfolio strategy discussion.",
          ],
          zh: [
            "参与撰写行业深度研究报告与月度策略简报，结合 PESTEL 框架分析宏观政策、渠道调研与终端动销趋势。",
            "独立完成《白酒板块 2024 年中期策略报告》，提出「高端稳增长、次高端结构性修复」的投资判断。",
            "报告节选被导师纳入团队季度组合策略讨论材料。",
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
      en: "Overseas mini-game platform strategy during an early stage of market formation.",
      zh: "在市场格局形成阶段开展的海外小游戏平台战略研究。",
    },
    accent: "#f59e0b",
    overview: {
      en: "I joined ByteDance's overseas mini-game business unit as the team was shaping its international competitive strategy. I contributed to systematic industry research and co-authored a 100+ page report that served as foundational reference material for internal strategy discussions.",
      zh: "我在字节跳动海外小游戏业务战略形成的关键阶段加入团队，参与系统性行业研究，协作产出 100+ 页行业研究报告，成为内部战略讨论的核心参考材料。",
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
            "Systematically mapped the domestic and overseas mini-game industry from 2018 to 2025, covering market size, user structure, and primary growth drivers.",
            "Analyzed three core monetization models — IAA (in-app advertising), IAP (in-app purchase), and hybrid — building a framework to evaluate platform positioning.",
          ],
          zh: [
            "系统梳理 2018–2025 年国内外小游戏行业发展脉络，搭建涵盖市场规模、用户结构与增长动因的核心分析框架。",
            "分析 IAA、IAP 与混合变现三大商业模式，构建平台战略定位评估框架。",
          ],
        },
      },
      {
        title: { en: "Competitive Intelligence", zh: "竞品监控" },
        points: {
          en: [
            "Benchmarked 10+ mini-game platforms across domestic (WeChat, Kuaishou) and international markets (Facebook, Telegram, Kwai).",
            "Tracked traffic entry points, revenue-sharing mechanisms, and developer policies across platforms.",
            "Mapped competitive dynamics and stage-specific opportunities across overseas markets to support strategic decisions.",
          ],
          zh: [
            "对微信、快手、Facebook、Telegram、Kwai 等 10+ 国内外小游戏平台进行系统对比分析。",
            "持续跟踪流量入口、分成机制与开发者政策，评估各平台在提升内容供给效率方面的策略差异。",
            "梳理竞争格局演变与阶段性市场机会，为业务决策提供研究依据。",
          ],
        },
      },
      {
        title: { en: "Product Optimization Analysis", zh: "产品优化分析" },
        points: {
          en: [
            "Evaluated feature architecture and onboarding flows across multiple mini-game platforms from a product perspective.",
            "Assessed how different entry-point designs influenced user conversion efficiency and content distribution reach.",
            "Distilled actionable recommendations for reducing friction and shortening user paths to improve platform content supply efficiency.",
          ],
          zh: [
            "从产品视角分析多款小游戏平台的功能结构与接入路径。",
            "评估不同功能入口设计对用户转化效率与内容分发效果的影响。",
            "提炼降低使用门槛、缩短触达路径的产品优化方向，以提升平台内容供给与使用效率。",
          ],
        },
      },
      {
        title: { en: "Output", zh: "成果产出" },
        points: {
          en: [
            "Contributed to systematic overseas mini-game industry research, producing the 100+ page Overseas Mini-Game Industry Research Report.",
            "Produced multiple thematic briefs used as foundational reference material for ByteDance's overseas mini-game direction and internal strategy reviews.",
          ],
          zh: [
            "参与海外小游戏行业系统性研究，形成《海外小游戏行业研究报告》（100+ 页）。",
            "产出多份专题研究材料，作为字节跳动内部海外小游戏方向的基础研究与策略参考。",
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
      en: "AI data visualization platform with a frontend built solo through vibe coding.",
      zh: "通过 Vibe Coding 独立构建前端的 AI 数据可视化平台。",
    },
    accent: "#8b5cf6",
    overview: {
      en: "I built ChartCreator to address a recurring bottleneck: non-technical professionals spending hours adjusting chart styling instead of focusing on analysis. Using Claude Code, Codex, and a vibe coding workflow, I led user research, built the entire frontend, and collaborated with the backend team through launch.",
      zh: "我构建 ChartCreator 源于一个明确痛点：许多非技术从业者在图表样式调整上耗费大量时间，难以专注于数据洞察本身。我借助 Claude Code、Codex 与 Vibe Coding 工作流，主导完成了用户研究、前端全流程实现及前后端接口联调上线。",
    },
    metrics: [
      { value: "1",    label: { en: "Solo frontend builder",   zh: "人独立完成前端"   } },
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
            "Interviewed professionals in consulting, finance, and sales to identify key data presentation bottlenecks: inconsistent formatting, complex workflows, and low-quality exports.",
          ],
          zh: [
            "对 Graphy、Canva、Graphmaker 等竞品开展系统对比分析，识别功能缺口与定位机会。",
            "访谈咨询、金融与销售行业从业者，梳理数据呈现的核心痛点：格式难以统一、操作流程繁琐、导出质量不足。",
          ],
        },
      },
      {
        title: { en: "Product Design", zh: "产品设计" },
        points: {
          en: [
            "Designed the end-to-end user flow (\"Upload → AI Recommend → Customize → Export\"), optimized to keep interaction friction low.",
            "Mapped system logic with Visio swimlane diagrams to clarify interactions across the frontend, backend, and user journey.",
            "Built UI mockups and interactive prototypes in Figma prior to development.",
          ],
          zh: [
            "设计完整产品流程：「用户上传数据 → AI 智能推荐 → 自定义编辑 → 图表导出」，以低操作门槛为优化目标。",
            "使用 Visio 泳道流程图梳理前端、后端与用户端的交互路径，明确跨层级协作边界。",
            "在开发前使用 Figma 构建 UI 原型与交互模型。",
          ],
        },
      },
      {
        title: { en: "Vibe Coding Development", zh: "Vibe Coding 开发" },
        points: {
          en: [
            "Used Claude Code and Codex as primary development tools, writing structured prompts to drive the entire frontend from product blueprint and tech stack selection through information architecture and core feature code.",
            "Defined API standards and interface logic during architecture design, collaborating with the backend team on feasibility reviews.",
            "Applied Agile and CI/CD practices to accelerate iteration and stabilize delivery quality.",
          ],
          zh: [
            "以 Claude Code 与 Codex 为主力开发工具，通过结构化 Prompt 驱动前端全流程：从产品蓝图、技术选型到信息架构与核心功能代码生成。",
            "在系统架构设计阶段参与前后端接口规范制定，明确 API 调用逻辑与数据交互标准，并与后端团队开展可行性评审。",
            "应用 Agile 与 CI/CD 实践，加快迭代节奏并保障交付稳定性。",
          ],
        },
      },
    ],
    tools: ["Claude Code", "Codex", "Next.js", "Tailwind CSS", "Figma", "Agile", "CI/CD", "Prompt Engineering"],
  },
];

export const t = tx;
export type { Lang };
