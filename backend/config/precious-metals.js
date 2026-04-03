// 贵金属和国际市场行情配置文件
const axios = require('axios');

// 贵金属和国际市场行情配置
const preciousMetals = {
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
  
  // 获取国际黄金行情
  getInternationalGold: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockInternationalGold();
    } catch (error) {
      console.error('获取国际黄金行情失败:', error);
      return this.getMockInternationalGold();
    }
  },
  
  // 获取国际白银行情
  getInternationalSilver: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockInternationalSilver();
    } catch (error) {
      console.error('获取国际白银行情失败:', error);
      return this.getMockInternationalSilver();
    }
  },
  
  // 获取美元指数
  getUSDOLLARIndex: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockUSDOLLARIndex();
    } catch (error) {
      console.error('获取美元指数失败:', error);
      return this.getMockUSDOLLARIndex();
    }
  },
  
  // 获取欧元指数
  getEURIndex: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockEURIndex();
    } catch (error) {
      console.error('获取欧元指数失败:', error);
      return this.getMockEURIndex();
    }
  },
  
  // 获取国际原油
  getInternationalOil: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockInternationalOil();
    } catch (error) {
      console.error('获取国际原油失败:', error);
      return this.getMockInternationalOil();
    }
  },
  
  // 获取上海黄金交易所数据
  getSGEData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockSGEData();
    } catch (error) {
      console.error('获取上海黄金交易所数据失败:', error);
      return this.getMockSGEData();
    }
  },
  
  // 获取银行贵金属投资品种
  getBankPreciousMetals: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockBankPreciousMetals();
    } catch (error) {
      console.error('获取银行贵金属投资品种失败:', error);
      return this.getMockBankPreciousMetals();
    }
  },
  
  // 获取天津贵金属交易所数据
  getTJPGData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockTJPGData();
    } catch (error) {
      console.error('获取天津贵金属交易所数据失败:', error);
      return this.getMockTJPGData();
    }
  },
  
  // 获取上海期货交易所数据
  getSHFEData: async function() {
    try {
      // 实际项目中需要根据实际数据源进行调整
      return this.getMockSHFEData();
    } catch (error) {
      console.error('获取上海期货交易所数据失败:', error);
      return this.getMockSHFEData();
    }
  },
  
  // 模拟国际黄金行情
  getMockInternationalGold: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        gold: [
          {
            symbol: 'GC',
            name: '纽约黄金',
            price: 2345.67,
            change: 12.34,
            changePercent: 0.53,
            high: 2350.00,
            low: 2330.00,
            open: 2333.33,
            volume: 123456
          },
          {
            symbol: 'XAU/USD',
            name: '国际黄金',
            price: 2345.67,
            change: 12.34,
            changePercent: 0.53,
            high: 2350.00,
            low: 2330.00,
            open: 2333.33,
            volume: 234567
          }
        ]
      }
    };
  },
  
  // 模拟国际白银行情
  getMockInternationalSilver: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        silver: [
          {
            symbol: 'SI',
            name: '纽约白银',
            price: 28.76,
            change: 0.45,
            changePercent: 1.60,
            high: 29.00,
            low: 28.50,
            open: 28.31,
            volume: 89765
          },
          {
            symbol: 'XAG/USD',
            name: '国际白银',
            price: 28.76,
            change: 0.45,
            changePercent: 1.60,
            high: 29.00,
            low: 28.50,
            open: 28.31,
            volume: 178901
          }
        ]
      }
    };
  },
  
  // 模拟美元指数
  getMockUSDOLLARIndex: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        index: {
          symbol: 'DXY',
          name: '美元指数',
          price: 104.25,
          change: -0.35,
          changePercent: -0.33,
          high: 104.60,
          low: 104.10,
          open: 104.50,
          volume: 456789
        }
      }
    };
  },
  
  // 模拟欧元指数
  getMockEURIndex: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        index: {
          symbol: 'EUR/USD',
          name: '欧元/美元',
          price: 1.0876,
          change: 0.0034,
          changePercent: 0.31,
          high: 1.0900,
          low: 1.0850,
          open: 1.0842,
          volume: 345678
        }
      }
    };
  },
  
  // 模拟国际原油
  getMockInternationalOil: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        oil: [
          {
            symbol: 'CL',
            name: 'WTI原油',
            price: 78.90,
            change: -0.56,
            changePercent: -0.70,
            high: 79.50,
            low: 78.50,
            open: 79.46,
            volume: 234567
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
            volume: 189012
          }
        ]
      }
    };
  },
  
  // 模拟上海黄金交易所数据
  getMockSGEData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            symbol: 'AU(T+D)',
            name: '黄金T+D',
            price: 485.60,
            change: 2.30,
            changePercent: 0.48,
            high: 486.00,
            low: 484.00,
            open: 483.30,
            volume: 12345
          },
          {
            symbol: 'AG(T+D)',
            name: '白银T+D',
            price: 5.67,
            change: 0.08,
            changePercent: 1.43,
            high: 5.70,
            low: 5.60,
            open: 5.59,
            volume: 89765
          },
          {
            symbol: 'AU9999',
            name: '黄金99.99',
            price: 486.20,
            change: 2.35,
            changePercent: 0.49,
            high: 486.50,
            low: 485.00,
            open: 483.85,
            volume: 5678
          },
          {
            symbol: 'AU9995',
            name: '黄金99.95',
            price: 485.80,
            change: 2.32,
            changePercent: 0.48,
            high: 486.20,
            low: 484.50,
            open: 483.48,
            volume: 3456
          }
        ]
      }
    };
  },
  
  // 模拟银行贵金属投资品种
  getMockBankPreciousMetals: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            symbol: '纸黄金',
            name: '纸黄金',
            buyPrice: 485.00,
            sellPrice: 486.00,
            change: 2.30,
            changePercent: 0.48
          },
          {
            symbol: '纸白银',
            name: '纸白银',
            buyPrice: 5.60,
            sellPrice: 5.70,
            change: 0.08,
            changePercent: 1.43
          }
        ]
      }
    };
  },
  
  // 模拟天津贵金属交易所数据
  getMockTJPGData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            symbol: '现货白银',
            name: '现货白银',
            price: 5.67,
            change: 0.08,
            changePercent: 1.43,
            high: 5.70,
            low: 5.60,
            open: 5.59,
            volume: 89765
          },
          {
            symbol: '现货铂金',
            name: '现货铂金',
            price: 215.60,
            change: 3.20,
            changePercent: 1.51,
            high: 216.00,
            low: 214.00,
            open: 212.40,
            volume: 1234
          },
          {
            symbol: '现货钯金',
            name: '现货钯金',
            price: 325.80,
            change: 4.50,
            changePercent: 1.40,
            high: 326.50,
            low: 324.00,
            open: 321.30,
            volume: 897
          }
        ]
      }
    };
  },
  
  // 模拟上海期货交易所数据
  getMockSHFEData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            symbol: 'AU2606',
            name: '黄金期货',
            price: 485.60,
            change: 2.30,
            changePercent: 0.48,
            high: 486.00,
            low: 484.00,
            open: 483.30,
            volume: 12345
          },
          {
            symbol: 'AG2606',
            name: '白银期货',
            price: 5.67,
            change: 0.08,
            changePercent: 1.43,
            high: 5.70,
            low: 5.60,
            open: 5.59,
            volume: 89765
          }
        ]
      }
    };
  }
};

module.exports = preciousMetals;