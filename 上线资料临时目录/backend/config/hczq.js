// 华创证券配置文件
const axios = require('axios');

// 华创证券配置
const hczq = {
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
  
  // 获取华创证券首页数据
  getHomepage: async function() {
    try {
      // 实际项目中需要根据华创证券的API接口进行调整
      return this.getMockHomepage();
    } catch (error) {
      console.error('获取华创证券首页数据失败:', error);
      return this.getMockHomepage();
    }
  },
  
  // 获取华创证券行情数据
  getMarketData: async function() {
    try {
      // 实际项目中需要根据华创证券的API接口进行调整
      return this.getMockMarketData();
    } catch (error) {
      console.error('获取华创证券行情数据失败:', error);
      return this.getMockMarketData();
    }
  },
  
  // 获取华创证券研究报告
  getResearchReports: async function() {
    try {
      // 实际项目中需要根据华创证券的API接口进行调整
      return this.getMockResearchReports();
    } catch (error) {
      console.error('获取华创证券研究报告失败:', error);
      return this.getMockResearchReports();
    }
  },
  
  // 获取华创证券金融产品
  getFinancialProducts: async function() {
    try {
      // 实际项目中需要根据华创证券的API接口进行调整
      return this.getMockFinancialProducts();
    } catch (error) {
      console.error('获取华创证券金融产品失败:', error);
      return this.getMockFinancialProducts();
    }
  },
  
  // 获取华创证券服务信息
  getServices: async function() {
    try {
      // 实际项目中需要根据华创证券的API接口进行调整
      return this.getMockServices();
    } catch (error) {
      console.error('获取华创证券服务信息失败:', error);
      return this.getMockServices();
    }
  },
  
  // 模拟华创证券首页数据
  getMockHomepage: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        banners: [
          {
            id: '1',
            title: '华创证券推出新版交易系统',
            image: 'https://www.hczq.com/images/banner1.jpg',
            url: 'https://www.hczq.com/trade/'
          },
          {
            id: '2',
            title: '华创证券2026年投资策略报告',
            image: 'https://www.hczq.com/images/banner2.jpg',
            url: 'https://www.hczq.com/research/2026strategy/'
          },
          {
            id: '3',
            title: '华创证券开户优惠活动',
            image: 'https://www.hczq.com/images/banner3.jpg',
            url: 'https://www.hczq.com/account/open/'
          }
        ],
        news: [
          {
            id: '1',
            title: '华创证券2025年业绩稳健增长',
            summary: '华创证券2025年实现净利润15亿元，同比增长8.2%。',
            publishTime: new Date().toISOString(),
            url: 'https://www.hczq.com/about/news/202603/t20260315_2618688.html'
          },
          {
            id: '2',
            title: '华创证券获得多项行业奖项',
            summary: '华创证券获得2025年度最佳证券经纪商、最佳研究团队等多项行业奖项。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.hczq.com/about/awards/202603/t20260310_2618687.html'
          }
        ]
      }
    };
  },
  
  // 模拟华创证券行情数据
  getMockMarketData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        indices: [
          {
            name: '上证指数',
            code: '000001.SH',
            price: 3521.45,
            change: 23.67,
            changePercent: 0.68,
            volume: 28567890000,
            amount: 324567890000
          },
          {
            name: '深证成指',
            code: '399001.SZ',
            price: 14235.67,
            change: 89.34,
            changePercent: 0.63,
            volume: 35678900000,
            amount: 412345678900
          },
          {
            name: '创业板指',
            code: '399006.SZ',
            price: 2867.89,
            change: 45.67,
            changePercent: 1.62,
            volume: 18900000000,
            amount: 234567890000
          }
        ],
        hotStocks: [
          {
            name: '贵州茅台',
            code: '600519.SH',
            price: 1890.50,
            change: 23.45,
            changePercent: 1.26
          },
          {
            name: '宁德时代',
            code: '300750.SZ',
            price: 245.67,
            change: 12.34,
            changePercent: 5.28
          },
          {
            name: '招商银行',
            code: '600036.SH',
            price: 38.78,
            change: 0.98,
            changePercent: 2.60
          }
        ]
      }
    };
  },
  
  // 模拟华创证券研究报告
  getMockResearchReports: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        reports: [
          {
            id: '1',
            title: '2026年中国股市投资策略报告',
            author: '华创证券研究团队',
            date: '2026-03-15',
            summary: '本报告分析了2026年中国股市的投资机会和风险，提出了相关投资策略。',
            url: 'https://www.hczq.com/research/report/202603/t20260315_2618688.html'
          },
          {
            id: '2',
            title: '新能源行业深度研究报告',
            author: '华创证券新能源研究小组',
            date: '2026-03-10',
            summary: '本报告深入分析了新能源行业的发展现状、趋势和投资机会。',
            url: 'https://www.hczq.com/research/report/202603/t20260310_2618687.html'
          },
          {
            id: '3',
            title: '银行业2026年展望',
            author: '华创证券金融行业研究团队',
            date: '2026-03-05',
            summary: '本报告分析了银行业2026年的发展趋势和投资机会。',
            url: 'https://www.hczq.com/research/report/202603/t20260305_2618686.html'
          }
        ]
      }
    };
  },
  
  // 模拟华创证券金融产品
  getMockFinancialProducts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            id: '1',
            name: '华创创赢精选1号',
            type: '资产管理计划',
            riskLevel: '中风险',
            term: '1年',
            expectedReturn: '8.5%',
            url: 'https://www.hczq.com/product/asset/123456.html'
          },
          {
            id: '2',
            name: '华创债券增强型基金',
            type: '基金产品',
            riskLevel: '低风险',
            term: '灵活',
            expectedReturn: '4.5%',
            url: 'https://www.hczq.com/product/fund/123457.html'
          },
          {
            id: '3',
            name: '华创科创板打新策略',
            type: '投资顾问服务',
            riskLevel: '中风险',
            term: '6个月',
            expectedReturn: '12.0%',
            url: 'https://www.hczq.com/product/advisory/123458.html'
          }
        ]
      }
    };
  },
  
  // 模拟华创证券服务信息
  getMockServices: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '证券经纪业务',
            description: '提供股票、基金、债券等证券交易服务。',
            url: 'https://www.hczq.com/brokerage/'
          },
          {
            id: '2',
            name: '投资银行业务',
            description: '提供企业上市、并购重组、债券发行等投资银行服务。',
            url: 'https://www.hczq.com/investmentbank/'
          },
          {
            id: '3',
            name: '资产管理业务',
            description: '提供资产管理计划、基金等资产管理服务。',
            url: 'https://www.hczq.com/assetmanagement/'
          },
          {
            id: '4',
            name: '研究咨询业务',
            description: '提供行业研究、投资策略、个股分析等研究咨询服务。',
            url: 'https://www.hczq.com/research/'
          },
          {
            id: '5',
            name: '信用业务',
            description: '提供融资融券、股票质押等信用业务服务。',
            url: 'https://www.hczq.com/credit/'
          }
        ]
      }
    };
  }
};

module.exports = hczq;