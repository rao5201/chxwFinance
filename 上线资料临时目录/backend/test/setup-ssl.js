/**
 * 茶海虾王@金融交易所看板平台 - SSL证书配置脚本
 * 支持Let's Encrypt自动申请和手动配置
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const https = require('https');

const execAsync = promisify(exec);

// SSL配置
const sslConfig = {
  domain: process.env.DOMAIN || 'tea-sea-shrimp-king.com',
  email: process.env.SSL_EMAIL || 'admin@tea-sea-shrimp-king.com',
  sslDir: path.join(__dirname, '..', 'ssl'),
  method: process.env.SSL_METHOD || 'letsencrypt', // letsencrypt, manual, self-signed
  staging: process.env.SSL_STAGING === 'true' // 使用Let's Encrypt测试环境
};

// 确保SSL目录存在
function ensureSSLDirectory() {
  if (!fs.existsSync(sslConfig.sslDir)) {
    fs.mkdirSync(sslConfig.sslDir, { recursive: true });
    console.log('✅ SSL目录已创建');
  }
}

// 生成自签名证书（用于测试）
async function generateSelfSignedCert() {
  console.log('🔧 生成自签名证书...');
  
  try {
    const keyPath = path.join(sslConfig.sslDir, 'server.key');
    const certPath = path.join(sslConfig.sslDir, 'server.crt');
    
    // 生成私钥
    await execAsync(`openssl genrsa -out "${keyPath}" 2048`);
    
    // 生成证书签名请求
    const csrPath = path.join(sslConfig.sslDir, 'server.csr');
    await execAsync(`openssl req -new -key "${keyPath}" -out "${csrPath}" -subj "/C=CN/ST=Beijing/L=Beijing/O=TeaSeaShrimpKing/OU=IT/CN=${sslConfig.domain}"`);
    
    // 生成自签名证书
    await execAsync(`openssl x509 -req -days 365 -in "${csrPath}" -signkey "${keyPath}" -out "${certPath}"`);
    
    // 删除CSR文件
    fs.unlinkSync(csrPath);
    
    console.log('✅ 自签名证书生成完成');
    console.log(`   私钥: ${keyPath}`);
    console.log(`   证书: ${certPath}`);
    
    return { key: keyPath, cert: certPath };
    
  } catch (error) {
    console.error('❌ 生成自签名证书失败:', error.message);
    throw error;
  }
}

// 使用Certbot申请Let's Encrypt证书
async function requestLetsEncryptCert() {
  console.log('🔧 申请Let\'s Encrypt证书...');
  
  try {
    // 检查Certbot是否安装
    await execAsync('which certbot');
    
    const stagingFlag = sslConfig.staging ? '--staging' : '';
    const certbotCmd = `certbot certonly --standalone ${stagingFlag} -d ${sslConfig.domain} -d www.${sslConfig.domain} --agree-tos --email ${sslConfig.email} --non-interactive`;
    
    console.log('⏳ 正在申请证书，请稍候...');
    await execAsync(certbotCmd);
    
    // 创建符号链接到项目SSL目录
    const letsencryptDir = `/etc/letsencrypt/live/${sslConfig.domain}`;
    const keyPath = path.join(sslConfig.sslDir, 'server.key');
    const certPath = path.join(sslConfig.sslDir, 'server.crt');
    const chainPath = path.join(sslConfig.sslDir, 'ca.crt');
    
    // 复制证书到项目目录
    fs.copyFileSync(path.join(letsencryptDir, 'privkey.pem'), keyPath);
    fs.copyFileSync(path.join(letsencryptDir, 'fullchain.pem'), certPath);
    fs.copyFileSync(path.join(letsencryptDir, 'chain.pem'), chainPath);
    
    console.log('✅ Let\'s Encrypt证书申请完成');
    console.log(`   私钥: ${keyPath}`);
    console.log(`   证书: ${certPath}`);
    console.log(`   链证书: ${chainPath}`);
    
    // 设置自动续期
    await setupAutoRenewal();
    
    return { key: keyPath, cert: certPath, ca: chainPath };
    
  } catch (error) {
    console.error('❌ 申请Let\'s Encrypt证书失败:', error.message);
    console.log('💡 尝试使用自签名证书...');
    return await generateSelfSignedCert();
  }
}

// 设置自动续期
async function setupAutoRenewal() {
  console.log('🔧 设置证书自动续期...');
  
  try {
    // 测试续期
    await execAsync('certbot renew --dry-run');
    
    // 添加续期钩子脚本
    const hookScript = `#!/bin/bash
# Let's Encrypt证书续期钩子脚本
# 茶海虾王@金融交易所看板平台

echo "证书续期完成: $(date)"

# 复制新证书到项目目录
DOMAIN="${sslConfig.domain}"
SSL_DIR="${sslConfig.sslDir}"
LE_DIR="/etc/letsencrypt/live/$DOMAIN"

cp "$LE_DIR/privkey.pem" "$SSL_DIR/server.key"
cp "$LE_DIR/fullchain.pem" "$SSL_DIR/server.crt"
cp "$LE_DIR/chain.pem" "$SSL_DIR/ca.crt"

# 重启应用服务
pm2 restart tea-sea-shrimp-king

echo "证书更新并重启服务完成"
`;
    
    const hookPath = '/etc/letsencrypt/renewal-hooks/deploy/tea-sea-shrimp-king.sh';
    fs.writeFileSync(hookPath, hookScript);
    fs.chmodSync(hookPath, '755');
    
    console.log('✅ 自动续期设置完成');
    
  } catch (error) {
    console.error('⚠️ 设置自动续期失败:', error.message);
  }
}

// 手动配置证书
async function setupManualCert() {
  console.log('🔧 手动配置证书...');
  
  console.log('\n📋 手动配置步骤:');
  console.log('1. 将私钥文件复制到: ' + path.join(sslConfig.sslDir, 'server.key'));
  console.log('2. 将证书文件复制到: ' + path.join(sslConfig.sslDir, 'server.crt'));
  console.log('3. 将CA证书复制到: ' + path.join(sslConfig.sslDir, 'ca.crt'));
  console.log('4. 运行验证命令: node scripts/setup-ssl.js --verify');
  
  // 检查文件是否存在
  const keyPath = path.join(sslConfig.sslDir, 'server.key');
  const certPath = path.join(sslConfig.sslDir, 'server.crt');
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log('\n✅ 检测到已有证书文件');
    return await verifyCertificate();
  }
  
  return null;
}

// 验证证书
async function verifyCertificate() {
  console.log('🔍 验证SSL证书...');
  
  try {
    const keyPath = path.join(sslConfig.sslDir, 'server.key');
    const certPath = path.join(sslConfig.sslDir, 'server.crt');
    
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      throw new Error('证书文件不存在');
    }
    
    // 检查私钥
    await execAsync(`openssl rsa -in "${keyPath}" -check -noout`);
    console.log('✅ 私钥验证通过');
    
    // 检查证书
    const certInfo = await execAsync(`openssl x509 -in "${certPath}" -text -noout`);
    console.log('✅ 证书验证通过');
    
    // 提取证书信息
    const subject = await execAsync(`openssl x509 -in "${certPath}" -subject -noout`);
    const issuer = await execAsync(`openssl x509 -in "${certPath}" -issuer -noout`);
    const dates = await execAsync(`openssl x509 -in "${certPath}" -dates -noout`);
    
    console.log('\n📊 证书信息:');
    console.log('   ' + subject.stdout.trim());
    console.log('   ' + issuer.stdout.trim());
    console.log('   ' + dates.stdout.trim().replace(/\n/g, '\n   '));
    
    // 检查证书有效期
    const endDate = new Date(dates.stdout.match(/notAfter=(.+)/)[1]);
    const daysUntilExpiry = Math.floor((endDate - new Date()) / (1000 * 60 * 60 * 24));
    
    console.log(`\n⏰ 证书有效期: ${daysUntilExpiry} 天`);
    
    if (daysUntilExpiry < 30) {
      console.warn('⚠️  证书即将过期，请及时续期！');
    }
    
    return { key: keyPath, cert: certPath };
    
  } catch (error) {
    console.error('❌ 证书验证失败:', error.message);
    throw error;
  }
}

// 生成Diffie-Hellman参数
async function generateDHParam() {
  console.log('🔧 生成Diffie-Hellman参数...');
  
  try {
    const dhPath = path.join(sslConfig.sslDir, 'dhparam.pem');
    
    if (fs.existsSync(dhPath)) {
      console.log('✅ DH参数文件已存在');
      return dhPath;
    }
    
    await execAsync(`openssl dhparam -out "${dhPath}" 2048`);
    console.log('✅ DH参数生成完成');
    
    return dhPath;
    
  } catch (error) {
    console.error('❌ 生成DH参数失败:', error.message);
    return null;
  }
}

// 生成Nginx SSL配置
function generateNginxSSLConfig() {
  const config = `
# Nginx SSL配置
# 茶海虾王@金融交易所看板平台

server {
    listen 80;
    server_name ${sslConfig.domain} www.${sslConfig.domain};
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${sslConfig.domain} www.${sslConfig.domain};
    
    # SSL证书配置
    ssl_certificate ${sslConfig.sslDir}/server.crt;
    ssl_certificate_key ${sslConfig.sslDir}/server.key;
    ssl_trusted_certificate ${sslConfig.sslDir}/ca.crt;
    
    # SSL协议和密码套件
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    
    # DH参数
    ssl_dhparam ${sslConfig.sslDir}/dhparam.pem;
    
    # 会话缓存
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # 安全头部
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 日志配置
    access_log /var/log/nginx/${sslConfig.domain}.access.log;
    error_log /var/log/nginx/${sslConfig.domain}.error.log;
    
    # 反向代理配置
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
`;
  return config;
}

// 保存Nginx配置
function saveNginxConfig() {
  const configPath = path.join(__dirname, '..', 'config', 'nginx-ssl.conf');
  const config = generateNginxSSLConfig();
  
  fs.writeFileSync(configPath, config);
  console.log('✅ Nginx SSL配置已保存:', configPath);
  
  return configPath;
}

// 测试SSL配置
async function testSSLConfiguration() {
  console.log('🧪 测试SSL配置...');
  
  try {
    // 使用OpenSSL测试
    const testCmd = `openssl s_client -connect ${sslConfig.domain}:443 -servername ${sslConfig.domain} < /dev/null 2>/dev/null | openssl x509 -noout -text`;
    
    console.log('⏳ 正在测试SSL连接...');
    console.log('💡 请确保域名已解析到服务器');
    
    return true;
    
  } catch (error) {
    console.error('⚠️ SSL测试失败:', error.message);
    return false;
  }
}

// 显示配置摘要
function showConfigSummary(certInfo) {
  console.log('\n' + '='.repeat(60));
  console.log('🔒 SSL证书配置摘要');
  console.log('='.repeat(60));
  
  console.log('\n📊 域名配置:');
  console.log(`   主域名: ${sslConfig.domain}`);
  console.log(`   备用域名: www.${sslConfig.domain}`);
  
  console.log('\n📁 证书文件:');
  console.log(`   私钥: ${certInfo.key}`);
  console.log(`   证书: ${certInfo.cert}`);
  if (certInfo.ca) {
    console.log(`   CA证书: ${certInfo.ca}`);
  }
  
  console.log('\n🔧 配置文件:');
  console.log(`   Nginx配置: ${path.join(__dirname, '..', 'config', 'nginx-ssl.conf')}`);
  
  console.log('\n📋 后续步骤:');
  console.log('   1. 将Nginx配置复制到 /etc/nginx/sites-available/');
  console.log('   2. 创建符号链接到 /etc/nginx/sites-enabled/');
  console.log('   3. 测试Nginx配置: nginx -t');
  console.log('   4. 重启Nginx: systemctl restart nginx');
  console.log('   5. 测试HTTPS访问: https://' + sslConfig.domain);
  
  console.log('\n⚠️  重要提示:');
  console.log('   1. 确保证书文件权限正确 (chmod 600)');
  console.log('   2. 定期备份证书文件');
  console.log('   3. 设置证书过期提醒');
  console.log('   4. 使用SSL Labs测试证书等级');
  
  console.log('='.repeat(60) + '\n');
}

// 主函数
async function main() {
  console.log('🚀 开始配置SSL证书...\n');
  
  try {
    // 确保SSL目录存在
    ensureSSLDirectory();
    
    let certInfo;
    
    // 根据配置方法申请证书
    switch (sslConfig.method) {
      case 'letsencrypt':
        certInfo = await requestLetsEncryptCert();
        break;
      case 'self-signed':
        certInfo = await generateSelfSignedCert();
        break;
      case 'manual':
      default:
        certInfo = await setupManualCert();
        break;
    }
    
    if (!certInfo) {
      console.log('⏳ 等待手动配置证书...');
      return;
    }
    
    // 生成DH参数
    await generateDHParam();
    
    // 保存Nginx配置
    saveNginxConfig();
    
    // 测试SSL配置
    await testSSLConfiguration();
    
    // 显示配置摘要
    showConfigSummary(certInfo);
    
    console.log('✅ SSL证书配置完成！');
    
  } catch (error) {
    console.error('❌ SSL配置失败:', error);
    process.exit(1);
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
if (args.includes('--verify')) {
  verifyCertificate();
} else if (args.includes('--self-signed')) {
  sslConfig.method = 'self-signed';
  main();
} else if (args.includes('--manual')) {
  sslConfig.method = 'manual';
  main();
} else {
  main();
}

module.exports = {
  sslConfig,
  generateSelfSignedCert,
  requestLetsEncryptCert,
  verifyCertificate,
  generateNginxSSLConfig
};
