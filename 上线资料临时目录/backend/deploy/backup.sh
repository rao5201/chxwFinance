#!/bin/bash

# 备份脚本

BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份MongoDB
echo "📦 备份MongoDB..."
mongodump --uri="mongodb://app_user:YOUR_APP_PASSWORD@localhost:27017/tea_sea_shrimp_king?authSource=tea_sea_shrimp_king" --out=$BACKUP_DIR/mongodb_$DATE

# 备份Redis
echo "📦 备份Redis..."
redis-cli -a YOUR_REDIS_PASSWORD BGSAVE
cp /data/redis/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

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
