// 金融服务配置文件
const axios = require('axios');

// 金融服务配置
const financialServices = {
  // API基础配置
  config: {
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 优势数据与工具
  advantages: {
    // 行情
    market: {
      name: '行情',
      services: [
        {
          name: '行情中心',
          url: '/api/financial-services/market/center',
          description: '提供全球金融市场实时行情数据'
        },
        {
          name: '环球市场',
          url: '/api/financial-services/market/global',
          description: '全球主要市场指数和商品价格'
        },
        {
          name: '美股实时',
          url: '/api/financial-services/market/us',
          description: '美股实时行情数据'
        },
        {
          name: 'OTC',
          url: '/api/financial-services/market/otc',
          description: '场外交易市场数据'
        }
      ]
    },
    // 组合管理
    portfolio: {
      name: '组合管理',
      services: [
        {
          name: '我的自选',
          url: '/api/financial-services/portfolio/watchlist',
          description: '用户自定义的股票和基金自选列表'
        },
        {
          name: '模拟交易',
          url: '/api/financial-services/portfolio/simulation',
          description: '模拟交易系统，练习投资策略'
        },
        {
          name: '计算器',
          url: '/api/financial-services/portfolio/calculator',
          description: '投资计算器，计算收益、风险等'
        }
      ]
    },
    // 市场数据
    marketData: {
      name: '市场数据',
      services: [
        {
          name: '大数据',
          url: '/api/financial-services/data/bigdata',
          description: '基于大数据的市场分析和预测'
        },
        {
          name: '股票数据中心',
          url: '/api/financial-services/data/stock',
          description: '股票详细数据和分析'
        },
        {
          name: '基金数据中心',
          url: '/api/financial-services/data/fund',
          description: '基金详细数据和分析'
        }
      ]
    },
    // 宏观数据
    macroData: {
      name: '宏观数据',
      services: [
        {
          name: '全球宏观数据',
          url: '/api/financial-services/macro/global',
          description: '全球宏观经济指标数据'
        },
        {
          name: '国内宏观数据',
          url: '/api/financial-services/macro/domestic',
          description: '国内宏观经济指标数据'
        }
      ]
    },
    // 财经日历
    calendar: {
      name: '财经日历',
      services: [
        {
          name: '环球财经大事',
          url: '/api/financial-services/calendar/global',
          description: '全球重要财经事件和公告'
        },
        {
          name: '经济数据',
          url: '/api/financial-services/calendar/economic',
          description: '经济数据发布时间表和数据'
        }
      ]
    }
  },
  
  // 领先栏目与服务
  leadingServices: {
    // 股票基金
    stockFund: {
      name: '股票基金',
      services: [
        {
          name: '沪深股票',
          url: '/api/financial-services/leading/stock/cn',
          description: '沪深股市股票数据和分析'
        },
        {
          name: '港股',
          url: '/api/financial-services/leading/stock/hk',
          description: '港股市场股票数据和分析'
        },
        {
          name: '美股',
          url: '/api/financial-services/leading/stock/us',
          description: '美股市场股票数据和分析'
        },
        {
          name: '基金',
          url: '/api/financial-services/leading/fund',
          description: '基金数据和分析'
        }
      ]
    },
    // 投资者教育基地
    investorEducation: {
      name: '投资者教育基地',
      url: '/api/financial-services/leading/education',
      description: '提供投资者教育资源和课程'
    },
    // 投资
    investment: {
      name: '投资',
      services: [
        {
          name: '全球7x24',
          url: '/api/financial-services/leading/investment/global',
          description: '全球7x24小时金融市场资讯'
        },
        {
          name: '期货',
          url: '/api/financial-services/leading/investment/futures',
          description: '期货市场数据和分析'
        },
        {
          name: '外汇',
          url: '/api/financial-services/leading/investment/forex',
          description: '外汇市场数据和分析'
        },
        {
          name: '黄金',
          url: '/api/financial-services/leading/investment/gold',
          description: '黄金市场数据和分析'
        },
        {
          name: '债券',
          url: '/api/financial-services/leading/investment/bond',
          description: '债券市场数据和分析'
        }
      ]
    },
    // 特色服务
    featured: {
      name: '特色服务',
      services: [
        {
          name: '金融评测室',
          url: '/api/financial-services/leading/featured/rating',
          description: '金融产品和服务评测'
        }
      ]
    },
    // 金融业界
    financialIndustry: {
      name: '金融业界',
      services: [
        {
          name: '银行',
          url: '/api/financial-services/leading/industry/bank',
          description: '银行业资讯和分析'
        },
        {
          name: '保险',
          url: '/api/financial-services/leading/industry/insurance',
          description: '保险业资讯和分析'
        },
        {
          name: '券商',
          url: '/api/financial-services/leading/industry/broker',
          description: '券商行业资讯和分析'
        },
        {
          name: '私募',
          url: '/api/financial-services/leading/industry/private',
          description: '私募行业资讯和分析'
        },
        {
          name: '信托',
          url: '/api/financial-services/leading/industry/trust',
          description: '信托行业资讯和分析'
        }
      ]
    },
    // 宏观
    macro: {
      name: '宏观',
      services: [
        {
          name: '国内',
          url: '/api/financial-services/leading/macro/domestic',
          description: '国内宏观经济资讯和分析'
        },
        {
          name: '国际',
          url: '/api/financial-services/leading/macro/international',
          description: '国际宏观经济资讯和分析'
        }
      ]
    }
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
  
  // 获取优势数据与工具列表
  getAdvantages: function() {
    return {
      success: true,
      data: this.advantages
    };
  },
  
  // 获取领先栏目与服务列表
  getLeadingServices: function() {
    return {
      success: true,
      data: this.leadingServices
    };
  },
  
  // 行情中心
  getMarketCenter: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockMarketCenter();
    } catch (error) {
      console.error('获取行情中心失败:', error);
      return this.getMockMarketCenter();
    }
  },
  
  // 环球市场
  getGlobalMarket: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockGlobalMarket();
    } catch (error) {
      console.error('获取环球市场失败:', error);
      return this.getMockGlobalMarket();
    }
  },
  
  // 美股实时
  getUSMarket: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockUSMarket();
    } catch (error) {
      console.error('获取美股实时失败:', error);
      return this.getMockUSMarket();
    }
  },
  
  // 我的自选
  getWatchlist: async function() {
    try {
      // 实际项目中需要根据用户数据进行调整
      return this.getMockWatchlist();
    } catch (error) {
      console.error('获取我的自选失败:', error);
      return this.getMockWatchlist();
    }
  },
  
  // 模拟交易
  getSimulation: async function() {
    try {
      // 实际项目中需要根据用户数据进行调整
      return this.getMockSimulation();
    } catch (error) {
      console.error('获取模拟交易失败:', error);
      return this.getMockSimulation();
    }
  },
  
  // 股票数据中心
  getStockData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockStockData();
    } catch (error) {
      console.error('获取股票数据中心失败:', error);
      return this.getMockStockData();
    }
  },
  
  // 基金数据中心
  getFundData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockFundData();
    } catch (error) {
      console.error('获取基金数据中心失败:', error);
      return this.getMockFundData();
    }
  },
  
  // 全球宏观数据
  getGlobalMacroData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockGlobalMacroData();
    } catch (error) {
      console.error('获取全球宏观数据失败:', error);
      return this.getMockGlobalMacroData();
    }
  },
  
  // 国内宏观数据
  getDomesticMacroData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockDomesticMacroData();
    } catch (error) {
      console.error('获取国内宏观数据失败:', error);
      return this.getMockDomesticMacroData();
    }
  },
  
  // 环球财经大事
  getGlobalFinancialEvents: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockGlobalFinancialEvents();
    } catch (error) {
      console.error('获取环球财经大事失败:', error);
      return this.getMockGlobalFinancialEvents();
    }
  },
  
  // 经济数据
  getEconomicData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockEconomicData();
    } catch (error) {
      console.error('获取经济数据失败:', error);
      return this.getMockEconomicData();
    }
  },
  
  // 模拟行情中心
  getMockMarketCenter: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        indices: [
          {
            symbol: '000001.SH',
            name: '上证指数',
            price: 3258.63,
            change: 16.85,
            changePercent: 0.52
          },
          {
            symbol: '399001.SZ',
            name: '深证成指',
            price: 10892.35,
            change: 89.45,
            changePercent: 0.83
          },
          {
            symbol: '399006.SZ',
            name: '创业板指',
            price: 2178.56,
            change: 25.67,
            changePercent: 1.19
          }
        ],
        hotStocks: [
          {
            symbol: '600519.SH',
            name: '贵州茅台',
            price: 1899.00,
            change: 1.25,
            changePercent: 0.07
          },
          {
            symbol: '000858.SZ',
            name: '五粮液',
            price: 168.50,
            change: 2.30,
            changePercent: 1.39
          }
        ]
      }
    };
  },
  
  // 模拟环球市场
  getMockGlobalMarket: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        globalIndices: [
          {
            symbol: '^DJI',
            name: '道琼斯工业平均指数',
            price: 38567.89,
            change: 234.56,
            changePercent: 0.61
          },
          {
            symbol: '^GSPC',
            name: '标普500指数',
            price: 5123.45,
            change: 34.56,
            changePercent: 0.68
          },
          {
            symbol: '^IXIC',
            name: '纳斯达克综合指数',
            price: 16234.56,
            change: 123.45,
            changePercent: 0.77
          },
          {
            symbol: 'HSI',
            name: '恒生指数',
            price: 18567.89,
            change: 234.56,
            changePercent: 1.28
          }
        ],
        commodities: [
          {
            symbol: 'GC',
            name: '黄金',
            price: 2345.67,
            change: 12.34,
            changePercent: 0.53
          },
          {
            symbol: 'SI',
            name: '白银',
            price: 28.76,
            change: 0.45,
            changePercent: 1.60
          },
          {
            symbol: 'CL',
            name: '原油',
            price: 78.90,
            change: -0.56,
            changePercent: -0.70
          }
        ]
      }
    };
  },
  
  // 模拟美股实时
  getMockUSMarket: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        stocks: [
          {
            symbol: 'AAPL',
            name: '苹果公司',
            price: 185.60,
            change: 2.30,
            changePercent: 1.26,
            volume: 456789000
          },
          {
            symbol: 'MSFT',
            name: '微软公司',
            price: 425.30,
            change: 3.45,
            changePercent: 0.82,
            volume: 234567890
          },
          {
            symbol: 'GOOGL',
            name: '谷歌',
            price: 1789.45,
            change: 12.34,
            changePercent: 0.69,
            volume: 89765432
          },
          {
            symbol: 'AMZN',
            name: '亚马逊',
            price: 178.90,
            change: 1.23,
            changePercent: 0.69,
            volume: 123456789
          }
        ]
      }
    };
  },
  
  // 模拟我的自选
  getMockWatchlist: function() {
    return {
      success: true,
      data: {
        stocks: [
          {
            symbol: '600519.SH',
            name: '贵州茅台',
            price: 1899.00,
            change: 1.25,
            changePercent: 0.07
          },
          {
            symbol: '000858.SZ',
            name: '五粮液',
            price: 168.50,
            change: 2.30,
            changePercent: 1.39
          },
          {
            symbol: '601318.SH',
            name: '中国平安',
            price: 48.25,
            change: -0.55,
            changePercent: -1.13
          }
        ],
        funds: [
          {
            symbol: '110022',
            name: '易方达消费行业股票',
            nav: 2.8567,
            change: 0.0352,
            changePercent: 1.25
          },
          {
            symbol: '110011',
            name: '易方达优质精选混合(QDII)',
            nav: 1.9876,
            change: 0.0167,
            changePercent: 0.85
          }
        ]
      }
    };
  },
  
  // 模拟模拟交易
  getMockSimulation: function() {
    return {
      success: true,
      data: {
        balance: 100000.00,
        portfolioValue: 105678.90,
        profit: 5678.90,
        profitPercent: 5.68,
        transactions: [
          {
            id: '1',
            symbol: '600519.SH',
            name: '贵州茅台',
            type: 'buy',
            price: 1880.00,
            quantity: 10,
            amount: 18800.00,
            time: '2026-04-01 10:00:00'
          },
          {
            id: '2',
            symbol: '000858.SZ',
            name: '五粮液',
            type: 'buy',
            price: 165.00,
            quantity: 100,
            amount: 16500.00,
            time: '2026-04-02 14:30:00'
          }
        ]
      }
    };
  },
  
  // 模拟股票数据中心
  getMockStockData: function() {
    return {
      success: true,
      data: {
        stock: {
          symbol: '600519.SH',
          name: '贵州茅台',
          price: 1899.00,
          change: 1.25,
          changePercent: 0.07,
          open: 1898.00,
          high: 1905.00,
          low: 1895.00,
          prevClose: 1897.75,
          volume: 1234567,
          amount: 2345678901,
          marketCap: 2380000000000,
          pe: 35.2,
          pb: 12.5,
          roe: 35.8,
          industry: '白酒',
          sector: '食品饮料'
        },
        historicalData: [
          {
            date: '2026-04-02',
            open: 1890.00,
            high: 1900.00,
            low: 1885.00,
            close: 1897.75,
            volume: 1123456
          },
          {
            date: '2026-04-01',
            open: 1880.00,
            high: 1895.00,
            low: 1875.00,
            close: 1890.00,
            volume: 987654
          }
        ]
      }
    };
  },
  
  // 模拟基金数据中心
  getMockFundData: function() {
    return {
      success: true,
      data: {
        fund: {
          symbol: '110022',
          name: '易方达消费行业股票',
          nav: 2.8567,
          change: 0.0352,
          changePercent: 1.25,
          day7: 2.5,
          day30: 5.8,
          day90: 12.5,
          day180: 18.2,
          day365: 25.6,
          manager: '萧楠',
          established: '2010-08-20',
          scale: '120.56亿'
        },
        holdings: [
          {
            symbol: '600519.SH',
            name: '贵州茅台',
            percentage: 10.25
          },
          {
            symbol: '000858.SZ',
            name: '五粮液',
            percentage: 8.75
          },
          {
            symbol: '600887.SH',
            name: '伊利股份',
            percentage: 5.60
          }
        ]
      }
    };
  },
  
  // 模拟全球宏观数据
  getMockGlobalMacroData: function() {
    return {
      success: true,
      data: {
        indicators: [
          {
            name: '美国GDP增速',
            value: 2.5,
            unit: '%',
            period: '2026年Q1',
            change: 0.3
          },
          {
            name: '欧元区GDP增速',
            value: 1.2,
            unit: '%',
            period: '2026年Q1',
            change: 0.1
          },
          {
            name: '日本GDP增速',
            value: 0.8,
            unit: '%',
            period: '2026年Q1',
            change: 0.2
          },
          {
            name: '美国CPI',
            value: 2.1,
            unit: '%',
            period: '2026年3月',
            change: 0.1
          },
          {
            name: '美联储利率',
            value: 4.75,
            unit: '%',
            period: '2026年3月',
            change: 0
          }
        ]
      }
    };
  },
  
  // 模拟国内宏观数据
  getMockDomesticMacroData: function() {
    return {
      success: true,
      data: {
        indicators: [
          {
            name: 'GDP增速',
            value: 5.2,
            unit: '%',
            period: '2026年Q1',
            change: 0.3
          },
          {
            name: 'CPI',
            value: 2.1,
            unit: '%',
            period: '2026年3月',
            change: 0.2
          },
          {
            name: 'PPI',
            value: -0.5,
            unit: '%',
            period: '2026年3月',
            change: -0.1
          },
          {
            name: '工业增加值',
            value: 4.8,
            unit: '%',
            period: '2026年3月',
            change: 0.5
          },
          {
            name: '社会消费品零售总额',
            value: 5.5,
            unit: '%',
            period: '2026年3月',
            change: 0.8
          },
          {
            name: '固定资产投资',
            value: 4.2,
            unit: '%',
            period: '2026年3月',
            change: 0.3
          }
        ]
      }
    };
  },
  
  // 模拟环球财经大事
  getMockGlobalFinancialEvents: function() {
    return {
      success: true,
      data: {
        events: [
          {
            id: '1',
            title: '美联储FOMC会议',
            date: '2026-04-03',
            time: '02:00',
            importance: '高',
            description: '美联储公布利率决议和政策声明'
          },
          {
            id: '2',
            title: '美国非农就业数据',
            date: '2026-04-05',
            time: '20:30',
            importance: '高',
            description: '美国3月非农就业人数变化'
          },
          {
            id: '3',
            title: '欧洲央行利率决议',
            date: '2026-04-10',
            time: '19:45',
            importance: '中',
            description: '欧洲央行公布利率决议'
          }
        ]
      }
    };
  },
  
  // 模拟经济数据
  getMockEconomicData: function() {
    return {
      success: true,
      data: {
        calendar: [
          {
            id: '1',
            country: '美国',
            indicator: 'ISM制造业PMI',
            date: '2026-04-01',
            time: '22:00',
            actual: 52.3,
            forecast: 51.5,
            previous: 51.8
          },
          {
            id: '2',
            country: '中国',
            indicator: 'PMI',
            date: '2026-04-01',
            time: '09:00',
            actual: 50.8,
            forecast: 50.5,
            previous: 50.3
          },
          {
            id: '3',
            country: '欧元区',
            indicator: 'CPI',
            date: '2026-04-02',
            time: '17:00',
            actual: 2.4,
            forecast: 2.5,
            previous: 2.6
          }
        ]
      }
    };
  }
};

module.exports = financialServices;