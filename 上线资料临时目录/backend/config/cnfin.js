// 中国金融信息网配置文件
const axios = require('axios');

// 中国金融信息网配置
const cnfin = {
  // API基础配置
  config: {
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 通用请求函数
  request: async function(url, params) {
    try {
      const response = await axios.get(url, {
        params,
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`请求错误: ${error.message}`);
    }
  },
  
  // 带重试的请求
  requestWithRetry: async function(url, params, retry = 0) {
    try {
      return await this.request(url, params);
    } catch (error) {
      if (retry < this.config.retryCount) {
        console.log(`请求失败，重试 (${retry + 1}/${this.config.retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.requestWithRetry(url, params, retry + 1);
      }
      throw error;
    }
  },
  
  // 获取财经新闻
  getFinancialNews: async function() {
    try {
      // 实际项目中需要根据中国金融信息网的API接口进行调整
      return this.getMockFinancialNews();
    } catch (error) {
      console.error('获取财经新闻失败:', error);
      return this.getMockFinancialNews();
    }
  },
  
  // 获取经济信息
  getEconomicInformation: async function() {
    try {
      // 实际项目中需要根据中国金融信息网的API接口进行调整
      return this.getMockEconomicInformation();
    } catch (error) {
      console.error('获取经济信息失败:', error);
      return this.getMockEconomicInformation();
    }
  },
  
  // 获取金融数据
  getFinancialData: async function() {
    try {
      // 实际项目中需要根据中国金融信息网的API接口进行调整
      return this.getMockFinancialData();
    } catch (error) {
      console.error('获取金融数据失败:', error);
      return this.getMockFinancialData();
    }
  },
  
  // 获取数字经济服务
  getDigitalEconomyServices: async function() {
    try {
      // 实际项目中需要根据中国金融信息网的API接口进行调整
      return this.getMockDigitalEconomyServices();
    } catch (error) {
      console.error('获取数字经济服务失败:', error);
      return this.getMockDigitalEconomyServices();
    }
  },
  
  // 获取信息技术服务
  getInformationTechnologyServices: async function() {
    try {
      // 实际项目中需要根据中国金融信息网的API接口进行调整
      return this.getMockInformationTechnologyServices();
    } catch (error) {
      console.error('获取信息技术服务失败:', error);
      return this.getMockInformationTechnologyServices();
    }
  },
  
  // 模拟财经新闻
  getMockFinancialNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '国家网信办拟加强数字虚拟人信息服务管理',
            summary: '征求意见稿明确，数字虚拟人是指存在于非物理世界，利用图形学、数字图像处理或者人工智能等技术，借助真人驱动或者计算驱动，模拟人类外貌，具备声音、行为、交互能力或者性格等特征的虚拟数字形象。',
            publishTime: new Date().toISOString(),
            url: 'https://www.cnfin.com/news/123456'
          },
          {
            id: '2',
            title: '头部房企"做减法+换长债"增厚安全垫',
            summary: '经历2021年以来的信用收缩后，房地产行业的融资逻辑正在发生深刻变化——以高周转为基础的短期信用融资逐步退出舞台，取而代之的是与资产久期相匹配的中长期资金体系。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.cnfin.com/news/123457'
          },
          {
            id: '3',
            title: '新华财经看山东｜中国银行山东分行"四维"金融服务助推产业链跃升',
            summary: '中国银行山东省分行建立覆盖企业全周期、涵盖公司及个人全方位服务的7大类34项产品体系，为企业及员工提供便捷、优质、高效服务，实现"企业+人才"一体化服务保障。同时，以授信为抓手，提供股、租、债、投等综合服务，并借助中银集团全球优势，以专业服务陪伴链上企业成长...',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.cnfin.com/news/123458'
          },
          {
            id: '4',
            title: '【财经分析】从年报看银行业数字化转型：科技投入加大 AI布局提速',
            summary: '2025年，银行业科技投入规模稳步增长，工商银行、农业银行、中国银行、建设银行、交通银行、邮储银行等金融科技投入规模合计达1300.91亿元，而在2024年、2023年分别为1254.59亿元、1228.22亿元。与此同时，银行业持续加快对AI等关键技术的布局。',
            publishTime: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://www.cnfin.com/news/123459'
          }
        ]
      }
    };
  },
  
  // 模拟经济信息
  getMockEconomicInformation: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        information: [
          {
            id: '1',
            title: '2026年中国经济展望',
            summary: '2026年中国经济有望保持稳定增长，预计GDP增速在5.5%左右，消费、投资、出口三驾马车将共同发力。',
            publishTime: new Date().toISOString(),
            url: 'https://www.cnfin.com/economic/123456'
          },
          {
            id: '2',
            title: '全球经济形势分析',
            summary: '全球经济正在逐步复苏，美国、欧洲、日本等主要经济体增长动能增强，新兴市场国家表现活跃。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.cnfin.com/economic/123457'
          }
        ]
      }
    };
  },
  
  // 模拟金融数据
  getMockFinancialData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        data: [
          {
            id: '1',
            name: 'GDP数据',
            value: 1200000,
            unit: '亿元',
            growth: 5.5,
            period: '2025年'
          },
          {
            id: '2',
            name: 'CPI数据',
            value: 2.1,
            unit: '%',
            growth: 0.2,
            period: '2026年3月'
          },
          {
            id: '3',
            name: 'PPI数据',
            value: -0.5,
            unit: '%',
            growth: -0.1,
            period: '2026年3月'
          },
          {
            id: '4',
            name: '社会消费品零售总额',
            value: 35000,
            unit: '亿元',
            growth: 8.9,
            period: '2026年3月'
          }
        ]
      }
    };
  },
  
  // 模拟数字经济服务
  getMockDigitalEconomyServices: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '数字虚拟人服务',
            description: '提供数字虚拟人设计、开发和运营服务，助力企业数字化转型。',
            url: 'https://www.cnfin.com/digital/123456'
          },
          {
            id: '2',
            name: '数字经济指数',
            description: '发布数字经济发展指数，为政策制定和投资决策提供参考。',
            url: 'https://www.cnfin.com/digital/123457'
          },
          {
            id: '3',
            name: '数字贸易服务',
            description: '提供数字贸易相关的信息咨询、培训和技术支持服务。',
            url: 'https://www.cnfin.com/digital/123458'
          }
        ]
      }
    };
  },
  
  // 模拟信息技术服务
  getMockInformationTechnologyServices: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '金融科技解决方案',
            description: '为金融机构提供数字化转型解决方案，包括系统开发、数据管理、风险控制等。',
            url: 'https://www.cnfin.com/it/123456'
          },
          {
            id: '2',
            name: '大数据分析服务',
            description: '利用大数据技术为企业提供市场分析、客户画像、风险评估等服务。',
            url: 'https://www.cnfin.com/it/123457'
          },
          {
            id: '3',
            name: '人工智能应用',
            description: '开发和部署AI模型，为金融、零售、制造等行业提供智能解决方案。',
            url: 'https://www.cnfin.com/it/123458'
          }
        ]
      }
    };
  }
};

module.exports = cnfin;