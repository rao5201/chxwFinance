// 加载环境变量
require('dotenv').config();

const { alertManager, init } = require('../config/alert-channels');
const { logger } = require('../config/logger');

// 测试邮件发送功能
async function testEmail() {
  console.log('='.repeat(60));
  console.log('📧 邮件配置测试工具');
  console.log('='.repeat(60));
  
  try {
    // 初始化告警渠道
    console.log('🔧 初始化告警渠道...');
    init();
    console.log('✅ 初始化完成');
    
    // 测试邮件发送
    console.log('\n🧪 测试邮件发送...');
    
    const testAlert = {
      title: '测试邮件',
      message: '这是一封测试邮件，用于验证邮件配置是否正确。',
      severity: 'info',
      timestamp: Date.now(),
      data: {
        test: true,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('发送测试邮件...');
    console.log(`目标邮箱: ${process.env.ALERT_EMAIL_TO}`);
    console.log(`发件人: ${process.env.ALERT_EMAIL_FROM}`);
    
    const result = await alertManager.sendAlert(testAlert);
    
    console.log('\n📊 发送结果:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.email && result.email.success) {
      console.log('\n✅ 邮件发送成功!');
      console.log(`邮件ID: ${result.email.messageId}`);
      console.log('请检查您的邮箱是否收到测试邮件。');
    } else {
      console.log('\n❌ 邮件发送失败!');
      console.log(`错误: ${result.email?.error || '未知错误'}`);
      console.log('请检查SMTP配置是否正确。');
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('测试完成');
  console.log('='.repeat(60));
}

// 运行测试
testEmail().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});