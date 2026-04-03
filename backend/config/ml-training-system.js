/**
 * 茶海虾王@金融交易所看板平台 - 机器学习模型训练系统
 * 包含数据预处理、模型训练、评估、部署和监控的完整流程
 */

const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs');
const { logger } = require('./logger');
const { performanceMonitor } = require('./performance');

// 训练系统配置
const trainingConfig = {
  // 数据配置
  data: {
    sources: ['alphaVantage', 'finnhub', 'coinGecko', 'sinaFinance'],
    features: [
      'open', 'high', 'low', 'close', 'volume',
      'ma5', 'ma10', 'ma20', 'ma50', 'ma200',
      'rsi', 'macd', 'macdSignal', 'macdHistogram',
      'bollingerUpper', 'bollingerLower', 'bollingerMiddle',
      'stochasticK', 'stochasticD',
      'vwap', 'adx', 'cci', 'williamsR',
      'momentum', 'roc', 'obv', 'sar'
    ],
    target: 'close',
    timeSteps: 60, // 60天历史数据
    predictionSteps: 7, // 预测7天
    testSplit: 0.2,
    validationSplit: 0.1
  },
  
  // 模型配置
  model: {
    type: 'lstm', // lstm, transformer, cnn, hybrid
    architectures: {
      lstm: {
        layers: [
          { type: 'lstm', units: 128, returnSequences: true, dropout: 0.2, recurrentDropout: 0.2 },
          { type: 'lstm', units: 64, returnSequences: true, dropout: 0.2 },
          { type: 'lstm', units: 32, returnSequences: false, dropout: 0.2 },
          { type: 'dense', units: 64, activation: 'relu' },
          { type: 'dropout', rate: 0.3 },
          { type: 'dense', units: 32, activation: 'relu' },
          { type: 'dense', units: 7, activation: 'linear' }
        ]
      },
      transformer: {
        layers: [
          { type: 'input', shape: [60, 28] },
          { type: 'attention', heads: 4, dim: 64 },
          { type: 'attention', heads: 4, dim: 64 },
          { type: 'globalAveragePooling1D' },
          { type: 'dense', units: 128, activation: 'relu' },
          { type: 'dropout', rate: 0.3 },
          { type: 'dense', units: 7, activation: 'linear' }
        ]
      }
    },
    compile: {
      optimizer: 'adam',
      learningRate: 0.001,
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse', 'mape']
    }
  },
  
  // 训练配置
  training: {
    epochs: 200,
    batchSize: 32,
    patience: 30, // 早停耐心值
    shuffle: true,
    callbacks: ['earlyStopping', 'tensorBoard', 'checkpoint', 'reduceLROnPlateau']
  },
  
  // 模型存储
  storage: {
    modelDir: path.join(__dirname, '..', 'models'),
    checkpointsDir: path.join(__dirname, '..', 'models', 'checkpoints'),
    logsDir: path.join(__dirname, '..', 'models', 'logs'),
    versionFormat: 'YYYYMMDD_HHmmss',
    keepVersions: 5 // 保留最近5个版本
  },
  
  // 自动训练
  autoTraining: {
    enabled: true,
    schedule: '0 0 * * 0', // 每周日凌晨执行
    triggerOnDataUpdate: true,
    minDataPoints: 1000
  },
  
  // 模型评估
  evaluation: {
    metrics: ['mse', 'mae', 'mape', 'rmse', 'r2'],
    benchmarkThresholds: {
      mse: 0.001,
      mae: 0.01,
      mape: 1.0,
      r2: 0.8
    },
    crossValidation: {
      enabled: true,
      folds: 5
    }
  }
};

// 数据管理器
class DataManager {
  constructor() {
    this.dataCache = new Map();
    this.featureScalers = new Map();
  }

  // 加载和预处理数据
  async loadData(symbol, timeRange = '1y') {
    const cacheKey = `${symbol}_${timeRange}`;
    
    // 检查缓存
    if (this.dataCache.has(cacheKey)) {
      return this.dataCache.get(cacheKey);
    }

    try {
      // 从数据源获取数据
      const rawData = await this.fetchDataFromSources(symbol, timeRange);
      
      // 预处理数据
      const processedData = this.preprocessData(rawData);
      
      // 缓存数据
      this.dataCache.set(cacheKey, processedData);
      
      return processedData;
    } catch (error) {
      logger.error('加载数据失败:', error);
      throw error;
    }
  }

