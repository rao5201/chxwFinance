/**
 * 茶海虾王@金融交易所看板平台 - 生产环境安全配置脚本
 * 自动配置MongoDB和Redis安全认证
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const execAsync = promisify(exec);

// 安全配置
const securityConfig = {
  mongodb: {
    adminUser: process.env.MONGODB_ADMIN_USER || 'admin',
    adminPassword: process.env.MONGODB_ADMIN_PASSWORD || generateSecurePassword(),
    appUser: process.env.MONGODB_APP_USER || 'tea_sea_shrimp_king',
    appPassword: process.env.MONGODB_APP_PASSWORD || generateSecurePassword(),
    database: process.env.MONGODB_DB_NAME || 'tea_sea_shrimp_king',
    authSource: 'admin'
  },
  redis: {
    password: process.env.REDIS_PASSWORD || generateSecurePassword(),
    bind: '127.0.0.1',
    port: 6379,
    protectedMode: 'yes'
  }
};

// 生成安全密码
function generateSecurePassword(length = 32) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

// 生成MongoDB配置文件
function generateMongoDBConfig() {
  const config = `
# MongoDB生产环境安全配置
# 茶海虾王@金融交易所看板平台

# 网络配置
net:
  bindIp: 127.0.0.1
  port: 27017
  
# 安全配置
security:
  authorization: enabled
  
# 存储配置
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  
# 系统日志配置
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
  
# 进程管理
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
`;
  return config;
}

// 生成Redis配置文件
function generateRedisConfig() {
  const config = `
# Redis生产环境安全配置
# 茶海虾王@金融交易所看板平台

# 网络配置
bind 127.0.0.1
port 6379
protected-mode yes

# 安全认证
requirepass ${securityConfig.redis.password}

# 持久化配置
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis

# 内存配置
maxmemory 2gb
maxmemory-policy allkeys-lru

# 日志配置
loglevel notice
logfile /var/log/redis/redis-server.log

# 客户端配置
maxclients 10000

# 超时配置
timeout 300
tcp-keepalive 300

# 禁用危险命令
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
rename-command DEBUG ""
rename-command SHUTDOWN ""
`;
  return config;
}

// 生成MongoDB初始化脚本
function generateMongoDBInitScript() {
  const script = `
// MongoDB初始化脚本
// 创建管理员用户
use admin;

db.createUser({
  user: "${securityConfig.mongodb.adminUser}",
  pwd: "${securityConfig.mongodb.adminPassword}",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
});

// 创建应用数据库用户
use ${securityConfig.mongodb.database};

db.createUser({
  user: "${securityConfig.mongodb.appUser}",
  pwd: "${securityConfig.mongodb.appPassword}",
  roles: [
    { role: "readWrite", db: "${securityConfig.mongodb.database}" },
    { role: "dbAdmin", db: "${securityConfig.mongodb.database}" }
  ]
});

print("MongoDB用户创建完成");
`;
  return script;
}

// 生成环境变量文件
function generateEnvFile() {
  const env = `
# 茶海虾王@金融交易所看板平台 - 生产环境配置
# MongoDB配置
MONGODB_URI=mongodb://${securityConfig.mongodb.appUser}:${securityConfig.mongodb.appPassword}@localhost:27017/${securityConfig.mongodb.database}?authSource=admin
MONGODB_DB_NAME=${securityConfig.mongodb.database}
MONGODB_ADMIN_USER=${securityConfig.mongodb.adminUser}
MONGODB_ADMIN_PASSWORD=${securityConfig.mongodb.adminPassword}
MONGODB_APP_USER=${securityConfig.mongodb.appUser}
MONGODB_APP_PASSWORD=${securityConfig.mongodb.appPassword}

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=${securityConfig.redis.password}

# JWT配置
JWT_SECRET=${generateSecurePassword(64)}
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=${generateSecurePassword(64)}
JWT_REFRESH_EXPIRE=30d

# 加密密钥
ENCRYPTION_KEY=${generateSecurePassword(32)}
BACKUP_ENCRYPTION_KEY=${generateSecurePassword(32)}

# 其他安全配置
SECURE_COOKIE=true
HTTPS_ENABLED=true
`;
  return env;
}

// 保存配置文件
async function saveConfigFiles() {
  const configDir = path.join(__dirname, '..', 'config', 'production');
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  // 保存MongoDB配置
  fs.writeFileSync(
    path.join(configDir, 'mongodb.conf'),
    generateMongoDBConfig()
  );
  
  // 保存Redis配置
  fs.writeFileSync(
    path.join(configDir, 'redis.conf'),
    generateRedisConfig()
  );
  
  // 保存MongoDB初始化脚本
  fs.writeFileSync(
    path.join(configDir, 'mongodb-init.js'),
    generateMongoDBInitScript()
  );
  
  // 保存环境变量文件
  fs.writeFileSync(
    path.join(configDir, '.env.production'),
    generateEnvFile()
  );
  
  console.log('✅ 配置文件已生成');
}

// 执行MongoDB初始化
async function setupMongoDB() {
  console.log('🔧 配置MongoDB安全认证...');
  
  try {
    // 检查MongoDB是否运行
    await execAsync('pgrep mongod');
    console.log('✅ MongoDB服务正在运行');
    
    // 执行初始化脚本
    const initScript = generateMongoDBInitScript();
    const tempFile = path.join(__dirname, 'temp-mongodb-init.js');
    fs.writeFileSync(tempFile, initScript);
    
    await execAsync(`mongo ${tempFile}`);
    fs.unlinkSync(tempFile);
    
    console.log('✅ MongoDB安全认证配置完成');
    console.log(`   管理员用户: ${securityConfig.mongodb.adminUser}`);
    console.log(`   应用用户: ${securityConfig.mongodb.appUser}`);
    
  } catch (error) {
    console.error('❌ MongoDB配置失败:', error.message);
    console.log('💡 请确保MongoDB服务已启动');
  }
}

// 执行Redis初始化
async function setupRedis() {
  console.log('🔧 配置Redis安全认证...');
  
  try {
    // 检查Redis是否运行
    await execAsync('pgrep redis-server');
    console.log('✅ Redis服务正在运行');
    
    // 设置密码
    await execAsync(`redis-cli CONFIG SET requirepass "${securityConfig.redis.password}"`);
    
    // 保存配置
    await execAsync('redis-cli CONFIG REWRITE');
    
    console.log('✅ Redis安全认证配置完成');
    console.log('   密码已设置并保存');
    
  } catch (error) {
    console.error('❌ Redis配置失败:', error.message);
    console.log('💡 请确保Redis服务已启动');
  }
}

// 显示配置摘要
function showConfigSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 生产环境安全配置摘要');
  console.log('='.repeat(60));
  
  console.log('\n📊 MongoDB配置:');
  console.log(`   数据库: ${securityConfig.mongodb.database}`);
  console.log(`   管理员: ${securityConfig.mongodb.adminUser}`);
  console.log(`   应用用户: ${securityConfig.mongodb.appUser}`);
  console.log(`   认证源: ${securityConfig.mongodb.authSource}`);
  
  console.log('\n📊 Redis配置:');
  console.log(`   绑定地址: ${securityConfig.redis.bind}`);
  console.log(`   端口: ${securityConfig.redis.port}`);
  console.log(`   保护模式: ${securityConfig.redis.protectedMode}`);
  
  console.log('\n📁 生成的文件:');
  console.log('   - config/production/mongodb.conf');
  console.log('   - config/production/redis.conf');
  console.log('   - config/production/mongodb-init.js');
  console.log('   - config/production/.env.production');
  
  console.log('\n⚠️  重要提示:');
  console.log('   1. 请妥善保存生成的密码');
  console.log('   2. 将.env.production复制到项目根目录');
  console.log('   3. 重启MongoDB和Redis服务以应用配置');
  console.log('   4. 定期更换密码以提高安全性');
  
  console.log('='.repeat(60) + '\n');
}

// 主函数
async function main() {
  console.log('🚀 开始配置生产环境安全认证...\n');
  
  try {
    // 保存配置文件
    await saveConfigFiles();
    
    // 配置MongoDB
    await setupMongoDB();
    
    // 配置Redis
    await setupRedis();
    
    // 显示配置摘要
    showConfigSummary();
    
    console.log('✅ 生产环境安全配置完成！');
    
  } catch (error) {
    console.error('❌ 配置失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  securityConfig,
  generateSecurePassword,
  generateMongoDBConfig,
  generateRedisConfig,
  generateMongoDBInitScript,
  generateEnvFile
};
