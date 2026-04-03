/**
 * 中国人民银行数据接口配置
 */

const axios = require('axios');

const pbcConfig = {
  baseUrl: 'https://www.pbc.gov.cn',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const pbcClient = axios.create({
  baseURL: pbcConfig.baseUrl,
  timeout: pbcConfig.timeout,
  headers: pbcConfig.headers
});

const pbcAPI = {
  // 获取货币政策
  getMonetaryPolicy: async function() {
    try {
      const response = await pbcClient.get('/redianzhuanti/118742/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国人民银行货币政策数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取利率政策
  getInterestRatePolicy: async function() {
    try {
      const response = await pbcClient.get('/redianzhuanti/118746/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国人民银行利率政策数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取汇率数据
  getExchangeRate: async function() {
    try {
      const response = await pbcClient.get('/diaocha/tiaoyanbaogao/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国人民银行汇率数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取金融统计数据
  getFinancialStatistics: async function() {
    try {
      const response = await pbcClient.get('/diaocha/tongjishuju/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国人民银行金融统计数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取公告信息
  getAnnouncements: async function() {
    try {
      const response = await pbcClient.get('/gonggao/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国人民银行公告信息获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  pbcConfig,
  pbcAPI
};