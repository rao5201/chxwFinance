// 东方财富 Choice 智能金融数据配置文件
const axios = require('axios');

// Choice 智能金融数据配置
const choice = {
  // API基础配置
  config: {
    baseUrl: 'https://choice.eastmoney.com',
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
  
  // 获取市场概览
  getMarketOverview: async function() {
    try {
      // 实际项目中需要根据 Choice 的 API 接口进行调整
      return this.getMockMarketOverview();
    } catch (error) {
      console.error('获取市场概览失败:', error);
      return this.getMockMarketOverview();
    }
  },
  
  // 获取股票数据
  getStockData: async function(symbol) {
    try {
      // 实际项目中需要根据 Choice 的 API 接口进行调整
      return this.getMockStockData(symbol);
    } catch (error) {
      console.error('获取股票数据失败:', error);
      return this.getMockStockData(symbol);
    }
  },
  
  // 获取行业数据
  getIndustryData: async function() {
    try {
      // 实际项目中需要根据 Choice 的 API 接口进行调整
      return this.getMockIndustryData();
    } catch (error) {
      console.error('获取行业数据失败:', error);
      return this.getMockIndustryData();
    }
  },
  
  // 获取宏观经济数据
  getMacroData: async function() {
    try {
      // 实际项目中需要根据 Choice 的 API 接口进行调整
      return this.getMockMacroData();
    } catch (error) {
      console.error('获取宏观经济数据失败:', error);
      return this.getMockMacroData();
    }
  },
  
  // 模拟市场概览数据
  getMockMarketOverview: function() {
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
          },
          {
            symbol: '000300.SH',
            name: '沪深300',
            price: 4125.36,
            change: 28.75,
            changePercent: 0.70,
            volume: 1890123456,
            amount: 29876543210
          }
        ],
        marketStatus: {
          status: '交易中',
          openTime: '09:30',
          closeTime: '15:00'
        }
      }
    };
  },
  
  // 模拟股票数据
  getMockStockData: function(symbol) {
    const stockMap = {
      '600519.SH': {
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
      '000858.SZ': {
        symbol: '000858.SZ',
        name: '五粮液',
        price: 168.50,
        change: 2.30,
        changePercent: 1.39,
        open: 166.20,
        high: 169.00,
        low: 166.00,
        prevClose: 166.20,
        volume: 4567890,
        amount: 768901234,
        marketCap: 680000000000,
        pe: 28.5,
        pb: 6.8,
        roe: 22.5,
        industry: '白酒',
        sector: '食品饮料'
      }
    };
    
    return {
      success: true,
      data: stockMap[symbol] || {
        symbol: symbol,
        name: '未知股票',
        price: 0,
        change: 0,
        changePercent: 0,
        open: 0,
        high: 0,
        low: 0,
        prevClose: 0,
        volume: 0,
        amount: 0,
        marketCap: 0,
        pe: 0,
        pb: 0,
        roe: 0,
        industry: '',
        sector: ''
      }
    };
  },
  
  // 模拟行业数据
  getMockIndustryData: function() {
    return {
      success: true,
      data: {
        industries: [
          {
            name: '食品饮料',
            change: 1.25,
            leadStock: '贵州茅台',
            leadStockSymbol: '600519.SH',
            leadStockPrice: 1899.00,
            leadStockChange: 0.07
          },
          {
            name: '医药生物',
            change: 0.85,
            leadStock: '恒瑞医药',
            leadStockSymbol: '600276.SH',
            leadStockPrice: 32.50,
            leadStockChange: 2.68
          },
          {
            name: '银行',
            change: -0.55,
            leadStock: '招商银行',
            leadStockSymbol: '600036.SH',
            leadStockPrice: 35.68,
            leadStockChange: -0.89
          },
          {
            name: '电子',
            change: 1.55,
            leadStock: '立讯精密',
            leadStockSymbol: '002475.SZ',
            leadStockPrice: 28.75,
            leadStockChange: 1.95
          }
        ]
      }
    };
  },
  
  // 模拟宏观经济数据
  getMockMacroData: function() {
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
          }
        ]
      }
    };
  }
};

module.exports = choice;