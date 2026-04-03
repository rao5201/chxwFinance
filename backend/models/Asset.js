const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '资产名称不能为空'],
    trim: true,
    maxlength: [100, '资产名称不能超过100个字符']
  },
  symbol: {
    type: String,
    required: [true, '资产代码不能为空'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, '资产代码不能超过20个字符']
  },
  type: {
    type: String,
    required: [true, '资产类型不能为空'],
    enum: ['emotional', 'experience', 'thought', 'memory', 'creative'],
    default: 'memory'
  },
  description: {
    type: String,
    maxlength: [1000, '描述不能超过1000个字符']
  },
  price: {
    type: Number,
    required: [true, '价格不能为空'],
    min: [0, '价格不能为负数'],
    default: 0
  },
  previousPrice: {
    type: Number,
    default: 0
  },
  marketCap: {
    type: Number,
    default: 0,
    min: [0, '市值不能为负数']
  },
  volume24h: {
    type: Number,
    default: 0,
    min: [0, '成交量不能为负数']
  },
  change24h: {
    type: Number,
    default: 0
  },
  changePercentage24h: {
    type: Number,
    default: 0
  },
  totalSupply: {
    type: Number,
    default: 0,
    min: [0, '总供应量不能为负数']
  },
  circulatingSupply: {
    type: Number,
    default: 0,
    min: [0, '流通量不能为负数']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'delisted'],
    default: 'active'
  },
  metadata: {
    image: String,
    tags: [String],
    category: String,
    source: String
  },
  priceHistory: [{
    price: Number,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// 索引
assetSchema.index({ symbol: 1 });
assetSchema.index({ type: 1 });
assetSchema.index({ price: -1 });
assetSchema.index({ marketCap: -1 });
assetSchema.index({ status: 1 });
assetSchema.index({ createdAt: -1 });

// 计算涨跌幅
assetSchema.methods.calculateChange = function() {
  if (this.previousPrice > 0) {
    this.change24h = this.price - this.previousPrice;
    this.changePercentage24h = (this.change24h / this.previousPrice) * 100;
  }
};

// 更新价格
assetSchema.methods.updatePrice = function(newPrice) {
  this.previousPrice = this.price;
  this.price = newPrice;
  this.calculateChange();
  
  // 添加价格历史
  this.priceHistory.push({
    price: newPrice,
    timestamp: new Date()
  });
  
  // 只保留最近100条价格记录
  if (this.priceHistory.length > 100) {
    this.priceHistory = this.priceHistory.slice(-100);
  }
  
  // 更新市值
  if (this.circulatingSupply > 0) {
    this.marketCap = this.price * this.circulatingSupply;
  }
};

// 获取资产信息（隐藏敏感字段）
assetSchema.methods.toJSON = function() {
  const assetObject = this.toObject();
  
  // 限制价格历史返回数量
  if (assetObject.priceHistory && assetObject.priceHistory.length > 20) {
    assetObject.priceHistory = assetObject.priceHistory.slice(-20);
  }
  
  return assetObject;
};

// 静态方法：获取热门资产
assetSchema.statics.getTopAssets = async function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ marketCap: -1 })
    .limit(limit)
    .select('-priceHistory');
};

// 静态方法：获取涨幅榜
assetSchema.statics.getGainers = async function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ changePercentage24h: -1 })
    .limit(limit)
    .select('-priceHistory');
};

// 静态方法：获取跌幅榜
assetSchema.statics.getLosers = async function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ changePercentage24h: 1 })
    .limit(limit)
    .select('-priceHistory');
};

module.exports = mongoose.model('Asset', assetSchema);
