const mongoose = require('mongoose');

const userAssetSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: [true, '持有数量不能为空'],
    min: [0, '数量不能为负数'],
    default: 0
  },
  averageCost: {
    type: Number,
    default: 0,
    min: [0, '平均成本不能为负数']
  },
  totalCost: {
    type: Number,
    default: 0,
    min: [0, '总成本不能为负数']
  },
  currentValue: {
    type: Number,
    default: 0
  },
  profitLoss: {
    type: Number,
    default: 0
  },
  profitLossPercentage: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  firstPurchaseDate: Date,
  lastPurchaseDate: Date,
  status: {
    type: String,
    enum: ['active', 'sold', 'frozen'],
    default: 'active'
  }
}, {
  timestamps: true
});

// 复合索引确保唯一性
userAssetSchema.index({ user: 1, asset: 1 }, { unique: true });
userAssetSchema.index({ user: 1 });
userAssetSchema.index({ asset: 1 });
userAssetSchema.index({ status: 1 });

// 计算盈亏
userAssetSchema.methods.calculateProfitLoss = function(currentPrice) {
  this.currentValue = this.quantity * currentPrice;
  
  if (this.totalCost > 0) {
    this.profitLoss = this.currentValue - this.totalCost;
    this.profitLossPercentage = (this.profitLoss / this.totalCost) * 100;
  }
};

// 买入资产
userAssetSchema.methods.buy = function(quantity, price, transactionId) {
  var cost = quantity * price;
  
  // 更新平均成本
  var totalQuantity = this.quantity + quantity;
  var totalCost = this.totalCost + cost;
  
  if (totalQuantity > 0) {
    this.averageCost = totalCost / totalQuantity;
  }
  
  this.quantity = totalQuantity;
  this.totalCost = totalCost;
  
  // 记录交易
  this.transactions.push(transactionId);
  
  // 更新日期
  if (!this.firstPurchaseDate) {
    this.firstPurchaseDate = new Date();
  }
  this.lastPurchaseDate = new Date();
  
  // 更新状态
  if (this.quantity > 0) {
    this.status = 'active';
  }
};

// 卖出资产
userAssetSchema.methods.sell = function(quantity, price, transactionId) {
  if (quantity > this.quantity) {
    throw new Error('卖出数量超过持有数量');
  }
  
  this.quantity -= quantity;
  
  // 按比例减少总成本
  const costReduction = (quantity / (this.quantity + quantity)) * this.totalCost;
  this.totalCost -= costReduction;
  
  // 记录交易
  this.transactions.push(transactionId);
  
  // 如果全部卖出，更新状态
  if (this.quantity === 0) {
    this.status = 'sold';
    this.averageCost = 0;
    this.totalCost = 0;
  }
};

// 静态方法：获取用户资产组合
userAssetSchema.statics.getUserPortfolio = function(userId) {
  return this.find({ user: userId, status: 'active' })
    .populate('asset', 'name symbol price change24h changePercentage24h')
    .sort({ currentValue: -1 })
    .exec()
    .then(function(portfolio) {
      // 计算总资产价值
      var totalValue = 0;
      var totalCost = 0;
      
      portfolio.forEach(function(item) {
        item.calculateProfitLoss(item.asset.price);
        totalValue += item.currentValue;
        totalCost += item.totalCost;
      });
      
      var totalProfitLoss = totalValue - totalCost;
      var totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
      
      return {
        assets: portfolio,
        summary: {
          totalValue: totalValue,
          totalCost: totalCost,
          totalProfitLoss: totalProfitLoss,
          totalProfitLossPercentage: totalProfitLossPercentage,
          assetCount: portfolio.length
        }
      };
    });
};

module.exports = mongoose.model('UserAsset', userAssetSchema);
