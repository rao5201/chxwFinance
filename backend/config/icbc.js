// 中国工商银行配置文件
const axios = require('axios');

// 中国工商银行配置
const icbc = {
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
  
  // 获取中国工商银行首页数据
  getHomepage: async function() {
    try {
      // 实际项目中需要根据中国工商银行的API接口进行调整
      return this.getMockHomepage();
    } catch (error) {
      console.error('获取中国工商银行首页数据失败:', error);
      return this.getMockHomepage();
    }
  },
  
  // 获取中国工商银行金融产品
  getFinancialProducts: async function() {
    try {
      // 实际项目中需要根据中国工商银行的API接口进行调整
      return this.getMockFinancialProducts();
    } catch (error) {
      console.error('获取中国工商银行金融产品失败:', error);
      return this.getMockFinancialProducts();
    }
  },
  
  // 获取中国工商银行汇率数据
  getExchangeRates: async function() {
    try {
      // 实际项目中需要根据中国工商银行的API接口进行调整
      return this.getMockExchangeRates();
    } catch (error) {
      console.error('获取中国工商银行汇率数据失败:', error);
      return this.getMockExchangeRates();
    }
  },
  
  // 获取中国工商银行新闻资讯
  getNews: async function() {
    try {
      // 实际项目中需要根据中国工商银行的API接口进行调整
      return this.getMockNews();
    } catch (error) {
      console.error('获取中国工商银行新闻资讯失败:', error);
      return this.getMockNews();
    }
  },
  
  // 获取中国工商银行服务信息
  getServices: async function() {
    try {
      // 实际项目中需要根据中国工商银行的API接口进行调整
      return this.getMockServices();
    } catch (error) {
      console.error('获取中国工商银行服务信息失败:', error);
      return this.getMockServices();
    }
  },
  
  // 模拟中国工商银行首页数据
  getMockHomepage: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        banners: [
          {
            id: '1',
            title: '工商银行推出新版企业网银',
            image: 'https://www.icbc.com.cn/images/banner1.jpg',
            url: 'https://www.icbc.com.cn/icbc/en/EBanking/CorporateBanking/'
          },
          {
            id: '2',
            title: '工商银行助力小微企业发展',
            image: 'https://www.icbc.com.cn/images/banner2.jpg',
            url: 'https://www.icbc.com.cn/icbc/小微企业金融服务/'
          },
          {
            id: '3',
            title: '工商银行理财产品推荐',
            image: 'https://www.icbc.com.cn/images/banner3.jpg',
            url: 'https://www.icbc.com.cn/icbc/个人金融/理财产品/'
          }
        ],
        news: [
          {
            id: '1',
            title: '工商银行2025年净利润突破3000亿元',
            summary: '工商银行2025年实现净利润3100亿元，同比增长4.8%。',
            publishTime: new Date().toISOString(),
            url: 'https://www.icbc.com.cn/icbc/关于工行/新闻动态/202603/t20260315_2618688.html'
          },
          {
            id: '2',
            title: '工商银行推出数字人民币硬钱包',
            summary: '工商银行推出数字人民币硬钱包，支持离线支付功能。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.icbc.com.cn/icbc/个人金融/数字人民币/'
          }
        ]
      }
    };
  },
  
  // 模拟中国工商银行金融产品
  getMockFinancialProducts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            id: '1',
            name: '工银理财-安富固收',
            type: '理财产品',
            riskLevel: '低风险',
            term: '90天',
            expectedReturn: '3.2%',
            url: 'https://www.icbc.com.cn/icbc/个人金融/理财产品/'
          },
          {
            id: '2',
            name: '工银信用卡-牡丹白金卡',
            type: '信用卡',
            annualFee: '2000元',
            creditLimit: '最高100万',
            benefits: '全球机场贵宾厅权益+高端酒店优惠',
            url: 'https://www.icbc.com.cn/icbc/个人金融/信用卡/'
          },
          {
            id: '3',
            name: '工银经营贷-小微企业贷款',
            type: '贷款',
            interestRate: '3.8%',
            term: '最长5年',
            maximum: '500万元',
            url: 'https://www.icbc.com.cn/icbc/小微企业金融服务/贷款/'
          }
        ]
      }
    };
  },
  
  // 模拟中国工商银行汇率数据
  getMockExchangeRates: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        rates: [
          {
            currency: '美元',
            code: 'USD',
            buy: 7.1535,
            sell: 7.1865,
            middle: 7.1700,
            change: 0.0015
          },
          {
            currency: '欧元',
            code: 'EUR',
            buy: 7.8265,
            sell: 7.8695,
            middle: 7.8480,
            change: -0.0025
          },
          {
            currency: '英镑',
            code: 'GBP',
            buy: 9.1255,
            sell: 9.1695,
            middle: 7.1475,
            change: 0.0035
          },
          {
            currency: '日元',
            code: 'JPY',
            buy: 0.0486,
            sell: 0.0490,
            middle: 0.0488,
            change: -0.0002
          },
          {
            currency: '港币',
            code: 'HKD',
            buy: 0.9125,
            sell: 0.9169,
            middle: 0.9147,
            change: 0.0003
          }
        ]
      }
    };
  },
  
  // 模拟中国工商银行新闻资讯
  getMockNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '工商银行成功举办2026年数字金融峰会',
            summary: '工商银行成功举办2026年数字金融峰会，探讨数字金融发展趋势。',
            publishTime: new Date().toISOString(),
            url: 'https://www.icbc.com.cn/icbc/关于工行/新闻动态/202604/t20260401_2618687.html'
          },
          {
            id: '2',
            title: '工商银行与多家科技公司达成战略合作',
            summary: '工商银行与多家科技公司达成战略合作，推动金融科技创新。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.icbc.com.cn/icbc/关于工行/新闻动态/202603/t20260328_2618686.html'
          },
          {
            id: '3',
            title: '工商银行发布2025年度社会责任报告',
            summary: '工商银行发布2025年度社会责任报告，彰显绿色金融实践成果。',
            publishTime: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://www.icbc.com.cn/icbc/关于工行/社会责任/202603/t20260320_2618685.html'
          }
        ]
      }
    };
  },
  
  // 模拟中国工商银行服务信息
  getMockServices: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '个人金融服务',
            description: '提供个人储蓄、贷款、信用卡、理财等全方位金融服务。',
            url: 'https://www.icbc.com.cn/icbc/个人金融/'
          },
          {
            id: '2',
            name: '企业金融服务',
            description: '为企业提供账户管理、融资、结算、现金管理等综合金融解决方案。',
            url: 'https://www.icbc.com.cn/icbc/企业金融/'
          },
          {
            id: '3',
            name: '金融市场服务',
            description: '提供外汇、债券、衍生品等金融市场产品和服务。',
            url: 'https://www.icbc.com.cn/icbc/金融市场/'
          },
          {
            id: '4',
            name: '国际业务',
            description: '提供跨境金融服务，包括国际结算、贸易融资、外汇业务等。',
            url: 'https://www.icbc.com.cn/icbc/国际业务/'
          },
          {
            id: '5',
            name: '数字金融服务',
            description: '提供网上银行、手机银行、数字人民币等数字化金融服务。',
            url: 'https://www.icbc.com.cn/icbc/数字金融/'
          }
        ]
      }
    };
  }
};

module.exports = icbc;