
# 生产环境部署说明

## 部署步骤

1. **准备服务器**
   - Ubuntu 20.04 LTS 或更高版本
   - 至少 2GB RAM
   - 20GB 可用磁盘空间

2. **运行部署脚本**
   ```bash
   sudo bash deploy.sh
   ```

3. **配置SSL证书**
   ```bash
   sudo bash setup-ssl.sh
   ```

4. **部署应用代码**
   - 将应用代码上传到 /var/www/tea-sea-shrimp-king
   - 安装依赖：npm install
   - 启动应用：pm2 start ecosystem.config.json

5. **设置定时备份**
   ```bash
   crontab -e
   # 添加：0 2 * * * /bin/bash /var/www/tea-sea-shrimp-king/backend/deploy/backup.sh
   ```

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
