/**
 * 中华人民共和国审计署数据接口配置
 */

const axios = require('axios');

const auditConfig = {
  baseUrl: 'https://www.audit.gov.cn',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const auditClient = axios.create({
  baseURL: auditConfig.baseUrl,
  timeout: auditConfig.timeout,
  headers: auditConfig.headers
});

const auditAPI = {
  // 获取审计公告
  getAuditNotices: async function() {
    try {
      const response = await auditClient.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中华人民共和国审计署审计公告获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取审计结果
  getAuditResults: async function() {
    try {
      const response = await auditClient.get('/auditResults/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中华人民共和国审计署审计结果获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取政策法规
  getPolicies: async function() {
    try {
      const response = await auditClient.get('/policy/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中华人民共和国审计署政策法规获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取审计动态
  getAuditNews: async function() {
    try {
      const response = await auditClient.get('/news/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中华人民共和国审计署审计动态获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // 获取专题报道
  getSpecialReports: async function() {
    try {
      const response = await auditClient.get('/special/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('中华人民共和国审计署专题报道获取失败:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = {
  auditConfig,
  auditAPI
};