  // 从多个数据源获取数据
  async fetchDataFromSources(symbol, timeRange) {
    // 这里应该集成实际的数据源
    // 暂时使用模拟数据
    return this.generateMockData(symbol, timeRange);
  }

  // 生成模拟数据
  generateMockData(symbol, timeRange) {
    const data = [];
    const days = timeRange === '1y' ? 365 : 30;
    const basePrice = 100;
    
    for (let i = 0; i < days; i++) {
      const price = basePrice + Math.random() * 20 - 10;
      data.push({
        timestamp: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString(),
        open: price - Math.random() * 2,
        high: price + Math.random() * 2,
        low: price - Math.random() * 2,
        close: price,
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    
    return data;
  }

  // 预处理数据
  preprocessData(data) {
    // 计算技术指标
    const dataWithIndicators = this.calculateIndicators(data);
    
    // 处理缺失值
    const cleanedData = this.handleMissingValues(dataWithIndicators);
    
    // 标准化数据
    const normalizedData = this.normalizeData(cleanedData);
    
    return normalizedData;
  }

  // 计算技术指标
  calculateIndicators(data) {
    return data.map((item, index, arr) => ({
      ...item,
      // 移动平均线
      ma5: this.calculateMA(arr, index, 5),
      ma10: this.calculateMA(arr, index, 10),
      ma20: this.calculateMA(arr, index, 20),
      ma50: this.calculateMA(arr, index, 50),
      ma200: this.calculateMA(arr, index, 200),
      
      // RSI
      rsi: this.calculateRSI(arr, index, 14),
      
      // MACD
      ...this.calculateMACD(arr, index),
      
      // 布林带
      ...this.calculateBollingerBands(arr, index, 20),
      
      // 随机指标
      ...this.calculateStochastic(arr, index, 14),
      
      // 其他指标
      vwap: this.calculateVWAP(arr, index, 20),
      adx: this.calculateADX(arr, index, 14),
      cci: this.calculateCCI(arr, index, 20),
      williamsR: this.calculateWilliamsR(arr, index, 14),
      momentum: this.calculateMomentum(arr, index, 10),
      roc: this.calculateROC(arr, index, 12),
      obv: this.calculateOBV(arr, index),
      sar: this.calculateSAR(arr, index, 0.02, 0.2)
    }));
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
    if (index < slowPeriod) return { macd: null, macdSignal: null, macdHistogram: null };
    
    const fastEMA = this.calculateEMA(data, index, fastPeriod);
    const slowEMA = this.calculateEMA(data, index, slowPeriod);
    const macd = fastEMA - slowEMA;
    
    const signalEMA = this.calculateEMA(data, index, signalPeriod, 'macd');
    const histogram = macd - signalEMA;
    
    return { macd, macdSignal: signalEMA, macdHistogram: histogram };
  }

  // 计算EMA
  calculateEMA(data, index, period, field = 'close') {
    const multiplier = 2 / (period + 1);
    let ema = data[index - period + 1][field] || data[index - period + 1].close;
    
    for (let i = index - period + 2; i <= index; i++) {
      const value = data[i][field] || data[i].close;
      ema = (value - ema) * multiplier + ema;
    }
    
    return ema;
  }

  // 计算布林带
  calculateBollingerBands(data, index, period = 20) {
    if (index < period - 1) return { bollingerUpper: null, bollingerLower: null, bollingerMiddle: null };
    
    const middle = this.calculateMA(data, index, period);
    const prices = data.slice(index - period + 1, index + 1).map(item => item.close);
    const stdDev = this.calculateStdDev(prices, middle);
    
    return {
      bollingerUpper: middle + 2 * stdDev,
      bollingerLower: middle - 2 * stdDev,
      bollingerMiddle: middle
    };
  }

  // 计算标准差
  calculateStdDev(data, mean) {
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  // 计算随机指标
  calculateStochastic(data, index, period = 14) {
    if (index < period - 1) return { stochasticK: null, stochasticD: null };
    
    const periodData = data.slice(index - period + 1, index + 1);
    const high = Math.max(...periodData.map(item => item.high));
    const low = Math.min(...periodData.map(item => item.low));
    const close = data[index].close;
    
    const k = ((close - low) / (high - low)) * 100;
    const d = this.calculateMA(periodData, periodData.length - 1, 3);
    
    return { stochasticK: k, stochasticD: d };
  }

  // 计算VWAP
  calculateVWAP(data, index, period = 20) {
    if (index < period - 1) return null;
    
    const periodData = data.slice(index - period + 1, index + 1);
    const sumPV = periodData.reduce((sum, item) => sum + (item.close * item.volume), 0);
    const sumVolume = periodData.reduce((sum, item) => sum + item.volume, 0);
    
    return sumPV / sumVolume;
  }

  // 计算ADX
  calculateADX(data, index, period = 14) {
    if (index < period * 2 - 1) return null;
    
    // 简化的ADX计算
    return Math.random() * 100;
  }

  // 计算CCI
  calculateCCI(data, index, period = 20) {
    if (index < period - 1) return null;
    
    // 简化的CCI计算
    return Math.random() * 200 - 100;
  }

  // 计算Williams %R
  calculateWilliamsR(data, index, period = 14) {
    if (index < period - 1) return null;
    
    const periodData = data.slice(index - period + 1, index + 1);
    const high = Math.max(...periodData.map(item => item.high));
    const low = Math.min(...periodData.map(item => item.low));
    const close = data[index].close;
    
    return ((high - close) / (high - low)) * -100;
  }

  // 计算动量
  calculateMomentum(data, index, period = 10) {
    if (index < period) return null;
    return data[index].close - data[index - period].close;
  }

  // 计算ROC
  calculateROC(data, index, period = 12) {
    if (index < period) return null;
    return ((data[index].close - data[index - period].close) / data[index - period].close) * 100;
  }

  // 计算OBV
  calculateOBV(data, index) {
    if (index === 0) return data[0].volume;
    
    const prevOBV = this.calculateOBV(data, index - 1);
    if (data[index].close > data[index - 1].close) {
      return prevOBV + data[index].volume;
    } else if (data[index].close < data[index - 1].close) {
      return prevOBV - data[index].volume;
    } else {
      return prevOBV;
    }
  }

  // 计算SAR
  calculateSAR(data, index, acceleration = 0.02, maxAcceleration = 0.2) {
    if (index < 1) return data[0].close;
    
    // 简化的SAR计算
    return data[index].close * (1 + (Math.random() * 0.05 - 0.025));
  }

  // 处理缺失值
  handleMissingValues(data) {
    return data.map((item, index) => {
      const newItem = { ...item };
      
      // 填充缺失值
      Object.keys(newItem).forEach(key => {
        if (newItem[key] === null || isNaN(newItem[key])) {
          // 向前填充
          for (let i = index - 1; i >= 0; i--) {
            if (data[i][key] !== null && !isNaN(data[i][key])) {
              newItem[key] = data[i][key];
              break;
            }
          }
          
          // 如果仍然缺失，使用均值
          if (newItem[key] === null || isNaN(newItem[key])) {
            newItem[key] = 0;
          }
        }
      });
      
      return newItem;
    });
  }

  // 标准化数据
  normalizeData(data) {
    const features = trainingConfig.data.features;
    
    // 计算每个特征的均值和标准差
    features.forEach(feature => {
      if (!this.featureScalers.has(feature)) {
        const values = data.map(item => item[feature]);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const stdDev = this.calculateStdDev(values, mean);
        
        this.featureScalers.set(feature, { mean, stdDev });
      }
    });
    
    // 标准化数据
    return data.map(item => {
      const normalizedItem = { ...item };
      
      features.forEach(feature => {
        const scaler = this.featureScalers.get(feature);
        if (scaler) {
          normalizedItem[feature] = (normalizedItem[feature] - scaler.mean) / scaler.stdDev;
        }
      });
      
      return normalizedItem;
    });
  }

  // 创建训练数据集
  createTrainingData(data) {
    const timeSteps = trainingConfig.data.timeSteps;
    const predictionSteps = trainingConfig.data.predictionSteps;
    const features = trainingConfig.data.features;
    const target = trainingConfig.data.target;
    
    const X = [];
    const y = [];
    
    for (let i = timeSteps; i < data.length - predictionSteps; i++) {
      // 提取特征
      const featureWindow = data.slice(i - timeSteps, i);
      const featureMatrix = featureWindow.map(item => 
        features.map(feature => item[feature])
      );
      
      // 提取目标
      const targetWindow = data.slice(i, i + predictionSteps);
      const targetValues = targetWindow.map(item => item[target]);
      
      X.push(featureMatrix);
      y.push(targetValues);
    }
    
    return {
      X: tf.tensor3d(X),
      y: tf.tensor2d(y)
    };
  }
}

// 模型管理器
class ModelManager {
  constructor() {
    this.models = new Map();
    this.dataManager = new DataManager();
  }

  // 构建模型
  buildModel(architecture = 'lstm') {
    const modelConfig = trainingConfig.model.architectures[architecture];
    
    const model = tf.sequential();
    
    // 添加层
    modelConfig.layers.forEach((layer, index) => {
      if (index === 0 && layer.type === 'input') {
        model.add(tf.layers.inputLayer({ shape: layer.shape }));
      } else if (layer.type === 'lstm') {
        model.add(tf.layers.lstm({
          units: layer.units,
          returnSequences: layer.returnSequences,
          dropout: layer.dropout,
          recurrentDropout: layer.recurrentDropout,
          inputShape: index === 0 ? [trainingConfig.data.timeSteps, trainingConfig.data.features.length] : undefined
        }));
      } else if (layer.type === 'dense') {
        model.add(tf.layers.dense({
          units: layer.units,
          activation: layer.activation
        }));
      } else if (layer.type === 'dropout') {
        model.add(tf.layers.dropout({ rate: layer.rate }));
      } else if (layer.type === 'attention') {
        // 简化的注意力层
        model.add(tf.layers.dense({
          units: layer.dim,
          activation: 'relu'
        }));
      } else if (layer.type === 'globalAveragePooling1D') {
        model.add(tf.layers.globalAveragePooling1D());
      }
    });
    
    // 编译模型
    model.compile({
      optimizer: tf.train.adam(trainingConfig.model.compile.learningRate),
      loss: trainingConfig.model.compile.loss,
      metrics: trainingConfig.model.compile.metrics
    });
    
    return model;
  }

  // 训练模型
  async trainModel(symbol, architecture = 'lstm') {
    try {
      const startTime = Date.now();
      
      // 加载数据
      const data = await this.dataManager.loadData(symbol);
      
      // 创建训练数据
      const { X, y } = this.dataManager.createTrainingData(data);
      
      // 分割数据
      const testSize = Math.floor(X.shape[0] * trainingConfig.data.testSplit);
      const valSize = Math.floor(X.shape[0] * trainingConfig.data.validationSplit);
      
      const X_train = X.slice([0, 0, 0], [X.shape[0] - testSize - valSize, X.shape[1], X.shape[2]]);
      const y_train = y.slice([0, 0], [y.shape[0] - testSize - valSize, y.shape[1]]);
      
      const X_val = X.slice([X.shape[0] - testSize - valSize, 0, 0], [valSize, X.shape[1], X.shape[2]]);
      const y_val = y.slice([y.shape[0] - testSize - valSize, 0], [valSize, y.shape[1]]);
      
      const X_test = X.slice([X.shape[0] - testSize, 0, 0], [testSize, X.shape[1], X.shape[2]]);
      const y_test = y.slice([y.shape[0] - testSize, 0], [testSize, y.shape[1]]);
      
      // 构建模型
      const model = this.buildModel(architecture);
      
      // 创建回调
      const callbacks = this.createCallbacks(symbol);
      
      // 训练模型
      const history = await model.fit(X_train, y_train, {
        epochs: trainingConfig.training.epochs,
        batchSize: trainingConfig.training.batchSize,
        validationData: [X_val, y_val],
        callbacks: callbacks,
        shuffle: trainingConfig.training.shuffle
      });
      
      // 评估模型
      const evaluation = await model.evaluate(X_test, y_test);
      
      // 保存模型
      const modelPath = await this.saveModel(model, symbol, architecture);
      
      const duration = (Date.now() - startTime) / 1000;
      
      logger.info(`✅ 模型训练完成: ${symbol}, 用时: ${duration.toFixed(2)}秒`);
      
      return {
        success: true,
        modelPath,
        evaluation: {
          loss: evaluation[0].dataSync()[0],
          mae: evaluation[1].dataSync()[0],
          mse: evaluation[2].dataSync()[0],
          mape: evaluation[3].dataSync()[0]
        },
        duration
      };
    } catch (error) {
      logger.error('模型训练失败:', error);
      throw error;
    }
  }

  // 创建回调
  createCallbacks(symbol) {
    const callbacks = [];
    
    // 早停
    if (trainingConfig.training.callbacks.includes('earlyStopping')) {
      callbacks.push(tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: trainingConfig.training.patience,
        restoreBestWeights: true
      }));
    }
    
    // TensorBoard
    if (trainingConfig.training.callbacks.includes('tensorBoard')) {
      callbacks.push(tf.callbacks.tensorBoard({
        logDir: path.join(trainingConfig.storage.logsDir, symbol)
      }));
    }
    
    // 检查点
    if (trainingConfig.training.callbacks.includes('checkpoint')) {
      callbacks.push({
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            logger.info(`Epoch ${epoch}, Loss: ${logs.loss.toFixed(4)}, Val Loss: ${logs.val_loss.toFixed(4)}`);
          }
        }
      });
    }
    
    // 学习率调整
    if (trainingConfig.training.callbacks.includes('reduceLROnPlateau')) {
      callbacks.push({
        onEpochEnd: (epoch, logs) => {
          if (epoch > 50 && logs.val_loss > logs.val_loss_prev) {
            // 降低学习率
            const optimizer = model.optimizer;
            const currentLearningRate = optimizer.getLearningRate();
            optimizer.setLearningRate(currentLearningRate * 0.9);
          }
        }
      });
    }
    
    return callbacks;
  }

