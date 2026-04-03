@echo off

:: 茶海虾王@金融交易所看板平台 - 部署脚本

echo =========================================
echo 茶海虾王@金融交易所看板平台部署脚本
echo =========================================

:: 检查环境
echo 1. 检查环境...
if not exist "package.json" (
    echo 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

:: 安装依赖
echo 2. 安装依赖...
npm install --production
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

:: 配置环境变量
echo 3. 配置环境变量...
if not exist ".env" (
    if exist ".env.production" (
        copy .env.production .env
        echo 已从 .env.production 复制环境变量
    ) else (
        echo 警告: 未找到 .env 或 .env.production 文件
    )
)

:: 创建日志目录
echo 4. 创建日志目录...
mkdir logs 2>nul

:: 启动服务
echo 5. 启动服务...
echo 启动服务中...
echo 服务地址: http://localhost:8080
echo API地址: http://localhost:8080/api
echo 健康检查: http://localhost:8080/health
echo =========================================
echo 按任意键启动服务...
pause >nul
node server.js
