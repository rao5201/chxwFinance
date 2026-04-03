// 中央财经大学金融学院配置文件
const axios = require('axios');

// 中央财经大学金融学院配置
const cufeFinance = {
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
  
  // 获取中央财经大学金融学院首页数据
  getHomepage: async function() {
    try {
      // 实际项目中需要根据中央财经大学金融学院的API接口进行调整
      return this.getMockHomepage();
    } catch (error) {
      console.error('获取中央财经大学金融学院首页数据失败:', error);
      return this.getMockHomepage();
    }
  },
  
  // 获取中央财经大学金融学院师资力量
  getFaculty: async function() {
    try {
      // 实际项目中需要根据中央财经大学金融学院的API接口进行调整
      return this.getMockFaculty();
    } catch (error) {
      console.error('获取中央财经大学金融学院师资力量失败:', error);
      return this.getMockFaculty();
    }
  },
  
  // 获取中央财经大学金融学院学术研究
  getResearch: async function() {
    try {
      // 实际项目中需要根据中央财经大学金融学院的API接口进行调整
      return this.getMockResearch();
    } catch (error) {
      console.error('获取中央财经大学金融学院学术研究失败:', error);
      return this.getMockResearch();
    }
  },
  
  // 获取中央财经大学金融学院教学资源
  getTeachingResources: async function() {
    try {
      // 实际项目中需要根据中央财经大学金融学院的API接口进行调整
      return this.getMockTeachingResources();
    } catch (error) {
      console.error('获取中央财经大学金融学院教学资源失败:', error);
      return this.getMockTeachingResources();
    }
  },
  
  // 获取中央财经大学金融学院新闻资讯
  getNews: async function() {
    try {
      // 实际项目中需要根据中央财经大学金融学院的API接口进行调整
      return this.getMockNews();
    } catch (error) {
      console.error('获取中央财经大学金融学院新闻资讯失败:', error);
      return this.getMockNews();
    }
  },
  
  // 模拟中央财经大学金融学院首页数据
  getMockHomepage: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        banners: [
          {
            id: '1',
            title: '中央财经大学金融学院2026年招生公告',
            image: 'https://sf.cufe.edu.cn/images/banner1.jpg',
            url: 'https://sf.cufe.edu.cn/zsxx/2026zsgg.htm'
          },
          {
            id: '2',
            title: '金融学院举办2026年学术研讨会',
            image: 'https://sf.cufe.edu.cn/images/banner2.jpg',
            url: 'https://sf.cufe.edu.cn/学术活动/2026xshy.htm'
          },
          {
            id: '3',
            title: '金融学院教师获得国家社科基金重大项目',
            image: 'https://sf.cufe.edu.cn/images/banner3.jpg',
            url: 'https://sf.cufe.edu.cn/科研动态/2026kydt.htm'
          }
        ],
        news: [
          {
            id: '1',
            title: '金融学院获批2026年度国家自然科学基金项目',
            summary: '金融学院教师获批2026年度国家自然科学基金项目10项，经费总额超过500万元。',
            publishTime: new Date().toISOString(),
            url: 'https://sf.cufe.edu.cn/科研动态/2026kydt.htm'
          },
          {
            id: '2',
            title: '金融学院与多家金融机构签署合作协议',
            summary: '金融学院与工商银行、建设银行等多家金融机构签署合作协议，共建实习实训基地。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://sf.cufe.edu.cn/合作交流/2026hzjl.htm'
          }
        ]
      }
    };
  },
  
  // 模拟中央财经大学金融学院师资力量
  getMockFaculty: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        faculty: [
          {
            id: '1',
            name: '李教授',
            title: '院长、教授、博士生导师',
            field: '金融市场、资产定价',
            education: '北京大学经济学博士',
            url: 'https://sf.cufe.edu.cn/szll/ljs.htm'
          },
          {
            id: '2',
            name: '王教授',
            title: '教授、博士生导师',
            field: '国际金融、汇率理论',
            education: '清华大学经济学博士',
            url: 'https://sf.cufe.edu.cn/szll/wjs.htm'
          },
          {
            id: '3',
            name: '张教授',
            title: '教授、博士生导师',
            field: '金融工程、风险管理',
            education: '复旦大学经济学博士',
            url: 'https://sf.cufe.edu.cn/szll/zjs.htm'
          },
          {
            id: '4',
            name: '刘教授',
            title: '副教授、硕士生导师',
            field: '银行管理、金融监管',
            education: '中央财经大学经济学博士',
            url: 'https://sf.cufe.edu.cn/szll/lxs.htm'
          }
        ]
      }
    };
  },
  
  // 模拟中央财经大学金融学院学术研究
  getMockResearch: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        research: {
          projects: [
            {
              id: '1',
              name: '中国金融市场风险预警与防控机制研究',
              type: '国家社科基金重大项目',
              leader: '李教授',
              funding: '200万元',
              period: '2026-2029',
              url: 'https://sf.cufe.edu.cn/科研项目/2026kyxm.htm'
            },
            {
              id: '2',
              name: '数字金融对实体经济的影响研究',
              type: '国家自然科学基金项目',
              leader: '王教授',
              funding: '60万元',
              period: '2026-2029',
              url: 'https://sf.cufe.edu.cn/科研项目/2026kyxm.htm'
            }
          ],
          publications: [
            {
              id: '1',
              title: '中国金融市场效率研究',
              author: '李教授等',
              journal: '经济研究',
              year: '2025',
              url: 'https://sf.cufe.edu.cn/科研成果/2025kycg.htm'
            },
            {
              id: '2',
              title: '数字金融与经济增长',
              author: '王教授等',
              journal: '金融研究',
              year: '2025',
              url: 'https://sf.cufe.edu.cn/科研成果/2025kycg.htm'
            }
          ]
        }
      }
    };
  },
  
  // 模拟中央财经大学金融学院教学资源
  getMockTeachingResources: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        resources: {
          courses: [
            {
              id: '1',
              name: '金融学原理',
              type: '本科生课程',
              instructor: '李教授',
              description: '介绍金融学基本原理和概念，包括货币、信用、利率等内容。',
              url: 'https://sf.cufe.edu.cn/jxky/bksk.htm'
            },
            {
              id: '2',
              name: '金融市场与机构',
              type: '本科生课程',
              instructor: '王教授',
              description: '介绍金融市场的结构和功能，以及各类金融机构的运作。',
              url: 'https://sf.cufe.edu.cn/jxky/bksk.htm'
            },
            {
              id: '3',
              name: '高级金融理论',
              type: '研究生课程',
              instructor: '张教授',
              description: '深入探讨金融理论的前沿问题，包括资产定价、风险管理等。',
              url: 'https://sf.cufe.edu.cn/jxky/yzsk.htm'
            }
          ],
          materials: [
            {
              id: '1',
              name: '金融学课件',
              type: '教学课件',
              description: '包含金融学原理、金融市场等课程的课件资料。',
              url: 'https://sf.cufe.edu.cn/jxky/jxzl.htm'
            },
            {
              id: '2',
              name: '金融案例集',
              type: '案例资料',
              description: '包含金融市场、公司金融等领域的实际案例。',
              url: 'https://sf.cufe.edu.cn/jxky/jxzl.htm'
            }
          ]
        }
      }
    };
  },
  
  // 模拟中央财经大学金融学院新闻资讯
  getMockNews: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        news: [
          {
            id: '1',
            title: '金融学院举办2026年金融创新论坛',
            summary: '金融学院成功举办2026年金融创新论坛，邀请国内外知名专家学者参与讨论。',
            publishTime: new Date().toISOString(),
            url: 'https://sf.cufe.edu.cn/学院新闻/2026xyxw.htm'
          },
          {
            id: '2',
            title: '金融学院学生在全国金融建模大赛中获得一等奖',
            summary: '金融学院学生团队在2026年全国金融建模大赛中获得一等奖，展现了扎实的专业能力。',
            publishTime: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://sf.cufe.edu.cn/学生活动/2026xshd.htm'
          },
          {
            id: '3',
            title: '金融学院与国际知名大学签署合作协议',
            summary: '金融学院与美国宾夕法尼亚大学沃顿商学院签署合作协议，开展学生交流和学术合作。',
            publishTime: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://sf.cufe.edu.cn/合作交流/2026hzjl.htm'
          }
        ]
      }
    };
  }
};

module.exports = cufeFinance;