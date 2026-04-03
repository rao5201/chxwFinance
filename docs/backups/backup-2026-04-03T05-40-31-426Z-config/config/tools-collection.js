/**
 * 茶海虾王@金融交易所看板平台 - 工具集合模块
 * 包含各种实用工具：计算器、转换器、生成器等
 */

const { logger } = require('./logger');

// 工具集合配置
const toolsConfig = {
  // 金融计算器
  financialCalculators: {
    enabled: true,
    tools: [
      'compoundInterest',      // 复利计算器
      'loanCalculator',        // 贷款计算器
      'investmentReturn',      // 投资回报率计算器
      'riskAssessment',        // 风险评估工具
      'portfolioAnalyzer',     // 投资组合分析器
      'optionPricing',         // 期权定价计算器
      'bondYield',            // 债券收益率计算器
      'currencyConverter'      // 货币转换器
    ]
  },
  
  // 数据转换工具
  converters: {
    enabled: true,
    tools: [
      'unitConverter',         // 单位转换器
      'timeConverter',         // 时间转换器
      'dataSizeConverter',     // 数据大小转换器
      'coordinateConverter',   // 坐标转换器
      'colorConverter',        // 颜色转换器
      'baseConverter'          // 进制转换器
    ]
  },
  
  // 生成器工具
  generators: {
    enabled: true,
    tools: [
      'passwordGenerator',     // 密码生成器
      'qrCodeGenerator',       // 二维码生成器
      'barcodeGenerator',      // 条形码生成器
      'uuidGenerator',         // UUID生成器
      'loremIpsum',           // 假文生成器
      'colorPalette',         // 调色板生成器
      'gradientGenerator'      // 渐变生成器
    ]
  },
  
  // 文本工具
  textTools: {
    enabled: true,
    tools: [
      'textDiff',             // 文本对比
      'textStatistics',       // 文本统计
      'caseConverter',        // 大小写转换
      'markdownEditor',       // Markdown编辑器
      'jsonFormatter',        // JSON格式化
      'regexTester',          // 正则表达式测试
      'wordCounter'           // 字数统计
    ]
  },
  
  // 开发工具
  devTools: {
    enabled: true,
    tools: [
      'codeFormatter',        // 代码格式化
      'apiTester',           // API测试工具
      'jwtDecoder',          // JWT解码器
      'base64Encoder',       // Base64编解码
      'urlEncoder',          // URL编解码
      'hashGenerator',       // 哈希生成器
      'timestampConverter'   // 时间戳转换器
    ]
  },
  
  // 图片工具
  imageTools: {
    enabled: true,
    tools: [
      'imageCompressor',      // 图片压缩
      'imageConverter',       // 图片格式转换
      'imageResizer',         // 图片尺寸调整
      'imageCropper',         // 图片裁剪
      'svgOptimizer',         // SVG优化
      'faviconGenerator'      // 网站图标生成
    ]
  }
};

