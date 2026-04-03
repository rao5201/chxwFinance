const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

// 生成JWT令牌
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// 生成刷新令牌
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRE }
  );
};

// 注册
router.post('/register', function(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供用户名、邮箱和密码'
      });
    }
    
    // 检查用户是否已存在
    const existingUser = global.db.findOne('users', {
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }
    
    // 加密密码
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // 创建新用户
    const user = global.db.insert('users', {
      username: username,
      email: email,
      password: hashedPassword,
      balance: 0,
      role: 'user',
      status: 'active'
    });
    
    // 生成令牌
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // 保存刷新令牌
    global.db.update('users', { _id: user._id }, {
      refreshToken: refreshToken
    });
    
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          balance: user.balance,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message
    });
  }
});

// 登录
router.post('/login', function(req, res) {
  try {
    const { username, password } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供用户名和密码'
      });
    }
    
    // 查找用户
    const users = global.db.findAll('users');
    let user = null;
    
    for (let u of users) {
      if (u.username === username || u.email === username) {
        user = u;
        break;
      }
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 检查账户状态
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: '账户已被禁用'
      });
    }
    
    // 验证密码
    const isMatch = bcrypt.compareSync(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 更新最后登录时间
    global.db.update('users', { _id: user._id }, {
      lastLogin: new Date()
    });
    
    // 生成令牌
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // 保存刷新令牌
    global.db.update('users', { _id: user._id }, {
      refreshToken: refreshToken
    });
    
    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          balance: user.balance,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
});

// 刷新令牌
router.post('/refresh', function(req, res) {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: '请提供刷新令牌'
      });
    }
    
    // 验证刷新令牌
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // 查找用户
    const user = global.db.findOne('users', { _id: decoded.id });
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: '无效的刷新令牌'
      });
    }
    
    // 生成新令牌
    const token = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // 保存新的刷新令牌
    global.db.update('users', { _id: user._id }, {
      refreshToken: newRefreshToken
    });
    
    res.json({
      success: true,
      message: '令牌刷新成功',
      data: {
        token,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(401).json({
      success: false,
      message: '刷新令牌失败',
      error: error.message
    });
  }
});

// 登出
router.post('/logout', function(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 清除用户的刷新令牌
        global.db.update('users', { _id: decoded.id }, {
          refreshToken: null
        });
      } catch (err) {
        // 令牌验证失败，继续执行
      }
    }
    
    res.json({
      success: true,
      message: '登出成功'
    });
  } catch (error) {
    console.error('登出错误:', error);
    res.status(500).json({
      success: false,
      message: '登出失败',
      error: error.message
    });
  }
});

// 获取当前用户信息
router.get('/me', function(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = global.db.findOne('users', { _id: decoded.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          balance: user.balance,
          status: user.status,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(401).json({
      success: false,
      message: '认证失败',
      error: error.message
    });
  }
});

module.exports = router;
