/**
 * 茶海虾王@金融交易所看板平台 - 高级AI分析算法
 * 包含机器学习模型、技术分析、情感分析等
 */

const tf = require('@tensorflow/tfjs');
const { logger } = require('./logger');

// AI分析配置
const aiConfig = {
  // 模型配置
  models: {
    pricePrediction: {
      enabled: true,
      sequenceLength: 60, // 使用60天数据预测
      predictionDays: 7,  // 预测未来7天
      features: ['open', 'high', 'low', 'close', 'volume', 'ma5', 'ma10', 'ma20', 'rsi', 'macd']
    },
    sentimentAnalysis: {
      enabled: true,
      sources: ['news', 'social_media', 'financial_reports'],
      languages: ['zh', 'en']
    },
    patternRecognition: {
      enabled: true,
      patterns: ['head_and_shoulders', 'double_top', 'double_bottom', 'triangle', 'flag', 'pennant']
    },
    riskAssessment: {
      enabled: true,
      metrics: ['volatility', 'var', 'sharpe_ratio', 'beta', 'alpha']
    }
  },

  // 训练配置
  training: {
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.2,
    learningRate: 0.001,
    earlyStoppingPatience: 10
  }
};

// 价格预测模型
class PricePredictionModel {
  constructor() {
    this.model = null;
    this.scaler = new MinMaxScaler();
  }

  // 构建LSTM模型
  buildModel(inputShape) {
    this.model = tf.sequential({
      layers: [
        // 第一层LSTM
        tf.layers.lstm({
          units: 128,
          returnSequences: true,
          inputShape: inputShape,
          dropout: 0.2,
          recurrentDropout: 0.2
        }),
        
        // 第二层LSTM
        tf.layers.lstm({
          units: 64,
          returnSequences: true,
          dropout: 0.2,
          recurrentDropout: 0.2
        }),
        
        // 第三层LSTM
        tf.layers.lstm({
          units: 32,
          returnSequences: false,
          dropout: 0.2
        }),
        
        // 全连接层
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        
        // 输出层
        tf.layers.dense({ units: aiConfig.models.pricePrediction.predictionDays })
      ]
    });

    // 编译模型
    this.model.compile({
      optimizer: tf.train.adam(aiConfig.training.learningRate),
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse']
    });

    logger.info('✅ 价格预测模型构建完成');
    return this.model;
  }

  // 数据预处理
  preprocessData(data) {
    // 计算技术指标
    const processedData = data.map((item, index, arr) => ({
      ...item,
      // 移动平均线
      ma5: this.calculateMA(arr, index, 5),
      ma10: this.calculateMA(arr, index, 10),
      ma20: this.calculateMA(arr, index, 20),
      // RSI
      rsi: this.calculateRSI(arr, index, 14),
      // MACD
      macd: this.calculateMACD(arr, index)
    }));

    // 标准化
    const features = aiConfig.models.pricePrediction.features;
    const featureData = processedData.map(item => 
      features.map(feature => item[feature] || 0)
    );

    const scaledData = this.scaler.fitTransform(featureData);

    // 创建序列
    const sequences = [];
    const labels = [];
    const seqLength = aiConfig.models.pricePrediction.sequenceLength;

    for (let i = seqLength; i < scaledData.length - aiConfig.models.pricePrediction.predictionDays; i++) {
      sequences.push(scaledData.slice(i - seqLength, i));
      labels.push(scaledData.slice(i, i + aiConfig.models.pricePrediction.predictionDays).map(d => d[3])); // 使用收盘价
    }

    return {
      X: tf.tensor3d(sequences),
      y: tf.tensor2d(labels)
    };
  }

  // 计算移动平均线
  calculateMA(data, index, period) {
    if (index < period - 1) return null;
    const sum = data.slice(index - period + 1, index + 1).reduce((acc, item) => acc + item.close, 0);
    return sum / period;
  }

