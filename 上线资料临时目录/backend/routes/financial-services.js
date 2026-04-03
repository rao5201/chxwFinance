// 金融服务路由
const express = require('express');
const router = express.Router();
const financialServices = require('../config/financial-services');
const sinaFinance = require('../config/sina-finance');
const mediaData = require('../config/media-data');

// 优势数据与工具路由
router.get('/advantages', async (req, res) => {
  try {
    const data = financialServices.getAdvantages();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 领先栏目与服务路由
router.get('/leading-services', async (req, res) => {
  try {
    const data = financialServices.getLeadingServices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 行情中心路由
router.get('/market/center', async (req, res) => {
  try {
    const data = await financialServices.getMarketCenter();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 环球市场路由
router.get('/market/global', async (req, res) => {
  try {
    const data = await financialServices.getGlobalMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 美股实时路由
router.get('/market/us', async (req, res) => {
  try {
    const data = await financialServices.getUSMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 我的自选路由
router.get('/portfolio/watchlist', async (req, res) => {
  try {
    const data = await financialServices.getWatchlist();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 模拟交易路由
router.get('/portfolio/simulation', async (req, res) => {
  try {
    const data = await financialServices.getSimulation();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 股票数据中心路由
router.get('/data/stock', async (req, res) => {
  try {
    const data = await financialServices.getStockData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 基金数据中心路由
router.get('/data/fund', async (req, res) => {
  try {
    const data = await financialServices.getFundData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 全球宏观数据路由
router.get('/macro/global', async (req, res) => {
  try {
    const data = await financialServices.getGlobalMacroData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 国内宏观数据路由
router.get('/macro/domestic', async (req, res) => {
  try {
    const data = await financialServices.getDomesticMacroData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 环球财经大事路由
router.get('/calendar/global', async (req, res) => {
  try {
    const data = await financialServices.getGlobalFinancialEvents();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 经济数据路由
router.get('/calendar/economic', async (req, res) => {
  try {
    const data = await financialServices.getEconomicData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 新浪财经路由
router.get('/sina/stock-market', async (req, res) => {
  try {
    const data = await sinaFinance.getStockMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sina/fund-market', async (req, res) => {
  try {
    const data = await sinaFinance.getFundMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sina/bond-market', async (req, res) => {
  try {
    const data = await sinaFinance.getBondMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sina/hongkong-market', async (req, res) => {
  try {
    const data = await sinaFinance.getHongKongMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sina/us-market', async (req, res) => {
  try {
    const data = await sinaFinance.getUSMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sina/futures-market', async (req, res) => {
  try {
    const data = await sinaFinance.getFuturesMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sina/forex-market', async (req, res) => {
  try {
    const data = await sinaFinance.getForexMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sina/gold-market', async (req, res) => {
  try {
    const data = await sinaFinance.getGoldMarket();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 媒体数据路由
router.get('/media/list', async (req, res) => {
  try {
    const data = mediaData.getMediaList();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/media/securities-news', async (req, res) => {
  try {
    const data = await mediaData.getSecuritiesNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/media/finance-news', async (req, res) => {
  try {
    const data = await mediaData.getFinanceNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/media/magazine-articles', async (req, res) => {
  try {
    const data = await mediaData.getMagazineArticles();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/media/overseas-news', async (req, res) => {
  try {
    const data = await mediaData.getOverseasNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/media/exchange-announcements', async (req, res) => {
  try {
    const data = await mediaData.getExchangeAnnouncements();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;