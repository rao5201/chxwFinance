const express = require('express');
const router = express.Router();
const { User, Transaction, UserAsset, Asset, UserActivity } = require('../models');

// 权限验证中间件
const authMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  next();
};

// 管理员权限验证
const adminMiddleware = (req, res, next) => {
  if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: '权限不足' });
  }
  next();
};

// 财务审计权限验证
const financeMiddleware = (req, res, next) => {
  if (!req.user || !['admin', 'superadmin', 'finance'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: '权限不足' });
  }
  next();
};

// 1. 总体概览
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const [userCount, transactionCount, assetCount, activeUsers] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Asset.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    ]);

    res.json({
      success: true,
      data: {
        userCount,
        transactionCount,
        assetCount,
        activeUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 2. 用户资料分析
router.get('/users/analysis', adminMiddleware, async (req, res) => {
  try {
    const [userStats, recentUsers, userStatus] = await Promise.all([
      User.aggregate([
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),
      User.find().sort({ createdAt: -1 }).limit(10).select('-password -refreshToken'),
      User.aggregate([
        { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }}
      ])
    ]);

    res.json({
      success: true,
      data: {
        userStats,
        recentUsers,
        userStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 3. 交易分析
router.get('/transactions/analysis', financeMiddleware, async (req, res) => {
  try {
    const [transactionStats, recentTransactions, transactionStatus] = await Promise.all([
      Transaction.aggregate([
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }},
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),
      Transaction.find().sort({ createdAt: -1 }).limit(10).populate('user', 'username').populate('asset', 'name symbol'),
      Transaction.aggregate([
        { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }}
      ])
    ]);

    res.json({
      success: true,
      data: {
        transactionStats,
        recentTransactions,
        transactionStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 4. 资产分析
router.get('/assets/analysis', authMiddleware, async (req, res) => {
  try {
    const [assetStats, topAssets, assetTypes] = await Promise.all([
      Asset.aggregate([
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),
      Asset.find().sort({ marketCap: -1 }).limit(10),
      Asset.aggregate([
        { $group: {
          _id: '$type',
          count: { $sum: 1 }
        }}
      ])
    ]);

    res.json({
      success: true,
      data: {
        assetStats,
        topAssets,
        assetTypes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 5. 用户操作记录
router.get('/activities', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50, action, status } = req.query;
    
    const activities = await UserActivity.getUserActivities(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      action,
      status
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 6. 操作统计
router.get('/activities/stats', authMiddleware, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const [stats, topActions] = await Promise.all([
      UserActivity.getActivityStats(req.user._id, parseInt(days)),
      UserActivity.getTopActions(req.user._id, 10)
    ]);

    res.json({
      success: true,
      data: {
        stats,
        topActions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 7. 个人资产组合
router.get('/portfolio', authMiddleware, async (req, res) => {
  try {
    const portfolio = await UserAsset.getUserPortfolio(req.user._id);
    
    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 8. 系统健康状态
router.get('/health', authMiddleware, async (req, res) => {
  try {
    const [userCount, transactionCount, assetCount, systemUptime] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Asset.countDocuments(),
      Promise.resolve(process.uptime())
    ]);

    res.json({
      success: true,
      data: {
        userCount,
        transactionCount,
        assetCount,
        systemUptime: Math.round(systemUptime),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 9. 数据导出
router.get('/export', adminMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    
    let data;
    if (type === 'users') {
      data = await User.find().select('-password -refreshToken');
    } else if (type === 'transactions') {
      data = await Transaction.find().populate('user', 'username').populate('asset', 'name symbol');
    } else if (type === 'assets') {
      data = await Asset.find();
    } else {
      return res.status(400).json({ success: false, message: '无效的导出类型' });
    }

    res.json({
      success: true,
      data: {
        type,
        count: data.length,
        data,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