  // 计算RSI
  calculateRSI(data, index, period = 14) {
    if (index < period) return null;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = index - period + 1; i <= index; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // 计算MACD
  calculateMACD(data, index, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (index < slowPeriod) return null;
    
    const fastEMA = this.calculateEMA(data, index, fastPeriod);
    const slowEMA = this.calculateEMA(data, index, slowPeriod);
    
    return fastEMA - slowEMA;
  }

  // 计算EMA
  calculateEMA(data, index, period) {
    const multiplier = 2 / (period + 1);
    let ema = data[index - period + 1].close;
    
    for (let i = index - period + 2; i <= index; i++) {
      ema = (data[i].close - ema) * multiplier + ema;
    }
    
    return ema;
  }

  // 训练模型
  async train(data) {
    try {
      logger.info('🚀 开始训练价格预测模型...');
      
      const { X, y } = this.preprocessData(data);
      
      if (!this.model) {
        this.buildModel([X.shape[1], X.shape[2]]);
      }

      // 早停回调
      const earlyStopping = tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: aiConfig.training.earlyStoppingPatience,
        restoreBestWeights: true
      });

      // 训练模型
      const history = await this.model.fit(X, y, {
        epochs: aiConfig.training.epochs,
        batchSize: aiConfig.training.batchSize,
        validationSplit: aiConfig.training.validationSplit,
        callbacks: [earlyStopping],
        verbose: 1
      });

      logger.info('✅ 模型训练完成');
      return history;

    } catch (error) {
      logger.error('❌ 模型训练失败:', error);
      throw error;
    }
  }

  // 预测价格
  async predict(data) {
    try {
      const { X } = this.preprocessData(data);
      const lastSequence = X.slice([X.shape[0] - 1, 0, 0], [1, X.shape[1], X.shape[2]]);
      
      const prediction = this.model.predict(lastSequence);
      const predictedValues = await prediction.data();
      
      // 反标准化
      const denormalized = this.scaler.inverseTransform(predictedValues);
      
      return {
        predictions: denormalized,
        confidence: this.calculateConfidence(predictedValues),
        trend: this.determineTrend(denormalized)
      };

    } catch (error) {
      logger.error('❌ 价格预测失败:', error);
      throw error;
    }
  }

  // 计算置信度
  calculateConfidence(predictions) {
    const volatility = tf.moments(predictions).variance.sqrt().dataSync()[0];
    return Math.max(0, Math.min(1, 1 - volatility));
  }

  // 确定趋势
  determineTrend(predictions) {
    const first = predictions[0];
    const last = predictions[predictions.length - 1];
    const change = ((last - first) / first) * 100;
    
    if (change > 5) return '强烈上涨';
    if (change > 2) return '上涨';
    if (change > -2) return '横盘';
    if (change > -5) return '下跌';
    return '强烈下跌';
  }
}

// 情感分析模型
class SentimentAnalysisModel {
  constructor() {
    this.positiveWords = new Set([
      '上涨', '增长', '利好', '突破', '强势', '反弹', '牛市', '买入', '推荐',
      'rise', 'growth', 'bullish', 'breakthrough', 'strong', 'rebound', 'buy', 'recommend'
    ]);
    
    this.negativeWords = new Set([
      '下跌', '下降', '利空', '跌破', '弱势', '回调', '熊市', '卖出', '回避',
      'fall', 'decline', 'bearish', 'breakdown', 'weak', 'correction', 'sell', 'avoid'
    ]);
  }

  // 分析文本情感
  analyze(text) {
    const words = this.tokenize(text);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (this.positiveWords.has(word.toLowerCase())) positiveCount++;
      if (this.negativeWords.has(word.toLowerCase())) negativeCount++;
    });

    const total = positiveCount + negativeCount;
    if (total === 0) return { sentiment: 'neutral', score: 0 };

    const score = (positiveCount - negativeCount) / total;
    
    let sentiment;
    if (score > 0.3) sentiment = 'very_positive';
    else if (score > 0.1) sentiment = 'positive';
    else if (score > -0.1) sentiment = 'neutral';
    else if (score > -0.3) sentiment = 'negative';
    else sentiment = 'very_negative';

    return { sentiment, score, positiveCount, negativeCount };
  }

  // 分词
  tokenize(text) {
    // 简化的分词，实际应用中应使用专业的NLP库
    return text.toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1);
  }

  // 批量分析
  analyzeBatch(texts) {
    return texts.map(text => ({
      text: text.substring(0, 100),
      ...this.analyze(text)
    }));
  }
}

// 模式识别模型
class PatternRecognitionModel {
  constructor() {
    this.patterns = {
      head_and_shoulders: this.detectHeadAndShoulders.bind(this),
      double_top: this.detectDoubleTop.bind(this),
      double_bottom: this.detectDoubleBottom.bind(this),
      triangle: this.detectTriangle.bind(this),
      flag: this.detectFlag.bind(this),
      pennant: this.detectPennant.bind(this)
    };
  }

  // 检测头肩顶/底
  detectHeadAndShoulders(data) {
    if (data.length < 20) return null;

    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    
    // 简化的头肩顶检测逻辑
    const recentHighs = highs.slice(-20);
    const maxHigh = Math.max(...recentHighs);
    const maxIndex = recentHighs.indexOf(maxHigh);
    
    // 检查是否有左右肩
    if (maxIndex > 5 && maxIndex < 15) {
      const leftShoulder = Math.max(...recentHighs.slice(0, maxIndex - 2));
      const rightShoulder = Math.max(...recentHighs.slice(maxIndex + 2));
      
      if (leftShoulder < maxHigh * 0.95 && rightShoulder < maxHigh * 0.95) {
        return {
          pattern: 'head_and_shoulders',
          type: 'top',
          confidence: 0.7,
          neckline: Math.min(...lows.slice(-20))
        };
      }
    }

    return null;
  }

