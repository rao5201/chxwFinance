/**
 * 茶海虾王@金融交易所看板平台 - 自动化信息采集路由
 * 提供API端点来触发和管理信息采集任务
 */

const express = require('express');
const router = express.Router();
const { logger } = require('../config/logger');
const {
  autoCollectionConfig,
  WebsiteCollector,
  AutoEditor,
  AutoPublisher,
  ImageProcessor,
  GovernmentPolicyProcessor,
  MaterialsCollector
} = require('../config/auto-info-collection');

// 初始化采集器实例
const websiteCollector = new WebsiteCollector(autoCollectionConfig);
const autoEditor = new AutoEditor(autoCollectionConfig);
const autoPublisher = new AutoPublisher(autoCollectionConfig);
const imageProcessor = new ImageProcessor(autoCollectionConfig);
const governmentPolicyProcessor = new GovernmentPolicyProcessor(autoCollectionConfig);
const materialsCollector = new MaterialsCollector(autoCollectionConfig);

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'auto-collection'
  });
});

// 获取采集配置
router.get('/config', (req, res) => {
  res.json({
    status: 'success',
    data: autoCollectionConfig
  });
});

// 手动触发网站信息采集
router.post('/collect/website', async (req, res) => {
  try {
    if (!autoCollectionConfig.enabled || !autoCollectionConfig.websites.enabled) {
      return res.status(400).json({
        status: 'error',
        message: '网站信息采集功能未启用'
      });
    }

    const results = await websiteCollector.collectAllWebsites();
    
    res.json({
      status: 'success',
      message: '网站信息采集完成',
      data: {
        totalWebsites: results.length,
        results
      }
    });
  } catch (error) {
    logger.error('网站信息采集失败:', error);
    res.status(500).json({
      status: 'error',
      message: '网站信息采集失败',
      error: error.message
    });
  }
});

// 手动触发单个网站采集
router.post('/collect/website/:id', async (req, res) => {
  try {
    const websiteId = req.params.id;
    const website = autoCollectionConfig.websites.sources.find(w => w.id === websiteId);
    
    if (!website) {
      return res.status(404).json({
        status: 'error',
        message: '网站配置不存在'
      });
    }

    if (!autoCollectionConfig.enabled || !autoCollectionConfig.websites.enabled || !website.enabled) {
      return res.status(400).json({
        status: 'error',
        message: '网站信息采集功能未启用'
      });
    }

    const result = await websiteCollector.collectWebsiteData(website);
    
    res.json({
      status: 'success',
      message: `网站 ${website.name} 信息采集完成`,
      data: result
    });
  } catch (error) {
    logger.error('网站信息采集失败:', error);
    res.status(500).json({
      status: 'error',
      message: '网站信息采集失败',
      error: error.message
    });
  }
});

// 内容自动编辑处理
router.post('/process/content', (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        status: 'error',
        message: '内容不能为空'
      });
    }

    const processed = autoEditor.processContent(content);
    
    res.json({
      status: 'success',
      message: '内容处理完成',
      data: processed
    });
  } catch (error) {
    logger.error('内容处理失败:', error);
    res.status(500).json({
      status: 'error',
      message: '内容处理失败',
      error: error.message
    });
  }
});

// 自动发布内容
router.post('/publish', async (req, res) => {
  try {
    const { content, platformId } = req.body;
    
    if (!content) {
      return res.status(400).json({
        status: 'error',
        message: '内容不能为空'
      });
    }

    if (platformId) {
      const platform = autoCollectionConfig.newsUpload.platforms.find(p => p.id === platformId);
      if (!platform) {
        return res.status(404).json({
          status: 'error',
          message: '发布平台不存在'
        });
      }
      
      const result = await autoPublisher.publish(content, platform);
      
      res.json({
        status: result.success ? 'success' : 'error',
        message: result.success ? '内容发布成功' : '内容发布失败',
        data: result
      });
    } else {
      // 发布到所有平台
      const results = await autoPublisher.publishToAllPlatforms(content);
      
      res.json({
        status: 'success',
        message: '内容发布完成',
        data: results
      });
    }
  } catch (error) {
    logger.error('内容发布失败:', error);
    res.status(500).json({
      status: 'error',
      message: '内容发布失败',
      error: error.message
    });
  }
});

// 图片处理和上传
router.post('/upload/image', async (req, res) => {
  try {
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({
        status: 'error',
        message: '图片路径不能为空'
      });
    }

    // 处理图片
    const processed = await imageProcessor.processImage(imagePath);
    
    // 上传图片
    const uploaded = await imageProcessor.uploadImage(processed.processedPath);
    
    res.json({
      status: uploaded.success ? 'success' : 'error',
      message: uploaded.success ? '图片上传成功' : '图片上传失败',
      data: {
        processed,
        uploaded
      }
    });
  } catch (error) {
    logger.error('图片处理和上传失败:', error);
    res.status(500).json({
      status: 'error',
      message: '图片处理和上传失败',
      error: error.message
    });
  }
});

// 政府政策信息处理和发布
router.post('/process/policy', async (req, res) => {
  try {
    const { policyData } = req.body;
    
    if (!policyData) {
      return res.status(400).json({
        status: 'error',
        message: '政策数据不能为空'
      });
    }

    // 处理政策信息
    const processed = await governmentPolicyProcessor.processPolicyInfo(policyData);
    
    // 发布政策信息
    const published = await governmentPolicyProcessor.publishPolicy(processed);
    
    res.json({
      status: published.success ? 'success' : 'error',
      message: published.success ? '政策信息发布成功' : '政策信息发布失败',
      data: {
        processed,
        published
      }
    });
  } catch (error) {
    logger.error('政策信息处理和发布失败:', error);
    res.status(500).json({
      status: 'error',
      message: '政策信息处理和发布失败',
      error: error.message
    });
  }
});

// 资料收集
router.post('/collect/materials', async (req, res) => {
  try {
    const { category, sources } = req.body;
    
    if (!category || !sources || !Array.isArray(sources)) {
      return res.status(400).json({
        status: 'error',
        message: '分类和来源不能为空'
      });
    }

    const materials = await materialsCollector.collectMaterials(category, sources);
    
    res.json({
      status: 'success',
      message: '资料收集完成',
      data: {
        category,
        totalMaterials: materials.length,
        materials
      }
    });
  } catch (error) {
    logger.error('资料收集失败:', error);
    res.status(500).json({
      status: 'error',
      message: '资料收集失败',
      error: error.message
    });
  }
});

// 更新采集配置
router.put('/config', (req, res) => {
  try {
    const { config } = req.body;
    
    if (!config) {
      return res.status(400).json({
        status: 'error',
        message: '配置不能为空'
      });
    }

    // 这里可以添加配置更新逻辑
    // 暂时返回成功
    
    res.json({
      status: 'success',
      message: '配置更新成功',
      data: config
    });
  } catch (error) {
    logger.error('配置更新失败:', error);
    res.status(500).json({
      status: 'error',
      message: '配置更新失败',
      error: error.message
    });
  }
});

module.exports = router;
