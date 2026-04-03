/**
 * 茶海虾王@金融交易所看板平台 - 社交功能配置
 * 包含用户关注、消息系统、评论系统、分享功能等
 */

const { logger } = require('./logger');
const mongoose = require('mongoose');

// 社交功能配置
const socialConfig = {
  // 用户关系
  userRelations: {
    follow: {
      enabled: true,
      maxFollowers: 10000,
      maxFollowing: 5000
    },
    block: {
      enabled: true
    },
    mute: {
      enabled: true
    }
  },
  
  // 消息系统
  messaging: {
    enabled: true,
    directMessages: {
      enabled: true,
      maxMessageLength: 1000,
      messageHistory: 1000
    },
    groupMessages: {
      enabled: true,
      maxGroupSize: 50,
      maxMessageLength: 1000
    },
    notifications: {
      enabled: true,
      types: [
        'follow',
        'like',
        'comment',
        'mention',
        'share',
        'system',
        'alert',
        'trade'
      ],
      retention: 30 // 保留天数
    }
  },
  
  // 评论系统
  comments: {
    enabled: true,
    maxLength: 500,
    nestedComments: true,
    maxDepth: 3,
    reactions: {
      enabled: true,
      types: ['like', 'dislike', 'love', 'wow', 'sad', 'angry']
    }
  },
  
  // 分享功能
  sharing: {
    enabled: true,
    platforms: [
      'wechat',
      'weibo',
      'qq',
      'twitter',
      'facebook',
      'linkedin',
      'copy',
      'email'
    ],
    defaultText: '查看我的交易分析：{url}'
  },
  
  // 内容创作
  content: {
    posts: {
      enabled: true,
      maxLength: 5000,
      allowMedia: true,
      mediaTypes: ['image', 'video', 'link'],
      maxMediaFiles: 9,
      maxMediaSize: 10 * 1024 * 1024 // 10MB
    },
    articles: {
      enabled: true,
      maxLength: 20000,
      allowMedia: true,
      mediaTypes: ['image', 'video', 'link', 'code'],
      maxMediaFiles: 20,
      maxMediaSize: 20 * 1024 * 1024 // 20MB
    },
    analysis: {
      enabled: true,
      allowCharts: true,
      allowIndicators: true,
      allowBacktesting: true
    }
  },
  
  // 互动功能
  interactions: {
    likes: {
      enabled: true
    },
    bookmarks: {
      enabled: true
    },
    views: {
      enabled: true,
      unique: true
    }
  },
  
  // 社区功能
  community: {
    enabled: true,
    groups: {
      enabled: true,
      maxGroups: 50,
      maxMembers: 10000
    },
    forums: {
      enabled: true,
      categories: [
        'general',
        'stocks',
        'crypto',
        'forex',
        'commodities',
        'trading-strategies',
        'market-analysis',
        'technology'
      ]
    },
    events: {
      enabled: true,
      types: ['webinar', 'workshop', 'competition', 'meeting']
    }
  },
  
  // 排行榜
  leaderboard: {
    enabled: true,
    categories: [
      'profit',
      'accuracy',
      'trades',
      'followers',
      'content',
      'engagement'
    ],
    updateFrequency: 'daily', // daily, weekly, monthly
    showTop: 100
  },
  
  // 隐私设置
  privacy: {
    defaultSettings: {
      profile: 'public', // public, private, followers
      posts: 'public',
      activity: 'public',
      messages: 'followers',
      comments: 'public'
    },
    allowCustomization: true
  },
  
  // 安全设置
  security: {
    rateLimits: {
      follow: 60, // 每分钟最大关注数
      message: 30, // 每分钟最大消息数
      comment: 50, // 每分钟最大评论数
      post: 10 // 每分钟最大发帖数
    },
    antiSpam: {
      enabled: true,
      threshold: 0.8
    },
    contentModeration: {
      enabled: true,
      autoModerate: true,
      humanReview: false
    }
  }
};

