/**
 * 茶海虾王@金融交易所看板平台 - HTTPS配置
 * 包含SSL/TLS证书配置和HTTPS服务器设置
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// SSL证书配置
const sslConfig = {
  // 证书路径配置
  paths: {
    cert: process.env.SSL_CERT_PATH || path.join(__dirname, '..', 'ssl', 'server.crt'),
    key: process.env.SSL_KEY_PATH || path.join(__dirname, '..', 'ssl', 'server.key'),
    ca: process.env.SSL_CA_PATH || path.join(__dirname, '..', 'ssl', 'ca.crt'),
    dhparam: process.env.SSL_DHPARAM_PATH || path.join(__dirname, '..', 'ssl', 'dhparam.pem')
  },
  
  // SSL/TLS协议配置
  protocol: {
    // 最小TLS版本
    minVersion: 'TLSv1.2',
    // 最大TLS版本
    maxVersion: 'TLSv1.3',
    // 密码套件
    ciphers: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-SHA384',
      'ECDHE-RSA-AES128-SHA256',
      'DHE-RSA-AES256-GCM-SHA384',
      'DHE-RSA-AES128-GCM-SHA256'
    ].join(':'),
    // 优先使用服务器密码套件
    honorCipherOrder: true,
    // 启用压缩（不推荐，可能引发CRIME攻击）
    requestCert: false,
    // 拒绝未授权证书
    rejectUnauthorized: true
  },
  
  // HTTP严格传输安全（HSTS）
  hsts: {
    enabled: true,
    maxAge: 31536000, // 1年
    includeSubDomains: true,
    preload: true
  },
  
  // 证书固定（HPKP）
  hpkp: {
    enabled: false, // 谨慎使用，可能导致用户无法访问
    maxAge: 2592000, // 30天
    sha256s: [], // 证书指纹列表
    includeSubDomains: true,
    reportUri: '/hpkp-report'
  },
  
  // OCSP Stapling
  ocspStapling: {
    enabled: true,
    // OCSP响应缓存时间
    cacheMaxAge: 3600000 // 1小时
  }
};

// 证书管理
const certificateManager = {
  // 加载证书
  loadCertificates: () => {
    try {
      const cert = fs.readFileSync(sslConfig.paths.cert);
      const key = fs.readFileSync(sslConfig.paths.key);
      const ca = fs.existsSync(sslConfig.paths.ca) ? fs.readFileSync(sslConfig.paths.ca) : undefined;
      const dhparam = fs.existsSync(sslConfig.paths.dhparam) ? fs.readFileSync(sslConfig.paths.dhparam) : undefined;
      
      return {
        cert,
        key,
        ca,
        dhparam
      };
    } catch (error) {
      console.error('加载SSL证书失败:', error.message);
      return null;
    }
  },
  
  // 检查证书有效期
  checkCertificateValidity: () => {
    try {
      const cert = fs.readFileSync(sslConfig.paths.cert);
      const { valid_from, valid_to } = new (require('crypto').X509Certificate)(cert);
      
      const now = new Date();
      const validFrom = new Date(valid_from);
      const validTo = new Date(valid_to);
      
      const daysUntilExpiry = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
      
      return {
        valid: now >= validFrom && now <= validTo,
        validFrom,
        validTo,
        daysUntilExpiry,
        needsRenewal: daysUntilExpiry <= 30 // 30天内需要续期
      };
    } catch (error) {
      console.error('检查证书有效期失败:', error.message);
      return null;
    }
  },
  
  // 证书续期提醒
  scheduleRenewalReminder: () => {
    const validity = certificateManager.checkCertificateValidity();
    if (validity && validity.needsRenewal) {
      console.warn(`⚠️ SSL证书将在 ${validity.daysUntilExpiry} 天后过期，请及时续期！`);
    }
  }
};

// HTTPS服务器配置
const httpsServerConfig = {
  // 创建HTTPS服务器
  createServer: (app) => {
    const certificates = certificateManager.loadCertificates();
    
    if (!certificates) {
      console.error('❌ 无法加载SSL证书，HTTPS服务器启动失败');
      return null;
    }
    
    const options = {
      cert: certificates.cert,
      key: certificates.key,
      ca: certificates.ca,
      dhparam: certificates.dhparam,
      minVersion: sslConfig.protocol.minVersion,
      maxVersion: sslConfig.protocol.maxVersion,
      ciphers: sslConfig.protocol.ciphers,
      honorCipherOrder: sslConfig.protocol.honorCipherOrder,
      requestCert: sslConfig.protocol.requestCert,
      rejectUnauthorized: sslConfig.protocol.rejectUnauthorized
    };
    
    return https.createServer(options, app);
  },
  
  // 启动HTTPS服务器
  startServer: (server, port) => {
    return new Promise((resolve, reject) => {
      server.listen(port, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ HTTPS服务器运行在端口 ${port}`);
          certificateManager.scheduleRenewalReminder();
          resolve(server);
        }
      });
    });
  }
};

// HTTP到HTTPS重定向
const httpRedirect = {
  // 创建HTTP重定向服务器
  createRedirectServer: (httpPort, httpsPort) => {
    const http = require('http');
    
    return http.createServer((req, res) => {
      const host = req.headers.host.split(':')[0];
      const redirectUrl = `https://${host}:${httpsPort}${req.url}`;
      
      res.writeHead(301, { Location: redirectUrl });
      res.end();
    });
  },
  
  // 启动重定向服务器
  startRedirectServer: (server, port) => {
    return new Promise((resolve, reject) => {
      server.listen(port, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ HTTP重定向服务器运行在端口 ${port}`);
          resolve(server);
        }
      });
    });
  }
};

// 安全头部配置
const securityHeaders = {
  // 严格传输安全
  hsts: () => {
    if (sslConfig.hsts.enabled) {
      const value = `max-age=${sslConfig.hsts.maxAge}` +
        (sslConfig.hsts.includeSubDomains ? '; includeSubDomains' : '') +
        (sslConfig.hsts.preload ? '; preload' : '');
      return { 'Strict-Transport-Security': value };
    }
    return {};
  },
  
  // 内容安全策略
  csp: () => {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' https: data:",
        "connect-src 'self' https:",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    };
  },
  
  // 其他安全头部
  others: () => {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  },
  
  // 获取所有安全头部
  getAll: () => {
    return {
      ...securityHeaders.hsts(),
      ...securityHeaders.csp(),
      ...securityHeaders.others()
    };
  }
};

// SSL测试和诊断
const sslDiagnostics = {
  // 测试SSL配置
  testConfiguration: () => {
    const certificates = certificateManager.loadCertificates();
    const validity = certificateManager.checkCertificateValidity();
    
    return {
      certificatesLoaded: !!certificates,
      certificateValid: validity?.valid || false,
      daysUntilExpiry: validity?.daysUntilExpiry || 0,
      needsRenewal: validity?.needsRenewal || false,
      tlsVersion: sslConfig.protocol.minVersion,
      cipherCount: sslConfig.protocol.ciphers.split(':').length,
      hstsEnabled: sslConfig.hsts.enabled,
      ocspEnabled: sslConfig.ocspStapling.enabled
    };
  },
  
  // 打印诊断报告
  printReport: () => {
    const config = sslDiagnostics.testConfiguration();
    
    console.log('\n🔒 SSL/TLS配置诊断报告');
    console.log('========================');
    console.log(`证书加载状态: ${config.certificatesLoaded ? '✅ 正常' : '❌ 失败'}`);
    console.log(`证书有效性: ${config.certificateValid ? '✅ 有效' : '❌ 无效'}`);
    console.log(`证书过期时间: ${config.daysUntilExpiry} 天`);
    console.log(`需要续期: ${config.needsRenewal ? '⚠️ 是' : '✅ 否'}`);
    console.log(`TLS版本: ${config.tlsVersion}`);
    console.log(`密码套件数量: ${config.cipherCount}`);
    console.log(`HSTS: ${config.hstsEnabled ? '✅ 已启用' : '❌ 未启用'}`);
    console.log(`OCSP Stapling: ${config.ocspEnabled ? '✅ 已启用' : '❌ 未启用'}`);
    console.log('========================\n');
    
    return config;
  }
};

// 中间件：强制HTTPS
const forceHttps = (req, res, next) => {
  if (req.secure) {
    // 添加安全头部
    const headers = securityHeaders.getAll();
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  } else {
    // 重定向到HTTPS
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    res.redirect(301, httpsUrl);
  }
};

module.exports = {
  sslConfig,
  certificateManager,
  httpsServerConfig,
  httpRedirect,
  securityHeaders,
  sslDiagnostics,
  forceHttps
};
