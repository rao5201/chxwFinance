const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户ID不能为空']
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, '资产ID不能为空']
  },
  type: {
    type: String,
    required: [true, '交易类型不能为空'],
    enum: ['buy', 'sell'],
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, '交易价格不能为空'],
    min: [0, '价格不能为负数']
  },
  quantity: {
    type: Number,
    required: [true, '交易数量不能为空'],
    min: [0.00000001, '数量必须大于0']
  },
  total: {
    type: Number,
    required: [true, '交易总额不能为空'],
    min: [0, '总额不能为负数']
  },
  fee: {
    type: Number,
    default: 0,
    min: [0, '手续费不能为负数']
  },
  feePercentage: {
    type: Number,
    default: 0.1,
    min: [0, '费率不能为负数'],
    max: [10, '费率不能超过10%']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['balance', 'wallet', 'external'],
    default: 'balance'
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  relatedTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  notes: {
    type: String,
    maxlength: [500, '备注不能超过500个字符']
  },
  metadata: {
    ip: String,
    userAgent: String,
    device: String,
    location: String
  },
  processedAt: Date,
  completedAt: Date,
  failedAt: Date,
  cancelledAt: Date,
  failureReason: String
}, {
  timestamps: true
});

// 索引
transactionSchema.index({ user: 1 });
transactionSchema.index({ asset: 1 });
transactionSchema.index({ orderNumber: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ asset: 1, createdAt: -1 });

// 生成订单号
transactionSchema.statics.generateOrderNumber = function() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
};

// 计算手续费
transactionSchema.methods.calculateFee = function() {
  this.fee = this.total * (this.feePercentage / 100);
  return this.fee;
};

// 保存前计算总额和手续费
transactionSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('quantity')) {
    this.total = this.price * this.quantity;
    this.calculateFee();
  }
  
  if (!this.orderNumber) {
    this.orderNumber = Transaction.generateOrderNumber();
  }
  
  next();
});

// 交易完成
transactionSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  this.processedAt = new Date();
  return this.save();
};

// 交易失败
transactionSchema.methods.fail = function(reason) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.processedAt = new Date();
  this.failureReason = reason;
  return this.save();
};

// 取消交易
transactionSchema.methods.cancel = function() {
  if (this.status === 'pending') {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('只能取消待处理的交易'));
};

// 获取交易摘要
transactionSchema.methods.getSummary = function() {
  return {
    orderNumber: this.orderNumber,
    type: this.type,
    asset: this.asset,
    price: this.price,
    quantity: this.quantity,
    total: this.total,
    fee: this.fee,
    status: this.status,
    createdAt: this.createdAt,
    completedAt: this.completedAt
  };
};

// 静态方法：获取用户的交易历史
transactionSchema.statics.getUserTransactions = function(userId, options) {
  options = options || {};
  var page = options.page || 1;
  var limit = options.limit || 20;
  var type = options.type;
  var status = options.status;
  var startDate = options.startDate;
  var endDate = options.endDate;
  
  var query = { user: userId };
  
  if (type) query.type = type;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  var skip = (page - 1) * limit;
  
  return Promise.all([
    this.find(query)
      .populate('asset', 'name symbol price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query)
  ]).then(function(results) {
    var transactions = results[0];
    var total = results[1];
    
    return {
      transactions: transactions,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    };
  });
};

// 静态方法：获取资产的交易历史
transactionSchema.statics.getAssetTransactions = function(assetId, options) {
  options = options || {};
  var page = options.page || 1;
  var limit = options.limit || 20;
  var skip = (page - 1) * limit;
  
  return Promise.all([
    this.find({ asset: assetId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments({ asset: assetId })
  ]).then(function(results) {
    var transactions = results[0];
    var total = results[1];
    
    return {
      transactions: transactions,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    };
  });
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
