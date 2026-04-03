// 内存存储Redis配置（临时解决方案）

// 内存存储
const memoryCache = {};
const cacheExpiration = {};

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

// 初始化Redis
const initRedis = function() {
  console.log('🚀 正在初始化内存Redis...');
  console.log('✅ 内存Redis初始化完成');
};

// 检查Redis状态
const checkRedisStatus = function() {
  return {
    connected: true,
    memoryCache: true,
    keys: Object.keys(memoryCache).length
  };
};

module.exports = {
  initRedis,
  redisOperations,
  checkRedisStatus,
  memoryCache
};
