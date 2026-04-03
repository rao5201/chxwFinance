// 加载环境变量
require('dotenv').config();

const nodemailer = require('nodemailer');

// 简单的邮件测试
async function testEmail() {
  console.log('='.repeat(60));
  console.log('📧 简单邮件测试');
  console.log('='.repeat(60));
  
  try {
    // 显示配置信息
    console.log('🔧 配置信息:');
    console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
    console.log(`SMTP_PORT: ${process.env.SMTP_PORT}`);
    console.log(`SMTP_SECURE: ${process.env.SMTP_SECURE}`);
    console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
    console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? '***' : '未设置'}`);
    console.log(`ALERT_EMAIL_FROM: ${process.env.ALERT_EMAIL_FROM}`);
    console.log(`ALERT_EMAIL_TO: ${process.env.ALERT_EMAIL_TO}`);
    
    // 检查nodemailer
    console.log('\n🔍 检查nodemailer:');
    console.log(`nodemailer版本: ${require('nodemailer/package.json').version}`);
    console.log(`createTransport方法存在: ${typeof nodemailer.createTransport === 'function'}`);
    
    // 测试创建 transporter
    console.log('\n🧪 测试创建transporter...');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    console.log('✅ Transporter创建成功!');
    
    // 测试连接
    console.log('\n🧪 测试连接...');
    await transporter.verify();
    console.log('✅ 连接测试成功!');
    
    // 测试邮件发送
    console.log('\n🧪 测试邮件发送...');
    
    const info = await transporter.sendMail({
      from: process.env.ALERT_EMAIL_FROM,
      to: process.env.ALERT_EMAIL_TO,
      subject: '测试邮件',
      text: '这是一封测试邮件，用于验证邮件配置是否正确。',
      html: '<h1>测试邮件</h1><p>这是一封测试邮件，用于验证邮件配置是否正确。</p>'
    });
    
    console.log('✅ 邮件发送成功!');
    console.log(`邮件ID: ${info.messageId}`);
    console.log('请检查您的邮箱是否收到测试邮件。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.log('\n💡 可能的解决方案:');
    console.log('1. 检查SMTP配置是否正确');
    console.log('2. 确保邮箱开启了SMTP服务');
    console.log('3. 检查网络连接');
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