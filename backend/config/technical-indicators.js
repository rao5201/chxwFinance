/**
 * 茶海虾王@金融交易所看板平台 - 技术指标和交易策略
 * 包含多种技术指标计算和交易策略实现
 */

const { logger } = require('./logger');

// 技术指标配置
const indicatorConfig = {
  // 移动平均线
  ma: {
    periods: [5, 10, 20, 50, 100, 200]
  },
  
  // RSI
  rsi: {
    period: 14,
    overbought: 70,
    oversold: 30
  },
  
  // MACD
  macd: {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9
  },
  
  // 布林带
  bollinger: {
    period: 20,
    stdDev: 2
  },
  
  // 随机指标
  stochastic: {
    kPeriod: 14,
    dPeriod: 3,
    overbought: 80,
    oversold: 20
  },
  
  // ADX
  adx: {
    period: 14,
    threshold: 25
  },
  
  // CCI
  cci: {
    period: 20,
    overbought: 100,
    oversold: -100
  },
  
  // Williams %R
  williamsR: {
    period: 14,
    overbought: -20,
    oversold: -80
  },
  
  // 动量指标
  momentum: {
    period: 10
  },
  
  // ROC
  roc: {
    period: 12
  },
  
  // 成交量指标
  volume: {
    period: 20
  }
};

// 交易策略配置
const strategyConfig = {
  // 趋势策略
  trend: {
    enabled: true,
    indicators: ['ma', 'macd', 'adx'],
    parameters: {
      maCrossoverThreshold: 0.1, // 10%
      adxThreshold: 25
    }
  },
  
  // 震荡策略
  oscillator: {
    enabled: true,
    indicators: ['rsi', 'stochastic', 'cci', 'williamsR'],
    parameters: {
      confirmationRequired: 2, // 需要2个指标确认
      signalStrength: 0.7 // 信号强度阈值
    }
  },
  
  // 突破策略
  breakout: {
    enabled: true,
    indicators: ['bollinger', 'volume'],
    parameters: {
      volumeThreshold: 1.5, // 成交量放大1.5倍
      breakoutThreshold: 0.02 // 突破2%
    }
  },
  
  // 均值回归策略
  meanReversion: {
    enabled: true,
    indicators: ['rsi', 'bollinger'],
    parameters: {
      rsiThreshold: 30,
      bollingerWidthThreshold: 0.05 // 布林带宽度5%
    }
  },
  
  // 多因子策略
  multiFactor: {
    enabled: true,
    indicators: ['ma', 'rsi', 'macd', 'volume'],
    parameters: {
      minSignals: 3, // 至少3个信号
      weightage: {
        ma: 0.3,
        rsi: 0.25,
        macd: 0.25,
        volume: 0.2
      }
    }
  },
  
  // 日内策略
  intraday: {
    enabled: true,
    indicators: ['rsi', 'stochastic', 'vwap'],
    parameters: {
      timeFrame: '15m',
      profitTarget: 0.01, // 1%
      stopLoss: 0.005 // 0.5%
    }
  },
  
  // 趋势追踪策略
  trendFollowing: {
    enabled: true,
    indicators: ['ma', 'adx', 'macd'],
    parameters: {
      maPeriods: [50, 200],
      adxThreshold: 30,
      trailingStop: 0.02 // 2%跟踪止损
    }
  },
  
  // 波动性策略
  volatility: {
    enabled: true,
    indicators: ['bollinger', 'adx', 'rsi'],
    parameters: {
      volatilityThreshold: 0.02, // 2%
      entrySignal: 'breakout',
      exitSignal: 'mean_reversion'
    }
  }
};

// 技术指标计算
class TechnicalIndicators {
  // 计算移动平均线
  static calculateMA(data, period) {
    if (data.length < period) return null;
    
    const values = data.map(item => item.close);
    const result = [];
    
    for (let i = period - 1; i < values.length; i++) {
      const sum = values.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      result.push({
        timestamp: data[i].timestamp,
        value: sum / period
      });
    }
    
    return result;
  }

  // 计算指数移动平均线
  static calculateEMA(data, period) {
    if (data.length < period) return null;
    
    const values = data.map(item => item.close);
    const result = [];
    const multiplier = 2 / (period + 1);
    
    // 初始值使用简单移动平均
    let ema = values.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
    result.push({
      timestamp: data[period - 1].timestamp,
      value: ema
    });
    
    // 计算后续值
    for (let i = period; i < values.length; i++) {
      ema = (values[i] - ema) * multiplier + ema;
      result.push({
        timestamp: data[i].timestamp,
        value: ema
      });
    }
    
    return result;
  }

