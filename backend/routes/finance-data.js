// 金融数据路由
const express = require('express');
const router = express.Router();
const danjuanFunds = require('../config/danjuan-funds');
const xueqiu = require('../config/xueqiu');
const choice = require('../config/choice');
const choiceQuantAPI = require('../config/choice-quant-api');
const eastmoneyAI = require('../config/eastmoney-ai');
const eastmoneyMxclaw = require('../config/eastmoney-mxclaw');
const sinaFinance = require('../config/sina-finance');
const cnfol = require('../config/cnfol');
const preciousMetals = require('../config/precious-metals');
const wallstreetcn = require('../config/wallstreetcn');
const jrj = require('../config/jrj');
const stcn = require('../config/stcn');
const csrc = require('../config/csrc');
const gf = require('../config/gf');
const gfjc = require('../config/gfjc');
const hexun = require('../config/hexun');
const cnfin = require('../config/cnfin');
const industryData = require('../config/industry-data');
const productServices = require('../config/product-services');
const financialNews = require('../config/financialnews');
const boc = require('../config/boc');
const icbc = require('../config/icbc');
const hczq = require('../config/hczq');
const zqrb = require('../config/zqrb');
const ppdai = require('../config/ppdai');

// 新增数据源
const pbc = require('../config/pbc');
const gov = require('../config/gov');
const cls = require('../config/cls');
const money163 = require('../config/money163');
const cs = require('../config/cs');
const celma = require('../config/celma');
const ccgp = require('../config/ccgp');
const audit = require('../config/audit');
const cnki = require('../config/cnki');
const yicai = require('../config/yicai');
const datayicai = require('../config/datayicai');
const localAIModel = require('../config/local-ai-model');

