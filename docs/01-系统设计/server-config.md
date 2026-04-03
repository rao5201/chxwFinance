# 服务器安全配置指南

## 一、Nginx 配置

### 1.1 基本配置

```nginx
server {
    listen 80;
    server_name chahaixiawang.com www.chahaixiawang.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chahaixiawang.com www.chahaixiawang.com;
    
    # SSL 配置
    ssl_certificate /etc/nginx/ssl/chahaixiawang.com.crt;
    ssl_certificate_key /etc/nginx/ssl/chahaixiawang.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' https://cdn.tailwindcss.com https://fonts.googleapis.com; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'" always;
    
    # 根目录
    root /var/www/chahaixiawang.com;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    # PWA 相关
    location ~* (manifest|service-worker)\.js$ {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # 错误页面
    error_page 404 /index.html;
    
    # 访问日志
    access_log /var/log/nginx/chahaixiawang.com.access.log;
    error_log /var/log/nginx/chahaixiawang.com.error.log;
}
```

### 1.2 安全优化

- **禁用服务器版本信息**：在 nginx.conf 中添加 `server_tokens off;`
- **限制请求体大小**：在 http 块中添加 `client_max_body_size 10M;`
- **限制连接数**：使用 limit_req 模块限制请求频率
- **防DDoS攻击**：配置 rate limiting 和 connection limiting

## 二、Node.js 服务器配置

### 2.1 Express.js 安全中间件

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(xss());
app.use(hpp());

// 速率限制
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: '请求过于频繁，请稍后再试'
});
app.use('/api', limiter);

// 静态文件
app.use(express.static('public'));

// 路由
app.use('/api', require('./routes/api'));

// 404 处理
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: '请求的资源不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
```

### 2.2 环境变量配置

**创建 .env 文件**：

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/memory-exchange
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://chahaixiawang.com
```

## 三、SSL 证书配置

### 3.1 使用 Let's Encrypt

1. **安装 Certbot**：
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **获取证书**：
   ```bash
   sudo certbot --nginx -d chahaixiawang.com -d www.chahaixiawang.com
   ```

3. **自动续期**：
   ```bash
   sudo crontab -e
   # 添加以下行
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

### 3.2 证书配置

- 确保证书文件权限正确：`chmod 600 /etc/nginx/ssl/*`
- 定期检查证书过期时间
- 配置证书链完整性

## 四、服务器安全加固

### 4.1 系统安全

- **更新系统**：定期运行 `apt update && apt upgrade`
- **防火墙配置**：使用 ufw 或 iptables 限制端口访问
- **禁用不必要的服务**：关闭不需要的服务和端口
- **SSH 安全**：
  - 禁用密码登录，使用密钥认证
  - 更改默认 SSH 端口
  - 限制 SSH 登录尝试次数

### 4.2 应用安全

- **依赖项管理**：定期更新依赖项，使用 `npm audit` 检查安全漏洞
- **代码审计**：定期进行代码审查，检查安全漏洞
- **日志监控**：配置集中式日志管理，监控异常行为
- **备份策略**：定期备份代码和数据

## 五、监控与告警

### 5.1 监控工具

- **Prometheus + Grafana**：监控服务器和应用性能
- **ELK Stack**：日志收集和分析
- **Uptime Robot**：网站可用性监控
- **New Relic**：应用性能监控

### 5.2 告警配置

- **邮件告警**：配置重要事件的邮件通知
- **短信告警**：配置紧急事件的短信通知
- **Slack/钉钉**：配置团队协作工具的告警通知

## 六、安全审计

### 6.1 定期安全扫描

- **OWASP ZAP**：定期进行安全扫描
- **Nessus**：漏洞扫描
- **Snyk**：依赖项安全检查
- **Dependabot**：自动检查依赖项安全

### 6.2 渗透测试

- 定期进行渗透测试，识别安全漏洞
- 聘请专业安全团队进行安全评估
- 根据测试结果进行安全加固

## 七、应急响应

### 7.1 应急响应计划

- **事件响应团队**：指定应急响应团队成员
- **响应流程**：建立安全事件响应流程
- **沟通计划**：制定安全事件沟通计划
- **恢复计划**：制定系统恢复计划

### 7.2 演练

- 定期进行安全事件应急演练
- 测试恢复流程的有效性
- 持续改进应急响应计划

## 八、总结

通过以上服务器安全配置，可以显著提高茶海虾王@金融交易所看板平台的安全性。建议定期更新安全配置，适应新的安全威胁，确保平台的安全稳定运行。

---

**茶海虾王@金融交易所看板平台**

© 2026 海南茶海虾王管理有限责任公司 保留所有权利。

技术支持服务联系：rao5201@126.com