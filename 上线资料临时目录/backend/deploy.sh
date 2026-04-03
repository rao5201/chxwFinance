#!/bin/bash

# 茶海虾王@金融交易所看板平台 - 部署脚本

echo "========================================="
echo "茶海虾王@金融交易所看板平台部署脚本"
echo "========================================="

# 检查环境
echo "1. 检查环境..."
if [ ! -f "package.json" ]; then
    echo "错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 安装依赖
echo "2. 安装依赖..."
npm install --production
if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

# 配置环境变量
echo "3. 配置环境变量..."
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env
        echo "已从 .env.production 复制环境变量"
    else
        echo "警告: 未找到 .env 或 .env.production 文件"
    fi
fi

# 创建日志目录
echo "4. 创建日志目录..."
mkdir -p logs

# 启动服务
echo "5. 启动服务..."
if command -v pm2 &> /dev/null; then
    echo "使用 PM2 启动服务..."
    pm2 start server.js --name tea-sea-shrimp-king
    pm2 save
    pm2 status
else
    echo "PM2 未安装，使用 node 直接启动..."
    node server.js
fi

echo "========================================="
echo "部署完成!"
echo "========================================="
echo "服务地址: http://localhost:8080"
echo "API地址: http://localhost:8080/api"
echo "健康检查: http://localhost:8080/health"
echo "========================================="
