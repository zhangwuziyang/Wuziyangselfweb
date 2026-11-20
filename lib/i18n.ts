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
    nameLabel:  { en: "吴梓洋  ·  Wuziyang Zhang", zh: "张吴梓洋" },
    headline1:  { en: "Think in systems.",          zh: "以系统思考。" },
    headline2:  { en: "Build with taste.",          zh: "用品味创造。" },
    sub1:       { en: "Economics & Information Science · Building AI Products —", zh: "经济学与信息科学 · 打造 AI 产品" },
    sub2:       { en: "at the University of Wisconsin–Madison.", zh: "威斯康星大学麦迪逊分校。" },
    cta1:       { en: "View Work",  zh: "查看经历" },
    cta2:       { en: "About Me",   zh: "关于我"   },
    scroll:     { en: "Scroll",     zh: "下滑"     },
  },

  about: {
    label:      { en: "About",    zh: "关于" },
    headline:   { en: "I turn messy\nquestions into\nworking products.", zh: "把理不清的问题，\n做成用得上的\n好产品。" },
    accentWord: { en: "working products.", zh: "好产品。" },
    p1: { en: "I study Economics and Information Science at the University of Wisconsin–Madison, splitting my time between market research, data analysis, and building AI products.", zh: "我在威斯康星大学麦迪逊分校读经济学与信息科学，平时把时间花在市场研究、数据分析和打造 AI 产品上。" },
    p2: { en: "I like starting with a vague question, finding the real structure underneath, and turning it into something people can actually use. How a product feels matters to me just as much as how it works.", zh: "我喜欢从一团模糊的问题入手，理出藏在底层的结构，再把它做成真正能用的东西。一件产品用起来顺不顺手，在我眼里和它背后的逻辑一样重要。" },
    p3: { en: "Along the way, I've worked in consulting and finance, taken AI products from early sketch to live interface, and traveled through 20+ countries to watch how people, markets, and cultures behave up close.", zh: "一路走来，我在咨询公司和金融机构做过项目，独立把 AI 产品从草图做到上线，也走过 20 多个国家，近距离观察不同地方的人、市场与文化究竟如何运转。" },
    p4: { en: "The most interesting ideas usually live in the overlap between fields. That's where I like to work.", zh: "最有意思的想法，往往长在不同领域的交界处。我喜欢待在那里。" },
    tags: {
      en: ["Business Strategy", "AI Products", "Market Research", "Data Analysis", "Vibe Coding", "Global Perspective"],
      zh: ["商业战略", "AI 产品", "市场研究", "数据分析", "Vibe Coding", "全球视野"],
    },
  },

  experience: {
    label:    { en: "Selected Experience", zh: "精选经历"          },
    headline: { en: "Where I've worked.",  zh: "我走过的路。" },
  },

  projects: {
    label:    { en: "Building",     zh: "在建"         },
    headline: { en: "What I make.", zh: "我正在创造。"   },
    tagline:  { en: "The best products feel inevitable in hindsight.\nSimple enough to disappear. Useful enough to stay.", zh: "最好的产品，事后看来皆是必然。" },
  },

  global: {
    label:     { en: "Global Perspective", zh: "全球视野"    },
    headline1: { en: "The world is",       zh: "世界，"  },
    headline2: { en: "my fieldwork.",      zh: "就是我的田野。"  },
    statLabels: {
      Countries:  { en: "Countries",  zh: "个国家" },
      Cities:     { en: "Cities",     zh: "个城市" },
      Continents: { en: "Continents", zh: "个大洲" },
    },
    p1: { en: "I travel to see how people actually make decisions: what they value, what they build, and how they move through daily life. Every city teaches me something a data table can't.", zh: "我出门看世界，想看的是真实的人怎么做选择：他们在意什么、造出什么、日子怎么过。每座城市给我的启发，数据表里都找不到。" },
    p2: { en: "Markets read differently once you've walked through them. User needs sharpen quickly when you're the outsider navigating an unfamiliar city. Seeing the world up close is simply part of how I do the work.", zh: "亲身走过那些市场，书本里的市场规律才会活过来；在陌生城市里当一回外乡用户，许多需求瞬间就清晰了。近距离看世界，早已成了我做研究的方式。" },
    cityPhotos: [
      { city: { en: "New York",  zh: "纽约"    }, note: { en: "Finance",       zh: "金融"  }, src: "/photos/travel-nyc.jpg"       },
      { city: { en: "Istanbul",  zh: "伊斯坦布尔" }, note: { en: "History",    zh: "历史"  }, src: "/photos/travel-istanbul.jpg"  },
      { city: { en: "Toronto",   zh: "多伦多"  }, note: { en: "Architecture",  zh: "建筑"  }, src: "/photos/travel-toronto.jpg"   },
      { city: { en: "Lima",      zh: "利马"    }, note: { en: "Coastal Living", zh: "滨海生活" }, src: "/photos/travel-lima.jpg"      },
    ],
    cityGrid: [
      { city: { en: "Tokyo",     zh: "东京"   }, note: { en: "Product Design", zh: "产品设计" } },
      { city: { en: "Paris",     zh: "巴黎"   }, note: { en: "Aesthetics",     zh: "美学"     } },
      { city: { en: "Chicago",   zh: "芝加哥" }, note: { en: "Urban Design",   zh: "城市设计" } },
      { city: { en: "Singapore", zh: "新加坡" }, note: { en: "Strategy",       zh: "战略"     } },
      { city: { en: "London",    zh: "伦敦"   }, note: { en: "Markets",         zh: "商业市场"     } },
      { city: { en: "Seoul",     zh: "首尔"   }, note: { en: "Culture",        zh: "文化"     } },
      { city: { en: "Berlin",    zh: "柏林"   }, note: { en: "Innovation",     zh: "创新"     } },
      { city: { en: "+ 93 more", zh: "+ 93 座"  }, note: { en: "and counting",   zh: "仍在继续" } },
    ],
  },

  music: {
    label:     { en: "Aesthetic Sensibility", zh: "感性与品味"      },
    headline1: { en: "Music taught me rhythm", zh: "音乐先教会我节奏，"  },
    headline2: { en: "before product",         zh: "后来是产品，"  },
    headline3: { en: "taught me flow.",        zh: "教会我流畅。"  },
    headline3Accent: { en: "taught me flow.", zh: "教会我流畅。" },
    p1: { en: "I've played piano since childhood, reaching National Grade 9 alongside Grade 6 in music theory. Years of practice quietly shaped the way I think.", zh: "我从小练钢琴，考过了全国钢琴九级和乐理六级。这么多年和琴键打交道，悄悄塑成了我思考问题的方式。" },
    p2: { en: "Music showed me that structure is what makes freedom possible, and that discipline gives expression its shape. The performances that look effortless are almost always built on hours of invisible work.", zh: "音乐让我懂得，结构恰恰是自由的底气，克制的训练才能撑起真正的表达。那些听来举重若轻的演奏，背后都是日复一日看不见的功夫。" },
    p3: { en: "Restraint, internal logic, timing: those are the same instincts I bring to product work and writing. Taste isn't surface decoration; it's how you decide what belongs.", zh: "克制、章法、分寸感，这些从音乐里长出来的直觉，也被我带进了产品和写作里。品味从来不是表面的修饰，而是决定什么该留、什么该舍的眼光。" },
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
    tagline:  { en: "My toolkit spans strategy, product, data, and design, all in service of sharper judgment.", zh: "我的工具箱横跨战略、产品、数据与设计，归根结底，都是为了把判断打磨得更准。" },
    groups: [
      { symbol: "◈", category: { en: "Strategy & Research",    zh: "战略与研究" }, skills: { en: ["Market Research","Business Analysis","Competitive Analysis","Industry Research","Strategic Reporting","Financial Modeling"], zh: ["市场研究","商业分析","竞争分析","行业研究","战略报告","财务建模"] } },
      { symbol: "◇", category: { en: "Product & AI",           zh: "产品与 AI"  }, skills: { en: ["Product Strategy","AI Workflow Design","Vibe Coding","Prompt Engineering","Information Architecture","User Research"],         zh: ["产品战略","AI 工作流设计","Vibe Coding","提示词工程","信息架构","用户研究"] } },
      { symbol: "◉", category: { en: "Data & Analysis",        zh: "数据与分析" }, skills: { en: ["Python","R","SQL","Stata","Excel (Advanced)","Data Storytelling"],                                                               zh: ["Python","R","SQL","Stata","Excel（高级）","数据叙事"] } },
      { symbol: "◐", category: { en: "Design & Communication", zh: "设计与表达" }, skills: { en: ["UX & Interface Thinking","Presentation Design","Report Writing","Data Visualization","Prototyping","Cross-Cultural Communication"],         zh: ["UX 与界面思维","演示与汇报设计","报告写作","数据可视化","原型设计","跨文化沟通"] } },
    ],
  },

  philosophy: {
    label:     { en: "Point of View",  zh: "个人视角"     },
    headline:  { en: "How I think.", zh: "我如何思考。"  },
    quote1:    { en: "\"I want to build things that are", zh: "「我想做出" },
    quoteAccent: { en: " useful, elegant,",               zh: "实用、优雅，" },
    quote2:    { en: "and hard to forget.\"",       zh: "又让人念念不忘的作品。」" },
    p1: { en: "The best technology fades into the background. When software is intuitive enough, you stop noticing the tool and start thinking through it.", zh: "最好的技术往往懂得隐身。当软件顺手到让你忘了它的存在，你就不再是在「使用」工具，而是在借着它思考。" },
    p2: { en: "Good work holds rigor and taste in the same hand. It has a clear point of view, and you can feel the care running from the underlying structure all the way to the final detail.", zh: "好作品总能兼顾严谨与品味。它有鲜明的判断，也能让你从底层架构一路感受到末梢细节的用心。" },
    signature: { en: "吴梓洋  ·  Wuziyang Zhang", zh: "张吴梓洋" },
  },

  contact: {
    label:     { en: "Get in Touch",      zh: "保持联系"         },
    headline1: { en: "If something here", zh: "如果这里有哪一处"    },
    headline2: { en: "sparked a thought,",       zh: "正好触动了你，"    },
    headline3: { en: "let's talk.",       zh: "不妨聊聊。"      },
    body: { en: "I'm open to internships, full-time roles, research collaborations, and good conversations. Building a product, hiring for a team, or just curious to compare notes? Say hello.", zh: "实习、全职、研究合作，或是一场投缘的对谈，我都敞开欢迎。无论你正在打磨产品、为团队招人，还是单纯想交换想法，随时打个招呼吧。" },
    sendEmail: { en: "Send Email",      zh: "发邮件"   },
    linkedin:  { en: "LinkedIn",        zh: "LinkedIn"     },
    resume:    { en: "Download Résumé", zh: "下载简历" },
    infoLabels: {
      Email:      { en: "Email",      zh: "邮箱"   },
      Location:   { en: "Location",   zh: "所在地" },
      University: { en: "University", zh: "学校"   },
      Status:     { en: "Status",     zh: "状态"   },
    },
    infoValues: {
      Location:   { en: "Madison, Wisconsin", zh: "威斯康星州麦迪逊"   },
      University: { en: "UW–Madison",         zh: "威斯康星大学麦迪逊分校" },
      Status:     { en: "Open to Opportunities", zh: "期待新机会"        },
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
