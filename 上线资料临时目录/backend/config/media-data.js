// 媒体数据源配置文件
const axios = require('axios');

// 媒体数据源配置
const mediaData = {
  // API基础配置
  config: {
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 媒体列表
  mediaList: {
    // 证券媒体
    securities: [
      {
        name: '上证报',
        url: 'http://www.cnstock.com',
        category: 'securities'
      },
      {
        name: '中证网',
        url: 'http://www.cs.com.cn',
        category: 'securities'
      },
      {
        name: '全景网',
        url: 'http://www.p5w.net',
        category: 'securities'
      },
      {
        name: '证券时报',
        url: 'http://www.stcn.com',
        category: 'securities'
      },
      {
        name: '证券日报',
        url: 'http://www.ccstock.cn',
        category: 'securities'
      }
    ],
    // 财经媒体
    finance: [
      {
        name: '界面',
        url: 'http://www.jiemian.com',
        category: 'finance'
      },
      {
        name: '21世纪经济报道',
        url: 'http://www.21jingji.com',
        category: 'finance'
      },
      {
        name: '第一财经',
        url: 'http://www.yicai.com',
        category: 'finance'
      },
      {
        name: '经济观察报',
        url: 'http://www.eeo.com.cn',
        category: 'finance'
      },
      {
        name: '中国经营报',
        url: 'http://www.cb.com.cn',
        category: 'finance'
      },
      {
        name: '每日经济新闻',
        url: 'http://www.nbd.com.cn',
        category: 'finance'
      },
      {
        name: '华尔街见闻',
        url: 'http://www.wallstreetcn.com',
        category: 'finance'
      },
      {
        name: '泡财经',
        url: 'http://www.paocaijing.com',
        category: 'finance'
      },
      {
        name: '财经天下',
        url: 'http://www.caijing.com.cn',
        category: 'finance'
      }
    ],
    // 杂志
    magazines: [
      {
        name: '中国企业家',
        url: 'http://www.iceo.com.cn',
        category: 'magazines'
      },
      {
        name: '财经',
        url: 'http://www.caijing.com.cn',
        category: 'magazines'
      },
      {
        name: '中国新闻周刊',
        url: 'http://www.chinanewsweekly.cn',
        category: 'magazines'
      }
    ],
    // 海外媒体
    overseas: [
      {
        name: '环球网',
        url: 'http://www.huanqiu.com',
        category: 'overseas'
      },
      {
        name: '英为财情',
        url: 'http://www.investing.com',
        category: 'overseas'
      }
    ],
    // 交易所
    exchanges: [
      {
        name: '上海证券交易所',
        url: 'http://www.sse.com.cn',
        category: 'exchanges'
      },
      {
        name: '深圳证券交易所',
        url: 'http://www.szse.cn',
        category: 'exchanges'
      },
      {
        name: '北京证券交易所',
        url: 'http://www.bse.cn',
        category: 'exchanges'
      }
    ]
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
  
  // 获取媒体列表
  getMediaList: function() {
    return {
      success: true,
      data: this.mediaList
    };
  },
  
  // 获取证券媒体新闻
  getSecuritiesNews: async function() {
    try {
      // 实际项目中需要根据各个媒体的API接口进行调整
      return this.getMockSecuritiesNews();
    } catch (error) {
      console.error('获取证券媒体新闻失败:', error);
      return this.getMockSecuritiesNews();
    }
  },
  
  // 获取财经媒体新闻
  getFinanceNews: async function() {
    try {
      // 实际项目中需要根据各个媒体的API接口进行调整
      return this.getMockFinanceNews();
    } catch (error) {
      console.error('获取财经媒体新闻失败:', error);
      return this.getMockFinanceNews();
    }
  },
  
  // 获取杂志文章
  getMagazineArticles: async function() {
    try {
      // 实际项目中需要根据各个杂志的API接口进行调整
      return this.getMockMagazineArticles();
    } catch (error) {
      console.error('获取杂志文章失败:', error);
      return this.getMockMagazineArticles();
    }
  },
  
  // 获取海外媒体新闻
  getOverseasNews: async function() {
    try {
      // 实际项目中需要根据各个海外媒体的API接口进行调整
      return this.getMockOverseasNews();
    } catch (error) {
      console.error('获取海外媒体新闻失败:', error);
      return this.getMockOverseasNews();
    }
  },
  
  // 获取交易所公告
  getExchangeAnnouncements: async function() {
    try {
      // 实际项目中需要根据各个交易所的API接口进行调整
      return this.getMockExchangeAnnouncements();
    } catch (error) {
      console.error('获取交易所公告失败:', error);
      return this.getMockExchangeAnnouncements();
    }
  },
  
  // 模拟证券媒体新闻
  getMockSecuritiesNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: 'A股市场迎来开门红，沪指上涨1.2%',
            source: '上证报',
            time: '2026-04-03 09:30',
            url: 'http://www.cnstock.com/a/20260403/123456.html',
            category: 'securities'
          },
          {
            id: '2',
            title: '证监会发布新规，进一步规范市场秩序',
            source: '中证网',
            time: '2026-04-02 16:00',
            url: 'http://www.cs.com.cn/a/20260402/789012.html',
            category: 'securities'
          },
          {
            id: '3',
            title: '科创板新股申购热度不减，多只新股超额认购',
            source: '全景网',
            time: '2026-04-01 10:00',
            url: 'http://www.p5w.net/a/20260401/345678.html',
            category: 'securities'
          },
          {
            id: '4',
            title: '证券时报：市场信心逐步恢复，结构性机会显现',
            source: '证券时报',
            time: '2026-03-31 14:30',
            url: 'http://www.stcn.com/a/20260331/987654.html',
            category: 'securities'
          },
          {
            id: '5',
            title: '证券日报：一季度A股市场回顾与展望',
            source: '证券日报',
            time: '2026-03-30 11:00',
            url: 'http://www.ccstock.cn/a/20260330/654321.html',
            category: 'securities'
          }
        ]
      }
    };
  },
  
  // 模拟财经媒体新闻
  getMockFinanceNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '界面：2026年第一季度GDP增速超预期，经济复苏势头良好',
            source: '界面',
            time: '2026-04-03 10:00',
            url: 'http://www.jiemian.com/a/20260403/123456.html',
            category: 'finance'
          },
          {
            id: '2',
            title: '21世纪经济报道：新能源汽车行业迎来政策利好',
            source: '21世纪经济报道',
            time: '2026-04-02 15:30',
            url: 'http://www.21jingji.com/a/20260402/789012.html',
            category: 'finance'
          },
          {
            id: '3',
            title: '第一财经：房地产市场企稳，一线城市成交量回升',
            source: '第一财经',
            time: '2026-04-01 14:00',
            url: 'http://www.yicai.com/a/20260401/345678.html',
            category: 'finance'
          },
          {
            id: '4',
            title: '经济观察报：消费复苏成为经济增长新动力',
            source: '经济观察报',
            time: '2026-03-31 16:00',
            url: 'http://www.eeo.com.cn/a/20260331/987654.html',
            category: 'finance'
          },
          {
            id: '5',
            title: '中国经营报：数字经济成为高质量发展的重要引擎',
            source: '中国经营报',
            time: '2026-03-30 10:30',
            url: 'http://www.cb.com.cn/a/20260330/654321.html',
            category: 'finance'
          }
        ]
      }
    };
  },
  
  // 模拟杂志文章
  getMockMagazineArticles: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        articles: [
          {
            id: '1',
            title: '中国企业家：数字化转型如何重塑企业竞争力',
            source: '中国企业家',
            time: '2026-04-01',
            url: 'http://www.iceo.com.cn/a/20260401/123456.html',
            category: 'magazines'
          },
          {
            id: '2',
            title: '财经：全球经济格局变化与中国应对策略',
            source: '财经',
            time: '2026-03-28',
            url: 'http://www.caijing.com.cn/a/20260328/789012.html',
            category: 'magazines'
          },
          {
            id: '3',
            title: '中国新闻周刊：科技创新如何驱动高质量发展',
            source: '中国新闻周刊',
            time: '2026-03-25',
            url: 'http://www.chinanewsweekly.cn/a/20260325/345678.html',
            category: 'magazines'
          }
        ]
      }
    };
  },
  
  // 模拟海外媒体新闻
  getMockOverseasNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '环球网：美联储暗示可能在下半年降息',
            source: '环球网',
            time: '2026-04-03 08:00',
            url: 'http://www.huanqiu.com/a/20260403/123456.html',
            category: 'overseas'
          },
          {
            id: '2',
            title: '英为财情：全球股市普涨，美股创历史新高',
            source: '英为财情',
            time: '2026-04-02 22:00',
            url: 'http://www.investing.com/a/20260402/789012.html',
            category: 'overseas'
          }
        ]
      }
    };
  },
  
  // 模拟交易所公告
  getMockExchangeAnnouncements: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        announcements: [
          {
            id: '1',
            title: '上海证券交易所：关于2026年清明节休市安排的通知',
            source: '上海证券交易所',
            time: '2026-04-01',
            url: 'http://www.sse.com.cn/a/20260401/123456.html',
            category: 'exchanges'
          },
          {
            id: '2',
            title: '深圳证券交易所：关于发布《上市公司股份回购实施细则》的通知',
            source: '深圳证券交易所',
            time: '2026-03-30',
            url: 'http://www.szse.cn/a/20260330/789012.html',
            category: 'exchanges'
          },
          {
            id: '3',
            title: '北京证券交易所：关于开展股票期权交易试点的通知',
            source: '北京证券交易所',
            time: '2026-03-28',
            url: 'http://www.bse.cn/a/20260328/345678.html',
            category: 'exchanges'
          }
        ]
      }
    };
  }
};

module.exports = mediaData;