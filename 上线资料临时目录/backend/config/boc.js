// 中国银行配置文件
const axios = require('axios');

// 中国银行配置
const boc = {
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
  
  // 获取中国银行首页数据
  getHomepage: async function() {
    try {
      // 实际项目中需要根据中国银行的API接口进行调整
      return this.getMockHomepage();
    } catch (error) {
      console.error('获取中国银行首页数据失败:', error);
      return this.getMockHomepage();
    }
  },
  
  // 获取中国银行金融产品
  getFinancialProducts: async function() {
    try {
      // 实际项目中需要根据中国银行的API接口进行调整
      return this.getMockFinancialProducts();
    } catch (error) {
      console.error('获取中国银行金融产品失败:', error);
      return this.getMockFinancialProducts();
    }
  },
  
  // 获取中国银行汇率数据
  getExchangeRates: async function() {
    try {
      // 实际项目中需要根据中国银行的API接口进行调整
      return this.getMockExchangeRates();
    } catch (error) {
      console.error('获取中国银行汇率数据失败:', error);
      return this.getMockExchangeRates();
    }
  },
  
  // 获取中国银行新闻资讯
  getNews: async function() {
    try {
      // 实际项目中需要根据中国银行的API接口进行调整
      return this.getMockNews();
    } catch (error) {
      console.error('获取中国银行新闻资讯失败:', error);
      return this.getMockNews();
    }
  },
  
  // 获取中国银行服务信息
  getServices: async function() {
    try {
      // 实际项目中需要根据中国银行的API接口进行调整
      return this.getMockServices();
    } catch (error) {
      console.error('获取中国银行服务信息失败:', error);
      return this.getMockServices();
    }
  },
  
  // 模拟中国银行首页数据
  getMockHomepage: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        banners: [
          {
            id: '1',
            title: '中国银行推出新版手机银行',
            image: 'https://www.boc.cn/images/banner1.jpg',
            url: 'https://www.boc.cn/banking/banking/mobilebank/'
          },
          {
            id: '2',
            title: '中国银行助力实体经济发展',
            image: 'https://www.boc.cn/images/banner2.jpg',
            url: 'https://www.boc.cn/aboutboc/ab6/202604/t20260403_2618689.html'
          },
          {
            id: '3',
            title: '中国银行汇率优惠活动',
            image: 'https://www.boc.cn/images/banner3.jpg',
            url: 'https://www.boc.cn/sourcedb/whpj/'
          }
        ],
        news: [
          {
            id: '1',
            title: '中国银行2025年业绩稳健增长',
            summary: '中国银行2025年实现净利润2100亿元，同比增长5.2%。',
            publishTime: new Date().toISOString(),
            url: 'https://www.boc.cn/aboutboc/ab6/202603/t20260315_2618688.html'
          },
          {
            id: '2',
            title: '中国银行推出数字人民币新产品',
            summary: '中国银行推出数字人民币钱包新版本，支持更多场景使用。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.boc.cn/banking/banking/digitalrmb/'
          }
        ]
      }
    };
  },
  
  // 模拟中国银行金融产品
  getMockFinancialProducts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            id: '1',
            name: '中银理财-稳富精选',
            type: '理财产品',
            riskLevel: '低风险',
            term: '180天',
            expectedReturn: '3.5%',
            url: 'https://www.boc.cn/personal理财/product/'
          },
          {
            id: '2',
            name: '中银信用卡-长城环球通',
            type: '信用卡',
            annualFee: '0元',
            creditLimit: '最高50万',
            benefits: '全球机场贵宾厅权益',
            url: 'https://www.boc.cn/banking/banking/card/'
          },
          {
            id: '3',
            name: '中银房贷-个人住房贷款',
            type: '贷款',
            interestRate: '4.2%',
            term: '最长30年',
            maximum: '房价的80%',
            url: 'https://www.boc.cn/personal贷款/mortgage/'
          }
        ]
      }
    };
  },
  
  // 模拟中国银行汇率数据
  getMockExchangeRates: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        rates: [
          {
            currency: '美元',
            code: 'USD',
            buy: 7.1523,
            sell: 7.1845,
            middle: 7.1684,
            change: 0.0012
          },
          {
            currency: '欧元',
            code: 'EUR',
            buy: 7.8245,
            sell: 7.8678,
            middle: 7.8462,
            change: -0.0023
          },
          {
            currency: '英镑',
            code: 'GBP',
            buy: 9.1234,
            sell: 9.1678,
            middle: 9.1456,
            change: 0.0034
          },
          {
            currency: '日元',
            code: 'JPY',
            buy: 0.0485,
            sell: 0.0489,
            middle: 0.0487,
            change: -0.0001
          },
          {
            currency: '港币',
            code: 'HKD',
            buy: 0.9123,
            sell: 0.9167,
            middle: 0.9145,
            change: 0.0002
          }
        ]
      }
    };
  },
  
  // 模拟中国银行新闻资讯
  getMockNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '中国银行成功举办2026年金融科技创新峰会',
            summary: '中国银行成功举办2026年金融科技创新峰会，探讨金融科技发展趋势。',
            publishTime: new Date().toISOString(),
            url: 'https://www.boc.cn/aboutboc/ab6/202604/t20260401_2618687.html'
          },
          {
            id: '2',
            title: '中国银行与多家科技企业达成战略合作',
            summary: '中国银行与多家科技企业达成战略合作，推动金融数字化转型。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.boc.cn/aboutboc/ab6/202603/t20260328_2618686.html'
          },
          {
            id: '3',
            title: '中国银行发布2025年度可持续发展报告',
            summary: '中国银行发布2025年度可持续发展报告，彰显绿色金融实践成果。',
            publishTime: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://www.boc.cn/aboutboc/ab6/202603/t20260320_2618685.html'
          }
        ]
      }
    };
  },
  
  // 模拟中国银行服务信息
  getMockServices: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '个人银行业务',
            description: '提供个人储蓄、贷款、信用卡、理财等全方位金融服务。',
            url: 'https://www.boc.cn/personal/'
          },
          {
            id: '2',
            name: '公司银行业务',
            description: '为企业提供账户管理、融资、结算、现金管理等综合金融解决方案。',
            url: 'https://www.boc.cn/company/'
          },
          {
            id: '3',
            name: '金融市场业务',
            description: '提供外汇、债券、衍生品等金融市场产品和服务。',
            url: 'https://www.boc.cn/financialmarket/'
          },
          {
            id: '4',
            name: '国际业务',
            description: '提供跨境金融服务，包括国际结算、贸易融资、外汇业务等。',
            url: 'https://www.boc.cn/international/'
          },
          {
            id: '5',
            name: '数字银行服务',
            description: '提供网上银行、手机银行、数字人民币等数字化金融服务。',
            url: 'https://www.boc.cn/banking/'
          }
        ]
      }
    };
  }
};

module.exports = boc;