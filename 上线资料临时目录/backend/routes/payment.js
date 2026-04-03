const express = require('express');
const paymentSystem = require('../config/payment');
const router = express.Router();

// 创建支付订单
router.post('/create', function(req, res) {
  try {
    const { amount, currency, orderId, description, userId, username, email, metadata } = req.body;
    
    if (!amount || !orderId || !userId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }
    
    const orderData = {
      amount: amount,
      currency: currency,
      orderId: orderId,
      description: description,
      userId: userId,
      username: username,
      email: email,
      metadata: metadata
    };
    
    // 调用支付系统创建订单
    paymentSystem.createPayment(orderData)
      .then(function(paymentResponse) {
        res.json({
          success: true,
          message: '支付订单创建成功',
          data: paymentResponse
        });
      })
      .catch(function(error) {
        console.error('创建支付订单失败:', error);
        
        // 使用模拟数据
        paymentSystem.getMockPaymentResponse(orderData)
          .then(function(mockResponse) {
            res.json({
              success: true,
              message: '使用模拟数据 - 支付订单创建成功',
              data: mockResponse
            });
          });
      });
    
  } catch (error) {
    console.error('创建支付订单错误:', error);
    res.status(500).json({
      success: false,
      message: '创建支付订单失败',
      error: error.message
    });
  }
});

// 获取支付状态
router.get('/status/:paymentId', function(req, res) {
  try {
    const { paymentId } = req.params;
    
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: '缺少支付ID'
      });
    }
    
    // 调用支付系统获取状态
    paymentSystem.getPaymentStatus(paymentId)
      .then(function(statusResponse) {
        res.json({
          success: true,
          message: '获取支付状态成功',
          data: statusResponse
        });
      })
      .catch(function(error) {
        console.error('获取支付状态失败:', error);
        
        // 使用模拟数据
        paymentSystem.getMockPaymentStatus(paymentId)
          .then(function(mockStatus) {
            res.json({
              success: true,
              message: '使用模拟数据 - 获取支付状态成功',
              data: mockStatus
            });
          });
      });
    
  } catch (error) {
    console.error('获取支付状态错误:', error);
    res.status(500).json({
      success: false,
      message: '获取支付状态失败',
      error: error.message
    });
  }
});

// 取消支付
router.post('/cancel/:paymentId', function(req, res) {
  try {
    const { paymentId } = req.params;
    
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: '缺少支付ID'
      });
    }
    
    // 调用支付系统取消支付
    paymentSystem.cancelPayment(paymentId)
      .then(function(cancelResponse) {
        res.json({
          success: true,
          message: '支付取消成功',
          data: cancelResponse
        });
      })
      .catch(function(error) {
        console.error('取消支付失败:', error);
        res.status(500).json({
          success: false,
          message: '取消支付失败',
          error: error.message
        });
      });
    
  } catch (error) {
    console.error('取消支付错误:', error);
    res.status(500).json({
      success: false,
      message: '取消支付失败',
      error: error.message
    });
  }
});

// 退款
router.post('/refund/:paymentId', function(req, res) {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;
    
    if (!paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: '缺少支付ID或退款金额'
      });
    }
    
    // 调用支付系统退款
    paymentSystem.refundPayment(paymentId, amount, reason)
      .then(function(refundResponse) {
        res.json({
          success: true,
          message: '退款成功',
          data: refundResponse
        });
      })
      .catch(function(error) {
        console.error('退款失败:', error);
        res.status(500).json({
          success: false,
          message: '退款失败',
          error: error.message
        });
      });
    
  } catch (error) {
    console.error('退款错误:', error);
    res.status(500).json({
      success: false,
      message: '退款失败',
      error: error.message
    });
  }
});

// 获取支付方式列表
router.get('/methods', function(req, res) {
  try {
    // 调用支付系统获取支付方式
    paymentSystem.getPaymentMethods()
      .then(function(methodsResponse) {
        res.json({
          success: true,
          message: '获取支付方式成功',
          data: methodsResponse
        });
      })
      .catch(function(error) {
        console.error('获取支付方式失败:', error);
        
        // 返回模拟支付方式
        const mockMethods = [
          { id: 'alipay', name: '支付宝', status: 'active' },
          { id: 'wechat', name: '微信支付', status: 'active' },
          { id: 'card', name: '银行卡', status: 'active' },
          { id: 'applepay', name: 'Apple Pay', status: 'active' }
        ];
        
        res.json({
          success: true,
          message: '使用模拟数据 - 获取支付方式成功',
          data: mockMethods
        });
      });
    
  } catch (error) {
    console.error('获取支付方式错误:', error);
    res.status(500).json({
      success: false,
      message: '获取支付方式失败',
      error: error.message
    });
  }
});

// 支付成功回调
router.get('/success', function(req, res) {
  try {
    const { paymentId, orderId, status } = req.query;
    
    console.log('支付成功回调:', { paymentId, orderId, status });
    
    // 这里可以处理支付成功的逻辑
    // 例如：更新订单状态、通知用户等
    
    res.json({
      success: true,
      message: '支付成功',
      data: {
        paymentId: paymentId,
        orderId: orderId,
        status: status
      }
    });
    
  } catch (error) {
    console.error('支付成功回调错误:', error);
    res.status(500).json({
      success: false,
      message: '处理支付成功回调失败',
      error: error.message
    });
  }
});

// 支付取消回调
router.get('/cancel', function(req, res) {
  try {
    const { paymentId, orderId } = req.query;
    
    console.log('支付取消回调:', { paymentId, orderId });
    
    // 这里可以处理支付取消的逻辑
    
    res.json({
      success: true,
      message: '支付已取消',
      data: {
        paymentId: paymentId,
        orderId: orderId
      }
    });
    
  } catch (error) {
    console.error('支付取消回调错误:', error);
    res.status(500).json({
      success: false,
      message: '处理支付取消回调失败',
      error: error.message
    });
  }
});

// 支付Webhook
router.post('/webhook', function(req, res) {
  try {
    const paymentData = req.body;
    const signature = req.headers['x-payment-signature'];
    
    console.log('支付Webhook:', paymentData);
    
    // 验证签名
    if (!paymentSystem.verifySignature(signature, paymentData)) {
      return res.status(401).json({
        success: false,
        message: '签名验证失败'
      });
    }
    
    // 处理支付状态更新
    const { id: paymentId, status, orderId, amount } = paymentData;
    
    // 这里可以处理不同的支付状态
    switch (status) {
      case 'success':
        console.log('支付成功:', paymentId, orderId, amount);
        // 处理支付成功逻辑
        break;
      case 'failed':
        console.log('支付失败:', paymentId, orderId);
        // 处理支付失败逻辑
        break;
      case 'pending':
        console.log('支付处理中:', paymentId, orderId);
        // 处理支付处理中逻辑
        break;
      default:
        console.log('未知支付状态:', status);
    }
    
    res.json({
      success: true,
      message: 'Webhook处理成功'
    });
    
  } catch (error) {
    console.error('Webhook处理错误:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook处理失败',
      error: error.message
    });
  }
});

module.exports = router;
