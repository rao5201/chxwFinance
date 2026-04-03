/**
 * 茶海虾王@金融交易所看板平台 - 自动化信息采集系统
 * 支持网站信息采集、自动编辑、自动发送、自动上传、自动发布等功能
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { logger } = require('./logger');
const fs = require('fs');
const path = require('path');

// 自动化信息采集配置
const autoCollectionConfig = {
  // 启用状态
  enabled: process.env.AUTO_COLLECTION_ENABLED === 'true',
  
  // 采集频率设置（分钟）
  collectionInterval: {
    website: parseInt(process.env.WEBSITE_COLLECTION_INTERVAL || 60), // 网站信息采集
    news: parseInt(process.env.NEWS_COLLECTION_INTERVAL || 30), // 新闻采集
    government: parseInt(process.env.GOVERNMENT_COLLECTION_INTERVAL || 120), // 政府政策信息
    materials: parseInt(process.env.MATERIALS_COLLECTION_INTERVAL || 180) // 资料采集
  },
  
  // 存储配置
  storage: {
    basePath: process.env.STORAGE_BASE_PATH || './storage',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    cleanupInterval: 7 * 24 * 60 * 60 * 1000 // 7天
  },
  
  // 网站信息采集配置
  websites: {
    enabled: process.env.WEBSITE_COLLECTION_ENABLED === 'true',
    sources: [
      // 金融新闻网站
      {
        id: 'finance_news',
        name: '新浪金融',
        url: 'https://finance.sina.com.cn',
        selector: '.news-list-item',
        frequency: 30, // 分钟
        enabled: true
      },
      {
        id: 'stock_news',
        name: '新浪股票',
        url: 'https://stock.sina.com.cn',
        selector: '.news-item',
        frequency: 20, // 分钟
        enabled: true
      },
      {
        id: 'eastmoney',
        name: '东方财富网',
        url: 'https://www.eastmoney.com',
        selector: '.news-item',
        frequency: 25, // 分钟
        enabled: true
      },
      {
        id: 'hexun',
        name: '和讯网',
        url: 'https://www.hexun.com',
        selector: '.news-list li',
        frequency: 30, // 分钟
        enabled: true
      },
      {
        id: 'jrj',
        name: '金融界',
        url: 'https://www.jrj.com.cn',
        selector: '.news-list-item',
        frequency: 35, // 分钟
        enabled: true
      },
      // 政府政策网站
      {
        id: 'government_policy',
        name: '中国政府网',
        url: 'http://www.gov.cn/zhengce/',
        selector: '.list-item',
        frequency: 120, // 分钟
        enabled: true
      },
      {
        id: 'csrc',
        name: '中国证监会',
        url: 'http://www.csrc.gov.cn',
        selector: '.news-item',
        frequency: 60, // 分钟
        enabled: true
      },
      // 金融公司网站
      {
        id: 'icbc',
        name: '工商银行',
        url: 'https://www.icbc.com.cn',
        selector: '.news-item',
        frequency: 120, // 分钟
        enabled: true
      },
      {
        id: 'ccb',
        name: '建设银行',
        url: 'https://www.ccb.com',
        selector: '.news-list li',
        frequency: 120, // 分钟
        enabled: true
      },
      {
        id: 'boc',
        name: '中国银行',
        url: 'https://www.boc.cn',
        selector: '.news-item',
        frequency: 120, // 分钟
        enabled: true
      },
      // 上市公司网站
      {
        id: 'sse',
        name: '上海证券交易所',
        url: 'http://www.sse.com.cn',
        selector: '.news-item',
        frequency: 60, // 分钟
        enabled: true
      },
      {
        id: 'szse',
        name: '深圳证券交易所',
        url: 'http://www.szse.cn',
        selector: '.news-list li',
        frequency: 60, // 分钟
        enabled: true
      },
      {
        id: 'hkex',
        name: '香港交易所',
        url: 'https://www.hkex.com.hk',
        selector: '.news-item',
        frequency: 90, // 分钟
        enabled: true
      }
    ],
    rateLimit: 150 // 每分钟请求次数
  },
  
  // 新闻自动上传配置
  newsUpload: {
    enabled: process.env.NEWS_UPLOAD_ENABLED === 'true',
    platforms: [
      {
        id: 'internal',
        name: '内部系统',
        endpoint: '/api/news/upload',
        enabled: true
      },
      {
        id: 'external',
        name: '外部平台',
        endpoint: 'https://api.external.com/news',
        apiKey: process.env.EXTERNAL_API_KEY,
        enabled: false
      }
    ]
  },
  
  // 图片自动上传配置
  imageUpload: {
    enabled: process.env.IMAGE_UPLOAD_ENABLED === 'true',
    maxSize: 5 * 1024 * 1024, // 5MB
    formats: ['jpg', 'jpeg', 'png', 'gif'],
    quality: 80,
    storage: {
      local: true,
      cloud: process.env.CLOUD_STORAGE_ENABLED === 'true',
      cloudProvider: process.env.CLOUD_PROVIDER || 'qiniu'
    }
  },
  
  // 政府政策信息超链接发布配置
  governmentPolicy: {
    enabled: process.env.GOVERNMENT_POLICY_ENABLED === 'true',
    categories: [
      'finance',
      'tax',
      'investment',
      'regulation'
    ],
    publishEndpoint: '/api/policy/publish'
  },
  
  // 资料自动收集上传配置
  materialsCollection: {
    enabled: process.env.MATERIALS_COLLECTION_ENABLED === 'true',
    categories: [
      'research',
      'report',
      'whitepaper',
      'analysis'
    ],
    storagePath: './storage/materials'
  }
};

// 确保存储目录存在
function ensureStorageDirectories() {
  const directories = [
    autoCollectionConfig.storage.basePath,
    path.join(autoCollectionConfig.storage.basePath, 'websites'),
    path.join(autoCollectionConfig.storage.basePath, 'news'),
    path.join(autoCollectionConfig.storage.basePath, 'images'),
    path.join(autoCollectionConfig.storage.basePath, 'government'),
    path.join(autoCollectionConfig.storage.basePath, 'materials')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`创建存储目录: ${dir}`);
    }
  });
}

// 网站信息采集类
class WebsiteCollector {
  constructor(config) {
    this.config = config;
    this.requestQueue = new RequestQueue(config.websites.rateLimit);
  }
  
  async collectWebsiteData(website) {
    if (!website.enabled) return null;
    
    try {
      logger.info(`开始采集网站: ${website.name} (${website.url})`);
      
      const html = await this.requestQueue.add(async () => {
        const response = await axios.get(website.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 30000
        });
        return response.data;
      });
      
      const $ = cheerio.load(html);
      const items = [];
      
      $(website.selector).each((index, element) => {
        const item = {
          title: $(element).find('a').text().trim(),
          url: $(element).find('a').attr('href'),
          date: new Date().toISOString(),
          source: website.name
        };
        
        if (item.title && item.url) {
          items.push(item);
        }
      });
      
      logger.info(`采集完成: ${website.name}, 找到 ${items.length} 条信息`);
      return {
        website: website.name,
        url: website.url,
        timestamp: new Date().toISOString(),
        items
      };
    } catch (error) {
      logger.error(`采集网站 ${website.name} 失败: ${error.message}`);
      return null;
    }
  }
  
  async collectAllWebsites() {
    const results = [];
    
    for (const website of this.config.websites.sources) {
      const result = await this.collectWebsiteData(website);
      if (result) {
        results.push(result);
        // 保存采集结果
        await this.saveCollectionResult(result);
      }
    }
    
    return results;
  }
  
  async saveCollectionResult(result) {
    const fileName = `${result.website}_${Date.now()}.json`;
    const filePath = path.join(autoCollectionConfig.storage.basePath, 'websites', fileName);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
      logger.info(`保存采集结果到: ${filePath}`);
    } catch (error) {
      logger.error(`保存采集结果失败: ${error.message}`);
    }
  }
}

// 自动编辑处理类
class AutoEditor {
  constructor(config) {
    this.config = config;
  }
  
  processContent(content) {
    // 内容格式化
    let processed = content
      .replace(/\s+/g, ' ') // 去除多余空白
      .trim();
    
    // 提取关键词
    const keywords = this.extractKeywords(processed);
    
    // 分类
    const category = this.categorizeContent(processed, keywords);
    
    return {
      content: processed,
      keywords,
      category,
      processedAt: new Date().toISOString()
    };
  }
  
  extractKeywords(content) {
    // 简单的关键词提取逻辑
    const stopWords = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']);
    const words = content.split(/\s+/);
    const keywords = new Set();
    
    words.forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        keywords.add(word);
      }
    });
    
    return Array.from(keywords).slice(0, 10); // 取前10个关键词
  }
  
  categorizeContent(content, keywords) {
    const categories = {
      finance: ['金融', '银行', '贷款', '投资', '股票', '基金'],
      tech: ['科技', '人工智能', '互联网', '技术', '数字化'],
      policy: ['政策', '法规', '政府', '监管', '制度'],
      market: ['市场', '行情', '趋势', '分析', '预测']
    };
    
    for (const [category, terms] of Object.entries(categories)) {
      for (const term of terms) {
        if (content.includes(term) || keywords.includes(term)) {
          return category;
        }
      }
    }
    
    return 'other';
  }
}

// 自动发布类
class AutoPublisher {
  constructor(config) {
    this.config = config;
  }
  
  async publish(content, platform) {
    if (!platform.enabled) return { success: false, message: '平台未启用' };
    
    try {
      let endpoint = platform.endpoint;
      if (!endpoint.startsWith('http')) {
        endpoint = `http://localhost:3000${endpoint}`;
      }
      
      const response = await axios.post(endpoint, {
        content,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': platform.apiKey ? `Bearer ${platform.apiKey}` : undefined
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      logger.error(`发布到 ${platform.name} 失败: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
  
  async publishToAllPlatforms(content) {
    const results = [];
    
    for (const platform of this.config.newsUpload.platforms) {
      const result = await this.publish(content, platform);
      results.push({
        platform: platform.name,
        ...result
      });
    }
    
    return results;
  }
}

// 图片处理和上传类
class ImageProcessor {
  constructor(config) {
    this.config = config;
  }
  
  async processImage(imagePath) {
    // 这里可以添加图片处理逻辑，如压缩、调整大小等
    // 暂时返回原始路径
    return {
      originalPath: imagePath,
      processedPath: imagePath,
      size: fs.statSync(imagePath).size,
      processedAt: new Date().toISOString()
    };
  }
  
  async uploadImage(imagePath) {
    if (this.config.imageUpload.storage.local) {
      const destPath = path.join(autoCollectionConfig.storage.basePath, 'images', path.basename(imagePath));
      fs.copyFileSync(imagePath, destPath);
      return {
        success: true,
        url: `/storage/images/${path.basename(imagePath)}`
      };
    }
    
    // 云存储上传逻辑
    if (this.config.imageUpload.storage.cloud) {
      // 这里可以添加云存储上传逻辑
      logger.info(`上传图片到云存储: ${imagePath}`);
      return {
        success: true,
        url: `https://cloud.storage.com/${path.basename(imagePath)}`
      };
    }
    
    return { success: false, message: '未配置存储方式' };
  }
}

// 政府政策信息处理类
class GovernmentPolicyProcessor {
  constructor(config) {
    this.config = config;
  }
  
  async processPolicyInfo(policyData) {
    // 处理政府政策信息，提取关键内容和超链接
    const processed = {
      ...policyData,
      processedAt: new Date().toISOString(),
      category: this.categorizePolicy(policyData.title),
      hyperlinks: this.extractHyperlinks(policyData.content)
    };
    
    return processed;
  }
  
  categorizePolicy(title) {
    const categories = this.config.governmentPolicy.categories;
    const categoryMap = {
      finance: ['金融', '货币', '银行'],
      tax: ['税收', '税务', '关税'],
      investment: ['投资', '引资', '融资'],
      regulation: ['监管', '法规', '制度']
    };
    
    for (const [category, terms] of Object.entries(categoryMap)) {
      for (const term of terms) {
        if (title.includes(term)) {
          return category;
        }
      }
    }
    
    return 'other';
  }
  
  extractHyperlinks(content) {
    const hyperlinkRegex = /https?:\/\/[^\s]+/g;
    const hyperlinks = content.match(hyperlinkRegex) || [];
    return hyperlinks;
  }
  
  async publishPolicy(policyData) {
    const endpoint = this.config.governmentPolicy.publishEndpoint;
    const fullEndpoint = endpoint.startsWith('http') ? endpoint : `http://localhost:3000${endpoint}`;
    
    try {
      const response = await axios.post(fullEndpoint, policyData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      logger.error(`发布政府政策信息失败: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}

// 资料收集管理类
class MaterialsCollector {
  constructor(config) {
    this.config = config;
  }
  
  async collectMaterials(category, sources) {
    const materials = [];
    
    for (const source of sources) {
      try {
        const material = await this.fetchMaterial(source);
        if (material) {
          materials.push({
            ...material,
            category,
            collectedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        logger.error(`收集资料失败: ${error.message}`);
      }
    }
    
    // 保存资料
    await this.saveMaterials(category, materials);
    return materials;
  }
  
  async fetchMaterial(source) {
    // 这里可以添加具体的资料获取逻辑
    return {
      title: source.title,
      url: source.url,
      content: '资料内容',
      format: source.format || 'html'
    };
  }
  
  async saveMaterials(category, materials) {
    const categoryPath = path.join(this.config.materialsCollection.storagePath, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
    
    for (const material of materials) {
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.json`;
      const filePath = path.join(categoryPath, fileName);
      
      try {
        fs.writeFileSync(filePath, JSON.stringify(material, null, 2));
        logger.info(`保存资料到: ${filePath}`);
      } catch (error) {
        logger.error(`保存资料失败: ${error.message}`);
      }
    }
  }
}

// 请求队列管理（复用现有的逻辑）
class RequestQueue {
  constructor(rateLimit, interval = 60000) {
    this.queue = [];
    this.rateLimit = rateLimit;
    this.interval = interval;
    this.requests = [];
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.queue.length === 0) return;

    // 清理过期的请求记录
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.interval);

    if (this.requests.length >= this.rateLimit) {
      // 等待下一个时间窗口
      const oldestRequest = this.requests[0];
      const waitTime = this.interval - (now - oldestRequest);
      setTimeout(() => this.process(), waitTime);
      return;
    }

    const { requestFn, resolve, reject } = this.queue.shift();
    this.requests.push(Date.now());

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // 继续处理队列
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), 1000);
    }
  }
}

// 初始化存储目录
ensureStorageDirectories();

// 导出模块
module.exports = {
  autoCollectionConfig,
  WebsiteCollector,
  AutoEditor,
  AutoPublisher,
  ImageProcessor,
  GovernmentPolicyProcessor,
  MaterialsCollector,
  RequestQueue
};