  // 计算RSI
  static calculateRSI(data, period = 14) {
    if (data.length < period + 1) return null;
    
    const result = [];
    let gains = 0;
    let losses = 0;
    
    // 计算初始收益和损失
    for (let i = 1; i <= period; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    let rsi = 100 - (100 / (1 + rs));
    
    result.push({
      timestamp: data[period].timestamp,
      value: rsi
    });
    
    // 计算后续RSI值
    for (let i = period + 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;
      
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
      
      result.push({
        timestamp: data[i].timestamp,
        value: rsi
      });
    }
    
    return result;
  }

  // 计算MACD
  static calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (data.length < slowPeriod + signalPeriod) return null;
    
    // 计算EMA
    const fastEMA = this.calculateEMA(data, fastPeriod);
    const slowEMA = this.calculateEMA(data, slowPeriod);
    
    if (!fastEMA || !slowEMA) return null;
    
    const result = [];
    const macdLine = [];
    
    // 计算MACD线
    for (let i = 0; i < slowEMA.length; i++) {
      const fastValue = fastEMA[fastEMA.length - slowEMA.length + i].value;
      const slowValue = slowEMA[i].value;
      const macd = fastValue - slowValue;
      
      macdLine.push({
        timestamp: slowEMA[i].timestamp,
        value: macd
      });
    }
    
    // 计算信号线
    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    
    if (!signalLine) return null;
    
    // 计算柱状图
    for (let i = 0; i < signalLine.length; i++) {
      const histogram = macdLine[macdLine.length - signalLine.length + i].value - signalLine[i].value;
      
      result.push({
        timestamp: signalLine[i].timestamp,
        macd: macdLine[macdLine.length - signalLine.length + i].value,
        signal: signalLine[i].value,
        histogram: histogram
      });
    }
    
    return result;
  }

  // 计算布林带
  static calculateBollingerBands(data, period = 20, stdDev = 2) {
    if (data.length < period) return null;
    
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const window = data.slice(i - period + 1, i + 1);
      const closePrices = window.map(item => item.close);
      
      // 计算移动平均线
      const ma = closePrices.reduce((acc, val) => acc + val, 0) / period;
      
      // 计算标准差
      const variance = closePrices.reduce((acc, val) => acc + Math.pow(val - ma, 2), 0) / period;
      const std = Math.sqrt(variance);
      
      // 计算上下轨
      const upper = ma + stdDev * std;
      const lower = ma - stdDev * std;
      
      result.push({
        timestamp: data[i].timestamp,
        upper: upper,
        middle: ma,
        lower: lower,
        width: ((upper - lower) / ma) * 100 // 宽度百分比
      });
    }
    