// 社交数据模型
const socialModels = {
  // 用户关系模型
  UserRelation: mongoose.model('UserRelation', new mongoose.Schema({
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['following', 'blocked', 'muted'],
      default: 'following'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }, {
    collection: 'user_relations'
  })),
  
  // 消息模型
  Message: mongoose.model('Message', new mongoose.Schema({
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: socialConfig.messaging.directMessages.maxMessageLength
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'link'],
      default: 'text'
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, {
    collection: 'messages'
  })),
  
  // 通知模型
  Notification: mongoose.model('Notification', new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: socialConfig.messaging.notifications.types,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, {
    collection: 'notifications'
  })),
  
  // 帖子模型
  Post: mongoose.model('Post', new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: socialConfig.content.posts.maxLength
    },
    media: [{
      type: String,
      url: String,
      type: String
    }],
    tags: [String],
    visibility: {
      type: String,
      enum: ['public', 'private', 'followers'],
      default: 'public'
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }, {
    collection: 'posts'
  })),
  
  // 评论模型
  Comment: mongoose.model('Comment', new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    content: {
      type: String,
      required: true,
      maxlength: socialConfig.comments.maxLength
    },
    likes: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }, {
    collection: 'comments'
  })),
  
  // 社区模型
  Community: mongoose.model('Community', new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        default: 'member'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }, {
    collection: 'communities'
  }))
};

