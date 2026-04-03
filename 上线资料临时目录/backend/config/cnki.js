const axios = require('axios');

class CNKIAPI {
  constructor() {
    this.baseUrl = 'https://data.cnki.net';
    this.chatUrl = 'https://data.cnki.net/aidata/chat';
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
      console.error('CNKI home data fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAIModelService() {
    try {
      const response = await axios.get(this.chatUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('CNKI AI model service fetch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async chatWithAI(message) {
    try {
      const response = await axios.post(this.chatUrl, {
        message: message
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('CNKI AI chat error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new CNKIAPI();
