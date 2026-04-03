/**
 * 网易财经数据接口配置
 */

const axios = require('axios');

const money163Config = {
  baseUrl: 'https://money.163.com',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const money163Client = axios.create({
  baseURL: money163Config.baseUrl,
  timeout: money163Config.timeout,
  headers: money163Config.headers
});

const money163API = {
  // 获取财经新闻
  getFinancialNews: async function() {
    try {
      const response = await money163Client.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('网易财经新闻获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取股票行情
  getStockMarket: async function() {
    try {
      const response = await money163Client.get('/stock/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('网易财经股票行情获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取基金数据
  getFundData: async function() {
    try {
      const response = await money163Client.get('/fund/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('网易财经基金数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取债券数据
  getBondData: async function() {
    try {
      const response = await money163Client.get('/bond/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('网易财经债券数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取外汇数据
  getForexData: async function() {
    try {
      const response = await money163Client.get('/forex/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('网易财经外汇数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  money163Config,
  money163API
};