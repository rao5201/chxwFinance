const express = require('express');
const router = express.Router();

// 获取交易列表
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '交易列表API - 待实现',
    data: null
  });
});

// 创建交易
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: '创建交易API - 待实现',
    data: null
  });
});

// 获取交易详情
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: '交易详情API - 待实现',
    data: null
  });
});

module.exports = router;
