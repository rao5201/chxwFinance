const express = require('express');
const financeAPI = require('../config/financeAPI');
const router = express.Router();

// 获取市场行情
router.get('/overview', function(req, res) {
  try {
    // 调用金融数据API获取市场行情
    financeAPI.getMarketOverview()
      .then(function(marketData) {
        res.json({
          success: true,
          message: '获取市场行情成功',
          data: marketData
        });
      })
      .catch(function(error) {
        console.error('获取市场行情失败:', error);
        
        // 使用模拟数据
        financeAPI.getMockData('marketOverview')
          .then(function(mockData) {
            res.json({
              success: true,
              message: '使用模拟数据 - 获取市场行情成功',
              data: mockData
            });
          });
      });
    
  } catch (error) {
    console.error('获取市场行情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取市场行情失败',
      error: error.message
    });
  }
});

// 获取资产价格
router.get('/price/:symbol', function(req, res) {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: '缺少资产代码'
      });
    }
    
    // 调用金融数据API获取资产价格
    financeAPI.getAssetPrice(symbol)
      .then(function(priceData) {
        res.json({
          success: true,
          message: '获取资产价格成功',
          data: priceData
        });
      })
      .catch(function(error) {
        console.error('获取资产价格失败:', error);
        
        // 使用模拟数据
        financeAPI.getMockData('assetPrice', symbol)
          .then(function(mockData) {
            res.json({
              success: true,
              message: '使用模拟数据 - 获取资产价格成功',
              data: mockData
            });
          });
      });
    
  } catch (error) {
    console.error('获取资产价格错误:', error);
    res.status(500).json({
      success: false,
      message: '获取资产价格失败',
      error: error.message
    });
  }
});

// 获取K线数据
router.get('/kline/:symbol', function(req, res) {
  try {
    const { symbol } = req.params;
    const { interval, limit } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: '缺少资产代码'
      });
    }
    
    // 调用金融数据API获取K线数据
    financeAPI.getKlineData(symbol, interval, limit)
      .then(function(klineData) {
        res.json({
          success: true,
          message: '获取K线数据成功',
          data: klineData
        });
      })
      .catch(function(error) {
        console.error('获取K线数据失败:', error);
        
        // 使用模拟数据
        financeAPI.getMockData('klineData', symbol)
          .then(function(mockData) {
            res.json({
              success: true,
              message: '使用模拟数据 - 获取K线数据成功',
              data: mockData
            });
          });
      });
    
  } catch (error) {
    console.error('获取K线数据错误:', error);
    res.status(500).json({
      success: false,
      message: '获取K线数据失败',
      error: error.message
    });
  }
});

// 获取交易对信息
router.get('/pairs', function(req, res) {
  try {
    // 调用金融数据API获取交易对
    financeAPI.getTradingPairs()
      .then(function(pairsData) {
        res.json({
          success: true,
          message: '获取交易对成功',
          data: pairsData
        });
      })
      .catch(function(error) {
        console.error('获取交易对失败:', error);
        
        // 使用模拟数据
        financeAPI.getMockData('tradingPairs')
          .then(function(mockData) {
            res.json({
              success: true,
              message: '使用模拟数据 - 获取交易对成功',
              data: mockData
            });
          });
      });
    
  } catch (error) {
    console.error('获取交易对错误:', error);
    res.status(500).json({
      success: false,
      message: '获取交易对失败',
      error: error.message
    });
  }
});

// 获取市场深度
router.get('/orderbook/:symbol', function(req, res) {
  try {
    const { symbol } = req.params;
    const { limit } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: '缺少资产代码'
      });
    }
    
    // 调用金融数据API获取市场深度
    financeAPI.getOrderBook(symbol, limit)
      .then(function(orderBookData) {
        res.json({
          success: true,
          message: '获取市场深度成功',
          data: orderBookData
        });
      })
      .catch(function(error) {
        console.error('获取市场深度失败:', error);
        
        // 使用模拟数据
        financeAPI.getMockData('orderBook', symbol)
          .then(function(mockData) {
            res.json({
              success: true,
              message: '使用模拟数据 - 获取市场深度成功',
              data: mockData
            });
          });
      });
    
  } catch (error) {
    console.error('获取市场深度错误:', error);
    res.status(500).json({
      success: false,
      message: '获取市场深度失败',
      error: error.message
    });
  }
});

// 获取交易历史
router.get('/trades/:symbol', function(req, res) {
  try {
    const { symbol } = req.params;
    const { limit } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: '缺少资产代码'
      });
    }
    
    // 调用金融数据API获取交易历史
    financeAPI.getTradeHistory(symbol, limit)
      .then(function(tradesData) {
        res.json({
          success: true,
          message: '获取交易历史成功',
          data: tradesData
        });
      })
      .catch(function(error) {
        console.error('获取交易历史失败:', error);
        
        // 使用模拟数据
        financeAPI.getMockData('tradeHistory', symbol)
          .then(function(mockData) {
            res.json({
              success: true,
              message: '使用模拟数据 - 获取交易历史成功',
              data: mockData
            });
          });
      });
    
  } catch (error) {
    console.error('获取交易历史错误:', error);
    res.status(500).json({
      success: false,
      message: '获取交易历史失败',
      error: error.message
    });
  }
});

module.exports = router;
