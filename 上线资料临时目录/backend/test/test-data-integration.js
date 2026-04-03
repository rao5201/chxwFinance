/**
 * 茶海虾王@金融交易所看板平台 - 数据接入测试脚本
 * 测试网站接入、APP数据接入、加密解密功能
 */

const axios = require('axios');
const { securityUtils, encryption } = require('../config/security');
const { logger } = require('../config/logger');

// 测试配置
const TEST_CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  testWebsites: [
    { name: '新浪金融', url: 'https://finance.sina.com.cn', type: 'finance' },
    { name: '东方财富网', url: 'https://www.eastmoney.com', type: 'finance' },
    { name: '中国政府网', url: 'http://www.gov.cn/zhengce/', type: 'government' },
    { name: '同花顺', url: 'https://www.10jqka.com.cn', type: 'finance' },
    { name: '雪球', url: 'https://xueqiu.com', type: 'finance' },
    { name: '腾讯财经', url: 'https://finance.qq.com', type: 'finance' },
    { name: '网易财经', url: 'https://money.163.com', type: 'finance' },
    { name: '凤凰财经', url: 'https://finance.ifeng.com', type: 'finance' },
    { name: '中金公司', url: 'https://www.cicc.com.cn', type: 'financial_company' },
    { name: '中信证券', url: 'https://www.cs.ecitic.com', type: 'financial_company' },
    { name: '海通证券', url: 'https://www.htsec.com', type: 'financial_company' },
    { name: '国泰君安', url: 'https://www.gtja.com', type: 'financial_company' },
    { name: '阿里巴巴', url: 'https://www.alibabagroup.com', type: 'listed_company' },
    { name: '腾讯控股', url: 'https://www.tencent.com', type: 'listed_company' },
    { name: '中国平安', url: 'https://www.pingan.com', type: 'listed_company' },
    { name: '贵州茅台', url: 'https://www.moutaichina.com', type: 'listed_company' }
  ]
};

// 测试结果存储
const testResults = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  }
};

// 添加测试结果
function addTestResult(name, status, details = {}, error = null) {
  const result = {
    name,
    status,
    timestamp: new Date().toISOString(),
    details,
    error: error ? error.message : null
  };
  testResults.tests.push(result);
  testResults.summary.total++;
  if (status === 'PASSED') {
    testResults.summary.passed++;
  } else {
    testResults.summary.failed++;
  }
  return result;
}

// 测试1: 网站连接测试
async function testWebsiteConnection() {
  logger.info('开始测试网站连接...');
  
  for (const website of TEST_CONFIG.testWebsites) {
    try {
      const startTime = Date.now();
      const response = await axios.get(website.url, {
        timeout: TEST_CONFIG.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        validateStatus: () => true // 接受所有状态码
      });
      const responseTime = Date.now() - startTime;
      
      const isAccessible = response.status >= 200 && response.status < 400;
      
      addTestResult(
        `网站连接测试 - ${website.name}`,
        isAccessible ? 'PASSED' : 'FAILED',
        {
          url: website.url,
          statusCode: response.status,
          responseTime: `${responseTime}ms`,
          contentLength: response.data?.length || 0,
          type: website.type
        },
        isAccessible ? null : new Error(`HTTP ${response.status}`)
      );
      
      logger.info(`${website.name} 连接测试: ${isAccessible ? '通过' : '失败'} (${response.status})`);
    } catch (error) {
      addTestResult(
        `网站连接测试 - ${website.name}`,
        'FAILED',
        { url: website.url, type: website.type },
        error
      );
      logger.error(`${website.name} 连接测试失败:`, error.message);
    }
  }
}

// 测试2: 数据加密功能测试
async function testEncryption() {
  logger.info('开始测试数据加密功能...');
  
  try {
    const testData = {
      userId: 'test123',
      sensitiveInfo: '这是敏感数据：身份证号 110101199001011234，银行卡号 6222021234567890123',
      financialData: {
        balance: 1000000.50,
        accountNumber: '6222021234567890123'
      }
    };
    
    const dataString = JSON.stringify(testData);
    const key = securityUtils.generateSecureKey();
    
    const startTime = Date.now();
    const encrypted = securityUtils.encryptSensitiveData(dataString, key);
    const encryptionTime = Date.now() - startTime;
    
    const success = encrypted && encrypted.encrypted && encrypted.iv && encrypted.tag;
    
    addTestResult(
      '数据加密功能测试',
      success ? 'PASSED' : 'FAILED',
      {
        algorithm: encryption.sensitiveData.algorithm,
        keyLength: key.length,
        encryptedLength: encrypted.encrypted.length,
        ivLength: encrypted.iv.length,
        tagLength: encrypted.tag.length,
        encryptionTime: `${encryptionTime}ms`,
        originalDataSize: dataString.length
      },
      success ? null : new Error('加密结果不完整')
    );
    
    logger.info(`数据加密测试: ${success ? '通过' : '失败'} (${encryptionTime}ms)`);
    
    return { encrypted, key, originalData: testData };
  } catch (error) {
    addTestResult('数据加密功能测试', 'FAILED', {}, error);
    logger.error('数据加密测试失败:', error.message);
    return null;
  }
}

