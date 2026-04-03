// 金融界配置文件
const axios = require('axios');

// 金融界配置
const jrj = {
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
  
  // 获取7X24小时电报
  get7X24Telegram: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMock7X24Telegram();
    } catch (error) {
      console.error('获取7X24小时电报失败:', error);
      return this.getMock7X24Telegram();
    }
  },
  
  // 获取24小时AI直播
  get24HourAILive: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMock24HourAILive();
    } catch (error) {
      console.error('获取24小时AI直播失败:', error);
      return this.getMock24HourAILive();
    }
  },
  
  // 获取大盘云图
  getMarketCloudChart: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMockMarketCloudChart();
    } catch (error) {
      console.error('获取大盘云图失败:', error);
      return this.getMockMarketCloudChart();
    }
  },
  
  // 获取涨停温度计
  getLimitUpThermometer: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMockLimitUpThermometer();
    } catch (error) {
      console.error('获取涨停温度计失败:', error);
      return this.getMockLimitUpThermometer();
    }
  },
  
  // 获取龙虎榜
  getDragonTigerList: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMockDragonTigerList();
    } catch (error) {
      console.error('获取龙虎榜失败:', error);
      return this.getMockDragonTigerList();
    }
  },
  
  // 获取A股头条
  getAShareHeadlines: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMockAShareHeadlines();
    } catch (error) {
      console.error('获取A股头条失败:', error);
      return this.getMockAShareHeadlines();
    }
  },
  
  // 获取市况直击
  getMarketSituation: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMockMarketSituation();
    } catch (error) {
      console.error('获取市况直击失败:', error);
      return this.getMockMarketSituation();
    }
  },
  
  // 获取机会情报
  getOpportunityIntelligence: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMockOpportunityIntelligence();
    } catch (error) {
      console.error('获取机会情报失败:', error);
      return this.getMockOpportunityIntelligence();
    }
  },
  
  // 获取每日财经
  getDailyFinance: async function() {
    try {
      // 实际项目中需要根据金融界的API接口进行调整
      return this.getMockDailyFinance();
    } catch (error) {
      console.error('获取每日财经失败:', error);
      return this.getMockDailyFinance();
    }
  },
  
  // 模拟7X24小时电报
  getMock7X24Telegram: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        telegrams: [
          {
            id: '1',
            content: '【美股】道指上涨0.5%，纳指上涨1.2%，标普500上涨0.8%',
            publishTime: new Date().toISOString(),
            importance: 'high'
          },
          {
            id: '2',
            content: '【央行】中国人民银行开展1000亿元7天逆回购操作',
            publishTime: new Date(Date.now() - 600000).toISOString(),
            importance: 'medium'
          },
          {
            id: '3',
            content: '【发改委】发布关于促进消费的若干措施',
            publishTime: new Date(Date.now() - 1200000).toISOString(),
            importance: 'medium'
          },
          {
            id: '4',
            content: '【美股】特斯拉股价上涨3.5%，创历史新高',
            publishTime: new Date(Date.now() - 1800000).toISOString(),
            importance: 'low'
          },
          {
            id: '5',
            content: '【原油】WTI原油价格上涨1.2%，报78.90美元/桶',
            publishTime: new Date(Date.now() - 2400000).toISOString(),
            importance: 'high'
          }
        ]
      }
    };
  },
  
  // 模拟24小时AI直播
  getMock24HourAILive: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        liveStreams: [
          {
            id: '1',
            title: 'AI解读：美联储会议纪要',
            host: '金融界AI',
            startTime: new Date().toISOString(),
            duration: '30分钟',
            status: 'live',
            url: 'https://jrj.com.cn/live/123456'
          },
          {
            id: '2',
            title: 'A股收评：大盘震荡上行，科技股领涨',
            host: '金融界AI',
            startTime: new Date(Date.now() - 3600000).toISOString(),
            duration: '20分钟',
            status: 'completed',
            url: 'https://jrj.com.cn/live/123457'
          },
          {
            id: '3',
            title: '明日市场展望：关注这些板块',
            host: '金融界AI',
            startTime: new Date(Date.now() + 3600000).toISOString(),
            duration: '25分钟',
            status: 'scheduled',
            url: 'https://jrj.com.cn/live/123458'
          }
        ]
      }
    };
  },
  
  // 模拟大盘云图
  getMockMarketCloudChart: function() {
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
  
  // 模拟涨停温度计
  getMockLimitUpThermometer: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        thermometer: {
          temperature: 75,
          description: '市场热度较高',
          limitUpCount: 125,
          limitDownCount: 15,
          totalStocks: 4000,
          industryDistribution: [
            {
              industry: '科技',
              limitUpCount: 35
            },
            {
              industry: '医药',
              limitUpCount: 25
            },
            {
              industry: '新能源',
              limitUpCount: 20
            },
            {
              industry: '消费',
              limitUpCount: 15
            },
            {
              industry: '其他',
              limitUpCount: 30
            }
          ],
          historicalData: [
            { date: '2026-04-02', temperature: 65, limitUpCount: 100 },
            { date: '2026-04-01', temperature: 70, limitUpCount: 110 },
            { date: '2026-03-31', temperature: 60, limitUpCount: 90 },
            { date: '2026-03-30', temperature: 55, limitUpCount: 80 },
            { date: '2026-03-29', temperature: 65, limitUpCount: 100 }
          ]
        }
      }
    };
  },
  
  // 模拟龙虎榜
  getMockDragonTigerList: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        list: [
          {
            stockCode: '000001',
            stockName: '平安银行',
            closePrice: 18.56,
            changePercent: 10.00,
            turnover: 2567890000,
            buyAmount: 1567890000,
            sellAmount: 1000000000,
            topBuyers: [
              { name: '华泰证券深圳益田路', amount: 567890000 },
              { name: '国泰君安上海江苏路', amount: 456789000 },
              { name: '中信证券北京建国门外大街', amount: 345678900 },
              { name: '海通证券上海南京西路', amount: 123456789 },
              { name: '广发证券广州天河路', amount: 74075311 }
            ],
            topSellers: [
              { name: '中信证券上海淮海中路', amount: 345678900 },
              { name: '国泰君安深圳益田路', amount: 256789000 },
              { name: '华泰证券上海武定路', amount: 200000000 },
              { name: '海通证券深圳红岭中路', amount: 100000000 },
              { name: '广发证券上海南京西路', amount: 97532099 }
            ]
          },
          {
            stockCode: '000002',
            stockName: '万科A',
            closePrice: 12.34,
            changePercent: 9.98,
            turnover: 1890123456,
            buyAmount: 1090123456,
            sellAmount: 800000000,
            topBuyers: [
              { name: '中信证券上海淮海中路', amount: 345678900 },
              { name: '国泰君安深圳益田路', amount: 256789000 },
              { name: '华泰证券上海武定路', amount: 200000000 },
              { name: '海通证券深圳红岭中路', amount: 156789000 },
              { name: '广发证券上海南京西路', amount: 130866556 }
            ],
            topSellers: [
              { name: '华泰证券深圳益田路', amount: 256789000 },
              { name: '国泰君安上海江苏路', amount: 200000000 },
              { name: '中信证券北京建国门外大街', amount: 156789000 },
              { name: '海通证券上海南京西路', amount: 100000000 },
              { name: '广发证券广州天河路', amount: 86422000 }
            ]
          }
        ]
      }
    };
  },
  
  // 模拟A股头条
  getMockAShareHeadlines: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        headlines: [
          {
            id: '1',
            title: '央行：保持流动性合理充裕，引导市场利率下行',
            summary: '中国人民银行表示，将保持流动性合理充裕，引导市场利率下行，支持实体经济发展。',
            publishTime: new Date().toISOString(),
            url: 'https://jrj.com.cn/news/123456'
          },
          {
            id: '2',
            title: '证监会：进一步提高上市公司质量',
            summary: '证监会表示，将进一步提高上市公司质量，加强监管，保护投资者权益。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://jrj.com.cn/news/123457'
          },
          {
            id: '3',
            title: '科技股集体上涨，创业板指涨幅超1.8%',
            summary: '今日科技股集体上涨，创业板指涨幅超1.8%，芯片、AI等板块表现强势。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://jrj.com.cn/news/123458'
          },
          {
            id: '4',
            title: '新能源汽车销量持续增长，渗透率突破30%',
            summary: '今年3月新能源汽车销量持续增长，渗透率突破30%，行业发展前景广阔。',
            publishTime: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://jrj.com.cn/news/123459'
          },
          {
            id: '5',
            title: '房地产市场企稳回升，多地出台支持政策',
            summary: '房地产市场企稳回升，多地出台支持政策，市场信心逐步恢复。',
            publishTime: new Date(Date.now() - 14400000).toISOString(),
            url: 'https://jrj.com.cn/news/123460'
          }
        ]
      }
    };
  },
  
  // 模拟市况直击
  getMockMarketSituation: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        situation: {
          marketOverview: '今日A股市场震荡上行，上证指数上涨0.67%，深证成指上涨1.23%，创业板指上涨1.81%。科技股表现强势，芯片、AI等板块涨幅居前。',
          hotSectors: [
            {
              name: '芯片',
              changePercent: 3.56,
              representativeStocks: ['600745', '002049', '300661']
            },
            {
              name: 'AI',
              changePercent: 2.89,
              representativeStocks: ['002230', '300418', '603019']
            },
            {
              name: '新能源',
              changePercent: 1.56,
              representativeStocks: ['002594', '300750', '601012']
            }
          ],
          marketTrends: [
            '市场成交量放大，两市合计成交额突破8000亿元。',
            '北向资金净流入56.78亿元，连续3日净流入。',
            '融资融券余额增加12.34亿元，市场杠杆资金活跃度提升。'
          ],
          importantAnnouncements: [
            '央行开展1000亿元7天逆回购操作。',
            '证监会发布关于提高上市公司质量的意见。',
            '发改委发布促进消费的若干措施。'
          ]
        }
      }
    };
  },
  
  // 模拟机会情报
  getMockOpportunityIntelligence: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        opportunities: [
          {
            id: '1',
            title: '芯片行业：国产替代加速，景气度持续提升',
            summary: '随着国产替代进程加速，芯片行业景气度持续提升，相关公司业绩有望超预期。',
            industry: '芯片',
            potential: '高',
            publishTime: new Date().toISOString(),
            url: 'https://jrj.com.cn/opportunity/123456'
          },
          {
            id: '2',
            title: '新能源汽车：销量持续增长，产业链受益',
            summary: '新能源汽车销量持续增长，渗透率突破30%，产业链相关公司有望受益。',
            industry: '新能源汽车',
            potential: '高',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://jrj.com.cn/opportunity/123457'
          },
          {
            id: '3',
            title: '人工智能：应用场景不断拓展，商业化进程加速',
            summary: '人工智能应用场景不断拓展，商业化进程加速，相关公司价值有望重估。',
            industry: '人工智能',
            potential: '中高',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://jrj.com.cn/opportunity/123458'
          },
          {
            id: '4',
            title: '医药：创新药研发加速，政策环境改善',
            summary: '医药行业创新药研发加速，政策环境改善，行业估值有望修复。',
            industry: '医药',
            potential: '中',
            publishTime: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://jrj.com.cn/opportunity/123459'
          }
        ]
      }
    };
  },
  
  // 模拟每日财经
  getMockDailyFinance: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        dailyFinance: {
          date: new Date().toISOString().split('T')[0],
          majorEvents: [
            {
              time: '09:30',
              event: 'A股开盘',
              description: '上证指数开盘报3824.57点，上涨0.01%'
            },
            {
              time: '10:00',
              event: '央行操作',
              description: '央行开展1000亿元7天逆回购操作'
            },
            {
              time: '11:30',
              event: 'A股午盘',
              description: '上证指数午盘报3835.67点，上涨0.32%'
            },
            {
              time: '15:00',
              event: 'A股收盘',
              description: '上证指数收盘报3850.25点，上涨0.67%'
            },
            {
              time: '16:00',
              event: '证监会新闻发布会',
              description: '证监会发布关于提高上市公司质量的意见'
            }
          ],
          marketSummary: '今日A股市场震荡上行，上证指数上涨0.67%，深证成指上涨1.23%，创业板指上涨1.81%。科技股表现强势，芯片、AI等板块涨幅居前。北向资金净流入56.78亿元，连续3日净流入。',
          globalMarkets: [
            {
              name: '美股',
              status: '上涨',
              changePercent: '0.8%'
            },
            {
              name: '欧洲股市',
              status: '上涨',
              changePercent: '0.5%'
            },
            {
              name: '亚太股市',
              status: '涨跌互现',
              changePercent: '0.2%'
            }
          ],
          commodityMarkets: [
            {
              name: '原油',
              status: '上涨',
              changePercent: '1.2%'
            },
            {
              name: '黄金',
              status: '上涨',
              changePercent: '0.5%'
            },
            {
              name: '铜',
              status: '上涨',
              changePercent: '1.3%'
            }
          ]
        }
      }
    };
  }
};

module.exports = jrj;