// 广发证券供应商配置文件
const axios = require('axios');

// 广发证券供应商配置
const gfjc = {
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
  
  // 获取供应商信息
  getSuppliers: async function() {
    try {
      // 实际项目中需要根据广发证券供应商的API接口进行调整
      return this.getMockSuppliers();
    } catch (error) {
      console.error('获取供应商信息失败:', error);
      return this.getMockSuppliers();
    }
  },
  
  // 获取产品信息
  getProducts: async function() {
    try {
      // 实际项目中需要根据广发证券供应商的API接口进行调整
      return this.getMockProducts();
    } catch (error) {
      console.error('获取产品信息失败:', error);
      return this.getMockProducts();
    }
  },
  
  // 获取订单管理
  getOrders: async function() {
    try {
      // 实际项目中需要根据广发证券供应商的API接口进行调整
      return this.getMockOrders();
    } catch (error) {
      console.error('获取订单管理失败:', error);
      return this.getMockOrders();
    }
  },
  
  // 获取采购需求
  getPurchaseRequests: async function() {
    try {
      // 实际项目中需要根据广发证券供应商的API接口进行调整
      return this.getMockPurchaseRequests();
    } catch (error) {
      console.error('获取采购需求失败:', error);
      return this.getMockPurchaseRequests();
    }
  },
  
  // 获取合同管理
  getContracts: async function() {
    try {
      // 实际项目中需要根据广发证券供应商的API接口进行调整
      return this.getMockContracts();
    } catch (error) {
      console.error('获取合同管理失败:', error);
      return this.getMockContracts();
    }
  },
  
  // 模拟供应商信息
  getMockSuppliers: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        suppliers: [
          {
            id: '1',
            name: '供应商A',
            contactPerson: '张三',
            contactPhone: '13800138001',
            email: 'zhangsan@example.com',
            address: '北京市朝阳区',
            status: '正常',
            rating: 4.5,
            url: 'https://gfjc.gf.com.cn/supplier/1'
          },
          {
            id: '2',
            name: '供应商B',
            contactPerson: '李四',
            contactPhone: '13900139002',
            email: 'lisi@example.com',
            address: '上海市浦东新区',
            status: '正常',
            rating: 4.8,
            url: 'https://gfjc.gf.com.cn/supplier/2'
          },
          {
            id: '3',
            name: '供应商C',
            contactPerson: '王五',
            contactPhone: '13700137003',
            email: 'wangwu@example.com',
            address: '广州市天河区',
            status: '正常',
            rating: 4.2,
            url: 'https://gfjc.gf.com.cn/supplier/3'
          }
        ]
      }
    };
  },
  
  // 模拟产品信息
  getMockProducts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        products: [
          {
            id: '1',
            name: '金融IT系统',
            category: '信息技术',
            supplierId: '1',
            supplierName: '供应商A',
            price: 1000000,
            unit: '套',
            status: '在售',
            url: 'https://gfjc.gf.com.cn/product/1'
          },
          {
            id: '2',
            name: '办公设备',
            category: '办公耗材',
            supplierId: '2',
            supplierName: '供应商B',
            price: 5000,
            unit: '台',
            status: '在售',
            url: 'https://gfjc.gf.com.cn/product/2'
          },
          {
            id: '3',
            name: '金融培训服务',
            category: '教育培训',
            supplierId: '3',
            supplierName: '供应商C',
            price: 50000,
            unit: '次',
            status: '在售',
            url: 'https://gfjc.gf.com.cn/product/3'
          }
        ]
      }
    };
  },
  
  // 模拟订单管理
  getMockOrders: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        orders: [
          {
            id: '1',
            orderNo: 'GFJC20260401001',
            productId: '1',
            productName: '金融IT系统',
            supplierId: '1',
            supplierName: '供应商A',
            quantity: 1,
            unitPrice: 1000000,
            totalAmount: 1000000,
            orderDate: '2026-04-01',
            status: '已完成',
            url: 'https://gfjc.gf.com.cn/order/1'
          },
          {
            id: '2',
            orderNo: 'GFJC20260402002',
            productId: '2',
            productName: '办公设备',
            supplierId: '2',
            supplierName: '供应商B',
            quantity: 10,
            unitPrice: 5000,
            totalAmount: 50000,
            orderDate: '2026-04-02',
            status: '已完成',
            url: 'https://gfjc.gf.com.cn/order/2'
          },
          {
            id: '3',
            orderNo: 'GFJC20260403003',
            productId: '3',
            productName: '金融培训服务',
            supplierId: '3',
            supplierName: '供应商C',
            quantity: 2,
            unitPrice: 50000,
            totalAmount: 100000,
            orderDate: '2026-04-03',
            status: '处理中',
            url: 'https://gfjc.gf.com.cn/order/3'
          }
        ]
      }
    };
  },
  
  // 模拟采购需求
  getMockPurchaseRequests: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        requests: [
          {
            id: '1',
            requestNo: 'GFJC20260401001',
            productName: '金融IT系统升级',
            category: '信息技术',
            quantity: 1,
            estimatedBudget: 1500000,
            requestDate: '2026-04-01',
            status: '已审批',
            url: 'https://gfjc.gf.com.cn/request/1'
          },
          {
            id: '2',
            requestNo: 'GFJC20260402002',
            productName: '办公设备采购',
            category: '办公耗材',
            quantity: 20,
            estimatedBudget: 100000,
            requestDate: '2026-04-02',
            status: '已审批',
            url: 'https://gfjc.gf.com.cn/request/2'
          },
          {
            id: '3',
            requestNo: 'GFJC20260403003',
            productName: '金融培训服务',
            category: '教育培训',
            quantity: 3,
            estimatedBudget: 150000,
            requestDate: '2026-04-03',
            status: '待审批',
            url: 'https://gfjc.gf.com.cn/request/3'
          }
        ]
      }
    };
  },
  
  // 模拟合同管理
  getMockContracts: function() {
    return {
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        contracts: [
          {
            id: '1',
            contractNo: 'GFJC20260401001',
            supplierId: '1',
            supplierName: '供应商A',
            productName: '金融IT系统',
            totalAmount: 1000000,
            signDate: '2026-04-01',
            startDate: '2026-04-01',
            endDate: '2027-04-01',
            status: '生效中',
            url: 'https://gfjc.gf.com.cn/contract/1'
          },
          {
            id: '2',
            contractNo: 'GFJC20260402002',
            supplierId: '2',
            supplierName: '供应商B',
            productName: '办公设备',
            totalAmount: 50000,
            signDate: '2026-04-02',
            startDate: '2026-04-02',
            endDate: '2026-12-31',
            status: '生效中',
            url: 'https://gfjc.gf.com.cn/contract/2'
          },
          {
            id: '3',
            contractNo: 'GFJC20260403003',
            supplierId: '3',
            supplierName: '供应商C',
            productName: '金融培训服务',
            totalAmount: 100000,
            signDate: '2026-04-03',
            startDate: '2026-04-03',
            endDate: '2026-12-31',
            status: '待生效',
            url: 'https://gfjc.gf.com.cn/contract/3'
          }
        ]
      }
    };
  }
};

module.exports = gfjc;