  // 检测双顶
  detectDoubleTop(data) {
    if (data.length < 15) return null;

    const highs = data.slice(-15).map(d => d.high);
    const peaks = this.findPeaks(highs, 3);
    
    if (peaks.length >= 2) {
      const peak1 = highs[peaks[0]];
      const peak2 = highs[peaks[1]];
      
      if (Math.abs(peak1 - peak2) / peak1 < 0.03) {
        return {
          pattern: 'double_top',
          confidence: 0.75,
          peaks: [peaks[0], peaks[1]]
        };
      }
    }

    return null;
  }

  // 检测双底
  detectDoubleBottom(data) {
    if (data.length < 15) return null;

    const lows = data.slice(-15).map(d => d.low);
    const troughs = this.findTroughs(lows, 3);
    
    if (troughs.length >= 2) {
      const trough1 = lows[troughs[0]];
      const trough2 = lows[troughs[1]];
      
      if (Math.abs(trough1 - trough2) / trough1 < 0.03) {
        return {
          pattern: 'double_bottom',
          confidence: 0.75,
          troughs: [troughs[0], troughs[1]]
        };
      }
    }

    return null;
  }

  // 检测三角形
  detectTriangle(data) {
    if (data.length < 20) return null;

    const highs = data.slice(-20).map(d => d.high);
    const lows = data.slice(-20).map(d => d.low);

    const highTrend = this.calculateTrend(highs);
    const lowTrend = this.calculateTrend(lows);

    if (highTrend < -0.01 && lowTrend > 0.01) {
      return {
        pattern: 'symmetric_triangle',
        confidence: 0.6,
        direction: 'converging'
      };
    }

    return null;
  }

  // 检测旗形
  detectFlag(data) {
    // 简化的旗形检测
    return null;
  }

  // 检测三角旗
  detectPennant(data) {
    // 简化的三角旗检测
    return null;
  }

  // 寻找峰值
  findPeaks(data, window = 3) {
    const peaks = [];
    for (let i = window; i < data.length - window; i++) {
      const isPeak = data.slice(i - window, i).every(v => v < data[i]) &&
                     data.slice(i + 1, i + window + 1).every(v => v < data[i]);
      if (isPeak) peaks.push(i);
    }
    return peaks;
  }

  // 寻找谷值
  findTroughs(data, window = 3) {
    const troughs = [];
    for (let i = window; i < data.length - window; i++) {
      const isTrough = data.slice(i - window, i).every(v => v > data[i]) &&
                       data.slice(i + 1, i + window + 1).every(v => v > data[i]);
      if (isTrough) troughs.push(i);
    }
    return troughs;
  }

