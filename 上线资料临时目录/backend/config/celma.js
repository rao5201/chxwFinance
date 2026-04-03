/**
 * 中国资产评估协会数据接口配置
 */

const axios = require('axios');

const celmaConfig = {
  baseUrl: 'https://www.celma.org.cn',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const celmaClient = axios.create({
  baseURL: celmaConfig.baseUrl,
  timeout: celmaConfig.timeout,
  headers: celmaConfig.headers
});

const celmaAPI = {
  // 获取协会新闻
  getAssociationNews: async function() {
    try {
      const response = await celmaClient.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国资产评估协会新闻获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取行业动态
  getIndustryNews: async function() {
    try {
      const response = await celmaClient.get('/news/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国资产评估协会行业动态获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取政策法规
  getPolicies: async function() {
    try {
      const response = await celmaClient.get('/policy/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国资产评估协会政策法规获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取行业数据
  getIndustryData: async function() {
    try {
      const response = await celmaClient.get('/data/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国资产评估协会行业数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取培训信息
  getTrainingInfo: async function() {
    try {
      const response = await celmaClient.get('/training/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国资产评估协会培训信息获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  celmaConfig,
  celmaAPI
};