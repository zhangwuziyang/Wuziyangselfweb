export type Lang = "en" | "zh";

export const i18n = {
  nav: {
    about:      { en: "About",        zh: "关于" },
    experience: { en: "Experience",   zh: "经历" },
    projects:   { en: "Projects",     zh: "项目" },
    global:     { en: "Global",       zh: "全球" },
    contact:    { en: "Contact",      zh: "联系" },
    cta:        { en: "Get in Touch", zh: "联系我" },
    lang:       { en: "中文",          zh: "EN"   },
  },

  hero: {
    nameLabel:  { en: "吴梓洋  ·  Wuziyang Zhang", zh: "张吴梓洋" },
    headline1:  { en: "Think in systems.",          zh: "洞见系统。" },
    headline2:  { en: "Build with taste.",          zh: "以品味筑造。" },
    sub1:       { en: "Economics · Information Science · AI Products —", zh: "经济学 · 信息科学 · AI 产品" },
    sub2:       { en: "at the University of Wisconsin–Madison.", zh: "威斯康星大学 · 麦迪逊。" },
    cta1:       { en: "View Work",  zh: "查看经历" },
    cta2:       { en: "About Me",   zh: "关于我"   },
    scroll:     { en: "Scroll",     zh: "向下"     },
  },

  about: {
    label:      { en: "About",    zh: "关于" },
    headline:   { en: "I build where\nstrategy meets\nexecution.", zh: "战略与执行\n的交汇，\n是我的选择。" },
    accentWord: { en: "execution.", zh: "是我的选择。" },
    p1: { en: "I study Economics and Information Science at the University of Wisconsin–Madison, working at the intersection of market insight, data analysis, and AI-enabled product thinking.", zh: "就读于威斯康星大学麦迪逊分校，主修经济学与信息科学。我在市场洞察、数据分析与 AI 产品思维的交叉地带工作。" },
    p2: { en: "My instinct is to find structure in ambiguity — to take a vague problem, frame it clearly, and build something actionable from it. I care as much about how something works as how it feels to use.", zh: "我习惯在模糊中寻找结构——将不清晰的问题框架化，再从中构建可执行的方向。我同样关注事物的运转逻辑和使用时的体验感。" },
    p3: { en: "I've worked inside top-tier consulting firms and financial institutions, built AI-powered products from blueprint to interface, and traveled across 20+ countries to understand how people, markets, and cultures actually behave — not just in theory.", zh: "我曾供职于顶级咨询公司与金融机构，独立将 AI 产品从蓝图推进到上线，并走访 20 多个国家，亲历不同市场与文化的真实运作——而非停于纸面。" },
    p4: { en: "I believe the most powerful ideas sit at the edge of disciplines. That's where I choose to work.", zh: "最有力量的想法，往往诞生于学科的边界。那正是我选择驻足的地方。" },
    tags: {
      en: ["Business Strategy", "AI Products", "Market Research", "Data Analysis", "Vibe Coding", "Global Perspective"],
      zh: ["商业战略", "AI 产品", "市场研究", "数据分析", "Vibe Coding", "全球视野"],
    },
  },

  experience: {
    label:    { en: "Selected Experience", zh: "经历"          },
    headline: { en: "Where I've worked.",  zh: "我走过的路。" },
  },

  projects: {
    label:    { en: "Building",     zh: "在建"         },
    headline: { en: "What I make.", zh: "我正在创造。"   },
    tagline:  { en: "The best products feel inevitable in hindsight.\nSimple enough to disappear. Useful enough to stay.", zh: "最好的产品，事后看来皆是必然。" },
    chartcreator: {
      tag1:  { en: "AI Product", zh: "AI 产品"  },
      tag2:  { en: "Flagship",   zh: "主项目"   },
      desc:  { en: "An AI-powered data visualization platform built for people who care about how their data looks — not just what it says.", zh: "AI 驱动的数据可视化平台。不只关注数据说了什么，更在意它的呈现方式。" },
      cta:   { en: "View Project", zh: "查看项目" },
      points: {
        en: [
          "Designed for non-technical users who need polished, presentation-ready output",
          "Built through a vibe coding methodology — prompt-driven, fast iteration cycles",
          "Owns the full product surface: IA, user flows, interface structure, and system design",
          "Speed, usability, and aesthetic quality as the three non-negotiable product values",
        ],
        zh: [
          "面向非技术用户，追求开箱即用的精美输出",
          "Vibe Coding 驱动——提示词迭代，快速推进",
          "掌控完整产品面：信息架构、用户流程与系统设计",
          "速度、易用与美感，三条不可妥协的产品准则",
        ],
      },
    },
    codeandpower: {
      tag1:  { en: "Academic",      zh: "学术项目"  },
      tag2:  { en: "Ethics & Tech", zh: "科技伦理"  },
      desc:  { en: "An educational website examining how implicit biases shape technology and promoting equitable, intersectional design thinking.", zh: "探讨隐性偏见如何塑造技术的教育网站，倡导公平、交叉性的设计思维。" },
      cta:   { en: "View Project", zh: "查看项目" },
      points: {
        en: [
          "Explores implicit bias and intersectionality in digital systems",
          "Features educational resources and a Tech Hero profile advancing equity",
          "Built with HTML/CSS in collaboration with Matt Steines",
        ],
        zh: [
          "探索数字系统中的隐性偏见与交叉性议题",
          "含教育资源与推动科技公平的人物专题",
          "与 Matt Steines 合作以 HTML/CSS 共同完成",
        ],
      },
    },
    comingSoon: { en: "Coming soon", zh: "即将上线" },
  },

  global: {
    label:     { en: "Global Perspective", zh: "全球视野"    },
    headline1: { en: "The world is",       zh: "世界本身，"  },
    headline2: { en: "the research.",      zh: "就是研究。"  },
    statLabels: {
      Countries:  { en: "Countries",  zh: "个国家" },
      Cities:     { en: "Cities",     zh: "个城市" },
      Continents: { en: "Continents", zh: "个大洲" },
    },
    p1: { en: "I don't travel to collect countries. I travel to understand how people make decisions — what they value, what they build, and how they live. Every city teaches me something that a data table cannot.", zh: "旅行对我而言不是打卡，而是理解——理解人们如何做决策，重视什么、构建什么、怎样生活。每座城市都教会了我数据表格无法传递的东西。" },
    p2: { en: "Market behavior looks different when you've walked through the markets. User needs become clearer when you've been the user in a foreign context. A global perspective isn't a credential — it's a methodology.", zh: "真正走过那些市场之后，市场行为的含义就不一样了。在异国文化中成为那个用户，用户需求才会变得真实清晰。全球视野不是资历，而是一种方法论。" },
    cityPhotos: [
      { city: { en: "New York",  zh: "纽约"    }, note: { en: "Finance",       zh: "金融"  }, src: "/photos/travel-nyc.jpg"       },
      { city: { en: "Istanbul",  zh: "伊斯坦布尔" }, note: { en: "History",    zh: "历史"  }, src: "/photos/travel-istanbul.jpg"  },
      { city: { en: "Toronto",   zh: "多伦多"  }, note: { en: "Architecture",  zh: "建筑"  }, src: "/photos/travel-toronto.jpg"   },
      { city: { en: "Lima",      zh: "利马"    }, note: { en: "Coastal Living", zh: "滨海" }, src: "/photos/travel-lima.jpg"      },
    ],
    cityGrid: [
      { city: { en: "Tokyo",     zh: "东京"   }, note: { en: "Product Design", zh: "产品设计" } },
      { city: { en: "Paris",     zh: "巴黎"   }, note: { en: "Aesthetics",     zh: "美学"     } },
      { city: { en: "New York",  zh: "纽约"   }, note: { en: "Finance",        zh: "金融"     } },
      { city: { en: "Singapore", zh: "新加坡" }, note: { en: "Strategy",       zh: "战略"     } },
      { city: { en: "London",    zh: "伦敦"   }, note: { en: "Market",         zh: "市场"     } },
      { city: { en: "Seoul",     zh: "首尔"   }, note: { en: "Culture",        zh: "文化"     } },
      { city: { en: "Berlin",    zh: "柏林"   }, note: { en: "Innovation",     zh: "创新"     } },
      { city: { en: "+ 93 more", zh: "更多…"  }, note: { en: "and counting",   zh: "持续探索" } },
    ],
  },

  music: {
    label:     { en: "Aesthetic Sensibility", zh: "感性与品味"      },
    headline1: { en: "Music taught me rhythm", zh: "音乐先于产品，"  },
    headline2: { en: "before product",         zh: "教会了我节奏，"  },
    headline3: { en: "taught me flow.",        zh: "也教会了流动。"  },
    headline3Accent: { en: "taught me flow.", zh: "也教会了流动。" },
    p1: { en: "I've played piano since childhood — reaching National Grade 9 alongside Grade 6 in music theory. I don't mention this to sound interesting. I mention it because it shaped how I think.", zh: "自幼学钢琴，考取全国钢琴九级与乐理六级。提到这些，不是为了有趣，而是因为它真实地塑造了我的思维方式。" },
    p2: { en: "Music taught me that structure creates freedom, not constraint. That discipline enables expression, not suppresses it. That the best performances feel effortless precisely because of the invisible work behind them.", zh: "音乐让我明白——结构创造自由，而非束缚；纪律释放表达，而非压制。最好的演奏之所以看似毫不费力，正因背后有着看不见的付出。" },
    p3: { en: "The same principles — restraint, internal logic, timing — are the ones I try to bring to product and writing. Taste is not decoration. It's a frame for thinking.", zh: "同样的原则——克制、内在逻辑、时机——也是我带入产品与写作的东西。品味不是装饰，而是思维的框架。" },
    credentials: [
      { key: "Piano",        name: { en: "Piano",        zh: "钢琴"   }, credential: { en: "Grade 9",      zh: "九级"      }, meta: { en: "National Grading System", zh: "全国等级考试" } },
      { key: "Music Theory", name: { en: "Music Theory", zh: "乐理"   }, credential: { en: "Grade 6",      zh: "六级"      }, meta: { en: "National Grading System", zh: "全国等级考试" } },
      { key: "Guitar",       name: { en: "Guitar",       zh: "吉他"   }, credential: { en: "Acoustic",     zh: "木吉他"    }, meta: { en: "Self-taught, ongoing",    zh: "自学中"      } },
      { key: "Hulusi",       name: { en: "Hulusi",       zh: "葫芦丝" }, credential: { en: "Traditional",  zh: "传统"      }, meta: { en: "Chinese instrument",      zh: "中国乐器"    } },
    ],
  },

  skills: {
    label:    { en: "Capabilities",    zh: "能力图谱"     },
    headline: { en: "How I operate.", zh: "我如何工作。"  },
    tagline:  { en: "The toolset spans strategy, product, data, and design — each in service of clearer thinking.", zh: "横跨战略、产品、数据与设计——一切服务于更清晰的思考。" },
    groups: [
      { symbol: "◈", category: { en: "Strategy & Research",    zh: "战略与研究" }, skills: { en: ["Market Research","Business Analysis","Competitive Analysis","Industry Research","Strategic Reporting","Financial Modeling"], zh: ["市场研究","商业分析","竞争分析","行业研究","战略报告","财务建模"] } },
      { symbol: "◇", category: { en: "Product & AI",           zh: "产品与 AI"  }, skills: { en: ["Product Strategy","AI Workflow Design","Vibe Coding","Prompt Engineering","Information Architecture","User Research"],         zh: ["产品战略","AI 工作流设计","Vibe Coding","提示词工程","信息架构","用户研究"] } },
      { symbol: "◉", category: { en: "Data & Analysis",        zh: "数据与分析" }, skills: { en: ["Python","R","SQL","Stata","Excel (Advanced)","Data Storytelling"],                                                               zh: ["Python","R","SQL","Stata","Excel（高级）","数据叙事"] } },
      { symbol: "◐", category: { en: "Design & Communication", zh: "设计与表达" }, skills: { en: ["UI/UX Thinking","PowerPoint Design","Report Writing","Data Visualization","Prototyping","Cross-cultural Communication"],         zh: ["UI/UX 思维","PPT 设计","报告写作","数据可视化","原型设计","跨文化沟通"] } },
    ],
  },

  philosophy: {
    label:     { en: "How I Think",  zh: "思维方式"     },
    headline:  { en: "How I think.", zh: "我如何思考。"  },
    quote1:    { en: "\"I want to create things that are", zh: "「我想创造" },
    quoteAccent: { en: " useful, elegant,",               zh: "有用、优雅，" },
    quote2:    { en: "and impossible to forget.\"",       zh: "且令人难以忘怀的事物。」" },
    p1: { en: "I believe technology is most powerful when it becomes intuitive enough to disappear — when the tool stops being the thing you use and starts being the thing you think with.", zh: "我相信，技术在足够直觉、能消隐于无形时，才最具力量——当工具不再是你使用的对象，而成为你思考本身的一部分。" },
    p2: { en: "The best work lives at the intersection of logic and taste. It has a point of view. It was made by someone who cared about both the inside and the outside.", zh: "最好的作品存在于逻辑与品味的交汇处。它有自己的立场，由一个对内外同样在意的人创造。" },
    signature: { en: "吴梓洋  ·  Wuziyang Zhang", zh: "张吴梓洋" },
  },

  contact: {
    label:     { en: "Get In Touch",      zh: "联系"         },
    headline1: { en: "If something here", zh: "有所共鸣？"    },
    headline2: { en: "resonated —",       zh: "我在这里——"    },
    headline3: { en: "let's talk.",       zh: "聊聊吧。"      },
    body: { en: "I'm open to internships, full-time roles, research collaborations, and interesting conversations. Whether you're building something, hiring for something, or just exploring — reach out.", zh: "实习、全职、研究合作或是一次有趣的对话——我都保持开放。无论你在构建什么、寻找什么，欢迎联系。" },
    sendEmail: { en: "Send Email",      zh: "发邮件"   },
    linkedin:  { en: "LinkedIn",        zh: "领英"     },
    resume:    { en: "Download Résumé", zh: "下载简历" },
    infoLabels: {
      Email:      { en: "Email",      zh: "邮箱"   },
      Location:   { en: "Location",   zh: "所在地" },
      University: { en: "University", zh: "学校"   },
      Status:     { en: "Status",     zh: "状态"   },
    },
    infoValues: {
      Location:   { en: "Madison, Wisconsin", zh: "麦迪逊 · 威斯康星"   },
      University: { en: "UW–Madison",         zh: "威斯康星大学麦迪逊分校" },
      Status:     { en: "Open to Opportunities", zh: "寻找机会中"        },
    },
  },

  footer: {
    copy:   { en: "Wuziyang Zhang. Designed with intent.", zh: "张吴梓洋 · 以意为形。" },
    email:  { en: "Email",  zh: "邮件" },
    resume: { en: "Résumé", zh: "简历" },
    mono:   { en: "吴梓洋 · WZ", zh: "张吴梓洋 · WZ" },
  },
} as const;

/** Helper: pick the right string for the current lang */
export function tx<T extends { en: string; zh: string }>(entry: T, lang: Lang): string {
  return entry[lang];
}
