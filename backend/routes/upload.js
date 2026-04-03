/**
 * 茶海虾王@金融交易所看板平台 - 文件上传路由
 * 提供API端点来处理文件上传功能
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logger } = require('../config/logger');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 创建multer实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB文件大小限制
  },
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  }
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'upload'
  });
});

// 单文件上传
router.post('/single', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: '请选择要上传的文件'
      });
    }

    res.json({
      status: 'success',
      message: '文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    logger.error('文件上传失败:', error);
    res.status(500).json({
      status: 'error',
      message: '文件上传失败',
      error: error.message
    });
  }
});

// 多文件上传
router.post('/multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '请选择要上传的文件'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      status: 'success',
      message: '文件上传成功',
      data: {
        total: files.length,
        files
      }
    });
  } catch (error) {
    logger.error('文件上传失败:', error);
    res.status(500).json({
      status: 'error',
      message: '文件上传失败',
      error: error.message
    });
  }
});

// 获取上传的文件
router.get('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: '文件不存在'
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    logger.error('获取文件失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取文件失败',
      error: error.message
    });
  }
});

// 删除上传的文件
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: '文件不存在'
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      status: 'success',
      message: '文件删除成功'
    });
  } catch (error) {
    logger.error('删除文件失败:', error);
    res.status(500).json({
      status: 'error',
      message: '删除文件失败',
      error: error.message
    });
  }
});

// 获取上传目录中的文件列表
router.get('/list', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir).map(filename => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        mtime: stats.mtime,
        url: `/uploads/${filename}`
      };
    });

    res.json({
      status: 'success',
      message: '获取文件列表成功',
      data: {
        total: files.length,
        files
      }
    });
  } catch (error) {
    logger.error('获取文件列表失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取文件列表失败',
      error: error.message
    });
  }
});

module.exports = router;