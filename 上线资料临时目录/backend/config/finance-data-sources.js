/**
 * 茶海虾王@金融交易所看板平台 - 多金融数据源集成
 * 支持股票、外汇、加密货币、期货等多种数据源
 */

const axios = require('axios');
const WebSocket = require('ws');
const { logger } = require('./logger');

// 数据源配置
const dataSourceConfig = {
  // Alpha Vantage - 股票数据
  alphaVantage: {
    enabled: process.env.ALPHA_VANTAGE_ENABLED === 'true',
    apiKey: process.env.ALPHA_VANTAGE_API_KEY,
    baseUrl: 'https://www.alphavantage.co/query',
    rateLimit: 5, // 每分钟请求次数
    endpoints: {
      quote: 'GLOBAL_QUOTE',
      timeSeries: 'TIME_SERIES_INTRADAY',
      daily: 'TIME_SERIES_DAILY',
      search: 'SYMBOL_SEARCH'
    }
  },

  // Finnhub - 实时股票数据
  finnhub: {
    enabled: process.env.FINNHUB_ENABLED === 'true',
    apiKey: process.env.FINNHUB_API_KEY,
    baseUrl: 'https://finnhub.io/api/v1',
    websocketUrl: 'wss://ws.finnhub.io',
    rateLimit: 60 // 每分钟请求次数
  },

  // IEX Cloud - 美股数据
  iexCloud: {
    enabled: process.env.IEX_CLOUD_ENABLED === 'true',
    apiKey: process.env.IEX_CLOUD_API_KEY,
    baseUrl: 'https://cloud.iexapis.com/stable',
    sandboxUrl: 'https://sandbox.iexapis.com/stable',
    rateLimit: 100000 // 每月请求次数
  },

  // Polygon.io - 美股和加密货币
  polygon: {
    enabled: process.env.POLYGON_ENABLED === 'true',
    apiKey: process.env.POLYGON_API_KEY,
    baseUrl: 'https://api.polygon.io/v2',
    websocketUrl: 'wss://socket.polygon.io',
    rateLimit: 5 // 每分钟请求次数
  },

  // CoinGecko - 加密货币数据
  coinGecko: {
    enabled: process.env.COINGECKO_ENABLED === 'true',
    baseUrl: 'https://api.coingecko.com/api/v3',
    rateLimit: 50 // 每分钟请求次数
  },

  // CoinMarketCap - 加密货币数据
  coinMarketCap: {
    enabled: process.env.COINMARKETCAP_ENABLED === 'true',
    apiKey: process.env.COINMARKETCAP_API_KEY,
    baseUrl: 'https://pro-api.coinmarketcap.com/v1',
    rateLimit: 333 // 每天请求次数
  },

  // Forex数据 - ExchangeRate-API
  exchangeRate: {
    enabled: process.env.EXCHANGE_RATE_ENABLED === 'true',
    apiKey: process.env.EXCHANGE_RATE_API_KEY,
    baseUrl: 'https://v6.exchangerate-api.com/v6',
    rateLimit: 1500 // 每月请求次数
  },

  // 新浪财经 - A股数据
  sinaFinance: {
    enabled: process.env.SINA_FINANCE_ENABLED === 'true',
    baseUrl: 'https://hq.sinajs.cn',
    rateLimit: 100 // 每分钟请求次数
  },

  // 腾讯财经 - A股数据
  tencentFinance: {
    enabled: process.env.TENCENT_FINANCE_ENABLED === 'true',
    baseUrl: 'https://qt.gtimg.cn',
    rateLimit: 100 // 每分钟请求次数
  },

  // 银行数据源
  banks: {
    // 中国工商银行
    icbc: {
      enabled: process.env.ICBC_ENABLED === 'true',
      baseUrl: 'https://api.icbc.com.cn',
      apiKey: process.env.ICBC_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 中国建设银行
    ccb: {
      enabled: process.env.CCB_ENABLED === 'true',
      baseUrl: 'https://api.ccb.com',
      apiKey: process.env.CCB_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 中国农业银行
    abc: {
      enabled: process.env.ABC_ENABLED === 'true',
      baseUrl: 'https://api.abc.com.cn',
      apiKey: process.env.ABC_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 中国银行
    boc: {
      enabled: process.env.BOC_ENABLED === 'true',
      baseUrl: 'https://api.boc.cn',
      apiKey: process.env.BOC_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 交通银行
    bocomm: {
      enabled: process.env.BOCOMM_ENABLED === 'true',
      baseUrl: 'https://api.bankcomm.com',
      apiKey: process.env.BOCOMM_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 招商银行
    cmb: {
      enabled: process.env.CMB_ENABLED === 'true',
      baseUrl: 'https://api.cmbchina.com',
      apiKey: process.env.CMB_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 浦发银行
    spdb: {
      enabled: process.env.SPDB_ENABLED === 'true',
      baseUrl: 'https://api.spdb.com.cn',
      apiKey: process.env.SPDB_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 中信银行
    citic: {
      enabled: process.env.CITIC_ENABLED === 'true',
      baseUrl: 'https://api.citicbank.com',
      apiKey: process.env.CITIC_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 民生银行
    cmbc: {
      enabled: process.env.CMBC_ENABLED === 'true',
      baseUrl: 'https://api.cmbc.com.cn',
      apiKey: process.env.CMBC_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    },
    // 平安银行
    pingan: {
      enabled: process.env.PINGAN_ENABLED === 'true',
      baseUrl: 'https://api.pingan.com.cn',
      apiKey: process.env.PINGAN_API_KEY,
      rateLimit: 60 // 每分钟请求次数
    }
  },

  // 中国金融期货交易所
  cffex: {
    enabled: process.env.CFFEX_ENABLED === 'true',
    baseUrl: 'https://www.cffex.com.cn',
    rateLimit: 100 // 每分钟请求次数
  },

  // 上海期货交易所
  shfe: {
    enabled: process.env.SHFE_ENABLED === 'true',
    baseUrl: 'https://www.shfe.com.cn',
    rateLimit: 100 // 每分钟请求次数
  },

  // 大连商品交易所
  dce: {
    enabled: process.env.DCE_ENABLED === 'true',
    baseUrl: 'https://www.dce.com.cn',
    rateLimit: 100 // 每分钟请求次数
  },

  // 郑州商品交易所
  czce: {
    enabled: process.env.CZCE_ENABLED === 'true',
    baseUrl: 'https://www.czce.com.cn',
    rateLimit: 100 // 每分钟请求次数
  }
};

// 请求队列管理
class RequestQueue {
  constructor(rateLimit, interval = 60000) {
    this.queue = [];
    this.rateLimit = rateLimit;
    this.interval = interval;
    this.requests = [];
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.queue.length === 0) return;

    // 清理过期的请求记录
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.interval);

    if (this.requests.length >= this.rateLimit) {
      // 等待下一个时间窗口
      const oldestRequest = this.requests[0];
      const waitTime = this.interval - (now - oldestRequest);
      setTimeout(() => this.process(), waitTime);
      return;
    }

    const { requestFn, resolve, reject } = this.queue.shift();
    this.requests.push(Date.now());

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // 继续处理队列
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), 1000);
    }
  }
}

// 初始化请求队列
const requestQueues = {
  alphaVantage: new RequestQueue(dataSourceConfig.alphaVantage.rateLimit),
  finnhub: new RequestQueue(dataSourceConfig.finnhub.rateLimit),
  iexCloud: new RequestQueue(dataSourceConfig.iexCloud.rateLimit),
  polygon: new RequestQueue(dataSourceConfig.polygon.rateLimit),
  coinGecko: new RequestQueue(dataSourceConfig.coinGecko.rateLimit),
  coinMarketCap: new RequestQueue(dataSourceConfig.coinMarketCap.rateLimit),
  exchangeRate: new RequestQueue(dataSourceConfig.exchangeRate.rateLimit),
  sinaFinance: new RequestQueue(dataSourceConfig.sinaFinance.rateLimit),
  tencentFinance: new RequestQueue(dataSourceConfig.tencentFinance.rateLimit),
  // 银行数据源请求队列
  icbc: new RequestQueue(dataSourceConfig.banks.icbc.rateLimit),
  ccb: new RequestQueue(dataSourceConfig.banks.ccb.rateLimit),
  abc: new RequestQueue(dataSourceConfig.banks.abc.rateLimit),
  boc: new RequestQueue(dataSourceConfig.banks.boc.rateLimit),
  bocomm: new RequestQueue(dataSourceConfig.banks.bocomm.rateLimit),
  cmb: new RequestQueue(dataSourceConfig.banks.cmb.rateLimit),
  spdb: new RequestQueue(dataSourceConfig.banks.spdb.rateLimit),
  citic: new RequestQueue(dataSourceConfig.banks.citic.rateLimit),
  cmbc: new RequestQueue(dataSourceConfig.banks.cmbc.rateLimit),
  pingan: new RequestQueue(dataSourceConfig.banks.pingan.rateLimit),
  // 期货交易所请求队列
  cffex: new RequestQueue(dataSourceConfig.cffex.rateLimit),
  shfe: new RequestQueue(dataSourceConfig.shfe.rateLimit),
  dce: new RequestQueue(dataSourceConfig.dce.rateLimit),
  czce: new RequestQueue(dataSourceConfig.czce.rateLimit)
};

// Alpha Vantage API
const alphaVantageAPI = {
  async getQuote(symbol) {
    if (!dataSourceConfig.alphaVantage.enabled) {
      throw new Error('Alpha Vantage API未启用');
    }

    return requestQueues.alphaVantage.add(async () => {
      const response = await axios.get(dataSourceConfig.alphaVantage.baseUrl, {
        params: {
          function: dataSourceConfig.alphaVantage.endpoints.quote,
          symbol,
          apikey: dataSourceConfig.alphaVantage.apiKey
        }
      });

      const data = response.data['Global Quote'];
      return {
        symbol: data['01. symbol'],
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: data['10. change percent'],
        volume: parseInt(data['06. volume']),
        timestamp: new Date().toISOString()
      };
    });
  },

  async getTimeSeries(symbol, interval = '5min') {
    if (!dataSourceConfig.alphaVantage.enabled) {
      throw new Error('Alpha Vantage API未启用');
    }

    return requestQueues.alphaVantage.add(async () => {
      const response = await axios.get(dataSourceConfig.alphaVantage.baseUrl, {
        params: {
          function: dataSourceConfig.alphaVantage.endpoints.timeSeries,
          symbol,
          interval,
          apikey: dataSourceConfig.alphaVantage.apiKey
        }
      });

      const timeSeriesKey = `Time Series (${interval})`;
      const data = response.data[timeSeriesKey];

      return Object.entries(data).map(([timestamp, values]) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }));
    });
  },

  async searchSymbols(keywords) {
    if (!dataSourceConfig.alphaVantage.enabled) {
      throw new Error('Alpha Vantage API未启用');
    }

    return requestQueues.alphaVantage.add(async () => {
      const response = await axios.get(dataSourceConfig.alphaVantage.baseUrl, {
        params: {
          function: dataSourceConfig.alphaVantage.endpoints.search,
          keywords,
          apikey: dataSourceConfig.alphaVantage.apiKey
        }
      });

      return response.data.bestMatches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region']
      }));
    });
  }
};

