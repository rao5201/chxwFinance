const axios = require('axios');

class YicaiAPI {
  constructor() {
    this.baseUrl = 'https://www.yicai.com';
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
      console.error('Yicai home data fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getFinancialNews() {
    try {
      const response = await axios.get(`${this.baseUrl}/finance/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Yicai financial news fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getStockMarket() {
    try {
      const response = await axios.get(`${this.baseUrl}/stock/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Yicai stock market fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new YicaiAPI();
