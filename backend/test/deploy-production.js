/**
 * 茶海虾王@金融交易所看板平台 - 生产环境部署脚本
 * 包含MongoDB和Redis的部署配置
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 部署配置
const deployConfig = {
  mongodb: {
    version: '7.0',
    port: 27017,
    dataDir: '/data/mongodb',
    logDir: '/var/log/mongodb',
    configFile: '/etc/mongod.conf',
    serviceName: 'mongod',
    auth: {
      enabled: true,
      adminUser: 'admin',
      appDatabase: 'tea_sea_shrimp_king',
      appUser: 'app_user'
    }
  },
  redis: {
    version: '7.2',
    port: 6379,
    dataDir: '/data/redis',
    logDir: '/var/log/redis',
    configFile: '/etc/redis/redis.conf',
    serviceName: 'redis-server',
    auth: {
      enabled: true
    }
  },
  nodejs: {
    version: '18',
    port: 3000,
    pm2: {
      enabled: true,
      instances: 'max',
      execMode: 'cluster'
    }
  },
  nginx: {
    enabled: true,
    ssl: {
      enabled: true,
      certPath: '/etc/nginx/ssl',
      domain: 'api.tea-sea-shrimp-king.com'
    }
  }
};

// 生成MongoDB配置文件
function generateMongoDBConfig() {
  const config = `
# MongoDB配置文件 - 茶海虾王金融交易所

# 数据存储路径
storage:
  dbPath: ${deployConfig.mongodb.dataDir}
  journal:
    enabled: true
  engine: wiredTiger
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2

# 日志配置
systemLog:
  destination: file
  logAppend: true
  path: ${deployConfig.mongodb.logDir}/mongod.log
  logRotate: reopen

# 网络配置
net:
  port: ${deployConfig.mongodb.port}
  bindIp: 127.0.0.1
  maxIncomingConnections: 1000

# 进程管理
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
  pidFilePath: /var/run/mongodb/mongod.pid

# 安全配置
security:
  authorization: enabled
  javascriptEnabled: false

# 性能优化
operationProfiling:
  slowOpThresholdMs: 100
  mode: slowOp

# 复制集配置（可选）
# replication:
#   replSetName: rs0

# 分片配置（可选）
# sharding:
#   clusterRole: shardsvr
`;
  return config;
}

// 生成Redis配置文件
function generateRedisConfig() {
  const config = `
# Redis配置文件 - 茶海虾王金融交易所

# 基础配置
port ${deployConfig.redis.port}
bind 127.0.0.1
daemonize yes
supervised systemd
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile ${deployConfig.redis.logDir}/redis-server.log
dir ${deployConfig.redis.dataDir}

# 持久化配置
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb

# AOF持久化
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# 内存管理
maxmemory 2gb
maxmemory-policy allkeys-lru
maxmemory-samples 5

# 安全配置
requirepass YOUR_REDIS_PASSWORD_HERE
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_9f8d2e1b"

# 性能优化
tcp-keepalive 300
timeout 0
tcp-backlog 511
databases 16

# 慢查询日志
slowlog-log-slower-than 10000
slowlog-max-len 128

# 客户端输出缓冲区限制
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
`;
  return config;
}

// 生成Nginx配置文件
function generateNginxConfig() {
  const config = `
# Nginx配置文件 - 茶海虾王金融交易所

upstream backend {
    server 127.0.0.1:${deployConfig.nodejs.port};
    keepalive 32;
}

# HTTP服务器 - 重定向到HTTPS
server {
    listen 80;
    server_name ${deployConfig.nginx.ssl.domain};
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS服务器
server {
    listen 443 ssl http2;
    server_name ${deployConfig.nginx.ssl.domain};
    
    # SSL证书配置
    ssl_certificate ${deployConfig.nginx.ssl.certPath}/fullchain.pem;
    ssl_certificate_key ${deployConfig.nginx.ssl.certPath}/privkey.pem;
    ssl_trusted_certificate ${deployConfig.nginx.ssl.certPath}/chain.pem;
    
    # SSL优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # 安全头部
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 日志配置
    access_log /var/log/nginx/tea-sea-shrimp-king-access.log;
    error_log /var/log/nginx/tea-sea-shrimp-king-error.log;
    
    # 静态文件
    location /static/ {
        alias /var/www/tea-sea-shrimp-king/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 媒体文件
    location /media/ {
        alias /var/www/tea-sea-shrimp-king/media/;
        expires 7d;
        add_header Cache-Control "public";
    }
    
    # API代理
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # WebSocket支持
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        access_log off;
    }
    
    # 根路径
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`;
  return config;
}

// 生成PM2配置文件
function generatePM2Config() {
  const config = {
    apps: [{
      name: 'tea-sea-shrimp-king',
      script: './server.js',
      cwd: '/var/www/tea-sea-shrimp-king/backend',
      instances: deployConfig.nodejs.pm2.instances,
      exec_mode: deployConfig.nodejs.pm2.execMode,
      env: {
        NODE_ENV: 'production',
        PORT: deployConfig.nodejs.port,
        MONGODB_URI: 'mongodb://app_user:YOUR_MONGODB_PASSWORD@localhost:27017/tea_sea_shrimp_king?authSource=tea_sea_shrimp_king',
        REDIS_URL: 'redis://:YOUR_REDIS_PASSWORD@localhost:6379'
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/pm2/tea-sea-shrimp-king-error.log',
      out_file: '/var/log/pm2/tea-sea-shrimp-king-out.log',
      log_file: '/var/log/pm2/tea-sea-shrimp-king-combined.log',
      time: true,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 5,
      restart_delay: 3000,
      kill_timeout: 5000,
      listen_timeout: 10000,
      merge_logs: true,
      log_type: 'json'
    }]
  };
  return JSON.stringify(config, null, 2);
}

// 生成部署脚本
function generateDeployScript() {
  const script = `#!/bin/bash

# 茶海虾王@金融交易所看板平台 - 生产环境部署脚本
# 执行前请确保以root用户运行

set -e

echo "🚀 开始部署茶海虾王金融交易所..."

# 更新系统
echo "📦 更新系统包..."
apt-get update
apt-get upgrade -y

# 安装基础工具
echo "🔧 安装基础工具..."
apt-get install -y curl wget git vim htop net-tools ufw fail2ban

# 安装Node.js
echo "📦 安装Node.js ${deployConfig.nodejs.version}..."
curl -fsSL https://deb.nodesource.com/setup_${deployConfig.nodejs.version}.x | bash -
apt-get install -y nodejs
npm install -g pm2

# 安装MongoDB
echo "📦 安装MongoDB ${deployConfig.mongodb.version}..."
wget -qO - https://www.mongodb.org/static/pgp/server-${deployConfig.mongodb.version}.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/${deployConfig.mongodb.version} multiverse" | tee /etc/apt/sources.list.d/mongodb-org-${deployConfig.mongodb.version}.list
apt-get update
apt-get install -y mongodb-org

# 创建MongoDB目录
echo "📁 创建MongoDB目录..."
mkdir -p ${deployConfig.mongodb.dataDir}
mkdir -p ${deployConfig.mongodb.logDir}
mkdir -p /var/run/mongodb
chown -R mongodb:mongodb ${deployConfig.mongodb.dataDir}
chown -R mongodb:mongodb ${deployConfig.mongodb.logDir}
chown -R mongodb:mongodb /var/run/mongodb

# 配置MongoDB
echo "⚙️ 配置MongoDB..."
cat > ${deployConfig.mongodb.configFile} << 'EOF'
${generateMongoDBConfig()}
EOF

# 启动MongoDB
echo "🚀 启动MongoDB..."
systemctl enable mongod
systemctl start mongod

# 等待MongoDB启动
sleep 5

# 创建MongoDB用户
echo "👤 创建MongoDB用户..."
mongosh << EOF
use admin
db.createUser({
  user: "${deployConfig.mongodb.auth.adminUser}",
  pwd: "YOUR_ADMIN_PASSWORD",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

use ${deployConfig.mongodb.auth.appDatabase}
db.createUser({
  user: "${deployConfig.mongodb.auth.appUser}",
  pwd: "YOUR_APP_PASSWORD",
  roles: [
    { role: "readWrite", db: "${deployConfig.mongodb.auth.appDatabase}" },
    { role: "dbAdmin", db: "${deployConfig.mongodb.auth.appDatabase}" }
  ]
})
EOF

# 安装Redis
echo "📦 安装Redis ${deployConfig.redis.version}..."
apt-get install -y redis-server

# 创建Redis目录
echo "📁 创建Redis目录..."
mkdir -p ${deployConfig.redis.dataDir}
mkdir -p ${deployConfig.redis.logDir}
mkdir -p /var/run/redis
chown -R redis:redis ${deployConfig.redis.dataDir}
chown -R redis:redis ${deployConfig.redis.logDir}
chown -R redis:redis /var/run/redis

# 配置Redis
echo "⚙️ 配置Redis..."
cat > ${deployConfig.redis.configFile} << 'EOF'
${generateRedisConfig()}
EOF

# 启动Redis
echo "🚀 启动Redis..."
systemctl enable redis-server
systemctl start redis-server

# 安装Nginx
echo "📦 安装Nginx..."
apt-get install -y nginx

# 配置Nginx
echo "⚙️ 配置Nginx..."
cat > /etc/nginx/sites-available/tea-sea-shrimp-king << 'EOF'
${generateNginxConfig()}
EOF

ln -sf /etc/nginx/sites-available/tea-sea-shrimp-king /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 创建SSL目录
mkdir -p ${deployConfig.nginx.ssl.certPath}

# 测试Nginx配置
nginx -t

# 启动Nginx
systemctl enable nginx
systemctl start nginx

# 配置防火墙
echo "🔥 配置防火墙..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 配置Fail2ban
echo "🛡️ 配置Fail2ban..."
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
EOF

systemctl enable fail2ban
systemctl start fail2ban

# 创建应用目录
echo "📁 创建应用目录..."
mkdir -p /var/www/tea-sea-shrimp-king
mkdir -p /var/log/pm2

# 配置日志轮转
echo "📝 配置日志轮转..."
cat > /etc/logrotate.d/tea-sea-shrimp-king << EOF
/var/log/pm2/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 root root
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

echo "✅ 部署完成！"
echo ""
echo "📋 后续步骤："
echo "1. 将应用代码部署到 /var/www/tea-sea-shrimp-king"
echo "2. 修改MongoDB和Redis密码"
echo "3. 配置SSL证书（可以使用Let's Encrypt）"
echo "4. 启动应用：cd /var/www/tea-sea-shrimp-king/backend && pm2 start ecosystem.config.json"
echo ""
echo "🔐 安全提醒："
echo "- 请修改所有默认密码"
echo "- 配置SSH密钥登录，禁用密码登录"
echo "- 定期更新系统和软件包"
echo "- 配置自动备份"
`;
  return script;
}

// 生成SSL证书申请脚本
function generateSSLScript() {
  const script = `#!/bin/bash

# SSL证书申请脚本 - 使用Let's Encrypt

echo "🔒 申请SSL证书..."

# 安装Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d ${deployConfig.nginx.ssl.domain} --non-interactive --agree-tos --email admin@tea-sea-shrimp-king.com

# 设置自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

echo "✅ SSL证书申请完成！"
echo "证书路径：${deployConfig.nginx.ssl.certPath}"
`;
  return script;
}

// 生成备份脚本
function generateBackupScript() {
  const script = `#!/bin/bash

# 备份脚本

BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份MongoDB
echo "📦 备份MongoDB..."
mongodump --uri="mongodb://${deployConfig.mongodb.auth.appUser}:YOUR_APP_PASSWORD@localhost:27017/${deployConfig.mongodb.auth.appDatabase}?authSource=${deployConfig.mongodb.auth.appDatabase}" --out=$BACKUP_DIR/mongodb_$DATE

# 备份Redis
echo "📦 备份Redis..."
redis-cli -a YOUR_REDIS_PASSWORD BGSAVE
cp ${deployConfig.redis.dataDir}/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# 备份应用代码
echo "📦 备份应用代码..."
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www tea-sea-shrimp-king

# 备份配置文件
echo "📦 备份配置文件..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/nginx /etc/mongod.conf /etc/redis/redis.conf

# 清理旧备份
echo "🗑️ 清理旧备份..."
find $BACKUP_DIR -name "mongodb_*" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "redis_*.rdb" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "config_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ 备份完成：$DATE"
`;
  return script;
}

// 保存所有配置文件
function saveConfigs() {
  const deployDir = path.join(__dirname, '..', 'deploy');
  
  // 创建部署目录
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }
  
  // 保存MongoDB配置
  fs.writeFileSync(path.join(deployDir, 'mongod.conf'), generateMongoDBConfig());
  console.log('✅ MongoDB配置已保存');
  
  // 保存Redis配置
  fs.writeFileSync(path.join(deployDir, 'redis.conf'), generateRedisConfig());
  console.log('✅ Redis配置已保存');
  
  // 保存Nginx配置
  fs.writeFileSync(path.join(deployDir, 'nginx.conf'), generateNginxConfig());
  console.log('✅ Nginx配置已保存');
  
  // 保存PM2配置
  fs.writeFileSync(path.join(deployDir, 'ecosystem.config.json'), generatePM2Config());
  console.log('✅ PM2配置已保存');
  
  // 保存部署脚本
  fs.writeFileSync(path.join(deployDir, 'deploy.sh'), generateDeployScript());
  console.log('✅ 部署脚本已保存');
  
  // 保存SSL脚本
  fs.writeFileSync(path.join(deployDir, 'setup-ssl.sh'), generateSSLScript());
  console.log('✅ SSL脚本已保存');
  
  // 保存备份脚本
  fs.writeFileSync(path.join(deployDir, 'backup.sh'), generateBackupScript());
  console.log('✅ 备份脚本已保存');
  
  // 保存部署说明
  const readme = `
# 生产环境部署说明

## 部署步骤

1. **准备服务器**
   - Ubuntu 20.04 LTS 或更高版本
   - 至少 2GB RAM
   - 20GB 可用磁盘空间

2. **运行部署脚本**
   \`\`\`bash
   sudo bash deploy.sh
   \`\`\`

3. **配置SSL证书**
   \`\`\`bash
   sudo bash setup-ssl.sh
   \`\`\`

4. **部署应用代码**
   - 将应用代码上传到 /var/www/tea-sea-shrimp-king
   - 安装依赖：npm install
   - 启动应用：pm2 start ecosystem.config.json

5. **设置定时备份**
   \`\`\`bash
   crontab -e
   # 添加：0 2 * * * /bin/bash /var/www/tea-sea-shrimp-king/backend/deploy/backup.sh
   \`\`\`

## 配置文件说明

- mongod.conf - MongoDB配置文件
- redis.conf - Redis配置文件
- nginx.conf - Nginx配置文件
- ecosystem.config.json - PM2配置文件
- deploy.sh - 自动化部署脚本
- setup-ssl.sh - SSL证书申请脚本
- backup.sh - 数据备份脚本

## 安全建议

1. 修改所有默认密码
2. 配置SSH密钥登录
3. 禁用root远程登录
4. 定期更新系统和软件包
5. 配置自动备份
6. 监控服务器资源使用情况
`;
  fs.writeFileSync(path.join(deployDir, 'README.md'), readme);
  console.log('✅ 部署说明已保存');
  
  console.log(`\n📁 所有配置文件已保存到: ${deployDir}`);
}

// 执行保存
saveConfigs();

console.log('\n🎉 生产环境部署配置生成完成！');
console.log('\n📋 生成的文件：');
console.log('  - deploy/mongod.conf (MongoDB配置)');
console.log('  - deploy/redis.conf (Redis配置)');
console.log('  - deploy/nginx.conf (Nginx配置)');
console.log('  - deploy/ecosystem.config.json (PM2配置)');
console.log('  - deploy/deploy.sh (部署脚本)');
console.log('  - deploy/setup-ssl.sh (SSL证书脚本)');
console.log('  - deploy/backup.sh (备份脚本)');
console.log('  - deploy/README.md (部署说明)');
