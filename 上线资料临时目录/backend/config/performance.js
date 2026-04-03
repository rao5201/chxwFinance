/**
 * 性能优化配置模块
 * 实现缓存机制、数据库查询优化、响应式编程、资源压缩和负载均衡等功能
 */

const redis = require('redis');
const LRU = require('lru-cache');
const compression = require('compression');
const { logger } = require('./logger');

// 缓存配置
const cacheConfig = {
  // Redis缓存配置
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 0
  },
  // 内存缓存配置
  memory: {
    enabled: process.env.MEMORY_CACHE_ENABLED === 'true',
    max: 1000, // 最大缓存项数
    maxAge: 1000 * 60 * 5, // 缓存过期时间（5分钟）
    updateAgeOnGet: true // 访问时更新过期时间
  }
};

// 数据库优化配置
const databaseOptimization = {
  // 查询缓存
  queryCache: {
    enabled: process.env.QUERY_CACHE_ENABLED === 'true',
    ttl: 1000 * 60 * 2 // 缓存时间（2分钟）
  },
  // 连接池配置
  connectionPool: {
    max: 10, // 最大连接数
    min: 2, // 最小连接数
    acquireTimeout: 30000, // 获取连接超时时间
    idleTimeout: 60000 // 空闲连接超时时间
  },
  // 索引优化
  indexes: {
    users: ['email', 'username'],
    assets: ['userId', 'assetType'],
    transactions: ['userId', 'assetType', 'transactionType', 'timestamp'],
    qr_codes: ['qrId', 'status', 'createdAt']
  }
};

// 响应式编程配置
const reactiveProgramming = {
  // 并行处理
  parallelProcessing: {
    enabled: process.env.PARALLEL_PROCESSING_ENABLED === 'true',
    maxConcurrent: 10 // 最大并发数
  },
  // 批量处理
  batchProcessing: {
    enabled: process.env.BATCH_PROCESSING_ENABLED === 'true',
    batchSize: 100 // 批处理大小
  }
};

// 资源压缩配置
const resourceCompression = {
  enabled: process.env.RESOURCE_COMPRESSION_ENABLED === 'true',
  level: 6, // 压缩级别（0-9）
  threshold: 1024, // 压缩阈值（1KB）
  filter: (req, res) => {
    // 只压缩特定类型的响应
    const contentType = res.getHeader('Content-Type');
    return /text|json|javascript|css|xml/.test(contentType);
  }
};

// 负载均衡配置
const loadBalancing = {
  enabled: process.env.LOAD_BALANCING_ENABLED === 'true',
  strategy: process.env.LOAD_BALANCING_STRATEGY || 'round-robin', // 负载均衡策略
  servers: process.env.LOAD_BALANCING_SERVERS ? process.env.LOAD_BALANCING_SERVERS.split(',') : [],
  healthCheck: {
    enabled: true,
    interval: 30000, // 健康检查间隔（30秒）
    timeout: 5000 // 健康检查超时（5秒）
  }
};

// 缓存管理器
class CacheManager {
  constructor() {
    this.redisClient = null;
    this.memoryCache = null;
    this.init();
  }

  // 初始化缓存
  async init() {
    // 初始化内存缓存
    if (cacheConfig.memory.enabled) {
      this.memoryCache = new LRU({
        max: cacheConfig.memory.max,
        maxAge: cacheConfig.memory.maxAge,
        updateAgeOnGet: cacheConfig.memory.updateAgeOnGet
      });
      console.log('✅ 内存缓存初始化完成');
    }

    // 初始化Redis缓存
    if (cacheConfig.redis.enabled) {
      try {
        this.redisClient = redis.createClient({
          url: `redis://${cacheConfig.redis.host}:${cacheConfig.redis.port}`,
          password: cacheConfig.redis.password,
          database: cacheConfig.redis.db
        });

        this.redisClient.on('error', (error) => {
          console.error('❌ Redis连接错误:', error.message);
        });

        this.redisClient.on('connect', () => {
          console.log('✅ Redis连接成功');
        });

        await this.redisClient.connect();
        console.log('✅ Redis缓存初始化完成');
      } catch (error) {
        console.error('❌ Redis初始化失败:', error.message);
        this.redisClient = null;
      }
    }
  }

