// 中金在线配置文件
const axios = require('axios');

// 中金在线配置
const cnfol = {
  // API基础配置
  config: {
    baseUrl: 'https://cnfol.com',
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 通用请求函数
  request: async function(endpoint, params) {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
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
  requestWithRetry: async function(endpoint, params, retry = 0) {
    try {
      return await this.request(endpoint, params);
    } catch (error) {
      if (retry < this.config.retryCount) {
        console.log(`请求失败，重试 (${retry + 1}/${this.config.retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.requestWithRetry(endpoint, params, retry + 1);
      }
      throw error;
    }
  },
  
  // 获取财经资讯
  getFinancialNews: async function() {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockFinancialNews();
    } catch (error) {
      console.error('获取财经资讯失败:', error);
      return this.getMockFinancialNews();
    }
  },
  
  // 获取股票数据
  getStockData: async function() {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockStockData();
    } catch (error) {
      console.error('获取股票数据失败:', error);
      return this.getMockStockData();
    }
  },
  
  // 获取基金数据
  getFundData: async function() {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockFundData();
    } catch (error) {
      console.error('获取基金数据失败:', error);
      return this.getMockFundData();
    }
  },
  
  // 获取黄金数据
  getGoldData: async function() {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockGoldData();
    } catch (error) {
      console.error('获取黄金数据失败:', error);
      return this.getMockGoldData();
    }
  },
  
  // 获取外汇数据
  getForexData: async function() {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockForexData();
    } catch (error) {
      console.error('获取外汇数据失败:', error);
      return this.getMockForexData();
    }
  },
  
  // 获取期货数据
  getFuturesData: async function() {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockFuturesData();
    } catch (error) {
      console.error('获取期货数据失败:', error);
      return this.getMockFuturesData();
    }
  },
  
  // 获取理财数据
  getWealthData: async function() {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockWealthData();
    } catch (error) {
      console.error('获取理财数据失败:', error);
      return this.getMockWealthData();
    }
  },
  
  // 获取宏观数据库数据
  getMacroDatabase: async function(category, indicator) {
    try {
      // 实际项目中需要根据中金在线的API接口进行调整
      return this.getMockMacroDatabase(category, indicator);
    } catch (error) {
      console.error('获取宏观数据库数据失败:', error);
      return this.getMockMacroDatabase(category, indicator);
    }
  },
  
  // 模拟财经资讯
  getMockFinancialNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '央行：保持流动性合理充裕，引导市场利率下行',
            source: '中金在线',
            time: '2026-04-03 10:00',
            url: 'https://cnfol.com/news/20260403/123456.html',
            category: '财经'
          },
          {
            id: '2',
            title: 'A股市场迎来开门红，沪指上涨1.2%',
            source: '中金在线',
            time: '2026-04-03 09:30',
            url: 'https://cnfol.com/news/20260403/789012.html',
            category: '股票'
          },
          {
            id: '3',
            title: '新能源汽车销量持续增长，一季度同比增长35.2%',
            source: '中金在线',
            time: '2026-04-02 16:00',
            url: 'https://cnfol.com/news/20260402/345678.html',
            category: '财经'
          },
          {
            id: '4',
            title: '黄金价格持续上涨，创历史新高',
            source: '中金在线',
            time: '2026-04-02 14:30',
            url: 'https://cnfol.com/news/20260402/987654.html',
            category: '黄金'
          },
          {
            id: '5',
            title: '美联储暗示可能在下半年降息',
            source: '中金在线',
            time: '2026-04-01 22:00',
            url: 'https://cnfol.com/news/20260401/654321.html',
            category: '外汇'
          }
        ]
      }
    };
  },
  
  // 模拟股票数据
  getMockStockData: function() {
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
          },
          {
            symbol: '601318.SH',
            name: '中国平安',
            price: 48.25,
            change: -0.55,
            changePercent: -1.13
          }
        ]
      }
    };
  },
  
  // 模拟基金数据
  getMockFundData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        funds: [
          {
            symbol: '110022',
            name: '易方达消费行业股票',
            nav: 2.8567,
            change: 0.0352,
            changePercent: 1.25,
            day7: 2.5,
            day30: 5.8,
            day90: 12.5
          },
          {
            symbol: '110011',
            name: '易方达优质精选混合(QDII)',
            nav: 1.9876,
            change: 0.0167,
            changePercent: 0.85,
            day7: 1.8,
            day30: 4.2,
            day90: 9.5
          },
          {
            symbol: '000001',
            name: '华夏成长混合',
            nav: 1.2345,
            change: 0.0068,
            changePercent: 0.56,
            day7: 1.2,
            day30: 3.5,
            day90: 7.8
          }
        ]
      }
    };
  },
  
  // 模拟黄金数据
  getMockGoldData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        gold: [
          {
            symbol: 'AU9999',
            name: '黄金9999',
            price: 485.60,
            change: 2.30,
            changePercent: 0.48,
            volume: 12345
          },
          {
            symbol: 'AU9995',
            name: '黄金9995',
            price: 484.30,
            change: 2.10,
            changePercent: 0.44,
            volume: 8765
          },
          {
            symbol: 'GC',
            name: '国际黄金',
            price: 2345.67,
            change: 12.34,
            changePercent: 0.53,
            volume: 123456
          }
        ]
      }
    };
  },
  
  // 模拟外汇数据
  getMockForexData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        forex: [
          {
            symbol: 'USD/CNY',
            name: '美元/人民币',
            price: 7.1234,
            change: 0.0123,
            changePercent: 0.17
          },
          {
            symbol: 'EUR/CNY',
            name: '欧元/人民币',
            price: 7.7890,
            change: 0.0234,
            changePercent: 0.30
          },
          {
            symbol: 'JPY/CNY',
            name: '日元/人民币',
            price: 0.0485,
            change: -0.0002,
            changePercent: -0.41
          },
          {
            symbol: 'GBP/CNY',
            name: '英镑/人民币',
            price: 9.2345,
            change: 0.0345,
            changePercent: 0.38
          }
        ]
      }
    };
  },
  
  // 模拟期货数据
  getMockFuturesData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        futures: [
          {
            symbol: 'CU2605',
            name: '铜2605',
            price: 72345.00,
            change: 567.00,
            changePercent: 0.79,
            volume: 123456
          },
          {
            symbol: 'AL2605',
            name: '铝2605',
            price: 19876.00,
            change: 123.00,
            changePercent: 0.62,
            volume: 87654
          },
          {
            symbol: 'ZN2605',
            name: '锌2605',
            price: 23456.00,
            change: -89.00,
            changePercent: -0.38,
            volume: 65432
          },
          {
            symbol: 'RU2605',
            name: '橡胶2605',
            price: 12345.00,
            change: 234.00,
            changePercent: 1.93,
            volume: 45678
          }
        ]
      }
    };
  },
  
  // 模拟理财数据
  getMockWealthData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        wealthProducts: [
          {
            id: '1',
            name: '中金稳健理财1号',
            type: '固定收益',
            period: '90天',
            expectedReturn: 3.5,
            riskLevel: '低风险',
            minimumInvestment: 10000
          },
          {
            id: '2',
            name: '中金平衡配置2号',
            type: '混合类',
            period: '180天',
            expectedReturn: 4.8,
            riskLevel: '中风险',
            minimumInvestment: 50000
          },
          {
            id: '3',
            name: '中金进取成长3号',
            type: '权益类',
            period: '365天',
            expectedReturn: 6.5,
            riskLevel: '中高风险',
            minimumInvestment: 100000
          }
        ]
      }
    };
  },
  
  // 模拟宏观数据库数据
  getMockMacroDatabase: function(category, indicator) {
    const mockData = {
      // 国民经济
      '国民经济': {
        '国内生产总值': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '国内生产总值',
            unit: '亿元',
            data: [
              { period: '2026年Q1', value: 280000 },
              { period: '2025年Q4', value: 275000 },
              { period: '2025年Q3', value: 265000 },
              { period: '2025年Q2', value: 260000 },
              { period: '2025年Q1', value: 255000 }
            ]
          }
        },
        '居民消费价格指数': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '居民消费价格指数',
            unit: '%',
            data: [
              { period: '2026年3月', value: 2.1 },
              { period: '2026年2月', value: 1.9 },
              { period: '2026年1月', value: 1.8 },
              { period: '2025年12月', value: 1.7 },
              { period: '2025年11月', value: 1.6 }
            ]
          }
        },
        '采购经理指数': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '采购经理指数',
            unit: '',
            data: [
              { period: '2026年3月', value: 50.8 },
              { period: '2026年2月', value: 50.5 },
              { period: '2026年1月', value: 50.3 },
              { period: '2025年12月', value: 50.1 },
              { period: '2025年11月', value: 49.9 }
            ]
          }
        }
      },
      // 财政货币
      '财政货币': {
        '财政收入': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '财政收入',
            unit: '亿元',
            data: [
              { period: '2026年3月', value: 25000 },
              { period: '2026年2月', value: 23000 },
              { period: '2026年1月', value: 24000 },
              { period: '2025年12月', value: 22000 },
              { period: '2025年11月', value: 21000 }
            ]
          }
        },
        '全国税收收入': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '全国税收收入',
            unit: '亿元',
            data: [
              { period: '2026年3月', value: 20000 },
              { period: '2026年2月', value: 18000 },
              { period: '2026年1月', value: 19000 },
              { period: '2025年12月', value: 17000 },
              { period: '2025年11月', value: 16000 }
            ]
          }
        },
        '利率调整': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '利率调整',
            unit: '%',
            data: [
              { period: '2026年3月', value: 3.85 },
              { period: '2025年12月', value: 4.15 },
              { period: '2025年9月', value: 4.35 },
              { period: '2025年6月', value: 4.55 },
              { period: '2025年3月', value: 4.75 }
            ]
          }
        }
      },
      // 产业
      '产业': {
        '工业品出产价格指数': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '工业品出产价格指数',
            unit: '%',
            data: [
              { period: '2026年3月', value: -0.5 },
              { period: '2026年2月', value: -0.6 },
              { period: '2026年1月', value: -0.7 },
              { period: '2025年12月', value: -0.8 },
              { period: '2025年11月', value: -0.9 }
            ]
          }
        },
        '工业增加值增长': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '工业增加值增长',
            unit: '%',
            data: [
              { period: '2026年3月', value: 4.8 },
              { period: '2026年2月', value: 4.5 },
              { period: '2026年1月', value: 4.2 },
              { period: '2025年12月', value: 4.0 },
              { period: '2025年11月', value: 3.8 }
            ]
          }
        }
      },
      // 其它
      '其它': {
        '全国股票交易统计': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '全国股票交易统计',
            unit: '亿元',
            data: [
              { period: '2026年3月', value: 120000 },
              { period: '2026年2月', value: 100000 },
              { period: '2026年1月', value: 110000 },
              { period: '2025年12月', value: 90000 },
              { period: '2025年11月', value: 80000 }
            ]
          }
        },
        '股票账户统计表': {
          success: true,
          data: {
            lastUpdated: new Date().toISOString(),
            indicator: '股票账户统计表',
            unit: '万户',
            data: [
              { period: '2026年3月', value: 22000 },
              { period: '2026年2月', value: 21800 },
              { period: '2026年1月', value: 21500 },
              { period: '2025年12月', value: 21200 },
              { period: '2025年11月', value: 21000 }
            ]
          }
        }
      }
    };
    
    // 如果提供了类别和指标，返回对应的数据
    if (category && indicator) {
      return mockData[category] && mockData[category][indicator] ? 
        mockData[category][indicator] : 
        { success: false, message: '未找到对应的数据' };
    }
    
    // 否则返回所有数据
    return {
      success: true,
      data: mockData
    };
  }
};

module.exports = cnfol;