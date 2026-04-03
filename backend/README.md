# 茶海虾王@金融交易所看板平台 - 后端API

## 项目概述

茶海虾王@金融交易所看板平台后端API服务，基于Node.js + Express构建，支持内存数据库和Redis缓存，集成了金融数据接口、支付系统、AI分析工具和数据加密功能。

## 技术栈

- **Node.js** v18+ - 运行环境
- **Express.js** v4.18+ - Web框架
- **内存数据库** - 临时数据存储
- **MongoDB** - 生产环境数据库
- **内存Redis** - 临时缓存
- **Redis** - 生产环境缓存
- **JWT** - 身份认证
- **bcryptjs** - 密码加密
- **Socket.io** - 实时通信
- **cheerio** - 网站数据抓取
- **axios** - HTTP请求
- **crypto** - 数据加密
- **Mongoose** - MongoDB ORM
- **Prometheus** - 监控
- **Grafana** - 可视化
- **Docker** - 容器化
- **Nginx** - 反向代理

## 项目结构

```
backend/
├── config/             # 配置文件
│   ├── database.js     # 内存数据库配置
│   ├── redis.js        # 内存Redis配置
│   ├── mongodb.js      # MongoDB配置
│   ├── financeAPI.js   # 金融数据API配置
│   ├── payment.js      # 支付系统配置
│   ├── security.js     # 安全配置（加密解密）
│   ├── logger.js       # 日志配置
│   ├── ai-tools-integration.js # AI工具集成配置
│   ├── performance.js  # 性能优化配置
│   ├── backup.js       # 备份配置
│   └── advanced-monitoring.js # 高级监控配置
├── controllers/        # 控制器
├── middleware/         # 中间件
├── models/             # 数据模型
│   ├── User.js         # 用户模型
│   ├── Asset.js        # 资产模型
│   ├── Transaction.js  # 交易模型
│   ├── UserAsset.js    # 用户资产模型
│   ├── AIAnalysis.js   # AI分析模型
│   ├── UserActivity.js # 用户活动模型
│   └── index.js        # 模型导出
├── routes/             # API路由
│   ├── auth.js         # 认证路由
│   ├── users.js        # 用户路由
│   ├── assets.js       # 资产路由
│   ├── transactions.js # 交易路由
│   ├── market.js       # 市场路由
│   ├── ai.js           # AI分析路由
│   ├── payment.js      # 支付路由
│   ├── dashboard.js    # 仪表盘路由
│   └── auto-collection.js # 自动数据收集路由
├── scripts/            # 脚本文件
│   ├── test-data-integration.js # 数据接入测试脚本
│   └── check-database-connections.js # 数据库连接检查脚本
├── test/               # 测试文件
│   ├── batch-register-test.js # 批量注册测试
│   ├── init-test-accounts.js # 初始化测试账号
│   ├── test-data-integration.js # 数据集成测试
│   └── deploy-production.js # 生产环境部署测试
├── tools/              # 工具文件
│   ├── auto-fix.js     # 自动修复工具
│   └── error-tracker.js # 错误追踪工具
├── backups/            # 备份文件
├── logs/               # 日志文件
├── deploy/             # 部署配置
│   ├── README.md       # 部署说明
│   ├── deploy.sh       # 部署脚本
│   ├── backup.sh       # 备份脚本
│   ├── ecosystem.config.json # PM2配置
│   ├── nginx.conf      # Nginx配置
│   ├── mongod.conf     # MongoDB配置
│   ├── redis.conf      # Redis配置
│   └── setup-ssl.sh    # SSL设置脚本
├── server.js           # 主服务器文件
├── test-server.js      # 测试服务器文件
├── package.json        # 项目依赖
├── package-lock.json   # 依赖锁文件
├── .env                # 环境变量
├── .env.production     # 生产环境变量
├── Dockerfile          # Docker配置
├── prometheus.yml      # Prometheus配置
├── grafana.ini         # Grafana配置
├── nginx.conf          # Nginx配置
├── security-audit.md   # 安全审计报告
├── dashboard.json      # 仪表盘配置
├── deploy.bat          # Windows部署脚本
├── deploy.sh           # Linux部署脚本
└── README.md           # 项目说明
```

