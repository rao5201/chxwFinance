// 内存存储数据库配置（临时解决方案）

// 内存存储
const memoryStore = {
  users: [],
  assets: [],
  transactions: [],
  userAssets: [],
  aiAnalyses: []
};

// 模拟ID生成
let idCounter = 1;
const generateId = function() {
  return (idCounter++).toString();
};

// 数据库操作
const dbOperations = {
  // 插入数据
  insert: function(collection, data) {
    const item = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryStore[collection].push(item);
    return item;
  },
  
  // 查找数据
  find: function(collection, query) {
    return memoryStore[collection].filter(function(item) {
      for (let key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },
  
  // 查找单个数据
  findOne: function(collection, query) {
    return memoryStore[collection].find(function(item) {
      for (let key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },
  
  // 更新数据
  update: function(collection, query, update) {
    const item = dbOperations.findOne(collection, query);
    if (item) {
      Object.assign(item, update, { updatedAt: new Date() });
      return item;
    }
    return null;
  },
  
  // 删除数据
  delete: function(collection, query) {
    const index = memoryStore[collection].findIndex(function(item) {
      for (let key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
    if (index !== -1) {
      memoryStore[collection].splice(index, 1);
      return true;
    }
    return false;
  },
  
  // 获取所有数据
  findAll: function(collection) {
    return memoryStore[collection];
  },
  
  // 清空集合
  clear: function(collection) {
    memoryStore[collection] = [];
  }
};

// 数据库初始化
const initDatabase = function() {
  console.log('🚀 正在初始化内存数据库...');
  
  // 初始化默认数据
  if (memoryStore.users.length === 0) {
    // 创建默认管理员账户
    dbOperations.insert('users', {
      username: 'admin',
      email: 'admin@example.com',
      password: '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password
      balance: 1000000,
      role: 'admin',
      status: 'active'
    });
    
    // 创建测试用户
    dbOperations.insert('users', {
      username: 'test',
      email: 'test@example.com',
      password: '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password
      balance: 10000,
      role: 'user',
      status: 'active'
    });
  }
  
  if (memoryStore.assets.length === 0) {
    // 创建测试资产
    const assets = [
      {
        name: '比特币',
        symbol: 'BTC',
        type: 'memory',
        price: 42000,
        marketCap: 800000000000,
        volume24h: 15000000000,
        change24h: 2.5,
        changePercentage24h: 0.5,
        creator: '1'
      },
      {
        name: '以太坊',
        symbol: 'ETH',
        type: 'memory',
        price: 2100,
        marketCap: 250000000000,
        volume24h: 8000000000,
        change24h: -1.2,
        changePercentage24h: -0.3,
        creator: '1'
      },
      {
        name: '币安币',
        symbol: 'BNB',
        type: 'memory',
        price: 300,
        marketCap: 50000000000,
        volume24h: 2000000000,
        change24h: 0.8,
        changePercentage24h: 0.2,
        creator: '1'
      }
    ];
    
    assets.forEach(function(asset) {
      dbOperations.insert('assets', asset);
    });
  }
  
  console.log('✅ 内存数据库初始化完成');
};

// 数据库状态检查
const checkDatabaseStatus = function() {
  return {
    connected: true,
    memoryStore: true,
    collections: {
      users: memoryStore.users.length,
      assets: memoryStore.assets.length,
      transactions: memoryStore.transactions.length,
      userAssets: memoryStore.userAssets.length,
      aiAnalyses: memoryStore.aiAnalyses.length
    }
  };
};

module.exports = {
  initDatabase,
  checkDatabaseStatus,
  dbOperations,
  memoryStore
};
