// 产品服务配置文件
const axios = require('axios');

// 产品服务配置
const productServices = {
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
  
  // 获取金融版产品
  getFinancialVersion: async function() {
    try {
      // 实际项目中需要根据产品服务的API接口进行调整
      return this.getMockFinancialVersion();
    } catch (error) {
      console.error('获取金融版产品失败:', error);
      return this.getMockFinancialVersion();
    }
  },
  
  // 获取政府版产品
  getGovernmentVersion: async function() {
    try {
      // 实际项目中需要根据产品服务的API接口进行调整
      return this.getMockGovernmentVersion();
    } catch (error) {
      console.error('获取政府版产品失败:', error);
      return this.getMockGovernmentVersion();
    }
  },
  
  // 获取企业版产品
  getEnterpriseVersion: async function() {
    try {
      // 实际项目中需要根据产品服务的API接口进行调整
      return this.getMockEnterpriseVersion();
    } catch (error) {
      console.error('获取企业版产品失败:', error);
      return this.getMockEnterpriseVersion();
    }
  },
  
  // 获取旗舰版产品
  getFlagshipVersion: async function() {
    try {
      // 实际项目中需要根据产品服务的API接口进行调整
      return this.getMockFlagshipVersion();
    } catch (error) {
      console.error('获取旗舰版产品失败:', error);
      return this.getMockFlagshipVersion();
    }
  },
  
  // 获取所有产品服务
  getAllProducts: async function() {
    try {
      const [financial, government, enterprise, flagship] = await Promise.all([
        this.getFinancialVersion(),
        this.getGovernmentVersion(),
        this.getEnterpriseVersion(),
        this.getFlagshipVersion()
      ]);
      
      return {
        success: true,
        data: {
          lastUpdated: new Date().toISOString(),
          products: [
            financial.data,
            government.data,
            enterprise.data,
            flagship.data
          ]
        }
      };
    } catch (error) {
      console.error('获取所有产品服务失败:', error);
      return this.getMockAllProducts();
    }
  },
  
  // 模拟金融版产品
  getMockFinancialVersion: function() {
    return {
      success: true,
      data: {
        id: 'financial',
        name: '金融版',
        description: '专为金融机构打造的数据分析和决策支持平台',
        features: [
          '实时市场数据监控',
          '智能风险评估',
          '投资组合分析',
          '金融产品推荐',
          '市场情绪分析',
          '合规监管报告'
        ],
        targetUsers: [
          '银行',
          '证券公司',
          '基金公司',
          '保险公司',
          '资产管理公司'
        ],
        price: {
          starting: '¥100,000/年',
          custom: true
        },
        support: {
          24: true,
          email: 'support@fin-service.com',
          phone: '400-123-4567'
        },
        url: 'https://product-service.com/financial'
      }
    };
  },
  
  // 模拟政府版产品
  getMockGovernmentVersion: function() {
    return {
      success: true,
      data: {
        id: 'government',
        name: '政府版',
        description: '为政府部门提供的产业数据分析和政策决策支持平台',
        features: [
          '产业发展监测',
          '政策效果评估',
          '区域经济分析',
          '企业运行监测',
          '风险预警系统',
          '政策模拟仿真'
        ],
        targetUsers: [
          '发改委',
          '工信部',
          '地方政府',
          '园区管委会',
          '行业主管部门'
        ],
        price: {
          starting: '¥200,000/年',
          custom: true
        },
        support: {
          24: true,
          email: 'support@gov-service.com',
          phone: '400-765-4321'
        },
        url: 'https://product-service.com/government'
      }
    };
  },
  
  // 模拟企业版产品
  getMockEnterpriseVersion: function() {
    return {
      success: true,
      data: {
        id: 'enterprise',
        name: '企业版',
        description: '为企业提供的市场分析和竞争情报平台',
        features: [
          '竞争对手分析',
          '市场趋势预测',
          '供应链分析',
          '客户行为分析',
          '产品定价策略',
          '市场机会识别'
        ],
        targetUsers: [
          '大型企业',
          '中型企业',
          '创业公司',
          '企业战略部门',
          '市场调研部门'
        ],
        price: {
          starting: '¥50,000/年',
          custom: true
        },
        support: {
          24: true,
          email: 'support@enterprise-service.com',
          phone: '400-987-6543'
        },
        url: 'https://product-service.com/enterprise'
      }
    };
  },
  
  // 模拟旗舰版产品
  getMockFlagshipVersion: function() {
    return {
      success: true,
      data: {
        id: 'flagship',
        name: '旗舰版',
        description: '集成所有功能的综合数据分析平台',
        features: [
          '金融版所有功能',
          '政府版所有功能',
          '企业版所有功能',
          '定制化数据分析',
          'AI智能分析',
          '专属数据科学家支持',
          '高级可视化报表',
          'API接口集成'
        ],
        targetUsers: [
          '大型金融机构',
          '国家级政府部门',
          '跨国企业',
          '顶级研究机构',
          '行业龙头企业'
        ],
        price: {
          starting: '¥500,000/年',
          custom: true
        },
        support: {
          24: true,
          dedicatedManager: true,
          email: 'support@flagship-service.com',
          phone: '400-111-2222'
        },
        url: 'https://product-service.com/flagship'
      }
    };
  },
  
  // 模拟所有产品服务
  getMockAllProducts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          this.getMockFinancialVersion().data,
          this.getMockGovernmentVersion().data,
          this.getMockEnterpriseVersion().data,
          this.getMockFlagshipVersion().data
        ]
      }
    };
  }
};

module.exports = productServices;