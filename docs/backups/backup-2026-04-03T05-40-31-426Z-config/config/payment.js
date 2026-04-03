// 支付系统配置文件
const https = require('https');
const http = require('http');

// 支付系统API配置
const paymentSystem = {
  // API基础配置
  config: {
    apiKey: process.env.PAYMENT_API_KEY || 'demo-key',
    gatewayUrl: process.env.PAYMENT_GATEWAY_URL || 'https://api.payment-gateway.com',
    timeout: 15000,
    retryCount: 3,
    retryDelay: 1000,
    currency: 'CNY',
    successUrl: 'http://localhost:3000/api/payment/success',
    cancelUrl: 'http://localhost:3000/api/payment/cancel',
    webhookUrl: 'http://localhost:3000/api/payment/webhook'
  },
  
  // 通用请求函数
  request: function(endpoint, method, data) {
    return new Promise(function(resolve, reject) {
      const url = new URL(endpoint, paymentSystem.config.gatewayUrl);
      const options = {
        method: method || 'POST',
        timeout: paymentSystem.config.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + paymentSystem.config.apiKey
        }
      };
      
      const client = url.protocol === 'https:' ? https : http;
      const req = client.request(url, options, function(res) {
        let responseData = '';
        
        res.on('data', function(chunk) {
          responseData += chunk;
        });
        
        res.on('end', function() {
          try {
            const parsedData = JSON.parse(responseData);
            if (res.statusCode === 200) {
              resolve(parsedData);
            } else {
              reject(new Error('支付API请求失败: ' + parsedData.message || res.statusMessage));
            }
          } catch (error) {
            reject(new Error('解析响应失败: ' + error.message));
          }
        });
      });
      
      req.on('error', function(error) {
        reject(new Error('请求错误: ' + error.message));
      });
      
      req.on('timeout', function() {
        req.destroy();
        reject(new Error('请求超时'));
      });
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  },
  
  // 带重试的请求
  requestWithRetry: function(endpoint, method, data, retry = 0) {
    return paymentSystem.request(endpoint, method, data)
      .catch(function(error) {
        if (retry < paymentSystem.config.retryCount) {
          console.log('支付请求失败，重试 (' + (retry + 1) + '/' + paymentSystem.config.retryCount + ')...');
          return new Promise(function(resolve) {
            setTimeout(function() {
              resolve(paymentSystem.requestWithRetry(endpoint, method, data, retry + 1));
            }, paymentSystem.config.retryDelay);
          });
        }
        throw error;
      });
  },
  
  // 创建支付订单
  createPayment: function(orderData) {
    const paymentData = {
      amount: orderData.amount,
      currency: orderData.currency || paymentSystem.config.currency,
      orderId: orderData.orderId,
      description: orderData.description || '茶海虾王平台充值',
      customer: {
        id: orderData.userId,
        name: orderData.username,
        email: orderData.email
      },
      successUrl: paymentSystem.config.successUrl,
      cancelUrl: paymentSystem.config.cancelUrl,
      webhookUrl: paymentSystem.config.webhookUrl,
      metadata: orderData.metadata || {}
    };
    
    return paymentSystem.requestWithRetry('/payments', 'POST', paymentData);
  },
  
  // 获取支付状态
  getPaymentStatus: function(paymentId) {
    return paymentSystem.requestWithRetry('/payments/' + paymentId, 'GET');
  },
  
  // 取消支付
  cancelPayment: function(paymentId) {
    return paymentSystem.requestWithRetry('/payments/' + paymentId + '/cancel', 'POST');
  },
  
  // 退款
  refundPayment: function(paymentId, amount, reason) {
    const refundData = {
      amount: amount,
      reason: reason || '用户请求退款'
    };
    return paymentSystem.requestWithRetry('/payments/' + paymentId + '/refund', 'POST', refundData);
  },
  
  // 获取支付方式列表
  getPaymentMethods: function() {
    return paymentSystem.requestWithRetry('/payment-methods', 'GET');
  },
  
  // 验证支付签名
  verifySignature: function(signature, data) {
    // 这里实现签名验证逻辑
    // 实际项目中应该使用安全的签名验证方法
    console.log('验证支付签名:', signature);
    return true;
  },
  
  // 模拟支付响应（当支付API不可用时使用）
  getMockPaymentResponse: function(orderData) {
    const mockResponse = {
      id: 'pay_' + Date.now(),
      orderId: orderData.orderId,
      amount: orderData.amount,
      currency: orderData.currency || paymentSystem.config.currency,
      status: 'pending',
      paymentUrl: 'https://mock-payment-gateway.com/pay/' + Date.now(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      metadata: orderData.metadata || {}
    };
    
    return Promise.resolve(mockResponse);
  },
  
  // 模拟支付状态更新
  getMockPaymentStatus: function(paymentId) {
    const mockStatus = {
      id: paymentId,
      status: Math.random() > 0.2 ? 'success' : 'pending',
      amount: 100.00,
      currency: paymentSystem.config.currency,
      completedAt: Math.random() > 0.2 ? new Date().toISOString() : null,
      paymentMethod: 'alipay',
      transactionId: 'txn_' + Date.now()
    };
    
    return Promise.resolve(mockStatus);
  }
};

module.exports = paymentSystem;