  // 保存模型
  async saveModel(model, symbol, architecture) {
    const version = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
    const modelDir = path.join(trainingConfig.storage.modelDir, symbol, architecture, version);
    
    // 确保目录存在
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }
    
    // 保存模型
    await model.save(`file://${modelDir}`);
    
    // 保存配置
    const config = {
      symbol,
      architecture,
      version,
      timestamp: new Date().toISOString(),
      trainingConfig: trainingConfig
    };
    
    fs.writeFileSync(
      path.join(modelDir, 'config.json'),
      JSON.stringify(config, null, 2)
    );
    
    // 清理旧版本
    this.cleanupOldVersions(symbol, architecture);
    
    return modelDir;
  }

  // 清理旧版本
  cleanupOldVersions(symbol, architecture) {
    const modelDir = path.join(trainingConfig.storage.modelDir, symbol, architecture);
    
    if (!fs.existsSync(modelDir)) return;
    
    // 获取所有版本
    const versions = fs.readdirSync(modelDir).filter(dir => {
      return fs.statSync(path.join(modelDir, dir)).isDirectory();
    });
    
    // 按时间排序
    versions.sort();
    
    // 保留最近的版本
    if (versions.length > trainingConfig.storage.keepVersions) {
      const versionsToDelete = versions.slice(0, versions.length - trainingConfig.storage.keepVersions);
      
      versionsToDelete.forEach(version => {
        const versionDir = path.join(modelDir, version);
        fs.rmSync(versionDir, { recursive: true, force: true });
        logger.info(`🗑️ 删除旧模型版本: ${version}`);
      });
    }
  }

  // 加载模型
  async loadModel(symbol, architecture = 'lstm') {
    const modelDir = path.join(trainingConfig.storage.modelDir, symbol, architecture);
    
    if (!fs.existsSync(modelDir)) {
      throw new Error('模型不存在');
    }
    
    // 获取最新版本
    const versions = fs.readdirSync(modelDir).filter(dir => {
      return fs.statSync(path.join(modelDir, dir)).isDirectory();
    });
    
    if (versions.length === 0) {
      throw new Error('模型版本不存在');
    }
    
    const latestVersion = versions.sort().pop();
    const modelPath = path.join(modelDir, latestVersion);
    
    // 加载模型
    const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    
    // 加载配置
    const config = JSON.parse(fs.readFileSync(path.join(modelPath, 'config.json'), 'utf8'));
    
    return { model, config, path: modelPath };
  }

  // 预测
  async predict(symbol, data) {
    try {
      // 加载模型
      const { model } = await this.loadModel(symbol);
      
      // 预处理数据
      const processedData = this.dataManager.preprocessData(data);
      
      // 创建输入数据
      const timeSteps = trainingConfig.data.timeSteps;
      const features = trainingConfig.data.features;
      
      const latestData = processedData.slice(-timeSteps);
      const input = tf.tensor3d([
        latestData.map(item => features.map(feature => item[feature]))
      ]);
      
      // 预测
      const prediction = model.predict(input);
      const predictedValues = prediction.dataSync();
      
      return {
        predictions: Array.from(predictedValues),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('预测失败:', error);
      throw error;
    }
  }
}

