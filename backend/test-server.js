const express = require('express');
const cors = require('cors');

const app = express();

// CORS配置
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 测试用户登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // 模拟用户验证
  if (username === 'client' && password === 'Client123!') {
    res.json({
      success: true,
      data: {
        token: 'test-token-123',
        user: {
          id: '1',
          username: 'client',
          email: 'client@example.com',
          role: 'user'
        }
      }
    });
  } else if (username === 'admin' && password === 'Admin123!') {
    res.json({
      success: true,
      data: {
        token: 'test-token-456',
        user: {
          id: '2',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    });
  }
});

// 测试用户注册
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  res.json({
    success: true,
    data: {
      token: 'test-token-789',
      user: {
        id: '3',
        username,
        email,
        role: 'user'
      }
    }
  });
});

// 测试获取用户信息
app.get('/api/users/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      username: 'client',
      email: 'client@example.com',
      role: 'user',
      createdAt: new Date().toISOString()
    }
  });
});

// 测试仪表盘数据
app.get('/api/dashboard/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      userCount: 100,
      transactionCount: 500,
      assetCount: 50,
      activeUsers: 80
    }
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API端点不存在',
    path: req.path
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

// 启动服务器
const PORT = process.env.PORT || 3002;

app.listen(PORT, function() {
  console.log('='.repeat(50));
  console.log('茶海虾王@金融交易所看板平台 - 测试服务器');
  console.log('='.repeat(50));
  console.log('服务器运行在端口:', PORT);
  console.log('API地址: http://localhost:' + PORT + '/api');
  console.log('健康检查: http://localhost:' + PORT + '/health');
  console.log('='.repeat(50));
});