  // 设置缓存
  async set(key, value, ttl = 300) { // 默认5分钟
    try {
      // 先设置内存缓存
      if (this.memoryCache) {
        this.memoryCache.set(key, value);
      }

      // 再设置Redis缓存
      if (this.redisClient) {
        await this.redisClient.set(key, JSON.stringify(value), {
          EX: ttl
        });
      }
      return true;
    } catch (error) {
      console.error('❌ 设置缓存失败:', error.message);
      return false;
    }
  }

  // 获取缓存
  async get(key) {
    try {
      // 先从内存缓存获取
      if (this.memoryCache) {
        const memoryValue = this.memoryCache.get(key);
        if (memoryValue) {
          return memoryValue;
        }
      }

      // 再从Redis缓存获取
      if (this.redisClient) {
        const redisValue = await this.redisClient.get(key);
        if (redisValue) {
          const parsedValue = JSON.parse(redisValue);
          // 更新内存缓存
          if (this.memoryCache) {
            this.memoryCache.set(key, parsedValue);
          }
          return parsedValue;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ 获取缓存失败:', error.message);
      return null;
    }
  }

  // 删除缓存
  async del(key) {
    try {
      // 从内存缓存删除
      if (this.memoryCache) {
        this.memoryCache.del(key);
      }

      // 从Redis缓存删除
      if (this.redisClient) {
        await this.redisClient.del(key);
      }
      return true;
    } catch (error) {
      console.error('❌ 删除缓存失败:', error.message);
      return false;
    }
  }

  // 清除所有缓存
  async clear() {
    try {
      // 清除内存缓存
      if (this.memoryCache) {
        this.memoryCache.reset();
      }

      // 清除Redis缓存
      if (this.redisClient) {
        await this.redisClient.flushDB();
      }
      return true;
    } catch (error) {
      console.error('❌ 清除缓存失败:', error.message);
      return false;
    }
  }

  // 缓存键生成器
  generateKey(prefix, ...args) {
    return `${prefix}:${args.join(':')}`;
  }
}

// 数据库优化工具
class DatabaseOptimizer {
  constructor() {
    this.queryCache = new Map();
  }

  // 优化查询
  optimizeQuery(query, params = {}) {
    // 生成查询缓存键
    const cacheKey = this.generateQueryKey(query, params);

    // 检查查询缓存
    if (databaseOptimization.queryCache.enabled) {
      const cachedResult = this.queryCache.get(cacheKey);
      if (cachedResult && Date.now() - cachedResult.timestamp < databaseOptimization.queryCache.ttl) {
        return cachedResult.result;
      }
    }

    // 这里可以添加更多查询优化逻辑，如：
    // 1. 优化SQL语句
    // 2. 添加索引提示
    // 3. 重写复杂查询

    return null; // 没有缓存结果
  }

  // 缓存查询结果
  cacheQueryResult(query, params, result) {
    if (databaseOptimization.queryCache.enabled) {
      const cacheKey = this.generateQueryKey(query, params);
      this.queryCache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });

      // 清理过期缓存
      this.cleanExpiredCache();
    }
  }

  // 生成查询缓存键
  generateQueryKey(query, params) {
    return `${query}:${JSON.stringify(params)}`;
  }

  // 清理过期缓存
  cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp >= databaseOptimization.queryCache.ttl) {
        this.queryCache.delete(key);
      }
    }
  }

  // 获取连接池配置
  getConnectionPoolConfig() {
    return databaseOptimization.connectionPool;
  }

  // 获取索引配置
  getIndexConfig() {
    return databaseOptimization.indexes;
  }
}

// 响应式编程工具
class ReactiveProgramming {
  // 并行处理
  async parallel(tasks) {
    if (!reactiveProgramming.parallelProcessing.enabled) {
      return await Promise.all(tasks);
    }

    // 限制并发数
    const maxConcurrent = reactiveProgramming.parallelProcessing.maxConcurrent;
    const results = [];
    const queue = [...tasks];

    while (queue.length > 0) {
      const batch = queue.splice(0, maxConcurrent);
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);
    }

