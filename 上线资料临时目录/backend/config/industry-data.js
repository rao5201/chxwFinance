// 产业大数据服务配置文件
const axios = require('axios');

// 产业大数据服务配置
const industryData = {
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
  
  // 获取产业链数据
  getIndustryChain: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockIndustryChain();
    } catch (error) {
      console.error('获取产业链数据失败:', error);
      return this.getMockIndustryChain();
    }
  },
  
  // 获取园区数据
  getParkData: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockParkData();
    } catch (error) {
      console.error('获取园区数据失败:', error);
      return this.getMockParkData();
    }
  },
  
  // 获取专利数据
  getPatentData: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockPatentData();
    } catch (error) {
      console.error('获取专利数据失败:', error);
      return this.getMockPatentData();
    }
  },
  
  // 获取企业标签数据
  getEnterpriseTagData: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockEnterpriseTagData();
    } catch (error) {
      console.error('获取企业标签数据失败:', error);
      return this.getMockEnterpriseTagData();
    }
  },
  
  // 获取场景模型
  getScenarioModel: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockScenarioModel();
    } catch (error) {
      console.error('获取场景模型失败:', error);
      return this.getMockScenarioModel();
    }
  },
  
  // 获取产业智库
  getIndustryThinkTank: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockIndustryThinkTank();
    } catch (error) {
      console.error('获取产业智库失败:', error);
      return this.getMockIndustryThinkTank();
    }
  },
  
  // 获取产业研究服务
  getIndustryResearchService: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockIndustryResearchService();
    } catch (error) {
      console.error('获取产业研究服务失败:', error);
      return this.getMockIndustryResearchService();
    }
  },
  
  // 获取产业咨询服务
  getIndustryConsultingService: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockIndustryConsultingService();
    } catch (error) {
      console.error('获取产业咨询服务失败:', error);
      return this.getMockIndustryConsultingService();
    }
  },
  
  // 获取产业数据分析服务
  getIndustryDataAnalysisService: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockIndustryDataAnalysisService();
    } catch (error) {
      console.error('获取产业数据分析服务失败:', error);
      return this.getMockIndustryDataAnalysisService();
    }
  },
  
  // 获取标准产业报告服务
  getStandardIndustryReportService: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockStandardIndustryReportService();
    } catch (error) {
      console.error('获取标准产业报告服务失败:', error);
      return this.getMockStandardIndustryReportService();
    }
  },
  
  // 获取产业生态构建服务
  getIndustryEcosystemService: async function() {
    try {
      // 实际项目中需要根据产业大数据服务的API接口进行调整
      return this.getMockIndustryEcosystemService();
    } catch (error) {
      console.error('获取产业生态构建服务失败:', error);
      return this.getMockIndustryEcosystemService();
    }
  },
  
  // 模拟产业链数据
  getMockIndustryChain: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        industryChains: [
          {
            id: '1',
            name: '新能源汽车产业链',
            description: '新能源汽车产业链包括上游原材料、中游零部件、下游整车制造和充电基础设施等环节。',
            length: 1500,
            enterprises: 5000,
            value: 50000,
            url: 'https://industry-data.com/chain/1'
          },
          {
            id: '2',
            name: '人工智能产业链',
            description: '人工智能产业链包括基础层、技术层和应用层三个主要环节。',
            length: 1200,
            enterprises: 4000,
            value: 40000,
            url: 'https://industry-data.com/chain/2'
          },
          {
            id: '3',
            name: '半导体产业链',
            description: '半导体产业链包括设计、制造、封装测试等环节。',
            length: 1000,
            enterprises: 3000,
            value: 30000,
            url: 'https://industry-data.com/chain/3'
          }
        ]
      }
    };
  },
  
  // 模拟园区数据
  getMockParkData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        parks: [
          {
            id: '1',
            name: '中关村科技园区',
            location: '北京市',
            area: 280,
            enterprises: 20000,
            revenue: 5000,
            url: 'https://industry-data.com/park/1'
          },
          {
            id: '2',
            name: '上海张江高科技园区',
            location: '上海市',
            area: 250,
            enterprises: 18000,
            revenue: 4500,
            url: 'https://industry-data.com/park/2'
          },
          {
            id: '3',
            name: '深圳高新技术产业园区',
            location: '深圳市',
            area: 200,
            enterprises: 15000,
            revenue: 4000,
            url: 'https://industry-data.com/park/3'
          }
        ]
      }
    };
  },
  
  // 模拟专利数据
  getMockPatentData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        patents: [
          {
            id: '1',
            name: '一种新能源汽车电池管理系统',
            applicant: '某汽车公司',
            applicationDate: '2025-01-15',
            publicationDate: '2025-07-15',
            patentType: '发明专利',
            status: '已授权',
            url: 'https://industry-data.com/patent/1'
          },
          {
            id: '2',
            name: '一种人工智能图像识别方法',
            applicant: '某科技公司',
            applicationDate: '2025-02-10',
            publicationDate: '2025-08-10',
            patentType: '发明专利',
            status: '已授权',
            url: 'https://industry-data.com/patent/2'
          },
          {
            id: '3',
            name: '一种半导体芯片制造工艺',
            applicant: '某半导体公司',
            applicationDate: '2025-03-05',
            publicationDate: '2025-09-05',
            patentType: '发明专利',
            status: '审查中',
            url: 'https://industry-data.com/patent/3'
          }
        ]
      }
    };
  },
  
  // 模拟企业标签数据
  getMockEnterpriseTagData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        enterprises: [
          {
            id: '1',
            name: '某汽车公司',
            tags: ['新能源', '汽车制造', '科技创新', '行业龙头', 'A股上市公司'],
            industry: '汽车制造',
            scale: '大型',
            url: 'https://industry-data.com/enterprise/1'
          },
          {
            id: '2',
            name: '某科技公司',
            tags: ['人工智能', '软件开发', '科技创新', '独角兽', '美股上市公司'],
            industry: '信息技术',
            scale: '大型',
            url: 'https://industry-data.com/enterprise/2'
          },
          {
            id: '3',
            name: '某半导体公司',
            tags: ['半导体', '芯片设计', '科技创新', '行业龙头', 'A股上市公司'],
            industry: '半导体',
            scale: '中型',
            url: 'https://industry-data.com/enterprise/3'
          }
        ]
      }
    };
  },
  
  // 模拟场景模型
  getMockScenarioModel: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        models: [
          {
            id: '1',
            name: '产业园区规划模型',
            description: '用于产业园区的规划和布局，包括产业定位、空间布局、配套设施等。',
            application: '园区规划',
            accuracy: 95,
            url: 'https://industry-data.com/model/1'
          },
          {
            id: '2',
            name: '企业风险评估模型',
            description: '用于评估企业的经营风险、财务风险和市场风险等。',
            application: '风险评估',
            accuracy: 92,
            url: 'https://industry-data.com/model/2'
          },
          {
            id: '3',
            name: '产业发展预测模型',
            description: '用于预测产业的发展趋势和市场规模等。',
            application: '产业预测',
            accuracy: 88,
            url: 'https://industry-data.com/model/3'
          }
        ]
      }
    };
  },
  
  // 模拟产业智库
  getMockIndustryThinkTank: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        thinkTanks: [
          {
            id: '1',
            name: '中国产业研究院',
            description: '专注于产业政策研究和产业发展规划的智库机构。',
            experts: 100,
            reports: 500,
            url: 'https://industry-data.com/thinktank/1'
          },
          {
            id: '2',
            name: '全球产业研究中心',
            description: '专注于全球产业发展趋势研究的智库机构。',
            experts: 80,
            reports: 400,
            url: 'https://industry-data.com/thinktank/2'
          },
          {
            id: '3',
            name: '新兴产业研究所',
            description: '专注于新兴产业研究的智库机构。',
            experts: 60,
            reports: 300,
            url: 'https://industry-data.com/thinktank/3'
          }
        ]
      }
    };
  },
  
  // 模拟产业研究服务
  getMockIndustryResearchService: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '产业发展规划研究',
            description: '为政府和企业提供产业发展规划研究服务，包括产业定位、发展目标、实施路径等。',
            price: 500000,
            deliveryTime: '3个月',
            url: 'https://industry-data.com/service/research/1'
          },
          {
            id: '2',
            name: '产业竞争力分析',
            description: '分析产业的竞争力水平，包括市场份额、技术创新能力、成本优势等。',
            price: 300000,
            deliveryTime: '2个月',
            url: 'https://industry-data.com/service/research/2'
          },
          {
            id: '3',
            name: '产业投资机会研究',
            description: '研究产业的投资机会，包括细分领域、投资热点、风险分析等。',
            price: 400000,
            deliveryTime: '2.5个月',
            url: 'https://industry-data.com/service/research/3'
          }
        ]
      }
    };
  },
  
  // 模拟产业咨询服务
  getMockIndustryConsultingService: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '企业战略咨询',
            description: '为企业提供战略规划、商业模式设计、市场定位等咨询服务。',
            price: 600000,
            deliveryTime: '3个月',
            url: 'https://industry-data.com/service/consulting/1'
          },
          {
            id: '2',
            name: '产业政策咨询',
            description: '为企业提供产业政策解读、政策申请指导等咨询服务。',
            price: 200000,
            deliveryTime: '1个月',
            url: 'https://industry-data.com/service/consulting/2'
          },
          {
            id: '3',
            name: '市场进入策略咨询',
            description: '为企业提供市场进入策略、竞争分析、渠道建设等咨询服务。',
            price: 350000,
            deliveryTime: '2个月',
            url: 'https://industry-data.com/service/consulting/3'
          }
        ]
      }
    };
  },
  
  // 模拟产业数据分析服务
  getMockIndustryDataAnalysisService: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '产业大数据分析',
            description: '利用大数据技术分析产业的发展趋势、市场规模、竞争格局等。',
            price: 450000,
            deliveryTime: '2.5个月',
            url: 'https://industry-data.com/service/analysis/1'
          },
          {
            id: '2',
            name: '企业数据分析',
            description: '分析企业的经营数据、财务数据、市场数据等，为企业决策提供支持。',
            price: 300000,
            deliveryTime: '2个月',
            url: 'https://industry-data.com/service/analysis/2'
          },
          {
            id: '3',
            name: '市场数据分析',
            description: '分析市场的需求、供给、价格等数据，为企业的市场策略提供支持。',
            price: 250000,
            deliveryTime: '1.5个月',
            url: 'https://industry-data.com/service/analysis/3'
          }
        ]
      }
    };
  },
  
  // 模拟标准产业报告服务
  getMockStandardIndustryReportService: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        reports: [
          {
            id: '1',
            name: '2026年中国新能源汽车产业发展报告',
            description: '全面分析中国新能源汽车产业的发展现状、趋势和机遇。',
            price: 150000,
            releaseDate: '2026-04-01',
            url: 'https://industry-data.com/report/1'
          },
          {
            id: '2',
            name: '2026年中国人工智能产业发展报告',
            description: '全面分析中国人工智能产业的发展现状、趋势和机遇。',
            price: 180000,
            releaseDate: '2026-04-15',
            url: 'https://industry-data.com/report/2'
          },
          {
            id: '3',
            name: '2026年中国半导体产业发展报告',
            description: '全面分析中国半导体产业的发展现状、趋势和机遇。',
            price: 200000,
            releaseDate: '2026-04-30',
            url: 'https://industry-data.com/report/3'
          }
        ]
      }
    };
  },
  
  // 模拟产业生态构建服务
  getMockIndustryEcosystemService: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        services: [
          {
            id: '1',
            name: '产业生态规划',
            description: '为政府和企业提供产业生态规划服务，包括生态定位、主体培育、环境营造等。',
            price: 600000,
            deliveryTime: '3个月',
            url: 'https://industry-data.com/service/ecosystem/1'
          },
          {
            id: '2',
            name: '产业集群建设',
            description: '为政府和企业提供产业集群建设服务，包括集群规划、企业引进、配套服务等。',
            price: 500000,
            deliveryTime: '2.5个月',
            url: 'https://industry-data.com/service/ecosystem/2'
          },
          {
            id: '3',
            name: '产业创新平台建设',
            description: '为政府和企业提供产业创新平台建设服务，包括平台定位、资源整合、运营管理等。',
            price: 400000,
            deliveryTime: '2个月',
            url: 'https://industry-data.com/service/ecosystem/3'
          }
        ]
      }
    };
  }
};

module.exports = industryData;