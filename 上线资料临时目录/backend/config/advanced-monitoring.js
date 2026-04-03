/**
 * 茶海虾王@金融交易所看板平台 - 高级监控系统
 * 包含业务指标监控、用户行为分析、异常检测等功能
 */

const { logger } = require('./logger');

// 高级监控配置
const advancedMonitoringConfig = {
  // 业务指标监控
  businessMetrics: {
    enabled: true,
    metrics: [
      'user_registration',
      'user_login',
      'transaction_volume',
      'transaction_value',
      'payment_success_rate',
      'api_usage',
      'error_rate'
    ],
    interval: 60000 // 1分钟
  },
  
  // 用户行为分析
  userBehavior: {
    enabled: true,
    trackEvents: [
      'page_view',
      'button_click',
      'form_submit',
      'api_call',
      'error_occurred'
    ],
    sessionTimeout: 1800000 // 30分钟
  },
  
  // 异常检测
  anomalyDetection: {
    enabled: true,
    algorithms: ['statistical', 'machine_learning'],
    sensitivity: 'medium', // low, medium, high
    thresholds: {
      responseTime: 1000, // 1秒
      errorRate: 0.05, // 5%
      cpuUsage: 80, // 80%
      memoryUsage: 85 // 85%
    }
  },
  
  // 告警配置
  alerting: {
    enabled: true,
    channels: ['email', 'slack', 'webhook'],
    rules: [
      {
        name: 'high_error_rate',
        condition: 'error_rate > 0.05',
        severity: 'critical',
        cooldown: 300000 // 5分钟
      },
      {
        name: 'slow_api_response',
        condition: 'avg_response_time > 1000',
        severity: 'warning',
        cooldown: 600000 // 10分钟
      },
      {
        name: 'high_cpu_usage',
        condition: 'cpu_usage > 80',
        severity: 'warning',
        cooldown: 300000 // 5分钟
      }
    ]
  }
};

// 业务指标收集器
const businessMetricsCollector = {
  metrics: new Map(),
  
  // 记录指标
  record: (metricName, value, labels = {}) => {
    const timestamp = Date.now();
    const key = `${metricName}_${JSON.stringify(labels)}`;
    
    if (!businessMetricsCollector.metrics.has(key)) {
      businessMetricsCollector.metrics.set(key, []);
    }
    
    const data = businessMetricsCollector.metrics.get(key);
    data.push({
      value,
      timestamp,
      labels
    });
    
    // 只保留最近1小时的数据
    const oneHourAgo = timestamp - 3600000;
    const filtered = data.filter(d => d.timestamp > oneHourAgo);
    businessMetricsCollector.metrics.set(key, filtered);
  },
  
  // 获取指标统计
  getStats: (metricName, timeRange = 3600000) => {
    const now = Date.now();
    const startTime = now - timeRange;
    const stats = {
      count: 0,
      sum: 0,
      avg: 0,
      min: Infinity,
      max: 0,
      data: []
    };
    
    for (const [key, data] of businessMetricsCollector.metrics) {
      if (key.startsWith(metricName)) {
        const filtered = data.filter(d => d.timestamp > startTime);
        filtered.forEach(d => {
          stats.count++;
          stats.sum += d.value;
          stats.min = Math.min(stats.min, d.value);
          stats.max = Math.max(stats.max, d.value);
          stats.data.push(d);
        });
      }
    }
    
    if (stats.count > 0) {
      stats.avg = stats.sum / stats.count;
    }
    
    return stats;
  },
  
  // 获取所有指标
  getAllMetrics: () => {
    const result = {};
    for (const [key, data] of businessMetricsCollector.metrics) {
      result[key] = data;
    }
    return result;
  }
};

