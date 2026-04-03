const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户ID不能为空']
  },
  action: {
    type: String,
    required: [true, '操作类型不能为空'],
    enum: [
      'login', 'logout', 'register', 'password_change', 'profile_update',
      'asset_buy', 'asset_sell', 'asset_transfer',
      'payment_create', 'payment_cancel', 'payment_refund',
      'api_request', 'api_error', 'rate_limit',
      'account_lock', 'account_unlock', 'account_suspend',
      'backup_create', 'backup_delete', 'data_export',
      'blacklist_add', 'blacklist_remove', 'blacklist_check'
    ]
  },
  resource: {
    type: String,
    maxlength: [255, '资源标识不能超过255个字符']
  },
  resourceType: {
    type: String,
    enum: ['user', 'asset', 'transaction', 'payment', 'backup', 'blacklist']
  },
  details: {
    type: Object,
    default: {}
  },
  ip: {
    type: String,
    required: [true, 'IP地址不能为空']
  },
  userAgent: {
    type: String,
    maxlength: [1000, '用户代理不能超过1000个字符']
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'other']
  },
  location: {
    type: String,
    maxlength: [255, '位置信息不能超过255个字符']
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'warning'],
    default: 'success'
  },
  errorMessage: {
    type: String,
    maxlength: [500, '错误信息不能超过500个字符']
  },
  duration: {
    type: Number,
    default: 0, // 操作持续时间（毫秒）
    min: [0, '持续时间不能为负数']
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// 索引
userActivitySchema.index({ user: 1 });
userActivitySchema.index({ action: 1 });
userActivitySchema.index({ status: 1 });
userActivitySchema.index({ createdAt: -1 });
userActivitySchema.index({ user: 1, action: 1 });
userActivitySchema.index({ user: 1, createdAt: -1 });
userActivitySchema.index({ ip: 1 });

// 静态方法：获取用户活动记录
userActivitySchema.statics.getUserActivities = function(userId, options) {
  options = options || {};
  var page = options.page || 1;
  var limit = options.limit || 50;
  var action = options.action;
  var status = options.status;
  var startDate = options.startDate;
  var endDate = options.endDate;
  
  var query = { user: userId };
  
  if (action) query.action = action;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  var skip = (page - 1) * limit;
  
  return Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query)
  ]).then(function(results) {
    var activities = results[0];
    var total = results[1];
    
    return {
      activities: activities,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    };
  });
};

// 静态方法：获取活动统计
userActivitySchema.statics.getActivityStats = function(userId, days = 7) {
  var startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { user: userId, createdAt: { $gte: startDate } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      count: { $sum: 1 },
      success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
      failure: { $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] } },
      warning: { $sum: { $cond: [{ $eq: ['$status', 'warning'] }, 1, 0] } },
      actions: { $push: '$action' }
    }},
    { $sort: { _id: 1 } }
  ]);
};

// 静态方法：获取热门操作
userActivitySchema.statics.getTopActions = function(userId, limit = 10) {
  return this.aggregate([
    { $match: { user: userId } },
    { $group: {
      _id: '$action',
      count: { $sum: 1 },
      success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
      failure: { $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] } }
    }},
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('UserActivity', userActivitySchema);
