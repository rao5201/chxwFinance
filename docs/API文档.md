# 茶海虾王@金融交易所看板平台 - API文档

## 1. 认证API

### 1.1 用户注册
- **端点**: `POST /api/auth/register`
- **描述**: 注册新用户
- **请求体**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "注册成功",
    "data": {
      "token": "string",
      "refreshToken": "string",
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "balance": "number",
        "createdAt": "string"
      }
    }
  }
  ```

### 1.2 用户登录
- **端点**: `POST /api/auth/login`
- **描述**: 用户登录
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "token": "string",
      "refreshToken": "string",
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "balance": "number",
        "lastLogin": "string"
      }
    }
  }
  ```

### 1.3 刷新令牌
- **端点**: `POST /api/auth/refresh`
- **描述**: 刷新访问令牌
- **请求体**:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "令牌刷新成功",
    "data": {
      "token": "string",
      "refreshToken": "string"
    }
  }
  ```

### 1.4 登出
- **端点**: `POST /api/auth/logout`
- **描述**: 用户登出
- **响应**:
  ```json
  {
    "success": true,
    "message": "登出成功"
  }
  ```

### 1.5 获取当前用户信息
- **端点**: `GET /api/auth/me`
- **描述**: 获取当前登录用户信息
- **请求头**:
  ```
  Authorization: Bearer <token>
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "balance": "number",
        "status": "string",
        "lastLogin": "string",
        "createdAt": "string"
      }
    }
  }
  ```

## 2. 市场API

### 2.1 市场概览
- **端点**: `GET /api/market/overview`
- **描述**: 获取市场概览数据
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "totalMarketCap": "number",
      "totalVolume24h": "number",
      "marketTrend": "string",
      "topAssets": "array",
      "marketStatus": "string"
    }
  }
  ```

### 2.2 资产价格
- **端点**: `GET /api/market/price/:symbol`
- **描述**: 获取指定资产的价格
- **参数**:
  - `symbol`: 资产符号（如BTC）
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "symbol": "string",
      "price": "number",
      "change24h": "number",
      "changePercentage24h": "number",
      "volume24h": "number",
      "marketCap": "number",
      "lastUpdated": "string"
    }
  }
  ```

### 2.3 K线数据
- **端点**: `GET /api/market/kline/:symbol`
- **描述**: 获取资产的K线数据
- **参数**:
  - `symbol`: 资产符号
  - `interval`: 时间间隔（如1h, 1d, 1w）
  - `limit`: 数据点数量
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "symbol": "string",
      "interval": "string",
      "data": [
        ["timestamp", "open", "high", "low", "close", "volume"]
      ]
    }
  }
  ```

### 2.4 交易对信息
- **端点**: `GET /api/market/pairs`
- **描述**: 获取所有交易对信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "pairs": [
        {
          "symbol": "string",
          "baseAsset": "string",
          "quoteAsset": "string",
          "status": "string",
          "minOrderSize": "number",
          "maxOrderSize": "number"
        }
      ]
    }
  }
  ```

### 2.5 市场深度
- **端点**: `GET /api/market/orderbook/:symbol`
- **描述**: 获取市场深度数据
- **参数**:
  - `symbol`: 资产符号
  - `limit`: 订单数量
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "symbol": "string",
      "timestamp": "number",
      "asks": [
        ["price", "quantity"]
      ],
      "bids": [
        ["price", "quantity"]
      ]
    }
  }
  ```

### 2.6 交易历史
- **端点**: `GET /api/market/trades/:symbol`
- **描述**: 获取最近交易历史
- **参数**:
  - `symbol`: 资产符号
  - `limit`: 交易数量
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "symbol": "string",
      "trades": [
        {
          "id": "string",
          "price": "number",
          "quantity": "number",
          "quoteQuantity": "number",
          "timestamp": "number",
          "isBuyerMaker": "boolean"
        }
      ]
    }
  }
  ```

## 3. 支付API

### 3.1 创建支付订单
- **端点**: `POST /api/payment/create`
- **描述**: 创建支付订单
- **请求体**:
  ```json
  {
    "amount": "number",
    "orderId": "string",
    "userId": "string",
    "username": "string",
    "email": "string",
    "paymentMethod": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "paymentId": "string",
      "amount": "number",
      "orderId": "string",
      "paymentUrl": "string",
      "status": "string",
      "createdAt": "string"
    }
  }
  ```

### 3.2 获取支付状态
- **端点**: `GET /api/payment/status/:paymentId`
- **描述**: 获取支付状态
- **参数**:
  - `paymentId`: 支付ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "paymentId": "string",
      "orderId": "string",
      "amount": "number",
      "status": "string",
      "transactionId": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 3.3 取消支付
- **端点**: `POST /api/payment/cancel/:paymentId`
- **描述**: 取消未完成的支付
- **参数**:
  - `paymentId`: 支付ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "支付已取消",
    "data": {
      "paymentId": "string",
      "status": "cancelled"
    }
  }
  ```

### 3.4 退款
- **端点**: `POST /api/payment/refund/:paymentId`
- **描述**: 处理退款请求
- **参数**:
  - `paymentId`: 支付ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "退款申请已提交",
    "data": {
      "paymentId": "string",
      "refundId": "string",
      "status": "refunding"
    }
  }
  ```

### 3.5 支付方式列表
- **端点**: `GET /api/payment/methods`
- **描述**: 获取支持的支付方式
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "methods": [
        {
          "id": "string",
          "name": "string",
          "logo": "string",
          "status": "string"
        }
      ]
    }
  }
  ```

