const axios = require('axios');

// 本地AI模型配置
const LOCAL_AI_CONFIG = {
  // Ollama 本地模型服务配置
  // 支持D盘安装的Ollama，需要设置OLLAMA_BASE_URL环境变量
  // 例如: OLLAMA_BASE_URL=http://localhost:11434
  ollama: {
    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    defaultModel: process.env.OLLAMA_DEFAULT_MODEL || 'llama2',
    timeout: 30000,
    // Ollama安装在D盘的路径配置
    installPath: process.env.OLLAMA_INSTALL_PATH || 'D:\\Ollama',
  },
  // LM Studio 本地模型服务配置
  lmstudio: {
    baseURL: process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1',
    defaultModel: process.env.LMSTUDIO_DEFAULT_MODEL || 'local-model',
    timeout: 30000,
  },
  // 本地模型服务器通用配置
  localServer: {
    baseURL: process.env.LOCAL_AI_BASE_URL || 'http://localhost:8000',
    timeout: 30000,
  }
};

const LocalAIModel = {
  // 测试Ollama连接
  testOllamaConnection: async () => {
    try {
      const response = await axios.get(`${LOCAL_AI_CONFIG.ollama.baseURL}/api/tags`, {
        timeout: LOCAL_AI_CONFIG.ollama.timeout
      });
      return {
        success: true,
        status: 'connected',
        models: response.data.models || [],
        message: 'Ollama服务连接成功'
      };
    } catch (error) {
      return {
        success: false,
        status: 'disconnected',
        error: error.message,
        message: 'Ollama服务连接失败，请确保Ollama已安装并运行'
      };
    }
  },

  // 使用Ollama生成文本
  generateWithOllama: async (prompt, model = null, options = {}) => {
    try {
      const modelName = model || LOCAL_AI_CONFIG.ollama.defaultModel;
      const response = await axios.post(`${LOCAL_AI_CONFIG.ollama.baseURL}/api/generate`, {
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048,
          ...options
        }
      }, {
        timeout: LOCAL_AI_CONFIG.ollama.timeout
      });

      return {
        success: true,
        model: modelName,
        response: response.data.response,
        total_duration: response.data.total_duration,
        load_duration: response.data.load_duration,
        prompt_eval_count: response.data.prompt_eval_count,
        eval_count: response.data.eval_count
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Ollama生成失败'
      };
    }
  },

  // 测试LM Studio连接
  testLMStudioConnection: async () => {
    try {
      const response = await axios.get(`${LOCAL_AI_CONFIG.lmstudio.baseURL}/models`, {
        timeout: LOCAL_AI_CONFIG.lmstudio.timeout
      });
      return {
        success: true,
        status: 'connected',
        models: response.data.data || [],
        message: 'LM Studio服务连接成功'
      };
    } catch (error) {
      return {
        success: false,
        status: 'disconnected',
        error: error.message,
        message: 'LM Studio服务连接失败，请确保LM Studio已安装并运行'
      };
    }
  },

  // 使用LM Studio生成文本
  generateWithLMStudio: async (prompt, model = null, options = {}) => {
    try {
      const response = await axios.post(`${LOCAL_AI_CONFIG.lmstudio.baseURL}/chat/completions`, {
        model: model || LOCAL_AI_CONFIG.lmstudio.defaultModel,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        stream: false,
        ...options
      }, {
        timeout: LOCAL_AI_CONFIG.lmstudio.timeout
      });

      return {
        success: true,
        model: response.data.model,
        response: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'LM Studio生成失败'
      };
    }
  },

  // 通用本地模型测试
  testLocalModel: async (provider = 'ollama') => {
    const testPrompt = '你好，请用一句话介绍自己。';
    
    try {
      if (provider === 'ollama') {
        const connectionTest = await LocalAIModel.testOllamaConnection();
        if (!connectionTest.success) {
          return connectionTest;
        }
        
        const generationTest = await LocalAIModel.generateWithOllama(testPrompt);
        return {
          success: generationTest.success,
          provider: 'ollama',
          connection: connectionTest,
          generation: generationTest,
          message: generationTest.success ? 'Ollama本地模型测试成功' : 'Ollama本地模型测试失败'
        };
      } else if (provider === 'lmstudio') {
        const connectionTest = await LocalAIModel.testLMStudioConnection();
        if (!connectionTest.success) {
          return connectionTest;
        }
        
        const generationTest = await LocalAIModel.generateWithLMStudio(testPrompt);
        return {
          success: generationTest.success,
          provider: 'lmstudio',
          connection: connectionTest,
          generation: generationTest,
          message: generationTest.success ? 'LM Studio本地模型测试成功' : 'LM Studio本地模型测试失败'
        };
      } else {
        return {
          success: false,
          message: '不支持的本地模型提供商'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '本地模型测试失败'
      };
    }
  },

  // 获取本地模型配置信息
  getConfig: () => {
    return {
      success: true,
      config: LOCAL_AI_CONFIG,
      providers: ['ollama', 'lmstudio'],
      setup: {
        ollama: {
          install: 'https://ollama.com/download',
          models: '运行: ollama pull llama2',
          run: '运行: ollama serve'
        },
        lmstudio: {
          install: 'https://lmstudio.ai/',
          setup: '下载并安装LM Studio，加载模型后启动服务器',
          run: '在LM Studio中启动本地服务器'
        }
      }
    };
  },

  // 金融分析专用 - 使用本地模型
  analyzeWithLocalModel: async (type, data, provider = 'ollama') => {
    const prompts = {
      marketTrend: `分析以下市场数据，提供趋势分析：\n${JSON.stringify(data, null, 2)}`,
      riskAssessment: `评估以下投资组合的风险：\n${JSON.stringify(data, null, 2)}`,
      portfolioOptimization: `优化以下投资组合：\n${JSON.stringify(data, null, 2)}`,
      financialAnalysis: `分析以下财务数据：\n${JSON.stringify(data, null, 2)}`,
      newsSentiment: `分析以下新闻的情绪：\n${JSON.stringify(data, null, 2)}`
    };

    const prompt = prompts[type] || '请分析提供的数据。';

    try {
      if (provider === 'ollama') {
        return await LocalAIModel.generateWithOllama(prompt);
      } else if (provider === 'lmstudio') {
        return await LocalAIModel.generateWithLMStudio(prompt);
      } else {
        return {
          success: false,
          message: '不支持的本地模型提供商'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '本地模型分析失败'
      };
    }
  }
};

module.exports = LocalAIModel;