// 用户行为追踪器
const userBehaviorTracker = {
  sessions: new Map(),
  events: [],
  
  // 开始会话
  startSession: (userId, sessionId, metadata = {}) => {
    const session = {
      userId,
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      events: [],
      metadata
    };
    
    userBehaviorTracker.sessions.set(sessionId, session);
    logger.info(`用户会话开始: ${userId} - ${sessionId}`);
    
    return session;
  },
  
  // 记录事件
  trackEvent: (sessionId, eventType, eventData = {}) => {
    const session = userBehaviorTracker.sessions.get(sessionId);
    if (!session) {
      logger.warn(`会话不存在: ${sessionId}`);
      return;
    }
    
    const event = {
      type: eventType,
      data: eventData,
      timestamp: Date.now(),
      sessionId
    };
    
    session.events.push(event);
    session.lastActivity = Date.now();
    userBehaviorTracker.events.push(event);
    
    // 只保留最近24小时的事件
    const oneDayAgo = Date.now() - 86400000;
    userBehaviorTracker.events = userBehaviorTracker.events.filter(
      e => e.timestamp > oneDayAgo
    );
  },
  
  // 结束会话
  endSession: (sessionId) => {
    const session = userBehaviorTracker.sessions.get(sessionId);
    if (session) {
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
      logger.info(`用户会话结束: ${session.userId} - ${sessionId} - 时长: ${session.duration}ms`);
    }
  },
  
  // 获取用户行为分析
  getUserAnalytics: (userId, timeRange = 86400000) => {
    const now = Date.now();
    const startTime = now - timeRange;
    
    const userEvents = userBehaviorTracker.events.filter(
      e => e.timestamp > startTime && e.sessionId.startsWith(userId)
    );
    
    const analytics = {
      totalEvents: userEvents.length,
      eventTypes: {},
      sessionCount: 0,
      avgSessionDuration: 0,
      mostActiveHour: null
    };
    
    // 统计事件类型
    userEvents.forEach(event => {
      analytics.eventTypes[event.type] = (analytics.eventTypes[event.type] || 0) + 1;
    });
    
    // 统计活跃时段
    const hourCounts = {};
    userEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostActiveHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostActiveHour) {
      analytics.mostActiveHour = parseInt(mostActiveHour[0]);
    }
    
    return analytics;
  },
  
  // 清理过期会话
  cleanupSessions: () => {
    const now = Date.now();
    const timeout = advancedMonitoringConfig.userBehavior.sessionTimeout;
    
    for (const [sessionId, session] of userBehaviorTracker.sessions) {
      if (now - session.lastActivity > timeout) {
        userBehaviorTracker.endSession(sessionId);
        userBehaviorTracker.sessions.delete(sessionId);
      }
    }
  }
};

// 异常检测器
const anomalyDetector = {
  baselines: new Map(),
  anomalies: [],
  
  // 建立基线
  establishBaseline: (metricName, data) => {
    if (data.length < 10) return;
    
    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    anomalyDetector.baselines.set(metricName, {
      mean,
      stdDev,
      min: Math.min(...values),
      max: Math.max(...values),
      sampleSize: values.length,
      establishedAt: Date.now()
    });
  },
  
  // 检测异常
  detectAnomaly: (metricName, value) => {
    const baseline = anomalyDetector.baselines.get(metricName);
    if (!baseline) return { isAnomaly: false, confidence: 0 };
    
    const { mean, stdDev } = baseline;
    const zScore = Math.abs(value - mean) / stdDev;
    
    // 根据敏感度设置阈值
    let threshold = 2; // medium
    if (advancedMonitoringConfig.anomalyDetection.sensitivity === 'low') {
      threshold = 3;
    } else if (advancedMonitoringConfig.anomalyDetection.sensitivity === 'high') {
      threshold = 1.5;
    }
    
    const isAnomaly = zScore > threshold;
    const confidence = Math.min(zScore / threshold, 1);
    
    if (isAnomaly) {
      const anomaly = {
        metricName,
        value,
        expectedValue: mean,
        deviation: zScore,
        confidence,
        timestamp: Date.now(),
        severity: confidence > 0.8 ? 'critical' : confidence > 0.5 ? 'warning' : 'info'
      };
      
      anomalyDetector.anomalies.push(anomaly);
      
      // 只保留最近100个异常
      if (anomalyDetector.anomalies.length > 100) {
        anomalyDetector.anomalies.shift();
      }
      
      logger.warn(`检测到异常: ${metricName} = ${value} (预期: ${mean.toFixed(2)})`);
    }
    
    return { isAnomaly, confidence, zScore };
  },
  
  // 获取异常列表
  getAnomalies: (timeRange = 3600000, severity = null) => {
    const now = Date.now();
    const startTime = now - timeRange;
    
    let anomalies = anomalyDetector.anomalies.filter(a => a.timestamp > startTime);
    
    if (severity) {
      anomalies = anomalies.filter(a => a.severity === severity);
    }
    
    return anomalies;
  },
  
  // 分析趋势
  analyzeTrend: (metricName, data) => {
    if (data.length < 2) return { trend: 'stable', slope: 0 };
    
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
    const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    let trend = 'stable';
    if (slope > 0.1) trend = 'increasing';
    else if (slope < -0.1) trend = 'decreasing';
    
    return { trend, slope };
  }
};

