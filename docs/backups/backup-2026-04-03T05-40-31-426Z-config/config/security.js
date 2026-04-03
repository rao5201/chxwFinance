/**
 * 茶海虾王@金融交易所看板平台 - 安全配置
 * 包含MongoDB和Redis的安全配置
 */

const crypto = require('crypto');

// MongoDB安全配置
const mongoSecurity = {
  // 启用认证
  auth: {
    enabled: true,
    mechanism: 'SCRAM-SHA-256',
    source: 'admin'
  },
  
  // SSL/TLS配置
  ssl: {
    enabled: process.env.MONGODB_SSL_ENABLED === 'true',
    ca: process.env.MONGODB_SSL_CA,
    cert: process.env.MONGODB_SSL_CERT,
    key: process.env.MONGODB_SSL_KEY,
    allowInvalidHostnames: false
  },
  
  // 连接安全配置
  options: {
    maxPoolSize: 50,
    minPoolSize: 10,
    maxIdleTimeMS: 60000,
    waitQueueTimeoutMS: 5000,
    serverSelectionTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority',
    wtimeoutMS: 5000,
    journal: true,
    readPreference: 'primaryPreferred'
  },
  
  // 网络安全配置
  network: {
    bindIp: '127.0.0.1', // 仅允许本地连接，生产环境应配置具体IP
    port: 27017,
    ipv6: false
  }
};

// Redis安全配置
const redisSecurity = {
  // 认证配置
  auth: {
    enabled: true,
    password: process.env.REDIS_PASSWORD,
    requirePass: true
  },
  
  // SSL/TLS配置
  tls: {
    enabled: process.env.REDIS_TLS_ENABLED === 'true',
    ca: process.env.REDIS_TLS_CA,
    cert: process.env.REDIS_TLS_CERT,
    key: process.env.REDIS_TLS_KEY,
    rejectUnauthorized: true
  },
  
  // 连接安全配置
  options: {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    enableOfflineQueue: true,
    connectTimeout: 10000,
    disconnectTimeout: 5000,
    commandTimeout: 5000,
    keepAlive: 30000,
    family: 4,
    // 禁用危险命令
    disableCommands: ['FLUSHDB', 'FLUSHALL', 'CONFIG', 'DEBUG', 'SHUTDOWN']
  },
  
  // 网络安全配置
  network: {
    bind: '127.0.0.1', // 仅允许本地连接
    port: 6379,
    protectedMode: 'yes',
    tcpKeepAlive: 300
  }
};

// 数据加密配置
const encryption = {
  // 敏感数据加密
  sensitiveData: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
    saltLength: 64,
    iterations: 100000,
    digest: 'sha512'
  },
  
  // 密钥管理
  keyManagement: {
    rotationInterval: 90 * 24 * 60 * 60 * 1000, // 90天轮换一次
    backupEnabled: true,
    hsmEnabled: process.env.HSM_ENABLED === 'true'
  }
};

// 审计日志配置
const auditLog = {
  enabled: true,
  events: [
    'auth.login',
    'auth.logout',
    'auth.failed',
    'data.access',
    'data.modify',
    'data.delete',
    'config.change',
    'security.alert'
  ],
  retention: 365 * 24 * 60 * 60 * 1000, // 保留365天
  storage: {
    type: 'file', // 或 'database', 'elasticsearch'
    path: './logs/audit.log',
    maxSize: '100MB',
    maxFiles: 10
  }
};

// 访问控制配置
const accessControl = {
  // IP白名单
  ipWhitelist: process.env.IP_WHITELIST?.split(',') || [],
  
  // 黑名单
  ipBlacklist: process.env.IP_BLACKLIST?.split(',') || [],
  
  // 地理位置限制
  geoRestriction: {
    enabled: process.env.GEO_RESTRICTION_ENABLED === 'true',
    allowedCountries: process.env.ALLOWED_COUNTRIES?.split(',') || []
  },
  
  // 时间限制
  timeRestriction: {
    enabled: process.env.TIME_RESTRICTION_ENABLED === 'true',
    allowedHours: {
      start: 6,  // 6:00 AM
      end: 22    // 10:00 PM
    },
    allowedDays: [1, 2, 3, 4, 5] // 周一到周五
  }
};

// 敏感数据掩码配置
const dataMasking = {
  // 身份证号掩码
  idCard: (value) => {
    if (!value || value.length < 8) return value;
    return value.substring(0, 4) + '****' + value.substring(value.length - 4);
  },
  
  // 银行卡号掩码
  bankCard: (value) => {
    if (!value || value.length < 8) return value;
    return value.substring(0, 4) + ' **** **** ' + value.substring(value.length - 4);
  },
  
  // 手机号掩码
  phone: (value) => {
    if (!value || value.length < 7) return value;
    return value.substring(0, 3) + '****' + value.substring(value.length - 4);
  },
  
  // 邮箱掩码
  email: (value) => {
    if (!value || !value.includes('@')) return value;
    const [local, domain] = value.split('@');
    const maskedLocal = local.substring(0, 2) + '***';
    return maskedLocal + '@' + domain;
  }
};

// 安全工具函数
const securityUtils = {
  // 生成安全随机字符串
  generateSecureToken: (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  },
  
  // 生成安全密钥
  generateSecureKey: () => {
    return crypto.randomBytes(32).toString('hex');
  },
  
  // 哈希敏感数据
  hashSensitiveData: (data, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(data);
    return hash.digest('hex');
  },
  
  // 加密敏感数据
  encryptSensitiveData: (data, key) => {
    const iv = crypto.randomBytes(encryption.sensitiveData.ivLength);
    const cipher = crypto.createCipheriv(
      encryption.sensitiveData.algorithm,
      Buffer.from(key, 'hex'),
      iv
    );
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  },
  
  // 解密敏感数据
  decryptSensitiveData: (encryptedData, key, iv, tag) => {
    const decipher = crypto.createDecipheriv(
      encryption.sensitiveData.algorithm,
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  },
  
  // 验证IP地址
  validateIpAddress: (ip) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  },
  
  // 检查IP是否在白名单中
  isIpWhitelisted: (ip) => {
    if (accessControl.ipWhitelist.length === 0) return true;
    return accessControl.ipWhitelist.includes(ip);
  },
  
  // 检查IP是否在黑名单中
  isIpBlacklisted: (ip) => {
    return accessControl.ipBlacklist.includes(ip);
  }
};

module.exports = {
  mongoSecurity,
  redisSecurity,
  encryption,
  auditLog,
  accessControl,
  dataMasking,
  securityUtils
};