    return results;
  }

  // 批量处理
  async batch(items, batchSize, processor) {
    if (!reactiveProgramming.batchProcessing.enabled) {
      return await processor(items);
    }

    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }

    return results;
  }

  // 防抖
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 节流
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// 负载均衡器
class LoadBalancer {
  constructor() {
    this.servers = loadBalancing.servers;
    this.currentIndex = 0;
    this.healthStatus = new Map();
    this.initHealthCheck();
  }

  // 初始化健康检查
  initHealthCheck() {
    if (loadBalancing.healthCheck.enabled) {
      setInterval(() => {
        this.checkServerHealth();
      }, loadBalancing.healthCheck.interval);
    }
  }

  // 检查服务器健康状态
  async checkServerHealth() {
    for (const server of this.servers) {
      try {
        const response = await fetch(`${server}/health`, {
          timeout: loadBalancing.healthCheck.timeout
        });
        this.healthStatus.set(server, response.ok);
      } catch (error) {
        this.healthStatus.set(server, false);
      }
    }
  }

  // 获取下一个服务器
  getNextServer() {
    if (!loadBalancing.enabled || this.servers.length === 0) {
      return null;
    }

    // 根据策略选择服务器
    switch (loadBalancing.strategy) {
      case 'round-robin':
        return this.roundRobin();
      case 'random':
        return this.random();
      case 'least-connections':
        return this.leastConnections();
      default:
        return this.roundRobin();
    }
  }

  // 轮询策略
  roundRobin() {
    const healthyServers = this.servers.filter(server => 
      this.healthStatus.get(server) !== false
    );

    if (healthyServers.length === 0) {
      return this.servers[0]; // 回退到第一个服务器
    }

    const server = healthyServers[this.currentIndex % healthyServers.length];
    this.currentIndex++;
    return server;
  }

  // 随机策略
  random() {
    const healthyServers = this.servers.filter(server => 
      this.healthStatus.get(server) !== false
    );

    if (healthyServers.length === 0) {
      return this.servers[0]; // 回退到第一个服务器
    }

    const randomIndex = Math.floor(Math.random() * healthyServers.length);
    return healthyServers[randomIndex];
  }

  // 最少连接策略（简化版）
  leastConnections() {
    // 这里可以实现更复杂的最少连接数逻辑
    // 简化版：使用轮询策略
    return this.roundRobin();
  }
}

// 性能监控工具
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTime = new Map();
  }

  // 开始监控
  start(name) {
    this.startTime.set(name, Date.now());
  }

  // 结束监控
  end(name) {
    const startTime = this.startTime.get(name);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.startTime.delete(name);
      
      // 更新指标
      if (!this.metrics.has(name)) {
        this.metrics.set(name, {
          count: 0,
          total: 0,
          min: Infinity,
          max: 0,
          avg: 0
        });
      }

      const metric = this.metrics.get(name);
      metric.count++;
      metric.total += duration;
      metric.min = Math.min(metric.min, duration);
      metric.max = Math.max(metric.max, duration);
      metric.avg = metric.total / metric.count;

      this.metrics.set(name, metric);
      return duration;
    }
    return 0;
  }

  // 获取指标
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // 重置指标
  resetMetrics() {
    this.metrics.clear();
  }

  // 记录指标
  logMetrics() {
    const metrics = this.getMetrics();
    console.log('📊 性能指标:', JSON.stringify(metrics, null, 2));
  }
}

// 导出
const cacheManager = new CacheManager();
const databaseOptimizer = new DatabaseOptimizer();
const reactiveProgrammer = new ReactiveProgramming();
const loadBalancer = new LoadBalancer();
const performanceMonitor = new PerformanceMonitor();

module.exports = {
  // 配置
  cacheConfig,
  databaseOptimization,
  reactiveProgramming,
  resourceCompression,
  loadBalancing,
  
  // 工具类
  CacheManager,
  DatabaseOptimizer,
  ReactiveProgramming,
  LoadBalancer,
  PerformanceMonitor,
  
  // 实例
  cacheManager,
  databaseOptimizer,
  reactiveProgrammer,
  loadBalancer,
  performanceMonitor,
  
  // 中间件
  compression: compression({
    level: resourceCompression.level,
    threshold: resourceCompression.threshold,
    filter: resourceCompression.filter
  })
};
