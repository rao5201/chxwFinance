const axios = require('axios');

class DataYicaiAPI {
  constructor() {
    this.baseUrl = 'https://www.datayicai.com';
    this.loginUrl = 'https://www.datayicai.com/home#/login/reg';
  }

  async getHomeData() {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('DataYicai home data fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCityData() {
    try {
      const response = await axios.get(`${this.baseUrl}/home`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('DataYicai city data fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getNewFirstTierCities() {
    try {
      // 模拟新一线城市数据
      return {
        success: true,
        data: {
          year: 2026,
          cities: [
            { name: '成都', rank: 1, score: 95.2 },
            { name: '杭州', rank: 2, score: 93.5 },
            { name: '重庆', rank: 3, score: 92.8 },
            { name: '武汉', rank: 4, score: 91.5 },
            { name: '西安', rank: 5, score: 90.2 },
            { name: '苏州', rank: 6, score: 89.8 },
            { name: '南京', rank: 7, score: 88.5 },
            { name: '天津', rank: 8, score: 87.2 },
            { name: '郑州', rank: 9, score: 86.5 },
            { name: '长沙', rank: 10, score: 85.8 }
          ],
          methodology: '基于商业魅力指数，包括商业资源集聚度、城市枢纽性、城市人活跃度、生活方式多样性和未来可塑性五大维度'
        }
      };
    } catch (error) {
      console.error('DataYicai new first tier cities fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCityRankings() {
    try {
      // 模拟城市排名数据
      return {
        success: true,
        data: {
          categories: [
            {
              name: '商业资源集聚度',
              cities: [
                { name: '上海', score: 98.5 },
                { name: '北京', score: 97.8 },
                { name: '广州', score: 92.3 },
                { name: '深圳', score: 91.5 },
                { name: '成都', score: 88.2 }
              ]
            },
            {
              name: '城市枢纽性',
              cities: [
                { name: '北京', score: 99.2 },
                { name: '上海', score: 98.5 },
                { name: '广州', score: 93.8 },
                { name: '深圳', score: 90.5 },
                { name: '成都', score: 87.2 }
              ]
            },
            {
              name: '城市人活跃度',
              cities: [
                { name: '上海', score: 97.5 },
                { name: '北京', score: 96.8 },
                { name: '深圳', score: 94.2 },
                { name: '广州', score: 93.5 },
                { name: '杭州', score: 91.8 }
              ]
            },
            {
              name: '生活方式多样性',
              cities: [
                { name: '上海', score: 98.2 },
                { name: '北京', score: 97.5 },
                { name: '广州', score: 94.8 },
                { name: '深圳', score: 92.5 },
                { name: '成都', score: 91.2 }
              ]
            },
            {
              name: '未来可塑性',
              cities: [
                { name: '北京', score: 99.5 },
                { name: '上海', score: 98.8 },
                { name: '深圳', score: 97.2 },
                { name: '广州', score: 93.5 },
                { name: '杭州', score: 92.8 }
              ]
            }
          ]
        }
      };
    } catch (error) {
      console.error('DataYicai city rankings fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new DataYicaiAPI();