## 安装和运行

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，配置以下参数：

```env
PORT=3002
MONGODB_URI=mongodb://admin:Admin123!@localhost:27017/chxw_finance?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=YourSuperSecretJWTKeyChangeInProduction
JWT_REFRESH_SECRET=YourRefreshSecretKeyChangeInProduction
NODE_ENV=development
LOG_LEVEL=info
```

### 3. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start

# 测试服务器
node test-server.js
```

### 4. Docker部署

```bash
# 构建和启动容器
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## API端点

### 认证相关

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/refresh | 刷新令牌 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户信息 |

### 用户相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/users/profile | 获取用户信息 |
| PUT | /api/users/profile | 更新用户信息 |
| GET | /api/users/balance | 获取用户余额 |

### 资产相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/assets | 获取资产列表 |
| GET | /api/assets/:id | 获取资产详情 |
| POST | /api/assets | 创建资产 |

### 交易相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/transactions | 获取交易列表 |
| POST | /api/transactions | 创建交易 |
| GET | /api/transactions/:id | 获取交易详情 |

### 市场相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/market/overview | 获取市场行情 |
| GET | /api/market/price/:symbol | 获取资产价格 |
| GET | /api/market/kline/:symbol | 获取K线数据 |

### AI分析相关

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/ai/analyze | AI分析 |
| GET | /api/ai/history | 获取分析历史 |
| GET | /api/ai/suggestions | 获取分析建议 |

### 支付相关

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/payment/create | 创建支付 |
| GET | /api/payment/status/:paymentId | 支付状态 |
| POST | /api/payment/cancel/:paymentId | 取消支付 |
| POST | /api/payment/refund/:paymentId | 退款 |
| GET | /api/payment/methods | 支付方式 |

### 仪表盘相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/dashboard/overview | 系统概览 |
| GET | /api/dashboard/users/analysis | 用户分析 |
| GET | /api/dashboard/transactions/analysis | 交易分析 |
| GET | /api/dashboard/assets/analysis | 资产分析 |
| GET | /api/dashboard/activities | 操作记录 |
| GET | /api/dashboard/activities/stats | 操作统计 |
| GET | /api/dashboard/portfolio | 个人资产组合 |
| GET | /api/dashboard/health | 系统健康状态 |
| GET | /api/dashboard/export | 数据导出 |

### 系统相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /health | 健康检查 |
| GET | /api/database/status | 数据库状态 |
| GET | /metrics | 监控指标 |

## 数据模型

### User (用户)

- username: 用户名
- email: 邮箱
- password: 密码（加密）
- balance: 余额
- role: 角色 (user/admin/finance/audit)
- status: 状态 (active/inactive/suspended)

### Asset (资产)

- name: 资产名称
- symbol: 资产代码
- type: 资产类型
- price: 当前价格
- marketCap: 市值
- volume24h: 24小时成交量
- change24h: 24小时涨跌幅

### Transaction (交易)

- user: 用户ID
- asset: 资产ID
- type: 交易类型 (buy/sell)
- price: 交易价格
- quantity: 交易数量
- total: 交易总额
- fee: 手续费
- status: 交易状态

### UserActivity (用户活动)

- userId: 用户ID
- action: 操作类型 (login/register/trade/api)
- details: 操作详情
- ip: IP地址
- userAgent: 用户代理
- timestamp: 操作时间
- status: 操作状态

## 安全特性

- JWT身份认证
- 密码bcrypt加密
- 请求限流
- Helmet安全头部
- CORS跨域配置
- 登录失败锁定机制
- AES-256-GCM加密算法
- 32字节密钥生成
- 敏感数据掩码

## 测试账号

### 管理员账号
- 用户名: admin
- 密码: Admin123!
- 邮箱: admin@example.com
- 角色: admin

### 客户账号
- 用户名: client
- 密码: Client123!
- 邮箱: client@example.com
- 角色: user

### 财务审计账号
- 用户名: finance
- 密码: Finance123!
- 邮箱: finance@example.com
- 角色: finance

## 开发团队

海南茶海虾王管理有限责任公司

技术支持：rao5201@126.com