    return result;
  }

  // 计算随机指标
  static calculateStochastic(data, kPeriod = 14, dPeriod = 3) {
    if (data.length < kPeriod + dPeriod) return null;
    
    const result = [];
    const kValues = [];
    
    // 计算%K
    for (let i = kPeriod - 1; i < data.length; i++) {
      const window = data.slice(i - kPeriod + 1, i + 1);
      const high = Math.max(...window.map(item => item.high));
      const low = Math.min(...window.map(item => item.low));
      const close = data[i].close;
      
      const k = ((close - low) / (high - low)) * 100;
      kValues.push({
        timestamp: data[i].timestamp,
        value: k
      });
    }
    
    // 计算%D
    for (let i = dPeriod - 1; i < kValues.length; i++) {
      const dWindow = kValues.slice(i - dPeriod + 1, i + 1);
      const d = dWindow.reduce((acc, val) => acc + val.value, 0) / dPeriod;
      
      result.push({
        timestamp: kValues[i].timestamp,
        k: kValues[i].value,
        d: d
      });
    }
    
    return result;
  }

  // 计算ADX
  static calculateADX(data, period = 14) {
    if (data.length < period * 2) return null;
    
    const result = [];
    const dxValues = [];
    
    // 计算+DM, -DM, TR
    for (let i = 1; i < data.length; i++) {
      const highDiff = data[i].high - data[i - 1].high;
      const lowDiff = data[i - 1].low - data[i].low;
      
      const plusDM = highDiff > lowDiff && highDiff > 0 ? highDiff : 0;
      const minusDM = lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0;
      
      const tr = Math.max(
        data[i].high - data[i].low,
        Math.abs(data[i].high - data[i - 1].close),
        Math.abs(data[i].low - data[i - 1].close)
      );
      
      dxValues.push({
        timestamp: data[i].timestamp,
        plusDM,
        minusDM,
        tr
      });
    }
    
    // 计算ATR
    let atr = dxValues.slice(0, period).reduce((acc, val) => acc + val.tr, 0) / period;
    
    // 计算+DI, -DI
    let plusDI = dxValues.slice(0, period).reduce((acc, val) => acc + val.plusDM, 0) / atr * 100;
    let minusDI = dxValues.slice(0, period).reduce((acc, val) => acc + val.minusDM, 0) / atr * 100;
    
    // 计算DX
    let dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
    
    // 计算ADX
    let adx = dx;
    result.push({
      timestamp: dxValues[period - 1].timestamp,
      adx: adx,
      plusDI: plusDI,
      minusDI: minusDI
    });
    
    // 计算后续ADX值
    for (let i = period; i < dxValues.length; i++) {
      atr = (atr * (period - 1) + dxValues[i].tr) / period;
      plusDI = (plusDI * (period - 1) + dxValues[i].plusDM) / atr * 100;
      minusDI = (minusDI * (period - 1) + dxValues[i].minusDM) / atr * 100;
      dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
      adx = (adx * (period - 1) + dx) / period;
      
      result.push({
        timestamp: dxValues[i].timestamp,
        adx: adx,
        plusDI: plusDI,
        minusDI: minusDI
      });
    }
    
    return result;
  }

  // 计算CCI
  static calculateCCI(data, period = 20) {
    if (data.length < period) return null;
    
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const window = data.slice(i - period + 1, i + 1);
      
      // 计算典型价格
      const typicalPrices = window.map(item => (item.high + item.low + item.close) / 3);
      
      // 计算均值
      const mean = typicalPrices.reduce((acc, val) => acc + val, 0) / period;
      
      // 计算平均绝对偏差
      const mad = typicalPrices.reduce((acc, val) => acc + Math.abs(val - mean), 0) / period;
      
      // 计算CCI
      const cci = (typicalPrices[typicalPrices.length - 1] - mean) / (0.015 * mad);
      
      result.push({
        timestamp: data[i].timestamp,
        value: cci
      });
    }
    
    return result;
  }

  // 计算Williams %R
  static calculateWilliamsR(data, period = 14) {
    if (data.length < period) return null;
    
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const window = data.slice(i - period + 1, i + 1);
      const high = Math.max(...window.map(item => item.high));
      const low = Math.min(...window.map(item => item.low));
      const close = data[i].close;
      
      const williamsR = ((high - close) / (high - low)) * -100;
      
      result.push({
        timestamp: data[i].timestamp,
        value: williamsR
      });
    }
    
    return result;
  }

  // 计算动量
  static calculateMomentum(data, period = 10) {
    if (data.length < period + 1) return null;
    
    const result = [];
    
    for (let i = period; i < data.length; i++) {
      const momentum = data[i].close - data[i - period].close;
      
      result.push({
        timestamp: data[i].timestamp,
        value: momentum
      });
    }
    
    return result;
  }

  // 计算ROC
  static calculateROC(data, period = 12) {
    if (data.length < period + 1) return null;
    
    const result = [];
    
    for (let i = period; i < data.length; i++) {
      const roc = ((data[i].close - data[i - period].close) / data[i - period].close) * 100;
      
      result.push({
        timestamp: data[i].timestamp,
        value: roc
      });
    }
    
    return result;
  }

  // 计算VWAP
  static calculateVWAP(data, period = 20) {
    if (data.length < period) return null;
    
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const window = data.slice(i - period + 1, i + 1);
      
      let sumPV = 0;
      let sumVolume = 0;
      
      window.forEach(item => {
        const typicalPrice = (item.high + item.low + item.close) / 3;
        sumPV += typicalPrice * item.volume;
        sumVolume += item.volume;
      });
      
      const vwap = sumPV / sumVolume;
      
      result.push({
        timestamp: data[i].timestamp,
        value: vwap
      });
    }
    
    return result;
  }

  // 计算所有指标
  static calculateAllIndicators(data) {
    return {
      ma: {
        ma5: this.calculateMA(data, 5),
        ma10: this.calculateMA(data, 10),
        ma20: this.calculateMA(data, 20),
        ma50: this.calculateMA(data, 50),
        ma100: this.calculateMA(data, 100),
        ma200: this.calculateMA(data, 200)
      },
      rsi: this.calculateRSI(data, 14),
      macd: this.calculateMACD(data),
      bollinger: this.calculateBollingerBands(data),
      stochastic: this.calculateStochastic(data),
      adx: this.calculateADX(data),
      cci: this.calculateCCI(data),
      williamsR: this.calculateWilliamsR(data),
      momentum: this.calculateMomentum(data),
      roc: this.calculateROC(data),
      vwap: this.calculateVWAP(data)
    };
  }
}

