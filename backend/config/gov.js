/**
 * 中国政府网数据接口配置
 */

const axios = require('axios');

const govConfig = {
  baseUrl: 'https://www.gov.cn',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const govClient = axios.create({
  baseURL: govConfig.baseUrl,
  timeout: govConfig.timeout,
  headers: govConfig.headers
});

const govAPI = {
  // 获取政策文件
  getPolicies: async function() {
    try {
      const response = await govClient.get('/zhengce/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府网政策文件获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取国务院文件
  getStateCouncilDocuments: async function() {
    try {
      const response = await govClient.get('/zhengce/zhengceku/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府网国务院文件获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取政策解读
  getPolicyInterpretations: async function() {
    try {
      const response = await govClient.get('/zhengce/zhuanti/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府网政策解读获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取经济数据
  getEconomicData: async function() {
    try {
      const response = await govClient.get('/xinwen/lianbo/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府网经济数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取新闻发布
  getPressReleases: async function() {
    try {
      const response = await govClient.get('/xinwen/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府网新闻发布获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  govConfig,
  govAPI
};