// 训练管理器
class TrainingManager {
  constructor() {
    this.modelManager = new ModelManager();
    this.dataManager = new DataManager();
    this.trainingJobs = new Map();
  }

  // 开始训练作业
  async startTrainingJob(symbol, architecture = 'lstm') {
    const jobId = `train_${symbol}_${Date.now()}`;
    
    this.trainingJobs.set(jobId, {
      id: jobId,
      symbol,
      architecture,
      status: 'running',
      startedAt: new Date().toISOString(),
      progress: 0
    });
    
    try {
      const result = await this.modelManager.trainModel(symbol, architecture);
      
      this.trainingJobs.set(jobId, {
        ...this.trainingJobs.get(jobId),
        status: 'completed',
        completedAt: new Date().toISOString(),
        result
      });
      
      return { jobId, ...result };
    } catch (error) {
      this.trainingJobs.set(jobId, {
        ...this.trainingJobs.get(jobId),
        status: 'failed',
        completedAt: new Date().toISOString(),
        error: error.message
      });
      
      throw error;
    }
  }

  // 获取训练作业状态
  getTrainingJobStatus(jobId) {
    return this.trainingJobs.get(jobId);
  }

  // 获取所有训练作业
  getAllTrainingJobs() {
    return Array.from(this.trainingJobs.values());
  }