// 测试3: 数据解密功能测试
async function testDecryption(encryptedData, key, originalData) {
  logger.info('开始测试数据解密功能...');
  
  if (!encryptedData || !key) {
    addTestResult('数据解密功能测试', 'FAILED', {}, new Error('缺少加密数据或密钥'));
    return;
  }
  
  try {
    const startTime = Date.now();
    const decrypted = securityUtils.decryptSensitiveData(
      encryptedData.encrypted,
      key,
      encryptedData.iv,
      encryptedData.tag
    );
    const decryptionTime = Date.now() - startTime;
    
    const decryptedData = JSON.parse(decrypted);
    const isMatch = JSON.stringify(decryptedData) === JSON.stringify(originalData);
    
    addTestResult(
      '数据解密功能测试',
      isMatch ? 'PASSED' : 'FAILED',
      {
        decryptionTime: `${decryptionTime}ms`,
        dataMatch: isMatch,
        decryptedDataSize: decrypted.length
      },
      isMatch ? null : new Error('解密后的数据与原始数据不匹配')
    );
    
    logger.info(`数据解密测试: ${isMatch ? '通过' : '失败'} (${decryptionTime}ms)`);
  } catch (error) {
    addTestResult('数据解密功能测试', 'FAILED', {}, error);
    logger.error('数据解密测试失败:', error.message);
  }
}

// 测试4: 数据读取功能测试
async function testDataReading() {
  logger.info('开始测试数据读取功能...');
  
  try {
    // 测试API健康检查
    const healthResponse = await axios.get(`${TEST_CONFIG.baseUrl}/health`, {
      timeout: 5000
    });
    
    const isHealthy = healthResponse.status === 200 && healthResponse.data.status === 'ok';
    
    addTestResult(
      'API健康检查',
      isHealthy ? 'PASSED' : 'FAILED',
      {
        statusCode: healthResponse.status,
        response: healthResponse.data
      },
      isHealthy ? null : new Error('API健康检查失败')
    );
    
    logger.info(`API健康检查: ${isHealthy ? '通过' : '失败'}`);
    
    // 测试自动采集配置读取
    try {
      const configResponse = await axios.get(`${TEST_CONFIG.baseUrl}/api/auto-collection/config`, {
        timeout: 5000
      });
      
      const hasConfig = configResponse.status === 200 && configResponse.data.data;
      
      addTestResult(
        '自动采集配置读取',
        hasConfig ? 'PASSED' : 'FAILED',
        {
          statusCode: configResponse.status,
          hasData: !!configResponse.data.data,
          configKeys: hasConfig ? Object.keys(configResponse.data.data) : []
        },
        hasConfig ? null : new Error('无法读取配置')
      );
      
      logger.info(`自动采集配置读取: ${hasConfig ? '通过' : '失败'}`);
    } catch (error) {
      addTestResult('自动采集配置读取', 'FAILED', {}, error);
      logger.error('自动采集配置读取失败:', error.message);
    }
    
  } catch (error) {
    addTestResult('API健康检查', 'FAILED', {}, error);
    logger.error('API健康检查失败:', error.message);
  }
}