// 告警管理器
const alertManager = {
  alerts: [],
  lastAlertTime: new Map(),
  
  // 检查告警规则
  checkRules: (metrics) => {
    if (!advancedMonitoringConfig.alerting.enabled) return;
    
    for (const rule of advancedMonitoringConfig.alerting.rules) {
      const shouldAlert = alertManager.evaluateCondition(rule.condition, metrics);
      
      if (shouldAlert) {
        const lastAlert = alertManager.lastAlertTime.get(rule.name) || 0;
        const now = Date.now();
        
        if (now - lastAlert > rule.cooldown) {
          alertManager.sendAlert(rule, metrics);
          alertManager.lastAlertTime.set(rule.name, now);
        }
      }
    }
  },
  
  // 评估条件
  evaluateCondition: (condition, metrics) => {
    try {
      // 简单的条件评估
      const parts = condition.split(' ');
      if (parts.length !== 3) return false;
      
      const [metric, operator, threshold] = parts;
      const value = metrics[metric];
      
      if (value === undefined) return false;
      
      switch (operator) {
        case '>': return value > parseFloat(threshold);
        case '<': return value < parseFloat(threshold);
        case '>=': return value >= parseFloat(threshold);
        case '<=': return value <= parseFloat(threshold);
        case '==': return value == parseFloat(threshold);
        case '!=': return value != parseFloat(threshold);
        default: return false;
      }
    } catch (error) {
      logger.error('评估告警条件失败:', error);
      return false;
    }
  },
  
  // 发送告警
  sendAlert: (rule, metrics) => {
    const alert = {
      rule: rule.name,
      severity: rule.severity,
      message: `告警: ${rule.name} - 条件: ${rule.condition}`,
      metrics,
      timestamp: Date.now()
    };
    
    alertManager.alerts.push(alert);
    
    // 只保留最近100个告警
    if (alertManager.alerts.length > 100) {
      alertManager.alerts.shift();
    }
    
    logger.error(`🚨 告警触发: ${rule.name} - 严重级别: ${rule.severity}`);
    
    // 这里可以集成邮件、Slack、Webhook等通知渠道
    alertManager.notifyChannels(alert);
  },
  
  // 通知渠道
  notifyChannels: (alert) => {
    const channels = advancedMonitoringConfig.alerting.channels;
    
    if (channels.includes('email')) {
      // 发送邮件通知
      logger.info(`发送邮件告警: ${alert.rule}`);
    }
    
    if (channels.includes('slack')) {
      // 发送Slack通知
      logger.info(`发送Slack告警: ${alert.rule}`);
    }
    
    if (channels.includes('webhook')) {
      // 发送Webhook通知
      logger.info(`发送Webhook告警: ${alert.rule}`);
    }
  },
  
  // 获取告警历史
  getAlertHistory: (timeRange = 86400000, severity = null) => {
    const now = Date.now();
    const startTime = now - timeRange;
    
    let alerts = alertManager.alerts.filter(a => a.timestamp > startTime);
    
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }
    
    return alerts;
  }
};

// 性能指标中间件
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // 记录请求开始
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // 记录API响应时间
    businessMetricsCollector.record('api_response_time', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
    
    // 记录API调用次数
    businessMetricsCollector.record('api_calls', 1, {
      method: req.method,
      path: req.path
    });
    
    // 记录错误
    if (res.statusCode >= 400) {
      businessMetricsCollector.record('api_errors', 1, {
        method: req.method,
        path: req.path,
        status: res.statusCode
      });
    }
    
    // 检测异常
    if (duration > advancedMonitoringConfig.anomalyDetection.thresholds.responseTime) {
      anomalyDetector.detectAnomaly('api_response_time', duration);
    }
  });
  
  next();
};

// 定期任务
const startMonitoring = () => {
  // 每5分钟清理过期会话
  setInterval(() => {
    userBehaviorTracker.cleanupSessions();
  }, 300000);
  
  // 每1分钟检查告警规则
  setInterval(() => {
    const metrics = {
      error_rate: calculateErrorRate(),
      avg_response_time: calculateAvgResponseTime(),
      cpu_usage: getCPUUsage(),
      memory_usage: getMemoryUsage()
    };
    
    alertManager.checkRules(metrics);
  }, 60000);
  
  logger.info('✅ 高级监控系统已启动');
};

// 辅助函数
const calculateErrorRate = () => {
  const errorStats = businessMetricsCollector.getStats('api_errors', 300000);
  const totalStats = businessMetricsCollector.getStats('api_calls', 300000);
  
  if (totalStats.count === 0) return 0;
  return errorStats.count / totalStats.count;
};

const calculateAvgResponseTime = () => {
  const stats = businessMetricsCollector.getStats('api_response_time', 300000);
  return stats.avg;
};

const getCPUUsage = () => {
  const usage = process.cpuUsage();
  return (usage.user + usage.system) / 1000000; // 转换为秒
};

const getMemoryUsage = () => {
  const used = process.memoryUsage();
  return (used.heapUsed / used.heapTotal) * 100;
};

// 导出模块
module.exports = {
  advancedMonitoringConfig,
  businessMetricsCollector,
  userBehaviorTracker,
  anomalyDetector,
  alertManager,
  metricsMiddleware,
  startMonitoring
};