// 蛋卷基金API路由
router.get('/danjuan/index-valuation', async (req, res) => {
  try {
    const data = await danjuanFunds.getIndexValuation();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/danjuan/fund-screening', async (req, res) => {
  try {
    const params = req.query;
    const data = await danjuanFunds.getFundScreening(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/danjuan/index-funds', async (req, res) => {
  try {
    const params = req.query;
    const data = await danjuanFunds.getIndexFunds(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/danjuan/qdii-funds', async (req, res) => {
  try {
    const params = req.query;
    const data = await danjuanFunds.getQDIIFunds(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 雪球网API路由
router.get('/xueqiu/hot-stocks', async (req, res) => {
  try {
    const data = await xueqiu.getHotStocks();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/xueqiu/stock-detail/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await xueqiu.getStockDetail(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/xueqiu/market-overview', async (req, res) => {
  try {
    const data = await xueqiu.getMarketOverview();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 东方财富 Choice 智能金融数据路由
router.get('/choice/market-overview', async (req, res) => {
  try {
    const data = await choice.getMarketOverview();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/choice/stock-data/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await choice.getStockData(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/choice/industry-data', async (req, res) => {
  try {
    const data = await choice.getIndustryData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/choice/macro-data', async (req, res) => {
  try {
    const data = await choice.getMacroData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Choice数据量化接口路由
router.get('/choice/quant-api', async (req, res) => {
  try {
    const data = await choiceQuantAPI.getQuantAPIInfo();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/choice/quant-api/download', async (req, res) => {
  try {
    const data = await choiceQuantAPI.getQuantAPIDownload();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 东方财富妙想金融大模型路由
router.get('/eastmoney/ai/about', async (req, res) => {
  try {
    const data = await eastmoneyAI.getAboutMiaoxiang();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/eastmoney/ai/professional-data', async (req, res) => {
  try {
    const data = await eastmoneyAI.getProfessionalData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/eastmoney/ai/featured-algorithms', async (req, res) => {
  try {
    const data = await eastmoneyAI.getFeaturedAlgorithms();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/eastmoney/ai/powerful-computing', async (req, res) => {
  try {
    const data = await eastmoneyAI.getPowerfulComputing();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 东方财富妙想Claw路由
router.get('/eastmoney/mxclaw/info', async (req, res) => {
  try {
    const data = await eastmoneyMxClaw.getMxClawInfo();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/eastmoney/mxclaw/skills', async (req, res) => {
  try {
    const data = await eastmoneyMxClaw.getFinancialSkills();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/intelligent-stock-selection', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.intelligentStockSelection(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/market-search', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.marketSearch(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/macro-query', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.macroQuery(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/financial-data-query', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.financialDataQuery(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/miaoxiang-qna', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.miaoxiangQnA(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/performance-review', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.performanceReview(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/industry-stock-tracking', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.industryStockTracking(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/initial-coverage', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.initialCoverage(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/eastmoney/mxclaw/industry-research', async (req, res) => {
  try {
    const params = req.body;
    const data = await eastmoneyMxClaw.industryResearch(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 中金在线API路由
router.get('/cnfol/financial-news', async (req, res) => {
  try {
    const data = await cnfol.getFinancialNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfol/stock-data', async (req, res) => {
  try {
    const params = req.query;
    const data = await cnfol.getStockData(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfol/fund-data', async (req, res) => {
  try {
    const params = req.query;
    const data = await cnfol.getFundData(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfol/gold-data', async (req, res) => {
  try {
    const data = await cnfol.getGoldData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfol/forex-data', async (req, res) => {
  try {
    const data = await cnfol.getForexData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfol/futures-data', async (req, res) => {
  try {
    const data = await cnfol.getFuturesData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfol/wealth-data', async (req, res) => {
  try {
    const data = await cnfol.getWealthData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfol/macro-database', async (req, res) => {
  try {
    const { category, indicator } = req.query;
    const data = await cnfol.getMacroDatabase(category, indicator);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 贵金属和国际市场行情API路由
router.get('/precious-metals/international-gold', async (req, res) => {
  try {
    const data = await preciousMetals.getInternationalGold();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/international-silver', async (req, res) => {
  try {
    const data = await preciousMetals.getInternationalSilver();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/usd-index', async (req, res) => {
  try {
    const data = await preciousMetals.getUSDOLLARIndex();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/eur-index', async (req, res) => {
  try {
    const data = await preciousMetals.getEURIndex();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/international-oil', async (req, res) => {
  try {
    const data = await preciousMetals.getInternationalOil();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/sge-data', async (req, res) => {
  try {
    const data = await preciousMetals.getSGEData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/bank-precious-metals', async (req, res) => {
  try {
    const data = await preciousMetals.getBankPreciousMetals();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/tjpg-data', async (req, res) => {
  try {
    const data = await preciousMetals.getTJPGData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/precious-metals/shfe-data', async (req, res) => {
  try {
    const data = await preciousMetals.getSHFEData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 华尔街见闻API路由
router.get('/wallstreetcn/forex-market', async (req, res) => {
  try {
    const data = await wallstreetcn.getForexMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/wallstreetcn/market-news', async (req, res) => {
  try {
    const data = await wallstreetcn.getMarketNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/wallstreetcn/market-alerts', async (req, res) => {
  try {
    const data = await wallstreetcn.getMarketAlerts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/wallstreetcn/kline-data/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval, limit } = req.query;
    const data = await wallstreetcn.getKlineData(symbol, interval, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/wallstreetcn/commodity-market', async (req, res) => {
  try {
    const data = await wallstreetcn.getCommodityMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/wallstreetcn/bond-market', async (req, res) => {
  try {
    const data = await wallstreetcn.getBondMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 金融界API路由
router.get('/jrj/7x24-telegram', async (req, res) => {
  try {
    const data = await jrj.get7X24Telegram();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/24hour-ai-live', async (req, res) => {
  try {
    const data = await jrj.get24HourAILive();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/market-cloud-chart', async (req, res) => {
  try {
    const data = await jrj.getMarketCloudChart();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/limit-up-thermometer', async (req, res) => {
  try {
    const data = await jrj.getLimitUpThermometer();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/dragon-tiger-list', async (req, res) => {
  try {
    const data = await jrj.getDragonTigerList();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/a-share-headlines', async (req, res) => {
  try {
    const data = await jrj.getAShareHeadlines();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/market-situation', async (req, res) => {
  try {
    const data = await jrj.getMarketSituation();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/opportunity-intelligence', async (req, res) => {
  try {
    const data = await jrj.getOpportunityIntelligence();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jrj/daily-finance', async (req, res) => {
  try {
    const data = await jrj.getDailyFinance();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 证券时报社API路由
router.get('/stcn/shanghai-shenzhen-hongkong-funds', async (req, res) => {
  try {
    const data = await stcn.getShanghaiShenzhenHongKongFunds();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/margin-trading', async (req, res) => {
  try {
    const data = await stcn.getMarginTrading();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/dragon-tiger-list', async (req, res) => {
  try {
    const data = await stcn.getDragonTigerList();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/chip-movement', async (req, res) => {
  try {
    const data = await stcn.getChipMovement();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/new-stocks', async (req, res) => {
  try {
    const data = await stcn.getNewStocks();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/market-overview', async (req, res) => {
  try {
    const data = await stcn.getMarketOverview();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/every-trade', async (req, res) => {
  try {
    const data = await stcn.getEveryTrade();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/net-value-fund-selection', async (req, res) => {
  try {
    const data = await stcn.getNetValueFundSelection();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/shareholding-trends', async (req, res) => {
  try {
    const data = await stcn.getShareholdingTrends();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/restricted-stock-lifting', async (req, res) => {
  try {
    const data = await stcn.getRestrictedStockLifting();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/equity-pledge', async (req, res) => {
  try {
    const data = await stcn.getEquityPledge();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/block-trades', async (req, res) => {
  try {
    const data = await stcn.getBlockTrades();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/dividend-transfer', async (req, res) => {
  try {
    const data = await stcn.getDividendTransfer();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/institution-research', async (req, res) => {
  try {
    const data = await stcn.getInstitutionResearch();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/earnings-forecast', async (req, res) => {
  try {
    const data = await stcn.getEarningsForecast();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stcn/financial-report-analysis', async (req, res) => {
  try {
    const data = await stcn.getFinancialReportAnalysis();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 中国证监会API路由
router.get('/csrc/announcements', async (req, res) => {
  try {
    const data = await csrc.getCSRCAnnouncements();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/csrc/regulatory-policies', async (req, res) => {
  try {
    const data = await csrc.getRegulatoryPolicies();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/csrc/government-institutions', async (req, res) => {
  try {
    const data = await csrc.getGovernmentInstitutions();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/csrc/exchanges', async (req, res) => {
  try {
    const data = await csrc.getExchanges();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/csrc/market-data', async (req, res) => {
  try {
    const data = await csrc.getMarketData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 广发证券API路由
router.get('/gf/market-data', async (req, res) => {
  try {
    const data = await gf.getMarketData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gf/research-reports', async (req, res) => {
  try {
    const data = await gf.getResearchReports();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gf/products', async (req, res) => {
  try {
    const data = await gf.getProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gf/market-news', async (req, res) => {
  try {
    const data = await gf.getMarketNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gf/investment-advisory', async (req, res) => {
  try {
    const data = await gf.getInvestmentAdvisory();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 广发证券供应商API路由
router.get('/gfjc/suppliers', async (req, res) => {
  try {
    const data = await gfjc.getSuppliers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gfjc/products', async (req, res) => {
  try {
    const data = await gfjc.getProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gfjc/orders', async (req, res) => {
  try {
    const data = await gfjc.getOrders();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gfjc/purchase-requests', async (req, res) => {
  try {
    const data = await gfjc.getPurchaseRequests();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gfjc/contracts', async (req, res) => {
  try {
    const data = await gfjc.getContracts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 和讯在线API路由
router.get('/hexun/news', async (req, res) => {
  try {
    const data = await hexun.getNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/stock-7x24', async (req, res) => {
  try {
    const data = await hexun.getStock7x24();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/hongkong-stock', async (req, res) => {
  try {
    const data = await hexun.getHongKongStock();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/fund-wealth', async (req, res) => {
  try {
    const data = await hexun.getFundWealth();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/wealth-roadshow', async (req, res) => {
  try {
    const data = await hexun.getWealthRoadshow();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/ipo', async (req, res) => {
  try {
    const data = await hexun.getIPO();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/technology', async (req, res) => {
  try {
    const data = await hexun.getTechnology();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/bond', async (req, res) => {
  try {
    const data = await hexun.getBond();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/consumer', async (req, res) => {
  try {
    const data = await hexun.getConsumer();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/futures', async (req, res) => {
  try {
    const data = await hexun.getFutures();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/us-stock', async (req, res) => {
  try {
    const data = await hexun.getUSStock();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/bulk-index', async (req, res) => {
  try {
    const data = await hexun.getBulkIndex();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/insurance', async (req, res) => {
  try {
    const data = await hexun.getInsurance();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/bank', async (req, res) => {
  try {
    const data = await hexun.getBank();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/gold-forex', async (req, res) => {
  try {
    const data = await hexun.getGoldForex();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/auto-market', async (req, res) => {
  try {
    const data = await hexun.getAutoMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/real-estate', async (req, res) => {
  try {
    const data = await hexun.getRealEstate();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/data-management', async (req, res) => {
  try {
    const data = await hexun.getDataManagement();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hexun/famous-experts', async (req, res) => {
  try {
    const data = await hexun.getFamousExperts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 中国金融信息网API路由
router.get('/cnfin/financial-news', async (req, res) => {
  try {
    const data = await cnfin.getFinancialNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfin/economic-information', async (req, res) => {
  try {
    const data = await cnfin.getEconomicInformation();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfin/financial-data', async (req, res) => {
  try {
    const data = await cnfin.getFinancialData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfin/digital-economy-services', async (req, res) => {
  try {
    const data = await cnfin.getDigitalEconomyServices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnfin/information-technology-services', async (req, res) => {
  try {
    const data = await cnfin.getInformationTechnologyServices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 产业大数据服务API路由
router.get('/industry/chain', async (req, res) => {
  try {
    const data = await industryData.getIndustryChain();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/park', async (req, res) => {
  try {
    const data = await industryData.getParkData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/patent', async (req, res) => {
  try {
    const data = await industryData.getPatentData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/enterprise-tag', async (req, res) => {
  try {
    const data = await industryData.getEnterpriseTagData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/scenario-model', async (req, res) => {
  try {
    const data = await industryData.getScenarioModel();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/think-tank', async (req, res) => {
  try {
    const data = await industryData.getIndustryThinkTank();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/research-service', async (req, res) => {
  try {
    const data = await industryData.getIndustryResearchService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/consulting-service', async (req, res) => {
  try {
    const data = await industryData.getIndustryConsultingService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/data-analysis-service', async (req, res) => {
  try {
    const data = await industryData.getIndustryDataAnalysisService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/standard-report-service', async (req, res) => {
  try {
    const data = await industryData.getStandardIndustryReportService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/industry/ecosystem-service', async (req, res) => {
  try {
    const data = await industryData.getIndustryEcosystemService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 产品服务API路由
router.get('/product/financial', async (req, res) => {
  try {
    const data = await productServices.getFinancialVersion();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/product/government', async (req, res) => {
  try {
    const data = await productServices.getGovernmentVersion();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/product/enterprise', async (req, res) => {
  try {
    const data = await productServices.getEnterpriseVersion();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/product/flagship', async (req, res) => {
  try {
    const data = await productServices.getFlagshipVersion();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/product/all', async (req, res) => {
  try {
    const data = await productServices.getAllProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 金融新闻网API路由
router.get('/financialnews/homepage', async (req, res) => {
  try {
    const data = await financialNews.getHomepage();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/financial-management', async (req, res) => {
  try {
    const data = await financialNews.getFinancialManagement();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/headlines', async (req, res) => {
  try {
    const data = await financialNews.getHeadlines();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/comments', async (req, res) => {
  try {
    const data = await financialNews.getComments();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/depth', async (req, res) => {
  try {
    const data = await financialNews.getDepth();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/banking', async (req, res) => {
  try {
    const data = await financialNews.getBanking();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/securities', async (req, res) => {
  try {
    const data = await financialNews.getSecurities();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/insurance', async (req, res) => {
  try {
    const data = await financialNews.getInsurance();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/international', async (req, res) => {
  try {
    const data = await financialNews.getInternational();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/local', async (req, res) => {
  try {
    const data = await financialNews.getLocal();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/company', async (req, res) => {
  try {
    const data = await financialNews.getCompany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/theory', async (req, res) => {
  try {
    const data = await financialNews.getTheory();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/fintech', async (req, res) => {
  try {
    const data = await financialNews.getFintech();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/rural-finance', async (req, res) => {
  try {
    const data = await financialNews.getRuralFinance();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/visualization', async (req, res) => {
  try {
    const data = await financialNews.getVisualization();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/culture', async (req, res) => {
  try {
    const data = await financialNews.getCulture();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/disclosure-platform', async (req, res) => {
  try {
    const data = await financialNews.getDisclosurePlatform();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/chinese-financier', async (req, res) => {
  try {
    const data = await financialNews.getChineseFinancier();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/special-topic', async (req, res) => {
  try {
    const data = await financialNews.getSpecialTopic();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/brand', async (req, res) => {
  try {
    const data = await financialNews.getBrand();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/financialnews/bond-yield-curve', async (req, res) => {
  try {
    const data = await financialNews.getBondYieldCurve();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 中国银行API路由
router.get('/boc/homepage', async (req, res) => {
  try {
    const data = await boc.getHomepage();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/boc/financial-products', async (req, res) => {
  try {
    const data = await boc.getFinancialProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/boc/exchange-rates', async (req, res) => {
  try {
    const data = await boc.getExchangeRates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/boc/news', async (req, res) => {
  try {
    const data = await boc.getNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/boc/services', async (req, res) => {
  try {
    const data = await boc.getServices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 中国工商银行API路由
router.get('/icbc/homepage', async (req, res) => {
  try {
    const data = await icbc.getHomepage();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/icbc/financial-products', async (req, res) => {
  try {
    const data = await icbc.getFinancialProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/icbc/exchange-rates', async (req, res) => {
  try {
    const data = await icbc.getExchangeRates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/icbc/news', async (req, res) => {
  try {
    const data = await icbc.getNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/icbc/services', async (req, res) => {
  try {
    const data = await icbc.getServices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 华创证券API路由
router.get('/hczq/homepage', async (req, res) => {
  try {
    const data = await hczq.getHomepage();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hczq/market-data', async (req, res) => {
  try {
    const data = await hczq.getMarketData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hczq/research-reports', async (req, res) => {
  try {
    const data = await hczq.getResearchReports();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hczq/financial-products', async (req, res) => {
  try {
    const data = await hczq.getFinancialProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/hczq/services', async (req, res) => {
  try {
    const data = await hczq.getServices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 证券日报API路由
router.get('/zqrb/homepage', async (req, res) => {
  try {
    const data = await zqrb.getHomepage();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/zqrb/news', async (req, res) => {
  try {
    const data = await zqrb.getNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/zqrb/market-analysis', async (req, res) => {
  try {
    const data = await zqrb.getMarketAnalysis();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/zqrb/company-reports', async (req, res) => {
  try {
    const data = await zqrb.getCompanyReports();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/zqrb/fintech', async (req, res) => {
  try {
    const data = await zqrb.getFintech();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 中国知网API路由
router.get('/cnki/home', async (req, res) => {
  try {
    const data = await cnki.getHomeData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cnki/ai-model', async (req, res) => {
  try {
    const data = await cnki.getAIModelService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/cnki/ai-chat', async (req, res) => {
  try {
    const { message } = req.body;
    const data = await cnki.chatWithAI(message);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 第一财经API路由
router.get('/yicai/home', async (req, res) => {
  try {
    const data = await yicai.getHomeData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/yicai/financial-news', async (req, res) => {
  try {
    const data = await yicai.getFinancialNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/yicai/stock-market', async (req, res) => {
  try {
    const data = await yicai.getStockMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 新一线城市研究所API路由
router.get('/datayicai/home', async (req, res) => {
  try {
    const data = await datayicai.getHomeData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/datayicai/city-data', async (req, res) => {
  try {
    const data = await datayicai.getCityData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/datayicai/new-first-tier-cities', async (req, res) => {
  try {
    const data = await datayicai.getNewFirstTierCities();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/datayicai/city-rankings', async (req, res) => {
  try {
    const data = await datayicai.getCityRankings();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 本地AI模型测试路由
router.get('/local-ai/config', async (req, res) => {
  try {
    const data = await localAIModel.getConfig();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/local-ai/test/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const data = await localAIModel.testLocalModel(provider);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/local-ai/generate/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { prompt, model, options } = req.body;
    
    let data;
    if (provider === 'ollama') {
      data = await localAIModel.generateWithOllama(prompt, model, options);
    } else if (provider === 'lmstudio') {
      data = await localAIModel.generateWithLMStudio(prompt, model, options);
    } else {
      return res.status(400).json({ success: false, message: '不支持的本地模型提供商' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/local-ai/analyze/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { type, data } = req.body;
    
    const result = await localAIModel.analyzeWithLocalModel(type, data, provider);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;