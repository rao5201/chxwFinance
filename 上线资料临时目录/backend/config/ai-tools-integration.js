/**
 * 茶海虾王@金融交易所看板平台 - AI工具集成模块
 * 集成WorkBuddy、LobsterAI、ClawHub、白日梦AI等AI工具
 */

const { logger } = require('./logger');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// AI工具配置
const aiToolsConfig = {
  // SkillsBot配置
  skillsbot: {
    enabled: true,
    apiBaseUrl: 'https://www.skillsbot.cn/api',
    categories: [
      '量化金融',
      '爬虫反爬',
      '内容创作',
      '效率工具'
    ],
    localSkillsDir: path.join(__dirname, '..', 'skills'),
    maxSkills: 1000
  },
  
  // LinSkills配置
  linskills: {
    enabled: true,
    apiBaseUrl: 'https://linskills.qiniu.com/api',
    topSkills: [
      { id: 'self-improvement', name: '自我改进代理', downloads: 119400, description: '记录错误和纠正，AI持续自我学习' },
      { id: 'tavily-search', name: 'Tavily网络搜索', downloads: 100600, description: 'AI优化的网络搜索，通过Tavily API' },
      { id: 'find-skills', name: '查找技能', downloads: 97900, description: '帮助用户发现并安装合适的Agent技能' },
      { id: 'gog', name: 'Gog', downloads: 86000, description: 'Gmail/日历/云盘/联系人全套Google Workspace CLI' },
      { id: 'summarize', name: 'Summarize', downloads: 81800, description: '对网页、PDF、图像、音频、YouTube生成摘要' },
      { id: 'smart-browser', name: '智能代理浏览器', downloads: 73300, description: '基于Rust的无头浏览器，AI自动导航/点击/截图' },
      { id: 'github', name: 'Github', downloads: 72000, description: '用gh CLI处理issue、PR、CI运行' },
      { id: 'weather', name: 'Weather', downloads: 61500, description: '获取当前天气和预报（无需API Key）' },
      { id: 'proactive-agent', name: '主动型智能代理', downloads: 59700, description: 'AI从任务执行者转变为主动预见需求的合作伙伴' },
      { id: 'sonoscli', name: 'Sonoscli', downloads: 48000, description: '控制Sonos扬声器（播放/音量/分组）' },
      { id: 'notion', name: 'Notion', downloads: 41400, description: '创建和管理Notion页面、数据库和区块' },
      { id: 'nano-pdf', name: 'Nano Pdf', downloads: 38800, description: '用自然语言指令编辑PDF' },
      { id: 'nano-banana', name: 'Nano Banana Pro', downloads: 35400, description: '用Gemini图像模型生成/编辑图片' },
      { id: 'obsidian', name: 'Obsidian', downloads: 36100, description: '与Obsidian Markdown笔库协作自动化' },
      { id: 'whisper', name: 'Openai Whisper', downloads: 32500, description: '本地语音转文本（无需API Key）' }
    ],
    installationGuide: {
      method1: 'npx命令安装',
      method2: 'Claude Code内置命令',
      method3: '手动安装'
    }
  },
  
  // ClawHub/OpenClaw配置
  clawhub: {
    enabled: true,
    apiBaseUrl: 'https://clawhub.com/api',
    categories: [
      'finance',
      'data-analysis',
      'automation'
    ],
    integrationPath: path.join(__dirname, '..', 'clawhub'),
    latestVersion: '2026.3.31',
    newFeatures: {
      qqBot: {
        enabled: true,
        description: '内置QQ Bot插件，支持多账号、凭证管理、Slash命令、提醒以及媒体消息收发',
        platforms: ['私聊', '群聊', '频道（Guild）', '多媒体消息交互']
      },
      multimodal: {
        enabled: true,
        description: '多模态消息能力，支持发送图片、视频和音频等',
        platforms: ['LINE', 'Telegram', 'Discord', 'Slack', 'QQ']
      },
      taskFlow: {
        enabled: true,
        description: '可视化后台任务流管理，支持查看列表、展示详情、取消任务等'
      },
      cjkOptimization: {
        enabled: true,
        description: 'CJK（中日韩语言）优化，包括更好的上下文理解、更稳定的长期记忆、更自然的语音合成（TTS）'
      }
    },
    supportedPlatforms: [
      'Telegram',
      'Discord',
      'Slack',
      'QQ',
      'LINE',
      'Matrix',
      'WhatsApp',
      'Microsoft Teams'
    ],
    officialUrl: 'https://github.com/openclaw/openclaw'
  },
  
  // WorkBuddy配置
  workbuddy: {
    enabled: true,
    apiBaseUrl: 'https://workbuddy.qq.com/api',
    clientId: 'YOUR_WORKBUDDY_CLIENT_ID',
    clientSecret: 'YOUR_WORKBUDDY_CLIENT_SECRET',
    scope: 'finance_data_analysis,automation'
  },
  
  // LobsterAI配置
  lobsterai: {
    enabled: true,
    apiBaseUrl: 'https://lobsterai.youdao.com/api',
    apiKey: 'YOUR_LOBSTERAI_API_KEY',
    features: [
      'remote_control',
      'data_processing',
      'report_generation'
    ]
  },

  // AI新闻配置
  aiNews: {
    enabled: true,
    name: '人工智能新闻中心',
    description: '保持对人工智能最新消息和发展的了解，聚合全球AI资讯',
    updateFrequency: '实时更新',
    categories: [
      {
        id: 'industry',
        name: '行业动态',
        description: 'AI行业重大事件、公司动态、投融资消息',
        sources: ['TechCrunch', 'The Verge', 'AI科技评论']
      },
      {
        id: 'technology',
        name: '技术突破',
        description: '最新AI技术、算法创新、模型发布',
        sources: ['arXiv', 'Papers With Code', 'Hugging Face']
      },
      {
        id: 'products',
        name: '产品发布',
        description: 'AI新产品、工具更新、功能迭代',
        sources: ['Product Hunt', 'GitHub', '官方博客']
      },
      {
        id: 'policy',
        name: '政策法规',
        description: 'AI相关政策、监管动态、伦理讨论',
        sources: ['政府官网', '监管机构', '法律媒体']
      },
      {
        id: 'applications',
        name: '应用案例',
        description: 'AI在各行业的实际应用案例',
        sources: ['行业报告', '企业案例', '成功故事']
      },
      {
        id: 'research',
        name: '学术研究',
        description: '顶级会议论文、研究成果、学术动态',
        sources: ['NeurIPS', 'ICML', 'CVPR', 'ACL']
      }
    ],
    dataSources: [
      {
        name: 'TechCrunch AI',
        url: 'https://techcrunch.com/category/artificial-intelligence/',
        type: 'rss',
        language: 'en'
      },
      {
        name: 'The Verge AI',
        url: 'https://www.theverge.com/ai-artificial-intelligence',
        type: 'rss',
        language: 'en'
      },
      {
        name: '机器之心',
        url: 'https://www.jiqizhixin.com/',
        type: 'rss',
        language: 'zh'
      },
      {
        name: '量子位',
        url: 'https://www.qbitai.com/',
        type: 'rss',
        language: 'zh'
      },
      {
        name: 'AI科技评论',
        url: 'https://www.leiphone.com/category/ai',
        type: 'rss',
        language: 'zh'
      },
      {
        name: 'arXiv CS.AI',
        url: 'https://arxiv.org/list/cs.AI/recent',
        type: 'rss',
        language: 'en'
      },
      {
        name: 'Hugging Face Blog',
        url: 'https://huggingface.co/blog',
        type: 'rss',
        language: 'en'
      },
      {
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog',
        type: 'rss',
        language: 'en'
      },
      {
        name: 'Google AI Blog',
        url: 'https://ai.googleblog.com/',
        type: 'rss',
        language: 'en'
      },
      {
        name: 'DeepMind Blog',
        url: 'https://deepmind.google/discover/blog/',
        type: 'rss',
        language: 'en'
      }
    ],
    tradingFeatures: {
      enabled: true,
      description: '基于AI新闻的市场情绪和交易信号分析',
      features: [
        '新闻情绪分析 - 分析新闻对市场的影响',
        '热点追踪 - 追踪AI板块热点概念',
        '交易信号 - 基于重大新闻生成交易建议',
        '风险预警 - 识别可能影响市场的负面新闻'
      ],
      supportedMarkets: [
        '美股AI概念股',
        'A股AI板块',
        '港股科技股',
        '加密货币AI项目'
      ]
    },
    display: {
      itemsPerPage: 20,
      summaryLength: 200,
      imageEnabled: true,
      autoRefresh: 300000 // 5分钟
    }
  },

  // 跨平台机器人系统配置
  robotSystem: {
    enabled: true,
    name: '茶海虾王智能机器人系统',
    description: '跨平台、可扩展、高性能的机器人系统，支持实时监控、简单配置和庞大插件生态',
    features: {
      crossPlatform: {
        title: '跨平台支持',
        description: '支持多种平台和协议',
        platforms: [
          'QQ',
          '微信',
          'Discord',
          'Telegram',
          'Slack',
          '钉钉',
          '飞书',
          'WebSocket',
          'HTTP API'
        ]
      },
      realTimeMonitoring: {
        title: '实时监控仪表盘',
        description: '全方位监控机器人运行状态',
        metrics: [
          '在线状态',
          '消息处理速率',
          '响应延迟',
          'CPU/内存使用率',
          '插件加载状态',
          '错误日志',
          '用户活跃度',
          '消息统计图表'
        ]
      },
      easyConfiguration: {
        title: '简单配置',
        description: '丰富的插件配置和简单易懂的操作模式',
        features: [
          '可视化配置界面',
          '一键安装插件',
          '拖拽式工作流',
          '模板市场',
          '配置导入导出',
          '版本管理',
          '环境隔离'
        ]
      },
      pluginEcosystem: {
        title: '庞大插件生态',
        description: '日常娱乐和实用功能一应俱全',
        categories: [
          {
            name: '金融交易',
            plugins: ['股票查询', 'K线图', '价格预警', '自动交易', '投资组合管理']
          },
          {
            name: '日常娱乐',
            plugins: ['音乐播放', '游戏对战', '笑话段子', '星座运势', '抽奖活动']
          },
          {
            name: '实用工具',
            plugins: ['天气查询', '翻译', '计算器', '日程提醒', '待办事项']
          },
          {
            name: 'AI功能',
            plugins: ['ChatGPT对话', '图片生成', '语音识别', '文本总结', '代码辅助']
          },
          {
            name: '群管理',
            plugins: ['入群欢迎', '自动审核', '敏感词过滤', '数据统计', '定时消息']
          }
        ]
      },
      database: {
        title: '高性能数据库',
        description: '多驱动、高性能的数据库支持百万量级数据处理',
        drivers: [
          {
            name: 'MongoDB',
            useCase: '文档存储，用户数据，聊天记录',
            performance: '支持百万级并发'
          },
          {
            name: 'Redis',
            useCase: '缓存，会话管理，实时数据',
            performance: '毫秒级响应'
          },
          {
            name: 'MySQL',
            useCase: '关系型数据，交易记录，配置存储',
            performance: 'ACID事务支持'
          },
          {
            name: 'PostgreSQL',
            useCase: '复杂查询，数据分析，地理信息',
            performance: '高级索引支持'
          }
        ],
        capabilities: [
          '百万级数据存储',
          '秒级数据查询',
          '自动数据分片',
          '主从复制',
          '数据备份恢复',
          '性能监控'
        ]
      }
    },
    architecture: {
      type: '微服务架构',
      components: [
        {
          name: 'Gateway',
          description: '统一入口，负载均衡，限流熔断'
        },
        {
          name: 'Core Engine',
          description: '消息路由，插件调度，事件处理'
        },
        {
          name: 'Plugin Manager',
          description: '插件生命周期管理，依赖注入，热更新'
        },
        {
          name: 'Database Layer',
          description: '数据访问层，ORM，连接池'
        },
        {
          name: 'Monitoring',
          description: '指标采集，日志聚合，告警通知'
        }
      ]
    },
    performance: {
      messageThroughput: '10,000+ msg/s',
      responseTime: '< 50ms',
      concurrentUsers: '100,000+',
      uptime: '99.9%'
    },
    developerExperience: {
      typescript: {
        enabled: true,
        description: '完全基于TypeScript开发，拥有顶级的类型支持',
        features: [
          '完整的类型定义',
          '智能代码提示',
          '编译时类型检查',
          'IDE自动补全',
          '重构支持'
        ]
      },
      hotReload: {
        enabled: true,
        description: '插件热重载，保存即可生效，无需重启机器人',
        features: [
          '文件监听自动重载',
          '状态保持',
          '错误恢复',
          '增量更新'
        ]
      },
      sandbox: {
        enabled: true,
        description: '沙盒环境预览，模拟聊天和交易场景',
        features: [
          '虚拟消息模拟',
          '交易回测',
          '场景测试',
          '实时预览'
        ]
      },
      documentation: {
        description: '从新人起步到插件开发的完整文档',
        sections: [
          '快速开始',
          '基础概念',
          'API参考',
          '插件开发',
          '最佳实践',
          '示例代码'
        ]
      }
    }
  },

  // AI金融K线图配置
  aiTradingChart: {
    enabled: true,
    name: 'AI金融即时K线图',
    description: '集成AI分析的金融实时K线图，支持多时间周期和技术指标',
    features: [
      '实时数据推送 - WebSocket连接，毫秒级更新',
      '多时间周期 - 1分钟到月线，支持自定义',
      '技术指标 - MA、MACD、RSI、布林带等20+指标',
      'AI预测 - 基于机器学习的趋势预测',
      '交易信号 - AI生成的买入/卖出信号',
      '画线工具 - 支持趋势线、斐波那契等',
      '多图表布局 - 支持多品种同时监控',
      '历史回放 - 历史数据回放功能',
      '预警系统 - 价格、指标、形态预警'
    ],
    supportedMarkets: [
      'A股 - 沪深股市实时数据',
      '港股 - 香港交易所',
      '美股 - 纳斯达克、纽交所',
      '加密货币 - BTC、ETH等主流币种',
      '外汇 - 主要货币对',
      '期货 - 商品期货、股指期货'
    ],
    aiFeatures: {
      trendPrediction: {
        description: '基于深度学习的价格趋势预测',
        accuracy: '75%+',
        timeframes: ['短期(1-5天)', '中期(1-4周)', '长期(1-6月)']
      },
      patternRecognition: {
        description: '自动识别K线形态和技术形态',
        patterns: ['头肩顶/底', '双顶/底', '三角形', '旗形', '楔形']
      },
      sentimentAnalysis: {
        description: '结合新闻情绪分析市场 sentiment',
        sources: ['财经新闻', '社交媒体', '分析师报告']
      },
      riskManagement: {
        description: 'AI辅助风险评估和仓位管理',
        features: ['止损建议', '仓位优化', '波动率预测']
      }
    },
    technicalIndicators: [
      { name: 'MA', description: '移动平均线', params: ['周期'] },
      { name: 'MACD', description: '指数平滑异同平均线', params: ['快周期', '慢周期', '信号周期'] },
      { name: 'RSI', description: '相对强弱指标', params: ['周期'] },
      { name: 'BOLL', description: '布林带', params: ['周期', '标准差'] },
      { name: 'KDJ', description: '随机指标', params: ['K周期', 'D周期'] },
      { name: 'CCI', description: '商品通道指数', params: ['周期'] },
      { name: 'WR', description: '威廉指标', params: ['周期'] },
      { name: 'DMI', description: '趋向指标', params: ['周期'] },
      { name: 'OBV', description: '能量潮', params: [] },
      { name: 'Volume', description: '成交量', params: [] }
    ],
    dataProviders: [
      { name: '东方财富', markets: ['A股'], type: '免费/付费' },
      { name: '同花顺', markets: ['A股', '港股'], type: '付费' },
      { name: 'Yahoo Finance', markets: ['美股', '加密货币'], type: '免费' },
      { name: 'Alpha Vantage', markets: ['美股', '外汇'], type: 'API' },
      { name: 'Binance', markets: ['加密货币'], type: '免费API' }
    ],
    uiConfig: {
      theme: 'dark',
      chartType: 'candlestick',
      defaultTimeframe: '1D',
      showVolume: true,
      showGrid: true,
      autoScale: true,
      syncCrosshair: true
    }
  },

  // 白日梦AI配置
  daydream: {
    enabled: true,
    apiBaseUrl: 'https://daydream.ai/api',
    apiKey: 'YOUR_DAYDREAM_API_KEY',
    videoFormats: [
      '1080p',
      '720p',
      '480p'
    ],
    maxDuration: 360 // 6分钟
  },
  
  // OfoxAI配置 - 中国Agent + 世界模型
  ofox: {
    enabled: true,
    apiBaseUrl: 'https://api.ofox.ai',
    apiKey: 'YOUR_OFOX_API_KEY',
    tagline: '中国Agent + 世界模型',
    description: '多云主干道直连，低延迟，数据留在国内，PIPL合规',
    endpoints: {
      openai: 'https://api.ofox.ai/v1',
      anthropic: 'https://api.ofox.ai/anthropic',
      gemini: 'https://api.ofox.ai/gemini'
    },
    models: {
      claude: {
        sonnet: 'anthropic/claude-sonnet-4.6',
        opus: 'anthropic/claude-opus-4.6'
      },
      gpt: {
        mini: 'openai/gpt-4o-mini',
        gpt4: 'openai/gpt-4o',
        gpt53: 'openai/gpt-5.3-codex',
        gpt54: 'openai/gpt-5.4'
      },
      gemini: {
        flash: 'google/gemini-3.1-flash-lite-preview',
        pro: 'google/gemini-3.1-pro'
      },
      grok: 'xai/grok-2',
      deepseek: {
        chat: 'deepseek/deepseek-chat',
        v32: 'deepseek/deepseek-v3.2'
      },
      qwen: 'qwen/qwen-2.5-72b-instruct',
      glm: 'z.ai/glm-4',
      kimi: 'moonshot/kimi-k2',
      doubao: 'volcengine/doubao-1.5-pro',
      minimax: 'minimax/minimax-advanced'
    },
    manufacturers: [
      'OpenAI',
      'Anthropic',
      'Google',
      'X.AI (Grok)',
      'Qwen',
      'Doubao',
      'MiniMax',
      'Z.ai (GLM)'
    ],
    popularModels: [
      'GPT-5.4',
      'Claude Opus 4.6',
      'Gemini 3.1 Pro',
      'Claude Sonnet 4.6',
      'DeepSeek V3.2',
      'GPT-5.3 Codex',
      'Grok-2'
    ],
    chinaOptimization: {
      network: {
        description: '香港专线打通阿里云/火山云/华为云/腾讯云',
        features: ['多云主干道直连', '低延迟', '99.9% SLA']
      },
      dataCompliance: {
        description: '数据留在国内，PIPL合规',
        features: ['数据本地化', '国内节点不出境', '内容审核', '私有部署支持']
      },
      nativeEcosystem: {
        description: '本土生态原生支持',
        office: ['飞书', '钉钉', '企微', 'WPS'],
        media: ['公众号', '小红书', '抖音', '视频号'],
        knowledge: ['飞书文档', '钉钉文档', '语雀', 'Notion', '石墨'],
        dataApi: ['高德', '百度地图', '聚合数据', '和风天气']
      }
    },
    pricing: {
      model: '按量付费，用多少付多少',
      free: '免费起步，按需扩展',
      features: ['零起步成本', '无月费或年费', '所有模型解锁']
    },
    codeExample: {
      python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.ofox.ai/v1",
    api_key="<OFOXAI_API_KEY>"
)`
    }
  },
  
  // 集成设置
  integration: {
    autoUpdate: true,
    updateInterval: 24 * 60 * 60 * 1000, // 24小时
    cacheExpiry: 24 * 60 * 60 * 1000, // 24小时
    maxCacheSize: 1000
  },
  
  // 开放平台接入配置
  openPlatform: {
    enabled: true,
    steps: [
      {
        step: 1,
        title: '创建应用',
        description: '创建应用，设置应用基本信息。创建成功后，获取并保存应用APPID 和 APPKEY。',
        details: '在开放平台控制台创建新应用，填写应用名称、描述、图标等基本信息'
      },
      {
        step: 2,
        title: '配置参数',
        description: '根据应用对接需求，在开发者后台设置对接能力所需配置项，如用户授权登录的回调地址等。',
        details: '配置API密钥、回调地址、权限范围等参数'
      },
      {
        step: 3,
        title: '对接能力',
        description: '应用根据文档指引开发对接服务端 API、客户端 JSAPI、SDK、业务组件等不同形式的能力。',
        details: '根据开放平台文档实现API调用、授权流程等功能'
      },
      {
        step: 4,
        title: '发布应用',
        description: '开发者可在自建的业务系统内挂载应用相关服务，将应用发布到工作台，企业可安装使用。',
        details: '完成应用测试后，提交审核并发布到开放平台'
      }
    ],
    supportedPlatforms: [
      '腾讯云开放平台',
      '阿里云开放平台',
      '百度智能云开放平台',
      '华为云开放平台',
      '七牛云开放平台'
    ]
  },
  
  // IDE AI工具配置
  ideTools: {
    enabled: true,
    tools: [
      {
        id: 'trae-ai',
        name: 'TRAE AI IDE',
        description: '致力于成为真正的AI工程师（The Real AI Engineer），以智能生产力为核心，无缝融入开发流程，支持100多种编程语言和MCP Servers',
        platforms: ['Windows', 'macOS', 'Linux'],
        features: [
          '智能生产力',
          '100+编程语言支持',
          'MCP Servers支持',
          '无缝协作',
          '高质量代码生成',
          '智能体自动调用工具'
        ],
        supportedLanguages: [
          'Python', 'Go', 'JavaScript', 'HTML/CSS', 'TypeScript',
          'C++', 'Java', 'Kotlin', 'C', 'Rust', '...'
        ],
        installationGuide: '访问官网下载安装，支持Windows、macOS和Linux',
        officialUrl: 'https://trae.ai'
      },
      {
        id: 'idea-ai',
        name: 'IntelliJ IDEA 2026.1 AI',
        description: 'IDEA 2026.1内置的AI功能，Next Edit Suggestions免费无限用',
        platforms: ['IntelliJ IDEA 2026.1+'],
        features: [
          'Next Edit Suggestions',
          '智能跨文件修改',
          'Tab Tab流畅体验',
          '全文件感知'
        ],
        installationGuide: '升级到IntelliJ IDEA 2026.1或更高版本',
        officialUrl: 'https://www.jetbrains.com/idea/'
      },
      {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        description: '最主流的AI编程插件，市场份额约35%，GitHub深度集成，生态系统成熟',
        platforms: ['VS Code', 'IntelliJ IDEA', 'PyCharm', 'WebStorm', 'Visual Studio', 'Vim/Neovim'],
        features: [
          '代码补全',
          '代码生成',
          '聊天对话',
          '单元测试',
          '代码解释',
          'GitHub深度集成',
          '学生免费'
        ],
        marketShare: '35%',
        pricing: {
          free: '学生免费',
          personal: '$10/月',
          enterprise: '$19/用户/月'
        },
        performance: {
          responseTime: '80ms',
          accuracy: '75%',
          acceptanceRate: '68%'
        },
        pros: [
          'GitHub深度集成',
          '生态系统成熟',
          '企业功能完善',
          '学生免费',
          '支持IDE最多'
        ],
        cons: [
          '项目上下文理解有限',
          '无法批量重构',
          '自定义能力弱'
        ],
        installationGuide: '在IDE插件市场搜索"GitHub Copilot"安装',
        officialUrl: 'https://github.com/features/copilot'
      },
      {
        id: 'cline',
        name: 'Cline',
        description: 'VS Code上最流行的AI编程插件之一（原名Claude Dev），免费开源，支持自主编辑文件、运行终端命令',
        platforms: ['VS Code'],
        features: [
          '自主编辑文件',
          '运行终端命令',
          '多步骤推理',
          'Tool Use工具调用',
          '支持多种模型'
        ],
        installationGuide: '在VS Code扩展市场搜索"Cline"安装，配置API Key后使用',
        configuration: {
          openaiCompatible: {
            baseUrl: 'https://api.ofox.ai/v1',
            model: 'anthropic/claude-sonnet-4.6'
          },
          anthropicProvider: {
            baseUrl: 'https://api.ofox.ai/anthropic',
            model: 'anthropic/claude-sonnet-4.6'
          }
        },
        officialUrl: 'https://api.ofox.ai'
      },
      {
        id: 'startai',
        name: 'StartAI',
        description: 'Photoshop AI图像处理插件，用AI赋能高效创作，告别繁琐操作，AI帮你把想法变成现实',
        platforms: ['Photoshop'],
        features: [
          '产品精修',
          '店铺装修',
          '一键抠图',
          'AI图片生成',
          '万物迁移',
          '高级修图'
        ],
        installationGuide: '访问官网下载安装包，按照教程安装到Photoshop中',
        officialUrl: 'https://istarry.com.cn/index.html'
      },
      {
        id: 'qianlu-ai',
        name: '千鹿AI',
        description: 'AI设计助手，提供智能设计和创作工具',
        platforms: ['Photoshop', 'Premiere Pro'],
        features: [
          '千鹿Pr助手',
          '千鹿设计助手',
          '智能设计',
          '视频编辑辅助'
        ],
        installationGuide: '访问千鹿AI官网下载安装',
        officialUrl: 'https://qianlu.ai'
      },
      {
        id: 'psaide',
        name: 'PsAide',
        description: 'Photoshop AI辅助工具，提供智能抠图、去水印等功能',
        platforms: ['Photoshop'],
        features: [
          '智能抠图',
          '去水印',
          '快速编辑',
          '批量处理'
        ],
        installationGuide: '在Photoshop插件市场搜索安装',
        officialUrl: 'https://psaide.com'
      },
      {
        id: 'aide-art',
        name: 'Aide.art',
        description: 'AI艺术创作平台，提供专题广场和创意工具',
        platforms: ['Web', 'Photoshop'],
        features: [
          '专题广场',
          'AI艺术生成',
          '创意工具',
          '社区分享'
        ],
        installationGuide: '访问官网注册使用',
        officialUrl: 'https://aide.art'
      },
      {
        id: 'nano-banana',
        name: 'Nano Banana Pro',
        description: '用Gemini图像模型生成/编辑图片的工具',
        platforms: ['Multi-platform'],
        features: [
          '图像生成',
          '图像编辑',
          'Gemini模型',
          '多平台支持'
        ],
        installationGuide: '按照官方教程安装',
        officialUrl: 'https://nanobanana.ai'
      },
      {
        id: 'gpt-chinese',
        name: 'GPT中文版',
        description: '国内团队制作的GPT插件，功能丰富，可以直接对着代码右键操作',
        platforms: ['IntelliJ IDEA', 'PyCharm'],
        features: [
          '代码分析',
          '代码生成',
          '代码优化',
          '智能问答'
        ],
        installationGuide: '在IDE插件市场搜索"GPT中文版"安装',
        officialUrl: 'http://www.lryc.cn/news/451146.html'
      },
      {
        id: 'talkx',
        name: 'TalkX',
        description: '纯免费的GPT插件，无需登录注册，功能简洁',
        platforms: ['IntelliJ IDEA', 'PyCharm'],
        features: [
          '基础GPT功能',
          '免费使用',
          '无需注册'
        ],
        installationGuide: '在IDE插件市场搜索"TalkX"安装',
        officialUrl: 'http://www.lryc.cn/news/451146.html'
      },
      {
        id: 'bito-ai',
        name: 'Bito AI',
        description: '免费的AI编程助手，需要注册，功能介于GPT中文版和TalkX之间',
        platforms: ['IntelliJ IDEA', 'PyCharm', 'VS Code'],
        features: [
          '代码生成',
          '代码解释',
          '智能问答',
          '免费使用'
        ],
        installationGuide: '在IDE插件市场搜索"Bito AI"安装并注册',
        officialUrl: 'http://www.lryc.cn/news/451146.html'
      },
      {
        id: 'codex-plugin-cc',
        name: 'OpenAI Codex Plugin for Claude Code',
        description: 'OpenAI发布的Claude Code插件，实现跨模型协作，让Claude Code用户能够直接调用OpenAI Codex的能力',
        platforms: ['Claude Code'],
        features: [
          '代码审查',
          '任务委托',
          '跨模型协作',
          '/codex:review命令',
          '/codex:adversarial-review命令',
          '/codex:rescue命令',
          '后台任务管理'
        ],
        commands: [
          '/codex:review - 正常代码审查',
          '/codex:adversarial-review - 挑战性审查',
          '/codex:rescue - 任务委托',
          '/codex:status - 查看任务状态',
          '/codex:result - 查看任务结果',
          '/codex:cancel - 取消任务',
          '/codex:setup - 环境配置'
        ],
        requirements: [
          'ChatGPT订阅或OpenAI API密钥',
          'Node.js 18.18或更高版本',
          'Codex CLI安装'
        ],
        installationGuide: '在Claude Code中添加插件市场：/plugin marketplace add openai/codex-plugin-cc，然后安装：/plugin install codex@openai-codex',
        officialUrl: 'https://github.com/openai/codex-plugin-cc'
      },
      {
        id: 'claude-code',
        name: 'Claude Code',
        description: 'Anthropic出品的终端AI编程助手，51万行TypeScript代码构建的复杂多层架构系统，支持理解和操作本地代码库',
        platforms: ['Terminal', 'Command Line', 'VS Code', 'JetBrains IDE'],
        version: '2.1.88',
        codebaseStats: {
          files: '~1,900个文件',
          linesOfCode: '512,000+行',
          language: 'TypeScript (strict)',
          runtime: 'Bun',
          uiFramework: 'React + Ink (终端UI)'
        },
        architecture: {
          coreSystems: {
            toolSystem: {
              description: '40+内置工具实现，一切能力的基石',
              tools: [
                'FileReadTool - 读取文件（支持图片、PDF、Notebook）',
                'FileWriteTool - 创建/覆写文件',
                'FileEditTool - 局部文件修改',
                'GlobTool - 文件模式匹配搜索',
                'GrepTool - 基于ripgrep的内容搜索',
                'BashTool - Shell命令执行',
                'PowerShellTool - Windows PowerShell执行',
                'WebFetchTool - URL内容抓取',
                'WebSearchTool - 网页搜索',
                'AgentTool - 子Agent生成',
                'MCPTool - MCP服务器工具调用',
                'LSPTool - 语言服务器协议集成'
              ]
            },
            commandSystem: {
              description: '50+斜杠命令，涵盖开发工作流',
              commands: [
                '/commit - Git提交',
                '/diff - 查看变更',
                '/review - 代码审查',
                '/compact - 上下文压缩',
                '/config - 设置管理',
                '/mcp - MCP服务器管理',
                '/memory - 持久化记忆管理',
                '/skills - 技能管理',
                '/vim - Vim模式切换',
                '/doctor - 环境诊断',
                '/cost - 使用费用查看'
              ]
            },
            queryEngine: {
              description: '对话引擎核心，约46,000行代码',
              features: [
                '流式响应处理',
                '工具调用循环',
                'Thinking模式（Extended Thinking）',
                '重试逻辑',
                'Token计数'
              ]
            },
            permissionSystem: {
              description: '多层权限模型，安全的守门人',
              modes: ['default', 'plan', 'auto', 'bypassPermissions']
            },
            bridgeSystem: {
              description: 'IDE集成的桥梁，实现"一个引擎，多个前端"',
              features: ['VS Code集成', 'JetBrains集成', '会话共享', '上下文共享']
            },
            agentCoordination: {
              description: '多Agent协调系统，从单Agent到多Agent',
              features: ['AgentTool', 'SendMessageTool', 'TeamCreateTool', 'Swarm模式']
            }
          },
          services: {
            api: 'Anthropic API客户端',
            mcp: 'Model Context Protocol服务器连接管理',
            oauth: 'OAuth 2.0认证流程',
            lsp: 'Language Server Protocol管理器',
            analytics: 'GrowthBook特性标志与分析',
            plugins: '插件加载器',
            compact: '对话上下文压缩',
            extractMemories: '自动记忆提取',
            teamMemorySync: '团队记忆同步'
          },
          uiComponents: {
            description: '144个React/Ink UI组件',
            keyComponents: [
              'App.tsx - 应用根组件',
              'CoordinatorAgentStatus.tsx - 多Agent状态展示',
              'ContextVisualization.tsx - 上下文可视化',
              'ContextSuggestions.tsx - 上下文建议',
              'DiagnosticsDisplay.tsx - 诊断信息展示',
              'AutoUpdater.tsx - 自动更新',
              'ConsoleOAuthFlow.tsx - OAuth认证流程',
              'DevBar.tsx - 开发者工具栏'
            ],
            reactHooks: {
              count: '80+自定义Hooks',
              examples: [
                'useVimInput.ts - Vim模式输入处理',
                'useVoice.ts / useVoiceIntegration.tsx - 语音输入集成',
                'useSwarmInitialization.ts - Swarm模式初始化',
                'useScheduledTasks.ts - 定时任务调度',
                'useMemoryUsage.ts - 内存使用监控',
                'useTerminalSize.ts - 终端尺寸自适应',
                'useVirtualScroll.ts - 虚拟滚动（性能优化）'
              ]
            }
          },
          techStack: {
            runtime: {
              name: 'Bun',
              reasons: [
                '极快的启动速度',
                '原生TypeScript支持',
                'Bundle特性标志（bun:bundle的feature()机制）',
                '编译时死代码消除'
              ]
            },
            language: {
              name: 'TypeScript (strict)',
              reason: '类型安全，512K行代码必须强类型'
            },
            terminalUI: {
              name: 'React + Ink',
              reasons: [
                '声明式UI',
                '组件复用',
                '开发效率高',
                'Bridge复用（同一套组件逻辑可在IDE中复用）'
              ]
            },
            cliParser: {
              name: 'Commander.js',
              reason: '成熟的CLI参数解析框架'
            },
            schemaValidation: {
              name: 'Zod v4',
              reason: '运行时类型校验 + TypeScript类型推断'
            },
            codeSearch: {
              name: 'ripgrep',
              reason: '极快的代码搜索引擎'
            },
            protocols: {
              name: 'MCP SDK + LSP',
              reason: '标准化的工具/语言服务器协议'
            },
            api: {
              name: 'Anthropic SDK',
              reason: '官方SDK'
            },
            telemetry: {
              name: 'OpenTelemetry + gRPC',
              reason: '标准化可观测性'
            },
            featureFlags: {
              name: 'GrowthBook',
              reason: 'A/B测试与灰度发布'
            },
            authentication: {
              name: 'OAuth 2.0 + JWT + macOS Keychain',
              reason: '多层认证体系'
            }
          },
          startupOptimization: {
            parallelPrefetch: [
              'MDM设置读取',
              'Keychain访问',
              'API预连接',
              'GrowthBook初始化'
            ],
            lazyLoading: [
              'OpenTelemetry (~400KB)',
              'gRPC (~700KB)'
            ],
            earlyInit: [
              'startMdmRawRead() - 预读MDM设置',
              'startKeychainPrefetch() - 预取Keychain凭据'
            ]
          },
          interestingFinds: {
            buddySystem: {
              name: 'Buddy系统（彩蛋）',
              description: 'src/buddy/目录——一个"伴侣精灵"系统'
            },
            autoDream: {
              name: 'autoDream服务',
              description: 'src/services/autoDream/——"自动梦境"？可能与Claude的后台思考或记忆整理相关'
            },
            hiddenCommands: [
              'good-claude - 给Claude正向反馈',
              'bughunter - 自动化Bug猎手',
              'chrome - Chrome浏览器集成',
              'btw - 顺便说一下（?）',
              'ant-trace - Anthropic内部追踪',
              'mock-limits - 模拟速率限制（测试用）',
              'heapdump - 堆内存快照'
            ],
            featureFlags: [
              'PROACTIVE',
              'KAIROS（希腊语"恰当的时机"——可能是某个与时间相关的高级Agent调度功能）',
              'BRIDGE_MODE',
              'DAEMON',
              'VOICE_MODE',
              'AGENT_TRIGGERS',
              'MONITOR_TOOL'
            ]
          },
          architecturePhilosophy: {
            toolsAsCapabilities: 'LLM的所有交互能力都通过标准化的Tool接口暴露，每个工具都是自描述的（Schema + 权限 + 执行逻辑）',
            agentFirstClass: 'Agent是架构层面支持的核心概念，子Agent生成、Agent间通信、团队协作都有专门的工具和服务支撑',
            declarativeOverImperative: '从React/Ink的UI渲染到Zod Schema的类型校验，再到工具定义的声明式接口，整个项目都倾向于声明式编程范式',
            performanceByDesign: 'Bun运行时、并行预取、懒加载、编译时死代码消除——这些优化从技术选型阶段就考虑在内'
          }
        },
        features: [
          '本地代码库理解',
          '基本编码任务',
          '复杂代码逻辑解释',
          'Git工作流程处理',
          '终端运行',
          '多平台支持',
          '40+内置工具',
          '50+斜杠命令',
          '多Agent协调',
          'IDE桥接',
          '持久化记忆系统',
          '权限管理',
          '插件系统',
          '技能系统'
        ],
        sourceCodeLeak: {
          date: '2026-03-31',
          discoverer: 'Chaofan Shou (@Fried_rice)',
          cause: 'npm包中的.map文件暴露了完整TypeScript源码',
          repository: 'instructkr/claude-code',
          impact: '近600 Stars和900+ Forks'
        },
        installationGuide: '通过npm安装：npm install -g @anthropic-ai/claude-code',
        officialUrl: 'https://gitee.com/mirrors/Claude-Code'
      },
      {
        id: 'cursor',
        name: 'Cursor',
        description: 'AI原生编辑器（基于VS Code深度改造），市场份额约20%，支持直接对话改代码、批量重构、项目级分析',
        platforms: ['Windows', 'macOS', 'Linux'],
        features: [
          'AI原生编辑器',
          '对话改代码',
          '批量重构',
          '项目级分析',
          '多文件修改',
          '深度项目理解',
          '自定义规则系统',
          '多模型支持'
        ],
        marketShare: '20%',
        pricing: {
          free: 'Hobby版（有限）',
          pro: '$20/月',
          enterprise: '联系销售',
          education: '教育优惠免费（Pro版）'
        },
        educationDiscount: {
          title: '0成本薅Cursor Pro教育优惠',
          description: '全流程免费教程，秒过，不需要任何证件',
          requirements: [
            'EDU邮箱（教育邮箱）',
            '中国科技云通行证账号'
          ],
          steps: [
            {
              step: 1,
              title: '注册Cursor账号',
              description: '使用EDU邮箱注册Cursor账号（一定要edu邮箱）',
              url: 'https://cursor.com'
            },
            {
              step: 2,
              title: '注册中国科技云',
              description: '使用相同的EDU邮箱注册中国科技云通行证',
              url: 'https://passport.escience.cn',
              note: '邮箱必须与注册Cursor的邮箱一模一样'
            },
            {
              step: 3,
              title: '访问教育优惠页面',
              description: '访问 Cursor for Students 页面',
              url: 'https://cursor.com/students'
            },
            {
              step: 4,
              title: '修改地区设置',
              description: '按F12打开开发者工具，修改Country值为China，使用JS代码代理fetch请求搜索国内大学',
              code: `const originalFetch = window.fetch;
window.fetch = new Proxy(originalFetch, {
  apply: function(target, thisArg, argumentsList) {
    let [input, init] = argumentsList;
    let url = typeof input === 'string' ? input : input.url;
    let method = (init && init.method) || (typeof input === 'object' && input.method) || 'GET';
    if (method.toUpperCase() === 'GET' && url.startsWith('https://orgsearch.sheerid.net/rest/organization/search')) {
      let urlObj = new URL(url);
      urlObj.searchParams.set('country', 'CN');
      url = urlObj.toString();
      if (typeof input === 'object') {
        input = new Request(url, input);
      } else {
        input = url;
      }
    }
    return target.apply(thisArg, [input, init]);
  }
});`
            },
            {
              step: 5,
              title: '邮箱验证',
              description: '在EDU邮箱中查收验证邮件，点击按钮进入认证页面'
            },
            {
              step: 6,
              title: '完成认证',
              description: '点击"Sign into"，自动跳转到科技云页面，登录科技云账号完成认证'
            },
            {
              step: 7,
              title: '领取Pro版',
              description: '绑定支付方式（银行卡/支付宝），完成领取Cursor Pro教育版'
            }
          ],
          importantNotes: [
            '注册Cursor用的EDU邮箱，一定要和注册科技云的EDU邮箱一模一样',
            '秒过审核，不需要任何证件',
            '持续更新教程，确保有效性'
          ],
          updateDate: '2026-05-08'
        },
        performance: {
          responseTime: '150ms',
          accuracy: '82%',
          acceptanceRate: '78%'
        },
        pros: [
          '深度项目理解',
          '强大的重构能力',
          '内置聊天和调试',
          '自定义规则系统',
          '多模型支持',
          '教育优惠免费使用Pro版'
        ],
        cons: [
          '必须切换编辑器',
          '价格较高（无教育优惠时）',
          '扩展兼容性',
          '企业功能发展中'
        ],
        installationGuide: '访问官网下载客户端安装，EDU邮箱用户可申请教育优惠免费使用Pro版',
        officialUrl: 'https://cursor.com/download',
        educationUrl: 'https://cursor.com/students'
      },
      {
        id: 'tongyi-lingma',
        name: '通义灵码',
        description: '阿里出品的AI编码助手，中文优化最好，国产全栈适配强，文档/注释中文友好',
        platforms: ['VS Code', 'JetBrains IDE'],
        features: [
          '中文优化',
          '国产框架适配',
          '阿里云生态',
          '电商业务支持',
          '文档注释友好',
          '个人永久免费'
        ],
        pricing: {
          free: '个人版永久免费',
          enterprise: '79元/人/月起'
        },
        installationGuide: 'VS Code插件市场搜索"通义灵码"安装',
        officialUrl: 'https://lingma.aliyun.com'
      },
      {
        id: 'wenxin-kuaima',
        name: '文心快码（Comate）',
        description: '百度出品的AI编码助手，中文场景、国产框架适配优秀，新手友好',
        platforms: ['VS Code', 'JetBrains IDE'],
        features: [
          '中文场景优化',
          '国产框架适配',
          '教学学习友好',
          '小程序支持',
          '前端转码',
          '个人永久免费'
        ],
        pricing: {
          free: '个人版永久免费',
          enterprise: '59元起'
        },
        installationGuide: 'IDE插件市场搜索"Baidu Comate"安装',
        officialUrl: 'https://comate.baidu.com'
      },
      {
        id: 'aws-codewhisperer',
        name: 'AWS CodeWhisperer',
        description: '亚马逊出品的AI编码助手，个人永久免费，支持安全扫描、代码溯源',
        platforms: ['VS Code', 'JetBrains IDE'],
        features: [
          '个人永久免费',
          '安全扫描',
          '代码溯源',
          'AWS云原生',
          'Python/Java/JS支持',
          '主流语言覆盖'
        ],
        pricing: {
          free: '个人永久免费',
          enterprise: '$19/月'
        },
        installationGuide: '安装AWS Toolkit插件',
        officialUrl: 'https://aws.amazon.com/cn/codewhisperer/'
      },
      {
        id: 'v0-dev',
        name: 'v0.dev',
        description: 'Vercel出品的前端AI工具，输入文字生成React/Vue前端页面，直接导出代码',
        platforms: ['Web'],
        features: [
          '文字生成页面',
          'React/Vue支持',
          'UI组件生成',
          '表单生成',
          '仪表盘生成',
          '代码导出'
        ],
        installationGuide: '访问官网注册使用',
        officialUrl: 'https://v0.dev'
      },
      {
        id: 'ries-ai',
        name: 'Ries.AI',
        description: '不止于翻译的语言助手，让你在WhatsApp/Slack/Gmail等平台的每条消息都专业得体。支持中英混打、中式英语检测、意图翻译',
        platforms: ['Chrome', 'Edge', 'Firefox'],
        features: [
          '中英混打 - 直接中英夹杂输入，自动转为地道英文',
          '中式英语检测 - 实时检测不地道表达，一键优化',
          '意图翻译 - 理解意图而非逐字翻译',
          '多语言支持 - 英日法韩西等语言',
          '输入框原生操作 - 无需切屏',
          '双语对照显示 - 对方消息自动翻译',
          '网页翻译 - 流畅对照阅读',
          '视频双语字幕 - 实时生成'
        ],
        useCases: [
          '出海创业者 - 与海外客户沟通',
          '全英文团队 - Slack/Teams日常沟通',
          '外贸/跨境电商 - 客户邮件询盘',
          '英语学习者 - 从看懂到会表达',
          '多语言用户 - 日语韩语法语等',
          '跨国团队协作',
          '国际化项目管理'
        ],
        supportedPlatforms: [
          'WhatsApp Web',
          'Slack',
          'Gmail',
          'Microsoft Teams',
          'LinkedIn',
          'Outlook',
          '阿里国际站'
        ],
        coreValues: {
          bilingualInput: {
            title: '中英混打',
            description: '写英文卡壳直接打中文，一键转为地道英文',
            example: {
              input: 'I think we should 把这个功能推迟到下个版本',
              output: 'I think we should push this feature to the next release.'
            }
          },
          chinglishDetection: {
            title: '中式英语检测',
            description: '实时标出"语法对但老外不这么说"的表达',
            example: {
              input: 'We want to cooperate',
              output: 'We\'d love to explore a partnership.'
            }
          },
          intentTranslation: {
            title: '意图翻译',
            description: '理解你想表达什么，而非字面翻译',
            example: {
              input: '不好意思回复晚了，之前一直在忙',
              output: 'Apologies for the delayed response — things have been hectic on my end.'
            }
          }
        },
        comparison: {
          title: 'Ries vs 其他工具',
          items: [
            { feature: '检测中式英语', ries: '专门优化', grammarly: '仅查拼写语法' },
            { feature: '中英夹杂', ries: '完美支持', chatgpt: '需编写提示词' },
            { feature: '输入框内使用', ries: '原生一键操作', others: '需反复切屏' },
            { feature: '意图翻译', ries: '理解意图', baidu: '字面翻译' }
          ]
        },
        pricing: {
          basic: '免费可用',
          note: '基础功能免费，无需注册，30秒装好'
        },
        installationGuide: '访问官网安装Chrome/Edge/Firefox插件，30秒完成安装，无需注册即可使用',
        officialUrl: 'https://ries.ai?c=h5f1',
        category: '浏览器插件'
      },
      {
        id: 'open-minis',
        name: 'Open Minis',
        description: 'iOS端最强AI Agent，只有49.8MB，让iPhone自动完成各种任务而无需打开App。支持剪视频、分析健康数据、整理歌单等11+种自动化场景',
        platforms: ['iOS', 'iPhone', 'iPad'],
        appSize: '49.8 MB',
        features: [
          '自动创建日历日程 - 分享内容即可创建',
          '读取健康数据 - 分析身体情况',
          'Apple Watch数据分析 - 心脏状态监测',
          'Spotify音乐控制 - 一句话搜歌切歌',
          '自动剪视频 - 从素材到成片',
          '歌单整理 - TikTok歌曲转YouTube Music',
          '智能闹钟 - 读新闻+语音叫起床',
          '群消息监控 - 自动检测重点内容',
          '网页转笔记 - 自动整理可用笔记',
          '咖啡因记录 - 拍照自动记录摄入',
          '批量闹钟设置 - 复杂重复操作自动化'
        ],
        useCases: [
          {
            title: '自动创建日历',
            description: '将带有时间、地点、事件的内容分享给Minis，自动创建日程'
          },
          {
            title: '健康数据分析',
            description: '直接读取iOS健康数据，分析身体情况，比你自己更清楚'
          },
          {
            title: '心脏状态监测',
            description: '读取Apple Watch数据，分析心脏健康状况'
          },
          {
            title: '音乐控制',
            description: '通过Spotify Skill搜索歌曲、切歌播放，无需打开App'
          },
          {
            title: '自动剪视频',
            description: '分析Up主历史视频，策划口播稿，自动生成成片'
          },
          {
            title: '歌单整理',
            description: '将TikTok评论截图发给Minis，自动整理到YouTube Music歌单'
          },
          {
            title: '智能起床',
            description: '自动读新闻并生成语音，替代传统闹钟叫醒'
          },
          {
            title: '群消息监控',
            description: '自动检测社群反馈中的重点内容，写入系统提醒'
          },
          {
            title: '网页转笔记',
            description: '将GitHub页面等直接整理为可用笔记文档'
          },
          {
            title: '咖啡因记录',
            description: '拍照咖啡胶囊，自动记录到健康App中'
          },
          {
            title: '批量闹钟',
            description: '一句话设置多个复杂重复闹钟，自动完成'
          }
        ],
        advantages: [
          '无需打开App即可完成操作',
          '只有49.8MB，轻量级',
          '支持11+种自动化场景',
          '数字化人生闭环',
          'iOS原生集成',
          'Apple Watch数据联动'
        ],
        targetUsers: [
          'iPhone重度用户',
          '效率工具爱好者',
          '健康数据追踪者',
          '内容创作者',
          '自动化流程需求者'
        ],
        installationGuide: '从App Store或TestFlight下载安装，iOS系统即可使用',
        officialUrl: 'https://www.appinn.com/iphone-automation-11-real-use-cases/',
        appStore: 'App Store',
        testFlight: 'TestFlight',
        category: 'iOS AI Agent'
      },
      {
        id: 'sqlai',
        name: 'SQLAI',
        description: 'AI数据库工具，自然语言转SQL、优化慢查询、生成表结构',
        platforms: ['Web', 'Desktop'],
        features: [
          '自然语言转SQL',
          '慢查询优化',
          '表结构生成',
          'SQL分析',
          '数据库支持'
        ],
        installationGuide: '访问官网注册使用',
        officialUrl: 'https://sqlai.ai'
      },
      {
        id: 'testgpt',
        name: 'TestGPT',
        description: 'AI测试工具，自动生成单元测试、接口测试用例',
        platforms: ['VS Code', 'Web'],
        features: [
          '单元测试生成',
          '接口测试用例',
          '测试覆盖率',
          '自动化测试'
        ],
        installationGuide: '访问官网或安装VS Code插件',
        officialUrl: 'https://testgpt.ai'
      },
      {
        id: 'kubiya-ai',
        name: 'Kubiya AI',
        description: 'AI运维工具，生成Dockerfile、K8s配置、部署脚本',
        platforms: ['Web', 'CLI'],
        features: [
          'Dockerfile生成',
          'K8s配置生成',
          '部署脚本生成',
          '运维自动化'
        ],
        installationGuide: '访问官网注册使用',
        officialUrl: 'https://kubiya.ai'
      },
      {
        id: 'snyk-ai',
        name: 'Snyk AI',
        description: 'AI代码安全扫描工具，漏洞检测和修复',
        platforms: ['VS Code', 'JetBrains IDE', 'Web'],
        features: [
          '代码安全扫描',
          '漏洞检测',
          '漏洞修复',
          '安全建议'
        ],
        installationGuide: '安装IDE插件或访问官网',
        officialUrl: 'https://snyk.io'
      },
      {
        id: 'codeium',
        name: 'Codeium',
        description: '高性价比的全能选手，市场份额约15%，免费层功能丰富，支持多IDE',
        platforms: ['VS Code', 'JetBrains IDE', 'Visual Studio', 'Vim/Neovim', 'Web'],
        features: [
          '代码补全',
          '聊天对话',
          '代码生成',
          '代码解释',
          '单元测试',
          '免费层功能丰富',
          '响应速度快',
          '隐私保护较好'
        ],
        marketShare: '15%',
        pricing: {
          free: '功能丰富的免费层',
          personal: '$12/月',
          enterprise: '$25/用户/月',
          student: '免费'
        },
        performance: {
          responseTime: '100ms',
          accuracy: '72%',
          acceptanceRate: '65%'
        },
        pros: [
          '免费层功能丰富',
          '支持IDE多',
          '响应速度快',
          '隐私保护较好',
          '有独立编辑器'
        ],
        cons: [
          '复杂任务能力一般',
          '企业功能较少',
          '品牌知名度低'
        ],
        installationGuide: 'IDE插件市场搜索"Codeium"安装',
        officialUrl: 'https://codeium.com'
      },
      {
        id: 'tabnine',
        name: 'Tabnine',
        description: '隐私和安全优先的AI编程助手，市场份额约12%，支持自托管和离线模式',
        platforms: ['VS Code', 'JetBrains IDE', 'Visual Studio', 'Vim/Neovim', 'Eclipse'],
        features: [
          '代码补全',
          '聊天对话',
          '支持自托管',
          '离线模式',
          '数据隐私保护',
          '企业安全合规',
          '支持本地模型'
        ],
        marketShare: '12%',
        pricing: {
          free: '有限免费层',
          personal: '$12/月',
          enterprise: '$39/用户/月',
          selfHosted: '$69/用户/月'
        },
        performance: {
          responseTime: '90ms',
          accuracy: '70%',
          acceptanceRate: '62%'
        },
        pros: [
          '支持自托管',
          '离线模式',
          '数据隐私保护',
          '企业安全合规',
          '支持本地模型'
        ],
        cons: [
          '价格较高',
          '功能相对保守',
          '创新能力一般'
        ],
        installationGuide: 'IDE插件市场搜索"Tabnine"安装',
        officialUrl: 'https://tabnine.com'
      },
      {
        id: 'sourcegraph-cody',
        name: 'Sourcegraph Cody',
        description: '代码搜索+AI辅助的编程助手，市场份额约10%，大代码库理解好',
        platforms: ['VS Code', 'JetBrains IDE', 'Web'],
        features: [
          '代码补全',
          '聊天对话',
          '代码搜索',
          '大代码库理解',
          '文档生成',
          '与Sourcegraph集成',
          '价格合理'
        ],
        marketShare: '10%',
        pricing: {
          free: '有限免费层',
          personal: '$9/月',
          enterprise: '$19/用户/月',
          student: '优惠'
        },
        performance: {
          responseTime: '120ms',
          accuracy: '74%',
          acceptanceRate: '66%'
        },
        pros: [
          '代码搜索能力强',
          '大代码库理解好',
          '与Sourcegraph集成',
          '文档生成优秀',
          '价格合理'
        ],
        cons: [
          '依赖Sourcegraph',
          'IDE支持较少',
          '品牌知名度低'
        ],
        installationGuide: 'IDE插件市场搜索"Sourcegraph Cody"安装',
        officialUrl: 'https://sourcegraph.com/cody'
      },
      {
        id: 'openclaw',
        name: 'OpenClaw',
        description: '从AI工具转变为"AI入口"的平台，2026.3.31版本内置QQ Bot，打通中国主流即时通讯场景',
        platforms: ['Telegram', 'Discord', 'Slack', 'QQ', 'LINE', 'Matrix', 'WhatsApp', 'Microsoft Teams'],
        version: '2026.3.31',
        features: [
          '内置QQ Bot',
          '多模态消息能力',
          '可视化后台任务流管理',
          'CJK语言优化',
          '多账号管理',
          'Slash命令',
          '媒体消息收发',
          '任务调度器'
        ],
        newFeatures: {
          qqBot: '内置QQ Bot插件，支持私聊、群聊、频道（Guild）以及多媒体消息交互',
          multimodal: 'LINE平台支持发送图片、视频和音频等',
          taskFlow: '可视化后台任务流管理，支持查看列表、展示详情、取消任务',
          cjkOptimization: '针对中日韩语言的优化，更好的上下文理解和语音合成'
        },
        pros: [
          '内置QQ Bot，进入国内高频沟通环境',
          '多模态消息能力，支持图片、视频、音频',
          '可视化任务流管理',
          'CJK语言优化',
          '支持8大主流平台',
          '从AI工具转变为AI入口'
        ],
        installationGuide: '访问GitHub下载安装，支持多平台部署',
        officialUrl: 'https://github.com/openclaw/openclaw'
      },
      {
        id: 'testers-ai',
        name: 'Testers.AI',
        description: '测试工程师的终极外挂，AI Skills范式 - "Install once, test everything"，支持VS Code、Chrome、Claude三大入口',
        platforms: ['VS Code', 'Chrome', 'Claude Desktop', 'Claude Web'],
        features: [
          'AI Skills范式',
          '一键生成测试',
          '自动修复测试',
          '无障碍合规检查',
          '动态定位器自愈',
          'Playwright测试生成',
          'WCAG合规检查',
          '多平台复用'
        ],
        entryPoints: {
          vsCode: {
            plugins: [
              'Testers AI IDE - 核心测试生成与调试',
              'Testers Dynamic - 动态定位器自愈',
              'Accessibility Tester AI - 自动WCAG合规检查'
            ],
            usage: '右键选择"Ask Testers AI..."，输入自然语言指令'
          },
          chrome: {
            extensions: [
              'Standard Checks - 基础健壮性扫描',
              'Test Case Generator - 自动生成测试用例',
              'Vibe Testing Agent - "氛围感"探索测试'
            ],
            usage: '点击扩展图标，启动AI测试Agent'
          },
          claude: {
            integration: '通过testers.ai/claude集成Skills',
            usage: '在聊天中发出测试指令，Claude自动调用对应Skill'
          }
        },
        coreInnovation: {
          aiSkills: {
            description: '一种可跨平台复用的专业测试能力单元',
            characteristics: ['轻量', '可移植', '可组合']
          },
          opentestai: {
            description: '开源测试引擎，Skill的底层执行引擎',
            url: 'https://github.com/opentestai/opentestai'
          }
        },
        pros: [
          '三大入口：VS Code、Chrome、Claude',
          'AI Skills范式，一次安装处处可用',
          '零代码、零配置，人人都是测试员',
          '支持Playwright测试生成和运行',
          'WCAG无障碍合规检查',
          '动态定位器自愈，对抗UI变更'
        ],
        installationGuide: '访问官网选择对应入口安装，或安装opentestai开源引擎',
        officialUrl: 'https://testers.ai'
      },
      {
        id: 'zte-coclaw',
        name: '中兴Co Claw智能调度',
        description: '中兴自研的AI智能调度技术，实现跨应用、跨生态的无缝协同，支持复杂场景下的自动化任务执行',
        platforms: ['中兴AI手机', '中兴智能设备'],
        features: [
          'AI智能体深度融入操作系统',
          '跨应用无缝协同',
          '跨生态无缝协同',
          '自动化任务执行',
          '系统级AI能力',
          '原生AI体验'
        ],
        partner: {
          company: '字节跳动',
          product: '豆包AI手机',
          strategy: 'AI for All'
        },
        pros: [
          '真正的原生AI体验，非简单功能插件',
          '跨应用、跨生态的无缝协同',
          '支持复杂场景下的自动化任务执行',
          '提升用户操作效率与交互智能度'
        ],
        officialUrl: 'https://www.zte.com.cn'
      },
      {
        id: 'doubao-ai-phone',
        name: '豆包AI手机',
        description: '字节跳动与中兴通讯合作研发的新一代AI手机，深度融合AI智能体，打造原生AI体验',
        platforms: ['中兴AI手机'],
        features: [
          'AI智能体深度融入操作系统',
          '豆包大模型支持',
          '原生AI体验',
          '系统级AI能力',
          '智能语音助手',
          'AI摄影优化',
          '智能场景识别'
        ],
        partners: {
          zte: '中兴通讯 - 硬件研发与系统集成',
          bytedance: '字节跳动 - 豆包大模型与AI技术'
        },
        strategy: 'AI for All',
        pros: [
          '中兴与字节跳动强强联合',
          'AI智能体深度融入操作系统',
          '真正的原生AI体验',
          'Co Claw智能调度技术加持',
          '跨应用、跨生态无缝协同'
        ],
        officialUrl: 'https://www.doubao.com'
      },
      {
        id: 'cloudflare-email-routing',
        name: 'Cloudflare免费无限邮箱',
        description: '一个域名搞定所有AI账号注册，Catch-All模式实现无限邮箱地址，Email Workers自动提取验证码',
        platforms: ['Web', 'Cloudflare'],
        features: [
          '无限邮箱地址',
          'Catch-All模式',
          '统一收件',
          'Email Workers自动处理',
          '验证码自动提取',
          'Telegram推送',
          '免费使用'
        ],
        useCases: [
          '注册ChatGPT账号',
          '注册Claude账号',
          '注册Gemini账号',
          '注册各种API账号',
          '批量注册AI服务'
        ],
        setupSteps: {
          prerequisites: '需要一个托管在Cloudflare的域名',
          steps: [
            '1. 进入电子邮件路由：Cloudflare控制台 → 选择域名 → 电子邮件 → 电子邮件路由',
            '2. 创建自定义邮件地址：填写邮箱前缀和目标邮箱',
            '3. 验证目标邮箱：点击验证邮件中的链接',
            '4. 启用电子邮件路由：添加MX记录并启用',
            '5. 开启Catch-All：路由规则 → Catch-All规则 → 启用'
          ]
        },
        advancedFeatures: {
          emailWorkers: {
            description: '用代码拦截并处理每封收到的邮件',
            features: [
              '自动提取验证码',
              '推送到Telegram',
              '自定义邮件处理逻辑'
            ]
          }
        },
        pros: [
          '一个域名 = 无限邮箱地址',
          'Catch-All = 任意前缀都能收件',
          'Email Workers = 验证码自动推送',
          '免费使用',
          '无需额外邮箱服务'
        ],
        installationGuide: '访问Cloudflare控制台配置电子邮件路由',
        officialUrl: 'https://dash.cloudflare.com'
      },
      {
        id: 'clawaegis',
        name: 'ClawAegis',
        description: '蚂蚁集团与清华大学联合开源的OpenClaw安全防御插件，首个覆盖OpenClaw全生命周期的安全防御插件',
        platforms: ['OpenClaw'],
        developers: {
          antGroup: '蚂蚁集团AI安全实验室',
          tsinghua: '清华大学'
        },
        features: [
          '全生命周期安全防御',
          '多维度防护能力',
          '轻量化设计',
          '即时干预机制',
          '原生防护能力',
          '高度可配置',
          '透明化保护'
        ],
        defenseStages: {
          initialization: {
            name: '初始化阶段',
            threats: ['skill投毒', '恶意配置注入'],
            defense: '启动前安全检查与验证'
          },
          userInput: {
            name: '用户输入阶段',
            threats: ['恶意指令注入', '输入数据污染'],
            defense: '输入验证与过滤'
          },
          modelInference: {
            name: '模型推理阶段',
            threats: ['意图被恶意诱导', '提示词注入攻击'],
            defense: '推理过程监控与干预'
          },
          intelligentDecision: {
            name: '智能决策阶段',
            threats: ['决策被篡改', '权限越界调用'],
            defense: '决策审计与权限控制'
          },
          serviceExecution: {
            name: '服务执行阶段',
            threats: ['执行高危操作', '资源被耗尽', '敏感信息窃取'],
            defense: '执行监控与资源限制'
          }
        },
        threatProtection: [
          '恶意指令注入',
          '敏感信息窃取',
          '用户意图篡改',
          '权限越界调用',
          'skill投毒攻击',
          '记忆数据污染',
          '资源耗尽攻击'
        ],
        integration: {
          type: '内置轻量化插件',
          method: '无缝集成至OpenClaw框架',
          activation: '关键执行节点动态激活防护机制'
        },
        configuration: {
          riskIdentification: '高度可配置的风险识别策略',
          responseStrategy: '灵活的处置策略配置',
          userProtection: '敏感文件与Skill资产的透明化保护'
        },
        openSource: {
          significance: '继协助修复OpenClaw多个高危漏洞后的又一开源举措',
          future: '持续迭代能力，与社区共同构建可信、可控、可追溯的智能体运行环境'
        },
        pros: [
          '首个覆盖OpenClaw全生命周期的安全防御插件',
          '蚂蚁集团与清华大学强强联合',
          '系统性解决安全与可靠性风险',
          '多维度、轻量化、即时干预',
          '全链路纵深防御体系',
          '主动识别并拦截多种运行时威胁',
          '高度可配置，灵活应对不同攻击场景'
        ],
        installationGuide: '作为OpenClaw插件安装，无缝集成至框架',
        officialUrl: 'https://github.com/antgroup/clawaegis'
      },
      {
        id: 'aigc-bar',
        name: 'AIGC.BAR',
        description: '支持300+主流AI模型的API聚合平台，提供Claude Code、Codex-CLI、OpenClaw等工具接入，1元RMB=1$额度，实惠可靠的大模型接入服务',
        platforms: ['Web', 'API', 'Claude Code', 'Codex-CLI', 'OpenClaw'],
        apiEndpoint: 'https://api.aigc.bar',
        features: [
          '300+主流AI模型支持',
          'Claude Code原生接入',
          'Codex-CLI全面支持',
          'OpenClaw无缝集成',
          '1Gbps高速带宽',
          '智能负载均衡',
          '7×24小时稳定运行',
          '官方企业级渠道',
          '透明计费无隐形消费',
          'CC和DDoS防护'
        ],
        coreValues: {
          universalAccess: {
            name: '普惠共享',
            description: '打破技术壁垒，让每个人都能平等地享受AI技术带来的便利'
          },
          transparency: {
            name: '透明诚信',
            description: '全分组透明倍率，无隐形消费，每一笔交易都清晰可查'
          },
          experience: {
            name: '极致体验',
            description: '1Gbps高速带宽，智能负载均衡，7×24小时稳定运行'
          },
          security: {
            name: '安全可靠',
            description: '100%官方企业级渠道，完整功能支持，严格的数据保护'
          }
        },
        techStack: {
          network: '1Gbps企业级带宽，三大运营商直连',
          scheduling: '自研基于RPM和TPM的智能负载均衡算法',
          storage: '企业级云数据库RDS，不限速超高并发',
          security: 'CC和DDoS防护，严格的数据加密'
        },
        pricing: {
          exchangeRate: '1元RMB = 1$额度',
          minimumRecharge: '4刀起充',
          billing: '按量付费，透明计费',
          invoice: '支持开票，联系客服'
        },
        supportedModels: [
          'GPT-4/GPT-4o/GPT-4o-mini',
          'Claude 3.5/3.7 Sonnet/Opus',
          'Gemini Pro/Flash',
          'DeepSeek V3/R1',
          'Midjourney',
          '300+其他主流模型'
        ],
        integration: {
          claudeCode: {
            description: '全面支持Anthropic官方格式，轻松接入Claude Code',
            tokenGroup: 'Claude-code 专属通道',
            command: 'export ANTHROPIC_AUTH_TOKEN=sk-xxx && export ANTHROPIC_BASE_URL=https://api.aigc.bar && claude',
            steps: [
              '注册获取令牌：访问 AIGC.BAR 注册后获取 API 令牌',
              '安装 Claude Code：在终端中运行 npm install -g @anthropic-ai/claude-code',
              '复制粘贴启动：复制上方命令到终端即可使用'
            ]
          },
          codexCli: {
            description: '全面支持接入Codex-CLI，本地工具使用OpenAI模型',
            tokenGroup: 'Code-X 专属分组',
            note: '满血不降智而且巨便宜！',
            guide: 'https://aigc.bar/docs/codex-cli'
          },
          openclaw: {
            description: '全面支持接入OpenClaw，实现邮件处理、日历管理、代码编写、网页数据抓取等',
            note: '堪称24小时在线的私人AI打工人',
            supportedGroups: ['ClaudeCode分组', 'Codex分组'],
            guide: 'https://aigc.bar/docs/openclaw'
          }
        },
        quickLinks: {
          apiStatus: '实时接口状态',
          supportedModels: '支持模型列表',
          quickStart: '快速开始/接入教程',
          apiKey: 'APIKey获取/购买流程',
          pricing: '模型定价',
          faq: '常见问题',
          contact: '联系我们'
        },
        developmentHistory: [
          { time: '2024年初', milestone: '平台正式上线，开始提供GPT系列模型服务' },
          { time: '2024年中', milestone: '接入Claude、Midjourney等更多模型' },
          { time: '2024年末', milestone: '升级至1Gbps带宽，实现智能负载均衡' },
          { time: '2025年', milestone: '支持300+主流AI模型，成为行业一站式AI大模型API聚合站' }
        ],
        termsOfUse: {
          requirements: [
            '遵守所在地区的法律法规',
            '尊重知识产权和隐私权'
          ],
          prohibitions: [
            '禁止用于任何非法或有害目的',
            '禁止用于侵犯他人权益的行为'
          ],
          disclaimer: '使用者必须在遵循AI模型服务提供商以及法律法规的情况下使用，不得用于非法用途'
        },
        pros: [
          '300+主流AI模型一站式接入',
          '1元RMB=1$额度，价格实惠',
          '4刀起充，门槛低',
          '支持Claude Code、Codex-CLI、OpenClaw',
          '1Gbps高速带宽',
          '智能负载均衡',
          '7×24小时稳定运行',
          '官方企业级渠道',
          '透明计费无隐形消费',
          'CC和DDoS防护保障安全'
        ],
        installationGuide: '访问 https://aigc.bar 注册账号，获取API Key后即可使用。支持Claude Code、Codex-CLI、OpenClaw等多种接入方式',
        officialUrl: 'https://aigc.bar',
        docsUrl: 'https://aigc.bar/docs'
      },
      {
        id: 'ditlead',
        name: 'DitLead',
        description: 'AI驱动多渠道获客营销平台，整合多种营销渠道提升获客效率',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['多渠道获客', 'AI营销驱动', '数据追踪分析', '客户管理'],
        officialUrl: 'https://ditlead.com'
      },
      {
        id: 'zenpai-pro',
        name: 'zenpai.pro',
        description: '集合推广与图片处理在线工具平台，提供一站式营销素材处理服务',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['图片处理', '推广工具', '在线使用', '无安装'],
        officialUrl: 'https://zenpai.pro'
      },
      {
        id: 'socialpika',
        name: 'SocialPika',
        description: '智能社交媒体自动化排期工具，跨平台内容调度与管理',
        platforms: ['Web', 'Chrome Extension'],
        category: '运营与变现',
        features: ['社媒排期', '自动化发布', '多平台支持', '内容管理'],
        officialUrl: 'https://socialpika.com'
      },
      {
        id: 'promptmonitor',
        name: 'Promptmonitor',
        description: '优化品牌AI渠道曝光，AI驱动品牌内容优化与推广',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['品牌曝光', 'AI优化', '渠道管理', '数据分析'],
        officialUrl: 'https://promptmonitor.com'
      },
      {
        id: 'pareto',
        name: 'Pareto',
        description: '企业AI解决方案全链路服务商，提供一站式企业AI服务',
        platforms: ['Web', 'API'],
        category: '运营与变现',
        features: ['企业级AI', '全链路服务', '解决方案', '定制开发'],
        officialUrl: 'https://pareto.ai'
      },
      {
        id: 'kwatch-io',
        name: 'KWatch.io',
        description: '多平台海外社媒关键词监测工具，实时追踪社交媒体关键词',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['关键词监测', '海外社媒', '多平台', '实时追踪'],
        officialUrl: 'https://kwatch.io'
      },
      {
        id: 'hookle',
        name: 'Hookle',
        description: 'AI赋能中小企业社媒营销管理，简化社媒运营流程',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['中小企业', '社媒管理', 'AI赋能', '营销工具'],
        officialUrl: 'https://hookle.com'
      },
      {
        id: 'yuju-ai',
        name: '语聚AI',
        description: '全渠道AI营销获客助手，整合多渠道营销获客能力',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['全渠道', 'AI营销', '获客助手', '数据整合'],
        officialUrl: 'https://yuju.ai'
      },
      {
        id: 'yixiaoer',
        name: '蚁小二',
        description: '一站式自媒体运营工具，多平台内容发布与管理',
        platforms: ['Web', 'Desktop'],
        category: '运营与变现',
        features: ['自媒体', '一站式', '多平台', '内容管理'],
        officialUrl: 'https://yixiaoer.com'
      },
      {
        id: 'qingdouyun',
        name: '青豆云',
        description: '新媒体多账号互动运营助手，高效管理多个新媒体账号',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['多账号', '互动运营', '新媒体', '效率工具'],
        officialUrl: 'https://qingdouyun.com'
      },
      {
        id: 'linkfox',
        name: 'Linkfox',
        description: '跨境电商AI一站式运营助手，助力跨境电商高效运营',
        platforms: ['Web', 'Chrome Extension'],
        category: '运营与变现',
        features: ['跨境电商', 'AI运营', '一站式', '选品分析'],
        officialUrl: 'https://linkfox.io'
      },
      {
        id: 'accio',
        name: 'Accio',
        description: 'AI驱动全链路商业自动化运营，提升商业运营效率',
        platforms: ['Web', 'API'],
        category: '运营与变现',
        features: ['全链路', '商业自动化', 'AI驱动', '效率提升'],
        officialUrl: 'https://accio.ai'
      },
      {
        id: 'ghost',
        name: 'Ghost',
        description: '开源博客与付费通讯发布平台，内容创作与变现',
        platforms: ['Web', 'Self-hosted'],
        category: '运营与变现',
        features: ['开源', '博客', '付费通讯', '内容变现'],
        officialUrl: 'https://ghost.org'
      },
      {
        id: 'xinmeijia',
        name: '新媒加多账号矩阵工具',
        description: '跨平台多账号矩阵运营工具，系统化管理多平台账号',
        platforms: ['Web', 'Desktop'],
        category: '运营与变现',
        features: ['多账号', '矩阵运营', '跨平台', '系统化'],
        officialUrl: 'https://xinmeijia.com'
      },
      {
        id: 'kuaigao-zhushou',
        name: '快稿助手',
        description: '自媒体多账号管理批量发布工具，高效内容发布',
        platforms: ['Web', 'Desktop'],
        category: '运营与变现',
        features: ['多账号管理', '批量发布', '自媒体', '效率工具'],
        officialUrl: 'https://kuaigao.com'
      },
      {
        id: 'kaowo',
        name: 'KAWO科握',
        description: '一站式社交媒体协同管理与数据分析平台，提升社媒运营效率',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['社媒管理', '协同工作', '数据分析', '一站式'],
        officialUrl: 'https://kawo.com'
      },
      {
        id: 'qingbo-ai',
        name: '清博智能',
        description: '大数据驱动舆情与融媒运营工具，提供全方位数据服务',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['大数据', '舆情监测', '融媒运营', '数据分析'],
        officialUrl: 'https://qingbo.net'
      },
      {
        id: 'rongmeibao',
        name: '融媒宝',
        description: '新媒体全链路运营管理AI工具，智能化新媒体运营',
        platforms: ['Web', 'Desktop'],
        category: '运营与变现',
        features: ['全链路', '新媒体', 'AI工具', '运营管理'],
        officialUrl: 'https://rongmeibao.com'
      },
      {
        id: 'xinhong',
        name: '新红',
        description: '小红书专属数据运营辅助工具，助力小红书内容运营',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['小红书', '数据运营', '内容分析', '专属工具'],
        officialUrl: 'https://xinhong.cn'
      },
      {
        id: 'chuanshenggang',
        name: '传声港',
        description: '多平台分发与达人营销推广工具，扩大内容影响力',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['多平台分发', '达人营销', '内容推广', '影响力扩大'],
        officialUrl: 'https://chuanshenggang.com'
      },
      {
        id: 'xiaohongshu-pro',
        name: '小红书专业号',
        description: 'AI赋能内容生产与流量变现，小红书官方专业服务',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['小红书', 'AI赋能', '内容生产', '流量变现'],
        officialUrl: 'https://xiaohongshu.com'
      },
      {
        id: 'xiaohongshu-juguang',
        name: '小红书聚光',
        description: '小红书官方AI营销平台，专业营销推广服务',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['小红书', '官方平台', 'AI营销', '专业推广'],
        officialUrl: 'https://business.xiaohongshu.com'
      },
      {
        id: 'douyin-open',
        name: '抖音开放平台',
        description: '字节跳动旗下开发者平台，抖音生态能力开放',
        platforms: ['Web', 'API'],
        category: '运营与变现',
        features: ['抖音', '开发者平台', 'API接口', '生态合作'],
        officialUrl: 'https://open.douyin.com'
      },
      {
        id: 'cli-marketing',
        name: '磁力营销平台',
        description: '营销管理一站式服务，快手官方营销平台',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['快手', '一站式', '营销管理', '官方服务'],
        officialUrl: 'https://e.kuaishou.com'
      },
      {
        id: 'aoxia',
        name: '遨虾',
        description: '跨境电商专属AI商品素材生成平台，高效生成商品素材',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['跨境电商', 'AI生成', '商品素材', '高效工具'],
        officialUrl: 'https://aoxia.ai'
      },
      {
        id: 'banwei',
        name: '班蔚',
        description: '跨境DTC品牌出海全链路服务平台，助力品牌出海',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['跨境DTC', '品牌出海', '全链路', '服务平台'],
        officialUrl: 'https://banwei.com'
      },
      {
        id: 'taobao-union',
        name: '淘宝联盟',
        description: '淘宝联盟，电商CPS推广生态平台，淘宝官方推广平台',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['淘宝', 'CPS推广', '电商生态', '官方平台'],
        officialUrl: 'https://pub.alimama.com'
      },
      {
        id: 'douyin-ecommerce-research',
        name: '抖音电商兴趣电商研究院',
        description: '抖音电商兴趣电商研究院，品牌案例平台，行业研究',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['抖音电商', '兴趣电商', '研究院', '品牌案例'],
        officialUrl: 'https://ecommerce.douyin.com'
      },
      {
        id: 'douyin-ecommerce',
        name: '抖音电商',
        description: '抖音电商，商家达人经营指南平台，抖音电商官方平台',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['抖音电商', '商家达人', '经营指南', '官方平台'],
        officialUrl: 'https://buyin.jinritemai.com'
      },
      {
        id: 'bilibili-huahuo',
        name: 'bilibili花火',
        description: 'B站花火，UP主与品牌商业合作平台，官方合作平台',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['B站', 'UP主', '品牌合作', '官方平台'],
        officialUrl: 'https://huahuo.bilibili.com'
      },
      {
        id: 'doujiju',
        name: '抖几句',
        description: '短视频剧本征稿平台，创作者剧本交易平台',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['短视频', '剧本', '征稿平台', '创作者'],
        officialUrl: 'https://doujiju.com'
      },
      {
        id: 'yunzhan-open',
        name: '云瞻开放平台',
        description: '私域运营CPS变现SAAS平台，私域流量运营工具',
        platforms: ['Web', 'API'],
        category: '运营与变现',
        features: ['私域运营', 'CPS变现', 'SAAS', '流量运营'],
        officialUrl: 'https://yunzhan.com'
      },
      {
        id: 'duoduojinbao',
        name: '多多进宝',
        description: '拼多多多多进宝，电商带货平台，拼多多官方推广',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['拼多多', '多多进宝', '电商带货', '官方推广'],
        officialUrl: 'https://jinbao.pinduoduo.com'
      },
      {
        id: 'jd-union',
        name: '京东联盟',
        description: '京东联盟，电商内容带货平台，京东官方推广',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['京东', '京东联盟', '内容带货', '官方推广'],
        officialUrl: 'https://union.jd.com'
      },
      {
        id: 'xiaoe-tong',
        name: '小鹅通',
        description: '小鹅通，企业私域运营与全域营销工具，知识付费平台',
        platforms: ['Web', 'Mobile', 'WeChat'],
        category: '运营与变现',
        features: ['私域运营', '全域营销', '知识付费', '企业工具'],
        officialUrl: 'https://xiaoe-tech.com'
      },
      {
        id: 'xingqiu-faxing',
        name: '星球发行',
        description: '看见音乐旗下全球音乐分发与版权平台，音乐版权管理',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['音乐分发', '版权管理', '全球平台', '看见音乐'],
        officialUrl: 'https://planet.kankanmusic.com'
      },
      {
        id: 'niupianwang',
        name: '牛片网',
        description: '影视短视频交易与AI创作服务平台，视频内容服务',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['影视视频', 'AI创作', '交易平台', '视频服务'],
        officialUrl: 'https://niupian.com'
      },
      {
        id: 'weirenwu',
        name: '微任务',
        description: '自媒体商业合作平台，微博官方任务平台',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['自媒体', '商业合作', '微任务', '官方平台'],
        officialUrl: 'https://e.weibo.com'
      },
      {
        id: 'a5-newmedia',
        name: 'A5新媒体交易平台',
        description: 'A5新媒体交易平台，账号出售撮合服务平台',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['新媒体', '账号交易', '撮合服务', '交易平台'],
        officialUrl: 'https://a5.net'
      },
      {
        id: 'doubao-fanzhidao',
        name: '豆包泛知道',
        description: '泛知识领域知识付费与变现平台，知识内容变现',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['泛知识', '知识付费', '内容变现', '豆包'],
        officialUrl: 'https://fanzhidao.com'
      },
      {
        id: 'zhihu-zhishi',
        name: '知乎芝士',
        description: '知乎芝士，商业内容合作平台，知乎官方商业平台',
        platforms: ['Web', 'Mobile'],
        category: '运营与变现',
        features: ['知乎', '商业内容', '合作平台', '官方服务'],
        officialUrl: 'https://zhihu.com/business'
      },
      {
        id: 'yunlue',
        name: '云略',
        description: '企业新媒体矩阵AI运营平台，矩阵化运营管理',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['企业级', '新媒体矩阵', 'AI运营', '平台化'],
        officialUrl: 'https://yunlue.com'
      },
      {
        id: 'xinbang-youzhuan',
        name: '新榜有赚',
        description: '新榜旗下专注新媒体流量交易的变现平台，流量变现',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['新榜', '流量交易', '变现平台', '新媒体'],
        officialUrl: 'https://youzhuan.newrank.cn'
      },
      {
        id: 'xiaohongshu-pugongying',
        name: '小红书蒲公英',
        description: '小红书官方推出的品牌与达人合作撮合平台，官方合作',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['小红书', '品牌达人', '合作撮合', '官方平台'],
        officialUrl: 'https://pgy.xiaohongshu.com'
      },
      {
        id: 'weshop-weixiang',
        name: 'WeShop唯象',
        description: '连接国内供应商与海外买家的跨境社交电商平台',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['跨境电商', '社交电商', '供应商', '海外买家'],
        officialUrl: 'https://weshop.com'
      },
      {
        id: 'qunfeng-fuwu',
        name: '群峰服务市场',
        description: '字节跳动旗下全域营销服务聚合平台，营销服务聚合',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['字节跳动', '全域营销', '服务聚合', '平台'],
        officialUrl: 'https://marketplace.oceanengine.com'
      },
      {
        id: 'feigua-zhixing',
        name: '飞瓜智星',
        description: '飞瓜数据旗下多平台达人分销全链路工具，达人分销',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['飞瓜数据', '多平台', '达人分销', '全链路'],
        officialUrl: 'https://zhixing.feigua.com'
      },
      {
        id: 'feigua-yitou',
        name: '飞瓜易投',
        description: '飞瓜数据旗下抖音广告全渠道分析平台，广告分析',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['飞瓜数据', '抖音广告', '全渠道', '数据分析'],
        officialUrl: 'https://yitou.feigua.com'
      },
      {
        id: 'feigua-zhitou',
        name: '飞瓜智投',
        description: '飞瓜数据旗下直播电商全流程运营平台，直播电商',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['飞瓜数据', '直播电商', '全流程', '运营平台'],
        officialUrl: 'https://zhitou.feigua.com'
      },
      {
        id: 'chanquanquan',
        name: '蝉圈圈',
        description: '蝉妈妈旗下企业级电商达人营销管理系统，达人管理',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['蝉妈妈', '企业级', '电商达人', '营销管理'],
        officialUrl: 'https://chanquanquan.chanmama.com'
      },
      {
        id: 'chanmama-ai',
        name: '蝉妈妈AI',
        description: '电商人专属AI工具，助力电商高效运营',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['蝉妈妈', '电商AI', '专属工具', '效率提升'],
        officialUrl: 'https://ai.chanmama.com'
      },
      {
        id: 'xuanxiaoer',
        name: '宣小二',
        description: '国内品牌网红营销发稿平台，品牌营销推广',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['品牌营销', '网红合作', '发稿平台', '国内'],
        officialUrl: 'https://xuanxiaoer.com'
      },
      {
        id: 'chuangzuoguantou',
        name: '创作罐头',
        description: '免费自媒体运营管理工具平台，自媒体运营',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['免费', '自媒体', '运营管理', '工具平台'],
        officialUrl: 'https://chuangzuoguantou.com'
      },
      {
        id: 'aquila',
        name: '悟道·天鹰Aquila',
        description: '智源研究院悟道·天鹰Aquila大语言模型，Aquila2-34B在22个评测基准取得领先排名，当前最强的开源中英双语大模型',
        platforms: ['Web', 'API', 'Self-hosted'],
        category: '大语言模型',
        features: ['340亿参数', '中英双语', '开源', '推理能力', '代码生成', '文献检索', '智能体支持'],
        officialUrl: 'https://www.baai.ac.cn'
      },
      {
        id: 'huggingface',
        name: 'HuggingFace',
        description: '人工智能社区建设未来，构建、训练和部署由机器学习中的参考开源支持的最先进模型',
        platforms: ['Web', 'API', 'Python'],
        category: '大语言模型',
        features: ['模型库', 'Transformers', 'Datasets', 'Tokenizers', 'Accelerate', 'Hub'],
        officialUrl: 'https://huggingface.co'
      },
      {
        id: 'tongyi-qianwen',
        name: '通义千问',
        description: '阿里的通义千问超大规模语言模型，功能包括多轮对话、文案创作、逻辑推理、多模态理解、多语言支持',
        platforms: ['Web', 'API', 'Mobile'],
        category: '大语言模型',
        features: ['多轮对话', '文案创作', '逻辑推理', '多模态理解', '多语言支持', '小说续写', '邮件编写'],
        officialUrl: 'https://tongyi.aliyun.com'
      },
      {
        id: 'wenxin-yiyan',
        name: '文心一言',
        description: '百度全新一代知识增强大语言模型，文心大模型家族的新成员，能够与人对话互动，回答问题，协助创作',
        platforms: ['Web', 'API', 'Mobile'],
        category: '大语言模型',
        features: ['对话互动', '回答问题', '协助创作', '知识增强', '多轮对话'],
        officialUrl: 'https://yiyan.baidu.com'
      },
      {
        id: 'snack-prompt',
        name: 'Snack Prompt',
        description: '发现、提升和分享最佳人工智能提示的平台，打破人工智能领域的障碍',
        platforms: ['Web', 'Chrome Extension'],
        category: 'AI提示词',
        features: ['提示发现', '提示分享', '社区排名', '收藏管理', '团队协作', '提示创造者'],
        officialUrl: 'https://snackprompt.com'
      },
      {
        id: 'promptbase',
        name: 'PromptBase',
        description: '购买和销售优质提示的市场，可产生最佳结果，并为您节省API成本',
        platforms: ['Web'],
        category: 'AI提示词',
        features: ['提示市场', 'DALL·E', 'Midjourney', 'GPT', '提示工程', 'API成本节省'],
        officialUrl: 'https://promptbase.com'
      },
      {
        id: 'clickprompt',
        name: 'ClickPrompt',
        description: '专为Prompt编写者设计的工具，支持多种基于Prompt的AI应用，提供在线Prompt生成器',
        platforms: ['Web'],
        category: 'AI提示词',
        features: ['Stable Diffusion', 'ChatGPT', 'GitHub Copilot', 'Prompt生成器', '一键运行'],
        officialUrl: 'https://clickprompt.com'
      },
      {
        id: 'prompthero',
        name: 'PromptHero',
        description: '发现Stable Diffusion、ChatGPT和Midjourney的提示用语',
        platforms: ['Web'],
        category: 'AI提示词',
        features: ['Stable Diffusion', 'ChatGPT', 'Midjourney', '提示搜索', '提示库'],
        officialUrl: 'https://prompthero.com'
      },
      {
        id: 'flowgpt',
        name: 'FlowGPT',
        description: 'ChatGPT指令大全，发现和分享最佳ChatGPT提示',
        platforms: ['Web'],
        category: 'AI提示词',
        features: ['ChatGPT', '提示大全', '社区分享', '提示排名'],
        officialUrl: 'https://flowgpt.com'
      },
      {
        id: 'chatgpt-prompt-genius',
        name: 'ChatGPT Prompt Genius',
        description: '免费的开源浏览器扩展程序，帮助发现、共享、导入和使用ChatGPT的最佳提示',
        platforms: ['Chrome Extension', 'Web'],
        category: 'AI提示词',
        features: ['发现提示', '共享提示', '导入提示', '本地保存', '聊天记录', '提示模板'],
        officialUrl: 'https://promptgenius.app'
      },
      {
        id: 'autodl',
        name: 'AutoDL算力云',
        description: '弹性、好用、省钱的GPU算力云，租GPU就上AutoDL',
        platforms: ['Web'],
        category: 'AI服务器',
        features: ['GPU租赁', '弹性算力', '省钱', '好用', '稳定可靠'],
        officialUrl: 'https://www.autodl.com'
      },
      {
        id: 'cephalon',
        name: '端脑云Cephalon',
        description: '端脑科技开发的云端AIGC工具平台，集合市面上主流的AIGC应用，通过分布式算力技术整合优化了分散的计算资源',
        platforms: ['Web'],
        category: 'AI服务器',
        features: ['AIGC工具', '分布式算力', 'GPU算力', '主流AIGC应用'],
        officialUrl: 'https://cephalon.ai'
      },
      {
        id: 'xiangongyun',
        name: '仙宫云',
        description: '提供稳定可靠的高性能GPU算力，让客户的AI应用、数据挖掘等计算密集型任务可以轻松完成',
        platforms: ['Web'],
        category: 'AI服务器',
        features: ['高性能GPU', '稳定可靠', 'AI应用', '数据挖掘'],
        officialUrl: 'https://xiangongyun.com'
      },
      {
        id: 'reface-ai',
        name: 'Reface.ai',
        description: 'AI智能在线换脸工具，操作简单且实用',
        platforms: ['Web', 'Mobile'],
        category: 'AI工具',
        features: ['AI换脸', '在线工具', '操作简单'],
        officialUrl: 'https://reface.ai'
      },
      {
        id: 'lalal-ai',
        name: 'LALAL.AI',
        description: 'AI提取人声轨分离工具，在线AI去人声音频分离音乐伴奏提取工具',
        platforms: ['Web'],
        category: 'AI工具',
        features: ['人声分离', '去人声', '音乐伴奏提取', '音频分离'],
        officialUrl: 'https://www.lalal.ai'
      },
      {
        id: 'soundraw',
        name: 'SoundRaw',
        description: '为创作者打造的AI音乐生成器，轻松创作无版权的音乐',
        platforms: ['Web'],
        category: 'AI工具',
        features: ['AI音乐生成', '无版权音乐', '创作者工具'],
        officialUrl: 'https://soundraw.io'
      },
      {
        id: 'unscreen',
        name: 'Unscreen',
        description: '在线视频和GIF背景抠除工具，不用绿幕轻松完成视频抠像',
        platforms: ['Web'],
        category: 'AI工具',
        features: ['视频抠像', '背景抠除', '无绿幕', 'GIF处理'],
        officialUrl: 'https://www.unscreen.com'
      },
      {
        id: 'artflow-ai',
        name: 'Artflow.ai',
        description: 'AI创建生成视频动画，可将创意快速转化为动画故事的AI设计工具',
        platforms: ['Web'],
        category: 'AI工具',
        features: ['AI视频生成', '动画故事', '创意转化'],
        officialUrl: 'https://artflow.ai'
      },
      {
        id: 'opencat',
        name: 'OpenCat',
        description: '基于ChatGPT打造的AI聊天工具',
        platforms: ['iOS', 'macOS'],
        category: 'AI工具',
        features: ['ChatGPT', 'AI聊天', '桌面应用', '移动应用'],
        officialUrl: 'https://opencat.app'
      },
      {
        id: 'chatgpt-next-web',
        name: 'ChatGPT Next Web',
        description: '一键免费部署你的私人ChatGPT网页应用',
        platforms: ['Web', 'Self-hosted'],
        category: 'AI工具',
        features: ['私人ChatGPT', '网页应用', '免费部署'],
        officialUrl: 'https://github.com/Yidadaa/ChatGPT-Next-Web'
      },
      {
        id: 'trustmrr',
        name: 'TrustMRR',
        description: '产品交易中心，开发者在上面卖自己的产品的平台',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['产品交易', 'MRR出售', '开发者市场', '产品买卖'],
        officialUrl: 'https://trustmrr.com'
      },
      {
        id: 'wordpress',
        name: 'WordPress',
        description: '免费的建站工具，全球超过43%的网站都使用WordPress来建站',
        platforms: ['Web', 'Self-hosted'],
        category: '运营与变现',
        features: ['免费建站', '插件机制', '主题市场', '2800+AI插件', '全球43%市场份额'],
        officialUrl: 'https://wordpress.org'
      },
      {
        id: 'yoast-seo',
        name: 'Yoast SEO',
        description: 'WordPress的SEO插件，有2万多个评论，1个月大概10美金',
        platforms: ['WordPress Plugin'],
        category: '运营与变现',
        features: ['SEO优化', 'WordPress插件', '月入1000美金'],
        officialUrl: 'https://yoast.com'
      },
      {
        id: 'shopify',
        name: 'Shopify',
        description: '电商建站平台，拥有丰富的插件市场',
        platforms: ['Web', 'App'],
        category: '运营与变现',
        features: ['电商建站', '插件市场', '电商工具'],
        officialUrl: 'https://www.shopify.com'
      },
      {
        id: 'notion-plugins',
        name: 'Notion插件市场',
        description: 'Notion插件市场，很多开发者在上面卖自己的Notion插件',
        platforms: ['Notion Plugin'],
        category: '运营与变现',
        features: ['Notion插件', '插件交易', '网站生成器'],
        officialUrl: 'https://www.notion.so'
      },
      {
        id: 'figma-plugins',
        name: 'Figma插件市场',
        description: 'Figma插件市场，设计师和开发者在上面卖自己的Figma插件',
        platforms: ['Figma Plugin'],
        category: '运营与变现',
        features: ['Figma插件', '设计工具', '插件交易'],
        officialUrl: 'https://www.figma.com'
      },
      {
        id: 'shoptop',
        name: 'Shoptop',
        description: '一站式SAAS建站平台，16年海外全媒体营销推广经验，10W+客户信赖',
        platforms: ['Web', 'SAAS'],
        category: '运营与变现',
        features: ['一站式SAAS', '海外营销', '16年经验', '10W+客户'],
        officialUrl: 'https://www.shoptop.com'
      },
      {
        id: 'ai-video-tool',
        name: 'AI一图生成视频',
        description: '图到视频一站式AI工作流，TK投广，量身定制爆款广告视频',
        platforms: ['Web'],
        category: 'AI工具',
        features: ['图生视频', 'TK投广', '0门槛', '低成本', '爆款广告'],
        officialUrl: 'https://example.com'
      },
      {
        id: 'same-new',
        name: 'same.new',
        description: 'AI工具建站工具，使用AI来快速创建网站',
        platforms: ['Web'],
        category: 'AI工具',
        features: ['AI建站', '快速建站', '无代码'],
        officialUrl: 'https://same.new'
      },
      {
        id: 'cross-border-ai-assistant',
        name: '跨境AI助手',
        description: '跨境电商一站式AI工具集合，包含货币交易、跨境信息查询、运营工具、单位换算、文本处理等功能',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['货币交易', '跨境信息查询', '运营工具', '单位换算', '文本处理'],
        officialUrl: 'https://example.com/cross-border'
      },
      {
        id: 'dashu-ai-deepseek',
        name: '大数AI-DeepSeek',
        description: '在线免费使用DeepSeek大模型的AI平台',
        platforms: ['Web'],
        category: '大语言模型',
        features: ['DeepSeek', '在线使用', '免费'],
        officialUrl: 'https://example.com/deepseek'
      },
      {
        id: 'ai-prompt-collection',
        name: 'AI指令大全',
        description: '跨境类AI提示词集合，包含各类跨境场景的提示词',
        platforms: ['Web'],
        category: 'AI提示词',
        features: ['跨境提示词', '提示词大全', '多场景'],
        officialUrl: 'https://example.com/prompts'
      },
      {
        id: 'customer-service-script-generator',
        name: '客服话术智能生成',
        description: '多场景、多语言客服回复模版生成器',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['客服话术', '多场景', '多语言', '智能生成'],
        officialUrl: 'https://example.com/cs-script'
      },
      {
        id: 'culture-taboo-scanner',
        name: '文化禁忌扫描仪',
        description: '文化、政治、宗教等禁忌内容识别工具',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['文化禁忌', '禁忌识别', '内容安全'],
        officialUrl: 'https://example.com/taboo-scanner'
      },
      {
        id: 'platform-prohibited-words-detector',
        name: '平台违禁词检测',
        description: '各个电商、社媒平台违禁词检测工具',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['违禁词检测', '多平台支持', '内容合规'],
        officialUrl: 'https://example.com/prohibited-words'
      },
      {
        id: 'multilingual-tdk-generator',
        name: '多语言TDK生成器',
        description: '根据网站介绍信息生成多语言TDK（标题、描述、关键词）',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['多语言TDK', 'SEO优化', '自动生成'],
        officialUrl: 'https://example.com/tdk-generator'
      },
      {
        id: 'multilingual-tdk-optimizer',
        name: '多语言TDK优化器',
        description: '输入URL和网站信息优化多语言TDK',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['TDK优化', '多语言', 'SEO优化'],
        officialUrl: 'https://example.com/tdk-optimizer'
      },
      {
        id: 'emoji-translator',
        name: 'emoji翻译器',
        description: '提升跨境社交乐趣，多语言文字和emoji互译',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['emoji翻译', '多语言', '社交工具'],
        officialUrl: 'https://example.com/emoji-translator'
      },
      {
        id: 'social-video-script-generator',
        name: '社媒视频脚本生成',
        description: '生成各社媒平台的视频大纲和脚本',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['视频脚本', '社媒平台', '大纲生成'],
        officialUrl: 'https://example.com/video-script'
      },
      {
        id: 'social-post-generator',
        name: '社媒帖子生成器',
        description: '快速的生成想要的社交文案',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['社媒文案', '帖子生成', '快速生成'],
        officialUrl: 'https://example.com/post-generator'
      },
      {
        id: 'product-description-generator',
        name: '产品描述生成器',
        description: 'AI一键生成跨境商品描述',
        platforms: ['Web'],
        category: '运营与变现',
        features: ['商品描述', '跨境电商', 'AI生成'],
        officialUrl: 'https://example.com/product-desc'
      },
      {
        id: 'rmb-exchange-rate',
        name: '人民币外汇牌价',
        description: '实时更新，官方数据的人民币外汇牌价查询',
        platforms: ['Web'],
        category: '货币交易',
        features: ['人民币汇率', '实时更新', '官方数据'],
        officialUrl: 'https://example.com/exchange-rate'
      },
      {
        id: 'one-click-currency-converter',
        name: '一键汇率换算',
        description: '人民币兑换常用币种的一键汇率换算',
        platforms: ['Web'],
        category: '货币交易',
        features: ['汇率换算', '人民币', '常用币种'],
        officialUrl: 'https://example.com/converter'
      },
      {
        id: 'currency-exchange-calculator',
        name: '汇率换算器',
        description: '160+常见货币汇率换算器',
        platforms: ['Web'],
        category: '货币交易',
        features: ['汇率换算器', '160+货币', '多币种支持'],
        officialUrl: 'https://example.com/calculator'
      },
      {
        id: 'paypal-fee-calculator',
        name: 'Paypal手续费计算器',
        description: '美国、英国等国家的Paypal手续费计算',
        platforms: ['Web'],
        category: '货币交易',
        features: ['Paypal手续费', '多国支持', '手续费计算'],
        officialUrl: 'https://example.com/paypal-fee'
      },
      {
        id: 'global-ip-address',
        name: '全球IP地址',
        description: '查询全球范围内的IP，和您的浏览器信息',
        platforms: ['Web'],
        category: '跨境信息查询',
        features: ['IP查询', '全球IP', '浏览器信息'],
        officialUrl: 'https://example.com/global-ip'
      },
      {
        id: 'customs-hs-code',
        name: '海关HS编码',
        description: '实时查询商品的海关信息',
        platforms: ['Web'],
        category: '跨境信息查询',
        features: ['HS编码', '海关查询', '商品信息'],
        officialUrl: 'https://example.com/hs-code'
      },
      {
        id: 'fba-warehouse-query',
        name: 'FBA仓库查询',
        description: '最新，最全FBA仓库大全',
        platforms: ['Web'],
        category: '跨境信息查询',
        features: ['FBA仓库', '仓库查询', '最全数据'],
        officialUrl: 'https://example.com/fba-warehouse'
      },
      {
        id: 'world-capitals',
        name: '世界首都大全',
        description: '首都、代码、经纬等信息查询',
        platforms: ['Web'],
        category: '跨境信息查询',
        features: ['世界首都', '首都信息', '经纬度'],
        officialUrl: 'https://example.com/world-capitals'
      }
    ]
  }
};

// 技能管理器类
class SkillManager {
  constructor() {
    this.skills = new Map();
    this.skillCategories = new Map();
  }
  
  // 初始化
  async init() {
    await this.loadLocalSkills();
    await this.syncRemoteSkills();
    this.startAutoUpdate();
  }
  
  // 加载本地技能
  async loadLocalSkills() {
    // 模拟加载过程，避免访问外部文件系统
  }
  
  // 同步远程技能
  async syncRemoteSkills() {
    // 实现远程技能同步逻辑
  }
  
  // 启动自动更新
  startAutoUpdate() {
    setInterval(async () => {
      await this.syncRemoteSkills();
    }, aiToolsConfig.integration.updateInterval);
  }
  
  // 安装技能
  async installSkill(skillId, platform) {
    try {
      const skill = this.skills.get(skillId);
      if (!skill) {
        return { success: false, message: '技能不存在' };
      }
      
      // 根据平台选择安装方式
      switch (platform) {
        case 'openclaw':
          return await this.installForOpenClaw(skill);
        case 'workbuddy':
          return await this.installForWorkBuddy(skill);
        case 'claude':
          return await this.installForClaude(skill);
        default:
          return { success: false, message: '不支持的平台' };
      }
    } catch (error) {
      logger.error('安装技能失败:', error);
      return { success: false, message: error.message };
    }
  }
  
  // 为OpenClaw安装技能
  async installForOpenClaw(skill) {
    // 模拟安装过程，避免访问外部文件系统
    return { success: true, message: '技能安装成功' };
  }
  
  // 为WorkBuddy安装技能
  async installForWorkBuddy(skill) {
    try {
      const response = await axios.post(`${aiToolsConfig.workbuddy.apiBaseUrl}/skills/install`, {
        skillId: skill.id,
        clientId: aiToolsConfig.workbuddy.clientId,
        clientSecret: aiToolsConfig.workbuddy.clientSecret
      });
      
      return response.data;
    } catch (error) {
      throw new Error('WorkBuddy安装失败');
    }
  }
  
  // 为Claude安装技能
  async installForClaude(skill) {
    // 模拟安装过程，避免访问外部文件系统
    return { success: true, message: '技能安装成功' };
  }
  
  // 获取技能列表
  getSkills(category = null) {
    if (category) {
      const skillIds = this.skillCategories.get(category) || [];
      return skillIds.map(id => this.skills.get(id)).filter(Boolean);
    }
    return Array.from(this.skills.values());
  }
  
  // 获取技能详情
  getSkill(skillId) {
    return this.skills.get(skillId);
  }
  
  // 搜索技能
  searchSkills(query) {
    const results = [];
    for (const skill of this.skills.values()) {
      if (
        skill.name.includes(query) ||
        skill.description.includes(query) ||
        (skill.tags && skill.tags.some(tag => tag.includes(query)))
      ) {
        results.push(skill);
      }
    }
    return results;
  }
}

// 金融数据分析智能体
class FinancialDataAgent {
  constructor() {
    this.agents = {
      workbuddy: null,
      lobsterai: null
    };
    this.init();
  }
  
  // 初始化
  async init() {
    if (aiToolsConfig.workbuddy.enabled) {
      this.agents.workbuddy = await this.initWorkBuddy();
    }
    
    if (aiToolsConfig.lobsterai.enabled) {
      this.agents.lobsterai = await this.initLobsterAI();
    }
    
    console.log('✅ 金融数据分析智能体初始化完成');
  }
  
  // 初始化WorkBuddy
  async initWorkBuddy() {
    try {
      const response = await axios.post(`${aiToolsConfig.workbuddy.apiBaseUrl}/auth`, {
        clientId: aiToolsConfig.workbuddy.clientId,
        clientSecret: aiToolsConfig.workbuddy.clientSecret
      });
      
      return {
        token: response.data.token,
        expiresAt: Date.now() + (response.data.expiresIn * 1000)
      };
    } catch (error) {
      logger.error('初始化WorkBuddy失败:', error);
      return null;
    }
  }
  
  // 初始化LobsterAI
  async initLobsterAI() {
    return {
      apiKey: aiToolsConfig.lobsterai.apiKey
    };
  }
  
  // 数据采集
  async collectData(sources, parameters) {
    try {
      // 优先使用WorkBuddy
      if (this.agents.workbuddy) {
        const response = await axios.post(`${aiToolsConfig.workbuddy.apiBaseUrl}/data/collect`, {
          sources,
          parameters
        }, {
          headers: {
            Authorization: `Bearer ${this.agents.workbuddy.token}`
          }
        });
        
        return response.data;
      }
      
      // 备用使用LobsterAI
      if (this.agents.lobsterai) {
        const response = await axios.post(`${aiToolsConfig.lobsterai.apiBaseUrl}/data/collect`, {
          sources,
          parameters,
          apiKey: this.agents.lobsterai.apiKey
        });
        
        return response.data;
      }
      
      throw new Error('没有可用的数据分析智能体');
    } catch (error) {
      logger.error('数据采集失败:', error);
      throw error;
    }
  }
  
  // 数据分析
  async analyzeData(data, analysisType) {
    try {
      // 优先使用WorkBuddy
      if (this.agents.workbuddy) {
        const response = await axios.post(`${aiToolsConfig.workbuddy.apiBaseUrl}/data/analyze`, {
          data,
          analysisType
        }, {
          headers: {
            Authorization: `Bearer ${this.agents.workbuddy.token}`
          }
        });
        
        return response.data;
      }
      
      // 备用使用LobsterAI
      if (this.agents.lobsterai) {
        const response = await axios.post(`${aiToolsConfig.lobsterai.apiBaseUrl}/data/analyze`, {
          data,
          analysisType,
          apiKey: this.agents.lobsterai.apiKey
        });
        
        return response.data;
      }
      
      throw new Error('没有可用的数据分析智能体');
    } catch (error) {
      logger.error('数据分析失败:', error);
      throw error;
    }
  }
  
  // 生成报告
  async generateReport(analysisResults, reportType) {
    try {
      // 优先使用WorkBuddy
      if (this.agents.workbuddy) {
        const response = await axios.post(`${aiToolsConfig.workbuddy.apiBaseUrl}/report/generate`, {
          analysisResults,
          reportType
        }, {
          headers: {
            Authorization: `Bearer ${this.agents.workbuddy.token}`
          }
        });
        
        return response.data;
      }
      
      // 备用使用LobsterAI
      if (this.agents.lobsterai) {
        const response = await axios.post(`${aiToolsConfig.lobsterai.apiBaseUrl}/report/generate`, {
          analysisResults,
          reportType,
          apiKey: this.agents.lobsterai.apiKey
        });
        
        return response.data;
      }
      
      throw new Error('没有可用的数据分析智能体');
    } catch (error) {
      logger.error('生成报告失败:', error);
      throw error;
    }
  }
}

// 视频内容生成器
class VideoGenerator {
  constructor() {
    this.apiKey = aiToolsConfig.daydream.apiKey;
  }
  
  // 生成市场分析视频
  async generateMarketAnalysisVideo(topic, data, options = {}) {
    try {
      const defaultOptions = {
        format: '1080p',
        duration: 180, // 3分钟
        style: 'professional',
        language: 'zh-CN'
      };
      
      const finalOptions = { ...defaultOptions, ...options };
      
      const response = await axios.post(`${aiToolsConfig.daydream.apiBaseUrl}/video/generate`, {
        topic,
        data,
        options: finalOptions,
        apiKey: this.apiKey
      });
      
      return response.data;
    } catch (error) {
      logger.error('生成视频失败:', error);
      throw error;
    }
  }
  
  // 生成教程视频
  async generateTutorialVideo(topic, steps, options = {}) {
    try {
      const defaultOptions = {
        format: '720p',
        duration: 240, // 4分钟
        style: 'educational',
        language: 'zh-CN'
      };
      
      const finalOptions = { ...defaultOptions, ...options };
      
      const response = await axios.post(`${aiToolsConfig.daydream.apiBaseUrl}/video/generate`, {
        topic,
        steps,
        options: finalOptions,
        apiKey: this.apiKey
      });
      
      return response.data;
    } catch (error) {
      logger.error('生成教程视频失败:', error);
      throw error;
    }
  }
  
  // 获取视频状态
  async getVideoStatus(videoId) {
    try {
      const response = await axios.get(`${aiToolsConfig.daydream.apiBaseUrl}/video/status`, {
        params: {
          videoId,
          apiKey: this.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      logger.error('获取视频状态失败:', error);
      throw error;
    }
  }
  
  // 下载视频
  async downloadVideo(videoId) {
    try {
      const response = await axios.get(`${aiToolsConfig.daydream.apiBaseUrl}/video/download`, {
        params: {
          videoId,
          apiKey: this.apiKey
        },
        responseType: 'stream'
      });
      
      return response.data;
    } catch (error) {
      logger.error('下载视频失败:', error);
      throw error;
    }
  }
}

// AI工具集成管理器
const aiToolsManager = {
  aiToolsConfig,
  skillManager: new SkillManager(),
  financialAgent: new FinancialDataAgent(),
  videoGenerator: new VideoGenerator(),
  
  // 初始化
  async initialize(app) {
    // 注册API路由
    this.registerRoutes(app);
    
    // 初始化各个模块
    await this.skillManager.init();
    await this.financialAgent.init();
    
    console.log('✅ AI工具集成模块已初始化');
  },
  
  // 注册路由
  registerRoutes(app) {
    // 技能管理路由
    app.get('/api/ai/skills', async (req, res) => {
      const category = req.query.category;
      const skills = this.skillManager.getSkills(category);
      res.json({ success: true, data: skills });
    });
    
    app.get('/api/ai/skills/:id', (req, res) => {
      const skill = this.skillManager.getSkill(req.params.id);
      if (skill) {
        res.json({ success: true, data: skill });
      } else {
        res.json({ success: false, message: '技能不存在' });
      }
    });
    
    app.post('/api/ai/skills/install', async (req, res) => {
      const { skillId, platform } = req.body;
      const result = await this.skillManager.installSkill(skillId, platform);
      res.json(result);
    });
    
    app.get('/api/ai/skills/search', (req, res) => {
      const query = req.query.q;
      const results = this.skillManager.searchSkills(query);
      res.json({ success: true, data: results });
    });
    
    // 金融数据分析路由
    app.post('/api/ai/financial/collect', async (req, res) => {
      try {
        const { sources, parameters } = req.body;
        const result = await this.financialAgent.collectData(sources, parameters);
        res.json({ success: true, data: result });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });
    
    app.post('/api/ai/financial/analyze', async (req, res) => {
      try {
        const { data, analysisType } = req.body;
        const result = await this.financialAgent.analyzeData(data, analysisType);
        res.json({ success: true, data: result });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });
    
    app.post('/api/ai/financial/report', async (req, res) => {
      try {
        const { analysisResults, reportType } = req.body;
        const result = await this.financialAgent.generateReport(analysisResults, reportType);
        res.json({ success: true, data: result });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });
    
    // 视频生成路由
    app.post('/api/ai/video/generate', async (req, res) => {
      try {
        const { topic, data, options, type } = req.body;
        let result;
        
        if (type === 'tutorial') {
          result = await this.videoGenerator.generateTutorialVideo(topic, data, options);
        } else {
          result = await this.videoGenerator.generateMarketAnalysisVideo(topic, data, options);
        }
        
        res.json({ success: true, data: result });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });
    
    app.get('/api/ai/video/status/:id', async (req, res) => {
      try {
        const result = await this.videoGenerator.getVideoStatus(req.params.id);
        res.json({ success: true, data: result });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });
    
    app.get('/api/ai/video/download/:id', async (req, res) => {
      try {
        const stream = await this.videoGenerator.downloadVideo(req.params.id);
        res.setHeader('Content-Type', 'video/mp4');
        stream.pipe(res);
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });
  },
  
  // 获取配置
  getConfig() {
    return this.aiToolsConfig;
  },
  
  // 更新配置
  updateConfig(config) {
    this.aiToolsConfig = { ...this.aiToolsConfig, ...config };
  }
};

module.exports = aiToolsManager;