const express = require('express');
const router = express.Router();

// 获取资产列表
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '资产列表API - 待实现',
    data: null
  });
});

// 获取资产详情
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: '资产详情API - 待实现',
    data: null
  });
});

// 创建资产
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: '创建资产API - 待实现',
    data: null
  });
});

module.exports = router;