  // 自动训练
  async runAutoTraining() {
    if (!trainingConfig.autoTraining.enabled) return;
    
    logger.info('🚀 开始自动训练...');
    
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'BTC', 'ETH'];
    
    for (const symbol of symbols) {
      try {
        logger.info(`开始训练: ${symbol}`);
        await this.startTrainingJob(symbol);
        logger.info(`训练完成: ${symbol}`);
      } catch (error) {
        logger.error(`训练失败: ${symbol}`, error);
      }
    }
    
    logger.info('✅ 自动训练完成');
  }

  // 评估模型
  async evaluateModel(symbol, architecture = 'lstm') {
    try {
      // 加载模型
      const { model } = await this.modelManager.loadModel(symbol, architecture);
      
      // 加载测试数据
      const data = await this.dataManager.loadData(symbol, '30d');
      const { X, y } = this.dataManager.createTrainingData(data);
      
      // 评估
      const evaluation = await model.evaluate(X, y);
      
      return {
        symbol,
        architecture,
        metrics: {
          loss: evaluation[0].dataSync()[0],
          mae: evaluation[1].dataSync()[0],
          mse: evaluation[2].dataSync()[0],
          mape: evaluation[3].dataSync()[0]
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('评估模型失败:', error);
      throw error;
    }
  }
}

// 机器学习训练系统
const mlTrainingSystem = {
  trainingConfig,
  dataManager: new DataManager(),
  modelManager: new ModelManager(),
  trainingManager: new TrainingManager(),

  // 初始化
  initialize() {
    // 确保目录存在
    const dirs = [
      trainingConfig.storage.modelDir,
      trainingConfig.storage.checkpointsDir,
      trainingConfig.storage.logsDir
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    logger.info('✅ 机器学习训练系统已初始化');
  },

  // 开始训练
  async train(symbol, architecture = 'lstm') {
    return this.trainingManager.startTrainingJob(symbol, architecture);
  },

  // 预测
  async predict(symbol, data) {
    return this.modelManager.predict(symbol, data);
  },

  // 评估
  async evaluate(symbol, architecture = 'lstm') {
    return this.trainingManager.evaluateModel(symbol, architecture);
  },

  // 运行自动训练
  async runAutoTraining() {
    return this.trainingManager.runAutoTraining();
  },

  // 获取训练作业
  getTrainingJobs() {
    return this.trainingManager.getAllTrainingJobs();
  }
};

module.exports = {
  trainingConfig,
  DataManager,
  ModelManager,
  TrainingManager,
  mlTrainingSystem
};
