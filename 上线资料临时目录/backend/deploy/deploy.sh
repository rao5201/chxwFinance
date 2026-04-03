#!/bin/bash

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
echo "📦 安装Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g pm2

# 安装MongoDB
echo "📦 安装MongoDB 7.0..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org

# 创建MongoDB目录
echo "📁 创建MongoDB目录..."
mkdir -p /data/mongodb
mkdir -p /var/log/mongodb
mkdir -p /var/run/mongodb
chown -R mongodb:mongodb /data/mongodb
chown -R mongodb:mongodb /var/log/mongodb
chown -R mongodb:mongodb /var/run/mongodb

# 配置MongoDB
echo "⚙️ 配置MongoDB..."
cat > /etc/mongod.conf << 'EOF'

# MongoDB配置文件 - 茶海虾王金融交易所

# 数据存储路径
storage:
  dbPath: /data/mongodb
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
  path: /var/log/mongodb/mongod.log
  logRotate: reopen

# 网络配置
net:
  port: 27017
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
  user: "admin",
  pwd: "YOUR_ADMIN_PASSWORD",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

use tea_sea_shrimp_king
db.createUser({
  user: "app_user",
  pwd: "YOUR_APP_PASSWORD",
  roles: [
    { role: "readWrite", db: "tea_sea_shrimp_king" },
    { role: "dbAdmin", db: "tea_sea_shrimp_king" }
  ]
})
EOF

# 安装Redis
echo "📦 安装Redis 7.2..."
apt-get install -y redis-server

# 创建Redis目录
echo "📁 创建Redis目录..."
mkdir -p /data/redis
mkdir -p /var/log/redis
mkdir -p /var/run/redis
chown -R redis:redis /data/redis
chown -R redis:redis /var/log/redis
chown -R redis:redis /var/run/redis

# 配置Redis
echo "⚙️ 配置Redis..."
cat > /etc/redis/redis.conf << 'EOF'

# Redis配置文件 - 茶海虾王金融交易所

# 基础配置
port 6379
bind 127.0.0.1
daemonize yes
supervised systemd
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log
dir /data/redis

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

# Nginx配置文件 - 茶海虾王金融交易所

upstream backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# HTTP服务器 - 重定向到HTTPS
server {
    listen 80;
    server_name api.tea-sea-shrimp-king.com;
    
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
    server_name api.tea-sea-shrimp-king.com;
    
    # SSL证书配置
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
    
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

EOF

ln -sf /etc/nginx/sites-available/tea-sea-shrimp-king /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 创建SSL目录
mkdir -p /etc/nginx/ssl

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
