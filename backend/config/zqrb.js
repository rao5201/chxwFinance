// 证券日报配置文件
const axios = require('axios');

// 证券日报配置
const zqrb = {
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
  
  // 获取证券日报首页数据
  getHomepage: async function() {
    try {
      // 实际项目中需要根据证券日报的API接口进行调整
      return this.getMockHomepage();
    } catch (error) {
      console.error('获取证券日报首页数据失败:', error);
      return this.getMockHomepage();
    }
  },
  
  // 获取证券日报新闻资讯
  getNews: async function() {
    try {
      // 实际项目中需要根据证券日报的API接口进行调整
      return this.getMockNews();
    } catch (error) {
      console.error('获取证券日报新闻资讯失败:', error);
      return this.getMockNews();
    }
  },
  
  // 获取证券日报市场分析
  getMarketAnalysis: async function() {
    try {
      // 实际项目中需要根据证券日报的API接口进行调整
      return this.getMockMarketAnalysis();
    } catch (error) {
      console.error('获取证券日报市场分析失败:', error);
      return this.getMockMarketAnalysis();
    }
  },
  
  // 获取证券日报公司报道
  getCompanyReports: async function() {
    try {
      // 实际项目中需要根据证券日报的API接口进行调整
      return this.getMockCompanyReports();
    } catch (error) {
      console.error('获取证券日报公司报道失败:', error);
      return this.getMockCompanyReports();
    }
  },
  
  // 获取证券日报金融科技
  getFintech: async function() {
    try {
      // 实际项目中需要根据证券日报的API接口进行调整
      return this.getMockFintech();
    } catch (error) {
      console.error('获取证券日报金融科技失败:', error);
      return this.getMockFintech();
    }
  },
  
  // 模拟证券日报首页数据
  getMockHomepage: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        banners: [
          {
            id: '1',
            title: '证券日报：A股市场迎来新机遇',
            image: 'http://www.zqrb.cn/images/banner1.jpg',
            url: 'http://www.zqrb.cn/news/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: '2026年中国经济展望',
            image: 'http://www.zqrb.cn/images/banner2.jpg',
            url: 'http://www.zqrb.cn/economy/202604/t20260402_2618688.html'
          },
          {
            id: '3',
            title: '金融科技发展新趋势',
            image: 'http://www.zqrb.cn/images/banner3.jpg',
            url: 'http://www.zqrb.cn/fintech/202604/t20260401_2618687.html'
          }
        ],
        news: [
          {
            id: '1',
            title: '证监会：进一步提高上市公司质量',
            summary: '证监会表示，将进一步提高上市公司质量，加强信息披露监管。',
            publishTime: new Date().toISOString(),
            url: 'http://www.zqrb.cn/news/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: 'A股市场震荡上行，沪指突破3500点',
            summary: 'A股市场震荡上行，沪指突破3500点，市场情绪明显好转。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'http://www.zqrb.cn/market/202604/t20260403_2618688.html'
          }
        ]
      }
    };
  },
  
  // 模拟证券日报新闻资讯
  getMockNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '央行：保持货币政策稳健中性',
            summary: '央行表示，将保持货币政策稳健中性，为经济高质量发展营造适宜的货币金融环境。',
            publishTime: new Date().toISOString(),
            url: 'http://www.zqrb.cn/news/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: '银保监会：加强银行业保险业风险防控',
            summary: '银保监会要求加强银行业保险业风险防控，确保金融体系安全稳定。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'http://www.zqrb.cn/news/202604/t20260402_2618688.html'
          },
          {
            id: '3',
            title: '国务院：进一步深化金融改革',
            summary: '国务院发布关于进一步深化金融改革的意见，推动金融更好服务实体经济。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'http://www.zqrb.cn/news/202604/t20260401_2618687.html'
          }
        ]
      }
    };
  },
  
  // 模拟证券日报市场分析
  getMockMarketAnalysis: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        analysis: [
          {
            id: '1',
            title: '2026年A股市场投资策略分析',
            author: '证券日报市场研究中心',
            summary: '本文分析了2026年A股市场的投资机会和风险，提出了相关投资策略。',
            publishTime: new Date().toISOString(),
            url: 'http://www.zqrb.cn/market/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: '新能源行业投资机会分析',
            author: '证券日报行业研究团队',
            summary: '本文深入分析了新能源行业的发展现状、趋势和投资机会。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'http://www.zqrb.cn/market/202604/t20260401_2618687.html'
          }
        ]
      }
    };
  },
  
  // 模拟证券日报公司报道
  getMockCompanyReports: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        reports: [
          {
            id: '1',
            title: '贵州茅台：2025年业绩稳健增长',
            summary: '贵州茅台2025年实现净利润750亿元，同比增长15.2%。',
            publishTime: new Date().toISOString(),
            url: 'http://www.zqrb.cn/company/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: '宁德时代：全球动力电池市场份额第一',
            summary: '宁德时代2025年全球动力电池市场份额达到35%，位居全球第一。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'http://www.zqrb.cn/company/202604/t20260402_2618688.html'
          },
          {
            id: '3',
            title: '招商银行：数字化转型成效显著',
            summary: '招商银行2025年数字化转型成效显著，零售业务收入占比达到60%。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'http://www.zqrb.cn/company/202604/t20260401_2618687.html'
          }
        ]
      }
    };
  },
  
  // 模拟证券日报金融科技
  getMockFintech: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        articles: [
          {
            id: '1',
            title: '金融科技发展报告：2025年市场规模突破20万亿元',
            summary: '《金融科技发展报告》显示，2025年我国金融科技市场规模突破20万亿元，增速保持在20%以上。',
            publishTime: new Date().toISOString(),
            url: 'http://www.zqrb.cn/fintech/202604/t20260403_2618689.html'
          },
          {
            id: '2',
            title: 'AI在金融领域的应用日益广泛',
            summary: '人工智能在金融领域的应用日益广泛，智能投顾成为新的发展热点。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'http://www.zqrb.cn/fintech/202604/t20260402_2618688.html'
          },
          {
            id: '3',
            title: '数字人民币试点范围扩大',
            summary: '数字人民币试点范围进一步扩大，已覆盖全国31个省份。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'http://www.zqrb.cn/fintech/202604/t20260401_2618687.html'
          }
        ]
      }
    };
  }
};

module.exports = zqrb;