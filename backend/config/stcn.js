// 证券时报社配置文件
const axios = require('axios');

// 证券时报社配置
const stcn = {
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
  
  // 获取沪深港资金
  getShanghaiShenzhenHongKongFunds: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockShanghaiShenzhenHongKongFunds();
    } catch (error) {
      console.error('获取沪深港资金失败:', error);
      return this.getMockShanghaiShenzhenHongKongFunds();
    }
  },
  
  // 获取融资追击
  getMarginTrading: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockMarginTrading();
    } catch (error) {
      console.error('获取融资追击失败:', error);
      return this.getMockMarginTrading();
    }
  },
  
  // 获取龙虎榜单
  getDragonTigerList: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockDragonTigerList();
    } catch (error) {
      console.error('获取龙虎榜单失败:', error);
      return this.getMockDragonTigerList();
    }
  },
  
  // 获取筹码动向
  getChipMovement: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockChipMovement();
    } catch (error) {
      console.error('获取筹码动向失败:', error);
      return this.getMockChipMovement();
    }
  },
  
  // 获取新股直击
  getNewStocks: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockNewStocks();
    } catch (error) {
      console.error('获取新股直击失败:', error);
      return this.getMockNewStocks();
    }
  },
  
  // 获取行情总貌
  getMarketOverview: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockMarketOverview();
    } catch (error) {
      console.error('获取行情总貌失败:', error);
      return this.getMockMarketOverview();
    }
  },
  
  // 获取每笔交易
  getEveryTrade: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockEveryTrade();
    } catch (error) {
      console.error('获取每笔交易失败:', error);
      return this.getMockEveryTrade();
    }
  },
  
  // 获取净值选基
  getNetValueFundSelection: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockNetValueFundSelection();
    } catch (error) {
      console.error('获取净值选基失败:', error);
      return this.getMockNetValueFundSelection();
    }
  },
  
  // 获取持股动向
  getShareholdingTrends: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockShareholdingTrends();
    } catch (error) {
      console.error('获取持股动向失败:', error);
      return this.getMockShareholdingTrends();
    }
  },
  
  // 获取限售股解禁
  getRestrictedStockLifting: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockRestrictedStockLifting();
    } catch (error) {
      console.error('获取限售股解禁失败:', error);
      return this.getMockRestrictedStockLifting();
    }
  },
  
  // 获取股权质押
  getEquityPledge: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockEquityPledge();
    } catch (error) {
      console.error('获取股权质押失败:', error);
      return this.getMockEquityPledge();
    }
  },
  
  // 获取大宗交易
  getBlockTrades: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockBlockTrades();
    } catch (error) {
      console.error('获取大宗交易失败:', error);
      return this.getMockBlockTrades();
    }
  },
  
  // 获取分红转送
  getDividendTransfer: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockDividendTransfer();
    } catch (error) {
      console.error('获取分红转送失败:', error);
      return this.getMockDividendTransfer();
    }
  },
  
  // 获取机构调研
  getInstitutionResearch: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockInstitutionResearch();
    } catch (error) {
      console.error('获取机构调研失败:', error);
      return this.getMockInstitutionResearch();
    }
  },
  
  // 获取盈利预测
  getEarningsForecast: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockEarningsForecast();
    } catch (error) {
      console.error('获取盈利预测失败:', error);
      return this.getMockEarningsForecast();
    }
  },
  
  // 获取数读财报
  getFinancialReportAnalysis: async function() {
    try {
      // 实际项目中需要根据证券时报社的API接口进行调整
      return this.getMockFinancialReportAnalysis();
    } catch (error) {
      console.error('获取数读财报失败:', error);
      return this.getMockFinancialReportAnalysis();
    }
  },
  
  // 模拟沪深港资金
  getMockShanghaiShenzhenHongKongFunds: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        funds: [
          {
            name: '沪股通',
            netBuy: 12.56,
            netBuyAmount: 1256000000,
            buy: 56.78,
            sell: 44.22,
            total: 101.00
          },
          {
            name: '深股通',
            netBuy: 8.92,
            netBuyAmount: 892000000,
            buy: 45.36,
            sell: 36.44,
            total: 81.80
          },
          {
            name: '港股通(沪)',
            netBuy: 5.67,
            netBuyAmount: 567000000,
            buy: 28.90,
            sell: 23.23,
            total: 52.13
          },
          {
            name: '港股通(深)',
            netBuy: 3.45,
            netBuyAmount: 345000000,
            buy: 18.76,
            sell: 15.31,
            total: 34.07
          }
        ]
      }
    };
  },
  
  // 模拟融资追击
  getMockMarginTrading: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        marginData: {
          totalMarginBalance: 1256789000000,
          totalMarginBalanceChange: 56789000000,
          totalShortBalance: 345678900000,
          totalShortBalanceChange: 12345678900,
          topMarginStocks: [
            {
              stockCode: '600519',
              stockName: '贵州茅台',
              marginBalance: 12567890000,
              marginBalanceChange: 567890000,
              marginRatio: 5.23
            },
            {
              stockCode: '000858',
              stockName: '五粮液',
              marginBalance: 8923456000,
              marginBalanceChange: 345678900,
              marginRatio: 4.89
            },
            {
              stockCode: '601318',
              stockName: '中国平安',
              marginBalance: 7654321000,
              marginBalanceChange: 234567890,
              marginRatio: 4.56
            }
          ],
          topShortStocks: [
            {
              stockCode: '600036',
              stockName: '招商银行',
              shortBalance: 3456789000,
              shortBalanceChange: 123456789,
              shortRatio: 2.34
            },
            {
              stockCode: '601888',
              stockName: '中国中免',
              shortBalance: 2345678900,
              shortBalanceChange: 98765432,
              shortRatio: 1.98
            },
            {
              stockCode: '600276',
              stockName: '恒瑞医药',
              shortBalance: 1234567890,
              shortBalanceChange: 45678901,
              shortRatio: 1.56
            }
          ]
        }
      }
    };
  },
  
  // 模拟龙虎榜单
  getMockDragonTigerList: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        list: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            closePrice: 1850.00,
            changePercent: 5.23,
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
            stockCode: '000858',
            stockName: '五粮液',
            closePrice: 165.00,
            changePercent: 4.89,
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
  
  // 模拟筹码动向
  getMockChipMovement: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        chipData: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            chipConcentration: 75.23,
            chipConcentrationChange: 2.56,
            mainForcePosition: 45.67,
            mainForcePositionChange: 1.23,
            retailPosition: 54.33,
            retailPositionChange: -1.23
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            chipConcentration: 68.90,
            chipConcentrationChange: 1.89,
            mainForcePosition: 42.34,
            mainForcePositionChange: 0.98,
            retailPosition: 57.66,
            retailPositionChange: -0.98
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            chipConcentration: 62.56,
            chipConcentrationChange: 1.23,
            mainForcePosition: 38.78,
            mainForcePositionChange: 0.67,
            retailPosition: 61.22,
            retailPositionChange: -0.67
          }
        ]
      }
    };
  },
  
  // 模拟新股直击
  getMockNewStocks: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        newStocks: [
          {
            stockCode: '688999',
            stockName: '新股A',
            issuePrice: 25.67,
            listingDate: '2026-04-10',
            industry: '科技',
            underwriter: '中信证券',
            subscriptionDate: '2026-04-05',
            subscriptionCode: '787999',
            issueSize: 50000000
          },
          {
            stockCode: '301999',
            stockName: '新股B',
            issuePrice: 18.90,
            listingDate: '2026-04-15',
            industry: '医药',
            underwriter: '国泰君安',
            subscriptionDate: '2026-04-10',
            subscriptionCode: '301999',
            issueSize: 30000000
          },
          {
            stockCode: '001999',
            stockName: '新股C',
            issuePrice: 12.34,
            listingDate: '2026-04-20',
            industry: '消费',
            underwriter: '华泰证券',
            subscriptionDate: '2026-04-15',
            subscriptionCode: '001999',
            issueSize: 20000000
          }
        ]
      }
    };
  },
  
  // 模拟行情总貌
  getMockMarketOverview: function() {
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
  
  // 模拟每笔交易
  getMockEveryTrade: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        trades: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            price: 1850.00,
            volume: 100,
            amount: 185000,
            time: new Date().toISOString(),
            type: 'buy'
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            price: 165.00,
            volume: 200,
            amount: 33000,
            time: new Date(Date.now() - 10000).toISOString(),
            type: 'sell'
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            price: 45.67,
            volume: 500,
            amount: 22835,
            time: new Date(Date.now() - 20000).toISOString(),
            type: 'buy'
          },
          {
            stockCode: '600036',
            stockName: '招商银行',
            price: 38.90,
            volume: 300,
            amount: 11670,
            time: new Date(Date.now() - 30000).toISOString(),
            type: 'sell'
          },
          {
            stockCode: '601888',
            stockName: '中国中免',
            price: 189.50,
            volume: 150,
            amount: 28425,
            time: new Date(Date.now() - 40000).toISOString(),
            type: 'buy'
          }
        ]
      }
    };
  },
  
  // 模拟净值选基
  getMockNetValueFundSelection: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        funds: [
          {
            fundCode: '110022',
            fundName: '易方达消费行业股票',
            netValue: 3.2567,
            dayChange: 0.0567,
            dayChangePercent: 1.77,
            weekChangePercent: 3.25,
            monthChangePercent: 5.67,
            yearChangePercent: 12.34,
            manager: '萧楠',
            establishedDate: '2010-08-20'
          },
          {
            fundCode: '000001',
            fundName: '华夏成长混合',
            netValue: 2.1567,
            dayChange: 0.0345,
            dayChangePercent: 1.62,
            weekChangePercent: 2.89,
            monthChangePercent: 4.98,
            yearChangePercent: 10.23,
            manager: '刘彦春',
            establishedDate: '2001-12-18'
          },
          {
            fundCode: '161005',
            fundName: '富国天惠成长混合A',
            netValue: 4.5678,
            dayChange: 0.0789,
            dayChangePercent: 1.75,
            weekChangePercent: 3.56,
            monthChangePercent: 6.23,
            yearChangePercent: 14.56,
            manager: '朱少醒',
            establishedDate: '2005-11-16'
          }
        ]
      }
    };
  },
  
  // 模拟持股动向
  getMockShareholdingTrends: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        shareholding: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            topShareholders: [
              {
                name: '贵州茅台酒厂(集团)有限责任公司',
                holdingRatio: 61.99,
                holdingChange: 0
              },
              {
                name: '香港中央结算有限公司',
                holdingRatio: 7.28,
                holdingChange: 0.23
              },
              {
                name: '贵州省国有资产监督管理委员会',
                holdingRatio: 4.56,
                holdingChange: 0
              }
            ],
            fundHolding: 15.67,
            fundHoldingChange: 0.89,
            retailHolding: 10.50,
            retailHoldingChange: -0.34
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            topShareholders: [
              {
                name: '四川省宜宾五粮液集团有限公司',
                holdingRatio: 50.00,
                holdingChange: 0
              },
              {
                name: '香港中央结算有限公司',
                holdingRatio: 8.90,
                holdingChange: 0.34
              },
              {
                name: '中国证券金融股份有限公司',
                holdingRatio: 2.34,
                holdingChange: 0
              }
            ],
            fundHolding: 18.78,
            fundHoldingChange: 1.23,
            retailHolding: 19.98,
            retailHoldingChange: -0.56
          }
        ]
      }
    };
  },
  
  // 模拟限售股解禁
  getMockRestrictedStockLifting: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        liftingStocks: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            liftingDate: '2026-05-15',
            liftingAmount: 10000000,
            liftingRatio: 0.80,
            liftingType: '首发原股东限售股份',
            currentPrice: 1850.00,
            marketValue: 18500000000
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            liftingDate: '2026-06-20',
            liftingAmount: 20000000,
            liftingRatio: 1.20,
            liftingType: '定向增发机构配售股份',
            currentPrice: 165.00,
            marketValue: 3300000000
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            liftingDate: '2026-07-10',
            liftingAmount: 50000000,
            liftingRatio: 0.50,
            liftingType: '股权激励限售股份',
            currentPrice: 45.67,
            marketValue: 2283500000
          }
        ]
      }
    };
  },
  
  // 模拟股权质押
  getMockEquityPledge: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        pledgeStocks: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            totalPledgedShares: 10000000,
            pledgedRatio: 0.80,
            totalPledgedTimes: 5,
            highestPledgedRatio: 0.20,
            pledgee: '中国银行',
            pledgedDate: '2026-01-15',
            pledgeAmount: 5000000,
            pledgePrice: 1750.00
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            totalPledgedShares: 20000000,
            pledgedRatio: 1.20,
            totalPledgedTimes: 8,
            highestPledgedRatio: 0.30,
            pledgee: '工商银行',
            pledgedDate: '2026-02-10',
            pledgeAmount: 10000000,
            pledgePrice: 155.00
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            totalPledgedShares: 50000000,
            pledgedRatio: 0.50,
            totalPledgedTimes: 12,
            highestPledgedRatio: 0.15,
            pledgee: '建设银行',
            pledgedDate: '2026-03-05',
            pledgeAmount: 25000000,
            pledgePrice: 40.00
          }
        ]
      }
    };
  },
  
  // 模拟大宗交易
  getMockBlockTrades: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        blockTrades: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            tradePrice: 1800.00,
            tradeVolume: 1000,
            tradeAmount: 1800000,
            tradeDate: '2026-04-02',
            tradeTime: '15:30:00',
            discountRate: 2.70,
            buyer: '华泰证券深圳益田路',
            seller: '国泰君安上海江苏路'
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            tradePrice: 160.00,
            tradeVolume: 5000,
            tradeAmount: 800000,
            tradeDate: '2026-04-02',
            tradeTime: '14:30:00',
            discountRate: 3.03,
            buyer: '中信证券北京建国门外大街',
            seller: '海通证券上海南京西路'
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            tradePrice: 45.00,
            tradeVolume: 20000,
            tradeAmount: 900000,
            tradeDate: '2026-04-01',
            tradeTime: '15:00:00',
            discountRate: 1.46,
            buyer: '广发证券广州天河路',
            seller: '华泰证券上海武定路'
          }
        ]
      }
    };
  },
  
  // 模拟分红转送
  getMockDividendTransfer: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        dividends: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            dividendPlan: '每10股派发现金红利35.25元',
            recordDate: '2026-05-10',
            exDividendDate: '2026-05-11',
            paymentDate: '2026-05-15',
            dividendYield: 1.90
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            dividendPlan: '每10股派发现金红利25.00元',
            recordDate: '2026-05-15',
            exDividendDate: '2026-05-16',
            paymentDate: '2026-05-20',
            dividendYield: 1.52
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            dividendPlan: '每10股派发现金红利15.00元',
            recordDate: '2026-05-20',
            exDividendDate: '2026-05-21',
            paymentDate: '2026-05-25',
            dividendYield: 3.28
          }
        ]
      }
    };
  },
  
  // 模拟机构调研
  getMockInstitutionResearch: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        research: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            researchDate: '2026-04-01',
            institutionCount: 56,
            researchType: '现场调研',
            mainContent: '公司2026年一季度业绩情况及未来发展规划',
            participatingInstitutions: ['高盛', '摩根士丹利', '中金公司', '中信证券', '国泰君安']
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            researchDate: '2026-03-30',
            institutionCount: 48,
            researchType: '线上调研',
            mainContent: '公司产品结构调整及市场策略',
            participatingInstitutions: ['摩根大通', '华泰证券', '海通证券', '广发证券', '招商证券']
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            researchDate: '2026-03-25',
            institutionCount: 62,
            researchType: '现场调研',
            mainContent: '公司科技转型及保险业务发展',
            participatingInstitutions: ['花旗银行', '瑞银证券', '申万宏源', '银河证券', '东方证券']
          }
        ]
      }
    };
  },
  
  // 模拟盈利预测
  getMockEarningsForecast: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        forecasts: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            currentYearEPS: 48.56,
            nextYearEPS: 55.67,
            currentYearPE: 38.10,
            nextYearPE: 33.23,
            rating: '买入',
            targetPrice: 2200.00,
            analystCount: 45
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            currentYearEPS: 6.89,
            nextYearEPS: 7.98,
            currentYearPE: 23.95,
            nextYearPE: 20.68,
            rating: '买入',
            targetPrice: 190.00,
            analystCount: 38
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            currentYearEPS: 4.89,
            nextYearEPS: 5.34,
            currentYearPE: 9.34,
            nextYearPE: 8.55,
            rating: '买入',
            targetPrice: 55.00,
            analystCount: 42
          }
        ]
      }
    };
  },
  
  // 模拟数读财报
  getMockFinancialReportAnalysis: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        reports: [
          {
            stockCode: '600519',
            stockName: '贵州茅台',
            reportPeriod: '2026年第一季度',
            revenue: 35678900000,
            revenueGrowth: 15.67,
            netProfit: 18901234567,
            netProfitGrowth: 18.90,
            grossMargin: 91.23,
            operatingMargin: 78.56,
            roe: 32.45,
            debtToAssetRatio: 15.67
          },
          {
            stockCode: '000858',
            stockName: '五粮液',
            reportPeriod: '2026年第一季度',
            revenue: 28901234567,
            revenueGrowth: 12.34,
            netProfit: 12345678901,
            netProfitGrowth: 15.67,
            grossMargin: 85.67,
            operatingMargin: 68.90,
            roe: 28.76,
            debtToAssetRatio: 20.34
          },
          {
            stockCode: '601318',
            stockName: '中国平安',
            reportPeriod: '2026年第一季度',
            revenue: 45678901234,
            revenueGrowth: 8.90,
            netProfit: 8901234567,
            netProfitGrowth: 10.23,
            grossMargin: 45.67,
            operatingMargin: 32.45,
            roe: 18.76,
            debtToAssetRatio: 85.67
          }
        ]
      }
    };
  }
};

module.exports = stcn;