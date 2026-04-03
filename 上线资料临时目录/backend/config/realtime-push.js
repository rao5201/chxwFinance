/**
 * 茶海虾王@金融交易所看板平台 - 实时数据推送系统
 * 支持WebSocket、SSE、推送通知等多种实时通信方式
 */

const WebSocket = require('ws');
const http = require('http');
const { logger } = require('./logger');
const { EventEmitter } = require('events');

// 实时推送配置
const realtimeConfig = {
  websocket: {
    enabled: true,
    port: process.env.WS_PORT || 8081,
    heartbeatInterval: 30000, // 30秒心跳
    maxConnections: 1000,
    perMessageDeflate: true
  },
  
  sse: {
    enabled: true,
    endpoint: '/api/sse',
    reconnectInterval: 5000,
    maxClients: 500
  },
  
  pushNotification: {
    enabled: true,
    providers: ['firebase', 'onesignal'],
    batchSize: 100
  },
  
  dataStreams: {
    priceUpdates: {
      enabled: true,
      interval: 1000, // 1秒
      symbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'BTC', 'ETH']
    },
    marketDepth: {
      enabled: true,
      interval: 500, // 500毫秒
      levels: 10
    },
    tradeUpdates: {
      enabled: true,
      realtime: true
    },
    newsUpdates: {
      enabled: true,
      interval: 60000 // 1分钟
    }
  }
};

// WebSocket服务器管理
class WebSocketManager extends EventEmitter {
  constructor(server) {
    super();
    this.wss = null;
    this.clients = new Map();
    this.rooms = new Map();
    this.connectionCount = 0;
    
    if (realtimeConfig.websocket.enabled) {
      this.initialize(server);
    }
  }

  // 初始化WebSocket服务器
  initialize(server) {
    this.wss = new WebSocket.Server({
      server,
      path: '/ws',
      perMessageDeflate: realtimeConfig.websocket.perMessageDeflate,
      maxPayload: 1024 * 1024 // 1MB
    });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    this.wss.on('error', (error) => {
      logger.error('WebSocket服务器错误:', error);
    });

    // 启动心跳检测
    this.startHeartbeat();

    logger.info(`✅ WebSocket服务器已启动`);
  }

  // 处理新连接
  handleConnection(ws, req) {
    // 检查连接数限制
    if (this.connectionCount >= realtimeConfig.websocket.maxConnections) {
      ws.close(1013, '服务器连接数已满');
      return;
    }

    const clientId = this.generateClientId();
    const clientInfo = {
      id: clientId,
      ws: ws,
      ip: req.socket.remoteAddress,
      connectedAt: Date.now(),
      lastPing: Date.now(),
      subscriptions: new Set(),
      userId: null
    };

    this.clients.set(clientId, clientInfo);
    this.connectionCount++;

    logger.info(`🔌 新客户端连接: ${clientId}, IP: ${clientInfo.ip}`);

    // 发送欢迎消息
    this.sendToClient(clientId, {
      type: 'connection',
      data: {
        clientId,
        message: '连接成功',
        timestamp: Date.now()
      }
    });

    // 设置消息处理器
    ws.on('message', (data) => {
      this.handleMessage(clientId, data);
    });

    // 设置关闭处理器
    ws.on('close', (code, reason) => {
      this.handleDisconnection(clientId, code, reason);
    });

    // 设置错误处理器
    ws.on('error', (error) => {
      logger.error(`客户端 ${clientId} 错误:`, error);
    });
  }

