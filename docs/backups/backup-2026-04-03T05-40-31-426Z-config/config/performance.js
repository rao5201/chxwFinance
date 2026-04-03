/**
 * 性能优化配置
 * 包含缓存策略、数据库优化、压缩等
 */

const NodeCache = require('node-cache');

// 缓存配置
const cacheConfig = {
  // 内存缓存
  memoryCache: new NodeCache({
    stdTTL: 600, // 10分钟
    checkperiod: 120, // 2分钟检查一次
    useClones: false
  }),
  
  // Redis缓存配置
  redisCache: {
    enabled: true,
    ttl: 3600, // 1小时
    prefix: 'chxw:'
  },
  
  // 缓存键前缀
  keyPrefixes: {
    user: 'user:',
    asset: 'asset:',
    transaction: 'txn:',
    market: 'market:',
    analysis: 'analysis:'
  }
};

// 数据库优化配置
const dbOptimization = {
  // 连接池配置
  connectionPool: {
    min: 5,
    max: 20,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
  },
  
  // 查询优化
  queryOptimization: {
    maxLimit: 1000,
    defaultLimit: 50,
    timeout: 30000
  },
  
  // 索引优化提示
  indexHints: {
    users: ['email', 'username', 'createdAt'],
    assets: ['symbol', 'type', 'marketCap'],
    transactions: ['user', 'asset', 'status', 'createdAt'],
    userAssets: ['user', 'asset']
  }
};

// 压缩配置
const compressionConfig = {
  // Gzip压缩
  gzip: {
    enabled: true,
    level: 6,
    threshold: 1024, // 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return true;
    }
  },
  
  // Brotli压缩
  brotli: {
    enabled: true,
    level: 4
  }
};

// 静态资源优化
const staticOptimization = {
  // 缓存控制
  cacheControl: {
    images: 'public, max-age=31536000', // 1年
    css: 'public, max-age=31536000',
    js: 'public, max-age=31536000',
    fonts: 'public, max-age=31536000',
    html: 'public, max-age=3600' // 1小时
  },
  
  // ETag配置
  etag: true,
  
  // 最后修改时间
  lastModified: true
};

// API响应优化
const apiOptimization = {
  // 分页配置
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    maxOffset: 10000
  },
  
  // 字段选择
  fieldSelection: {
    enabled: true,
    defaultFields: ['_id', 'createdAt', 'updatedAt']
  },
  
  // 数据序列化
  serialization: {
    removeEmpty: true,
    trimStrings: true,
    formatDates: true
  }
};

// 性能监控
const performanceMonitoring = {
  // 响应时间阈值
  responseTimeThresholds: {
    warning: 500, // 500ms
    critical: 2000 // 2s
  },
  
  // 内存使用阈值
  memoryThresholds: {
    warning: 512 * 1024 * 1024, // 512MB
    critical: 1024 * 1024 * 1024 // 1GB
  },
  
  // CPU使用阈值
  cpuThresholds: {
    warning: 70, // 70%
    critical: 90 // 90%
  }
};

// 缓存管理器
class CacheManager {
  constructor() {
    this.memoryCache = cacheConfig.memoryCache;
    this.redisEnabled = cacheConfig.redisCache.enabled;
  }

  // 获取缓存
  async get(key) {
    // 先尝试内存缓存
    let value = this.memoryCache.get(key);
    
    if (value === undefined && this.redisEnabled) {
      // 尝试Redis缓存
      try {
        value = await global.cache.get(key);
        if (value) {
          // 回填内存缓存
          this.memoryCache.set(key, value);
        }
      } catch (error) {
        console.error('Redis缓存获取失败:', error);
      }
    }
    
    return value;
  }

  // 设置缓存
  async set(key, value, ttl = null) {
    // 设置内存缓存
    this.memoryCache.set(key, value, ttl);
    
    // 设置Redis缓存
    if (this.redisEnabled) {
      try {
        await global.cache.set(key, value, ttl || cacheConfig.redisCache.ttl);
      } catch (error) {
        console.error('Redis缓存设置失败:', error);
      }
    }
  }

  // 删除缓存
  async del(key) {
    this.memoryCache.del(key);
    
    if (this.redisEnabled) {
      try {
        await global.cache.del(key);
      } catch (error) {
        console.error('Redis缓存删除失败:', error);
      }
    }
  }

  // 清空缓存
  async flush() {
    this.memoryCache.flushAll();
    
    if (this.redisEnabled) {
      try {
        await global.cache.flush();
      } catch (error) {
        console.error('Redis缓存清空失败:', error);
      }
    }
  }

  // 获取缓存统计
  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      redis: this.redisEnabled ? 'enabled' : 'disabled'
    };
  }
}

// 性能优化中间件
const performanceMiddleware = {
  // 响应时间监控
  responseTime: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const threshold = performanceMonitoring.responseTimeThresholds;
      
      if (duration > threshold.critical) {
        console.warn(`⚠️ 响应时间过慢: ${req.method} ${req.path} - ${duration}ms`);
      } else if (duration > threshold.warning) {
        console.log(`⏱️ 响应时间警告: ${req.method} ${req.path} - ${duration}ms`);
      }
    });
    
    next();
  },

  // 缓存控制
  cacheControl: (maxAge = 3600) => {
    return (req, res, next) => {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
      next();
    };
  },

  // 数据压缩
  compression: require('compression')(compressionConfig.gzip),

  // 请求限制
  rateLimit: require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 100个请求
    message: '请求过于频繁，请稍后再试'
  })
};

// 数据库查询优化器
class QueryOptimizer {
  constructor() {
    this.defaultLimit = dbOptimization.queryOptimization.defaultLimit;
    this.maxLimit = dbOptimization.queryOptimization.maxLimit;
  }

  // 优化查询选项
  optimizeQueryOptions(options = {}) {
    const optimized = {
      ...options,
      limit: Math.min(options.limit || this.defaultLimit, this.maxLimit),
      skip: options.skip || 0,
      sort: options.sort || { createdAt: -1 }
    };

    // 添加查询超时
    if (!options.maxTimeMS) {
      optimized.maxTimeMS = dbOptimization.queryOptimization.timeout;
    }

    return optimized;
  }

  // 优化聚合管道
  optimizeAggregation(pipeline) {
    // 添加索引提示
    const optimized = [...pipeline];
    
    // 在$match阶段后添加$sort以利用索引
    const matchIndex = optimized.findIndex(stage => stage.$match);
    if (matchIndex !== -1 && matchIndex < optimized.length - 1) {
      const nextStage = optimized[matchIndex + 1];
      if (!nextStage.$sort) {
        optimized.splice(matchIndex + 1, 0, { $sort: { _id: 1 } });
      }
    }

    return optimized;
  }

  // 生成查询缓存键
  generateCacheKey(model, query, options) {
    const keyData = {
      model: model.modelName || model,
      query: JSON.stringify(query),
      options: JSON.stringify(options)
    };
    
    return `query:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }
}

// 导出
module.exports = {
  cacheConfig,
  dbOptimization,
  compressionConfig,
  staticOptimization,
  apiOptimization,
  performanceMonitoring,
  CacheManager,
  QueryOptimizer,
  performanceMiddleware
};
