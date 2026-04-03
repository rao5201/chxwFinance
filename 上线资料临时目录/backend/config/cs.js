/**
 * 中国证券报数据接口配置
 */

const axios = require('axios');

const csConfig = {
  baseUrl: 'https://www.cs.com.cn',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const csClient = axios.create({
  baseURL: csConfig.baseUrl,
  timeout: csConfig.timeout,
  headers: csConfig.headers
});

const csAPI = {
  // 获取财经新闻
  getFinancialNews: async function() {
    try {
      const response = await csClient.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国证券报财经新闻获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取股票市场
  getStockMarket: async function() {
    try {
      const response = await csClient.get('/ssgs/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国证券报股票市场获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取基金市场
  getFundMarket: async function() {
    try {
      const response = await csClient.get('/jj/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国证券报基金市场获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取债券市场
  getBondMarket: async function() {
    try {
      const response = await csClient.get('/zq/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国证券报债券市场获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取财经评论
  getFinancialComments: async function() {
    try {
      const response = await csClient.get('/pl/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国证券报财经评论获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  csConfig,
  csAPI
};