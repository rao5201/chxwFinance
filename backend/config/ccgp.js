/**
 * 中国政府采购网数据接口配置
 */

const axios = require('axios');

const ccgpConfig = {
  baseUrl: 'https://www.ccgp.gov.cn',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const ccgpClient = axios.create({
  baseURL: ccgpConfig.baseUrl,
  timeout: ccgpConfig.timeout,
  headers: ccgpConfig.headers
});

const ccgpAPI = {
  // 获取采购公告
  getProcurementNotices: async function() {
    try {
      const response = await ccgpClient.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府采购网采购公告获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取中标公告
  getWinningNotices: async function() {
    try {
      const response = await ccgpClient.get('/cggg/zygg/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府采购网中标公告获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取政策法规
  getPolicies: async function() {
    try {
      const response = await ccgpClient.get('/zcgl/zcfg/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府采购网政策法规获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取采购数据
  getProcurementData: async function() {
    try {
      const response = await ccgpClient.get('/data/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府采购网采购数据获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取专家库
  getExpertDatabase: async function() {
    try {
      const response = await ccgpClient.get('/expert/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中国政府采购网专家库获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  ccgpConfig,
  ccgpAPI
};