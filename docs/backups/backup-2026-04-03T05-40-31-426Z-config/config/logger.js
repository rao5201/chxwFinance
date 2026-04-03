const fs = require('fs');
const path = require('path');

// 日志目录
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志文件路径
const logFile = path.join(logDir, 'server.log');

// 日志级别
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

// 当前日志级别
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];

// 日志格式
const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const levelStr = level.toUpperCase();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${levelStr}] ${message}${metaStr}`;
};

// 写入日志到文件
const writeToFile = (logMessage) => {
  fs.appendFile(logFile, logMessage + '\n', (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// 日志记录器
const logger = {
  debug: (message, meta = {}) => {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      const logMessage = formatLog('debug', message, meta);
      console.log(logMessage);
      writeToFile(logMessage);
    }
  },
  
  info: (message, meta = {}) => {
    if (currentLevel <= LOG_LEVELS.INFO) {
      const logMessage = formatLog('info', message, meta);
      console.log(logMessage);
      writeToFile(logMessage);
    }
  },
  
  warn: (message, meta = {}) => {
    if (currentLevel <= LOG_LEVELS.WARN) {
      const logMessage = formatLog('warn', message, meta);
      console.warn(logMessage);
      writeToFile(logMessage);
    }
  },
  
  error: (message, meta = {}) => {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      const logMessage = formatLog('error', message, meta);
      console.error(logMessage);
      writeToFile(logMessage);
    }
  },
  
  fatal: (message, meta = {}) => {
    if (currentLevel <= LOG_LEVELS.FATAL) {
      const logMessage = formatLog('fatal', message, meta);
      console.error(logMessage);
      writeToFile(logMessage);
    }
  }
};

// 日志中间件
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  // 重写send方法以捕获响应信息
  res.send = function(body) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel](`${req.method} ${req.path} ${statusCode} ${duration}ms`, {
      method: req.method,
      path: req.path,
      status: statusCode,
      duration: duration,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = {
  logger,
  loggerMiddleware
};