// 交易策略
class TradingStrategies {
  // 趋势策略
  static trendStrategy(data, indicators) {
    const ma = indicators.ma;
    const macd = indicators.macd;
    const adx = indicators.adx;
    
    if (!ma.ma50 || !ma.ma200 || !macd || !adx) return null;
    
    const ma50 = ma.ma50[ma.ma50.length - 1].value;
    const ma200 = ma.ma200[ma.ma200.length - 1].value;
    const latestMacd = macd[macd.length - 1];
    const latestAdx = adx[adx.length - 1];
    
    let signal = 'hold';
    let strength = 0;
    
    // 检查移动平均线交叉
    const maCrossover = (ma50 - ma200) / ma200;
    
    // 检查MACD信号
    const macdSignal = latestMacd.macd > latestMacd.signal ? 1 : -1;
    
    // 检查ADX
    const adxStrength = latestAdx.adx > 25 ? 1 : 0;
    
    // 综合信号
    if (maCrossover > 0.01 && macdSignal > 0 && adxStrength > 0) {
      signal = 'buy';
      strength = (maCrossover * 100 + 50) * 0.5 + (latestAdx.adx / 50) * 0.5;
    } else if (maCrossover < -0.01 && macdSignal < 0 && adxStrength > 0) {
      signal = 'sell';
      strength = (Math.abs(maCrossover) * 100 + 50) * 0.5 + (latestAdx.adx / 50) * 0.5;
    }
    
    return {
      strategy: 'trend',
      signal,
      strength: Math.min(strength, 100),
      indicators: {
        maCrossover,
        macdSignal: latestMacd.macd - latestMacd.signal,
        adx: latestAdx.adx
      }
    };
  }

  // 震荡策略
  static oscillatorStrategy(data, indicators) {
    const rsi = indicators.rsi;
    const stochastic = indicators.stochastic;
    const cci = indicators.cci;
    const williamsR = indicators.williamsR;
    
    if (!rsi || !stochastic || !cci || !williamsR) return null;
    
    const latestRsi = rsi[rsi.length - 1].value;
    const latestStochastic = stochastic[stochastic.length - 1];
    const latestCci = cci[cci.length - 1].value;
    const latestWilliamsR = williamsR[williamsR.length - 1].value;
    
    let buySignals = 0;
    let sellSignals = 0;
    
    // RSI信号
    if (latestRsi < 30) buySignals++;
    if (latestRsi > 70) sellSignals++;
    
    // 随机指标信号
    if (latestStochastic.k < 20 && latestStochastic.d < 20) buySignals++;
    if (latestStochastic.k > 80 && latestStochastic.d > 80) sellSignals++;
    
    // CCI信号
    if (latestCci < -100) buySignals++;
    if (latestCci > 100) sellSignals++;
    
    // Williams %R信号
    if (latestWilliamsR < -80) buySignals++;
    if (latestWilliamsR > -20) sellSignals++;
    
    let signal = 'hold';
    let strength = 0;
    
    if (buySignals >= 2) {
      signal = 'buy';
      strength = (buySignals / 4) * 100;
    } else if (sellSignals >= 2) {
      signal = 'sell';
      strength = (sellSignals / 4) * 100;
    }
    
    return {
      strategy: 'oscillator',
      signal,
      strength,
      indicators: {
        rsi: latestRsi,
        stochasticK: latestStochastic.k,
        cci: latestCci,
        williamsR: latestWilliamsR,
        buySignals,
        sellSignals
      }
    };
  }