// 测试5: 敏感数据掩码测试
async function testDataMasking() {
  logger.info('开始测试敏感数据掩码功能...');
  
  const { dataMasking } = require('../config/security');
  
  const testCases = [
    { type: 'idCard', value: '110101199001011234', expected: '1101****1234' },
    { type: 'bankCard', value: '6222021234567890123', expected: '6222 **** **** 0123' },
    { type: 'phone', value: '13800138000', expected: '138****8000' },
    { type: 'email', value: 'test@example.com', expected: 'te***@example.com' }
  ];
  
  for (const testCase of testCases) {
    try {
      const masked = dataMasking[testCase.type](testCase.value);
      const isCorrect = masked === testCase.expected;
      
      addTestResult(
        `敏感数据掩码 - ${testCase.type}`,
        isCorrect ? 'PASSED' : 'FAILED',
        {
          original: testCase.value,
          masked: masked,
          expected: testCase.expected
        },
        isCorrect ? null : new Error(`掩码结果不匹配: ${masked} !== ${testCase.expected}`)
      );
      
      logger.info(`敏感数据掩码 ${testCase.type}: ${isCorrect ? '通过' : '失败'}`);
    } catch (error) {
      addTestResult(`敏感数据掩码 - ${testCase.type}`, 'FAILED', { original: testCase.value }, error);
      logger.error(`敏感数据掩码 ${testCase.type} 失败:`, error.message);
    }
  }
}

// 测试6: 安全令牌生成测试
async function testSecureTokenGeneration() {
  logger.info('开始测试安全令牌生成功能...');
  
  try {
    const tokens = [];
    for (let i = 0; i < 5; i++) {
      const token = securityUtils.generateSecureToken();
      tokens.push(token);
    }
    
    // 检查令牌唯一性
    const uniqueTokens = new Set(tokens);
    const allUnique = uniqueTokens.size === tokens.length;
    
    // 检查令牌长度
    const correctLength = tokens.every(token => token.length === 64); // 32字节 = 64个十六进制字符
    
    const success = allUnique && correctLength;
    
    addTestResult(
      '安全令牌生成',
      success ? 'PASSED' : 'FAILED',
      {
        generatedCount: tokens.length,
        uniqueCount: uniqueTokens.size,
        allUnique,
        correctLength,
        sampleToken: tokens[0].substring(0, 16) + '...'
      },
      success ? null : new Error('令牌生成存在问题')
    );
    
    logger.info(`安全令牌生成: ${success ? '通过' : '失败'}`);
  } catch (error) {
    addTestResult('安全令牌生成', 'FAILED', {}, error);
    logger.error('安全令牌生成测试失败:', error.message);
  }
}

// 生成测试报告
function generateTestReport() {
  logger.info('='.repeat(60));
  logger.info('测试报告生成中...');
  logger.info('='.repeat(60));
  
  const report = {
    ...testResults,
    summary: {
      ...testResults.summary,
      passRate: ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2) + '%'
    }
  };
  
  // 按状态分组
  const passedTests = testResults.tests.filter(t => t.status === 'PASSED');
  const failedTests = testResults.tests.filter(t => t.status === 'FAILED');
  
  logger.info(`\n总测试数: ${report.summary.total}`);
  logger.info(`通过: ${report.summary.passed}`);
  logger.info(`失败: ${report.summary.failed}`);
  logger.info(`通过率: ${report.summary.passRate}`);
  
  if (failedTests.length > 0) {
    logger.info('\n失败的测试:');
    failedTests.forEach(test => {
      logger.info(`  ❌ ${test.name}: ${test.error || '未知错误'}`);
    });
  }
  
  logger.info('\n通过的测试:');
  passedTests.forEach(test => {
    logger.info(`  ✅ ${test.name}`);
  });
  
  // 保存测试报告
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, '..', 'logs', `test-report-${Date.now()}.json`);
  
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    logger.info(`\n测试报告已保存到: ${reportPath}`);
  } catch (error) {
    logger.error('保存测试报告失败:', error.message);
  }
  
  return report;
}

// 主测试函数
async function runAllTests() {
  logger.info('='.repeat(60));
  logger.info('茶海虾王@金融交易所看板平台 - 数据接入测试');
  logger.info('='.repeat(60));
  
  try {
    // 1. 测试网站连接
    await testWebsiteConnection();
    
    // 2. 测试数据加密
    const encryptionResult = await testEncryption();
    
    // 3. 测试数据解密
    if (encryptionResult) {
      await testDecryption(
        encryptionResult.encrypted,
        encryptionResult.key,
        encryptionResult.originalData
      );
    }
    
    // 4. 测试数据读取
    await testDataReading();
    
    // 5. 测试敏感数据掩码
    await testDataMasking();
    
    // 6. 测试安全令牌生成
    await testSecureTokenGeneration();
    
    // 生成测试报告
    const report = generateTestReport();
    
    logger.info('='.repeat(60));
    logger.info('测试完成');
    logger.info('='.repeat(60));
    
    return report;
  } catch (error) {
    logger.error('测试执行失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runAllTests()
    .then(report => {
      console.log('\n测试执行完成');
      process.exit(report.summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('测试执行失败:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests, testResults };
