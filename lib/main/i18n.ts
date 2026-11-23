export type Lang = "en" | "zh";

export const i18n = {
  nav: {
    about:      { en: "About",        zh: "关于" },
    experience: { en: "Experience",   zh: "经历" },
    projects:   { en: "Projects",     zh: "项目" },
    global:     { en: "Global",       zh: "视野" },
    contact:    { en: "Contact",      zh: "联系" },
    cta:        { en: "Get in Touch", zh: "联系我" },
    lang:       { en: "中文",          zh: "EN"   },
  },

  hero: {
    nameLabel:  { en: "Wuziyang Zhang", zh: "张吴梓洋" },
    headline1:  { en: "Think in systems.",          zh: "以系统思考。" },
    headline2:  { en: "Build with taste.",          zh: "以品味构建。" },
    sub1:       { en: "Economics & Information Science · AI Business Analytics & AI Products", zh: "经济学与信息科学 · AI 商业分析与 AI 产品" },
    sub2:       { en: "at the University of Wisconsin–Madison.", zh: "威斯康星大学麦迪逊分校。" },
    cta1:       { en: "View Experience", zh: "查看经历" },
    cta2:       { en: "About Me",        zh: "关于我"   },
    switchTour: { en: "Switch to Cindy tour", zh: "切换至 Cindy 导览版" },
    scroll:     { en: "Scroll",          zh: "向下"     },
  },

  about: {
    label:      { en: "About",    zh: "关于" },
    headline:   { en: "I build where\nstrategy meets\nexecution.", zh: "我在战略\n与执行的\n交汇处构建。" },
    accentWord: { en: "execution.", zh: "交汇处构建。" },
    p1: { en: "I study Economics and Information Science at the University of Wisconsin–Madison, working at the intersection of market research, data analysis, and AI product building.", zh: "我就读于威斯康星大学麦迪逊分校，主修经济学与信息科学，专注在市场研究、数据分析与 AI 产品的交叉领域展开实践。" },
    p2: { en: "I start by finding structure in ambiguity — framing open-ended questions clearly and turning them into concrete, usable outcomes. I care as much about how a system works beneath the surface as how it feels to use.", zh: "我习惯从不确定的问题入手，梳理底层逻辑与判断框架，再将其转化为可落地、可使用的成果。我同样重视系统内部的严谨结构与最终的使用体验。" },
    p3: { en: "I have worked across internet technology (ByteDance, Alibaba), a leading consulting firm (Roland Berger), and finance (Guoyuan Securities), built AI products from initial concept to working interface, and traveled across 20+ countries to observe how people, markets, and cultures operate in practice.", zh: "我曾在互联网（字节跳动、阿里巴巴）、头部咨询公司（罗兰贝格）与金融机构（国元证券）参与业务及研究实践，将 AI 产品从早期构想推进至完整可用，并走访 20 多个国家，实地观察不同市场与文化的真实运作。" },
    p4: { en: "I believe the most durable ideas take shape at the intersection of disciplines. That is where I choose to work.", zh: "我相信，最具生命力的想法往往诞生于学科的交汇处，而这也正是我选择深耕的位置。" },
    tags: {
      en: ["Business Strategy", "AI Products", "Market Research", "Data Analysis", "Vibe Coding", "Global Perspective"],
      zh: ["商业战略", "AI 产品", "市场研究", "数据分析", "Vibe Coding", "全球视野"],
    },
  },

  experience: {
    label:    { en: "Selected Experience", zh: "精选经历"       },
    headline: { en: "Where I've worked.",  zh: "我的工作经历。" },
  },

  projects: {
    label:    { en: "Selected Projects", zh: "精选项目"       },
    headline: { en: "What I build.",     zh: "我构建的作品。" },
    tagline:  { en: "The best products feel inevitable in hindsight.\nSimple enough to disappear. Useful enough to stay.", zh: "最好的产品，事后看来皆是必然。" },
    offerradar: {
      title: { en: "Offer Radar",             zh: "Offer 雷达"               },
      tag1:  { en: "Web · AI Product",        zh: "Web · AI 产品"            },
      tag2:  { en: "Built · Pending Filings", zh: "功能完成 · 等待上线手续"  },
      desc:  { en: "An AI campus-recruiting workspace for university students in China, unifying company selection, tailored resumes, application tracking, and interview preparation in one place.", zh: "面向中国大学生的校招 AI 求职工作台，基于持久化个人档案与校招时间线，整合公司筛选、简历定制、投递跟踪与面试准备。" },
      cta:   { en: "View Project",            zh: "查看项目"                 },
      points: {
        en: [
          "Curated database of 839 hiring entities across 13 industries, supporting reach/match/safety tiers, batch-apply lists, and 0–100 JD match scoring",
          "Generates one-page tailored resumes per target company without fabricating numbers, flagging stretch edits in yellow with concrete execution steps",
          "Tracks applications through a Kanban board synced with user-confirmed recruiting emails, paired with interview prep and mock rounds across 30 job tracks",
          "Powered by a 21-tool LangGraph assistant that recommends without auto-applying, confirms every edit before saving, and keeps models and data onshore in China",
        ],
        zh: [
          "内置覆盖 13 个行业、839 个招聘主体的公司库，支持冲稳保分层、海投清单与 0–100 分岗位匹配分析",
          "按目标公司定制一页纸简历，不编造缺失数字；向岗位靠拢的表述统一标黄并附具体落实步骤",
          "投递看板联动邮件识别，经用户确认后更新日程；覆盖 30 类岗位面经要点与模拟面试",
          "内置搭载 21 个工具的 LangGraph 对话助手，仅提供建议不代投，所有写入均须确认，模型与数据全部留在境内",
        ],
      },
    },
    healthagent: {
      title: { en: "My Health Agent",         zh: "健康助理"               },
      tag1:  { en: "iOS · AI Product",        zh: "iOS · AI 产品"          },
      tag2:  { en: "Preparing for App Store", zh: "准备上架 App Store"     },
      desc:  { en: "An AI health assistant for Apple Watch that opens straight into conversation, translating daily body metrics into clear, actionable guidance.", zh: "面向 Apple Watch 用户的 iOS 健康助理，以对话为核心交互，将日常生理指标转化为清晰可执行的每日安排。" },
      cta:   { en: "View Project",            zh: "查看项目"               },
      points: {
        en: [
          "Follows a compute-first, coach-second architecture: scores and safe calorie bounds are calculated on-device before AI interprets the verified figures",
          "Distills over a dozen Apple Watch signals against a personal 60-day baseline into three plain-language scores: Energy, Activity, and Sleep",
          "Combines personal goals, logged meals, and long-term memory to build daily plans alongside proactive morning and evening recaps",
          "Keeps scoring and encrypted chats on-device with dual-region routing: Qwen onshore in mainland China and Claude overseas",
        ],
        zh: [
          "坚持先计算后解读原则：核心分数与热量安全范围均先在手机本地按规则算好，再由 AI 基于真实数据给出解释",
          "对照个人过去 60 天基准，将十余项 Apple Watch 指标提炼为身体电量、运动与睡眠三项直观分数",
          "结合个人目标、饮食记录与长期记忆生成每日计划，并提供早晚主动复盘",
          "算分与加密对话留存本地，采用双区域架构分流：中国大陆接入通义千问且数据不出境，海外接入 Claude",
        ],
      },
    },
    chartcreator: {
      tag1:  { en: "AI Product",         zh: "AI 产品"    },
      tag2:  { en: "Data Visualization", zh: "数据可视化" },
      desc:  { en: "An AI-powered data visualization platform built for non-technical professionals who care as much about how their data looks as what it says.", zh: "面向非技术从业者的 AI 数据可视化平台，在准确传达数据洞察的同时兼顾专业呈现质量。" },
      cta:   { en: "View Project",       zh: "查看项目"   },
      points: {
        en: [
          "Designed for non-technical professionals in consulting, finance, and sales who need clean, presentation-ready charts",
          "Built the frontend solo through a vibe coding workflow using Claude Code and Codex for rapid, structured iteration",
          "Led user research, information architecture, user flows, and Figma prototypes across the Upload → AI Recommend → Customize → Export journey",
          "Anchored product decisions on three standards: speed, usability, and visual clarity",
        ],
        zh: [
          "面向咨询、金融与销售等领域的非技术从业者，提供可直接用于汇报的高质量图表输出",
          "借助 Claude Code、Codex 与 Vibe Coding 工作流独立完成前端开发，保持结构化快速迭代",
          "主导用户研究、信息架构、交互流程与 Figma 原型设计，覆盖上传、AI 推荐、自定义编辑与导出全链路",
          "以速度、易用性与视觉呈现质量作为核心产品标准",
        ],
      },
    },
    codeandpower: {
      tag1:  { en: "Academic",      zh: "学术项目"  },
      tag2:  { en: "Ethics & Tech", zh: "科技伦理"  },
      desc:  { en: "An educational website examining how implicit bias shapes digital systems and advocating equitable, intersectional design thinking.", zh: "探讨隐性偏见如何塑造数字系统的教育性网站，倡导公平且具有交叉性视角的设计思维。" },
      cta:   { en: "View Project",  zh: "查看项目"  },
      points: {
        en: [
          "Examines implicit bias and intersectionality across datasets, product teams, and everyday digital systems",
          "Includes introductory educational resources and profiles of innovators advancing equity in technology",
          "Trained an in-browser image classifier with Teachable Machine and TensorFlow.js to illustrate dataset bias, built in HTML/CSS with Matt Steines",
        ],
        zh: [
          "剖析数据集、产品团队与日常数字系统中的隐性偏见及交叉性议题",
          "整合面向初学者的科普资源与推动科技公平的人物专题",
          "基于 Teachable Machine 与 TensorFlow.js 训练浏览器端图像分类模型以验证数据偏见，并与 Matt Steines 以 HTML/CSS 合作建成网站",
        ],
      },
    },
    comingSoon: { en: "Coming soon", zh: "即将上线" },
  },

  global: {
    label:     { en: "Global Perspective", zh: "全球视野"        },
    headline1: { en: "The world is",       zh: "世界本身，"      },
    headline2: { en: "my fieldwork.",      zh: "就是我的田野。"  },
    statLabels: {
      Countries:  { en: "Countries",  zh: "个国家" },
      Cities:     { en: "Cities",     zh: "座城市" },
      Continents: { en: "Continents", zh: "个大洲" },
    },
    p1: { en: "I do not travel to collect destinations. I travel to observe how people make decisions — what they value, what they build, and how they live. Every city offers context that no data table can capture.", zh: "我旅行的目的并非积累目的地，而是观察不同社会中的人如何做决策——他们重视什么、构建什么、如何生活。每座城市所呈现的现实，都是数据表格无法替代的。" },
    p2: { en: "Market behavior reads differently once you have walked through those markets in person. User needs sharpen when you have navigated an unfamiliar culture as an outsider. To me, a global perspective is not a credential — it is a research method.", zh: "唯有亲身走入不同市场，书本中的商业规律才会显露真实脉络；在陌生文化中以本地用户的视角生活，需求痛点才会变得清晰。对我而言，全球视野并非履历标签，而是一种研究方法。" },
    cityPhotos: [
      { city: { en: "New York",  zh: "纽约"    }, note: { en: "Finance",        zh: "金融"     }, src: "/photos/travel-nyc.jpg"       },
      { city: { en: "Istanbul",  zh: "伊斯坦布尔" }, note: { en: "History",     zh: "历史"     }, src: "/photos/travel-istanbul.jpg"  },
      { city: { en: "Toronto",   zh: "多伦多"  }, note: { en: "Architecture",   zh: "建筑"     }, src: "/photos/travel-toronto.jpg"   },
      { city: { en: "Lima",      zh: "利马"    }, note: { en: "Coastal Living", zh: "滨海生活" }, src: "/photos/travel-lima.jpg"      },
    ],
    cityGrid: [
      { city: { en: "Tokyo",     zh: "东京"   }, note: { en: "Product Design", zh: "产品设计" } },
      { city: { en: "Paris",     zh: "巴黎"   }, note: { en: "Aesthetics",     zh: "美学"     } },
      { city: { en: "New York",  zh: "纽约"   }, note: { en: "Finance",        zh: "金融"     } },
      { city: { en: "Singapore", zh: "新加坡" }, note: { en: "Strategy",       zh: "战略"     } },
      { city: { en: "London",    zh: "伦敦"   }, note: { en: "Markets",        zh: "商业市场" } },
      { city: { en: "Seoul",     zh: "首尔"   }, note: { en: "Culture",        zh: "文化"     } },
      { city: { en: "Berlin",    zh: "柏林"   }, note: { en: "Innovation",     zh: "创新"     } },
      { city: { en: "+ 93 more", zh: "+ 93 座" }, note: { en: "and counting",  zh: "持续探索" } },
    ],
  },

  music: {
    label:     { en: "Aesthetic Sensibility", zh: "审美与品味"      },
    headline1: { en: "Music taught me rhythm", zh: "音乐先于产品，"  },
    headline2: { en: "before product",         zh: "教会了我节奏，"  },
    headline3: { en: "taught me flow.",        zh: "也教会了我流动。" },
    headline3Accent: { en: "taught me flow.",  zh: "也教会了我流动。" },
    p1: { en: "I have played piano since childhood, earning National Grade 9 in piano and Grade 6 in music theory. I include this not as a biographical footnote, but because long-term practice fundamentally shaped how I think.", zh: "我自幼学习钢琴，取得全国钢琴九级与乐理六级。我提及这段经历，并非为了增添谈资，而是因为长期的音乐训练深刻塑造了我的思维方式。" },
    p2: { en: "Music taught me that structure creates freedom rather than constraint, and that discipline enables expression rather than suppressing it. The performances that feel effortless are almost always built on hours of invisible preparation.", zh: "音乐让我理解，结构创造自由而非束缚，纪律支撑表达而非压制表达。真正举重若轻的演奏，背后往往是长期而不可见的积累。" },
    p3: { en: "I carry those same principles — restraint, internal logic, and timing — into my product work and writing. Taste is not surface decoration; it is a framework for judgment.", zh: "克制、内在逻辑与时机把握，这些原则同样贯穿于我的产品实践与写作之中。品味并非表面的装饰，而是一种判断框架。" },
    credentials: [
      { key: "Piano",        name: { en: "Piano",        zh: "钢琴"   }, credential: { en: "Grade 9",      zh: "九级"       }, meta: { en: "National Grading System", zh: "全国等级考试" } },
      { key: "Music Theory", name: { en: "Music Theory", zh: "乐理"   }, credential: { en: "Grade 6",      zh: "六级"       }, meta: { en: "National Grading System", zh: "全国等级考试" } },
      { key: "Guitar",       name: { en: "Guitar",       zh: "吉他"   }, credential: { en: "Acoustic",     zh: "木吉他"     }, meta: { en: "Self-taught, ongoing",    zh: "持续自学"     } },
      { key: "Hulusi",       name: { en: "Hulusi",       zh: "葫芦丝" }, credential: { en: "Traditional",  zh: "传统吹奏"   }, meta: { en: "Chinese instrument",      zh: "中国民族乐器" } },
    ],
  },

  skills: {
    label:    { en: "Capabilities",    zh: "能力图谱"     },
    headline: { en: "How I operate.", zh: "我如何工作。"  },
    tagline:  { en: "My toolkit spans strategy, product, data, and design — each in service of clearer judgment.", zh: "我的能力横跨战略、产品、数据与设计，一切都服务于更清晰的判断与决策。" },
    groups: [
      { symbol: "◈", category: { en: "Strategy & Research",    zh: "战略与研究" }, skills: { en: ["Market Research","Business Analysis","Competitive Analysis","Industry Research","Strategic Reporting","Financial Modeling"], zh: ["市场研究","商业分析","竞争分析","行业研究","战略报告","财务建模"] } },
      { symbol: "◇", category: { en: "Product & AI",           zh: "产品与 AI"  }, skills: { en: ["Product Strategy","AI Workflow Design","Vibe Coding","Prompt Engineering","Information Architecture","User Research"],         zh: ["产品战略","AI 工作流设计","Vibe Coding","提示词工程","信息架构","用户研究"] } },
      { symbol: "◉", category: { en: "Data & Analysis",        zh: "数据与分析" }, skills: { en: ["Python","R","SQL","Stata","Excel (Advanced)","Data Storytelling"],                                                               zh: ["Python","R","SQL","Stata","Excel（高级）","数据叙事"] } },
      { symbol: "◐", category: { en: "Design & Communication", zh: "设计与表达" }, skills: { en: ["UX & Interface Thinking","Presentation Design","Report Writing","Data Visualization","Prototyping","Cross-Cultural Communication"], zh: ["UX 与界面思维","演示与汇报设计","报告写作","数据可视化","原型设计","跨文化沟通"] } },
    ],
  },

  philosophy: {
    label:       { en: "Point of View",   zh: "思维理念"     },
    headline:    { en: "How I think.",    zh: "我如何思考。"  },
    quote1:      { en: "\"I want to build things that are", zh: "「我想打造" },
    quoteAccent: { en: " useful, elegant,",                 zh: "实用、优雅，" },
    quote2:      { en: "and hard to forget.\"",             zh: "且令人难以忘怀的作品。」" },
    p1: { en: "I believe technology is most powerful when it becomes intuitive enough to fade into the background — when software stops feeling like a tool you operate and becomes a medium you think with.", zh: "我相信，最有力量的技术往往隐于无形——当软件足够契合直觉，它便不再是需要刻意操作的工具，而成为思考本身的延伸。" },
    p2: { en: "The strongest work holds rigor and taste in equal measure. It carries a clear point of view and reflects care from its underlying architecture to its finest surface detail.", zh: "优秀的作品始终兼顾严谨逻辑与审美品味。它有清晰的立场，也能让人从底层架构一路感受到外在细节的克制与考究。" },
    signature: { en: "Wuziyang Zhang", zh: "张吴梓洋" },
  },

  contact: {
    label:     { en: "Get in Touch",      zh: "联系"           },
    headline1: { en: "If something here", zh: "若此处的思考"    },
    headline2: { en: "resonated —",       zh: "与你有所共鸣，"  },
    headline3: { en: "let's talk.",       zh: "欢迎交流。"      },
    body: { en: "I am open to internships, full-time roles, research collaborations, and thoughtful conversations. Whether you are building a product, hiring for a team, or exploring new ideas, feel free to reach out.", zh: "我对实习、全职机会、研究合作与深度交流均保持开放。无论你正在构建产品、为团队寻找成员，还是希望就相关领域交换观点，都欢迎与我联系。" },
    sendEmail: { en: "Send Email",      zh: "发送邮件" },
    linkedin:  { en: "LinkedIn",        zh: "LinkedIn" },
    resume:    { en: "Download Résumé", zh: "下载简历" },
    infoLabels: {
      Email:      { en: "Email",      zh: "邮箱"   },
      Location:   { en: "Location",   zh: "所在地" },
      University: { en: "University", zh: "学校"   },
      Status:     { en: "Status",     zh: "状态"   },
    },
    infoValues: {
      Location:   { en: "Madison, Wisconsin",    zh: "威斯康星州麦迪逊"       },
      University: { en: "UW–Madison",            zh: "威斯康星大学麦迪逊分校" },
      Status:     { en: "Open to Opportunities", zh: "开放新机会"             },
    },
  },

  footer: {
    copy:   { en: "Wuziyang Zhang. Designed with intent.", zh: "张吴梓洋 · 以意为形。" },
    email:  { en: "Email",  zh: "邮件" },
    resume: { en: "Résumé", zh: "简历" },
    mono:   { en: "Wuziyang Zhang · WZ", zh: "张吴梓洋 · WZ" },
  },
} as const;

/** Helper: pick the right string for the current lang */
export function tx<T extends { en: string; zh: string }>(entry: T, lang: Lang): string {
  return entry[lang];
}
