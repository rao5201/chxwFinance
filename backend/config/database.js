/**
 * 数据库配置文件
 * 整合内存数据库、MongoDB、Redis和MySQL配置
 */

const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

// 内存存储数据库配置（临时解决方案）
const memoryStore = {
  users: [],
  assets: [],
  transactions: [],
  userAssets: [],
  aiAnalyses: [],
  userActivities: []
};

// 模拟ID生成
let idCounter = 1;
const generateId = function() {
  return (idCounter++).toString();
};

// 内存Redis配置（临时解决方案）
const memoryCache = {};
const cacheExpiration = {};

// MongoDB连接配置
const mongodbConfig = {
  // 连接字符串
  uri: process.env.MONGODB_URI || 'mongodb://admin:Admin123!@localhost:27017/chxw_finance?authSource=admin',
  
  // 连接选项
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
  },
  
  // 连接状态
  connected: false,
  connection: null
};

// MySQL 5.7连接配置
const mysqlConfig = {
  // 连接参数
  host: process.env.MYSQL_HOST || 'rm-bp1m4fy8d66u3c6xmbo.mysql.rds.aliyuncs.com',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE || 'cli_5834297',
  user: process.env.MYSQL_USER || 'cli_5834297',
  password: process.env.MYSQL_PASSWORD || '5d827532e2ce4fd30851a385423da013',
  
  // 连接选项
  options: {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: false
  },
  
  // 连接池
  pool: null,
  connected: false
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

// Redis操作函数
const redisOperations = {
  // 设置键值对
  set: function(key, value, expiration) {
    return new Promise(function(resolve) {
      memoryCache[key] = value;
      if (expiration) {
        cacheExpiration[key] = Date.now() + (expiration * 1000);
      }
      resolve(true);
    });
  },
  
  // 获取值
  get: function(key) {
    return new Promise(function(resolve) {
      // 检查是否过期
      if (cacheExpiration[key] && cacheExpiration[key] < Date.now()) {
        delete memoryCache[key];
        delete cacheExpiration[key];
        resolve(null);
        return;
      }
      resolve(memoryCache[key] || null);
    });
  },
  
  // 删除键
  del: function(key) {
    return new Promise(function(resolve) {
      delete memoryCache[key];
      delete cacheExpiration[key];
      resolve(true);
    });
  },
  
  // 检查键是否存在
  exists: function(key) {
    return new Promise(function(resolve) {
      // 检查是否过期
      if (cacheExpiration[key] && cacheExpiration[key] < Date.now()) {
        delete memoryCache[key];
        delete cacheExpiration[key];
        resolve(false);
        return;
      }
      resolve(key in memoryCache);
    });
  },
  
  // 设置过期时间
  expire: function(key, seconds) {
    return new Promise(function(resolve) {
      if (key in memoryCache) {
        cacheExpiration[key] = Date.now() + (seconds * 1000);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
};

// 连接MongoDB
async function connectMongoDB() {
  try {
    console.log('🚀 正在连接MongoDB...');
    
    // 连接数据库
    const connection = await mongoose.connect(mongodbConfig.uri, mongodbConfig.options);
    
    mongodbConfig.connected = true;
    mongodbConfig.connection = connection;
    
    console.log('✅ MongoDB连接成功');
    console.log(`   - 数据库: ${connection.connection.name}`);
    console.log(`   - 主机: ${connection.connection.host}`);
    console.log(`   - 端口: ${connection.connection.port}`);
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message);
    mongodbConfig.connected = false;
    mongodbConfig.connection = null;
    
    // 在开发环境中，使用内存数据库作为备用
    console.warn('⚠️ 切换到内存数据库作为临时解决方案');
    return null;
  }
}

// 断开MongoDB连接
async function disconnectMongoDB() {
  try {
    if (mongodbConfig.connection) {
      await mongodbConfig.connection.disconnect();
      console.log('✅ MongoDB连接已断开');
    }
  } catch (error) {
    console.error('❌ 断开MongoDB连接失败:', error.message);
  }
  
  mongodbConfig.connected = false;
  mongodbConfig.connection = null;
}

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

// 初始化Redis
const initRedis = function() {
  console.log('🚀 正在初始化内存Redis...');
  console.log('✅ 内存Redis初始化完成');
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
      aiAnalyses: memoryStore.aiAnalyses.length,
      userActivities: memoryStore.userActivities.length
    }
  };
};

// 检查MongoDB连接状态
function checkMongoDBStatus() {
  return {
    connected: mongodbConfig.connected,
    uri: mongodbConfig.uri,
    options: mongodbConfig.options
  };
}

// 连接MySQL
async function connectMySQL() {
  try {
    console.log('🚀 正在连接MySQL...');
    
    // 创建连接池
    const pool = mysql.createPool({
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      database: mysqlConfig.database,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      ...mysqlConfig.options
    });
    
    // 测试连接
    const connection = await pool.getConnection();
    console.log('✅ MySQL连接成功');
    console.log(`   - 数据库: ${mysqlConfig.database}`);
    console.log(`   - 主机: ${mysqlConfig.host}`);
    console.log(`   - 端口: ${mysqlConfig.port}`);
    connection.release();
    
    mysqlConfig.pool = pool;
    mysqlConfig.connected = true;
    
    // 检查现有表结构
    await checkMySQLTables(pool);
    
    return pool;
  } catch (error) {
    console.error('❌ MySQL连接失败:', error.message);
    mysqlConfig.connected = false;
    mysqlConfig.pool = null;
    
    // 在开发环境中，使用内存数据库作为备用
    console.warn('⚠️ 切换到内存数据库作为临时解决方案');
    return null;
  }
}

// 检查MySQL表结构
async function checkMySQLTables(pool) {
  try {
    console.log('🚀 正在检查MySQL表结构...');
    
    // 检查码的基本信息表
    const [codesResult] = await pool.execute(`
      SHOW TABLES LIKE 'codes'
    `);
    
    // 检查表单数据表
    const [formsResult] = await pool.execute(`
      SHOW TABLES LIKE 'form_data'
    `);
    
    // 检查批量子码表
    const [batchCodesResult] = await pool.execute(`
      SHOW TABLES LIKE 'batch_codes'
    `);
    
    // 检查码的状态表
    const [codeStatusResult] = await pool.execute(`
      SHOW TABLES LIKE 'code_status'
    `);
    
    // 检查计划完成情况表
    const [planResult] = await pool.execute(`
      SHOW TABLES LIKE 'plan_progress'
    `);
    
    // 检查二维码表
    const [qrCodesResult] = await pool.execute(`
      SHOW TABLES LIKE 'qr_codes'
    `);
    
    console.log('✅ MySQL表结构检查完成');
    console.log(`   - 码的基本信息表: ${codesResult.length > 0 ? '存在' : '不存在'}`);
    console.log(`   - 表单数据表: ${formsResult.length > 0 ? '存在' : '不存在'}`);
    console.log(`   - 批量子码表: ${batchCodesResult.length > 0 ? '存在' : '不存在'}`);
    console.log(`   - 码的状态表: ${codeStatusResult.length > 0 ? '存在' : '不存在'}`);
    console.log(`   - 计划完成情况表: ${planResult.length > 0 ? '存在' : '不存在'}`);
    console.log(`   - 二维码表: ${qrCodesResult.length > 0 ? '存在' : '不存在'}`);
    
  } catch (error) {
    console.error('❌ MySQL表结构检查失败:', error.message);
  }
}

// MySQL操作函数
const mysqlOperations = {
  // 执行查询
  query: async function(sql, params) {
    if (!mysqlConfig.pool) {
      throw new Error('MySQL连接未初始化');
    }
    
    try {
      const [results] = await mysqlConfig.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('MySQL查询失败:', error.message);
      throw error;
    }
  },
  
  // 插入数据
  insert: async function(table, data) {
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await mysqlConfig.pool.execute(sql, values);
    
    return {
      id: result.insertId,
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
  },
  
  // 查询数据
  find: async function(table, conditions = {}) {
    let sql = `SELECT * FROM ${table}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(field => `${field} = ?`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    return await mysqlOperations.query(sql, params);
  },
  
  // 查询单个数据
  findOne: async function(table, conditions) {
    const results = await mysqlOperations.find(table, conditions);
    return results[0] || null;
  },
  
  // 更新数据
  update: async function(table, conditions, data) {
    const setClause = Object.keys(data).map(field => `${field} = ?`).join(', ');
    const params = [...Object.values(data), ...Object.values(conditions)];
    
    const whereClause = Object.keys(conditions).map(field => `${field} = ?`).join(' AND ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    
    await mysqlConfig.pool.execute(sql, params);
    return true;
  },
  
  // 删除数据
  delete: async function(table, conditions) {
    const whereClause = Object.keys(conditions).map(field => `${field} = ?`).join(' AND ');
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    
    await mysqlConfig.pool.execute(sql, Object.values(conditions));
    return true;
  }
};

// 检查MySQL连接状态
function checkMySQLStatus() {
  return {
    connected: mysqlConfig.connected,
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    database: mysqlConfig.database,
    user: mysqlConfig.user
  };
}

// 断开MySQL连接
async function disconnectMySQL() {
  try {
    if (mysqlConfig.pool) {
      await mysqlConfig.pool.end();
      console.log('✅ MySQL连接已断开');
    }
  } catch (error) {
    console.error('❌ 断开MySQL连接失败:', error.message);
  }
  
  mysqlConfig.connected = false;
  mysqlConfig.pool = null;
}

// 草料二维码OpenAPI配置
const草料二维码OpenAPI = {
  name: 'chxw_finance',
  type: 'OpenAPI',
  apiKey: '6qIR8HxpQDPnlmYgPex9aMnfyaINV9oT6DOAUM8IDcQ=',
  baseUrl: 'https://cli.im/api',
  createTime: '2026-04-03 15:39:25'
};

// 草料二维码对接
const qrCodeIntegration = {
  // 生成二维码
  generateQRCode: async function(data, type = 'url') {
    console.log('🚀 正在生成二维码...');
    
    try {
      // 调用草料二维码OpenAPI
      const axios = require('axios');
      const response = await axios.post(`${草料二维码OpenAPI.baseUrl}/qrcode/create`, {
        data: data,
        type: type,
        size: 300,
        margin: 1
      }, {
        headers: {
          'Authorization': `Bearer ${草料二维码OpenAPI.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const qrId = `qr_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const qrUrl = response.data.data.qrUrl || `https://cli.im/api/qrcode/create?data=${encodeURIComponent(JSON.stringify(data))}&type=${type}`;
      
      // 保存到数据库
      try {
        if (mysqlConfig.connected) {
          await mysqlOperations.insert('qr_codes', {
            qr_id: qrId,
            url: qrUrl,
            content: JSON.stringify(data),
            type: type,
            created_by: 1 // 默认管理员
          });
        } else {
          // 保存到内存数据库
          memoryStore.qrCodes = memoryStore.qrCodes || [];
          memoryStore.qrCodes.push({
            _id: generateId(),
            qr_id: qrId,
            url: qrUrl,
            content: JSON.stringify(data),
            type: type,
            status: 'active',
            scan_count: 0,
            created_by: 1,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      } catch (error) {
        console.warn('⚠️ MySQL写入失败，切换到内存数据库:', error.message);
        // 保存到内存数据库
        memoryStore.qrCodes = memoryStore.qrCodes || [];
        memoryStore.qrCodes.push({
          _id: generateId(),
          qr_id: qrId,
          url: qrUrl,
          content: JSON.stringify(data),
          type: type,
          status: 'active',
          scan_count: 0,
          created_by: 1,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      
      console.log('✅ 二维码生成成功');
      return {
        qrId: qrId,
        qrUrl: qrUrl,
        data: data
      };
    } catch (error) {
      console.error('❌ 草料二维码API调用失败:', error.message);
      // 降级到模拟实现
      const qrId = `qr_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const qrUrl = `https://cli.im/api/qrcode/create?data=${encodeURIComponent(JSON.stringify(data))}&type=${type}`;
      
      // 保存到内存数据库
      memoryStore.qrCodes = memoryStore.qrCodes || [];
      memoryStore.qrCodes.push({
        _id: generateId(),
        qr_id: qrId,
        url: qrUrl,
        content: JSON.stringify(data),
        type: type,
        status: 'active',
        scan_count: 0,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      console.log('⚠️ 使用模拟实现生成二维码');
      return {
        qrId: qrId,
        qrUrl: qrUrl,
        data: data
      };
    }
  },
  
  // 获取二维码信息
  getQRCode: async function(qrId) {
    try {
      if (mysqlConfig.connected) {
        const qrCode = await mysqlOperations.findOne('qr_codes', { qr_id: qrId });
        if (qrCode) {
          // 增加扫码次数
          await mysqlOperations.update('qr_codes', { qr_id: qrId }, {
            scan_count: qrCode.scan_count + 1
          });
          return qrCode;
        }
      }
    } catch (error) {
      console.warn('⚠️ MySQL查询失败，切换到内存数据库:', error.message);
    }
    
    // 从内存数据库获取
    memoryStore.qrCodes = memoryStore.qrCodes || [];
    const qrCode = memoryStore.qrCodes.find(item => item.qr_id === qrId);
    if (qrCode) {
      // 增加扫码次数
      qrCode.scan_count = (qrCode.scan_count || 0) + 1;
      qrCode.updated_at = new Date();
    }
    return qrCode;
  },
  
  // 更新二维码状态
  updateQRCodeStatus: async function(qrId, status) {
    try {
      if (mysqlConfig.connected) {
        await mysqlOperations.update('qr_codes', { qr_id: qrId }, { status: status });
        return true;
      }
    } catch (error) {
      console.warn('⚠️ MySQL更新失败，切换到内存数据库:', error.message);
    }
    
    // 更新内存数据库
    memoryStore.qrCodes = memoryStore.qrCodes || [];
    const qrCode = memoryStore.qrCodes.find(item => item.qr_id === qrId);
    if (qrCode) {
      qrCode.status = status;
      qrCode.updated_at = new Date();
      return true;
    }
    return false;
  },
  
  // 获取二维码列表
  getQRCodeList: async function(filters = {}) {
    try {
      if (mysqlConfig.connected) {
        return await mysqlOperations.find('qr_codes', filters);
      }
    } catch (error) {
      console.warn('⚠️ MySQL查询失败，切换到内存数据库:', error.message);
    }
    
    // 从内存数据库获取
    memoryStore.qrCodes = memoryStore.qrCodes || [];
    let qrCodes = [...memoryStore.qrCodes];
    
    // 应用过滤条件
    Object.keys(filters).forEach(key => {
      qrCodes = qrCodes.filter(item => item[key] === filters[key]);
    });
    
    return qrCodes;
  }
};

// 检查Redis状态
const checkRedisStatus = function() {
  return {
    connected: true,
    memoryCache: true,
    keys: Object.keys(memoryCache).length
  };
};

// 导出
module.exports = {
  // 内存数据库
  initDatabase,
  checkDatabaseStatus,
  dbOperations,
  memoryStore,
  
  // MongoDB
  connectMongoDB,
  disconnectMongoDB,
  checkMongoDBStatus,
  mongodbConfig,
  mongoose,
  
  // MySQL
  connectMySQL,
  disconnectMySQL,
  checkMySQLStatus,
  mysqlConfig,
  mysqlOperations,
  
  // Redis
  initRedis,
  redisOperations,
  checkRedisStatus,
  memoryCache,
  
  // 二维码集成
  qrCodeIntegration
};
