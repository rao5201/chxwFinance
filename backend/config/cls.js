/**
 * 财联社数据接口配置
 */

const axios = require('axios');

const clsConfig = {
  baseUrl: 'https://www.cls.cn',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const clsClient = axios.create({
  baseURL: clsConfig.baseUrl,
  timeout: clsConfig.timeout,
  headers: clsConfig.headers
});

const clsAPI = {
  // 获取财经新闻
  getFinancialNews: async function() {
    try {
      const response = await clsClient.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('财联社财经新闻获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取市场资讯
  getMarketInfo: async function() {
    try {
      const response = await clsClient.get('/api/sw?app=cailianpress');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('财联社市场资讯获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取股票行情
  getStockMarket: async function() {
    try {
      const response = await clsClient.get('/api/sw?app=cailianpress&type=stock');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('财联社股票行情获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取财经日历
  getFinancialCalendar: async function() {
    try {
      const response = await clsClient.get('/api/sw?app=cailianpress&type=calendar');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('财联社财经日历获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取深度分析
  getDeepAnalysis: async function() {
    try {
      const response = await clsClient.get('/api/sw?app=cailianpress&type=analysis');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('财联社深度分析获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  clsConfig,
  clsAPI
};