  // 突破策略
  static breakoutStrategy(data, indicators) {
    const bollinger = indicators.bollinger;
    const volume = data.slice(-20);
    
    if (!bollinger) return null;
    
    const latestBollinger = bollinger[bollinger.length - 1];
    const latestPrice = data[data.length - 1].close;
    
    // 计算成交量变化
    const recentVolume = volume.slice(-5).reduce((acc, item) => acc + item.volume, 0) / 5;
    const averageVolume = volume.reduce((acc, item) => acc + item.volume, 0) / 20;
    const volumeRatio = recentVolume / averageVolume;
    
    let signal = 'hold';
    let strength = 0;
    
    // 检查突破
    const upperBreakout = latestPrice > latestBollinger.upper;
    const lowerBreakout = latestPrice < latestBollinger.lower;
    
    if (upperBreakout && volumeRatio > 1.5) {
      signal = 'buy';
      strength = (volumeRatio - 1.5) * 50 + (latestPrice - latestBollinger.upper) / latestBollinger.upper * 100;
    } else if (lowerBreakout && volumeRatio > 1.5) {
      signal = 'sell';
      strength = (volumeRatio - 1.5) * 50 + (latestBollinger.lower - latestPrice) / latestBollinger.lower * 100;
    }
    
    return {
      strategy: 'breakout',
      signal,
      strength: Math.min(strength, 100),
      indicators: {
        price: latestPrice,
        upper: latestBollinger.upper,
        lower: latestBollinger.lower,
        volumeRatio
      }
    };
  }

  // 均值回归策略
  static meanReversionStrategy(data, indicators) {
    const rsi = indicators.rsi;
    const bollinger = indicators.bollinger;
    
    if (!rsi || !bollinger) return null;
    
    const latestRsi = rsi[rsi.length - 1].value;
    const latestBollinger = bollinger[bollinger.length - 1];
    const latestPrice = data[data.length - 1].close;
    
    let signal = 'hold';
    let strength = 0;
    
    // 检查超卖
    if (latestRsi < 30 && latestPrice < latestBollinger.middle) {
      signal = 'buy';
      strength = (30 - latestRsi) * 3 + (latestBollinger.middle - latestPrice) / latestBollinger.middle * 100;
    } 
    // 检查超买
    else if (latestRsi > 70 && latestPrice > latestBollinger.middle) {
      signal = 'sell';
      strength = (latestRsi - 70) * 3 + (latestPrice - latestBollinger.middle) / latestBollinger.middle * 100;
    }
    
    return {
      strategy: 'meanReversion',
      signal,
      strength: Math.min(strength, 100),
      indicators: {
        rsi: latestRsi,
        price: latestPrice,
        middle: latestBollinger.middle,
        bollingerWidth: latestBollinger.width
      }
    };
  }

  // 多因子策略
  static multiFactorStrategy(data, indicators) {
    const ma = indicators.ma;
    const rsi = indicators.rsi;
    const macd = indicators.macd;
    const volume = data.slice(-20);
    
    if (!ma.ma50 || !ma.ma200 || !rsi || !macd) return null;
    
    const ma50 = ma.ma50[ma.ma50.length - 1].value;
    const ma200 = ma.ma200[ma.ma200.length - 1].value;
    const latestRsi = rsi[rsi.length - 1].value;
    const latestMacd = macd[macd.length - 1];
    
    // 计算成交量变化
    const recentVolume = volume.slice(-5).reduce((acc, item) => acc + item.volume, 0) / 5;
    const averageVolume = volume.reduce((acc, item) => acc + item.volume, 0) / 20;
    const volumeRatio = recentVolume / averageVolume;
    
    // 计算各因子得分
    const maScore = ma50 > ma200 ? 1 : 0;
    const rsiScore = latestRsi > 50 ? 1 : 0;
    const macdScore = latestMacd.macd > latestMacd.signal ? 1 : 0;
    const volumeScore = volumeRatio > 1.2 ? 1 : 0;
    
    // 计算加权得分
    const weights = strategyConfig.multiFactor.parameters.weightage;
    const totalScore = 
      maScore * weights.ma +
      rsiScore * weights.rsi +
      macdScore * weights.macd +
      volumeScore * weights.volume;
    
    let signal = 'hold';
    let strength = totalScore * 100;
    
    if (totalScore > 0.6) {
      signal = 'buy';
    } else if (totalScore < 0.4) {
      signal = 'sell';
    }
    
    return {
      strategy: 'multiFactor',
      signal,
      strength,
      indicators: {
        maCrossover: ma50 > ma200,
        rsi: latestRsi,
        macdSignal: latestMacd.macd > latestMacd.signal,
        volumeRatio
      }
    };
  }

