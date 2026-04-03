const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// 性能优化模块
const { 
  compression, 
  cacheManager, 
  performanceMonitor 
} = require('./config/performance');

// 安全加固模块
const { 
  securityHeaders, 
  securityLogging, 
  antiAttack 
} = require('./config/security');

// 模拟日志系统
const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
  debug: console.log,
  fatal: console.error
};
const loggerMiddleware = (req, res, next) => next();

// 数据库配置（整合内存数据库、MongoDB、Redis和MySQL）
const { 
  initDatabase, checkDatabaseStatus, dbOperations, 
  connectMongoDB, checkMongoDBStatus, 
  connectMySQL, checkMySQLStatus, mysqlOperations, 
  initRedis, checkRedisStatus, redisOperations, 
  qrCodeIntegration 
} = require('./config/database');

// 金融数据API配置
const financeAPI = require('./config/financeAPI');

// 支付系统配置
const paymentSystem = require('./config/payment');

// 监控配置
const { metricsMiddleware, startMonitoring } = require('./config/monitoring');

// AI工具集成配置
const aiToolsManager = require('./config/ai-tools-integration');

// 加载模型
const User = require('./models/User');
const Asset = require('./models/Asset');
const Transaction = require('./models/Transaction');
const UserAsset = require('./models/UserAsset');
const AIAnalysis = require('./models/AIAnalysis');

// 全局数据库操作
global.db = dbOperations;
global.cache = redisOperations;

const app = express();

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 性能优化中间件
app.use(compression); // 资源压缩

// 性能监控中间件
app.use((req, res, next) => {
  const path = req.path;
  performanceMonitor.start(path);
  
  res.on('finish', () => {
    const duration = performanceMonitor.end(path);
    console.log(`📊 ${req.method} ${path} - ${duration}ms`);
  });
  
  next();
});

// 缓存中间件
app.use(async (req, res, next) => {
  // 只缓存GET请求
  if (req.method === 'GET') {
    const cacheKey = `api:${req.path}:${JSON.stringify(req.query)}`;
    const cachedData = await cacheManager.get(cacheKey);
    
    if (cachedData) {
      console.log(`✅ 从缓存获取数据: ${req.path}`);
      return res.json(cachedData);
    }
    
    // 保存原始的res.json方法
    const originalJson = res.json;
    res.json = async function(data) {
      // 缓存响应数据
      await cacheManager.set(cacheKey, data, 300); // 5分钟缓存
      return originalJson.call(this, data);
    };
  }
  
  next();
});

// 安全中间件
app.use(securityHeaders); // 安全头部
app.use(securityLogging); // 安全日志
app.use(antiAttack); // 防攻击

// 限流配置
const limiter = require('express-rate-limit')({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
app.use(loggerMiddleware);

// 监控中间件
app.use(metricsMiddleware);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      memory: 'connected',
      mongodb: checkMongoDBStatus().connected ? 'connected' : 'disconnected',
      mysql: checkMySQLStatus().connected ? 'connected' : 'disconnected'
    }
  });
});

// 数据库状态检查
app.get('/api/database/status', (req, res) => {
  res.json({
    success: true,
    data: {
      memory: {
        status: 'connected',
        collections: checkDatabaseStatus().collections
      },
      mongodb: checkMongoDBStatus(),
      redis: checkRedisStatus()
    }
  });
});

