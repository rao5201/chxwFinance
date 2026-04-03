/**
 * 金融分析工具模块
 * 提供技术指标分析、基本面分析、风险管理、投资组合分析和市场情绪分析等功能
 */

const { logger } = require('./logger');

// 技术指标分析
class TechnicalAnalysis {
  // 移动平均线 (MA)
  static calculateMA(data, period) {
    if (data.length < period) {
      throw new Error(`数据长度不足，需要至少${period}个数据点`);
    }

    const ma = [];
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      ma.push({
        timestamp: data[i].timestamp,
        value: sum / period
      });
    }
    return ma;
  }

  // 指数移动平均线 (EMA)
  static calculateEMA(data, period) {
    if (data.length < period) {
      throw new Error(`数据长度不足，需要至少${period}个数据点`);
    }

    const ema = [];
    const multiplier = 2 / (period + 1);
    
    // 计算第一个EMA值（使用简单移动平均）
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i].close;
    }
    const firstEMA = sum / period;
    ema.push({
      timestamp: data[period - 1].timestamp,
      value: firstEMA
    });

    // 计算剩余的EMA值
    for (let i = period; i < data.length; i++) {
      const currentEMA = (data[i].close - ema[ema.length - 1].value) * multiplier + ema[ema.length - 1].value;
      ema.push({
        timestamp: data[i].timestamp,
        value: currentEMA
      });
    }
    return ema;
  }

  // MACD指标
  static calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (data.length < slowPeriod + signalPeriod) {
      throw new Error(`数据长度不足，需要至少${slowPeriod + signalPeriod}个数据点`);
    }

    // 计算快速EMA
    const fastEMA = this.calculateEMA(data, fastPeriod);
    // 计算慢速EMA
    const slowEMA = this.calculateEMA(data, slowPeriod);
    
    // 计算MACD线
    const macdLine = [];
    for (let i = 0; i < fastEMA.length && i < slowEMA.length; i++) {
      macdLine.push({
        timestamp: fastEMA[i].timestamp,
        value: fastEMA[i].value - slowEMA[i].value
      });
    }

    // 计算信号线
    const signalLine = this.calculateEMA(macdLine, signalPeriod);

    // 计算柱状图
    const histogram = [];
    for (let i = 0; i < macdLine.length && i < signalLine.length; i++) {
      histogram.push({
        timestamp: macdLine[i].timestamp,
        value: macdLine[i].value - signalLine[i].value
      });
    }

    return {
      macdLine,
      signalLine,
      histogram
    };
  }

  // RSI指标
  static calculateRSI(data, period = 14) {
    if (data.length < period + 1) {
      throw new Error(`数据长度不足，需要至少${period + 1}个数据点`);
    }

    const rsi = [];
    let gains = 0;
    let losses = 0;

    // 计算初始的涨跌
    for (let i = 1; i <= period; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    // 计算第一个RSI值
    const firstAvgGain = gains / period;
    const firstAvgLoss = losses / period;
    const firstRS = firstAvgGain / firstAvgLoss;
    const firstRSI = 100 - (100 / (1 + firstRS));

    rsi.push({
      timestamp: data[period].timestamp,
      value: firstRSI
    });

    // 计算剩余的RSI值
    for (let i = period + 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      let currentGain = 0;
      let currentLoss = 0;

      if (change > 0) {
        currentGain = change;
      } else {
        currentLoss = Math.abs(change);
      }

      const avgGain = (rsi[rsi.length - 1].avgGain * (period - 1) + currentGain) / period;
      const avgLoss = (rsi[rsi.length - 1].avgLoss * (period - 1) + currentLoss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const currentRSI = 100 - (100 / (1 + rs));

      rsi.push({
        timestamp: data[i].timestamp,
        value: currentRSI,
        avgGain,
        avgLoss
      });
    }

    return rsi;
  }

  // KDJ指标
  static calculateKDJ(data, period = 9, kPeriod = 3, dPeriod = 3) {
    if (data.length < period) {
      throw new Error(`数据长度不足，需要至少${period}个数据点`);
    }

    const kdj = [];
    
    // 计算RSV值
    for (let i = period - 1; i < data.length; i++) {
      let highest = data[i].high;
      let lowest = data[i].low;

      for (let j = 0; j < period; j++) {
        if (data[i - j].high > highest) {
          highest = data[i - j].high;
        }
        if (data[i - j].low < lowest) {
          lowest = data[i - j].low;
        }
      }

      const close = data[i].close;
      const rsv = (close - lowest) / (highest - lowest) * 100;

      // 计算K值
      let k;
      if (i === period - 1) {
        k = 50; // 初始值
      } else {
        const prevK = kdj[kdj.length - 1].k;
        k = (2 / kPeriod) * rsv + (1 - 2 / kPeriod) * prevK;
      }

      // 计算D值
      let d;
      if (i === period - 1) {
        d = 50; // 初始值
      } else {
        const prevD = kdj[kdj.length - 1].d;
        d = (2 / dPeriod) * k + (1 - 2 / dPeriod) * prevD;
      }

      // 计算J值
      const j = 3 * k - 2 * d;

      kdj.push({
        timestamp: data[i].timestamp,
        k,
        d,
        j
      });
    }

    return kdj;
  }

  // 布林带
  static calculateBollingerBands(data, period = 20, stdDev = 2) {
    if (data.length < period) {
      throw new Error(`数据长度不足，需要至少${period}个数据点`);
    }

    const bollingerBands = [];

    for (let i = period - 1; i < data.length; i++) {
      // 计算移动平均线
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      const ma = sum / period;

      // 计算标准差
      let variance = 0;
      for (let j = 0; j < period; j++) {
        variance += Math.pow(data[i - j].close - ma, 2);
      }
      const std = Math.sqrt(variance / period);

      // 计算上轨和下轨
      const upperBand = ma + (stdDev * std);
      const lowerBand = ma - (stdDev * std);

      bollingerBands.push({
        timestamp: data[i].timestamp,
        middleBand: ma,
        upperBand,
        lowerBand,
        close: data[i].close
      });
    }

    return bollingerBands;
  }
}

// 基本面分析工具
class FundamentalAnalysis {
  // 计算市盈率 (P/E)
  static calculatePE(price, earningsPerShare) {
    if (earningsPerShare === 0) {
      throw new Error('每股收益不能为零');
    }
    return price / earningsPerShare;
  }

  // 计算市净率 (P/B)
  static calculatePB(price, bookValuePerShare) {
    if (bookValuePerShare === 0) {
      throw new Error('每股净资产不能为零');
    }
    return price / bookValuePerShare;
  }

  // 计算市销率 (P/S)
  static calculatePS(price, salesPerShare) {
    if (salesPerShare === 0) {
      throw new Error('每股销售额不能为零');
    }
    return price / salesPerShare;
  }

  // 计算股息收益率
  static calculateDividendYield(annualDividend, price) {
    if (price === 0) {
      throw new Error('价格不能为零');
    }
    return (annualDividend / price) * 100;
  }

  // 计算ROE (净资产收益率)
  static calculateROE(netIncome, shareholdersEquity) {
    if (shareholdersEquity === 0) {
      throw new Error('股东权益不能为零');
    }
    return (netIncome / shareholdersEquity) * 100;
  }

  // 计算ROA (资产收益率)
  static calculateROA(netIncome, totalAssets) {
    if (totalAssets === 0) {
      throw new Error('总资产不能为零');
    }
    return (netIncome / totalAssets) * 100;
  }

  // 计算资产负债率
  static calculateDebtToAssetRatio(totalDebt, totalAssets) {
    if (totalAssets === 0) {
      throw new Error('总资产不能为零');
    }
    return (totalDebt / totalAssets) * 100;
  }

  // 计算流动比率
  static calculateCurrentRatio(currentAssets, currentLiabilities) {
    if (currentLiabilities === 0) {
      throw new Error('流动负债不能为零');
    }
    return currentAssets / currentLiabilities;
  }

  // 计算速动比率
  static calculateQuickRatio(currentAssets, inventory, currentLiabilities) {
    if (currentLiabilities === 0) {
      throw new Error('流动负债不能为零');
    }
    return (currentAssets - inventory) / currentLiabilities;
  }
}

// 风险管理工具
class RiskManagement {
  // 计算波动率
  static calculateVolatility(returns, period = 252) {
    if (returns.length < 2) {
      throw new Error('需要至少2个收益数据点');
    }

    // 计算平均收益
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;

    // 计算方差
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / (returns.length - 1);

    // 计算年化波动率
    return Math.sqrt(variance * period);
  }

  // 计算最大回撤
  static calculateMaxDrawdown(prices) {
    if (prices.length < 2) {
      throw new Error('需要至少2个价格数据点');
    }

    let maxDrawdown = 0;
    let peak = prices[0];

    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
        peak = prices[i];
      }
      const drawdown = (peak - prices[i]) / peak * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  // 计算夏普比率
  static calculateSharpeRatio(returns, riskFreeRate = 0, period = 252) {
    if (returns.length < 2) {
      throw new Error('需要至少2个收益数据点');
    }

    // 计算平均收益
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;

    // 计算超额收益
    const excessReturn = meanReturn - riskFreeRate / period;

    // 计算波动率
    const volatility = this.calculateVolatility(returns, period);

    if (volatility === 0) {
      throw new Error('波动率不能为零');
    }

    return excessReturn / volatility * Math.sqrt(period);
  }

  // 计算索提诺比率
  static calculateSortinoRatio(returns, riskFreeRate = 0, period = 252) {
    if (returns.length < 2) {
      throw new Error('需要至少2个收益数据点');
    }

    // 计算平均收益
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;

    // 计算超额收益
    const excessReturn = meanReturn - riskFreeRate / period;

    // 计算下行波动率
    const negativeReturns = returns.filter(ret => ret < 0);
    if (negativeReturns.length === 0) {
      throw new Error('没有负收益数据点');
    }

    const meanNegativeReturn = negativeReturns.reduce((sum, ret) => sum + ret, 0) / negativeReturns.length;
    const downsideVariance = negativeReturns.reduce((sum, ret) => sum + Math.pow(ret - meanNegativeReturn, 2), 0) / negativeReturns.length;
    const downsideVolatility = Math.sqrt(downsideVariance * period);

    if (downsideVolatility === 0) {
      throw new Error('下行波动率不能为零');
    }

    return excessReturn / downsideVolatility * Math.sqrt(period);
  }

  // 计算贝塔系数
  static calculateBeta(assetReturns, marketReturns) {
    if (assetReturns.length !== marketReturns.length || assetReturns.length < 2) {
      throw new Error('资产收益和市场收益数据长度必须相同且至少为2');
    }

    // 计算资产和市场的平均收益
    const assetMean = assetReturns.reduce((sum, ret) => sum + ret, 0) / assetReturns.length;
    const marketMean = marketReturns.reduce((sum, ret) => sum + ret, 0) / marketReturns.length;

    // 计算协方差和市场方差
    let covariance = 0;
    let marketVariance = 0;

    for (let i = 0; i < assetReturns.length; i++) {
      covariance += (assetReturns[i] - assetMean) * (marketReturns[i] - marketMean);
      marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
    }

    if (marketVariance === 0) {
      throw new Error('市场方差不能为零');
    }

    return covariance / marketVariance;
  }
}

// 投资组合分析工具
class PortfolioAnalysis {
  // 计算投资组合预期收益
  static calculatePortfolioReturn(weights, returns) {
    if (weights.length !== returns.length) {
      throw new Error('权重和收益数组长度必须相同');
    }

    // 检查权重和是否为1
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(weightSum - 1) > 0.001) {
      throw new Error('权重和必须为1');
    }

    let portfolioReturn = 0;
    for (let i = 0; i < weights.length; i++) {
      portfolioReturn += weights[i] * returns[i];
    }

    return portfolioReturn;
  }

  // 计算投资组合风险
  static calculatePortfolioRisk(weights, covMatrix) {
    if (weights.length !== covMatrix.length) {
      throw new Error('权重数组长度必须与协方差矩阵维度相同');
    }

    // 检查权重和是否为1
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(weightSum - 1) > 0.001) {
      throw new Error('权重和必须为1');
    }

    // 计算投资组合方差
    let portfolioVariance = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        portfolioVariance += weights[i] * weights[j] * covMatrix[i][j];
      }
    }

    return Math.sqrt(portfolioVariance);
  }

  // 计算有效前沿
  static calculateEfficientFrontier(returns, covMatrix, numPortfolios = 1000) {
    const numAssets = returns.length;
    const portfolios = [];

    for (let i = 0; i < numPortfolios; i++) {
      // 生成随机权重
      const weights = [];
      let sum = 0;
      for (let j = 0; j < numAssets; j++) {
        const weight = Math.random();
        weights.push(weight);
        sum += weight;
      }
      // 归一化权重
      for (let j = 0; j < numAssets; j++) {
        weights[j] /= sum;
      }

      // 计算投资组合收益和风险
      const portfolioReturn = this.calculatePortfolioReturn(weights, returns);
      const portfolioRisk = this.calculatePortfolioRisk(weights, covMatrix);

      portfolios.push({
        weights,
        return: portfolioReturn,
        risk: portfolioRisk,
        sharpeRatio: portfolioRisk > 0 ? portfolioReturn / portfolioRisk : 0
      });
    }

    // 按风险排序
    portfolios.sort((a, b) => a.risk - b.risk);

    return portfolios;
  }

  // 计算最优投资组合（最大夏普比率）
  static calculateOptimalPortfolio(returns, covMatrix) {
    const numPortfolios = 10000;
    const portfolios = this.calculateEfficientFrontier(returns, covMatrix, numPortfolios);

    // 找到最大夏普比率的投资组合
    let optimalPortfolio = portfolios[0];
    for (const portfolio of portfolios) {
      if (portfolio.sharpeRatio > optimalPortfolio.sharpeRatio) {
        optimalPortfolio = portfolio;
      }
    }

    return optimalPortfolio;
  }
}

