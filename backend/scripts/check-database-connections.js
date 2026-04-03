/**
 * 数据库连接检查脚本
 * 检查所有数据库连接情况，包括内存数据库、Redis、MongoDB等
 */

const fs = require('fs');
const path = require('path');

// 加载数据库配置
const { checkDatabaseStatus } = require('../config/database');
const { checkRedisStatus } = require('../config/redis');

// 检查数据库连接
async function checkDatabaseConnections() {
  console.log('🔍 开始检查数据库连接...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    connections: {
      memoryDatabase: {},
      redis: {},
      mongodb: {},
      externalServices: {}
    },
    issues: [],
    recommendations: []
  };
  
  // 检查内存数据库
  console.log('📦 检查内存数据库...');
  try {
    const memoryDbStatus = checkDatabaseStatus();
    results.connections.memoryDatabase = {
      status: 'connected',
      details: memoryDbStatus
    };
    console.log('✅ 内存数据库连接正常');
    console.log(`   - 集合数: ${Object.keys(memoryDbStatus.collections).length}`);
    console.log(`   - 用户数: ${memoryDbStatus.collections.users}`);
    console.log(`   - 资产数: ${memoryDbStatus.collections.assets}`);
  } catch (error) {
    console.error('❌ 内存数据库检查失败:', error.message);
    results.connections.memoryDatabase = {
      status: 'error',
      error: error.message
    };
    results.issues.push('内存数据库连接失败');
  }
  
  console.log('');
  
  // 检查Redis
  console.log('🔄 检查Redis...');
  try {
    const redisStatus = checkRedisStatus();
    results.connections.redis = {
      status: 'connected',
      details: redisStatus
    };
    console.log('✅ Redis连接正常');
    console.log(`   - 缓存键数: ${redisStatus.keys}`);
  } catch (error) {
    console.error('❌ Redis检查失败:', error.message);
    results.connections.redis = {
      status: 'error',
      error: error.message
    };
    results.issues.push('Redis连接失败');
  }
  
  console.log('');
  
  // 检查MongoDB配置
  console.log('🍃 检查MongoDB配置...');
  try {
    // 检查是否有MongoDB配置文件
    const mongoConfigPath = path.join(__dirname, '..', 'config', 'mongodb.js');
    if (fs.existsSync(mongoConfigPath)) {
      const mongodbConfig = require(mongoConfigPath);
      results.connections.mongodb = {
        status: 'configured',
        details: {
          host: mongodbConfig.host || 'localhost',
          port: mongodbConfig.port || 27017,
          database: mongodbConfig.database || 'chxw_finance'
        }
      };
      console.log('✅ MongoDB配置已存在');
    } else {
      results.connections.mongodb = {
        status: 'not_configured',
        message: 'MongoDB配置文件不存在，使用内存数据库作为临时解决方案'
      };
      console.log('⚠️ MongoDB配置文件不存在，使用内存数据库作为临时解决方案');
      results.recommendations.push('建议创建MongoDB配置文件，以便在生产环境中使用真实的MongoDB数据库');
    }
  } catch (error) {
    console.error('❌ MongoDB配置检查失败:', error.message);
    results.connections.mongodb = {
      status: 'error',
      error: error.message
    };
    results.issues.push('MongoDB配置检查失败');
  }
  
  console.log('');
  
  // 检查外部服务连接
  console.log('🌐 检查外部服务连接...');
  try {
    // 检查第三方账号配置
    const thirdPartyAccountsPath = path.join(__dirname, '..', '..', 'third-party-accounts', 'third-party-accounts.json');
    if (fs.existsSync(thirdPartyAccountsPath)) {
      const thirdPartyAccounts = JSON.parse(fs.readFileSync(thirdPartyAccountsPath, 'utf8'));
      results.connections.externalServices = {
        status: 'configured',
        services: Object.keys(thirdPartyAccounts).length
      };
      console.log('✅ 外部服务配置已存在');
      console.log(`   - 配置的服务数: ${Object.keys(thirdPartyAccounts).length}`);
    } else {
      results.connections.externalServices = {
        status: 'not_configured',
        message: '第三方账号配置文件不存在'
      };
      console.log('⚠️ 第三方账号配置文件不存在');
      results.recommendations.push('建议创建第三方账号配置文件，以便连接外部服务');
    }
  } catch (error) {
    console.error('❌ 外部服务配置检查失败:', error.message);
    results.connections.externalServices = {
      status: 'error',
      error: error.message
    };
    results.issues.push('外部服务配置检查失败');
  }
  
  console.log('');
  
  // 生成检查报告
  console.log('📋 数据库连接检查报告');
  console.log('='.repeat(60));
  console.log(`检查时间: ${results.timestamp}`);
  console.log(`总检查项: 4`);
  console.log(`正常项: ${Object.values(results.connections).filter(c => c.status === 'connected' || c.status === 'configured').length}`);
  console.log(`警告项: ${Object.values(results.connections).filter(c => c.status === 'not_configured').length}`);
  console.log(`错误项: ${Object.values(results.connections).filter(c => c.status === 'error').length}`);
  
  if (results.issues.length > 0) {
    console.log('\n⚠️ 发现的问题:');
    results.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  if (results.recommendations.length > 0) {
    console.log('\n💡 建议:');
    results.recommendations.forEach((recommendation, index) => {
      console.log(`${index + 1}. ${recommendation}`);
    });
  }
  
  console.log('='.repeat(60));
  
  // 保存检查报告
  const reportDir = path.join(__dirname, '..', '..', 'logs');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFile = path.join(reportDir, `database-connection-check-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
  console.log(`\n✅ 检查报告已保存到: ${reportFile}`);
  
  return results;
}

// 运行检查
if (require.main === module) {
  checkDatabaseConnections().then(results => {
    console.log('\n✅ 数据库连接检查完成');
  }).catch(error => {
    console.error('❌ 检查过程中出现错误:', error);
  });
}

module.exports = { checkDatabaseConnections };