// 金融计算工具
const financialTools = {
  // 复利计算器
  calculateCompoundInterest(principal, rate, time, frequency = 12) {
    const r = rate / 100;
    const n = frequency;
    const t = time;
    const amount = principal * Math.pow(1 + r/n, n*t);
    const interest = amount - principal;
    
    return {
      principal,
      rate,
      time,
      frequency,
      finalAmount: parseFloat(amount.toFixed(2)),
      totalInterest: parseFloat(interest.toFixed(2)),
      yearlyBreakdown: this.generateYearlyBreakdown(principal, rate, time, frequency)
    };
  },
  
  // 生成年度明细
  generateYearlyBreakdown(principal, rate, time, frequency) {
    const breakdown = [];
    let currentAmount = principal;
    const r = rate / 100;
    
    for (let year = 1; year <= time; year++) {
      const startAmount = currentAmount;
      currentAmount = currentAmount * Math.pow(1 + r/frequency, frequency);
      const yearlyInterest = currentAmount - startAmount;
      
      breakdown.push({
        year,
        startAmount: parseFloat(startAmount.toFixed(2)),
        endAmount: parseFloat(currentAmount.toFixed(2)),
        interest: parseFloat(yearlyInterest.toFixed(2))
      });
    }
    
    return breakdown;
  },
  
  // 贷款计算器
  calculateLoan(principal, annualRate, years, type = 'equal_payment') {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    if (type === 'equal_payment') {
      // 等额本息
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                            (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - principal;
      
      return {
        type: '等额本息',
        principal,
        annualRate,
        years,
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        totalPayment: parseFloat(totalPayment.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        schedule: this.generateLoanSchedule(principal, monthlyRate, months, monthlyPayment)
      };
    } else {
      // 等额本金
      const monthlyPrincipal = principal / months;
      const schedule = [];
      let totalInterest = 0;
      
      for (let month = 1; month <= months; month++) {
        const remainingPrincipal = principal - (monthlyPrincipal * (month - 1));
        const monthlyInterest = remainingPrincipal * monthlyRate;
        const monthlyPayment = monthlyPrincipal + monthlyInterest;
        totalInterest += monthlyInterest;
        
        schedule.push({
          month,
          principal: parseFloat(monthlyPrincipal.toFixed(2)),
          interest: parseFloat(monthlyInterest.toFixed(2)),
          payment: parseFloat(monthlyPayment.toFixed(2)),
          remaining: parseFloat((remainingPrincipal - monthlyPrincipal).toFixed(2))
        });
      }
      
      return {
        type: '等额本金',
        principal,
        annualRate,
        years,
        monthlyPrincipal: parseFloat(monthlyPrincipal.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalPayment: parseFloat((principal + totalInterest).toFixed(2)),
        schedule
      };
    }
  },
  
  // 生成还款计划
  generateLoanSchedule(principal, monthlyRate, months, monthlyPayment) {
    const schedule = [];
    let remaining = principal;
    
    for (let month = 1; month <= months; month++) {
      const interest = remaining * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      remaining -= principalPaid;
      
      schedule.push({
        month,
        payment: parseFloat(monthlyPayment.toFixed(2)),
        principal: parseFloat(principalPaid.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
        remaining: parseFloat(Math.max(0, remaining).toFixed(2))
      });
    }
    
    return schedule;
  },
  
  // 投资回报率计算
  calculateROI(initialInvestment, finalValue, years) {
    const totalReturn = finalValue - initialInvestment;
    const roi = (totalReturn / initialInvestment) * 100;
    const annualizedReturn = (Math.pow(finalValue / initialInvestment, 1/years) - 1) * 100;
    
    return {
      initialInvestment,
      finalValue,
      years,
      totalReturn: parseFloat(totalReturn.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      annualizedReturn: parseFloat(annualizedReturn.toFixed(2))
    };
  },
  
  // 货币转换
  convertCurrency(amount, fromCurrency, toCurrency, rates) {
    const rate = rates[`${fromCurrency}_${toCurrency}`] || 1;
    const converted = amount * rate;
    
    return {
      amount,
      fromCurrency,
      toCurrency,
      rate,
      converted: parseFloat(converted.toFixed(2)),
      timestamp: new Date().toISOString()
    };
  }
};

// 转换工具
const converterTools = {
  // 单位转换
  convertUnit(value, fromUnit, toUnit, type) {
    const conversionRates = {
      length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        inch: 0.0254,
        foot: 0.3048,
        yard: 0.9144,
        mile: 1609.34
      },
      weight: {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.453592,
        oz: 0.0283495,
        ton: 1000
      },
      temperature: {
        celsius: 'C',
        fahrenheit: 'F',
        kelvin: 'K'
      },
      area: {
        sqm: 1,
        sqkm: 1000000,
        sqft: 0.092903,
        acre: 4046.86,
        hectare: 10000
      },
      volume: {
        liter: 1,
        ml: 0.001,
        gallon: 3.78541,
        quart: 0.946353,
        pint: 0.473176,
        cup: 0.24
      }
    };
    
    if (type === 'temperature') {
      return this.convertTemperature(value, fromUnit, toUnit);
    }
    
    const rates = conversionRates[type];
    if (!rates) {
      return { error: '不支持的转换类型' };
    }
    
    const baseValue = value * rates[fromUnit];
    const result = baseValue / rates[toUnit];
    
    return {
      value,
      fromUnit,
      toUnit,
      type,
      result: parseFloat(result.toFixed(6)),
      formula: `1 ${fromUnit} = ${(rates[fromUnit] / rates[toUnit]).toFixed(6)} ${toUnit}`
    };
  },
  
  // 温度转换
  convertTemperature(value, from, to) {
    let celsius;
    
    // 先转换为摄氏度
    switch (from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
    }
    
    // 再转换为目标单位
    let result;
    switch (to) {
      case 'celsius':
        result = celsius;
        break;
      case 'fahrenheit':
        result = celsius * 9/5 + 32;
        break;
      case 'kelvin':
        result = celsius + 273.15;
        break;
    }
    
    return {
      value,
      fromUnit: from,
      toUnit: to,
      type: 'temperature',
      result: parseFloat(result.toFixed(2))
    };
  },
  
  // 进制转换
  convertBase(number, fromBase, toBase) {
    try {
      const decimal = parseInt(number, fromBase);
      const result = decimal.toString(toBase).toUpperCase();
      
      return {
        original: number,
        fromBase,
        toBase,
        decimal,
        result,
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        decimal: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase()
      };
    } catch (error) {
      return { error: '转换失败，请检查输入' };
    }
  },
  
  // 时间戳转换
  convertTimestamp(timestamp, format = 'datetime') {
    const date = new Date(timestamp);
    
    if (format === 'datetime') {
      return {
        timestamp,
        date: date.toISOString(),
        local: date.toLocaleString('zh-CN'),
        utc: date.toUTCString(),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        weekday: date.toLocaleDateString('zh-CN', { weekday: 'long' })
      };
    } else if (format === 'relative') {
      const now = Date.now();
      const diff = now - timestamp;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      let relative;
      if (days > 0) relative = `${days}天前`;
      else if (hours > 0) relative = `${hours}小时前`;
      else if (minutes > 0) relative = `${minutes}分钟前`;
      else relative = `${seconds}秒前`;
      
      return { timestamp, relative };
    }
  }
};

// 生成器工具
const generatorTools = {
  // 密码生成器
  generatePassword(length = 12, options = {}) {
    const {
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true
    } = options;
    
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let charset = '';
    if (uppercase) charset += chars.uppercase;
    if (lowercase) charset += chars.lowercase;
    if (numbers) charset += chars.numbers;
    if (symbols) charset += chars.symbols;
    
    if (charset === '') charset = chars.lowercase;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // 计算密码强度
    const strength = this.calculatePasswordStrength(password);
    
    return {
      password,
      length,
      strength,
      options
    };
  },
  
  // 计算密码强度
  calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    const strengthMap = {
      0: '非常弱',
      1: '弱',
      2: '一般',
      3: '中等',
      4: '强',
      5: '很强',
      6: '极强'
    };
    
    return {
      score,
      level: strengthMap[score] || '未知'
    };
  },
  
  // UUID生成器
  generateUUID(version = 'v4') {
    if (version === 'v4') {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    return null;
  },
  
  // 假文生成器
  generateLoremIpsum(paragraphs = 3, sentencesPerParagraph = 5) {
    const words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
      'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit'
    ];
    
    const result = [];
    
    for (let p = 0; p < paragraphs; p++) {
      const paragraph = [];
      for (let s = 0; s < sentencesPerParagraph; s++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let w = 0; w < sentenceLength; w++) {
          sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        paragraph.push(sentence.join(' ') + '.');
      }
      result.push(paragraph.join(' '));
    }
    
    return {
      paragraphs,
      sentencesPerParagraph,
      text: result.join('\n\n'),
      wordCount: result.join(' ').split(' ').length
    };
  },
  
  // 颜色调色板生成器
  generateColorPalette(baseColor, count = 5) {
    const palette = [];
    
    // 生成类似色
    for (let i = 0; i < count; i++) {
      const hue = (i * 360 / count) % 360;
      const color = this.hslToHex(hue, 70, 50);
      palette.push({
        hex: color,
        hsl: `hsl(${hue}, 70%, 50%)`,
        rgb: this.hexToRgb(color)
      });
    }
    
    return {
      baseColor,
      count,
      palette
    };
  },
  
  // HSL转HEX
  hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    const toHex = (n) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },
  
  // HEX转RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
};

// 文本工具
const textTools = {
  // 文本统计
  analyzeText(text) {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const lines = text.split('\n').length;
    
    // 计算阅读时间（平均每分钟200字）
    const readingTime = Math.ceil(words / 200);
    
    return {
      characters: chars,
      charactersNoSpace: charsNoSpace,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      averageWordLength: (charsNoSpace / words).toFixed(2)
    };
  },
  
  // 大小写转换
  convertCase(text, type) {
    switch (type) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'camel':
        return text.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
                   .replace(/^./, c => c.toLowerCase());
      case 'snake':
        return text.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
                   .replace(/\s+/g, '_')
                   .replace(/^_/, '');
      case 'kebab':
        return text.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
                   .replace(/\s+/g, '-')
                   .replace(/^-/, '');
      default:
        return text;
    }
  },
  
  // JSON格式化
  formatJSON(json, indent = 2) {
    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      return {
        formatted: JSON.stringify(obj, null, indent),
        compact: JSON.stringify(obj),
        valid: true,
        type: Array.isArray(obj) ? 'array' : typeof obj
      };
    } catch (error) {
      return {
        error: '无效的JSON',
        valid: false
      };
    }
  },
  
  // 文本对比
  diffText(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const diff = [];
    
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        diff.push({ type: 'same', line: i + 1, content: line1 });
      } else if (!line2) {
        diff.push({ type: 'removed', line: i + 1, content: line1 });
      } else if (!line1) {
        diff.push({ type: 'added', line: i + 1, content: line2 });
      } else {
        diff.push({ type: 'modified', line: i + 1, oldContent: line1, newContent: line2 });
      }
    }
    
    return {
      totalLines: maxLines,
      changes: diff.filter(d => d.type !== 'same').length,
      diff
    };
  }
};

