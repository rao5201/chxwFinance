const axios = require('axios');

const ChoiceQuantAPI = {
  // 获取Choice数据量化接口信息
  getQuantAPIInfo: async () => {
    try {
      // 这里可以从官方API获取最新信息，现在返回静态数据
      return {
        success: true,
        data: {
          name: 'Choice数据量化接口',
          description: '能够以函数调用的形式提供丰富的基本面，财务，历史行情等数据内容，可支持用户进行数据分析及策略挖掘',
          versions: [
            {
              platform: 'Windows',
              languages: ['C++', 'C#', 'Java', 'Python2.x', 'Python3.x', 'MATLAB', 'R']
            },
            {
              platform: 'Linux',
              languages: ['C++', 'Java', 'Python2.x', 'Python3.x']
            },
            {
              platform: 'Mac',
              languages: ['C++', 'Java', 'Python2.x', 'Python3.x']
            }
          ],
          latestVersion: 'V2.6.1.3',
          releaseDate: '2025-12-16',
          updateInfo: '更新CFN资讯函数，新增市场舆情（对应终端资讯栏目）；新增一批A、港股一级市场相关专题；其他bug修复。',
          updateHistory: [
            {
              version: 'V2.6.1.3',
              date: '2025-12-16',
              content: '更新CFN资讯函数，新增市场舆情（对应终端资讯栏目）；新增一批A、港股一级市场相关专题；其他bug修复。'
            },
            {
              version: 'V2.6.0.0',
              date: '2025-06-30',
              content: '1. 更新CFN资讯函数，新增市场舆情（对应终端资讯栏目）；2. 新增一批指标，包括港美新财务指标等；3. 其他bug修复。'
            },
            {
              version: 'V2.5.8.0',
              date: '2025-02-28',
              content: '1. 适配北交所存量上市公司证券代码切换；2. 其他bug修复。'
            }
          ],
          downloadLink: 'http://quantapi.eastmoney.com/Download?from=web',
          updateInfoLink: 'http://quantapi.eastmoney.com/Download/GetDownloadDesc?language=Python&sys=Common&from=web'
        }
      };
    } catch (error) {
      console.error('获取Choice数据量化接口信息失败:', error);
      throw error;
    }
  },

  // 获取Choice数据量化接口下载信息
  getQuantAPIDownload: async () => {
    try {
      // 这里可以从官方API获取最新下载信息，现在返回静态数据
      return {
        success: true,
        data: {
          downloadLink: 'http://quantapi.eastmoney.com/Download?from=web',
          versions: [
            {
              language: 'Python',
              systems: ['Windows', 'Linux', 'Mac'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '55.6M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            },
            {
              language: 'MATLAB',
              systems: ['Windows'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '11.3M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            },
            {
              language: 'R',
              systems: ['Windows'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '19.1M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            },
            {
              language: 'C++',
              systems: ['Linux'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '17.9M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            },
            {
              language: 'C++',
              systems: ['Windows'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '9.9M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            },
            {
              language: 'C++',
              systems: ['Mac'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '13.1M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            },
            {
              language: 'C#',
              systems: ['Windows'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '48.4M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            },
            {
              language: 'Java',
              systems: ['Windows', 'Linux', 'Mac'],
              version: 'V2.6.1.3',
              updateDate: '2025-12-16',
              size: '110M',
              downloadLink: 'http://quantapi.eastmoney.com/Download?from=web'
            }
          ]
        }
      };
    } catch (error) {
      console.error('获取Choice数据量化接口下载信息失败:', error);
      throw error;
    }
  }
};

module.exports = ChoiceQuantAPI;