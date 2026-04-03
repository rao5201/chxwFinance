// 中国证监会配置文件
const axios = require('axios');

// 中国证监会配置
const csrc = {
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
  
  // 获取证监会公告
  getCSRCAnnouncements: async function() {
    try {
      // 实际项目中需要根据证监会的API接口进行调整
      return this.getMockCSRCAnnouncements();
    } catch (error) {
      console.error('获取证监会公告失败:', error);
      return this.getMockCSRCAnnouncements();
    }
  },
  
  // 获取监管政策
  getRegulatoryPolicies: async function() {
    try {
      // 实际项目中需要根据证监会的API接口进行调整
      return this.getMockRegulatoryPolicies();
    } catch (error) {
      console.error('获取监管政策失败:', error);
      return this.getMockRegulatoryPolicies();
    }
  },
  
  // 获取政府机构信息
  getGovernmentInstitutions: async function() {
    try {
      // 实际项目中需要根据证监会的API接口进行调整
      return this.getMockGovernmentInstitutions();
    } catch (error) {
      console.error('获取政府机构信息失败:', error);
      return this.getMockGovernmentInstitutions();
    }
  },
  
  // 获取交易所信息
  getExchanges: async function() {
    try {
      // 实际项目中需要根据证监会的API接口进行调整
      return this.getMockExchanges();
    } catch (error) {
      console.error('获取交易所信息失败:', error);
      return this.getMockExchanges();
    }
  },
  
  // 获取市场数据
  getMarketData: async function() {
    try {
      // 实际项目中需要根据证监会的API接口进行调整
      return this.getMockMarketData();
    } catch (error) {
      console.error('获取市场数据失败:', error);
      return this.getMockMarketData();
    }
  },
  
  // 模拟证监会公告
  getMockCSRCAnnouncements: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        announcements: [
          {
            id: '1',
            title: '证监会发布《关于进一步提高上市公司质量的意见》',
            summary: '为进一步提高上市公司质量，保护投资者合法权益，促进资本市场健康发展，证监会发布《关于进一步提高上市公司质量的意见》。',
            publishDate: '2026-04-03',
            url: 'https://www.csrc.gov.cn/pub/newsite/zjhxwfb/xwfbh/202604/t20260403_180123.html'
          },
          {
            id: '2',
            title: '证监会就《证券期货市场程序化交易管理办法》公开征求意见',
            summary: '为规范证券期货市场程序化交易行为，维护市场秩序，保护投资者合法权益，证监会就《证券期货市场程序化交易管理办法》公开征求意见。',
            publishDate: '2026-03-25',
            url: 'https://www.csrc.gov.cn/pub/newsite/zjhxwfb/xwfbh/202603/t20260325_179856.html'
          },
          {
            id: '3',
            title: '证监会召开2026年系统工作会议',
            summary: '证监会召开2026年系统工作会议，总结2025年工作，部署2026年重点任务。',
            publishDate: '2026-01-15',
            url: 'https://www.csrc.gov.cn/pub/newsite/zjhxwfb/xwfbh/202601/t20260115_178567.html'
          }
        ]
      }
    };
  },
  
  // 模拟监管政策
  getMockRegulatoryPolicies: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        policies: [
          {
            id: '1',
            title: '上市公司信息披露管理办法',
            effectiveDate: '2025-05-01',
            summary: '规范上市公司信息披露行为，保护投资者合法权益，维护证券市场秩序。',
            url: 'https://www.csrc.gov.cn/pub/zjhpublic/zjh/202504/t20250415_175678.html'
          },
          {
            id: '2',
            title: '证券期货投资者适当性管理办法',
            effectiveDate: '2025-03-01',
            summary: '保护投资者合法权益，规范证券期货投资者适当性管理。',
            url: 'https://www.csrc.gov.cn/pub/zjhpublic/zjh/202502/t20250210_174567.html'
          },
          {
            id: '3',
            title: '证券公司风险控制指标管理办法',
            effectiveDate: '2025-01-01',
            summary: '加强证券公司风险控制，防范和化解金融风险。',
            url: 'https://www.csrc.gov.cn/pub/zjhpublic/zjh/202412/t20241215_173456.html'
          }
        ]
      }
    };
  },
  
  // 模拟政府机构信息
  getMockGovernmentInstitutions: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        institutions: [
          {
            name: '中国证券监督管理委员会',
            type: '政府机构',
            description: '国务院直属正部级事业单位，依照法律、法规和国务院授权，统一监督管理全国证券期货市场，维护证券期货市场秩序，保障其合法运行。',
            url: 'https://www.csrc.gov.cn/'
          },
          {
            name: '中国证券投资者保护基金有限责任公司',
            type: '监管机构',
            description: '为建立防范和处置证券公司风险的长效机制，保护投资者合法权益，促进证券市场健康发展，经国务院批准，中国证券投资者保护基金有限责任公司于2005年8月30日注册成立。',
            url: 'https://www.sipf.com.cn/'
          },
          {
            name: '中国期货市场监控中心有限责任公司',
            type: '监管机构',
            description: '中国期货市场监控中心有限责任公司是经国务院同意，中国证监会决定设立的期货市场监控和风险监测机构，于2006年3月成立。',
            url: 'https://www.cfmmc.com/'
          },
          {
            name: '中证数据有限责任公司',
            type: '监管机构',
            description: '中证数据有限责任公司是中国证监会直接管理的证券期货行业数据中心，成立于2013年12月。',
            url: 'https://www.csdc.com.cn/'
          },
          {
            name: '中证信息技术服务有限责任公司',
            type: '监管机构',
            description: '中证信息技术服务有限责任公司是中国证监会直接管理的证券期货行业信息技术服务机构，成立于2015年12月。',
            url: 'https://www.csitsec.com/'
          },
          {
            name: '中证中小投资者服务中心有限责任公司',
            type: '监管机构',
            description: '中证中小投资者服务中心有限责任公司是中国证监会直接管理的证券期货市场中小投资者保护机构，成立于2014年12月。',
            url: 'https://www.isc.com.cn/'
          },
          {
            name: '中证商品指数有限责任公司',
            type: '监管机构',
            description: '中证商品指数有限责任公司是中国证监会直接管理的证券期货市场指数编制机构，成立于2012年12月。',
            url: 'https://www.csindex.com.cn/'
          },
          {
            name: '中证金融研究院',
            type: '监管机构',
            description: '中证金融研究院是中国证监会直接管理的证券期货市场研究机构，成立于2012年12月。',
            url: 'https://www.cfr.com.cn/'
          },
          {
            name: '资本市场学院',
            type: '监管机构',
            description: '资本市场学院是中国证监会直接管理的证券期货市场教育培训机构，成立于2012年12月。',
            url: 'https://www.ccmi.edu.cn/'
          },
          {
            name: '中国资本市场学会',
            type: '监管机构',
            description: '中国资本市场学会是中国证监会直接管理的证券期货市场学术团体，成立于1991年12月。',
            url: 'https://www.ccas.org.cn/'
          }
        ]
      }
    };
  },
  
  // 模拟交易所信息
  getMockExchanges: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        exchanges: [
          {
            name: '上海证券交易所',
            type: '证券交易所',
            description: '上海证券交易所成立于1990年11月26日，同年12月19日正式开业。是中国大陆两所证券交易所之一，位于上海浦东新区。',
            url: 'https://www.sse.com.cn/'
          },
          {
            name: '深圳证券交易所',
            type: '证券交易所',
            description: '深圳证券交易所成立于1990年12月1日，是中国大陆两所证券交易所之一，位于广东省深圳市。',
            url: 'https://www.szse.cn/'
          },
          {
            name: '北京证券交易所',
            type: '证券交易所',
            description: '北京证券交易所成立于2021年9月3日，是中国大陆第三所证券交易所，位于北京市西城区。',
            url: 'https://www.bse.cn/'
          },
          {
            name: '上海期货交易所',
            type: '期货交易所',
            description: '上海期货交易所成立于1990年11月26日，是中国大陆第一家期货交易所，位于上海浦东新区。',
            url: 'https://www.shfe.com.cn/'
          },
          {
            name: '郑州商品交易所',
            type: '期货交易所',
            description: '郑州商品交易所成立于1990年10月12日，是中国大陆第二家期货交易所，位于河南省郑州市。',
            url: 'https://www.czce.com.cn/'
          },
          {
            name: '大连商品交易所',
            type: '期货交易所',
            description: '大连商品交易所成立于1993年2月28日，是中国大陆第三家期货交易所，位于辽宁省大连市。',
            url: 'https://www.dce.com.cn/'
          },
          {
            name: '中国金融期货交易所',
            type: '期货交易所',
            description: '中国金融期货交易所成立于2006年9月8日，是中国大陆第四家期货交易所，位于上海浦东新区。',
            url: 'https://www.cffex.com.cn/'
          },
          {
            name: '广州期货交易所',
            type: '期货交易所',
            description: '广州期货交易所成立于2021年4月19日，是中国大陆第五家期货交易所，位于广东省广州市。',
            url: 'https://www.gfex.com.cn/'
          },
          {
            name: '中国证券登记结算有限责任公司',
            type: '登记结算机构',
            description: '中国证券登记结算有限责任公司成立于2001年3月30日，是中国大陆唯一的证券登记结算机构，总部位于上海浦东新区。',
            url: 'https://www.chinaclear.cn/'
          },
          {
            name: '全国中小企业股份转让系统有限责任公司',
            type: '证券交易场所',
            description: '全国中小企业股份转让系统有限责任公司成立于2012年9月20日，是中国大陆的全国性证券交易场所，位于北京市西城区。',
            url: 'https://www.neeq.com.cn/'
          }
        ]
      }
    };
  },
  
  // 模拟市场数据
  getMockMarketData: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        marketData: {
          totalMarketCap: 120000000000000,
          totalTradingVolume: 500000000000,
          totalListedCompanies: 4500,
          totalInvestors: 220000000,
          marketIndices: [
            {
              name: '上证指数',
              code: '000001.SH',
              price: 3850.25,
              change: 25.68,
              changePercent: 0.67
            },
            {
              name: '深证成指',
              code: '399001.SZ',
              price: 12850.68,
              change: 156.32,
              changePercent: 1.23
            },
            {
              name: '创业板指',
              code: '399006.SZ',
              price: 2560.32,
              change: 45.68,
              changePercent: 1.81
            },
            {
              name: '北证50',
              code: '899050.BJ',
              price: 1250.68,
              change: 15.32,
              changePercent: 1.24
            }
          ]
        }
      }
    };
  }
};

module.exports = csrc;