// 开发工具
const devTools = {
  // Base64编解码
  base64(text, operation = 'encode') {
    if (operation === 'encode') {
      return {
        original: text,
        encoded: Buffer.from(text).toString('base64'),
        operation
      };
    } else {
      try {
        return {
          encoded: text,
          decoded: Buffer.from(text, 'base64').toString('utf8'),
          operation
        };
      } catch (error) {
        return { error: '解码失败' };
      }
    }
  },
  
  // URL编解码
  url(text, operation = 'encode') {
    if (operation === 'encode') {
      return {
        original: text,
        encoded: encodeURIComponent(text),
        operation
      };
    } else {
      try {
        return {
          encoded: text,
          decoded: decodeURIComponent(text),
          operation
        };
      } catch (error) {
        return { error: '解码失败' };
      }
    }
  },
  
  // JWT解码
  decodeJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { error: '无效的JWT格式' };
      }
      
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      return {
        header,
        payload,
        signature: parts[2],
        expired: payload.exp ? Date.now() >= payload.exp * 1000 : null
      };
    } catch (error) {
      return { error: 'JWT解码失败' };
    }
  },
  
  // 哈希生成
  generateHash(text, algorithm = 'md5') {
    const crypto = require('crypto');
    
    try {
      const hash = crypto.createHash(algorithm).update(text).digest('hex');
      return {
        original: text,
        algorithm,
        hash
      };
    } catch (error) {
      return { error: '不支持的哈希算法' };
    }
  }
};

