import axios from 'axios';

const API_BASE_URL = 'http://localhost:3020/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return Promise.reject({ success: false, message: '网络连接失败' });
    } else {
      // 请求配置出错
      return Promise.reject({ success: false, message: error.message });
    }
  }
);

// 认证相关API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// 市场相关API
export const marketAPI = {
  getOverview: () => api.get('/market/overview'),
  getPrice: (symbol) => api.get(`/market/price/${symbol}`),
  getKline: (symbol, interval = '1h', limit = 100) => 
    api.get(`/market/kline/${symbol}`, { params: { interval, limit } }),
  getPairs: () => api.get('/market/pairs'),
  getOrderbook: (symbol, limit = 10) => 
    api.get(`/market/orderbook/${symbol}`, { params: { limit } }),
  getTrades: (symbol, limit = 50) => 
    api.get(`/market/trades/${symbol}`, { params: { limit } }),
};

// 支付相关API
export const paymentAPI = {
  createPayment: (paymentData) => api.post('/payment/create', paymentData),
  getPaymentStatus: (paymentId) => api.get(`/payment/status/${paymentId}`),
  cancelPayment: (paymentId) => api.post(`/payment/cancel/${paymentId}`),
  refundPayment: (paymentId) => api.post(`/payment/refund/${paymentId}`),
  getPaymentMethods: () => api.get('/payment/methods'),
};

// AI分析相关API
export const aiAPI = {
  analyze: (analysisData) => api.post('/ai/analyze', analysisData),
  getHistory: () => api.get('/ai/history'),
};

// 资产管理API
export const assetsAPI = {
  getAll: () => api.get('/assets'),
  getById: (id) => api.get(`/assets/${id}`),
};

// 交易相关API
export const transactionsAPI = {
  create: (transactionData) => api.post('/transactions', transactionData),
  getHistory: () => api.get('/transactions'),
};

// 用户相关API
export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
};

// 健康检查
export const healthAPI = {
  check: () => api.get('/health'),
};

// 金融数据API
export const financeDataAPI = {
  // 蛋卷基金
  getIndexValuation: () => api.get('/danjuan/index-valuation'),
  getFundScreening: (params) => api.get('/danjuan/fund-screening', { params }),
  getIndexFunds: (params) => api.get('/danjuan/index-funds', { params }),
  getQDIIFunds: (params) => api.get('/danjuan/qdii-funds', { params }),
  
  // 雪球网
  getHotStocks: () => api.get('/xueqiu/hot-stocks'),
  getStockDetail: (symbol) => api.get(`/xueqiu/stock-detail/${symbol}`),
  getMarketOverview: () => api.get('/xueqiu/market-overview'),
  
  // 东方财富 Choice
  getChoiceMarketOverview: () => api.get('/choice/market-overview'),
  getChoiceStockData: (symbol) => api.get(`/choice/stock-data/${symbol}`),
  getChoiceIndustryData: () => api.get('/choice/industry-data'),
  getChoiceMacroData: () => api.get('/choice/macro-data'),
  
  // 东方财富妙想金融大模型
  getAboutMiaoxiang: () => api.get('/eastmoney/ai/about'),
  getProfessionalData: () => api.get('/eastmoney/ai/professional-data'),
  getFeaturedAlgorithms: () => api.get('/eastmoney/ai/featured-algorithms'),
  getPowerfulComputing: () => api.get('/eastmoney/ai/powerful-computing'),
  
  // 东方财富妙想Claw
  getMxClawInfo: () => api.get('/eastmoney/mxclaw/info'),
  getFinancialSkills: () => api.get('/eastmoney/mxclaw/skills'),
  intelligentStockSelection: (params) => api.post('/eastmoney/mxclaw/intelligent-stock-selection', params),
  marketSearch: (params) => api.post('/eastmoney/mxclaw/market-search', params),
  macroQuery: (params) => api.post('/eastmoney/mxclaw/macro-query', params),
  financialDataQuery: (params) => api.post('/eastmoney/mxclaw/financial-data-query', params),
  miaoxiangQnA: (params) => api.post('/eastmoney/mxclaw/miaoxiang-qna', params),
  performanceReview: (params) => api.post('/eastmoney/mxclaw/performance-review', params),
  industryStockTracking: (params) => api.post('/eastmoney/mxclaw/industry-stock-tracking', params),
  initialCoverage: (params) => api.post('/eastmoney/mxclaw/initial-coverage', params),
  industryResearch: (params) => api.post('/eastmoney/mxclaw/industry-research', params),
  
  // 中金在线
  getFinancialNews: () => api.get('/cnfol/financial-news'),
  getStockData: (params) => api.get('/cnfol/stock-data', { params }),
  getFundData: (params) => api.get('/cnfol/fund-data', { params }),
  getGoldData: () => api.get('/cnfol/gold-data'),
  getForexData: () => api.get('/cnfol/forex-data'),
  getFuturesData: () => api.get('/cnfol/futures-data'),
  getWealthData: () => api.get('/cnfol/wealth-data'),
  getMacroDatabase: (category, indicator) => api.get('/cnfol/macro-database', { params: { category, indicator } }),
  
  // 贵金属和国际市场行情
  getInternationalGold: () => api.get('/precious-metals/international-gold'),
  getInternationalSilver: () => api.get('/precious-metals/international-silver'),
  getUSDOLLARIndex: () => api.get('/precious-metals/usd-index'),
  getEURIndex: () => api.get('/precious-metals/eur-index'),
  getInternationalOil: () => api.get('/precious-metals/international-oil'),
  getSGEData: () => api.get('/precious-metals/sge-data'),
  getBankPreciousMetals: () => api.get('/precious-metals/bank-precious-metals'),
  getTJPGData: () => api.get('/precious-metals/tjpg-data'),
  getSHFEData: () => api.get('/precious-metals/shfe-data'),
  
  // 华尔街见闻
  getForexMarket: () => api.get('/wallstreetcn/forex-market'),
  getMarketNews: () => api.get('/wallstreetcn/market-news'),
  getMarketAlerts: () => api.get('/wallstreetcn/market-alerts'),
  getKlineData: (symbol, interval, limit) => api.get(`/wallstreetcn/kline-data/${symbol}`, { params: { interval, limit } }),
  getCommodityMarket: () => api.get('/wallstreetcn/commodity-market'),
  getBondMarket: () => api.get('/wallstreetcn/bond-market'),
  
  // 金融界
  get7X24Telegram: () => api.get('/jrj/7x24-telegram'),
  get24HourAILive: () => api.get('/jrj/24hour-ai-live'),
  getMarketCloudChart: () => api.get('/jrj/market-cloud-chart'),
  getLimitUpThermometer: () => api.get('/jrj/limit-up-thermometer'),
  getDragonTigerList: () => api.get('/jrj/dragon-tiger-list'),
  getAShareHeadlines: () => api.get('/jrj/a-share-headlines'),
  getMarketSituation: () => api.get('/jrj/market-situation'),
  getOpportunityIntelligence: () => api.get('/jrj/opportunity-intelligence'),
  getDailyFinance: () => api.get('/jrj/daily-finance'),
};

export default api;