// 监控指标端点
app.get('/metrics', (req, res) => {
  const metrics = [
    '# HELP http_requests_total Total number of HTTP requests',
    '# TYPE http_requests_total counter',
    'http_requests_total{method="GET", handler="health"} 1',
    'http_requests_total{method="POST", handler="register"} 1',
    'http_requests_total{method="POST", handler="login"} 1',
    'http_requests_total{method="POST", handler="createPayment"} 1',
    'http_requests_total{method="GET", handler="getPayments"} 1',
    'http_requests_total{method="GET", handler="analyze"} 1',
    '',
    '# HELP http_request_duration_seconds HTTP request duration in seconds',
    '# TYPE http_request_duration_seconds histogram',
    'http_request_duration_seconds_bucket{handler="health", le="0.1"} 1',
    'http_request_duration_seconds_bucket{handler="health", le="0.5"} 1',
    'http_request_duration_seconds_bucket{handler="health", le="1"} 1',
    'http_request_duration_seconds_bucket{handler="health", le="5"} 1',
    'http_request_duration_seconds_bucket{handler="health", le="+Inf"} 1',
    'http_request_duration_seconds_sum{handler="health"} 0.01',
    'http_request_duration_seconds_count{handler="health"} 1',
    '',
    '# HELP node_memory_MemTotal_bytes Total memory in bytes',
    '# TYPE node_memory_MemTotal_bytes gauge',
    `node_memory_MemTotal_bytes ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}`,
    '',
    '# HELP node_memory_MemAvailable_bytes Available memory in bytes',
    '# TYPE node_memory_MemAvailable_bytes gauge',
    `node_memory_MemAvailable_bytes ${Math.round((process.memoryUsage().heapTotal - process.memoryUsage().heapUsed) / 1024 / 1024)}`,
    '',
    '# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds',
    '# TYPE process_cpu_seconds_total counter',
    `process_cpu_seconds_total ${process.cpuUsage().user / 1000000 + process.cpuUsage().system / 1000000}`,
    '',
    '# HELP process_up_time_seconds Process uptime in seconds',
    '# TYPE process_up_time_seconds gauge',
    `process_up_time_seconds ${process.uptime()}`
  ];
  
  res.set('Content-Type', 'text/plain');
  res.send(metrics.join('\n'));
});

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/market', require('./routes/market'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/auto-collection', require('./routes/auto-collection'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/finance-data', require('./routes/finance-data'));
app.use('/api/financial-services', require('./routes/financial-services'));
app.use('/api/upload', require('./routes/upload'));

// 二维码相关API端点
app.post('/api/qrcode/generate', async (req, res) => {
  try {
    const { data, type } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, message: '数据不能为空' });
    }
    
    const result = await qrCodeIntegration.generateQRCode(data, type);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/qrcode/:qrId', async (req, res) => {
  try {
    const { qrId } = req.params;
    const qrCode = await qrCodeIntegration.getQRCode(qrId);
    if (!qrCode) {
      return res.status(404).json({ success: false, message: '二维码不存在' });
    }
    res.json({ success: true, data: qrCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/qrcode/:qrId/status', async (req, res) => {
  try {
    const { qrId } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: '状态不能为空' });
    }
    
    const result = await qrCodeIntegration.updateQRCodeStatus(qrId, status);
    res.json({ success: true, message: '二维码状态更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/qrcode', async (req, res) => {
  try {
    const filters = req.query;
    const qrCodes = await qrCodeIntegration.getQRCodeList(filters);
    res.json({ success: true, data: qrCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 腾讯文档相关API端点
const { tencentDocsClient } = require('./config/tencent-docs');

app.get('/api/tencent-docs', async (req, res) => {
  try {
    const params = req.query;
    const documents = await tencentDocsClient.getDocumentList(params);
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/tencent-docs/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await tencentDocsClient.getDocumentDetail(documentId);
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/tencent-docs', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: '标题不能为空' });
    }
    const document = await tencentDocsClient.createDocument(title, content);
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/tencent-docs/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: '内容不能为空' });
    }
    const document = await tencentDocsClient.updateDocument(documentId, content);
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/tencent-docs/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const result = await tencentDocsClient.deleteDocument(documentId);
    res.json({ success: true, message: '文档删除成功', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 有道云笔记相关API端点
const { youdaoNoteClient } = require('./config/youdao-note');

app.post('/api/youdao-note', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: '标题不能为空' });
    }
    const note = await youdaoNoteClient.createNote(title, content);
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/youdao-note/directory', async (req, res) => {
  try {
    const { parentId, lastId } = req.query;
    const directory = await youdaoNoteClient.getDirectoryList(parentId || '0', lastId || '');
    res.json({ success: true, data: directory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/youdao-note/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const note = await youdaoNoteClient.getNoteContent(fileId);
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/youdao-note/search', async (req, res) => {
  try {
    const { keyword, startIndex } = req.query;
    if (!keyword) {
      return res.status(400).json({ success: false, message: '关键词不能为空' });
    }
    const notes = await youdaoNoteClient.searchNotes(keyword, startIndex || 0);
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/youdao-note/web-clip', async (req, res) => {
  try {
    const { url, parentId } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL不能为空' });
    }
    const result = await youdaoNoteClient.webClip(url, parentId || '');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/youdao-note/favorites', async (req, res) => {
  try {
    const { limit } = req.query;
    const favorites = await youdaoNoteClient.getRecentFavorites(limit || 50);
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 金融分析工具API端点
const {
  TechnicalAnalysis,
  FundamentalAnalysis,
  RiskManagement,
  PortfolioAnalysis,
  MarketSentimentAnalysis
} = require('./config/financial-analysis');

// 技术指标分析API
app.post('/api/analysis/technical/ma', async (req, res) => {
  try {
    const { data, period } = req.body;
    if (!data || !period) {
      return res.status(400).json({ success: false, message: '数据和周期参数不能为空' });
    }
    const result = TechnicalAnalysis.calculateMA(data, period);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/technical/ema', async (req, res) => {
  try {
    const { data, period } = req.body;
    if (!data || !period) {
      return res.status(400).json({ success: false, message: '数据和周期参数不能为空' });
    }
    const result = TechnicalAnalysis.calculateEMA(data, period);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/technical/macd', async (req, res) => {
  try {
    const { data, fastPeriod, slowPeriod, signalPeriod } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, message: '数据参数不能为空' });
    }
    const result = TechnicalAnalysis.calculateMACD(data, fastPeriod, slowPeriod, signalPeriod);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/technical/rsi', async (req, res) => {
  try {
    const { data, period } = req.body;
    if (!data || !period) {
      return res.status(400).json({ success: false, message: '数据和周期参数不能为空' });
    }
    const result = TechnicalAnalysis.calculateRSI(data, period);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/technical/kdj', async (req, res) => {
  try {
    const { data, period, kPeriod, dPeriod } = req.body;
    if (!data || !period) {
      return res.status(400).json({ success: false, message: '数据和周期参数不能为空' });
    }
    const result = TechnicalAnalysis.calculateKDJ(data, period, kPeriod, dPeriod);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/technical/bollinger', async (req, res) => {
  try {
    const { data, period, stdDev } = req.body;
    if (!data || !period) {
      return res.status(400).json({ success: false, message: '数据和周期参数不能为空' });
    }
    const result = TechnicalAnalysis.calculateBollingerBands(data, period, stdDev);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 基本面分析API
app.post('/api/analysis/fundamental/pe', async (req, res) => {
  try {
    const { price, earningsPerShare } = req.body;
    if (price === undefined || earningsPerShare === undefined) {
      return res.status(400).json({ success: false, message: '价格和每股收益参数不能为空' });
    }
    const result = FundamentalAnalysis.calculatePE(price, earningsPerShare);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/fundamental/pb', async (req, res) => {
  try {
    const { price, bookValuePerShare } = req.body;
    if (price === undefined || bookValuePerShare === undefined) {
      return res.status(400).json({ success: false, message: '价格和每股净资产参数不能为空' });
    }
    const result = FundamentalAnalysis.calculatePB(price, bookValuePerShare);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/fundamental/roe', async (req, res) => {
  try {
    const { netIncome, shareholdersEquity } = req.body;
    if (netIncome === undefined || shareholdersEquity === undefined) {
      return res.status(400).json({ success: false, message: '净利润和股东权益参数不能为空' });
    }
    const result = FundamentalAnalysis.calculateROE(netIncome, shareholdersEquity);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 风险管理API
app.post('/api/analysis/risk/volatility', async (req, res) => {
  try {
    const { returns, period } = req.body;
    if (!returns) {
      return res.status(400).json({ success: false, message: '收益数据不能为空' });
    }
    const result = RiskManagement.calculateVolatility(returns, period);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/risk/max-drawdown', async (req, res) => {
  try {
    const { prices } = req.body;
    if (!prices) {
      return res.status(400).json({ success: false, message: '价格数据不能为空' });
    }
    const result = RiskManagement.calculateMaxDrawdown(prices);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/risk/sharpe-ratio', async (req, res) => {
  try {
    const { returns, riskFreeRate, period } = req.body;
    if (!returns) {
      return res.status(400).json({ success: false, message: '收益数据不能为空' });
    }
    const result = RiskManagement.calculateSharpeRatio(returns, riskFreeRate, period);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 投资组合分析API
app.post('/api/analysis/portfolio/return', async (req, res) => {
  try {
    const { weights, returns } = req.body;
    if (!weights || !returns) {
      return res.status(400).json({ success: false, message: '权重和收益数据不能为空' });
    }
    const result = PortfolioAnalysis.calculatePortfolioReturn(weights, returns);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/portfolio/risk', async (req, res) => {
  try {
    const { weights, covMatrix } = req.body;
    if (!weights || !covMatrix) {
      return res.status(400).json({ success: false, message: '权重和协方差矩阵不能为空' });
    }
    const result = PortfolioAnalysis.calculatePortfolioRisk(weights, covMatrix);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/portfolio/optimal', async (req, res) => {
  try {
    const { returns, covMatrix } = req.body;
    if (!returns || !covMatrix) {
      return res.status(400).json({ success: false, message: '收益和协方差矩阵数据不能为空' });
    }
    const result = PortfolioAnalysis.calculateOptimalPortfolio(returns, covMatrix);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 市场情绪分析API
app.post('/api/analysis/sentiment/fear-greed', async (req, res) => {
  try {
    const { marketData } = req.body;
    if (!marketData) {
      return res.status(400).json({ success: false, message: '市场数据不能为空' });
    }
    const result = MarketSentimentAnalysis.calculateFearAndGreedIndex(marketData);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/analysis/sentiment/trend', async (req, res) => {
  try {
    const { priceData, period } = req.body;
    if (!priceData) {
      return res.status(400).json({ success: false, message: '价格数据不能为空' });
    }
    const result = MarketSentimentAnalysis.analyzeMarketTrend(priceData, period);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI分析API端点
const { AIAnalysis: AIAnalysisService } = require('./config/ai-analysis');

// 市场趋势分析
app.post('/api/ai/analysis/market-trend', async (req, res) => {
  try {
    const { marketData, model } = req.body;
    if (!marketData) {
      return res.status(400).json({ success: false, message: '市场数据不能为空' });
    }
    const result = await AIAnalysisService.analyzeMarketTrend(marketData, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 投资风险评估
app.post('/api/ai/analysis/risk-assessment', async (req, res) => {
  try {
    const { investmentData, model } = req.body;
    if (!investmentData) {
      return res.status(400).json({ success: false, message: '投资数据不能为空' });
    }
    const result = await AIAnalysisService.assessInvestmentRisk(investmentData, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 投资组合优化
app.post('/api/ai/analysis/portfolio-optimization', async (req, res) => {
  try {
    const { portfolioData, model } = req.body;
    if (!portfolioData) {
      return res.status(400).json({ success: false, message: '投资组合数据不能为空' });
    }
    const result = await AIAnalysisService.optimizePortfolio(portfolioData, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 市场走势预测
app.post('/api/ai/analysis/market-prediction', async (req, res) => {
  try {
    const { historicalData, model } = req.body;
    if (!historicalData) {
      return res.status(400).json({ success: false, message: '历史数据不能为空' });
    }
    const result = await AIAnalysisService.predictMarketTrend(historicalData, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 财务报表分析
app.post('/api/ai/analysis/financial-analysis', async (req, res) => {
  try {
    const { financialData, model } = req.body;
    if (!financialData) {
      return res.status(400).json({ success: false, message: '财务数据不能为空' });
    }
    const result = await AIAnalysisService.analyzeFinancialStatement(financialData, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 新闻情绪分析
app.post('/api/ai/analysis/news-sentiment', async (req, res) => {
  try {
    const { newsData, model } = req.body;
    if (!newsData) {
      return res.status(400).json({ success: false, message: '新闻数据不能为空' });
    }
    const result = await AIAnalysisService.analyzeNewsSentiment(newsData, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 前端所需的API路由

// 二维码相关API
app.post('/api/qr-code/generate', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, message: '数据不能为空' });
    }
    // 生成二维码的逻辑
    const qrCodeData = {
      id: Date.now().toString(),
      data: data,
      url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`,
      createdAt: new Date()
    };
    res.json({ success: true, data: qrCodeData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/qr-code/history', async (req, res) => {
  try {
    // 模拟二维码历史数据
    const history = [
      {
        id: '1',
        data: 'https://example.com',
        url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fexample.com',
        createdAt: new Date()
      }
    ];
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/qr-code/scan', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, message: '数据不能为空' });
    }
    res.json({ success: true, data: { scannedData: data, timestamp: new Date() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 金融数据相关API
app.get('/api/finance/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // 模拟股票数据
    const stockData = {
      symbol: symbol,
      name: `股票 ${symbol}`,
      price: Math.random() * 1000,
      change: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: Math.random() * 10000000000
    };
    res.json({ success: true, data: stockData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/finance/fund/:code', async (req, res) => {
  try {
    const { code } = req.params;
    // 模拟基金数据
    const fundData = {
      code: code,
      name: `基金 ${code}`,
      nav: Math.random() * 5,
      change: (Math.random() - 0.5) * 2,
      oneYearReturn: (Math.random() - 0.5) * 50,
      threeYearReturn: (Math.random() - 0.5) * 100
    };
    res.json({ success: true, data: fundData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/finance/market', async (req, res) => {
  try {
    // 模拟市场数据
    const marketData = {
      stocks: [
        { symbol: 'AAPL', name: '苹果', price: 150.25, change: 1.25 },
        { symbol: 'MSFT', name: '微软', price: 300.75, change: -0.5 },
        { symbol: 'GOOGL', name: '谷歌', price: 2800.5, change: 2.75 },
        { symbol: 'AMZN', name: '亚马逊', price: 3200.25, change: -1.5 }
      ],
      indices: [
        { name: '上证指数', value: 3200.5, change: 0.5 },
        { name: '深证成指', value: 12500.75, change: -0.25 },
        { name: '创业板指', value: 2500.25, change: 1.0 }
      ]
    };
    res.json({ success: true, data: marketData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/finance/news', async (req, res) => {
  try {
    // 模拟财经新闻
    const news = [
      {
        id: '1',
        title: '央行降准0.5个百分点，释放长期资金约1万亿元',
        content: '央行今日宣布降准0.5个百分点，预计将释放长期资金约1万亿元，以支持实体经济发展。',
        time: '2024-01-15 10:00:00',
        source: '财经网'
      },
      {
        id: '2',
        title: '科技股集体上涨，纳斯达克指数创历史新高',
        content: '受科技股集体上涨影响，纳斯达克指数今日创下历史新高，涨幅超过2%。',
        time: '2024-01-15 09:30:00',
        source: '华尔街日报'
      },
      {
        id: '3',
        title: '新能源汽车销量持续增长，12月同比增长30%',
        content: '根据最新数据，新能源汽车12月销量同比增长30%，连续12个月保持两位数增长。',
        time: '2024-01-15 08:45:00',
        source: '汽车之家'
      }
    ];
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 用户相关API
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '邮箱和密码不能为空' });
    }
    // 模拟登录
    const user = {
      id: '1',
      username: 'testuser',
      email: email,
      balance: 10000
    };
    res.json({ success: true, data: user, token: 'mock-token-123' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/user/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: '邮箱或手机号至少填写一项' });
    }
    // 模拟注册
    const user = {
      id: Date.now().toString(),
      username: username,
      email: email,
      phone: phone,
      balance: 10000
    };
    res.json({ success: true, data: user, token: 'mock-token-456' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 登录API - 支持邮箱、手机号登录
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
      return res.status(400).json({ success: false, message: '邮箱/手机号和密码不能为空' });
    }
    // 模拟登录
    const user = {
      id: '1',
      username: 'testuser',
      email: email,
      phone: phone,
      balance: 10000
    };
    res.json({ success: true, data: user, token: 'mock-token-123' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 第三方平台登录/注册API
app.post('/api/user/oauth/login', async (req, res) => {
  try {
    const { platform, code, userInfo } = req.body;
    if (!platform || !code) {
      return res.status(400).json({ success: false, message: '平台和授权码不能为空' });
    }
    
    // 模拟第三方平台登录/注册
    const platforms = ['wechat', 'alipay', 'douyin', 'xiaohongshu', 'kuaishou', 'jd'];
    if (!platforms.includes(platform)) {
      return res.status(400).json({ success: false, message: '不支持的平台' });
    }
    
    // 模拟用户数据
    const user = {
      id: Date.now().toString(),
      username: `${platform}_user_${Math.floor(Math.random() * 10000)}`,
      email: `${platform}_user_${Math.floor(Math.random() * 10000)}@example.com`,
      balance: 10000,
      platform: platform,
      platformId: `platform_${platform}_${Math.floor(Math.random() * 1000000)}`
    };
    
    res.json({ success: true, data: user, token: `mock-token-${platform}-${Date.now()}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/user/profile', async (req, res) => {
  try {
    // 模拟用户资料
    const user = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      balance: 10000,
      createdAt: '2024-01-01'
    };
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API端点不存在',
    path: req.path
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('Error:', { error: err.message, stack: err.stack, path: req.path, method: req.method });
  
  // 处理MongoDB重复键错误
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: '数据已存在',
      error: err.message
    });
  }
  
  // 处理MongoDB验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: messages
    });
  }
  
  // 处理JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '无效的令牌'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: '令牌已过期'
    });
  }
  
  const response = {
    success: false,
    message: err.message || '服务器内部错误'
  };
  
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }
  
  res.status(err.status || 500).json(response);
});

// 数据库连接功能已移至 config/database.js

// 启动服务器
const PORT = process.env.PORT || 3021;

const startServer = async function() {
  // 初始化数据库
  initDatabase();
  
  // 初始化Redis
  initRedis();
  
  // 尝试连接MongoDB
  try {
    await connectMongoDB();
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message);
  }
  
  // 尝试连接MySQL
  try {
    await connectMySQL();
  } catch (error) {
    console.error('❌ MySQL连接失败:', error.message);
  }
  
  // 跳过AI工具集成初始化（沙箱环境限制）
  console.log('⚠️ 跳过AI工具集成初始化（沙箱环境限制）');
  
  // 启动监控系统
  startMonitoring();
  
  // 注册简化版AI路由
  app.get('/api/ai/ofox/models', (req, res) => {
    const models = {
      claude: {
        sonnet: 'anthropic/claude-sonnet-4.6',
        opus: 'anthropic/claude-opus-4.6'
      },
      gpt: {
        mini: 'openai/gpt-4o-mini',
        gpt4: 'openai/gpt-4o',
        gpt53: 'openai/gpt-5.3-codex',
        gpt54: 'openai/gpt-5.4'
      }
    };
    res.json({ success: true, data: models });
  });
  
  app.post('/api/ai/ofox/completion', async (req, res) => {
    try {
      res.json({ 
        success: true, 
        data: {
          choices: [{
            message: {
              role: 'assistant',
              content: 'AI响应：这是一个模拟的AI响应，因为沙箱环境限制无法访问真实的AI API。'
            }
          }]
        }
      });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  });
  
  // 启动服务器
  const server = app.listen(PORT, function() {
    logger.info('='.repeat(50));
    logger.info('茶海虾王@金融交易所看板平台');
    logger.info('Tea Sea Shrimp King @ Financial Exchange');
    logger.info('='.repeat(50));
    logger.info('服务器运行在端口: ' + PORT);
    logger.info('环境: ' + (process.env.NODE_ENV || 'development'));
    logger.info('API地址: http://localhost:' + PORT + '/api');
    logger.info('健康检查: http://localhost:' + PORT + '/health');
    logger.info('实时数据推送: ws://localhost:' + PORT);
    
    // 检查数据库状态
    const dbStatus = checkDatabaseStatus();
    logger.info('内存数据库状态: ' + (dbStatus.connected ? '✅ 已连接' : '⚠️ 未连接'));
    
    // 检查MongoDB状态
    const mongoStatus = checkMongoDBStatus();
    logger.info('MongoDB状态: ' + (mongoStatus.connected ? '✅ 已连接' : '⚠️ 未连接'));
    
    // 检查Redis状态
    const redisStatus = checkRedisStatus();
    logger.info('Redis状态: ' + (redisStatus.connected ? '✅ 已连接' : '⚠️ 未连接'));
    
    // 检查MySQL状态
    const mysqlStatus = checkMySQLStatus();
    logger.info('MySQL状态: ' + (mysqlStatus.connected ? '✅ 已连接' : '⚠️ 未连接'));
    
    logger.info('='.repeat(50));
  });
  
  // 集成Socket.io
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  });
  
  // 实时数据推送管理
  const realTimeDataManager = {
    clients: new Map(),
    
    // 注册客户端
    registerClient(socket) {
      this.clients.set(socket.id, {
        socket,
        subscribedChannels: new Set(),
        lastPing: Date.now()
      });
      console.log(`✅ 客户端连接: ${socket.id}`);
      console.log(`📊 当前连接数: ${this.clients.size}`);
    },
    
    // 注销客户端
    unregisterClient(socket) {
      this.clients.delete(socket.id);
      console.log(`❌ 客户端断开: ${socket.id}`);
      console.log(`📊 当前连接数: ${this.clients.size}`);
    },
    
    // 订阅频道
    subscribeChannel(socket, channel) {
      const client = this.clients.get(socket.id);
      if (client) {
        client.subscribedChannels.add(channel);
        console.log(`📢 客户端 ${socket.id} 订阅频道: ${channel}`);
      }
    },
    
    // 取消订阅频道
    unsubscribeChannel(socket, channel) {
      const client = this.clients.get(socket.id);
      if (client) {
        client.subscribedChannels.delete(channel);
        console.log(`📢 客户端 ${socket.id} 取消订阅频道: ${channel}`);
      }
    },
    
    // 向频道推送数据
    publishToChannel(channel, data) {
      this.clients.forEach((client, socketId) => {
        if (client.subscribedChannels.has(channel)) {
          try {
            client.socket.emit('data', {
              channel,
              data,
              timestamp: Date.now()
            });
          } catch (error) {
            console.error(`❌ 推送数据失败到客户端 ${socketId}:`, error.message);
          }
        }
      });
      console.log(`📤 向频道 ${channel} 推送数据，订阅者数量: ${Array.from(this.clients.values()).filter(client => client.subscribedChannels.has(channel)).length}`);
    },
    
    // 向所有客户端推送数据
    publishToAll(data) {
      this.clients.forEach((client, socketId) => {
        try {
          client.socket.emit('data', {
            channel: 'global',
            data,
            timestamp: Date.now()
          });
        } catch (error) {
          console.error(`❌ 推送数据失败到客户端 ${socketId}:`, error.message);
        }
      });
      console.log(`📤 向所有客户端推送数据，客户端数量: ${this.clients.size}`);
    }
  };
  
  // 模拟实时市场数据
  const mockMarketData = {
    stocks: [
      { symbol: 'AAPL', price: 180.25, change: 0.5, changePercent: 0.28 },
      { symbol: 'MSFT', price: 420.10, change: -1.2, changePercent: -0.29 },
      { symbol: 'GOOGL', price: 1520.75, change: 2.5, changePercent: 0.17 },
      { symbol: 'AMZN', price: 1780.30, change: 5.2, changePercent: 0.29 },
      { symbol: 'TSLA', price: 245.60, change: -3.4, changePercent: -1.37 }
    ],
    crypto: [
      { symbol: 'BTC', price: 42500.50, change: 1200.25, changePercent: 2.92 },
      { symbol: 'ETH', price: 2200.75, change: 45.30, changePercent: 2.09 },
      { symbol: 'BNB', price: 320.40, change: 5.20, changePercent: 1.65 },
      { symbol: 'SOL', price: 120.30, change: 3.10, changePercent: 2.64 },
      { symbol: 'ADA', price: 0.55, change: 0.01, changePercent: 1.85 }
    ],
    forex: [
      { pair: 'USD/CNY', rate: 7.15, change: 0.02, changePercent: 0.28 },
      { pair: 'EUR/USD', rate: 1.08, change: 0.01, changePercent: 0.93 },
      { pair: 'GBP/USD', rate: 1.25, change: -0.01, changePercent: -0.80 },
      { pair: 'USD/JPY', rate: 149.80, change: 0.30, changePercent: 0.20 },
      { pair: 'USD/KRW', rate: 1320.50, change: 5.20, changePercent: 0.40 }
    ]
  };
  
  // 定期推送市场数据
  setInterval(() => {
    // 更新模拟数据
    mockMarketData.stocks.forEach(stock => {
      const change = (Math.random() - 0.5) * 2;
      stock.price = Math.max(0, stock.price + change);
      stock.change = change;
      stock.changePercent = (change / (stock.price - change)) * 100;
    });
    
    mockMarketData.crypto.forEach(crypto => {
      const change = (Math.random() - 0.5) * 100;
      crypto.price = Math.max(0, crypto.price + change);
      crypto.change = change;
      crypto.changePercent = (change / (crypto.price - change)) * 100;
    });
    
    mockMarketData.forex.forEach(forex => {
      const change = (Math.random() - 0.5) * 0.05;
      forex.rate = Math.max(0, forex.rate + change);
      forex.change = change;
      forex.changePercent = (change / (forex.rate - change)) * 100;
    });
    
    // 推送数据到不同频道
    realTimeDataManager.publishToChannel('stocks', mockMarketData.stocks);
    realTimeDataManager.publishToChannel('crypto', mockMarketData.crypto);
    realTimeDataManager.publishToChannel('forex', mockMarketData.forex);
  }, 5000); // 每5秒推送一次
  
  // Socket.io事件处理
  io.on('connection', (socket) => {
    // 注册客户端
    realTimeDataManager.registerClient(socket);
    
    // 订阅频道
    socket.on('subscribe', (channel) => {
      realTimeDataManager.subscribeChannel(socket, channel);
    });
    
    // 取消订阅频道
    socket.on('unsubscribe', (channel) => {
      realTimeDataManager.unsubscribeChannel(socket, channel);
    });
    
    // 心跳检测
    socket.on('ping', () => {
      const client = realTimeDataManager.clients.get(socket.id);
      if (client) {
        client.lastPing = Date.now();
        socket.emit('pong', { timestamp: Date.now() });
      }
    });
    
    // 断开连接
    socket.on('disconnect', () => {
      realTimeDataManager.unregisterClient(socket);
    });
  });
  
  // 定期清理不活跃的客户端
  setInterval(() => {
    const now = Date.now();
    realTimeDataManager.clients.forEach((client, socketId) => {
      if (now - client.lastPing > 30000) { // 30秒无响应
        console.log(`⏰ 清理不活跃客户端: ${socketId}`);
        try {
          client.socket.disconnect(true);
        } catch (error) {
          console.error(`❌ 断开客户端连接失败:`, error.message);
        }
        realTimeDataManager.unregisterClient(client.socket);
      }
    });
  }, 60000); // 每分钟检查一次
};

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  logger.fatal('未捕获的异常:', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.fatal('未处理的Promise拒绝:', { error: err.message, stack: err.stack });
  process.exit(1);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM信号接收，正在关闭服务器...');
  logger.info('服务器已关闭');
  process.exit(0);
});

startServer();