// 工具集合API路由
const toolsRoutes = (app) => {
  // 金融计算器路由
  app.post('/api/tools/financial/compound-interest', (req, res) => {
    const { principal, rate, time, frequency } = req.body;
    const result = financialTools.calculateCompoundInterest(principal, rate, time, frequency);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/financial/loan', (req, res) => {
    const { principal, annualRate, years, type } = req.body;
    const result = financialTools.calculateLoan(principal, annualRate, years, type);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/financial/roi', (req, res) => {
    const { initialInvestment, finalValue, years } = req.body;
    const result = financialTools.calculateROI(initialInvestment, finalValue, years);
    res.json({ success: true, data: result });
  });
  
  // 转换器路由
  app.post('/api/tools/converter/unit', (req, res) => {
    const { value, fromUnit, toUnit, type } = req.body;
    const result = converterTools.convertUnit(value, fromUnit, toUnit, type);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/converter/base', (req, res) => {
    const { number, fromBase, toBase } = req.body;
    const result = converterTools.convertBase(number, fromBase, toBase);
    res.json({ success: true, data: result });
  });
  
  app.get('/api/tools/converter/timestamp/:timestamp', (req, res) => {
    const timestamp = parseInt(req.params.timestamp);
    const format = req.query.format || 'datetime';
    const result = converterTools.convertTimestamp(timestamp, format);
    res.json({ success: true, data: result });
  });
  
  // 生成器路由
  app.get('/api/tools/generator/password', (req, res) => {
    const length = parseInt(req.query.length) || 12;
    const options = {
      uppercase: req.query.uppercase !== 'false',
      lowercase: req.query.lowercase !== 'false',
      numbers: req.query.numbers !== 'false',
      symbols: req.query.symbols !== 'false'
    };
    const result = generatorTools.generatePassword(length, options);
    res.json({ success: true, data: result });
  });
  
  app.get('/api/tools/generator/uuid', (req, res) => {
    const version = req.query.version || 'v4';
    const result = generatorTools.generateUUID(version);
    res.json({ success: true, data: { uuid: result } });
  });
  
  app.get('/api/tools/generator/lorem-ipsum', (req, res) => {
    const paragraphs = parseInt(req.query.paragraphs) || 3;
    const sentences = parseInt(req.query.sentences) || 5;
    const result = generatorTools.generateLoremIpsum(paragraphs, sentences);
    res.json({ success: true, data: result });
  });
  
  app.get('/api/tools/generator/color-palette', (req, res) => {
    const baseColor = req.query.baseColor || '#667eea';
    const count = parseInt(req.query.count) || 5;
    const result = generatorTools.generateColorPalette(baseColor, count);
    res.json({ success: true, data: result });
  });
  
  // 文本工具路由
  app.post('/api/tools/text/analyze', (req, res) => {
    const { text } = req.body;
    const result = textTools.analyzeText(text);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/text/convert-case', (req, res) => {
    const { text, type } = req.body;
    const result = textTools.convertCase(text, type);
    res.json({ success: true, data: { original: text, converted: result, type } });
  });
  
  app.post('/api/tools/text/format-json', (req, res) => {
    const { json, indent } = req.body;
    const result = textTools.formatJSON(json, indent);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/text/diff', (req, res) => {
    const { text1, text2 } = req.body;
    const result = textTools.diffText(text1, text2);
    res.json({ success: true, data: result });
  });
  
  // 开发工具路由
  app.post('/api/tools/dev/base64', (req, res) => {
    const { text, operation } = req.body;
    const result = devTools.base64(text, operation);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/dev/url', (req, res) => {
    const { text, operation } = req.body;
    const result = devTools.url(text, operation);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/dev/jwt', (req, res) => {
    const { token } = req.body;
    const result = devTools.decodeJWT(token);
    res.json({ success: true, data: result });
  });
  
  app.post('/api/tools/dev/hash', (req, res) => {
    const { text, algorithm } = req.body;
    const result = devTools.generateHash(text, algorithm);
    res.json({ success: true, data: result });
  });
  
  // 获取工具列表
  app.get('/api/tools/list', (req, res) => {
    res.json({
      success: true,
      data: {
        financialCalculators: toolsConfig.financialCalculators,
        converters: toolsConfig.converters,
        generators: toolsConfig.generators,
        textTools: toolsConfig.textTools,
        devTools: toolsConfig.devTools,
        imageTools: toolsConfig.imageTools
      }
    });
  });
};

// 工具集合管理器
const toolsManager = {
  toolsConfig,
  financialTools,
  converterTools,
  generatorTools,
  textTools,
  devTools,
  toolsRoutes,
  
  // 初始化
  initialize(app) {
    // 注册路由
    toolsRoutes(app);
    
    console.log('✅ 工具集合模块已初始化');
    console.log(`   - 金融计算器: ${toolsConfig.financialCalculators.tools.length} 个工具`);
    console.log(`   - 转换器: ${toolsConfig.converters.tools.length} 个工具`);
    console.log(`   - 生成器: ${toolsConfig.generators.tools.length} 个工具`);
    console.log(`   - 文本工具: ${toolsConfig.textTools.tools.length} 个工具`);
    console.log(`   - 开发工具: ${toolsConfig.devTools.tools.length} 个工具`);
    console.log(`   - 图片工具: ${toolsConfig.imageTools.tools.length} 个工具`);
  }
};

module.exports = toolsManager;