// 华尔街见闻配置文件
const axios = require('axios');

// 华尔街见闻配置
const wallstreetcn = {
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
  
  // 获取外汇行情
  getForexMarket: async function() {
    try {
      // 实际项目中需要根据华尔街见闻的API接口进行调整
      return this.getMockForexMarket();
    } catch (error) {
      console.error('获取外汇行情失败:', error);
      return this.getMockForexMarket();
    }
  },
  
  // 获取市场资讯
  getMarketNews: async function() {
    try {
      // 实际项目中需要根据华尔街见闻的API接口进行调整
      return this.getMockMarketNews();
    } catch (error) {
      console.error('获取市场资讯失败:', error);
      return this.getMockMarketNews();
    }
  },
  
  // 获取快讯
  getMarketAlerts: async function() {
    try {
      // 实际项目中需要根据华尔街见闻的API接口进行调整
      return this.getMockMarketAlerts();
    } catch (error) {
      console.error('获取快讯失败:', error);
      return this.getMockMarketAlerts();
    }
  },
  
  // 获取K线图数据
  getKlineData: async function(symbol, interval = '1d', limit = 100) {
    try {
      // 实际项目中需要根据华尔街见闻的API接口进行调整
      return this.getMockKlineData(symbol, interval, limit);
    } catch (error) {
      console.error('获取K线图数据失败:', error);
      return this.getMockKlineData(symbol, interval, limit);
    }
  },
  
  // 获取商品行情
  getCommodityMarket: async function() {
    try {
      // 实际项目中需要根据华尔街见闻的API接口进行调整
      return this.getMockCommodityMarket();
    } catch (error) {
      console.error('获取商品行情失败:', error);
      return this.getMockCommodityMarket();
    }
  },
  
  // 获取债券行情
  getBondMarket: async function() {
    try {
      // 实际项目中需要根据华尔街见闻的API接口进行调整
      return this.getMockBondMarket();
    } catch (error) {
      console.error('获取债券行情失败:', error);
      return this.getMockBondMarket();
    }
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
            price: 7.2568,
            change: 0.0032,
            changePercent: 0.04,
            high: 7.2600,
            low: 7.2500,
            open: 7.2536,
            volume: 123456789
          },
          {
            symbol: 'EUR/USD',
            name: '欧元/美元',
            price: 1.0876,
            change: 0.0034,
            changePercent: 0.31,
            high: 1.0900,
            low: 1.0850,
            open: 1.0842,
            volume: 234567890
          },
          {
            symbol: 'GBP/USD',
            name: '英镑/美元',
            price: 1.2654,
            change: 0.0021,
            changePercent: 0.17,
            high: 1.2670,
            low: 1.2630,
            open: 1.2633,
            volume: 189012345
          },
          {
            symbol: 'USD/JPY',
            name: '美元/日元',
            price: 151.23,
            change: -0.56,
            changePercent: -0.37,
            high: 151.80,
            low: 151.10,
            open: 151.79,
            volume: 345678901
          },
          {
            symbol: 'USD/HKD',
            name: '美元/港币',
            price: 7.8123,
            change: 0.0005,
            changePercent: 0.01,
            high: 7.8130,
            low: 7.8110,
            open: 7.8118,
            volume: 98765432
          }
        ]
      }
    };
  },
  
  // 模拟市场资讯
  getMockMarketNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '美联储会议纪要：多数官员认为通胀风险仍然存在',
            summary: '美联储公布的会议纪要显示，多数官员认为通胀风险仍然存在，可能需要进一步加息。',
            source: '华尔街见闻',
            publishTime: new Date().toISOString(),
            url: 'https://wallstreetcn.com/news/123456'
          },
          {
            id: '2',
            title: '中国央行：保持流动性合理充裕',
            summary: '中国央行表示，将保持流动性合理充裕，引导市场利率下行。',
            source: '华尔街见闻',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://wallstreetcn.com/news/123457'
          },
          {
            id: '3',
            title: '欧洲央行维持利率不变，暗示可能在6月降息',
            summary: '欧洲央行维持利率不变，但暗示可能在6月降息，市场预期升温。',
            source: '华尔街见闻',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://wallstreetcn.com/news/123458'
          },
          {
            id: '4',
            title: '美国非农就业数据超预期，失业率降至3.8%',
            summary: '美国4月非农就业数据超预期，失业率降至3.8%，强化了市场对经济的信心。',
            source: '华尔街见闻',
            publishTime: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://wallstreetcn.com/news/123459'
          },
          {
            id: '5',
            title: '原油价格上涨，因中东地缘政治紧张加剧',
            summary: '原油价格上涨，因中东地缘政治紧张加剧，市场担心供应中断。',
            source: '华尔街见闻',
            publishTime: new Date(Date.now() - 14400000).toISOString(),
            url: 'https://wallstreetcn.com/news/123460'
          }
        ]
      }
    };
  },
  
  // 模拟快讯
  getMockMarketAlerts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        alerts: [
          {
            id: '1',
            content: '【快讯】美国3月CPI同比增长3.5%，预期3.4%，前值3.2%',
            publishTime: new Date().toISOString(),
            importance: 'high'
          },
          {
            id: '2',
            content: '【快讯】中国央行今日开展1000亿元7天逆回购操作',
            publishTime: new Date(Date.now() - 600000).toISOString(),
            importance: 'medium'
          },
          {
            id: '3',
            content: '【快讯】欧洲央行行长拉加德：通胀正在朝着目标稳步下降',
            publishTime: new Date(Date.now() - 1200000).toISOString(),
            importance: 'medium'
          },
          {
            id: '4',
            content: '【快讯】美国财政部：将在未来一周发行1200亿美元国债',
            publishTime: new Date(Date.now() - 1800000).toISOString(),
            importance: 'low'
          },
          {
            id: '5',
            content: '【快讯】OPEC+维持减产协议不变，原油价格小幅上涨',
            publishTime: new Date(Date.now() - 2400000).toISOString(),
            importance: 'high'
          }
        ]
      }
    };
  },
  
  // 模拟K线图数据
  getMockKlineData: function(symbol, interval = '1d', limit = 100) {
    const klines = [];
    const now = new Date();
    
    for (let i = limit - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const open = 7.20 + Math.random() * 0.1;
      const high = open + Math.random() * 0.05;
      const low = open - Math.random() * 0.05;
      const close = low + Math.random() * (high - low);
      const volume = Math.floor(Math.random() * 100000000) + 50000000;
      
      klines.push({
        time: date.toISOString(),
        open: parseFloat(open.toFixed(4)),
        high: parseFloat(high.toFixed(4)),
        low: parseFloat(low.toFixed(4)),
        close: parseFloat(close.toFixed(4)),
        volume: volume
      });
    }
    
    return {
      success: true,
      data: {
        symbol: symbol,
        interval: interval,
        lastUpdated: new Date().toISOString(),
        klines: klines
      }
    };
  },
  
  // 模拟商品行情
  getMockCommodityMarket: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        commodities: [
          {
            symbol: 'GC',
            name: '黄金',
            price: 2345.67,
            change: 12.34,
            changePercent: 0.53,
            high: 2350.00,
            low: 2330.00,
            open: 2333.33,
            volume: 12345678
          },
          {
            symbol: 'SI',
            name: '白银',
            price: 28.76,
            change: 0.45,
            changePercent: 1.60,
            high: 29.00,
            low: 28.50,
            open: 28.31,
            volume: 8976543
          },
          {
            symbol: 'CL',
            name: 'WTI原油',
            price: 78.90,
            change: -0.56,
            changePercent: -0.70,
            high: 79.50,
            low: 78.50,
            open: 79.46,
            volume: 23456789
          },
          {
            symbol: 'BZ',
            name: '布伦特原油',
            price: 82.35,
            change: -0.65,
            changePercent: -0.78,
            high: 83.00,
            low: 82.00,
            open: 83.00,
            volume: 18901234
          },
          {
            symbol: 'HG',
            name: '铜',
            price: 4.3250,
            change: 0.0560,
            changePercent: 1.31,
            high: 4.3300,
            low: 4.2700,
            open: 4.2690,
            volume: 5678901
          }
        ]
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
            symbol: 'US10Y',
            name: '美国10年期国债',
            yield: 4.56,
            change: -0.05,
            changePercent: -1.09,
            high: 4.60,
            low: 4.55,
            open: 4.61
          },
          {
            symbol: 'CN10Y',
            name: '中国10年期国债',
            yield: 2.85,
            change: 0.02,
            changePercent: 0.71,
            high: 2.86,
            low: 2.83,
            open: 2.83
          },
          {
            symbol: 'DE10Y',
            name: '德国10年期国债',
            yield: 2.25,
            change: -0.03,
            changePercent: -1.32,
            high: 2.28,
            low: 2.24,
            open: 2.28
          },
          {
            symbol: 'JP10Y',
            name: '日本10年期国债',
            yield: 0.85,
            change: 0.01,
            changePercent: 1.19,
            high: 0.86,
            low: 0.84,
            open: 0.84
          },
          {
            symbol: 'UK10Y',
            name: '英国10年期国债',
            yield: 4.25,
            change: -0.04,
            changePercent: -0.93,
            high: 4.29,
            low: 4.24,
            open: 4.29
          }
        ]
      }
    };
  }
};

module.exports = wallstreetcn;