  // 执行所有策略
  static executeAllStrategies(data) {
    const indicators = TechnicalIndicators.calculateAllIndicators(data);
    const strategies = [];
    
    // 执行各个策略
    if (strategyConfig.trend.enabled) {
      const trendResult = this.trendStrategy(data, indicators);
      if (trendResult) strategies.push(trendResult);
    }
    
    if (strategyConfig.oscillator.enabled) {
      const oscillatorResult = this.oscillatorStrategy(data, indicators);
      if (oscillatorResult) strategies.push(oscillatorResult);
    }
    
    if (strategyConfig.breakout.enabled) {
      const breakoutResult = this.breakoutStrategy(data, indicators);
      if (breakoutResult) strategies.push(breakoutResult);
    }
    
    if (strategyConfig.meanReversion.enabled) {
      const meanReversionResult = this.meanReversionStrategy(data, indicators);
      if (meanReversionResult) strategies.push(meanReversionResult);
    }
    
    if (strategyConfig.multiFactor.enabled) {
      const multiFactorResult = this.multiFactorStrategy(data, indicators);
      if (multiFactorResult) strategies.push(multiFactorResult);
    }
    
    // 综合策略结果
    const finalSignal = this.combineSignals(strategies);
    
    return {
      strategies,
      finalSignal,
      timestamp: new Date().toISOString()
    };
  }

  // 综合信号
  static combineSignals(strategies) {
    if (strategies.length === 0) {
      return {
        signal: 'hold',
        strength: 0,
        strategyCount: 0
      };
    }
    
    let buyStrength = 0;
    let sellStrength = 0;
    let buyCount = 0;
    let sellCount = 0;
    
    strategies.forEach(strategy => {
      if (strategy.signal === 'buy') {
        buyStrength += strategy.strength;
        buyCount++;
      } else if (strategy.signal === 'sell') {
        sellStrength += strategy.strength;
        sellCount++;
      }
    });
    
    let signal = 'hold';
    let strength = 0;
    
    if (buyCount > sellCount) {
      signal = 'buy';
      strength = buyStrength / buyCount;
    } else if (sellCount > buyCount) {
      signal = 'sell';
      strength = sellStrength / sellCount;
    }
    
    return {
      signal,
      strength: Math.min(strength, 100),
      strategyCount: strategies.length,
      buyCount,
      sellCount
    };
  }
}

// 技术分析管理器
const technicalAnalysisManager = {
  indicatorConfig,
  strategyConfig,
  TechnicalIndicators,
  TradingStrategies,

  // 分析数据
  analyze(data) {
    try {
      const indicators = TechnicalIndicators.calculateAllIndicators(data);
      const strategies = TradingStrategies.executeAllStrategies(data);
      
      return {
        success: true,
        indicators,
        strategies,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('技术分析失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 获取交易信号
  getTradingSignal(data) {
    try {
      const strategies = TradingStrategies.executeAllStrategies(data);
      return strategies.finalSignal;
    } catch (error) {
      logger.error('获取交易信号失败:', error);
      return {
        signal: 'hold',
        strength: 0,
        error: error.message
      };
    }
  },

  // 回测策略
  backtest(data, strategyName) {
    try {
      // 简化的回测逻辑
      const results = [];
      let balance = 10000;
      let position = 0;
      
      for (let i = 50; i < data.length; i++) {
        const window = data.slice(0, i + 1);
        const signal = this.getTradingSignal(window);
        
        if (signal.signal === 'buy' && position === 0) {
          position = balance / data[i].close;
          balance = 0;
        } else if (signal.signal === 'sell' && position > 0) {
          balance = position * data[i].close;
          position = 0;
        }
        
        results.push({
          timestamp: data[i].timestamp,
          price: data[i].close,
          signal: signal.signal,
          balance: balance + (position * data[i].close),
          position
        });
      }
      
      const finalBalance = balance + (position * data[data.length - 1].close);
      const returns = ((finalBalance - 10000) / 10000) * 100;
      
      return {
        success: true,
        initialBalance: 10000,
        finalBalance,
        returns,
        trades: results.filter(r => r.signal !== 'hold').length,
        results
      };
    } catch (error) {
      logger.error('回测失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

module.exports = {
  indicatorConfig,
  strategyConfig,
  TechnicalIndicators,
  TradingStrategies,
  technicalAnalysisManager
};
