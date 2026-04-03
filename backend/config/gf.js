// 广发证券配置文件
const axios = require('axios');

// 广发证券配置
const gf = {
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
  
  // 获取行情数据
  getMarketData: async function() {
    try {
      // 实际项目中需要根据广发证券的API接口进行调整
      return this.getMockMarketData();
    } catch (error) {
      console.error('获取行情数据失败:', error);
      return this.getMockMarketData();
    }
  },
  
  // 获取研究报告
  getResearchReports: async function() {
    try {
      // 实际项目中需要根据广发证券的API接口进行调整
      return this.getMockResearchReports();
    } catch (error) {
      console.error('获取研究报告失败:', error);
      return this.getMockResearchReports();
    }
  },
  
  // 获取产品信息
  getProducts: async function() {
    try {
      // 实际项目中需要根据广发证券的API接口进行调整
      return this.getMockProducts();
    } catch (error) {
      console.error('获取产品信息失败:', error);
      return this.getMockProducts();
    }
  },
  
  // 获取市场资讯
  getMarketNews: async function() {
    try {
      // 实际项目中需要根据广发证券的API接口进行调整
      return this.getMockMarketNews();
    } catch (error) {
      console.error('获取市场资讯失败:', error);
      return this.getMockMarketNews();
    }
  },
  
  // 获取投资顾问服务
  getInvestmentAdvisory: async function() {
    try {
      // 实际项目中需要根据广发证券的API接口进行调整
      return this.getMockInvestmentAdvisory();
    } catch (error) {
      console.error('获取投资顾问服务失败:', error);
      return this.getMockInvestmentAdvisory();
    }
  },
  
  // 模拟行情数据
  getMockMarketData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        marketData: {
          indices: [
            {
              name: '上证指数',
              code: '000001.SH',
              price: 3850.25,
              change: 25.68,
              changePercent: 0.67,
              volume: 32567890000,
              turnover: 45678900000
            },
            {
              name: '深证成指',
              code: '399001.SZ',
              price: 12850.68,
              change: 156.32,
              changePercent: 1.23,
              volume: 45678900000,
              turnover: 67890123456
            },
            {
              name: '创业板指',
              code: '399006.SZ',
              price: 2560.32,
              change: 45.68,
              changePercent: 1.81,
              volume: 23456789000,
              turnover: 34567890123
            }
          ],
          sectors: [
            {
              name: '科技',
              changePercent: 2.56,
              leadingStocks: ['000001', '000002', '000003']
            },
            {
              name: '金融',
              changePercent: 0.89,
              leadingStocks: ['600000', '600036', '601318']
            },
            {
              name: '医药',
              changePercent: 1.23,
              leadingStocks: ['600276', '600518', '000661']
            },
            {
              name: '能源',
              changePercent: -0.45,
              leadingStocks: ['601857', '600028', '600583']
            }
          ]
        }
      }
    };
  },
  
  // 模拟研究报告
  getMockResearchReports: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        reports: [
          {
            id: '1',
            title: '2026年A股市场投资策略报告',
            summary: '本报告分析了2026年A股市场的投资机会和风险，提出了投资策略建议。',
            author: '广发证券研究团队',
            publishDate: '2026-01-15',
            url: 'https://www.gf.com.cn/web/research/report/123456'
          },
          {
            id: '2',
            title: '科技行业深度研究报告',
            summary: '本报告对科技行业的发展趋势、投资机会和风险进行了深度分析。',
            author: '广发证券科技行业研究团队',
            publishDate: '2026-02-20',
            url: 'https://www.gf.com.cn/web/research/report/123457'
          },
          {
            id: '3',
            title: '医药行业投资机会分析',
            summary: '本报告分析了医药行业的投资机会和风险，提出了投资建议。',
            author: '广发证券医药行业研究团队',
            publishDate: '2026-03-10',
            url: 'https://www.gf.com.cn/web/research/report/123458'
          }
        ]
      }
    };
  },
  
  // 模拟产品信息
  getMockProducts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            id: '1',
            name: '广发稳健增长混合',
            type: '混合型基金',
            riskLevel: '中风险',
            manager: '刘格菘',
            establishedDate: '2018-01-15',
            nav: 3.2567,
            yearReturn: 12.34,
            url: 'https://www.gf.com.cn/web/product/123456'
          },
          {
            id: '2',
            name: '广发创新升级混合',
            type: '混合型基金',
            riskLevel: '中高风险',
            manager: '冯明远',
            establishedDate: '2017-05-10',
            nav: 4.5678,
            yearReturn: 18.90,
            url: 'https://www.gf.com.cn/web/product/123457'
          },
          {
            id: '3',
            name: '广发沪深300ETF',
            type: '指数型基金',
            riskLevel: '中风险',
            manager: '罗国庆',
            establishedDate: '2013-08-15',
            nav: 1.5678,
            yearReturn: 8.90,
            url: 'https://www.gf.com.cn/web/product/123458'
          }
        ]
      }
    };
  },
  
  // 模拟市场资讯
  getMockMarketNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '央行：保持流动性合理充裕',
            summary: '中国人民银行表示，将保持流动性合理充裕，引导市场利率下行，支持实体经济发展。',
            publishTime: new Date().toISOString(),
            url: 'https://www.gf.com.cn/web/news/123456'
          },
          {
            id: '2',
            title: '科技股集体上涨，创业板指涨幅超1.8%',
            summary: '今日科技股集体上涨，创业板指涨幅超1.8%，芯片、AI等板块表现强势。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.gf.com.cn/web/news/123457'
          },
          {
            id: '3',
            title: '新能源汽车销量持续增长，渗透率突破30%',
            summary: '今年3月新能源汽车销量持续增长，渗透率突破30%，行业发展前景广阔。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.gf.com.cn/web/news/123458'
          }
        ]
      }
    };
  },
  
  // 模拟投资顾问服务
  getMockInvestmentAdvisory: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '广发智投',
            description: '基于人工智能的智能投顾服务，为投资者提供个性化的投资组合建议。',
            features: ['智能资产配置', '风险评估', '定期调仓', '专业投顾支持'],
            url: 'https://www.gf.com.cn/web/advisory/123456'
          },
          {
            id: '2',
            name: '广发金管家',
            description: '为高端客户提供的专属财富管理服务，包括资产配置、投资顾问、税务规划等。',
            features: ['专属投顾', '定制化方案', '全球资产配置', '税务规划'],
            url: 'https://www.gf.com.cn/web/advisory/123457'
          },
          {
            id: '3',
            name: '广发基金定投',
            description: '定期定额投资基金的服务，帮助投资者养成良好的投资习惯。',
            features: ['自动扣款', '分散风险', '长期投资', '专业基金推荐'],
            url: 'https://www.gf.com.cn/web/advisory/123458'
          }
        ]
      }
    };
  }
};

module.exports = gf;