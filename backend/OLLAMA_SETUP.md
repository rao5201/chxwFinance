# Ollama本地模型配置指南

## 概述

本系统支持接入Ollama本地AI模型，用于金融数据分析和文本生成。Ollama可以安装在D盘或其他位置。

## 安装Ollama

### 1. 下载安装

访问 [Ollama官网](https://ollama.com/download) 下载Windows版本安装程序。

### 2. 安装到D盘

在安装过程中选择D盘作为安装位置，例如：
```
D:\Ollama
```

### 3. 验证安装

安装完成后，检查Ollama是否正确安装：

```powershell
# 检查Ollama版本
ollama --version

# 查看已安装模型
ollama list
```

## 配置环境变量

### 方法一：使用系统环境变量（推荐）

1. 右键"此电脑" → 属性 → 高级系统设置 → 环境变量
2. 在"系统变量"中添加以下变量：

```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_INSTALL_PATH=D:\Ollama
OLLAMA_DEFAULT_MODEL=llama2
```

3. 重启命令行或PowerShell使环境变量生效

### 方法二：使用.env文件

在 `backend` 目录下创建或编辑 `.env` 文件：

```env
# Ollama配置
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_INSTALL_PATH=D:\Ollama
OLLAMA_DEFAULT_MODEL=llama2
```

## 启动Ollama服务

### 方法1：使用Ollama应用程序

双击桌面上的Ollama图标启动服务。

### 方法2：使用命令行

```powershell
# 启动Ollama服务
ollama serve

# 或者在后台运行
Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
```

### 方法3：使用测试脚本自动启动

运行测试脚本，它会自动检测并尝试启动Ollama服务：

```bash
node scripts/test-ollama.js
```

## 下载模型

在使用之前，需要下载AI模型：

```powershell
# 下载Llama2模型（推荐）
ollama pull llama2

# 下载其他模型
ollama pull mistral
ollama pull codellama
ollama pull llama2-chinese
```

## 测试Ollama连接

### 使用测试脚本

```bash
# 进入backend目录
cd backend

# 运行测试脚本
node scripts/test-ollama.js
```

测试脚本会：
1. 检查Ollama是否安装在D盘
2. 检查Ollama服务是否运行
3. 尝试自动启动服务（如果未运行）
4. 测试文本生成功能

### 使用API测试

启动服务器后，可以通过API测试Ollama：

```bash
# 获取配置信息
GET http://localhost:3021/api/finance/local-ai/config

# 测试Ollama连接
GET http://localhost:3021/api/finance/local-ai/test/ollama

# 生成文本
POST http://localhost:3021/api/finance/local-ai/generate/ollama
Content-Type: application/json

{
  "prompt": "分析中国股市当前趋势",
  "model": "llama2",
  "options": {
    "temperature": 0.7,
    "maxTokens": 2048
  }
}
```

## API端点

### 1. 获取配置
```
GET /api/finance/local-ai/config
```
返回本地AI模型的配置信息。

### 2. 测试连接
```
GET /api/finance/local-ai/test/ollama
```
测试Ollama服务连接状态。

### 3. 生成文本
```
POST /api/finance/local-ai/generate/ollama
```
使用Ollama生成文本。

**请求参数：**
- `prompt` (string, 必填): 输入提示词
- `model` (string, 可选): 模型名称，默认使用 llama2
- `options` (object, 可选): 生成选项
  - `temperature` (number): 温度参数，默认 0.7
  - `maxTokens` (number): 最大生成token数，默认 2048

### 4. 金融分析
```
POST /api/finance/local-ai/analyze/ollama
```
使用Ollama进行金融数据分析。

**请求参数：**
- `type` (string, 必填): 分析类型
  - `marketTrend`: 市场趋势分析
  - `riskAssessment`: 风险评估
  - `portfolioOptimization`: 投资组合优化
  - `financialAnalysis`: 财务分析
  - `newsSentiment`: 新闻情绪分析
- `data` (object, 必填): 分析数据

**示例请求：**
```json
{
  "type": "marketTrend",
  "data": {
    "symbol": "AAPL",
    "price": 150.00,
    "change": 2.5,
    "volume": 1000000
  }
}
```

## 常见问题

### 1. Ollama服务无法启动

**问题：** 运行 `ollama serve` 时提示端口被占用。

**解决：** 
```powershell
# 查找占用11434端口的进程
netstat -ano | findstr :11434

# 结束占用端口的进程（将<PID>替换为实际的进程ID）
taskkill /PID <PID> /F

# 重新启动Ollama
ollama serve
```

### 2. 模型下载失败

**问题：** 运行 `ollama pull llama2` 时下载失败。

**解决：**
- 检查网络连接
- 尝试使用代理
- 手动下载模型文件并放置到Ollama模型目录

### 3. API返回404错误

**问题：** 调用API时返回404错误。

**解决：**
- 确保Ollama服务已启动
- 检查OLLAMA_BASE_URL配置是否正确
- 确认模型已正确下载

### 4. 生成文本速度慢

**问题：** 文本生成速度很慢。

**解决：**
- 使用更小的模型（如 llama2:7b 代替 llama2:13b）
- 减少maxTokens参数
- 确保电脑有足够的内存和CPU资源

## 支持的模型

| 模型 | 描述 | 大小 |
|------|------|------|
| llama2 | Meta的Llama 2模型 | 3.8GB |
| llama2:13b | Llama 2 13B版本 | 7.3GB |
| mistral | Mistral AI模型 | 4.1GB |
| codellama | 代码生成专用模型 | 3.8GB |
| llama2-chinese | 中文优化版本 | 3.8GB |

## 性能优化建议

1. **使用SSD**：将Ollama安装在SSD上可以提高模型加载速度
2. **足够的内存**：建议至少16GB内存，大型模型需要更多
3. **GPU加速**：如果有NVIDIA显卡，可以配置CUDA加速
4. **模型选择**：根据需求选择合适的模型大小

## 安全注意事项

1. **本地运行**：Ollama默认只在本地运行，不对外暴露服务
2. **防火墙配置**：确保防火墙允许Ollama端口（11434）的本地访问
3. **模型安全**：下载的模型来自官方源，确保安全性

## 技术支持

如遇到问题，请检查：
1. Ollama官方文档：https://ollama.com/
2. 系统日志查看运行状态
3. 使用测试脚本诊断问题

## 更新日志

- **2026-04-03**: 初始版本，支持D盘安装和基础API功能
