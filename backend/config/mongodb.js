/**
 * MongoDB配置
 * 用于生产环境中使用真实的MongoDB数据库
 */

const mongoose = require('mongoose');

// MongoDB连接配置
const mongodbConfig = {
  // 连接字符串
  uri: process.env.MONGODB_URI || 'mongodb://admin:Admin123!@localhost:27017/chxw_finance?authSource=admin',
  
  // 连接选项
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
  },
  
  // 连接状态
  connected: false,
  connection: null
};

// 连接MongoDB
async function connectMongoDB() {
  try {
    console.log('🚀 正在连接MongoDB...');
    
    // 连接数据库
    const connection = await mongoose.connect(mongodbConfig.uri, mongodbConfig.options);
    
    mongodbConfig.connected = true;
    mongodbConfig.connection = connection;
    
    console.log('✅ MongoDB连接成功');
    console.log(`   - 数据库: ${connection.connection.name}`);
    console.log(`   - 主机: ${connection.connection.host}`);
    console.log(`   - 端口: ${connection.connection.port}`);
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message);
    mongodbConfig.connected = false;
    mongodbConfig.connection = null;
    
    // 在开发环境中，使用内存数据库作为备用
    console.warn('⚠️ 切换到内存数据库作为临时解决方案');
    return null;
  }
}

// 断开MongoDB连接
async function disconnectMongoDB() {
  try {
    if (mongodbConfig.connection) {
      await mongodbConfig.connection.disconnect();
      console.log('✅ MongoDB连接已断开');
    }
  } catch (error) {
    console.error('❌ 断开MongoDB连接失败:', error.message);
  }
  
  mongodbConfig.connected = false;
  mongodbConfig.connection = null;
}

// 检查MongoDB连接状态
function checkMongoDBStatus() {
  return {
    connected: mongodbConfig.connected,
    uri: mongodbConfig.uri,
    options: mongodbConfig.options
  };
}

// 导出
module.exports = {
  mongodbConfig,
  connectMongoDB,
  disconnectMongoDB,
  checkMongoDBStatus,
  // 导出mongoose实例
  mongoose
};
