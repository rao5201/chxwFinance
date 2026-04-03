const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Ollama配置
const OLLAMA_CONFIG = {
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  timeout: 30000,
  // 可能的Ollama安装路径
  possiblePaths: [
    'D:\\Ollama',
    'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Programs\\Ollama',
    'C:\\Program Files\\Ollama',
    'C:\\Program Files (x86)\\Ollama'
  ]
};

// 检查Ollama是否安装
async function checkOllamaInstallation() {
  console.log('🔍 检查Ollama安装...\n');
  
  let foundPath = null;
  
  // 检查各个可能的路径
  for (const installPath of OLLAMA_CONFIG.possiblePaths) {
    if (fs.existsSync(installPath)) {
      console.log(`✅ 找到Ollama安装目录: ${installPath}`);
      foundPath = installPath;
      
      // 检查ollama.exe是否存在
      const exePath = path.join(installPath, 'ollama.exe');
      if (fs.existsSync(exePath)) {
        console.log(`✅ 找到Ollama可执行文件: ${exePath}`);
      }
      
      // 列出目录内容
      try {
        const files = fs.readdirSync(installPath);
        console.log(`📁 目录内容: ${files.slice(0, 10).join(', ')}${files.length > 10 ? '...' : ''}`);
      } catch (error) {
        console.log(`⚠️ 无法读取目录: ${error.message}`);
      }
      
      break;
    }
  }
  
  if (!foundPath) {
    console.log('❌ 未找到Ollama安装目录');
    console.log('💡 请确保Ollama已正确安装，或设置OLLAMA_INSTALL_PATH环境变量');
    return false;
  }
  
  return true;
}

// 检查Ollama服务是否运行
async function checkOllamaService() {
  console.log('\n🔍 检查Ollama服务状态...\n');
  
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
      timeout: OLLAMA_CONFIG.timeout
    });
    
    console.log('✅ Ollama服务正在运行');
    console.log(`📊 已安装模型数量: ${response.data.models?.length || 0}`);
    
    if (response.data.models && response.data.models.length > 0) {
      console.log('\n📋 已安装模型列表:');
      response.data.models.forEach((model, index) => {
        console.log(`  ${index + 1}. ${model.name} (${(model.size / 1024 / 1024 / 1024).toFixed(2)} GB)`);
      });
    }
    
    return {
      success: true,
      models: response.data.models || []
    };
  } catch (error) {
    console.log('❌ Ollama服务未运行或无法连接');
    console.log(`💡 错误信息: ${error.message}`);
    console.log('\n🚀 启动Ollama服务的方法:');
    console.log('  1. 双击运行Ollama应用程序');
    console.log('  2. 或在命令行运行: ollama serve');
    console.log('  3. 或在PowerShell运行: Start-Process ollama -ArgumentList "serve"');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 测试生成文本
async function testTextGeneration(model = 'llama2') {
  console.log(`\n🧪 测试文本生成 (模型: ${model})...\n`);
  
  const testPrompt = '你好，请用一句话介绍自己。';
  
  try {
    const response = await axios.post(`${OLLAMA_CONFIG.baseURL}/api/generate`, {
      model: model,
      prompt: testPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 100
      }
    }, {
      timeout: OLLAMA_CONFIG.timeout
    });
    
    console.log('✅ 文本生成成功');
    console.log(`📝 输入: ${testPrompt}`);
    console.log(`💬 输出: ${response.data.response}`);
    console.log(`⏱️ 总耗时: ${(response.data.total_duration / 1000000).toFixed(2)} ms`);
    console.log(`🔤 提示词评估数: ${response.data.prompt_eval_count}`);
    console.log(`🔤 生成评估数: ${response.data.eval_count}`);
    
    return {
      success: true,
      response: response.data.response
    };
  } catch (error) {
    console.log('❌ 文本生成失败');
    console.log(`💡 错误信息: ${error.message}`);
    
    if (error.response?.status === 404) {
      console.log(`\n💡 模型 ${model} 未找到，请先下载模型:`);
      console.log(`   ollama pull ${model}`);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 启动Ollama服务
async function startOllamaService() {
  console.log('\n🚀 尝试启动Ollama服务...\n');
  
  try {
    // 尝试启动Ollama服务
    const { stdout, stderr } = await execPromise('ollama serve', { timeout: 5000 });
    console.log('✅ Ollama服务启动命令已执行');
    console.log(`📤 输出: ${stdout}`);
    if (stderr) {
      console.log(`⚠️ 错误输出: ${stderr}`);
    }
    return true;
  } catch (error) {
    console.log('⚠️ 自动启动失败，请手动启动Ollama服务');
    console.log(`💡 错误: ${error.message}`);
    return false;
  }
}

// 主函数
async function main() {
  console.log('='.repeat(60));
  console.log('🦙 Ollama本地模型测试工具');
  console.log('='.repeat(60));
  console.log(`\n📍 Ollama服务地址: ${OLLAMA_CONFIG.baseURL}\n`);
  
  // 1. 检查安装
  const isInstalled = await checkOllamaInstallation();
  
  if (!isInstalled) {
    console.log('\n❌ Ollama未安装，测试终止');
    console.log('💡 请访问 https://ollama.com/download 下载安装');
    return;
  }
  
  // 2. 检查服务状态
  let serviceStatus = await checkOllamaService();
  
  // 3. 如果服务未运行，尝试启动
  if (!serviceStatus.success) {
    console.log('\n⏳ 等待5秒后尝试启动服务...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const started = await startOllamaService();
    if (started) {
      console.log('\n⏳ 等待服务启动 (10秒)...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // 重新检查服务状态
      serviceStatus = await checkOllamaService();
    }
  }
  
  // 4. 如果服务运行中，测试文本生成
  if (serviceStatus.success && serviceStatus.models.length > 0) {
    const defaultModel = serviceStatus.models[0].name;
    await testTextGeneration(defaultModel);
  } else if (serviceStatus.success) {
    console.log('\n⚠️ 没有安装任何模型');
    console.log('💡 请下载模型，例如:');
    console.log('   ollama pull llama2');
    console.log('   ollama pull mistral');
    console.log('   ollama pull codellama');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ 测试完成');
  console.log('='.repeat(60));
}

// 运行主函数
main().catch(error => {
  console.error('❌ 测试过程中发生错误:', error);
  process.exit(1);
});