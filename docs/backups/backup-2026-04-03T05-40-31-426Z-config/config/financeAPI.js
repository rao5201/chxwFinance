// 金融数据接口配置文件
const https = require('https');
const http = require('http');

// 金融数据API配置
const financeAPI = {
  // API基础配置
  config: {
    apiKey: process.env.FINANCE_API_KEY || 'demo-key',
    baseUrl: process.env.FINANCE_API_URL || 'https://api.finance-data.com',
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 通用请求函数
  request: function(endpoint, method, data) {
    return new Promise(function(resolve, reject) {
      const url = new URL(endpoint, financeAPI.config.baseUrl);
      const options = {
        method: method || 'GET',
        timeout: financeAPI.config.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + financeAPI.config.apiKey
        }
      };
      
      const client = url.protocol === 'https:' ? https : http;
      const req = client.request(url, options, function(res) {
        let responseData = '';
        
        res.on('data', function(chunk) {
          responseData += chunk;
        });
        
        res.on('end', function() {
          try {
            const parsedData = JSON.parse(responseData);
            if (res.statusCode === 200) {
              resolve(parsedData);
            } else {
              reject(new Error('API请求失败: ' + parsedData.message || res.statusMessage));
            }
          } catch (error) {
            reject(new Error('解析响应失败: ' + error.message));
          }
        });
      });
      
      req.on('error', function(error) {
        reject(new Error('请求错误: ' + error.message));
      });
      
      req.on('timeout', function() {
        req.destroy();
        reject(new Error('请求超时'));
      });
      
      if (data && (method === 'POST' || method === 'PUT')) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  },
  
  // 带重试的请求
  requestWithRetry: function(endpoint, method, data, retry = 0) {
    return financeAPI.request(endpoint, method, data)
      .catch(function(error) {
        if (retry < financeAPI.config.retryCount) {
          console.log('请求失败，重试 (' + (retry + 1) + '/' + financeAPI.config.retryCount + ')...');
          return new Promise(function(resolve) {
            setTimeout(function() {
              resolve(financeAPI.requestWithRetry(endpoint, method, data, retry + 1));
            }, financeAPI.config.retryDelay);
          });
        }
        throw error;
      });
  },
  
  // 获取市场行情
  getMarketOverview: function() {
    return financeAPI.requestWithRetry('/market/overview');
  },
  
  // 获取资产价格
  getAssetPrice: function(symbol) {
    return financeAPI.requestWithRetry('/assets/' + symbol + '/price');
  },
  
  // 获取K线数据
  getKlineData: function(symbol, interval, limit) {
    const params = new URLSearchParams({
      interval: interval || '1h',
      limit: limit || 100
    });
    return financeAPI.requestWithRetry('/assets/' + symbol + '/kline?' + params.toString());
  },
  
  // 获取交易对信息
  getTradingPairs: function() {
    return financeAPI.requestWithRetry('/trading-pairs');
  },
  
  // 获取市场深度
  getOrderBook: function(symbol, limit) {
    const params = new URLSearchParams({
      limit: limit || 10
    });
    return financeAPI.requestWithRetry('/assets/' + symbol + '/orderbook?' + params.toString());
  },
  
  // 获取交易历史
  getTradeHistory: function(symbol, limit) {
    const params = new URLSearchParams({
      limit: limit || 50
    });
    return financeAPI.requestWithRetry('/assets/' + symbol + '/trades?' + params.toString());
  },
  
  // 模拟数据（当API不可用时使用）
  getMockData: function(type, symbol) {
    const mockData = {
      marketOverview: {
        totalMarketCap: 2500000000000,
        totalVolume24h: 120000000000,
        btcDominance: 45.2,
        marketStatus: 'active',
        lastUpdated: new Date().toISOString()
      },
      assetPrice: {
        symbol: symbol || 'BTC',
        price: 42000 + Math.random() * 1000,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: 15000000000 + Math.random() * 5000000000,
        marketCap: 800000000000 + Math.random() * 100000000000,
        lastUpdated: new Date().toISOString()
      },
      klineData: {
        symbol: symbol || 'BTC',
        interval: '1h',
        data: Array.from({ length: 100 }, function(_, i) {
          const timestamp = Date.now() - (100 - i) * 60 * 60 * 1000;
          const open = 42000 + Math.random() * 500;
          const high = open + Math.random() * 200;
          const low = open - Math.random() * 200;
          const close = low + Math.random() * (high - low);
          const volume = 10000 + Math.random() * 5000;
          
          return [timestamp, open, high, low, close, volume];
        })
      },
      tradingPairs: [
        { symbol: 'BTC/USDT', base: 'BTC', quote: 'USDT', status: 'active' },
        { symbol: 'ETH/USDT', base: 'ETH', quote: 'USDT', status: 'active' },
        { symbol: 'BNB/USDT', base: 'BNB', quote: 'USDT', status: 'active' },
        { symbol: 'SOL/USDT', base: 'SOL', quote: 'USDT', status: 'active' },
        { symbol: 'ADA/USDT', base: 'ADA', quote: 'USDT', status: 'active' }
      ],
      orderBook: {
        symbol: symbol || 'BTC/USDT',
        bids: Array.from({ length: 10 }, function(_, i) {
          const price = 42000 - i * 10;
          const amount = 0.1 + Math.random() * 0.9;
          return [price, amount];
        }),
        asks: Array.from({ length: 10 }, function(_, i) {
          const price = 42000 + i * 10;
          const amount = 0.1 + Math.random() * 0.9;
          return [price, amount];
        }),
        lastUpdated: new Date().toISOString()
      },
      tradeHistory: {
        symbol: symbol || 'BTC/USDT',
        trades: Array.from({ length: 50 }, function(_, i) {
          const price = 42000 + (Math.random() - 0.5) * 200;
          const amount = 0.001 + Math.random() * 0.099;
          const side = Math.random() > 0.5 ? 'buy' : 'sell';
          const timestamp = Date.now() - i * 60 * 1000;
          
          return {
            id: 'trade_' + i,
            price: price,
            amount: amount,
            total: price * amount,
            side: side,
            timestamp: timestamp
          };
        })
      }
    };
    
    return Promise.resolve(mockData[type]);
  }
};

module.exports = financeAPI;