// 市场情绪分析工具
class MarketSentimentAnalysis {
  // 计算恐惧与贪婪指数
  static calculateFearAndGreedIndex(marketData) {
    // 这里是一个简化的实现，实际应该使用更多的市场指标
    // 包括市场动量、波动性、put/call比率、市场宽度等
    
    const { priceChange, volumeChange, volatility, marketBreadth } = marketData;

    // 计算各个指标的得分
    const momentumScore = priceChange > 0 ? Math.min(priceChange * 10, 100) : Math.max(priceChange * 10, 0);
    const volumeScore = volumeChange > 0 ? Math.min(volumeChange * 5, 100) : Math.max(volumeChange * 5, 0);
    const volatilityScore = Math.max(100 - volatility * 10, 0);
    const breadthScore = marketBreadth > 0.5 ? marketBreadth * 200 : marketBreadth * 200;

    // 计算综合得分
    const totalScore = (momentumScore + volumeScore + volatilityScore + breadthScore) / 4;

    // 确定情绪级别
    let sentiment;
    if (totalScore >= 75) {
      sentiment = '极度贪婪';
    } else if (totalScore >= 60) {
      sentiment = '贪婪';
    } else if (totalScore >= 40) {
      sentiment = '中性';
    } else if (totalScore >= 25) {
      sentiment = '恐惧';
    } else {
      sentiment = '极度恐惧';
    }

    return {
      score: totalScore,
      sentiment
    };
  }

  // 分析市场趋势
  static analyzeMarketTrend(priceData, period = 50) {
    if (priceData.length < period) {
      throw new Error(`数据长度不足，需要至少${period}个数据点`);
    }

    // 计算移动平均线
    const ma = TechnicalAnalysis.calculateMA(priceData, period);

    // 分析趋势
    const latestPrice = priceData[priceData.length - 1].close;
    const latestMA = ma[ma.length - 1].value;
    const previousMA = ma[ma.length - 2].value;

    let trend;
    if (latestPrice > latestMA && latestMA > previousMA) {
      trend = '上升趋势';
    } else if (latestPrice < latestMA && latestMA < previousMA) {
      trend = '下降趋势';
    } else {
      trend = '横盘整理';
    }

    return {
      trend,
      currentPrice: latestPrice,
      movingAverage: latestMA,
      maDirection: latestMA > previousMA ? '上升' : '下降'
    };
  }
}

// 导出
module.exports = {
  TechnicalAnalysis,
  FundamentalAnalysis,
  RiskManagement,
  PortfolioAnalysis,
  MarketSentimentAnalysis
};
