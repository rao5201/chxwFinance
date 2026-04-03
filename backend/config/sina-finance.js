// 新浪财经配置文件
const axios = require('axios');

// 新浪财经配置
const sinaFinance = {
  // API基础配置
  config: {
    baseUrl: 'https://finance.sina.com.cn',
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
  
  // 获取沪深股票行情
  getStockMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockStockMarket();
    } catch (error) {
      console.error('获取沪深股票行情失败:', error);
      return this.getMockStockMarket();
    }
  },
  
  // 获取基金行情
  getFundMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockFundMarket();
    } catch (error) {
      console.error('获取基金行情失败:', error);
      return this.getMockFundMarket();
    }
  },
  
  // 获取债券行情
  getBondMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockBondMarket();
    } catch (error) {
      console.error('获取债券行情失败:', error);
      return this.getMockBondMarket();
    }
  },
  
  // 获取港股行情
  getHongKongMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockHongKongMarket();
    } catch (error) {
      console.error('获取港股行情失败:', error);
      return this.getMockHongKongMarket();
    }
  },
  
  // 获取美股行情
  getUSMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockUSMarket();
    } catch (error) {
      console.error('获取美股行情失败:', error);
      return this.getMockUSMarket();
    }
  },
  
  // 获取国内期货行情
  getFuturesMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockFuturesMarket();
    } catch (error) {
      console.error('获取国内期货行情失败:', error);
      return this.getMockFuturesMarket();
    }
  },
  
  // 获取外汇行情
  getForexMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockForexMarket();
    } catch (error) {
      console.error('获取外汇行情失败:', error);
      return this.getMockForexMarket();
    }
  },
  
  // 获取黄金行情
  getGoldMarket: async function() {
    try {
      // 实际项目中需要根据新浪财经的API接口进行调整
      return this.getMockGoldMarket();
    } catch (error) {
      console.error('获取黄金行情失败:', error);
      return this.getMockGoldMarket();
    }
  },
  
  // 模拟沪深股票行情
  getMockStockMarket: function() {
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
            changePercent: 0.52,
            volume: 2345678901,
            amount: 34567890123
          },
          {
            symbol: '399001.SZ',
            name: '深证成指',
            price: 10892.35,
            change: 89.45,
            changePercent: 0.83,
            volume: 3456789012,
            amount: 45678901234
          },
          {
            symbol: '399006.SZ',
            name: '创业板指',
            price: 2178.56,
            change: 25.67,
            changePercent: 1.19,
            volume: 1234567890,
            amount: 23456789012
          }
        ],
        stocks: [
          {
            symbol: '600519.SH',
            name: '贵州茅台',
            price: 1899.00,
            change: 1.25,
            changePercent: 0.07,
            volume: 1234567,
            amount: 2345678901
          },
          {
            symbol: '000858.SZ',
            name: '五粮液',
            price: 168.50,
            change: 2.30,
            changePercent: 1.39,
            volume: 4567890,
            amount: 768901234
          },
          {
            symbol: '601318.SH',
            name: '中国平安',
            price: 48.25,
            change: -0.55,
            changePercent: -1.13,
            volume: 9876543,
            amount: 476543210
          }
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  },
  
  // 模拟基金行情
  getMockFundMarket: function() {
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
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  },
  
  // 模拟债券行情
  getMockBondMarket: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        bonds: [
          {
            symbol: '101901',
            name: '国债1901',
            price: 102.56,
            change: 0.12,
            changePercent: 0.12,
            yield: 2.85
          },
          {
            symbol: '112891',
            name: '浦发转债',
            price: 115.32,
            change: 0.45,
            changePercent: 0.39,
            yield: 1.85
          },
          {
            symbol: '127021',
            name: '奥佳转债',
            price: 135.67,
            change: -0.89,
            changePercent: -0.65,
            yield: 0.56
          }
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  },
  
  // 模拟港股行情
  getMockHongKongMarket: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        indices: [
          {
            symbol: 'HSI',
            name: '恒生指数',
            price: 18567.89,
            change: 234.56,
            changePercent: 1.28,
            volume: 1234567890
          },
          {
            symbol: 'HSCEI',
            name: '恒生国企指数',
            price: 6234.56,
            change: 123.45,
            changePercent: 2.02,
            volume: 876543210
          }
        ],
        stocks: [
          {
            symbol: '00700.HK',
            name: '腾讯控股',
            price: 385.60,
            change: 5.20,
            changePercent: 1.37,
            volume: 45678900
          },
          {
            symbol: '00939.HK',
            name: '建设银行',
            price: 5.85,
            change: 0.12,
            changePercent: 2.09,
            volume: 123456789
          }
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  },
  
  // 模拟美股行情
  getMockUSMarket: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        indices: [
          {
            symbol: '^DJI',
            name: '道琼斯工业平均指数',
            price: 38567.89,
            change: 234.56,
            changePercent: 0.61,
            volume: 1234567890
          },
          {
            symbol: '^GSPC',
            name: '标普500指数',
            price: 5123.45,
            change: 34.56,
            changePercent: 0.68,
            volume: 2345678901
          },
          {
            symbol: '^IXIC',
            name: '纳斯达克综合指数',
            price: 16234.56,
            change: 123.45,
            changePercent: 0.77,
            volume: 3456789012
          }
        ],
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
          }
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  },
  
  // 模拟国内期货行情
  getMockFuturesMarket: function() {
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
          }
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  },
  
  // 模拟外汇行情
  getMockForexMarket: function() {
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
          }
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  },
  
  // 模拟黄金行情
  getMockGoldMarket: function() {
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
          }
        ],
        disclaimer: '市场有风险，投资需谨慎'
      }
    };
  }
};

module.exports = sinaFinance;