#!/bin/bash

# SSL证书申请脚本 - 使用Let's Encrypt

echo "🔒 申请SSL证书..."

# 安装Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d api.tea-sea-shrimp-king.com --non-interactive --agree-tos --email admin@tea-sea-shrimp-king.com

# 设置自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

echo "✅ SSL证书申请完成！"
echo "证书路径：/etc/nginx/ssl"
