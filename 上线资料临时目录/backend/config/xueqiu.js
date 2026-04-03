// 雪球网API配置文件
const axios = require('axios');

// 雪球网API配置
const xueqiu = {
  // API基础配置
  config: {
    baseUrl: 'https://xueqiu.com',
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 通用请求函数
  request: async function(endpoint, params) {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      const response = await axios.get(url, {
        params,
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Cookie': 'xq_a_token=demo_token; xq_r_token=demo_refresh_token'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`请求错误: ${error.message}`);
    }
  },
  
  // 带重试的请求
  requestWithRetry: async function(endpoint, params, retry = 0) {
    try {
      return await this.request(endpoint, params);
    } catch (error) {
      if (retry < this.config.retryCount) {
        console.log(`请求失败，重试 (${retry + 1}/${this.config.retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.requestWithRetry(endpoint, params, retry + 1);
      }
      throw error;
    }
  },
  
  // 获取热门股票行情
  getHotStocks: async function() {
    try {
      // 雪球网的热门股票数据在 /hq#hot 页面
      // 由于直接访问可能需要处理动态渲染，这里使用模拟数据
      // 实际项目中需要使用爬虫或API获取真实数据
      return this.getMockHotStocks();
    } catch (error) {
      console.error('获取热门股票失败:', error);
      return this.getMockHotStocks();
    }
  },
  
  // 获取股票详情
  getStockDetail: async function(symbol) {
    try {
      // 实际项目中需要根据雪球网的API接口进行调整
      return this.getMockStockDetail(symbol);
    } catch (error) {
      console.error('获取股票详情失败:', error);
      return this.getMockStockDetail(symbol);
    }
  },
  
  // 获取市场概览
  getMarketOverview: async function() {
    try {
      // 实际项目中需要根据雪球网的API接口进行调整
      return this.getMockMarketOverview();
    } catch (error) {
      console.error('获取市场概览失败:', error);
      return this.getMockMarketOverview();
    }
  },
  
  // 模拟热门股票数据
  getMockHotStocks: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        stocks: [
          {
            symbol: 'SH600519',
            name: '贵州茅台',
            price: 1899.00,
            change: 1.25,
            changePercent: 0.07,
            volume: 1234567,
            amount: 2345678901,
            marketCap: 2380000000000
          },
          {
            symbol: 'SZ000858',
            name: '五粮液',
            price: 168.50,
            change: 2.30,
            changePercent: 1.39,
            volume: 4567890,
            amount: 768901234,
            marketCap: 680000000000
          },
          {
            symbol: 'SH601318',
            name: '中国平安',
            price: 48.25,
            change: -0.55,
            changePercent: -1.13,
            volume: 9876543,
            amount: 476543210,
            marketCap: 860000000000
          },
          {
            symbol: 'SZ000333',
            name: '美的集团',
            price: 58.75,
            change: 1.25,
            changePercent: 2.18,
            volume: 3456789,
            amount: 203456789,
            marketCap: 450000000000
          },
          {
            symbol: 'SH600276',
            name: '恒瑞医药',
            price: 32.50,
            change: 0.85,
            changePercent: 2.68,
            volume: 5678901,
            amount: 184567890,
            marketCap: 280000000000
          },
          {
            symbol: 'SZ000001',
            name: '平安银行',
            price: 15.68,
            change: -0.22,
            changePercent: -1.38,
            volume: 12345678,
            amount: 193456789,
            marketCap: 260000000000
          },
          {
            symbol: 'SH601888',
            name: '中国中免',
            price: 188.50,
            change: 3.25,
            changePercent: 1.76,
            volume: 2345678,
            amount: 442345678,
            marketCap: 380000000000
          },
          {
            symbol: 'SH600887',
            name: '伊利股份',
            price: 28.75,
            change: 0.45,
            changePercent: 1.59,
            volume: 4567890,
            amount: 131345678,
            marketCap: 220000000000
          }
        ]
      }
    };
  },
  
  // 模拟股票详情数据
  getMockStockDetail: function(symbol) {
    const stockMap = {
      'SH600519': {
        symbol: 'SH600519',
        name: '贵州茅台',
        price: 1899.00,
        change: 1.25,
        changePercent: 0.07,
        open: 1898.00,
        high: 1905.00,
        low: 1895.00,
        prevClose: 1897.75,
        volume: 1234567,
        amount: 2345678901,
        marketCap: 2380000000000,
        pe: 35.2,
        pb: 12.5,
        roe: 35.8
      },
      'SZ000858': {
        symbol: 'SZ000858',
        name: '五粮液',
        price: 168.50,
        change: 2.30,
        changePercent: 1.39,
        open: 166.20,
        high: 169.00,
        low: 166.00,
        prevClose: 166.20,
        volume: 4567890,
        amount: 768901234,
        marketCap: 680000000000,
        pe: 28.5,
        pb: 6.8,
        roe: 22.5
      }
    };
    
    return {
      success: true,
      data: stockMap[symbol] || {
        symbol: symbol,
        name: '未知股票',
        price: 0,
        change: 0,
        changePercent: 0,
        open: 0,
        high: 0,
        low: 0,
        prevClose: 0,
        volume: 0,
        amount: 0,
        marketCap: 0,
        pe: 0,
        pb: 0,
        roe: 0
      }
    };
  },
  
  // 模拟市场概览数据
  getMockMarketOverview: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        indices: [
          {
            symbol: 'SH000001',
            name: '上证指数',
            price: 3258.63,
            change: 16.85,
            changePercent: 0.52
          },
          {
            symbol: 'SZ399001',
            name: '深证成指',
            price: 10892.35,
            change: 89.45,
            changePercent: 0.83
          },
          {
            symbol: 'SZ399006',
            name: '创业板指',
            price: 2178.56,
            change: 25.67,
            changePercent: 1.19
          },
          {
            symbol: 'SH000300',
            name: '沪深300',
            price: 4125.36,
            change: 28.75,
            changePercent: 0.70
          }
        ],
        marketStatus: {
          sh: '交易中',
          sz: '交易中',
          cyb: '交易中'
        }
      }
    };
  }
};

module.exports = xueqiu;