  // 处理消息
  handleMessage(clientId, data) {
    try {
      const message = JSON.parse(data);
      const client = this.clients.get(clientId);

      if (!client) return;

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, message.data);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message.data);
          break;
        case 'ping':
          this.handlePing(clientId);
          break;
        case 'auth':
          this.handleAuth(clientId, message.data);
          break;
        default:
          this.emit('message', { clientId, message });
      }
    } catch (error) {
      logger.error('处理WebSocket消息失败:', error);
      this.sendToClient(clientId, {
        type: 'error',
        data: { message: '消息格式错误' }
      });
    }
  }

  // 处理订阅
  handleSubscribe(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { channel, symbols } = data;
    
    // 添加到客户端订阅
    if (symbols && Array.isArray(symbols)) {
      symbols.forEach(symbol => {
        const subscriptionKey = `${channel}:${symbol}`;
        client.subscriptions.add(subscriptionKey);
        
        // 添加到房间
        if (!this.rooms.has(subscriptionKey)) {
          this.rooms.set(subscriptionKey, new Set());
        }
        this.rooms.get(subscriptionKey).add(clientId);
      });
    } else {
      // 订阅整个频道
      client.subscriptions.add(channel);
      if (!this.rooms.has(channel)) {
        this.rooms.set(channel, new Set());
      }
      this.rooms.get(channel).add(clientId);
    }

    logger.info(`📡 客户端 ${clientId} 订阅: ${channel}`);
    
    this.sendToClient(clientId, {
      type: 'subscribed',
      data: { channel, symbols }
    });
  }

  // 处理取消订阅
  handleUnsubscribe(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { channel, symbols } = data;
    
    if (symbols && Array.isArray(symbols)) {
      symbols.forEach(symbol => {
        const subscriptionKey = `${channel}:${symbol}`;
        client.subscriptions.delete(subscriptionKey);
        
        const room = this.rooms.get(subscriptionKey);
        if (room) {
          room.delete(clientId);
          if (room.size === 0) {
            this.rooms.delete(subscriptionKey);
          }
        }
      });
    } else {
      client.subscriptions.delete(channel);
      const room = this.rooms.get(channel);
      if (room) {
        room.delete(clientId);
        if (room.size === 0) {
          this.rooms.delete(channel);
        }
      }
    }

    logger.info(`📡 客户端 ${clientId} 取消订阅: ${channel}`);
  }

  // 处理心跳
  handlePing(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      client.lastPing = Date.now();
      this.sendToClient(clientId, { type: 'pong', timestamp: Date.now() });
    }
  }

  // 处理认证
  handleAuth(clientId, data) {
    const client = this.clients.get(clientId);
    if (client) {
      client.userId = data.userId;
      logger.info(`🔐 客户端 ${clientId} 认证为用户: ${data.userId}`);
      
      this.sendToClient(clientId, {
        type: 'auth',
        data: { success: true, userId: data.userId }
      });
    }
  }

  // 处理断开连接
  handleDisconnection(clientId, code, reason) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 从所有房间中移除
    client.subscriptions.forEach(subscription => {
      const room = this.rooms.get(subscription);
      if (room) {
        room.delete(clientId);
        if (room.size === 0) {
          this.rooms.delete(subscription);
        }
      }
    });

    this.clients.delete(clientId);
    this.connectionCount--;

    logger.info(`🔌 客户端断开连接: ${clientId}, 代码: ${code}`);
  }

  // 启动心跳检测
  startHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      const timeout = realtimeConfig.websocket.heartbeatInterval * 2;

      this.clients.forEach((client, clientId) => {
        if (now - client.lastPing > timeout) {
          logger.warn(`💔 客户端 ${clientId} 心跳超时`);
          client.ws.close(1001, '心跳超时');
        } else {
          // 发送心跳
          this.sendToClient(clientId, { type: 'ping', timestamp: now });
        }
      });
    }, realtimeConfig.websocket.heartbeatInterval);
  }

  // 发送消息给指定客户端
  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  // 广播消息给所有客户端
  broadcast(message) {
    const data = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    });
  }

  // 发送消息给指定房间
  broadcastToRoom(room, message) {
    const roomClients = this.rooms.get(room);
    if (!roomClients) return;

    const data = JSON.stringify(message);
    roomClients.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    });
  }

  // 生成客户端ID
  generateClientId() {
    return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 获取统计信息
  getStats() {
    return {
      connections: this.connectionCount,
      rooms: this.rooms.size,
      uptime: process.uptime()
    };
  }
}

// SSE管理器
class SSEManager {
  constructor() {
    this.clients = new Map();
    this.connectionCount = 0;
  }

  // 处理SSE连接
  handleConnection(req, res) {
    // 检查连接数限制
    if (this.connectionCount >= realtimeConfig.sse.maxClients) {
      res.status(503).json({ error: '服务器连接数已满' });
      return;
    }

    const clientId = this.generateClientId();
    
    // 设置SSE头部
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    const clientInfo = {
      id: clientId,
      res: res,
      connectedAt: Date.now(),
      subscriptions: new Set()
    };

    this.clients.set(clientId, clientInfo);
    this.connectionCount++;

    logger.info(`📡 SSE客户端连接: ${clientId}`);

    // 发送连接成功事件
    this.sendEvent(clientId, 'connected', {
      clientId,
      message: 'SSE连接成功',
      timestamp: Date.now()
    });

    // 处理连接关闭
    req.on('close', () => {
      this.handleDisconnection(clientId);
    });

    // 处理错误
    req.on('error', (error) => {
      logger.error(`SSE客户端 ${clientId} 错误:`, error);
    });

    return clientId;
  }

