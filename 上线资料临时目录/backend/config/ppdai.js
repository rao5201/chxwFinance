// 拍拍贷配置文件
const axios = require('axios');

// 拍拍贷配置
const ppdai = {
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
  
  // 获取拍拍贷首页数据
  getHomepage: async function() {
    try {
      // 实际项目中需要根据拍拍贷的API接口进行调整
      return this.getMockHomepage();
    } catch (error) {
      console.error('获取拍拍贷首页数据失败:', error);
      return this.getMockHomepage();
    }
  },
  
  // 获取拍拍贷贷款产品
  getLoanProducts: async function() {
    try {
      // 实际项目中需要根据拍拍贷的API接口进行调整
      return this.getMockLoanProducts();
    } catch (error) {
      console.error('获取拍拍贷贷款产品失败:', error);
      return this.getMockLoanProducts();
    }
  },
  
  // 获取拍拍贷金融科技服务
  getFintechServices: async function() {
    try {
      // 实际项目中需要根据拍拍贷的API接口进行调整
      return this.getMockFintechServices();
    } catch (error) {
      console.error('获取拍拍贷金融科技服务失败:', error);
      return this.getMockFintechServices();
    }
  },
  
  // 获取拍拍贷新闻资讯
  getNews: async function() {
    try {
      // 实际项目中需要根据拍拍贷的API接口进行调整
      return this.getMockNews();
    } catch (error) {
      console.error('获取拍拍贷新闻资讯失败:', error);
      return this.getMockNews();
    }
  },
  
  // 模拟拍拍贷首页数据
  getMockHomepage: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        banners: [
          {
            id: '1',
            title: '拍拍贷：科技驱动消费金融创新',
            image: 'https://www.ppdai.com/images/banner1.jpg',
            url: 'https://www.ppdai.com/about/innovation/'
          },
          {
            id: '2',
            title: '信也科技2025年业绩稳健增长',
            image: 'https://www.ppdai.com/images/banner2.jpg',
            url: 'https://www.ppdai.com/about/financial/'
          },
          {
            id: '3',
            title: '拍拍贷个人消费贷款服务',
            image: 'https://www.ppdai.com/images/banner3.jpg',
            url: 'https://www.ppdai.com/loan/personal/'
          }
        ],
        news: [
          {
            id: '1',
            title: '信也科技入选2025年金融科技影响力企业',
            summary: '信也科技成功入选2025年金融科技影响力企业，彰显科技实力。',
            publishTime: new Date().toISOString(),
            url: 'https://www.ppdai.com/news/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: '拍拍贷推出新版移动App',
            summary: '拍拍贷推出新版移动App，提升用户体验，优化借款流程。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.ppdai.com/news/202604/t20260402_2618688.html'
          }
        ]
      }
    };
  },
  
  // 模拟拍拍贷贷款产品
  getMockLoanProducts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            id: '1',
            name: '个人消费贷款',
            type: '消费贷款',
            amount: '最高20万',
            interestRate: '日利率低至0.02%',
            term: '3-36个月',
            url: 'https://www.ppdai.com/loan/personal/'
          },
          {
            id: '2',
            name: '企业经营贷款',
            type: '经营贷款',
            amount: '最高50万',
            interestRate: '日利率低至0.03%',
            term: '3-24个月',
            url: 'https://www.ppdai.com/loan/business/'
          },
          {
            id: '3',
            name: '车贷',
            type: '汽车贷款',
            amount: '最高30万',
            interestRate: '日利率低至0.025%',
            term: '3-36个月',
            url: 'https://www.ppdai.com/loan/car/'
          }
        ]
      }
    };
  },
  
  // 模拟拍拍贷金融科技服务
  getMockFintechServices: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '智能风控系统',
            description: '基于AI技术的智能风控系统，提高风险识别能力。',
            url: 'https://www.ppdai.com/fintech/risk/'
          },
          {
            id: '2',
            name: '智能获客系统',
            description: '通过大数据分析，精准匹配潜在客户。',
            url: 'https://www.ppdai.com/fintech/customer/'
          },
          {
            id: '3',
            name: '智能客服',
            description: 'AI驱动的智能客服系统，提供24小时服务。',
            url: 'https://www.ppdai.com/fintech/service/'
          },
          {
            id: '4',
            name: '区块链技术应用',
            description: '利用区块链技术，提升数据安全性和透明度。',
            url: 'https://www.ppdai.com/fintech/blockchain/'
          }
        ]
      }
    };
  },
  
  // 模拟拍拍贷新闻资讯
  getMockNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '信也科技发布2025年第四季度财报',
            summary: '信也科技2025年第四季度营收15亿元，净利润3亿元，同比增长12%。',
            publishTime: new Date().toISOString(),
            url: 'https://www.ppdai.com/news/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: '拍拍贷与多家银行达成战略合作',
            summary: '拍拍贷与多家银行达成战略合作，共同推进消费金融业务发展。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.ppdai.com/news/202604/t20260402_2618688.html'
          },
          {
            id: '3',
            title: '信也科技入选福布斯中国金融科技50强',
            summary: '信也科技连续三年入选福布斯中国金融科技50强，排名第15位。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.ppdai.com/news/202604/t20260401_2618687.html'
          }
        ]
      }
    };
  }
};

module.exports = ppdai;