// 社交功能服务
const socialServices = {
  // 用户关系服务
  userRelations: {
    // 关注用户
    async followUser(followerId, followingId) {
      try {
        // 检查是否已经关注
        const existing = await socialModels.UserRelation.findOne({
          followerId,
          followingId
        });
        
        if (existing) {
          if (existing.status === 'blocked') {
            return { success: false, message: '无法关注被屏蔽的用户' };
          }
          if (existing.status === 'following') {
            return { success: false, message: '已经关注该用户' };
          }
          // 更新状态
          existing.status = 'following';
          existing.updatedAt = new Date();
          await existing.save();
          return { success: true, message: '关注成功' };
        }
        
        // 检查关注限制
        const followingCount = await socialModels.UserRelation.countDocuments({
          followerId,
          status: 'following'
        });
        
        if (followingCount >= socialConfig.userRelations.follow.maxFollowing) {
          return { success: false, message: '关注数量已达上限' };
        }
        
        // 创建关注关系
        const relation = new socialModels.UserRelation({
          followerId,
          followingId,
          status: 'following'
        });
        
        await relation.save();
        
        // 发送通知
        await socialServices.notifications.sendNotification(followingId, {
          type: 'follow',
          title: '新的关注',
          message: '有人关注了你',
          data: { followerId }
        });
        
        return { success: true, message: '关注成功' };
      } catch (error) {
        logger.error('关注用户失败:', error);
        return { success: false, message: '关注失败' };
      }
    },
    
    // 取消关注
    async unfollowUser(followerId, followingId) {
      try {
        const result = await socialModels.UserRelation.deleteOne({
          followerId,
          followingId,
          status: 'following'
        });
        
        if (result.deletedCount > 0) {
          return { success: true, message: '取消关注成功' };
        } else {
          return { success: false, message: '未关注该用户' };
        }
      } catch (error) {
        logger.error('取消关注失败:', error);
        return { success: false, message: '取消关注失败' };
      }
    },
    
    // 屏蔽用户
    async blockUser(userId, blockId) {
      try {
        const existing = await socialModels.UserRelation.findOne({
          followerId: userId,
          followingId: blockId
        });
        
        if (existing) {
          existing.status = 'blocked';
          existing.updatedAt = new Date();
          await existing.save();
        } else {
          const relation = new socialModels.UserRelation({
            followerId: userId,
            followingId: blockId,
            status: 'blocked'
          });
          await relation.save();
        }
        
        return { success: true, message: '屏蔽成功' };
      } catch (error) {
        logger.error('屏蔽用户失败:', error);
        return { success: false, message: '屏蔽失败' };
      }
    },
    
    // 获取关注列表
    async getFollowing(userId, page = 1, limit = 20) {
      try {
        const skip = (page - 1) * limit;
        const relations = await socialModels.UserRelation.find({
          followerId: userId,
          status: 'following'
        }).populate('followingId', 'username avatar displayName').skip(skip).limit(limit);
        
        const total = await socialModels.UserRelation.countDocuments({
          followerId: userId,
          status: 'following'
        });
        
        return { success: true, data: relations, total, page, limit };
      } catch (error) {
        logger.error('获取关注列表失败:', error);
        return { success: false, message: '获取失败' };
      }
    },
    
    // 获取粉丝列表
    async getFollowers(userId, page = 1, limit = 20) {
      try {
        const skip = (page - 1) * limit;
        const relations = await socialModels.UserRelation.find({
          followingId: userId,
          status: 'following'
        }).populate('followerId', 'username avatar displayName').skip(skip).limit(limit);
        
        const total = await socialModels.UserRelation.countDocuments({
          followingId: userId,
          status: 'following'
        });
        
        return { success: true, data: relations, total, page, limit };
      } catch (error) {
        logger.error('获取粉丝列表失败:', error);
        return { success: false, message: '获取失败' };
      }
    }
  },
  
  // 消息服务
  messaging: {
    // 发送消息
    async sendMessage(senderId, recipientId, content, type = 'text') {
      try {
        // 检查是否被屏蔽
        const blocked = await socialModels.UserRelation.findOne({
          followerId: recipientId,
          followingId: senderId,
          status: 'blocked'
        });
        
        if (blocked) {
          return { success: false, message: '对方已屏蔽你' };
        }
        
        // 检查消息长度
        if (content.length > socialConfig.messaging.directMessages.maxMessageLength) {
          return { success: false, message: '消息长度超过限制' };
        }
        
        // 创建消息
        const message = new socialModels.Message({
          senderId,
          recipientId,
          content,
          type
        });
        
        await message.save();
        
        // 发送通知
        await socialServices.notifications.sendNotification(recipientId, {
          type: 'message',
          title: '新消息',
          message: '你收到了一条新消息',
          data: { messageId: message._id, senderId }
        });
        
        return { success: true, data: message };
      } catch (error) {
        logger.error('发送消息失败:', error);
        return { success: false, message: '发送失败' };
      }
    },
    
    // 获取消息历史
    async getMessageHistory(userId, otherId, page = 1, limit = 50) {
      try {
        const skip = (page - 1) * limit;
        const messages = await socialModels.Message.find({
          $or: [
            { senderId: userId, recipientId: otherId },
            { senderId: otherId, recipientId: userId }
          ]
        }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        // 标记消息为已读
        await socialModels.Message.updateMany({
          senderId: otherId,
          recipientId: userId,
          status: { $ne: 'read' }
        }, { $set: { status: 'read' } });
        
        return { success: true, data: messages.reverse() };
      } catch (error) {
        logger.error('获取消息历史失败:', error);
        return { success: false, message: '获取失败' };
      }
    },
    
    // 获取对话列表
    async getConversations(userId, page = 1, limit = 20) {
      try {
        // 这里需要实现获取对话列表的逻辑
        // 包括最新消息、未读数量等
        return { success: true, data: [] };
      } catch (error) {
        logger.error('获取对话列表失败:', error);
        return { success: false, message: '获取失败' };
      }
    }
  },
  
  // 通知服务
  notifications: {
    // 发送通知
    async sendNotification(userId, notificationData) {
      try {
        const notification = new socialModels.Notification({
          userId,
          ...notificationData
        });
        
        await notification.save();
        return { success: true, data: notification };
      } catch (error) {
        logger.error('发送通知失败:', error);
        return { success: false, message: '发送失败' };
      }
    },
    
    // 获取通知列表
    async getNotifications(userId, page = 1, limit = 20) {
      try {
        const skip = (page - 1) * limit;
        const notifications = await socialModels.Notification.find({
          userId
        }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        const total = await socialModels.Notification.countDocuments({ userId });
        const unreadCount = await socialModels.Notification.countDocuments({
          userId,
          read: false
        });
        
        return { success: true, data: notifications, total, unreadCount, page, limit };
      } catch (error) {
        logger.error('获取通知失败:', error);
        return { success: false, message: '获取失败' };
      }
    },
    
    // 标记通知为已读
    async markAsRead(notificationId, userId) {
      try {
        const result = await socialModels.Notification.updateOne({
          _id: notificationId,
          userId
        }, { $set: { read: true } });
        
        if (result.modifiedCount > 0) {
          return { success: true, message: '标记成功' };
        } else {
          return { success: false, message: '通知不存在' };
        }
      } catch (error) {
        logger.error('标记通知失败:', error);
        return { success: false, message: '标记失败' };
      }
    },
    
    // 标记所有通知为已读
    async markAllAsRead(userId) {
      try {
        await socialModels.Notification.updateMany({
          userId,
          read: false
        }, { $set: { read: true } });
        
        return { success: true, message: '全部标记为已读' };
      } catch (error) {
        logger.error('标记所有通知失败:', error);
        return { success: false, message: '标记失败' };
      }
    }
  },
  
  // 内容服务
  content: {
    // 创建帖子
    async createPost(userId, content, media = [], tags = [], visibility = 'public') {
      try {
        // 检查内容长度
        if (content.length > socialConfig.content.posts.maxLength) {
          return { success: false, message: '内容长度超过限制' };
        }
        
        // 检查媒体文件数量
        if (media.length > socialConfig.content.posts.maxMediaFiles) {
          return { success: false, message: '媒体文件数量超过限制' };
        }
        
        const post = new socialModels.Post({
          userId,
          content,
          media,
          tags,
          visibility
        });
        
        await post.save();
        
        return { success: true, data: post };
      } catch (error) {
        logger.error('创建帖子失败:', error);
        return { success: false, message: '创建失败' };
      }
    },
    
    // 获取帖子列表
    async getPosts(page = 1, limit = 20, filters = {}) {
      try {
        const skip = (page - 1) * limit;
        const query = {};
        
        if (filters.userId) {
          query.userId = filters.userId;
        }
        
        if (filters.tag) {
          query.tags = filters.tag;
        }
        
        if (filters.visibility) {
          query.visibility = filters.visibility;
        }
        
        const posts = await socialModels.Post.find(query).populate('userId', 'username avatar displayName').sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        const total = await socialModels.Post.countDocuments(query);
        
        return { success: true, data: posts, total, page, limit };
      } catch (error) {
        logger.error('获取帖子失败:', error);
        return { success: false, message: '获取失败' };
      }
    },
    
    // 获取帖子详情
    async getPost(postId) {
      try {
        const post = await socialModels.Post.findById(postId).populate('userId', 'username avatar displayName');
        
        if (!post) {
          return { success: false, message: '帖子不存在' };
        }
        
        // 增加浏览量
        post.views += 1;
        await post.save();
        
        return { success: true, data: post };
      } catch (error) {
        logger.error('获取帖子详情失败:', error);
        return { success: false, message: '获取失败' };
      }
    },
    
    // 更新帖子
    async updatePost(postId, userId, content, media = [], tags = []) {
      try {
        const post = await socialModels.Post.findOne({ _id: postId, userId });
        
        if (!post) {
          return { success: false, message: '帖子不存在或无权限' };
        }
        
        if (content.length > socialConfig.content.posts.maxLength) {
          return { success: false, message: '内容长度超过限制' };
        }
        
        if (media.length > socialConfig.content.posts.maxMediaFiles) {
          return { success: false, message: '媒体文件数量超过限制' };
        }
        
        post.content = content;
        post.media = media;
        post.tags = tags;
        post.updatedAt = new Date();
        
        await post.save();
        
        return { success: true, data: post };
      } catch (error) {
        logger.error('更新帖子失败:', error);
        return { success: false, message: '更新失败' };
      }
    },
    
    // 删除帖子
    async deletePost(postId, userId) {
      try {
        const result = await socialModels.Post.deleteOne({ _id: postId, userId });
        
        if (result.deletedCount > 0) {
          return { success: true, message: '删除成功' };
        } else {
          return { success: false, message: '帖子不存在或无权限' };
        }
      } catch (error) {
        logger.error('删除帖子失败:', error);
        return { success: false, message: '删除失败' };
      }
    }
  },
  
  // 评论服务
  comments: {
    // 创建评论
    async createComment(userId, postId, content, parentId = null) {
      try {
        // 检查内容长度
        if (content.length > socialConfig.comments.maxLength) {
          return { success: false, message: '评论长度超过限制' };
        }
        
        // 检查嵌套深度
        if (parentId) {
          const parentComment = await socialModels.Comment.findById(parentId);
          if (parentComment) {
            // 这里可以添加深度检查逻辑
          }
        }
        
        const comment = new socialModels.Comment({
          userId,
          postId,
          parentId,
          content
        });
        
        await comment.save();
        
        // 更新帖子评论数
        await socialModels.Post.findByIdAndUpdate(postId, {
          $inc: { comments: 1 }
        });
        
        // 发送通知给帖子作者
        const post = await socialModels.Post.findById(postId);
        if (post && post.userId.toString() !== userId.toString()) {
          await socialServices.notifications.sendNotification(post.userId, {
            type: 'comment',
            title: '新评论',
            message: '你的帖子收到了新评论',
            data: { postId, commentId: comment._id }
          });
        }
        
        return { success: true, data: comment };
      } catch (error) {
        logger.error('创建评论失败:', error);
        return { success: false, message: '创建失败' };
      }
    },
    
    // 获取评论列表
    async getComments(postId, page = 1, limit = 20) {
      try {
        const skip = (page - 1) * limit;
        const comments = await socialModels.Comment.find({
          postId,
          parentId: null
        }).populate('userId', 'username avatar displayName').sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        // 获取每个评论的回复
        for (const comment of comments) {
          comment.replies = await socialModels.Comment.find({
            parentId: comment._id
          }).populate('userId', 'username avatar displayName').sort({ createdAt: 1 });
        }
        
        const total = await socialModels.Comment.countDocuments({
          postId,
          parentId: null
        });
        
        return { success: true, data: comments, total, page, limit };
      } catch (error) {
        logger.error('获取评论失败:', error);
        return { success: false, message: '获取失败' };
      }
    },
    
    // 更新评论
    async updateComment(commentId, userId, content) {
      try {
        const comment = await socialModels.Comment.findOne({ _id: commentId, userId });
        
        if (!comment) {
          return { success: false, message: '评论不存在或无权限' };
        }
        
        if (content.length > socialConfig.comments.maxLength) {
          return { success: false, message: '评论长度超过限制' };
        }
        
        comment.content = content;
        comment.updatedAt = new Date();
        
        await comment.save();
        
        return { success: true, data: comment };
      } catch (error) {
        logger.error('更新评论失败:', error);
        return { success: false, message: '更新失败' };
      }
    },
    
    // 删除评论
    async deleteComment(commentId, userId) {
      try {
        const comment = await socialModels.Comment.findOne({ _id: commentId, userId });
        
        if (!comment) {
          return { success: false, message: '评论不存在或无权限' };
        }
        
        // 删除评论及其回复
        await socialModels.Comment.deleteMany({
          $or: [
            { _id: commentId },
            { parentId: commentId }
          ]
        });
        
        // 更新帖子评论数
        await socialModels.Post.findByIdAndUpdate(comment.postId, {
          $inc: { comments: -1 }
        });
        
        return { success: true, message: '删除成功' };
      } catch (error) {
        logger.error('删除评论失败:', error);
        return { success: false, message: '删除失败' };
      }
    }
  },
  
  // 互动服务
  interactions: {
    // 点赞
    async likePost(userId, postId) {
      try {
        // 这里需要实现点赞逻辑
        // 可以使用单独的点赞表或在帖子中记录点赞用户
        
        // 更新帖子点赞数
        const post = await socialModels.Post.findByIdAndUpdate(postId, {
          $inc: { likes: 1 }
        }, { new: true });
        
        if (!post) {
          return { success: false, message: '帖子不存在' };
        }
        
        // 发送通知
        if (post.userId.toString() !== userId.toString()) {
          await socialServices.notifications.sendNotification(post.userId, {
            type: 'like',
            title: '新点赞',
            message: '你的帖子被点赞了',
            data: { postId, userId }
          });
        }
        
        return { success: true, data: post };
      } catch (error) {
        logger.error('点赞失败:', error);
        return { success: false, message: '点赞失败' };
      }
    },
    
    // 取消点赞
    async unlikePost(userId, postId) {
      try {
        // 这里需要实现取消点赞逻辑
        
        // 更新帖子点赞数
        const post = await socialModels.Post.findByIdAndUpdate(postId, {
          $inc: { likes: -1 }
        }, { new: true });
        
        if (!post) {
          return { success: false, message: '帖子不存在' };
        }
        
        return { success: true, data: post };
      } catch (error) {
        logger.error('取消点赞失败:', error);
        return { success: false, message: '取消点赞失败' };
      }
    },
    
    // 分享
    async sharePost(userId, postId, platform) {
      try {
        // 检查分享平台是否支持
        if (!socialConfig.sharing.platforms.includes(platform)) {
          return { success: false, message: '不支持的分享平台' };
        }
        
        // 更新帖子分享数
        const post = await socialModels.Post.findByIdAndUpdate(postId, {
          $inc: { shares: 1 }
        }, { new: true });
        
        if (!post) {
          return { success: false, message: '帖子不存在' };
        }
        
        // 发送通知
        if (post.userId.toString() !== userId.toString()) {
          await socialServices.notifications.sendNotification(post.userId, {
            type: 'share',
            title: '新分享',
            message: '你的帖子被分享了',
            data: { postId, userId, platform }
          });
        }
        
        return { success: true, data: post };
      } catch (error) {
        logger.error('分享失败:', error);
        return { success: false, message: '分享失败' };
      }
    }
  },
  
  // 社区服务
  community: {
    // 创建社区
    async createCommunity(name, description, ownerId, visibility = 'public') {
      try {
        const community = new socialModels.Community({
          name,
          description,
          ownerId,
          members: [{
            userId: ownerId,
            role: 'owner',
            joinedAt: new Date()
          }],
          visibility
        });
        
        await community.save();
        
        return { success: true, data: community };
      } catch (error) {
        logger.error('创建社区失败:', error);
        return { success: false, message: '创建失败' };
      }
    },
    
    // 加入社区
    async joinCommunity(communityId, userId) {
      try {
        const community = await socialModels.Community.findById(communityId);
        
        if (!community) {
          return { success: false, message: '社区不存在' };
        }
        
        // 检查是否已经加入
        const isMember = community.members.some(member => 
          member.userId.toString() === userId.toString()
        );
        
        if (isMember) {
          return { success: false, message: '已经是社区成员' };
        }
        
        // 检查社区成员上限
        if (community.members.length >= socialConfig.community.groups.maxMembers) {
          return { success: false, message: '社区成员已满' };
        }
        
        community.members.push({
          userId,
          role: 'member',
          joinedAt: new Date()
        });
        
        await community.save();
        
        return { success: true, message: '加入成功' };
      } catch (error) {
        logger.error('加入社区失败:', error);
        return { success: false, message: '加入失败' };
      }
    },
    
    // 获取社区列表
    async getCommunities(page = 1, limit = 20) {
      try {
        const skip = (page - 1) * limit;
        const communities = await socialModels.Community.find({
          visibility: 'public'
        }).populate('ownerId', 'username avatar displayName').skip(skip).limit(limit);
        
        const total = await socialModels.Community.countDocuments({
          visibility: 'public'
        });
        
        return { success: true, data: communities, total, page, limit };
      } catch (error) {
        logger.error('获取社区列表失败:', error);
        return { success: false, message: '获取失败' };
      }
    },
    
    // 获取社区详情
    async getCommunity(communityId) {
      try {
        const community = await socialModels.Community.findById(communityId).populate('ownerId', 'username avatar displayName');
        
        if (!community) {
          return { success: false, message: '社区不存在' };
        }
        
        return { success: true, data: community };
      } catch (error) {
        logger.error('获取社区详情失败:', error);
        return { success: false, message: '获取失败' };
      }
    }
  },
  
  // 排行榜服务
  leaderboard: {
    // 获取排行榜
    async getLeaderboard(category, period = 'daily', limit = 100) {
      try {
        // 这里需要实现排行榜逻辑
        // 根据不同类别和周期计算排行榜
        
        return { success: true, data: [] };
      } catch (error) {
        logger.error('获取排行榜失败:', error);
        return { success: false, message: '获取失败' };
      }
    }
  }
};

// 社交功能API路由
const socialRoutes = (app) => {
  // 用户关系路由
  app.post('/api/social/follow', async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.userRelations.followUser(userId, followingId);
    res.json(result);
  });
  
  app.post('/api/social/unfollow', async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.userRelations.unfollowUser(userId, followingId);
    res.json(result);
  });
  
  app.post('/api/social/block', async (req, res) => {
    const { blockId } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.userRelations.blockUser(userId, blockId);
    res.json(result);
  });
  
  app.get('/api/social/following', async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await socialServices.userRelations.getFollowing(userId, page, limit);
    res.json(result);
  });
  
  app.get('/api/social/followers', async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await socialServices.userRelations.getFollowers(userId, page, limit);
    res.json(result);
  });
  
  // 消息路由
  app.post('/api/social/messages', async (req, res) => {
    const { recipientId, content, type } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.messaging.sendMessage(userId, recipientId, content, type);
    res.json(result);
  });
  
  app.get('/api/social/messages/:otherId', async (req, res) => {
    const otherId = req.params.otherId;
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const result = await socialServices.messaging.getMessageHistory(userId, otherId, page, limit);
    res.json(result);
  });
  
  app.get('/api/social/conversations', async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await socialServices.messaging.getConversations(userId, page, limit);
    res.json(result);
  });
  
  // 通知路由
  app.get('/api/social/notifications', async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await socialServices.notifications.getNotifications(userId, page, limit);
    res.json(result);
  });
  
  app.put('/api/social/notifications/:id/read', async (req, res) => {
    const notificationId = req.params.id;
    const userId = req.user._id;
    
    const result = await socialServices.notifications.markAsRead(notificationId, userId);
    res.json(result);
  });
  
  app.put('/api/social/notifications/read-all', async (req, res) => {
    const userId = req.user._id;
    
    const result = await socialServices.notifications.markAllAsRead(userId);
    res.json(result);
  });
  
  // 帖子路由
  app.post('/api/social/posts', async (req, res) => {
    const { content, media, tags, visibility } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.content.createPost(userId, content, media, tags, visibility);
    res.json(result);
  });
  
  app.get('/api/social/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = {
      userId: req.query.userId,
      tag: req.query.tag,
      visibility: req.query.visibility
    };
    
    const result = await socialServices.content.getPosts(page, limit, filters);
    res.json(result);
  });
  
  app.get('/api/social/posts/:id', async (req, res) => {
    const postId = req.params.id;
    
    const result = await socialServices.content.getPost(postId);
    res.json(result);
  });
  
  app.put('/api/social/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const { content, media, tags } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.content.updatePost(postId, userId, content, media, tags);
    res.json(result);
  });
  
  app.delete('/api/social/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
    
    const result = await socialServices.content.deletePost(postId, userId);
    res.json(result);
  });
  
  // 评论路由
  app.post('/api/social/comments', async (req, res) => {
    const { postId, content, parentId } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.comments.createComment(userId, postId, content, parentId);
    res.json(result);
  });
  
  app.get('/api/social/posts/:postId/comments', async (req, res) => {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await socialServices.comments.getComments(postId, page, limit);
    res.json(result);
  });
  
  app.put('/api/social/comments/:id', async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.comments.updateComment(commentId, userId, content);
    res.json(result);
  });
  
  app.delete('/api/social/comments/:id', async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user._id;
    
    const result = await socialServices.comments.deleteComment(commentId, userId);
    res.json(result);
  });
  
  // 互动路由
  app.post('/api/social/posts/:id/like', async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
    
    const result = await socialServices.interactions.likePost(userId, postId);
    res.json(result);
  });
  
  app.post('/api/social/posts/:id/unlike', async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
    
    const result = await socialServices.interactions.unlikePost(userId, postId);
    res.json(result);
  });
  
  app.post('/api/social/posts/:id/share', async (req, res) => {
    const postId = req.params.id;
    const { platform } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.interactions.sharePost(userId, postId, platform);
    res.json(result);
  });
  
  // 社区路由
  app.post('/api/social/communities', async (req, res) => {
    const { name, description, visibility } = req.body;
    const userId = req.user._id;
    
    const result = await socialServices.community.createCommunity(name, description, userId, visibility);
    res.json(result);
  });
  
  app.post('/api/social/communities/:id/join', async (req, res) => {
    const communityId = req.params.id;
    const userId = req.user._id;
    
    const result = await socialServices.community.joinCommunity(communityId, userId);
    res.json(result);
  });
  
  app.get('/api/social/communities', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await socialServices.community.getCommunities(page, limit);
    res.json(result);
  });
  
  app.get('/api/social/communities/:id', async (req, res) => {
    const communityId = req.params.id;
    
    const result = await socialServices.community.getCommunity(communityId);
    res.json(result);
  });
  
  // 排行榜路由
  app.get('/api/social/leaderboard', async (req, res) => {
    const category = req.query.category || 'profit';
    const period = req.query.period || 'daily';
    const limit = parseInt(req.query.limit) || 100;
    
    const result = await socialServices.leaderboard.getLeaderboard(category, period, limit);
    res.json(result);
  });
};

// 社交功能管理器
const socialManager = {
  socialConfig,
  socialModels,
  socialServices,
  socialRoutes,
  
  // 初始化
  initialize(app) {
    // 注册路由
    socialRoutes(app);
    
    console.log('✅ 社交功能系统已初始化');
  }
};

module.exports = socialManager;