### 3.6 支付成功回调
- **端点**: `GET /api/payment/success`
- **描述**: 支付成功回调
- **参数**:
  - `paymentId`: 支付ID
  - `orderId`: 订单ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "支付成功",
    "data": {
      "paymentId": "string",
      "orderId": "string",
      "status": "success"
    }
  }
  ```

### 3.7 支付取消回调
- **端点**: `GET /api/payment/cancel`
- **描述**: 支付取消回调
- **参数**:
  - `paymentId`: 支付ID
  - `orderId`: 订单ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "支付已取消",
    "data": {
      "paymentId": "string",
      "orderId": "string",
      "status": "cancelled"
    }
  }
  ```

### 3.8 支付Webhook
- **端点**: `POST /api/payment/webhook`
- **描述**: 支付状态更新Webhook
- **请求体**:
  ```json
  {
    "paymentId": "string",
    "orderId": "string",
    "status": "string",
    "amount": "number",
    "transactionId": "string",
    "timestamp": "number",
    "signature": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "Webhook received"
  }
  ```

## 4. AI分析API

### 4.1 分析请求
- **端点**: `POST /api/ai/analyze`
- **描述**: 发送AI分析请求
- **请求头**:
  ```
  Authorization: Bearer <token>
  ```
- **请求体**:
  ```json
  {
    "prompt": "string",
    "model": "string",
    "temperature": "number",
    "max_tokens": "number"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "analysisId": "string",
      "prompt": "string",
      "result": "string",
      "model": "string",
      "score": "number",
      "createdAt": "string"
    }
  }
  ```

### 4.2 获取分析历史
- **端点**: `GET /api/ai/history`
- **描述**: 获取用户的分析历史
- **请求头**:
  ```
  Authorization: Bearer <token>
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "analyses": [
        {
          "id": "string",
          "prompt": "string",
          "result": "string",
          "model": "string",
          "score": "number",
          "createdAt": "string"
        }
      ]
    }
  }
  ```

## 5. 资产管理API

### 5.1 获取所有资产
- **端点**: `GET /api/assets`
- **描述**: 获取所有资产
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "assets": [
        {
          "id": "string",
          "name": "string",
          "symbol": "string",
          "type": "string",
          "price": "number",
          "marketCap": "number",
          "volume24h": "number",
          "change24h": "number",
          "changePercentage24h": "number"
        }
      ]
    }
  }
  ```

### 5.2 获取单个资产
- **端点**: `GET /api/assets/:id`
- **描述**: 获取单个资产详情
- **参数**:
  - `id`: 资产ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "type": "string",
        "price": "number",
        "marketCap": "number",
        "volume24h": "number",
        "change24h": "number",
        "changePercentage24h": "number",
        "description": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

## 6. 交易API

### 6.1 创建交易
- **端点**: `POST /api/transactions`
- **描述**: 创建交易
- **请求头**:
  ```
  Authorization: Bearer <token>
  ```
- **请求体**:
  ```json
  {
    "assetId": "string",
    "type": "buy",
    "quantity": "number",
    "price": "number",
    "totalAmount": "number"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "transaction": {
        "id": "string",
        "userId": "string",
        "assetId": "string",
        "type": "string",
        "quantity": "number",
        "price": "number",
        "totalAmount": "number",
        "fee": "number",
        "status": "pending",
        "createdAt": "string"
      }
    }
  }
  ```

### 6.2 获取交易历史
- **端点**: `GET /api/transactions`
- **描述**: 获取用户的交易历史
- **请求头**:
  ```
  Authorization: Bearer <token>
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "transactions": [
        {
          "id": "string",
          "assetId": "string",
          "type": "string",
          "quantity": "number",
          "price": "number",
          "totalAmount": "number",
          "fee": "number",
          "status": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

## 7. 用户API

### 7.1 获取用户信息
- **端点**: `GET /api/users/:id`
- **描述**: 获取用户信息
- **参数**:
  - `id`: 用户ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "balance": "number",
        "status": "string",
        "lastLogin": "string",
        "createdAt": "string"
      }
    }
  }
  ```

### 7.2 更新用户信息
- **端点**: `PUT /api/users/:id`
- **描述**: 更新用户信息
- **请求头**:
  ```
  Authorization: Bearer <token>
  ```
- **请求体**:
  ```json
  {
    "username": "string",
    "email": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "balance": "number",
        "status": "string",
        "lastLogin": "string",
        "createdAt": "string"
      }
    }
  }
  ```

## 8. 健康检查

### 8.1 系统健康检查
- **端点**: `GET /health`
- **描述**: 检查系统健康状态
- **响应**:
  ```json
  {
    "status": "ok",
    "timestamp": "number",
    "uptime": "number",
    "services": {
      "server": "ok",
      "database": "ok",
      "redis": "ok"
    }
  }
  ```

## 9. 错误响应格式

所有API错误响应都遵循以下格式：

```json
{
  "success": false,
  "message": "错误消息",
  "error": "错误详情"  // 可选
}
```

## 10. 认证

大多数API端点需要JWT认证。在请求头中包含：

```
Authorization: Bearer <token>
```

## 11. 速率限制

API实施速率限制，防止滥用。超过限制的请求将收到429状态码。

## 12. 版本控制

API使用URL路径进行版本控制，当前版本为v1。

## 13. 最佳实践

1. **错误处理**: 正确处理API错误响应
2. **认证**: 始终使用HTTPS传输令牌
3. **速率限制**: 遵守API速率限制
4. **参数验证**: 在客户端验证输入参数
5. **缓存**: 合理使用缓存减少API调用

## 14. 技术支持

如需技术支持，请联系：rao5201@126.com
