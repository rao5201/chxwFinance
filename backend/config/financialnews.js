// 金融新闻网配置文件
const axios = require('axios');

// 金融新闻网配置
const financialNews = {
  // API基础配置
  config: {
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 通用请求函数
  request: async function(url, params) {
    try {
      const response = await axios.get(url, {
        params,
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`请求错误: ${error.message}`);
    }
  },
  
  // 带重试的请求
  requestWithRetry: async function(url, params, retry = 0) {
    try {
      return await this.request(url, params);
    } catch (error) {
      if (retry < this.config.retryCount) {
        console.log(`请求失败，重试 (${retry + 1}/${this.config.retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.requestWithRetry(url, params, retry + 1);
      }
      throw error;
    }
  },
  
  // 获取首页数据
  getHomepage: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockHomepage();
    } catch (error) {
      console.error('获取首页数据失败:', error);
      return this.getMockHomepage();
    }
  },
  
  // 获取金融管理数据
  getFinancialManagement: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockFinancialManagement();
    } catch (error) {
      console.error('获取金融管理数据失败:', error);
      return this.getMockFinancialManagement();
    }
  },
  
  // 获取要闻数据
  getHeadlines: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockHeadlines();
    } catch (error) {
      console.error('获取要闻数据失败:', error);
      return this.getMockHeadlines();
    }
  },
  
  // 获取评论数据
  getComments: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockComments();
    } catch (error) {
      console.error('获取评论数据失败:', error);
      return this.getMockComments();
    }
  },
  
  // 获取深度数据
  getDepth: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockDepth();
    } catch (error) {
      console.error('获取深度数据失败:', error);
      return this.getMockDepth();
    }
  },
  
  // 获取银行数据
  getBanking: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockBanking();
    } catch (error) {
      console.error('获取银行数据失败:', error);
      return this.getMockBanking();
    }
  },
  
  // 获取证券数据
  getSecurities: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockSecurities();
    } catch (error) {
      console.error('获取证券数据失败:', error);
      return this.getMockSecurities();
    }
  },
  
  // 获取保险数据
  getInsurance: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockInsurance();
    } catch (error) {
      console.error('获取保险数据失败:', error);
      return this.getMockInsurance();
    }
  },
  
  // 获取国际数据
  getInternational: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockInternational();
    } catch (error) {
      console.error('获取国际数据失败:', error);
      return this.getMockInternational();
    }
  },
  
  // 获取地方数据
  getLocal: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockLocal();
    } catch (error) {
      console.error('获取地方数据失败:', error);
      return this.getMockLocal();
    }
  },
  
  // 获取公司数据
  getCompany: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockCompany();
    } catch (error) {
      console.error('获取公司数据失败:', error);
      return this.getMockCompany();
    }
  },
  
  // 获取理论数据
  getTheory: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockTheory();
    } catch (error) {
      console.error('获取理论数据失败:', error);
      return this.getMockTheory();
    }
  },
  
  // 获取金融科技数据
  getFintech: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockFintech();
    } catch (error) {
      console.error('获取金融科技数据失败:', error);
      return this.getMockFintech();
    }
  },
  
  // 获取农村金融数据
  getRuralFinance: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockRuralFinance();
    } catch (error) {
      console.error('获取农村金融数据失败:', error);
      return this.getMockRuralFinance();
    }
  },
  
  // 获取可视化数据
  getVisualization: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockVisualization();
    } catch (error) {
      console.error('获取可视化数据失败:', error);
      return this.getMockVisualization();
    }
  },
  
  // 获取文化数据
  getCulture: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockCulture();
    } catch (error) {
      console.error('获取文化数据失败:', error);
      return this.getMockCulture();
    }
  },
  
  // 获取信批平台数据
  getDisclosurePlatform: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockDisclosurePlatform();
    } catch (error) {
      console.error('获取信批平台数据失败:', error);
      return this.getMockDisclosurePlatform();
    }
  },
  
  // 获取中国金融家数据
  getChineseFinancier: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockChineseFinancier();
    } catch (error) {
      console.error('获取中国金融家数据失败:', error);
      return this.getMockChineseFinancier();
    }
  },
  
  // 获取专题数据
  getSpecialTopic: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockSpecialTopic();
    } catch (error) {
      console.error('获取专题数据失败:', error);
      return this.getMockSpecialTopic();
    }
  },
  
  // 获取品牌数据
  getBrand: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockBrand();
    } catch (error) {
      console.error('获取品牌数据失败:', error);
      return this.getMockBrand();
    }
  },
  
  // 获取中债-收益率曲线数据
  getBondYieldCurve: async function() {
    try {
      // 实际项目中需要根据金融新闻网的API接口进行调整
      return this.getMockBondYieldCurve();
    } catch (error) {
      console.error('获取中债-收益率曲线数据失败:', error);
      return this.getMockBondYieldCurve();
    }
  },
  
  // 模拟首页数据
  getMockHomepage: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '金融管理要闻：央行发布最新货币政策',
            summary: '央行今日发布最新货币政策，强调保持流动性合理充裕，引导市场利率下行。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/home/123456'
          },
          {
            id: '2',
            title: '银行业绩普遍向好，净利润同比增长15%',
            summary: '上市银行2025年年报显示，银行业整体业绩普遍向好，净利润同比增长15%。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/home/123457'
          },
          {
            id: '3',
            title: '金融科技发展迅速，AI在金融领域应用广泛',
            summary: '金融科技发展迅速，人工智能在风险控制、客户服务等领域应用广泛。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.financialnews.com.cn/home/123458'
          }
        ]
      }
    };
  },
  
  // 模拟金融管理数据
  getMockFinancialManagement: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '央行：保持货币政策稳健中性',
            summary: '央行表示，将保持货币政策稳健中性，为经济高质量发展营造适宜的货币金融环境。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/financial-management/123456'
          },
          {
            id: '2',
            title: '银保监会：加强银行业保险业风险防控',
            summary: '银保监会要求加强银行业保险业风险防控，确保金融体系安全稳定。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/financial-management/123457'
          }
        ]
      }
    };
  },
  
  // 模拟要闻数据
  getMockHeadlines: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '国务院：进一步深化金融改革',
            summary: '国务院发布关于进一步深化金融改革的意见，推动金融更好服务实体经济。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/headlines/123456'
          },
          {
            id: '2',
            title: '财政部：加大财政支持力度，促进经济发展',
            summary: '财政部表示，将加大财政支持力度，促进经济平稳健康发展。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/headlines/123457'
          }
        ]
      }
    };
  },
  
  // 模拟评论数据
  getMockComments: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        comments: [
          {
            id: '1',
            title: '专家评论：金融科技将重塑金融生态',
            author: '张明',
            content: '金融科技的发展将重塑金融生态，推动金融服务向更加智能化、个性化方向发展。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/comments/123456'
          },
          {
            id: '2',
            title: '学者观点：防范化解金融风险的关键',
            author: '李华',
            content: '防范化解金融风险的关键在于建立健全风险防控体系，加强监管协调。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/comments/123457'
          }
        ]
      }
    };
  },
  
  // 模拟深度数据
  getMockDepth: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        articles: [
          {
            id: '1',
            title: '深度分析：中国金融市场改革的路径与挑战',
            summary: '本文深入分析了中国金融市场改革的路径与挑战，提出了相关政策建议。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/depth/123456'
          },
          {
            id: '2',
            title: '银行业数字化转型的现状与未来',
            summary: '银行业数字化转型已成为行业共识，本文分析了转型的现状与未来发展趋势。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.financialnews.com.cn/depth/123457'
          }
        ]
      }
    };
  },
  
  // 模拟银行数据
  getMockBanking: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '银行业绩快报：2025年净利润同比增长12%',
            summary: '上市银行2025年业绩快报显示，整体净利润同比增长12%，资产质量持续改善。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/banking/123456'
          },
          {
            id: '2',
            title: '银行加大对实体经济的支持力度',
            summary: '银行业加大对实体经济的支持力度，特别是对小微企业和制造业的信贷投放。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/banking/123457'
          }
        ]
      }
    };
  },
  
  // 模拟证券数据
  getMockSecurities: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: 'A股市场震荡上行，沪指突破3500点',
            summary: 'A股市场震荡上行，沪指突破3500点，市场情绪明显好转。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/securities/123456'
          },
          {
            id: '2',
            title: '证监会：进一步提高上市公司质量',
            summary: '证监会表示，将进一步提高上市公司质量，加强信息披露监管。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/securities/123457'
          }
        ]
      }
    };
  },
  
  // 模拟保险数据
  getMockInsurance: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '保险业保费收入稳步增长，2025年突破5万亿元',
            summary: '保险业保费收入稳步增长，2025年突破5万亿元，保障能力持续增强。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/insurance/123456'
          },
          {
            id: '2',
            title: '银保监会：规范保险市场秩序，保护消费者权益',
            summary: '银保监会发布通知，要求规范保险市场秩序，切实保护消费者权益。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/insurance/123457'
          }
        ]
      }
    };
  },
  
  // 模拟国际数据
  getMockInternational: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '全球经济复苏态势良好，IMF上调全球经济增长预期',
            summary: '全球经济复苏态势良好，IMF上调2026年全球经济增长预期至4.5%。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/international/123456'
          },
          {
            id: '2',
            title: '美联储维持利率不变，市场预期年内可能降息',
            summary: '美联储维持利率不变，市场预期年内可能降息，全球资本市场反应积极。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/international/123457'
          }
        ]
      }
    };
  },
  
  // 模拟地方数据
  getMockLocal: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '长三角金融一体化进程加速，区域金融合作深化',
            summary: '长三角金融一体化进程加速，区域金融合作不断深化，金融服务实体经济能力增强。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/local/123456'
          },
          {
            id: '2',
            title: '粤港澳大湾区金融创新成效显著',
            summary: '粤港澳大湾区金融创新成效显著，跨境金融业务稳步发展。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/local/123457'
          }
        ]
      }
    };
  },
  
  // 模拟公司数据
  getMockCompany: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '大型金融机构2025年业绩亮眼，创新业务成为新增长点',
            summary: '大型金融机构2025年业绩亮眼，创新业务成为新的利润增长点。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/company/123456'
          },
          {
            id: '2',
            title: '金融科技公司加速上市，资本市场热度高',
            summary: '金融科技公司加速上市，资本市场对金融科技概念热度持续高涨。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/company/123457'
          }
        ]
      }
    };
  },
  
  // 模拟理论数据
  getMockTheory: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        articles: [
          {
            id: '1',
            title: '金融理论前沿：数字金融的发展与挑战',
            author: '王教授',
            summary: '本文探讨了数字金融的发展历程、现状及面临的挑战，提出了相关理论框架。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/theory/123456'
          },
          {
            id: '2',
            title: '金融监管理论的新发展',
            author: '刘研究员',
            summary: '本文分析了金融监管理论的最新发展，为完善我国金融监管体系提供了理论支撑。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.financialnews.com.cn/theory/123457'
          }
        ]
      }
    };
  },
  
  // 模拟金融科技数据
  getMockFintech: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '金融科技发展报告：2025年市场规模突破20万亿元',
            summary: '《金融科技发展报告》显示，2025年我国金融科技市场规模突破20万亿元，增速保持在20%以上。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/fintech/123456'
          },
          {
            id: '2',
            title: 'AI在金融领域的应用日益广泛，智能投顾成新热点',
            summary: '人工智能在金融领域的应用日益广泛，智能投顾成为新的发展热点。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/fintech/123457'
          }
        ]
      }
    };
  },
  
  // 模拟农村金融数据
  getMockRuralFinance: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '农村金融服务体系不断完善，助力乡村振兴',
            summary: '农村金融服务体系不断完善，金融机构加大对乡村振兴的支持力度。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/rural-finance/123456'
          },
          {
            id: '2',
            title: '数字普惠金融在农村地区快速发展',
            summary: '数字普惠金融在农村地区快速发展，有效解决了农村金融服务最后一公里问题。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/rural-finance/123457'
          }
        ]
      }
    };
  },
  
  // 模拟可视化数据
  getMockVisualization: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        visualizations: [
          {
            id: '1',
            title: '2025年金融市场数据可视化',
            description: '通过图表形式展示2025年金融市场的各项数据指标。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/visualization/123456'
          },
          {
            id: '2',
            title: '银行业发展趋势可视化',
            description: '通过可视化方式展示银行业近年来的发展趋势。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.financialnews.com.cn/visualization/123457'
          }
        ]
      }
    };
  },
  
  // 模拟文化数据
  getMockCulture: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '金融文化建设成效显著，行业软实力提升',
            summary: '金融文化建设成效显著，行业软实力不断提升，为金融发展提供了精神动力。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/culture/123456'
          },
          {
            id: '2',
            title: '金融博物馆：记录金融发展历程',
            summary: '金融博物馆通过丰富的展品，记录了中国金融发展的历程，成为金融文化传播的重要载体。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/culture/123457'
          }
        ]
      }
    };
  },
  
  // 模拟信批平台数据
  getMockDisclosurePlatform: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        disclosures: [
          {
            id: '1',
            title: '上市公司信息披露质量不断提高',
            summary: '上市公司信息披露质量不断提高，透明度和及时性得到显著改善。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/disclosure-platform/123456'
          },
          {
            id: '2',
            title: '信批平台功能升级，用户体验优化',
            summary: '信批平台功能升级，用户体验优化，为投资者提供更加便捷的信息获取渠道。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/disclosure-platform/123457'
          }
        ]
      }
    };
  },
  
  // 模拟中国金融家数据
  getMockChineseFinancier: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        articles: [
          {
            id: '1',
            title: '中国金融家：引领金融改革与创新',
            summary: '本文介绍了中国金融家在金融改革与创新中的重要作用和贡献。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/chinese-financier/123456'
          },
          {
            id: '2',
            title: '金融家访谈：探讨金融科技发展趋势',
            summary: '专访知名金融家，探讨金融科技发展趋势和未来方向。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.financialnews.com.cn/chinese-financier/123457'
          }
        ]
      }
    };
  },
  
  // 模拟专题数据
  getMockSpecialTopic: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        topics: [
          {
            id: '1',
            title: '金融科技专题：数字金融的未来',
            description: '深入探讨数字金融的发展现状、趋势和未来挑战。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/special-topic/123456'
          },
          {
            id: '2',
            title: '银行业改革专题：转型与创新',
            description: '分析银行业改革的历程、现状和未来发展方向。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.financialnews.com.cn/special-topic/123457'
          }
        ]
      }
    };
  },
  
  // 模拟品牌数据
  getMockBrand: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        brands: [
          {
            id: '1',
            title: '金融品牌建设：打造核心竞争力',
            summary: '金融机构品牌建设日益重要，成为提升核心竞争力的关键因素。',
            publishTime: new Date().toISOString(),
            url: 'https://www.financialnews.com.cn/brand/123456'
          },
          {
            id: '2',
            title: '金融品牌价值评估报告发布',
            summary: '《金融品牌价值评估报告》发布，多家金融机构品牌价值大幅提升。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.financialnews.com.cn/brand/123457'
          }
        ]
      }
    };
  },
  
  // 模拟中债-收益率曲线数据
  getMockBondYieldCurve: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        curveData: [
          {
            term: '1个月',
            yield: 1.5,
            change: 0.02
          },
          {
            term: '3个月',
            yield: 1.6,
            change: 0.01
          },
          {
            term: '6个月',
            yield: 1.7,
            change: 0.00
          },
          {
            term: '1年',
            yield: 1.8,
            change: -0.01
          },
          {
            term: '2年',
            yield: 2.0,
            change: -0.02
          },
          {
            term: '3年',
            yield: 2.2,
            change: -0.03
          },
          {
            term: '5年',
            yield: 2.4,
            change: -0.02
          },
          {
            term: '7年',
            yield: 2.6,
            change: -0.01
          },
          {
            term: '10年',
            yield: 2.8,
            change: 0.00
          },
          {
            term: '30年',
            yield: 3.0,
            change: 0.01
          }
        ],
        historicalData: [
          {
            date: '2026-04-02',
            yields: {
              '1年': 1.81,
              '5年': 2.42,
              '10年': 2.80
            }
          },
          {
            date: '2026-04-01',
            yields: {
              '1年': 1.82,
              '5年': 2.43,
              '10年': 2.80
            }
          },
          {
            date: '2026-03-31',
            yields: {
              '1年': 1.83,
              '5年': 2.44,
              '10年': 2.81
            }
          }
        ]
      }
    };
  }
};

module.exports = financialNews;