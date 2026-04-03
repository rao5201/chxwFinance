const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户ID不能为空']
  },
  type: {
    type: String,
    required: [true, '分析类型不能为空'],
    enum: ['market_trend', 'asset_analysis', 'portfolio_analysis', 'price_prediction', 'risk_assessment', 'custom'],
    default: 'custom'
  },
  prompt: {
    type: String,
    required: [true, '分析请求不能为空'],
    maxlength: [2000, '请求内容不能超过2000个字符']
  },
  result: {
    type: String,
    required: [true, '分析结果不能为空']
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  },
  metadata: {
    model: String,
    tokensUsed: Number,
    processingTime: Number,
    confidence: Number
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  errorMessage: String,
  processedAt: Date,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  }
}, {
  timestamps: true
});

// 索引
aiAnalysisSchema.index({ user: 1 });
aiAnalysisSchema.index({ type: 1 });
aiAnalysisSchema.index({ status: 1 });
aiAnalysisSchema.index({ createdAt: -1 });
aiAnalysisSchema.index({ user: 1, createdAt: -1 });

// 完成分析
aiAnalysisSchema.methods.complete = function(result, metadata) {
  metadata = metadata || {};
  this.status = 'completed';
  this.result = result;
  
  // 合并metadata
  var mergedMetadata = {};
  if (this.metadata) {
    for (var key in this.metadata) {
      if (this.metadata.hasOwnProperty(key)) {
        mergedMetadata[key] = this.metadata[key];
      }
    }
  }
  for (var key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      mergedMetadata[key] = metadata[key];
    }
  }
  this.metadata = mergedMetadata;
  
  this.processedAt = new Date();
  return this.save();
};

// 标记失败
aiAnalysisSchema.methods.fail = function(errorMessage) {
  this.status = 'failed';
  this.errorMessage = errorMessage;
  this.processedAt = new Date();
  return this.save();
};

// 添加评分
aiAnalysisSchema.methods.addRating = function(score, feedback) {
  this.rating = {
    score: score,
    feedback: feedback,
    ratedAt: new Date()
  };
  return this.save();
};

// 静态方法：获取用户分析历史
aiAnalysisSchema.statics.getUserHistory = function(userId, options) {
  options = options || {};
  var page = options.page || 1;
  var limit = options.limit || 20;
  var type = options.type;
  var skip = (page - 1) * limit;
  
  var query = { user: userId };
  if (type) query.type = type;
  
  return Promise.all([
    this.find(query)
      .populate('asset', 'name symbol')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query)
  ]).then(function(results) {
    var analyses = results[0];
    var total = results[1];
    
    return {
      analyses: analyses,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    };
  });
};

module.exports = mongoose.model('AIAnalysis', aiAnalysisSchema);
