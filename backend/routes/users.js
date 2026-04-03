const express = require('express');
const router = express.Router();

// 获取用户信息
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: '用户信息API - 待实现',
    data: null
  });
});

// 更新用户信息
router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: '更新用户信息API - 待实现',
    data: null
  });
});

// 获取用户余额
router.get('/balance', (req, res) => {
  res.json({
    success: true,
    message: '用户余额API - 待实现',
    data: null
  });
});

module.exports = router;
