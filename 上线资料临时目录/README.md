# 茶海虾王@金融交易所看板平台

## 项目概述

茶海虾王@金融交易所看板平台是一个综合性金融交易管理系统，提供资产管理、交易管理、市场数据、AI分析等功能。

## 技术架构

- **前端**：HTML5 + CSS3 + JavaScript
- **后端**：Node.js + Express + 内存数据库 + 内存Redis
- **安全**：JWT认证 + bcrypt加密 + AES-256-GCM加密
- **集成**：金融数据接口 + 支付系统 + AI分析工具

## 核心功能

1. **用户认证系统**：注册、登录、JWT令牌管理
2. **资产管理系统**：资产列表、资产详情、资产创建
3. **交易管理系统**：交易创建、交易查询、交易历史
4. **市场数据系统**：市场概览、资产价格、K线数据
5. **支付系统**：支付创建、支付状态查询、退款
6. **AI分析系统**：AI分析、分析历史、分析建议
7. **数据加密系统**：AES-256-GCM加密、敏感数据掩码
8. **网站连接测试**：金融网站、金融公司网站、上市公司网站连接测试

## 项目结构

### 1. 根目录文件
- **HTML文件**：网站前端页面
- **配置文件**：docker-compose.yml、init-mongo.js等
- **文档文件**：README.md、API文档.md、CHANGELOG.md等
- **项目报告**：项目落实情况检查报告.html、项目阶段检查报告.html等

### 2. 账号管理相关
- **account-management/**：账号数据库管理系统
- **accounts/**：客户用户账号信息
- **internal-accounts/**：内部人员账号信息
- **external-accounts/**：外部人员账号信息
- **finance-accounts/**：财务/审计人员账号信息
- **operations-accounts/**：操作人员账号信息
- **third-party-accounts/**：第三方服务账号信息

### 3. 后端系统
- **backend/**：后端API服务
  - **config/**：配置文件
  - **models/**：数据模型
  - **routes/**：API路由
  - **scripts/**：脚本文件
  - **test/**：测试文件
  - **tools/**：工具文件
  - **backups/**：备份文件
  - **logs/**：日志文件
  - **deploy/**：部署配置

### 4. 前端系统
- **frontend/**：前端代码

### 5. 数据存储
- **backups/**：备份文件
- **logs/**：日志文件

### 6. 文档系统
- **docs/**：项目文档
  - **01-系统设计/**：系统设计文档
  - **02-实现计划/**：实现计划文档
  - **03-安全合规/**：安全合规文档
  - **04-上线部署/**：上线部署文档
  - **05-维护运营/**：维护运营文档
  - **06-用户文档/**：用户文档
  - **07-客服文档/**：客服文档
  - **08-管理员文档/**：管理员文档
  - **09-第三方接入/**：第三方接入文档
  - **10-品牌规范/**：品牌规范文档

### 7. 安全相关
- **security/**：安全审计和测试
- **secrets/**：机密文件

### 8. 监控和部署
- **monitoring/**：监控配置
- **nginx/**：Nginx配置

### 9. 资源文件
- **ico/**：图标文件
- **icons/**：图标
- **网站图标/**：网站图标

### 10. 配置文件
- **.env**：环境变量
- **.env.production**：生产环境变量
- **Dockerfile**：Docker配置
- **docker-compose.yml**：Docker Compose配置
- **nginx.conf**：Nginx配置
- **prometheus.yml**：Prometheus配置
- **grafana.ini**：Grafana配置

### 11. 部署脚本
- **deploy.bat**：Windows部署脚本
- **deploy.sh**：Linux部署脚本
- **backend/deploy/**：部署相关配置

### 12. 工具和脚本
- **backend/scripts/**：后端脚本
- **backend/tools/**：后端工具
- **backups/backup-script.js**：备份脚本
- **security/security-audit.js**：安全审计脚本

## 快速开始

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 启动服务器
```bash
npm start
```

### 3. 访问地址
- **网站地址**: http://localhost:8080
- **API地址**: http://localhost:3002/api
- **健康检查**: http://localhost:3002/health
- **数据库状态**: http://localhost:3002/api/database/status

### 4. Docker部署
```bash
docker-compose up -d
```

## 测试账号

### 管理员账号
- 用户名: admin
- 密码: Admin123!
- 邮箱: admin@example.com
- 角色: admin

### 客户账号
- 用户名: client
- 密码: Client123!
- 邮箱: client@example.com
- 角色: user

### 财务审计账号
- 用户名: finance
- 密码: Finance123!
- 邮箱: finance@example.com
- 角色: finance

## API文档

后端API文档请查看：[API文档.md](API文档.md)

## 项目状态

### 已完成功能
- ✅ 后端架构搭建完成
- ✅ API开发完成
- ✅ 数据模型创建完成
- ✅ 金融数据接口集成完成
- ✅ 支付系统集成完成
- ✅ AI分析工具集成完成
- ✅ 数据加密功能实现完成
- ✅ 网站连接测试功能实现完成
- ✅ 测试账号创建完成
- ✅ 安全审计系统实现完成
- ✅ 监控系统集成完成
- ✅ 备份系统实现完成
- ✅ 账号管理系统实现完成
- ✅ MongoDB配置完成
- ✅ Docker部署配置完成
- ✅ Nginx配置完成

### 进行中功能
- 🔄 前端开发进行中
- 🔄 生产环境部署进行中

## 开发团队

海南茶海虾王管理有限责任公司

技术支持：rao5201@126.com

## 版权信息

© 2026 海南茶海虾王管理有限责任公司 保留所有权利
