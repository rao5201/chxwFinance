// 蛋卷基金API配置文件
const axios = require('axios');

// 蛋卷基金API配置
const danjuanFunds = {
  // API基础配置
  config: {
    baseUrl: 'https://danjuanfunds.com',
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000
  },
  
  // 通用请求函数
  request: async function(endpoint, params) {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
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
  requestWithRetry: async function(endpoint, params, retry = 0) {
    try {
      return await this.request(endpoint, params);
    } catch (error) {
      if (retry < this.config.retryCount) {
        console.log(`请求失败，重试 (${retry + 1}/${this.config.retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.requestWithRetry(endpoint, params, retry + 1);
      }
      throw error;
    }
  },
  
  // 获取指数估值数据
  getIndexValuation: async function() {
    try {
      // 蛋卷基金的指数估值数据在 /rn/value-center 页面
      // 由于直接访问可能需要处理动态渲染，这里使用模拟数据
      // 实际项目中需要使用爬虫或API获取真实数据
      return this.getMockIndexValuation();
    } catch (error) {
      console.error('获取指数估值失败:', error);
      return this.getMockIndexValuation();
    }
  },
  
  // 获取基金筛选数据
  getFundScreening: async function(params) {
    try {
      // 实际项目中需要根据蛋卷基金的API接口进行调整
      return this.getMockFundScreening(params);
    } catch (error) {
      console.error('获取基金筛选失败:', error);
      return this.getMockFundScreening(params);
    }
  },
  
  // 获取指数选基数据
  getIndexFunds: async function(params) {
    try {
      // 实际项目中需要根据蛋卷基金的API接口进行调整
      return this.getMockIndexFunds(params);
    } catch (error) {
      console.error('获取指数选基失败:', error);
      return this.getMockIndexFunds(params);
    }
  },
  
  // 获取QDII基金数据
  getQDIIFunds: async function(params) {
    try {
      // 实际项目中需要根据蛋卷基金的API接口进行调整
      return this.getMockQDIIFunds(params);
    } catch (error) {
      console.error('获取QDII基金失败:', error);
      return this.getMockQDIIFunds(params);
    }
  },
  
  // 模拟指数估值数据
  getMockIndexValuation: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        indices: [
          {
            code: '000001.SH',
            name: '上证指数',
            pe: 12.5,
            pb: 1.3,
            roe: 10.2,
            valuation: '合理',
            change: 0.5
          },
          {
            code: '399001.SZ',
            name: '深证成指',
            pe: 15.8,
            pb: 1.8,
            roe: 11.5,
            valuation: '合理',
            change: 0.8
          },
          {
            code: '399006.SZ',
            name: '创业板指',
            pe: 35.2,
            pb: 4.2,
            roe: 8.5,
            valuation: '高估',
            change: 1.2
          },
          {
            code: '000300.SH',
            name: '沪深300',
            pe: 13.8,
            pb: 1.5,
            roe: 11.0,
            valuation: '合理',
            change: 0.6
          },
          {
            code: '000905.SH',
            name: '中证500',
            pe: 22.5,
            pb: 2.0,
            roe: 9.5,
            valuation: '合理',
            change: 0.9
          },
          {
            code: '000016.SH',
            name: '上证50',
            pe: 10.8,
            pb: 1.2,
            roe: 12.5,
            valuation: '低估',
            change: 0.4
          }
        ]
      }
    };
  },
  
  // 模拟基金筛选数据
  getMockFundScreening: function(params) {
    return {
      success: true,
      data: {
        total: 100,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        funds: [
          {
            code: '110022',
            name: '易方达消费行业股票',
            type: '股票型',
            nav: 2.8567,
            change: 1.25,
            annualReturn: 15.8,
            riskLevel: '中高风险'
          },
          {
            code: '110011',
            name: '易方达优质精选混合(QDII)',
            type: 'QDII',
            nav: 1.9876,
            change: 0.85,
            annualReturn: 12.5,
            riskLevel: '高风险'
          },
          {
            code: '000001',
            name: '华夏成长混合',
            type: '混合型',
            nav: 1.2345,
            change: 0.56,
            annualReturn: 8.2,
            riskLevel: '中风险'
          },
          {
            code: '000011',
            name: '华夏大盘精选混合',
            type: '混合型',
            nav: 15.6789,
            change: 0.98,
            annualReturn: 20.5,
            riskLevel: '高风险'
          },
          {
            code: '001475',
            name: '易方达国防军工混合',
            type: '混合型',
            nav: 1.0987,
            change: 1.56,
            annualReturn: 18.2,
            riskLevel: '高风险'
          }
        ]
      }
    };
  },
  
  // 模拟指数选基数据
  getMockIndexFunds: function(params) {
    return {
      success: true,
      data: {
        indices: [
          {
            code: '000300.SH',
            name: '沪深300',
            funds: [
              {
                code: '510300',
                name: '沪深300ETF',
                type: 'ETF',
                nav: 4.5678,
                change: 0.65,
                trackingError: 0.02
              },
              {
                code: '110020',
                name: '易方达沪深300ETF联接',
                type: '指数型',
                nav: 1.2345,
                change: 0.62,
                trackingError: 0.03
              }
            ]
          },
          {
            code: '000905.SH',
            name: '中证500',
            funds: [
              {
                code: '510500',
                name: '中证500ETF',
                type: 'ETF',
                nav: 6.7890,
                change: 0.95,
                trackingError: 0.02
              },
              {
                code: '110021',
                name: '易方达中证500ETF联接',
                type: '指数型',
                nav: 1.4567,
                change: 0.92,
                trackingError: 0.03
              }
            ]
          }
        ]
      }
    };
  },
  
  // 模拟QDII基金数据
  getMockQDIIFunds: function(params) {
    return {
      success: true,
      data: {
        total: 50,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        funds: [
          {
            code: '110011',
            name: '易方达优质精选混合(QDII)',
            type: 'QDII-混合型',
            nav: 1.9876,
            change: 0.85,
            annualReturn: 12.5,
            riskLevel: '高风险'
          },
          {
            code: '000209',
            name: '信诚新兴产业混合(QDII)',
            type: 'QDII-混合型',
            nav: 1.3456,
            change: 1.25,
            annualReturn: 15.8,
            riskLevel: '高风险'
          },
          {
            code: '005827',
            name: '易方达蓝筹精选混合(QDII)',
            type: 'QDII-混合型',
            nav: 2.8765,
            change: 0.75,
            annualReturn: 18.2,
            riskLevel: '高风险'
          },
          {
            code: '161124',
            name: '易方达香港恒生ETF联接人民币',
            type: 'QDII-指数型',
            nav: 1.1234,
            change: 0.55,
            annualReturn: 8.5,
            riskLevel: '中风险'
          },
          {
            code: '161125',
            name: '易方达美国原油LOF',
            type: 'QDII-商品型',
            nav: 0.8765,
            change: 2.5,
            annualReturn: -5.2,
            riskLevel: '高风险'
          }
        ]
      }
    };
  }
};

module.exports = danjuanFunds;