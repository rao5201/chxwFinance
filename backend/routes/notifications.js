/**
 * 茶海虾王@金融交易所看板平台 - 通知系统路由
 * 包含实时通知、消息推送、邮件通知等功能
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../config/logger');

// 通知存储（使用内存存储，生产环境应使用数据库）
const notifications = new Map();
const userNotifications = new Map();

// 生成通知ID
const generateNotificationId = () => {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 创建通知
const createNotification = (userId, type, title, message, data = {}) => {
  const notification = {
    id: generateNotificationId(),
    userId,
    type,
    title,
    message,
    data,
    read: false,
    createdAt: new Date().toISOString(),
    readAt: null
  };
  
  // 存储通知
  notifications.set(notification.id, notification);
  
  // 添加到用户通知列表
  if (!userNotifications.has(userId)) {
    userNotifications.set(userId, []);
  }
  userNotifications.get(userId).push(notification.id);
  
  logger.info(`创建通知: ${title} - 用户: ${userId}`);
  
  return notification;
};

// 获取用户通知列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const userNotifIds = userNotifications.get(userId) || [];
    let userNotifs = userNotifIds.map(id => notifications.get(id)).filter(Boolean);
    
    // 过滤未读通知
    if (unreadOnly === 'true') {
      userNotifs = userNotifs.filter(n => !n.read);
    }
    
    // 按时间排序（最新的在前）
    userNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifs = userNotifs.slice(startIndex, endIndex);
    
    // 统计
    const total = userNotifs.length;
    const unreadCount = userNotifs.filter(n => !n.read).length;
    
    res.json({
      success: true,
      data: {
        notifications: paginatedNotifs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          total,
          unread: unreadCount,
          read: total - unreadCount
        }
      }
    });
  } catch (error) {
    logger.error('获取通知列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取通知列表失败'
    });
  }
});

// 标记通知为已读
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = notifications.get(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: '通知不存在'
      });
    }
    
    // 检查权限
    if (notification.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权操作此通知'
      });
    }
    
    // 标记为已读
    notification.read = true;
    notification.readAt = new Date().toISOString();
    notifications.set(id, notification);
    
    logger.info(`标记通知已读: ${id} - 用户: ${userId}`);
    
    res.json({
      success: true,
      message: '通知已标记为已读',
      data: notification
    });
  } catch (error) {
    logger.error('标记通知已读失败:', error);
    res.status(500).json({
      success: false,
      message: '标记通知已读失败'
    });
  }
});

// 标记所有通知为已读
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userNotifIds = userNotifications.get(userId) || [];
    
    let updatedCount = 0;
    userNotifIds.forEach(id => {
      const notification = notifications.get(id);
      if (notification && !notification.read) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        notifications.set(id, notification);
        updatedCount++;
      }
    });
    
    logger.info(`标记所有通知已读: ${updatedCount}条 - 用户: ${userId}`);
    
    res.json({
      success: true,
      message: `已将${updatedCount}条通知标记为已读`,
      data: { updatedCount }
    });
  } catch (error) {
    logger.error('标记所有通知已读失败:', error);
    res.status(500).json({
      success: false,
      message: '标记所有通知已读失败'
    });
  }
});

// 删除通知
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = notifications.get(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: '通知不存在'
      });
    }
    
    // 检查权限
    if (notification.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权操作此通知'
      });
    }
    
    // 删除通知
    notifications.delete(id);
    
    // 从用户通知列表中移除
    const userNotifIds = userNotifications.get(userId) || [];
    const index = userNotifIds.indexOf(id);
    if (index > -1) {
      userNotifIds.splice(index, 1);
    }
    
    logger.info(`删除通知: ${id} - 用户: ${userId}`);
    
    res.json({
      success: true,
      message: '通知已删除'
    });
  } catch (error) {
    logger.error('删除通知失败:', error);
    res.status(500).json({
      success: false,
      message: '删除通知失败'
    });
  }
});

// 获取未读通知数量
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userNotifIds = userNotifications.get(userId) || [];
    const unreadCount = userNotifIds.filter(id => {
      const notification = notifications.get(id);
      return notification && !notification.read;
    }).length;
    
    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    logger.error('获取未读通知数量失败:', error);
    res.status(500).json({
      success: false,
      message: '获取未读通知数量失败'
    });
  }
});

// 创建系统通知（管理员接口）
router.post('/system', authenticateToken, async (req, res) => {
  try {
    // 检查是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权创建系统通知'
      });
    }
    
    const { title, message, target = 'all', targetUsers = [] } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: '标题和内容为必填项'
      });
    }
    
    let createdNotifications = [];
    
    if (target === 'all') {
      // 给所有用户发送通知
      // 这里简化处理，实际应该从数据库获取所有用户ID
      const allUserIds = Array.from(userNotifications.keys());
      createdNotifications = allUserIds.map(userId => 
        createNotification(userId, 'system', title, message)
      );
    } else if (target === 'specific' && targetUsers.length > 0) {
      // 给指定用户发送通知
      createdNotifications = targetUsers.map(userId => 
        createNotification(userId, 'system', title, message)
      );
    }
    
    logger.info(`创建系统通知: ${title} - 目标: ${target}`);
    
    res.json({
      success: true,
      message: `成功创建${createdNotifications.length}条系统通知`,
      data: { count: createdNotifications.length }
    });
  } catch (error) {
    logger.error('创建系统通知失败:', error);
    res.status(500).json({
      success: false,
      message: '创建系统通知失败'
    });
  }
});

// 获取通知设置
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 默认设置
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notifyOnPriceChange: true,
      notifyOnOrderStatus: true,
      notifyOnSystemUpdate: true,
      priceChangeThreshold: 5 // 5%
    };
    
    // 这里应该从数据库获取用户设置
    const settings = defaultSettings;
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error('获取通知设置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取通知设置失败'
    });
  }
});

// 更新通知设置
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;
    
    // 这里应该保存到数据库
    logger.info(`更新通知设置 - 用户: ${userId}`);
    
    res.json({
      success: true,
      message: '通知设置已更新',
      data: settings
    });
  } catch (error) {
    logger.error('更新通知设置失败:', error);
    res.status(500).json({
      success: false,
      message: '更新通知设置失败'
    });
  }
});

// 导出创建通知函数供其他模块使用
module.exports = {
  router,
  createNotification
};