// 银行API
try {
  const bankAPI = {
    // 中国工商银行
    async getICBCData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.icbc.enabled) {
        throw new Error('工商银行API未启用');
      }

      return requestQueues.icbc.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.icbc.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.icbc.apiKey
          }
        });
        return response.data;
      });
    },

    // 中国建设银行
    async getCCBData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.ccb.enabled) {
        throw new Error('建设银行API未启用');
      }

      return requestQueues.ccb.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.ccb.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.ccb.apiKey
          }
        });
        return response.data;
      });
    },

    // 中国农业银行
    async getABCData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.abc.enabled) {
        throw new Error('农业银行API未启用');
      }

      return requestQueues.abc.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.abc.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.abc.apiKey
          }
        });
        return response.data;
      });
    },

    // 中国银行
    async getBOCData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.boc.enabled) {
        throw new Error('中国银行API未启用');
      }

      return requestQueues.boc.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.boc.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.boc.apiKey
          }
        });
        return response.data;
      });
    },

    // 交通银行
    async getBOCOMMData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.bocomm.enabled) {
        throw new Error('交通银行API未启用');
      }

      return requestQueues.bocomm.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.bocomm.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.bocomm.apiKey
          }
        });
        return response.data;
      });
    },

    // 招商银行
    async getCMBData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.cmb.enabled) {
        throw new Error('招商银行API未启用');
      }

      return requestQueues.cmb.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.cmb.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.cmb.apiKey
          }
        });
        return response.data;
      });
    },

    // 浦发银行
    async getSPDBData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.spdb.enabled) {
        throw new Error('浦发银行API未启用');
      }

      return requestQueues.spdb.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.spdb.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.spdb.apiKey
          }
        });
        return response.data;
      });
    },

    // 中信银行
    async getCITICData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.citic.enabled) {
        throw new Error('中信银行API未启用');
      }

      return requestQueues.citic.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.citic.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.citic.apiKey
          }
        });
        return response.data;
      });
    },

    // 民生银行
    async getCMBCData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.cmbc.enabled) {
        throw new Error('民生银行API未启用');
      }

      return requestQueues.cmbc.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.cmbc.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.cmbc.apiKey
          }
        });
        return response.data;
      });
    },

    // 平安银行
    async getPingAnData(endpoint, params = {}) {
      if (!dataSourceConfig.banks.pingan.enabled) {
        throw new Error('平安银行API未启用');
      }

      return requestQueues.pingan.add(async () => {
        const response = await axios.get(`${dataSourceConfig.banks.pingan.baseUrl}${endpoint}`, {
          params: {
            ...params,
            apiKey: dataSourceConfig.banks.pingan.apiKey
          }
        });
        return response.data;
      });
    },

    // 获取所有银行数据
    async getAllBankData() {
      const banks = ['icbc', 'ccb', 'abc', 'boc', 'bocomm', 'cmb', 'spdb', 'citic', 'cmbc', 'pingan'];
      const results = {};

      for (const bank of banks) {
        try {
          if (dataSourceConfig.banks[bank].enabled) {
            // 根据不同银行的API接口获取数据
            switch (bank) {
              case 'icbc':
                results[bank] = await this.getICBCData('/api/market');
                break;
              case 'ccb':
                results[bank] = await this.getCCBData('/api/market');
                break;
              case 'abc':
                results[bank] = await this.getABCData('/api/market');
                break;
              case 'boc':
                results[bank] = await this.getBOCData('/api/market');
                break;
              case 'bocomm':
                results[bank] = await this.getBOCOMMData('/api/market');
                break;
              case 'cmb':
                results[bank] = await this.getCMBData('/api/market');
                break;
              case 'spdb':
                results[bank] = await this.getSPDBData('/api/market');
                break;
              case 'citic':
                results[bank] = await this.getCITICData('/api/market');
                break;
              case 'cmbc':
                results[bank] = await this.getCMBCData('/api/market');
                break;
              case 'pingan':
                results[bank] = await this.getPingAnData('/api/market');
                break;
            }
          }
        } catch (error) {
          logger.error(`获取${bank}数据失败: ${error.message}`);
          results[bank] = { error: error.message };
        }
      }

      return results;
    }
  };

  // 期货交易所API
  const futuresAPI = {
    // 中国金融期货交易所
    async getCFFEXData(endpoint, params = {}) {
      if (!dataSourceConfig.cffex.enabled) {
        throw new Error('中国金融期货交易所API未启用');
      }

      return requestQueues.cffex.add(async () => {
        const response = await axios.get(`${dataSourceConfig.cffex.baseUrl}${endpoint}`, {
          params
        });
        return response.data;
      });
    },

    // 上海期货交易所
    async getSHFEData(endpoint, params = {}) {
      if (!dataSourceConfig.shfe.enabled) {
        throw new Error('上海期货交易所API未启用');
      }

      return requestQueues.shfe.add(async () => {
        const response = await axios.get(`${dataSourceConfig.shfe.baseUrl}${endpoint}`, {
          params
        });
        return response.data;
      });
    },

    // 大连商品交易所
    async getDCEData(endpoint, params = {}) {
      if (!dataSourceConfig.dce.enabled) {
        throw new Error('大连商品交易所API未启用');
      }

      return requestQueues.dce.add(async () => {
        const response = await axios.get(`${dataSourceConfig.dce.baseUrl}${endpoint}`, {
          params
        });
        return response.data;
      });
    },

    // 郑州商品交易所
    async getCZCEData(endpoint, params = {}) {
      if (!dataSourceConfig.czce.enabled) {
        throw new Error('郑州商品交易所API未启用');
      }

      return requestQueues.czce.add(async () => {
        const response = await axios.get(`${dataSourceConfig.czce.baseUrl}${endpoint}`, {
          params
        });
        return response.data;
      });
    },

    // 获取中国黄金期货数据
    async getGoldFuturesData() {
      try {
        // 从上海期货交易所获取黄金期货数据
        const shfeData = await this.getSHFEData('/marketdata/dailyinfo', {
          product: 'AU'
        });

        // 从中国金融期货交易所获取相关数据
        const cffexData = await this.getCFFEXData('/marketdata/dailyinfo', {
          product: 'GC'
        });

        return {
          shfe: shfeData,
          cffex: cffexData
        };
      } catch (error) {
        logger.error('获取黄金期货数据失败:', error);
        throw error;
      }
    },

    // 获取中国期货市场整体数据
    async getFuturesMarketData() {
      const exchanges = ['cffex', 'shfe', 'dce', 'czce'];
      const results = {};

      for (const exchange of exchanges) {
        try {
          if (dataSourceConfig[exchange].enabled) {
            switch (exchange) {
              case 'cffex':
                results[exchange] = await this.getCFFEXData('/marketdata/dailyinfo');
                break;
              case 'shfe':
                results[exchange] = await this.getSHFEData('/marketdata/dailyinfo');
                break;
              case 'dce':
                results[exchange] = await this.getDCEData('/marketdata/dailyinfo');
                break;
              case 'czce':
                results[exchange] = await this.getCZCEData('/marketdata/dailyinfo');
                break;
            }
          }
        } catch (error) {
          logger.error(`获取${exchange}数据失败: ${error.message}`);
          results[exchange] = { error: error.message };
        }
      }

      return results;
    }
  };

  // 导出API
  module.exports = {
    dataSourceConfig,
    requestQueues,
    alphaVantageAPI,
    bankAPI,
    futuresAPI,
    // 其他API...
  };
} catch (error) {
  logger.error('金融数据源配置错误:', error);
  module.exports = {
    dataSourceConfig,
    requestQueues: {},
    alphaVantageAPI: {},
    bankAPI: {},
    futuresAPI: {}
  };
}