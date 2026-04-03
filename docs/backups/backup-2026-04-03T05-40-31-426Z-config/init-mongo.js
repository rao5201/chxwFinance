// MongoDB 初始化脚本
// 创建数据库、用户和索引

db = db.getSiblingDB('chxw_finance');

// 创建应用用户
db.createUser({
  user: 'chxw_app',
  pwd: 'App123!',
  roles: [
    { role: 'readWrite', db: 'chxw_finance' },
    { role: 'dbAdmin', db: 'chxw_finance' }
  ]
});

// 创建集合
db.createCollection('users');
db.createCollection('assets');
db.createCollection('transactions');
db.createCollection('userassets');
db.createCollection('aianalyses');
db.createCollection('useractivities');

// 创建索引
// Users 集合索引
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "createdAt": -1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "role": 1 });

// Assets 集合索引
db.assets.createIndex({ "symbol": 1 }, { unique: true });
db.assets.createIndex({ "type": 1 });
db.assets.createIndex({ "marketCap": -1 });
db.assets.createIndex({ "createdAt": -1 });

// Transactions 集合索引
db.transactions.createIndex({ "user": 1 });
db.transactions.createIndex({ "asset": 1 });
db.transactions.createIndex({ "status": 1 });
db.transactions.createIndex({ "createdAt": -1 });
db.transactions.createIndex({ "user": 1, "createdAt": -1 });

// UserAssets 集合索引
db.userassets.createIndex({ "user": 1 });
db.userassets.createIndex({ "asset": 1 });
db.userassets.createIndex({ "user": 1, "asset": 1 }, { unique: true });

// AIAnalyses 集合索引
db.aianalyses.createIndex({ "user": 1 });
db.aianalyses.createIndex({ "asset": 1 });
db.aianalyses.createIndex({ "createdAt": -1 });

// UserActivities 集合索引
db.useractivities.createIndex({ "user": 1 });
db.useractivities.createIndex({ "action": 1 });
db.useractivities.createIndex({ "status": 1 });
db.useractivities.createIndex({ "createdAt": -1 });
db.useractivities.createIndex({ "user": 1, "action": 1 });
db.useractivities.createIndex({ "user": 1, "createdAt": -1 });

// 插入初始数据
// 管理员用户
db.users.insertOne({
  username: 'admin',
  email: 'admin@chxw.com',
  password: '$2a$10$YourHashedPasswordHere', // 实际使用时需要哈希
  role: 'admin',
  status: 'active',
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 示例资产数据
db.assets.insertMany([
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'cryptocurrency',
    description: '比特币',
    currentPrice: 45000,
    marketCap: 880000000000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'cryptocurrency',
    description: '以太坊',
    currentPrice: 3000,
    marketCap: 360000000000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    description: '苹果公司',
    currentPrice: 175,
    marketCap: 2800000000000,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MongoDB 初始化完成！');
