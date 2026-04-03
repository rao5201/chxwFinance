// 加载环境变量
require('dotenv').config();

// 检查nodemailer模块结构
const nodemailer = require('nodemailer');

console.log('='.repeat(60));
console.log('🔍 检查nodemailer模块');
console.log('='.repeat(60));

console.log('nodemailer:', nodemailer);
console.log('typeof nodemailer:', typeof nodemailer);

// 检查模块的所有属性
console.log('\n模块属性:');
for (const key in nodemailer) {
  if (typeof nodemailer[key] === 'function') {
    console.log(`  ${key}: function`);
  } else {
    console.log(`  ${key}: ${typeof nodemailer[key]}`);
  }
}

// 尝试直接使用nodemailer
console.log('\n🧪 尝试直接使用nodemailer...');
try {
  // 对于较旧版本的nodemailer，可能需要直接使用
  const transporter = nodemailer({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  console.log('✅ 直接使用nodemailer创建transporter成功!');
  
  // 测试连接
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ 连接测试失败:', error);
    } else {
      console.log('✅ 连接测试成功!');
    }
  });
  
} catch (error) {
  console.error('❌ 直接使用nodemailer失败:', error);
}

console.log('\n' + '='.repeat(60));
console.log('检查完成');
console.log('='.repeat(60));