  // 计算趋势
  calculateTrend(data) {
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, v) => sum + v, 0);
    const sumXY = data.reduce((sum, v, i) => sum + i * v, 0);
    const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  // 分析所有模式
  analyze(data) {
    const results = [];
    
    for (const [patternName, detector] of Object.entries(this.patterns)) {
      const result = detector(data);
      if (result) {
        results.push(result);
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }
}

// 风险评估模型
class RiskAssessmentModel {
  // 计算VaR (Value at Risk)
  calculateVaR(returns, confidence = 0.95) {
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    return sortedReturns[index];
  }

  // 计算夏普比率
  calculateSharpeRatio(returns, riskFreeRate = 0.02) {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return (avgReturn - riskFreeRate) / stdDev;
  }

  // 计算Beta
  calculateBeta(assetReturns, marketReturns) {
    const covariance = this.calculateCovariance(assetReturns, marketReturns);
    const marketVariance = this.calculateVariance(marketReturns);
    
    return covariance / marketVariance;
  }

  // 计算协方差
  calculateCovariance(x, y) {
    const avgX = x.reduce((sum, v) => sum + v, 0) / x.length;
    const avgY = y.reduce((sum, v) => sum + v, 0) / y.length;
    
    return x.reduce((sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY), 0) / x.length;
  }

  // 计算方差
  calculateVariance(data) {
    const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
    return data.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / data.length;
  }

  // 综合风险评估
  assessRisk(data) {
    const returns = data.map((d, i, arr) => 
      i > 0 ? (d.close - arr[i - 1].close) / arr[i - 1].close : 0
    ).filter(r => r !== 0);

    const volatility = Math.sqrt(this.calculateVariance(returns));
    const var95 = this.calculateVaR(returns, 0.95);
    const var99 = this.calculateVaR(returns, 0.99);
    const sharpeRatio = this.calculateSharpeRatio(returns);

    return {
      volatility: volatility * 100, // 转换为百分比
      var95: var95 * 100,
      var99: var99 * 100,
      sharpeRatio,
      riskLevel: this.determineRiskLevel(volatility),
      maxDrawdown: this.calculateMaxDrawdown(data)
    };
  }

  // 确定风险等级
  determineRiskLevel(volatility) {
    if (volatility < 0.1) return '低风险';
    if (volatility < 0.2) return '中低风险';
    if (volatility < 0.3) return '中等风险';
    if (volatility < 0.4) return '中高风险';
    return '高风险';
  }

  // 计算最大回撤
  calculateMaxDrawdown(data) {
    let maxDrawdown = 0;
    let peak = data[0].close;

    for (const item of data) {
      if (item.close > peak) {
        peak = item.close;
      }
      const drawdown = (peak - item.close) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown * 100;
  }
}

// 数据标准化器
class MinMaxScaler {
  constructor() {
    this.min = null;
    this.max = null;
  }

  fitTransform(data) {
    const flatData = data.flat();
    this.min = Math.min(...flatData);
    this.max = Math.max(...flatData);
    
    return data.map(row => 
      row.map(val => (val - this.min) / (this.max - this.min))
    );
  }

  inverseTransform(data) {
    return data.map(val => val * (this.max - this.min) + this.min);
  }
}

// AI分析管理器
const aiAnalysisManager = {
  priceModel: new PricePredictionModel(),
  sentimentModel: new SentimentAnalysisModel(),
  patternModel: new PatternRecognitionModel(),
  riskModel: new RiskAssessmentModel(),

  // 综合分析
  async analyze(data, options = {}) {
    const results = {
      timestamp: new Date().toISOString(),
      analysis: {}
    };

    // 价格预测
    if (options.price !== false && aiConfig.models.pricePrediction.enabled) {
      try {
        results.analysis.pricePrediction = await this.priceModel.predict(data);
      } catch (error) {
        logger.error('价格预测失败:', error);
      }
    }

    // 模式识别
    if (options.pattern !== false && aiConfig.models.patternRecognition.enabled) {
      try {
        results.analysis.patterns = this.patternModel.analyze(data);
      } catch (error) {
        logger.error('模式识别失败:', error);
      }
    }

    // 风险评估
    if (options.risk !== false && aiConfig.models.riskAssessment.enabled) {
      try {
        results.analysis.risk = this.riskModel.assessRisk(data);
      } catch (error) {
        logger.error('风险评估失败:', error);
      }
    }

    // 生成建议
    results.analysis.recommendation = this.generateRecommendation(results.analysis);

    return results;
  },

  // 生成投资建议
  generateRecommendation(analysis) {
    const recommendations = [];
    let overallScore = 0;

    // 基于价格预测
    if (analysis.pricePrediction) {
      const trend = analysis.pricePrediction.trend;
      if (trend.includes('上涨')) {
        recommendations.push('价格预测显示上涨趋势，可考虑买入');
        overallScore += 2;
      } else if (trend.includes('下跌')) {
        recommendations.push('价格预测显示下跌趋势，建议观望或卖出');
        overallScore -= 2;
      }
    }

    // 基于模式识别
    if (analysis.patterns && analysis.patterns.length > 0) {
      const topPattern = analysis.patterns[0];
      if (topPattern.confidence > 0.7) {
        recommendations.push(`检测到${topPattern.pattern}模式，置信度${(topPattern.confidence * 100).toFixed(1)}%`);
      }
    }

    // 基于风险评估
    if (analysis.risk) {
      if (analysis.risk.sharpeRatio > 1) {
        recommendations.push('风险调整后收益良好');
        overallScore += 1;
      }
      if (analysis.risk.volatility > 30) {
        recommendations.push('波动率较高，注意风险控制');
        overallScore -= 1;
      }
    }

    // 总体建议
    let overallRecommendation;
    if (overallScore >= 2) overallRecommendation = '强烈买入';
    else if (overallScore >= 1) overallRecommendation = '买入';
    else if (overallScore >= -1) overallRecommendation = '持有';
    else if (overallScore >= -2) overallRecommendation = '卖出';
    else overallRecommendation = '强烈卖出';

    return {
      overall: overallRecommendation,
      score: overallScore,
      details: recommendations
    };
  }
};

module.exports = {
  aiConfig,
  PricePredictionModel,
  SentimentAnalysisModel,
  PatternRecognitionModel,
  RiskAssessmentModel,
  aiAnalysisManager
};