  // 处理断开连接
  handleDisconnection(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    this.clients.delete(clientId);
    this.connectionCount--;

    logger.info(`📡 SSE客户端断开连接: ${clientId}`);
  }

  // 发送事件
  sendEvent(clientId, event, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    client.res.write(message);
  }

  // 广播事件
  broadcast(event, data) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach(client => {
      client.res.write(message);
    });
  }

  // 生成客户端ID
  generateClientId() {
    return `sse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 实时数据流管理
class DataStreamManager extends EventEmitter {
  constructor(wsManager, sseManager) {
    super();
    this.wsManager = wsManager;
    this.sseManager = sseManager;
    this.streams = new Map();
    this.initializeStreams();
  }

  // 初始化数据流
  initializeStreams() {
    // 价格更新流
    if (realtimeConfig.dataStreams.priceUpdates.enabled) {
      this.startPriceStream();
    }

    // 市场深度流
    if (realtimeConfig.dataStreams.marketDepth.enabled) {
      this.startMarketDepthStream();
    }

    // 交易更新流
    if (realtimeConfig.dataStreams.tradeUpdates.enabled) {
      this.startTradeStream();
    }

    // 新闻更新流
    if (realtimeConfig.dataStreams.newsUpdates.enabled) {
      this.startNewsStream();
    }
  }

  // 启动价格数据流
  startPriceStream() {
    const interval = realtimeConfig.dataStreams.priceUpdates.interval;
    const symbols = realtimeConfig.dataStreams.priceUpdates.symbols;

    const stream = setInterval(() => {
      symbols.forEach(symbol => {
        const priceData = this.generateMockPriceData(symbol);
        
        // 通过WebSocket发送
        this.wsManager.broadcastToRoom(`price:${symbol}`, {
          type: 'price',
          data: priceData
        });

        // 通过SSE发送
        this.sseManager.broadcast('price', priceData);
      });
    }, interval);

    this.streams.set('price', stream);
    logger.info('✅ 价格数据流已启动');
  }

  // 启动市场深度流
  startMarketDepthStream() {
    const interval = realtimeConfig.dataStreams.marketDepth.interval;

    const stream = setInterval(() => {
      const depthData = this.generateMockMarketDepth();
      
      this.wsManager.broadcastToRoom('marketDepth', {
        type: 'marketDepth',
        data: depthData
      });
    }, interval);

    this.streams.set('marketDepth', stream);
    logger.info('✅ 市场深度数据流已启动');
  }

  // 启动交易数据流
  startTradeStream() {
    // 模拟实时交易数据
    logger.info('✅ 交易数据流已启动');
  }

  // 启动新闻数据流
  startNewsStream() {
    const interval = realtimeConfig.dataStreams.newsUpdates.interval;

    const stream = setInterval(() => {
      const newsData = this.generateMockNewsData();
      
      this.wsManager.broadcastToRoom('news', {
        type: 'news',
        data: newsData
      });

      this.sseManager.broadcast('news', newsData);
    }, interval);

    this.streams.set('news', stream);
    logger.info('✅ 新闻数据流已启动');
  }

  // 生成模拟价格数据
  generateMockPriceData(symbol) {
    const basePrice = {
      'AAPL': 150,
      'GOOGL': 2800,
      'MSFT': 300,
      'TSLA': 800,
      'BTC': 45000,
      'ETH': 3000
    }[symbol] || 100;

    const change = (Math.random() - 0.5) * basePrice * 0.02;
    
    return {
      symbol,
      price: basePrice + change,
      change: change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: Date.now()
    };
  }

  // 生成模拟市场深度数据
  generateMockMarketDepth() {
    const bids = [];
    const asks = [];
    const basePrice = 100;

    for (let i = 0; i < 10; i++) {
      bids.push({
        price: basePrice - i * 0.1,
        volume: Math.floor(Math.random() * 1000)
      });
      asks.push({
        price: basePrice + i * 0.1,
        volume: Math.floor(Math.random() * 1000)
      });
    }

    return { bids, asks, timestamp: Date.now() };
  }

  // 生成模拟新闻数据
  generateMockNewsData() {
    const headlines = [
      '股市今日表现强劲，科技股领涨',
      '央行宣布维持利率不变',
      '新能源汽车销量创新高',
      '比特币价格突破关键阻力位',
      '美联储会议纪要公布'
    ];

    return {
      id: Date.now(),
      headline: headlines[Math.floor(Math.random() * headlines.length)],
      source: '金融新闻',
      timestamp: Date.now()
    };
  }

  // 停止所有数据流
  stopAllStreams() {
    this.streams.forEach((stream, name) => {
      clearInterval(stream);
      logger.info(`⏹️  数据流已停止: ${name}`);
    });
    this.streams.clear();
  }
}

// 推送通知管理
class PushNotificationManager {
  constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  // 初始化推送提供商
  initializeProviders() {
    if (realtimeConfig.pushNotification.enabled) {
      // 初始化Firebase
      if (realtimeConfig.pushNotification.providers.includes('firebase')) {
        this.initializeFirebase();
      }
      
      // 初始化OneSignal
      if (realtimeConfig.pushNotification.providers.includes('onesignal')) {
        this.initializeOneSignal();
      }
    }
  }

  // 初始化Firebase
  initializeFirebase() {
    try {
      const admin = require('firebase-admin');
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          })
        });
      }

      this.providers.set('firebase', admin.messaging());
      logger.info('✅ Firebase推送已初始化');
    } catch (error) {
      logger.error('Firebase初始化失败:', error);
    }
  }

  // 初始化OneSignal
  initializeOneSignal() {
    // OneSignal初始化逻辑
    logger.info('✅ OneSignal推送已初始化');
  }

  // 发送推送通知
  async sendNotification(tokens, notification) {
    const results = [];

    for (const [providerName, provider] of this.providers) {
      try {
        const result = await this.sendToProvider(providerName, provider, tokens, notification);
        results.push({ provider: providerName, ...result });
      } catch (error) {
        logger.error(`${providerName}推送失败:`, error);
        results.push({ provider: providerName, success: false, error: error.message });
      }
    }

    return results;
  }

  // 发送到指定提供商
  async sendToProvider(providerName, provider, tokens, notification) {
    switch (providerName) {
      case 'firebase':
        return this.sendToFirebase(provider, tokens, notification);
      default:
        throw new Error(`未知的推送提供商: ${providerName}`);
    }
  }

  // 发送到Firebase
  async sendToFirebase(messaging, tokens, notification) {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data || {},
      tokens: tokens
    };

    const response = await messaging.sendMulticast(message);
    
    return {
      success: response.successCount > 0,
      sent: response.successCount,
      failed: response.failureCount
    };
  }
}

// 实时推送管理器
const realtimePushManager = {
  wsManager: null,
  sseManager: null,
  dataStreamManager: null,
  pushManager: null,

  // 初始化
  initialize(server) {
    this.wsManager = new WebSocketManager(server);
    this.sseManager = new SSEManager();
    this.dataStreamManager = new DataStreamManager(this.wsManager, this.sseManager);
    this.pushManager = new PushNotificationManager();

    logger.info('✅ 实时推送系统初始化完成');
  },

  // 获取中间件
  getMiddleware() {
    return {
      // WebSocket升级处理
      websocket: (req, res, next) => {
        if (req.headers.upgrade === 'websocket') {
          // WebSocket升级由WebSocketServer处理
          next();
        } else {
          next();
        }
      },

      // SSE端点
      sse: (req, res) => {
        this.sseManager.handleConnection(req, res);
      }
    };
  },

  // 发送实时数据
  broadcast(data) {
    this.wsManager.broadcast(data);
    this.sseManager.broadcast('message', data);
  },

  // 发送给指定用户
  sendToUser(userId, data) {
    this.wsManager.clients.forEach((client, clientId) => {
      if (client.userId === userId) {
        this.wsManager.sendToClient(clientId, data);
      }
    });
  },

  // 获取统计信息
  getStats() {
    return {
      websocket: this.wsManager?.getStats(),
      sse: {
        connections: this.sseManager?.connectionCount || 0
      }
    };
  },

  // 关闭所有连接
  close() {
    this.dataStreamManager?.stopAllStreams();
    this.wsManager?.wss?.close();
    logger.info('⏹️  实时推送系统已关闭');
  }
};

module.exports = {
  realtimeConfig,
  WebSocketManager,
  SSEManager,
  DataStreamManager,
  PushNotificationManager,
  realtimePushManager
};