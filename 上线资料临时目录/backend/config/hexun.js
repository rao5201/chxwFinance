// 和讯在线配置文件
const axios = require('axios');

// 和讯在线配置
const hexun = {
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
  
  // 获取新闻时事
  getNews: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockNews();
    } catch (error) {
      console.error('获取新闻时事失败:', error);
      return this.getMockNews();
    }
  },
  
  // 获取股票7×24
  getStock7x24: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockStock7x24();
    } catch (error) {
      console.error('获取股票7×24失败:', error);
      return this.getMockStock7x24();
    }
  },
  
  // 获取港股脱水
  getHongKongStock: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockHongKongStock();
    } catch (error) {
      console.error('获取港股脱水失败:', error);
      return this.getMockHongKongStock();
    }
  },
  
  // 获取基金财富
  getFundWealth: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockFundWealth();
    } catch (error) {
      console.error('获取基金财富失败:', error);
      return this.getMockFundWealth();
    }
  },
  
  // 获取理财路演
  getWealthRoadshow: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockWealthRoadshow();
    } catch (error) {
      console.error('获取理财路演失败:', error);
      return this.getMockWealthRoadshow();
    }
  },
  
  // 获取IPO资讯
  getIPO: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockIPO();
    } catch (error) {
      console.error('获取IPO资讯失败:', error);
      return this.getMockIPO();
    }
  },
  
  // 获取科技资讯
  getTechnology: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockTechnology();
    } catch (error) {
      console.error('获取科技资讯失败:', error);
      return this.getMockTechnology();
    }
  },
  
  // 获取债券资讯
  getBond: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockBond();
    } catch (error) {
      console.error('获取债券资讯失败:', error);
      return this.getMockBond();
    }
  },
  
  // 获取消费资讯
  getConsumer: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockConsumer();
    } catch (error) {
      console.error('获取消费资讯失败:', error);
      return this.getMockConsumer();
    }
  },
  
  // 获取期货资讯
  getFutures: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockFutures();
    } catch (error) {
      console.error('获取期货资讯失败:', error);
      return this.getMockFutures();
    }
  },
  
  // 获取美股资讯
  getUSStock: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockUSStock();
    } catch (error) {
      console.error('获取美股资讯失败:', error);
      return this.getMockUSStock();
    }
  },
  
  // 获取大宗期指
  getBulkIndex: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockBulkIndex();
    } catch (error) {
      console.error('获取大宗期指失败:', error);
      return this.getMockBulkIndex();
    }
  },
  
  // 获取保险资讯
  getInsurance: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockInsurance();
    } catch (error) {
      console.error('获取保险资讯失败:', error);
      return this.getMockInsurance();
    }
  },
  
  // 获取银行资讯
  getBank: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockBank();
    } catch (error) {
      console.error('获取银行资讯失败:', error);
      return this.getMockBank();
    }
  },
  
  // 获取黄金外汇
  getGoldForex: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockGoldForex();
    } catch (error) {
      console.error('获取黄金外汇失败:', error);
      return this.getMockGoldForex();
    }
  },
  
  // 获取汽车行情
  getAutoMarket: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockAutoMarket();
    } catch (error) {
      console.error('获取汽车行情失败:', error);
      return this.getMockAutoMarket();
    }
  },
  
  // 获取房产物业
  getRealEstate: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockRealEstate();
    } catch (error) {
      console.error('获取房产物业失败:', error);
      return this.getMockRealEstate();
    }
  },
  
  // 获取数据管理
  getDataManagement: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockDataManagement();
    } catch (error) {
      console.error('获取数据管理失败:', error);
      return this.getMockDataManagement();
    }
  },
  
  // 获取名家滚动
  getFamousExperts: async function() {
    try {
      // 实际项目中需要根据和讯在线的API接口进行调整
      return this.getMockFamousExperts();
    } catch (error) {
      console.error('获取名家滚动失败:', error);
      return this.getMockFamousExperts();
    }
  },
  
  // 模拟新闻时事
  getMockNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '央行：保持流动性合理充裕',
            summary: '中国人民银行表示，将保持流动性合理充裕，引导市场利率下行，支持实体经济发展。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/news/123456'
          },
          {
            id: '2',
            title: '国务院：进一步扩大内需促进消费',
            summary: '国务院发布关于进一步扩大内需促进消费的意见，提出多项措施刺激消费。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/news/123457'
          },
          {
            id: '3',
            title: '财政部：加大减税降费力度',
            summary: '财政部表示，将继续加大减税降费力度，减轻企业负担，促进经济增长。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.hexun.com/news/123458'
          }
        ]
      }
    };
  },
  
  // 模拟股票7×24
  getMockStock7x24: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: 'A股三大指数集体上涨，科技股表现强势',
            summary: '今日A股三大指数集体上涨，上证指数上涨0.67%，深证成指上涨1.23%，创业板指上涨1.81%，科技股表现强势。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/stock/7x24/123456'
          },
          {
            id: '2',
            title: '北向资金净流入56.78亿元，连续3日净流入',
            summary: '今日北向资金净流入56.78亿元，连续3日净流入，主要流入科技、医药等板块。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/stock/7x24/123457'
          },
          {
            id: '3',
            title: '贵州茅台股价创历史新高，市值突破3万亿元',
            summary: '贵州茅台股价今日创历史新高，市值突破3万亿元，成为A股市场市值最高的公司。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.hexun.com/stock/7x24/123458'
          }
        ]
      }
    };
  },
  
  // 模拟港股脱水
  getMockHongKongStock: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        stocks: [
          {
            id: '1',
            stockCode: '00700',
            stockName: '腾讯控股',
            price: 456.80,
            change: 5.60,
            changePercent: 1.24,
            volume: 12345678,
            turnover: 5678901234
          },
          {
            id: '2',
            stockCode: '00939',
            stockName: '建设银行',
            price: 5.67,
            change: 0.08,
            changePercent: 1.43,
            volume: 8976543,
            turnover: 509012345
          },
          {
            id: '3',
            stockCode: '03690',
            stockName: '美团-W',
            price: 189.50,
            change: 3.20,
            changePercent: 1.72,
            volume: 5678901,
            turnover: 1077243839
          }
        ],
        news: [
          {
            id: '1',
            title: '港股恒指上涨1.23%，科技股领涨',
            summary: '今日港股恒指上涨1.23%，科技股领涨，腾讯控股、美团等个股表现强势。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/hkstock/123456'
          }
        ]
      }
    };
  },
  
  // 模拟基金财富
  getMockFundWealth: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        funds: [
          {
            id: '1',
            fundCode: '110022',
            fundName: '易方达消费行业股票',
            netValue: 3.2567,
            dayChange: 0.0567,
            dayChangePercent: 1.77,
            weekChangePercent: 3.25,
            monthChangePercent: 5.67,
            yearChangePercent: 12.34
          },
          {
            id: '2',
            fundCode: '000001',
            fundName: '华夏成长混合',
            netValue: 2.1567,
            dayChange: 0.0345,
            dayChangePercent: 1.62,
            weekChangePercent: 2.89,
            monthChangePercent: 4.98,
            yearChangePercent: 10.23
          },
          {
            id: '3',
            fundCode: '161005',
            fundName: '富国天惠成长混合A',
            netValue: 4.5678,
            dayChange: 0.0789,
            dayChangePercent: 1.75,
            weekChangePercent: 3.56,
            monthChangePercent: 6.23,
            yearChangePercent: 14.56
          }
        ],
        news: [
          {
            id: '1',
            title: '基金净值普遍上涨，科技类基金表现突出',
            summary: '今日基金净值普遍上涨，科技类基金表现突出，多只基金净值涨幅超过2%。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/fund/123456'
          }
        ]
      }
    };
  },
  
  // 模拟理财路演
  getMockWealthRoadshow: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        roadshows: [
          {
            id: '1',
            title: '2026年投资策略展望',
            speaker: '张教授',
            time: '2026-04-05 14:00',
            platform: '线上直播',
            url: 'https://www.hexun.com/roadshow/123456'
          },
          {
            id: '2',
            title: '基金投资实战技巧',
            speaker: '李经理',
            time: '2026-04-10 15:00',
            platform: '线上直播',
            url: 'https://www.hexun.com/roadshow/123457'
          },
          {
            id: '3',
            title: '家庭资产配置策略',
            speaker: '王顾问',
            time: '2026-04-15 16:00',
            platform: '线上直播',
            url: 'https://www.hexun.com/roadshow/123458'
          }
        ]
      }
    };
  },
  
  // 模拟IPO资讯
  getMockIPO: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        ipos: [
          {
            id: '1',
            stockCode: '688999',
            stockName: '新股A',
            issuePrice: 25.67,
            listingDate: '2026-04-10',
            industry: '科技',
            underwriter: '中信证券',
            subscriptionDate: '2026-04-05',
            subscriptionCode: '787999'
          },
          {
            id: '2',
            stockCode: '301999',
            stockName: '新股B',
            issuePrice: 18.90,
            listingDate: '2026-04-15',
            industry: '医药',
            underwriter: '国泰君安',
            subscriptionDate: '2026-04-10',
            subscriptionCode: '301999'
          }
        ],
        news: [
          {
            id: '1',
            title: '证监会：进一步优化IPO审核流程',
            summary: '证监会表示，将进一步优化IPO审核流程，提高审核效率，支持优质企业上市。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/ipo/123456'
          }
        ]
      }
    };
  },
  
  // 模拟科技资讯
  getMockTechnology: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '人工智能概念股持续上涨，多只个股涨停',
            summary: '今日人工智能概念股持续上涨，多只个股涨停，行业景气度持续提升。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/tech/123456'
          },
          {
            id: '2',
            title: '芯片行业景气度持续提升，国产替代进程加速',
            summary: '芯片行业景气度持续提升，国产替代进程加速，相关公司业绩有望超预期。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/tech/123457'
          }
        ]
      }
    };
  },
  
  // 模拟债券资讯
  getMockBond: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        bonds: [
          {
            id: '1',
            bondCode: '101800',
            bondName: '国债1800',
            price: 102.56,
            yield: 2.85,
            maturity: '2030-04-03'
          },
          {
            id: '2',
            bondCode: '101801',
            bondName: '国债1801',
            price: 101.23,
            yield: 2.95,
            maturity: '2035-04-03'
          }
        ],
        news: [
          {
            id: '1',
            title: '债券市场收益率持续下行，配置价值凸显',
            summary: '债券市场收益率持续下行，配置价值凸显，机构投资者积极布局。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/bond/123456'
          }
        ]
      }
    };
  },
  
  // 模拟消费资讯
  getMockConsumer: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '消费市场持续回暖，零售数据超预期',
            summary: '消费市场持续回暖，3月零售数据超预期，消费板块表现活跃。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/consumer/123456'
          },
          {
            id: '2',
            title: '新能源汽车销量持续增长，渗透率突破30%',
            summary: '今年3月新能源汽车销量持续增长，渗透率突破30%，行业发展前景广阔。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/consumer/123457'
          }
        ]
      }
    };
  },
  
  // 模拟期货资讯
  getMockFutures: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        futures: [
          {
            id: '1',
            symbol: 'GC',
            name: '黄金',
            price: 2345.67,
            change: 12.34,
            changePercent: 0.53,
            high: 2350.00,
            low: 2330.00
          },
          {
            id: '2',
            symbol: 'CL',
            name: 'WTI原油',
            price: 78.90,
            change: -0.56,
            changePercent: -0.70,
            high: 79.50,
            low: 78.50
          }
        ],
        news: [
          {
            id: '1',
            title: '原油价格上涨，因中东地缘政治紧张加剧',
            summary: '原油价格上涨，因中东地缘政治紧张加剧，市场担心供应中断。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/futures/123456'
          }
        ]
      }
    };
  },
  
  // 模拟美股资讯
  getMockUSStock: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        stocks: [
          {
            id: '1',
            symbol: 'AAPL',
            name: '苹果',
            price: 189.50,
            change: 2.30,
            changePercent: 1.23,
            volume: 45678901
          },
          {
            id: '2',
            symbol: 'MSFT',
            name: '微软',
            price: 423.67,
            change: 5.67,
            changePercent: 1.36,
            volume: 34567890
          }
        ],
        news: [
          {
            id: '1',
            title: '美股三大指数集体上涨，科技股表现强势',
            summary: '昨日美股三大指数集体上涨，道指上涨0.5%，纳指上涨1.2%，标普500上涨0.8%，科技股表现强势。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/usstock/123456'
          }
        ]
      }
    };
  },
  
  // 模拟大宗期指
  getMockBulkIndex: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        bulk: [
          {
            id: '1',
            symbol: 'CU',
            name: '铜',
            price: 43250,
            change: 560,
            changePercent: 1.31
          },
          {
            id: '2',
            symbol: 'AL',
            name: '铝',
            price: 18560,
            change: 230,
            changePercent: 1.26
          }
        ],
        indices: [
          {
            id: '1',
            symbol: 'IF',
            name: '沪深300股指期货',
            price: 4567.89,
            change: 56.78,
            changePercent: 1.26
          },
          {
            id: '2',
            symbol: 'IH',
            name: '上证50股指期货',
            price: 3245.67,
            change: 34.56,
            changePercent: 1.08
          }
        ]
      }
    };
  },
  
  // 模拟保险资讯
  getMockInsurance: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '保险行业保费收入持续增长，行业景气度提升',
            summary: '保险行业保费收入持续增长，行业景气度提升，相关公司业绩有望改善。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/insurance/123456'
          },
          {
            id: '2',
            title: '银保监会：进一步规范保险市场秩序',
            summary: '银保监会表示，将进一步规范保险市场秩序，保护消费者合法权益。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/insurance/123457'
          }
        ]
      }
    };
  },
  
  // 模拟银行资讯
  getMockBank: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '银行业绩普遍增长，资产质量持续改善',
            summary: '银行业绩普遍增长，资产质量持续改善，行业估值有望修复。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/bank/123456'
          },
          {
            id: '2',
            title: '央行：保持流动性合理充裕，引导市场利率下行',
            summary: '央行表示，将保持流动性合理充裕，引导市场利率下行，支持实体经济发展。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/bank/123457'
          }
        ]
      }
    };
  },
  
  // 模拟黄金外汇
  getMockGoldForex: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        gold: [
          {
            id: '1',
            symbol: 'XAU/USD',
            name: '国际黄金',
            price: 2345.67,
            change: 12.34,
            changePercent: 0.53
          }
        ],
        forex: [
          {
            id: '1',
            symbol: 'USD/CNY',
            name: '美元/人民币',
            price: 7.2568,
            change: 0.0032,
            changePercent: 0.04
          },
          {
            id: '2',
            symbol: 'EUR/USD',
            name: '欧元/美元',
            price: 1.0876,
            change: 0.0034,
            changePercent: 0.31
          }
        ]
      }
    };
  },
  
  // 模拟汽车行情
  getMockAutoMarket: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '3月汽车销量同比增长15.6%，新能源汽车渗透率突破30%',
            summary: '3月汽车销量同比增长15.6%，新能源汽车渗透率突破30%，行业复苏明显。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/auto/123456'
          },
          {
            id: '2',
            title: '多家车企发布新车型，市场竞争加剧',
            summary: '多家车企发布新车型，市场竞争加剧，消费者选择更加多样化。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/auto/123457'
          }
        ]
      }
    };
  },
  
  // 模拟房产物业
  getMockRealEstate: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '房地产市场企稳回升，多地出台支持政策',
            summary: '房地产市场企稳回升，多地出台支持政策，市场信心逐步恢复。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/realestate/123456'
          },
          {
            id: '2',
            title: '一线城市房价环比上涨，二三线城市稳中有升',
            summary: '一线城市房价环比上涨，二三线城市稳中有升，市场分化明显。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/realestate/123457'
          }
        ]
      }
    };
  },
  
  // 模拟数据管理
  getMockDataManagement: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        data: [
          {
            id: '1',
            name: '宏观经济数据',
            description: '包括GDP、CPI、PPI等宏观经济指标',
            url: 'https://www.hexun.com/data/macro/123456'
          },
          {
            id: '2',
            name: '行业数据',
            description: '包括各行业的生产、销售、利润等数据',
            url: 'https://www.hexun.com/data/industry/123457'
          },
          {
            id: '3',
            name: '公司数据',
            description: '包括上市公司的财务、运营等数据',
            url: 'https://www.hexun.com/data/company/123458'
          }
        ]
      }
    };
  },
  
  // 模拟名家滚动
  getMockFamousExperts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        experts: [
          {
            id: '1',
            name: '张教授',
            title: '首席经济学家',
            content: '当前经济形势总体向好，政策支持力度加大，市场有望持续回暖。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hexun.com/experts/123456'
          },
          {
            id: '2',
            name: '李分析师',
            title: '策略分析师',
            content: '科技股有望成为市场主线，建议关注人工智能、芯片等领域的投资机会。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hexun.com/experts/123457'
          }
        ]
      }
    };
  }
};

module.exports = hexun;