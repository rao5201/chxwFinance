/**
 * 安全加固配置模块
 * 实现密码加密、API权限控制、输入验证、安全日志和监控等功能
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { logger } = require('./logger');

// 安全配置
const securityConfig = {
  // 密码加密配置
  password: {
    saltRounds: 12, // 加密强度
    minLength: 8, // 最小密码长度
    requireUppercase: true, // 需要大写字母
    requireLowercase: true, // 需要小写字母
    requireNumbers: true, // 需要数字
    requireSymbols: true // 需要特殊符号
  },
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'HS256'
  },
  // API权限控制
  api: {
    requireAuth: true,
    roles: {
      admin: ['read', 'write', 'delete', 'admin'],
      user: ['read', 'write'],
      guest: ['read']
    }
  },
  // 输入验证
  validation: {
    enabled: true,
    strict: true
  },
  // 安全日志
  logging: {
    enabled: true,
    level: 'info',
    includeSensitiveData: false
  },
  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  // 速率限制
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 每个IP限制100个请求
    message: '请求过于频繁，请稍后再试'
  },
  // 敏感数据保护
  sensitiveData: {
    mask: true,
    maskLength: 4,
    sensitiveFields: ['password', 'creditCard', 'ssn', 'token', 'apiKey']
  }
};

// 密码工具类
class PasswordUtils {
  // 加密密码
  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(securityConfig.password.saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error('❌ 密码加密失败:', error.message);
      throw error;
    }
  }

  // 验证密码
  static async verifyPassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('❌ 密码验证失败:', error.message);
      throw error;
    }
  }

  // 验证密码强度
  static validatePasswordStrength(password) {
    if (!password || password.length < securityConfig.password.minLength) {
      return {
        valid: false,
        message: `密码长度至少为${securityConfig.password.minLength}个字符`
      };
    }

    if (securityConfig.password.requireUppercase && !/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: '密码必须包含至少一个大写字母'
      };
    }

    if (securityConfig.password.requireLowercase && !/[a-z]/.test(password)) {
      return {
        valid: false,
        message: '密码必须包含至少一个小写字母'
      };
    }

    if (securityConfig.password.requireNumbers && !/[0-9]/.test(password)) {
      return {
        valid: false,
        message: '密码必须包含至少一个数字'
      };
    }

    if (securityConfig.password.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return {
        valid: false,
        message: '密码必须包含至少一个特殊符号'
      };
    }

    return {
      valid: true,
      message: '密码强度符合要求'
    };
  }
}

// JWT工具类
class JWTUtils {
  // 生成token
  static generateToken(payload) {
    try {
      const token = jwt.sign(payload, securityConfig.jwt.secret, {
        expiresIn: securityConfig.jwt.expiresIn,
        algorithm: securityConfig.jwt.algorithm
      });
      return token;
    } catch (error) {
      console.error('❌ 生成token失败:', error.message);
      throw error;
    }
  }

  // 验证token
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, securityConfig.jwt.secret, {
        algorithms: [securityConfig.jwt.algorithm]
      });
      return decoded;
    } catch (error) {
      console.error('❌ 验证token失败:', error.message);
      throw error;
    }
  }

  // 解码token
  static decodeToken(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded;
    } catch (error) {
      console.error('❌ 解码token失败:', error.message);
      throw error;
    }
  }
}

// 权限控制工具类
class AuthUtils {
  // 验证权限
  static hasPermission(userRole, requiredPermission) {
    if (!securityConfig.api.roles[userRole]) {
      return false;
    }
    return securityConfig.api.roles[userRole].includes(requiredPermission);
  }

  // 生成权限中间件
  static requirePermission(permission) {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ success: false, message: '未提供认证令牌' });
        }

        const decoded = JWTUtils.verifyToken(token);
        const userRole = decoded.role || 'user';

        if (!AuthUtils.hasPermission(userRole, permission)) {
          return res.status(403).json({ success: false, message: '权限不足' });
        }

        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ success: false, message: '无效的认证令牌' });
      }
    };
  }

  // 生成认证中间件
  static authenticate() {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ success: false, message: '未提供认证令牌' });
        }

        const decoded = JWTUtils.verifyToken(token);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ success: false, message: '无效的认证令牌' });
      }
    };
  }
}

// 输入验证工具类
class ValidationUtils {
  // 验证输入
  static validate(schema, data) {
    if (!securityConfig.validation.enabled) {
      return { valid: true, data };
    }

    try {
      const result = schema.validate(data, {
        abortEarly: false,
        strict: securityConfig.validation.strict
      });

      if (result.error) {
        const errors = result.error.details.map(detail => detail.message);
        return {
          valid: false,
          errors
        };
      }

      return {
        valid: true,
        data: result.value
      };
    } catch (error) {
      console.error('❌ 输入验证失败:', error.message);
      return {
        valid: false,
        errors: [error.message]
      };
    }
  }

  // 验证用户注册
  static validateUserRegistration(data) {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(securityConfig.password.minLength).required(),
      role: Joi.string().valid('admin', 'user', 'guest').default('user')
    });

    return this.validate(schema, data);
  }

  // 验证用户登录
  static validateUserLogin(data) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    return this.validate(schema, data);
  }

  // 验证资产操作
  static validateAssetOperation(data) {
    const schema = Joi.object({
      assetType: Joi.string().required(),
      amount: Joi.number().positive().required(),
      price: Joi.number().positive().required(),
      transactionType: Joi.string().valid('buy', 'sell').required()
    });

    return this.validate(schema, data);
  }
}

// 安全日志工具类
class SecurityLogger {
  // 记录安全事件
  static log(event, data = {}) {
    if (!securityConfig.logging.enabled) {
      return;
    }

    // 屏蔽敏感数据
    const sanitizedData = this.sanitizeData(data);

    switch (securityConfig.logging.level) {
      case 'debug':
        logger.debug(`[安全] ${event}`, sanitizedData);
        break;
      case 'info':
        logger.info(`[安全] ${event}`, sanitizedData);
        break;
      case 'warn':
        logger.warn(`[安全] ${event}`, sanitizedData);
        break;
      case 'error':
        logger.error(`[安全] ${event}`, sanitizedData);
        break;
      default:
        logger.info(`[安全] ${event}`, sanitizedData);
    }
  }

  // 记录认证事件
  static logAuth(event, user, details = {}) {
    this.log(event, {
      userId: user._id || user.id,
      email: user.email,
      role: user.role,
      ...details
    });
  }

  // 记录访问事件
  static logAccess(req, event = '访问', details = {}) {
    this.log(event, {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      ...details
    });
  }

  // 屏蔽敏感数据
  static sanitizeData(data) {
    if (!securityConfig.sensitiveData.mask) {
      return data;
    }

    const sanitized = { ...data };

    securityConfig.sensitiveData.sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        const value = sanitized[field].toString();
        const maskLength = Math.min(securityConfig.sensitiveData.maskLength, value.length);
        const masked = '*'.repeat(value.length - maskLength) + value.slice(-maskLength);
        sanitized[field] = masked;
      }
    });

    return sanitized;
  }
}

// 安全防护工具类
class SecurityProtection {
  // 防止SQL注入
  static sanitizeSQL(input) {
    if (typeof input === 'string') {
      return input.replace(/[;\-\/*]/g, '');
    }
    return input;
  }

  // 防止XSS攻击
  static sanitizeXSS(input) {
    if (typeof input === 'string') {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    return input;
  }

  // 防止CSRF攻击
  static generateCSRFToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // 验证CSRF令牌
  static validateCSRFToken(token, sessionToken) {
    return token === sessionToken;
  }

  // 检查IP是否在黑名单中
  static isIPBlacklisted(ip) {
    // 这里可以实现IP黑名单检查逻辑
    const blacklistedIPs = process.env.BLACKLISTED_IPS?.split(',') || [];
    return blacklistedIPs.includes(ip);
  }

  // 检查用户代理是否可疑
  static isSuspiciousUserAgent(userAgent) {
    // 这里可以实现用户代理检查逻辑
    const suspiciousAgents = ['curl', 'wget', 'bot', 'spider'];
    return suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent));
  }
}

// 安全中间件
class SecurityMiddleware {
  // CORS中间件
  static cors() {
    return {
      origin: securityConfig.cors.origin,
      credentials: securityConfig.cors.credentials,
      methods: securityConfig.cors.methods,
      allowedHeaders: securityConfig.cors.allowedHeaders
    };
  }

  // 速率限制中间件
  static rateLimit() {
    const rateLimit = require('express-rate-limit');
    return rateLimit({
      windowMs: securityConfig.rateLimit.windowMs,
      max: securityConfig.rateLimit.max,
      message: securityConfig.rateLimit.message,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res, options) => {
        SecurityLogger.log('速率限制触发', {
          ip: req.ip,
          path: req.path,
          method: req.method
        });
        res.status(options.statusCode).json({ success: false, message: options.message });
      }
    });
  }

  // 安全头部中间件
  static securityHeaders() {
    return (req, res, next) => {
      // 设置安全头部
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:");
      
      next();
    };
  }

  // 输入验证中间件
  static validateInput(schema) {
    return (req, res, next) => {
      const data = { ...req.body, ...req.query, ...req.params };
      const validation = ValidationUtils.validate(schema, data);
      
      if (!validation.valid) {
        SecurityLogger.log('输入验证失败', {
          path: req.path,
          errors: validation.errors
        });
        return res.status(400).json({ success: false, message: '输入验证失败', errors: validation.errors });
      }
      
      // 更新请求数据为验证后的数据
      req.validatedData = validation.data;
      next();
    };
  }

  // 安全日志中间件
  static securityLogging() {
    return (req, res, next) => {
      // 记录请求开始
      SecurityLogger.logAccess(req, '请求开始');
      
      // 记录响应结束
      const originalSend = res.send;
      res.send = function(body) {
        // 记录响应状态
        SecurityLogger.logAccess(req, '请求结束', {
          status: res.statusCode,
          bodyLength: body?.length || 0
        });
        return originalSend.call(this, body);
      };
      
      next();
    };
  }

  // 防攻击中间件
  static antiAttack() {
    return (req, res, next) => {
      // 检查IP是否在黑名单中
      if (SecurityProtection.isIPBlacklisted(req.ip)) {
        SecurityLogger.log('黑名单IP访问', {
          ip: req.ip,
          path: req.path
        });
        return res.status(403).json({ success: false, message: '访问被拒绝' });
      }
      
      // 检查用户代理是否可疑
      if (SecurityProtection.isSuspiciousUserAgent(req.headers['user-agent'])) {
        SecurityLogger.log('可疑用户代理', {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          path: req.path
        });
        // 这里可以选择阻止或记录
      }
      
      // 清理输入数据
      if (req.body) {
        req.body = this.sanitizeInput(req.body);
      }
      if (req.query) {
        req.query = this.sanitizeInput(req.query);
      }
      if (req.params) {
        req.params = this.sanitizeInput(req.params);
      }
      
      next();
    };
  }

  // 清理输入数据
  static sanitizeInput(data) {
    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          sanitized[key] = SecurityProtection.sanitizeXSS(SecurityProtection.sanitizeSQL(data[key]));
        }
      }
      return sanitized;
    }
    return SecurityProtection.sanitizeXSS(SecurityProtection.sanitizeSQL(data));
  }
}

// 导出
module.exports = {
  // 配置
  securityConfig,
  
  // 工具类
  PasswordUtils,
  JWTUtils,
  AuthUtils,
  ValidationUtils,
  SecurityLogger,
  SecurityProtection,
  SecurityMiddleware,
  
  // 中间件
  authenticate: AuthUtils.authenticate(),
  requirePermission: AuthUtils.requirePermission,
  validateInput: SecurityMiddleware.validateInput,
  securityHeaders: SecurityMiddleware.securityHeaders(),
  securityLogging: SecurityMiddleware.securityLogging(),
  antiAttack: SecurityMiddleware.antiAttack(),
  rateLimit: SecurityMiddleware.rateLimit(),
  cors: SecurityMiddleware.cors()
};
