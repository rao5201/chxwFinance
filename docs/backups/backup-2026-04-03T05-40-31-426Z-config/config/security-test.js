/**
 * 茶海虾王@金融交易所看板平台 - 安全测试系统
 * 包含渗透测试、漏洞扫描和安全审计功能
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// 安全测试配置
const securityTestConfig = {
  // 目标配置
  target: {
    host: process.env.TEST_TARGET_HOST || 'localhost',
    port: process.env.TEST_TARGET_PORT || 8080,
    protocol: process.env.TEST_TARGET_PROTOCOL || 'http'
  },
  
  // 测试配置
  test: {
    timeout: 10000,
    maxRedirects: 5,
    userAgent: 'TeaSeaShrimpKing-SecurityTest/1.0'
  },
  
  // 漏洞数据库
  vulnerabilities: {
    // SQL注入测试载荷
    sqlInjection: [
      "' OR '1'='1",
      "' OR '1'='1' --",
      "' OR '1'='1' /*",
      "' OR '1'='1' #",
      "1' AND 1=1 --",
      "1' AND 1=2 --",
      "1' OR '1'='1",
      "1' UNION SELECT NULL--",
      "1' UNION SELECT NULL,NULL--",
      "1' UNION SELECT NULL,NULL,NULL--"
    ],
    
    // XSS测试载荷
    xss: [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert('XSS')>",
      "<svg onload=alert('XSS')>",
      "<iframe src=javascript:alert('XSS')>",
      "<body onload=alert('XSS')>",
      "<input onfocus=alert('XSS') autofocus>",
      "<details open ontoggle=alert('XSS')>",
      "<marquee onstart=alert('XSS')>",
      "<object data=javascript:alert('XSS')>",
      "<embed src=javascript:alert('XSS')>"
    ],
    
    // 路径遍历测试载荷
    pathTraversal: [
      "../../../etc/passwd",
      "../../../etc/hosts",
      "../../../windows/system32/drivers/etc/hosts",
      "....//....//....//etc/passwd",
      "..%2f..%2f..%2fetc%2fpasswd",
      "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
      "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
      "....\\....\\....\\windows\\system32\\drivers\\etc\\hosts"
    ],
    
    // 命令注入测试载荷
    commandInjection: [
      "; ls -la",
      "; cat /etc/passwd",
      "; whoami",
      "; id",
      "| ls -la",
      "| cat /etc/passwd",
      "| whoami",
      "| id",
      "`whoami`",
      "$(whoami)",
      "; dir",
      "; type C:\\Windows\\System32\\drivers\\etc\\hosts",
      "| dir",
      "| type C:\\Windows\\System32\\drivers\\etc\\hosts"
    ],
    
    // 敏感文件路径
    sensitiveFiles: [
      "/.env",
      "/.git/config",
      "/.git/HEAD",
      "/.svn/entries",
      "/.htaccess",
      "/.htpasswd",
      "/config.php",
      "/config.json",
      "/wp-config.php",
      "/admin/",
      "/administrator/",
      "/phpmyadmin/",
      "/api/docs",
      "/swagger-ui.html",
      "/v2/api-docs",
      "/actuator/health",
      "/actuator/info",
      "/actuator/env",
      "/server-status",
      "/.well-known/security.txt"
    ]
  }
};

// HTTP请求工具
const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });
    
    req.on('error', reject);
    req.setTimeout(securityTestConfig.test.timeout, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

// SQL注入测试
const testSQLInjection = async (endpoint, method = 'GET', param = 'id') => {
  console.log(`🔍 测试SQL注入: ${endpoint}`);
  const results = [];
  
  for (const payload of securityTestConfig.vulnerabilities.sqlInjection) {
    try {
      const options = {
        hostname: securityTestConfig.target.host,
        port: securityTestConfig.target.port,
        protocol: securityTestConfig.target.protocol + ':',
        path: method === 'GET' ? `${endpoint}?${param}=${encodeURIComponent(payload)}` : endpoint,
        method: method,
        headers: {
          'User-Agent': securityTestConfig.test.userAgent,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      
      if (method === 'POST') {
        options.body = `${param}=${encodeURIComponent(payload)}`;
      }
      
      const response = await makeRequest(options);
      
      // 检测SQL错误信息
      const sqlErrors = [
        'sql syntax',
        'mysql_fetch',
        'pg_query',
        'sqlite_query',
        'ORA-',
        'SQL Server',
        'ODBC',
        'JDBC'
      ];
      
      const hasError = sqlErrors.some(error => 
        response.body.toLowerCase().includes(error.toLowerCase())
      );
      
      if (hasError || response.statusCode === 500) {
        results.push({
          payload,
          vulnerable: true,
          statusCode: response.statusCode,
          evidence: hasError ? 'SQL error message found' : 'Server error'
        });
      }
    } catch (error) {
      // 请求失败，可能是防护机制
    }
  }
  
  return {
    test: 'SQL Injection',
    endpoint,
    vulnerable: results.length > 0,
    findings: results
  };
};

// XSS测试
const testXSS = async (endpoint, method = 'GET', param = 'search') => {
  console.log(`🔍 测试XSS: ${endpoint}`);
  const results = [];
  
  for (const payload of securityTestConfig.vulnerabilities.xss) {
    try {
      const options = {
        hostname: securityTestConfig.target.host,
        port: securityTestConfig.target.port,
        protocol: securityTestConfig.target.protocol + ':',
        path: method === 'GET' ? `${endpoint}?${param}=${encodeURIComponent(payload)}` : endpoint,
        method: method,
        headers: {
          'User-Agent': securityTestConfig.test.userAgent,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      
      if (method === 'POST') {
        options.body = `${param}=${encodeURIComponent(payload)}`;
      }
      
      const response = await makeRequest(options);
      
      // 检测XSS载荷是否被反射
      if (response.body.includes(payload) || 
          response.body.includes(payload.replace(/[<>]/g, ''))) {
        results.push({
          payload,
          vulnerable: true,
          statusCode: response.statusCode,
          evidence: 'XSS payload reflected in response'
        });
      }
    } catch (error) {
      // 请求失败
    }
  }
  
  return {
    test: 'Cross-Site Scripting (XSS)',
    endpoint,
    vulnerable: results.length > 0,
    findings: results
  };
};

// 路径遍历测试
const testPathTraversal = async (endpoint, param = 'file') => {
  console.log(`🔍 测试路径遍历: ${endpoint}`);
  const results = [];
  
  for (const payload of securityTestConfig.vulnerabilities.pathTraversal) {
    try {
      const options = {
        hostname: securityTestConfig.target.host,
        port: securityTestConfig.target.port,
        protocol: securityTestConfig.target.protocol + ':',
        path: `${endpoint}?${param}=${encodeURIComponent(payload)}`,
        method: 'GET',
        headers: {
          'User-Agent': securityTestConfig.test.userAgent
        }
      };
      
      const response = await makeRequest(options);
      
      // 检测是否读取到系统文件
      const systemFileSignatures = [
        'root:x:',
        'bin:x:',
        'daemon:x:',
        '# Copyright',
        '# localhost',
        '[boot loader]'
      ];
      
      const hasSystemFile = systemFileSignatures.some(signature => 
        response.body.includes(signature)
      );
      
      if (hasSystemFile) {
        results.push({
          payload,
          vulnerable: true,
          statusCode: response.statusCode,
          evidence: 'System file content found in response'
        });
      }
    } catch (error) {
      // 请求失败
    }
  }
  
  return {
    test: 'Path Traversal',
    endpoint,
    vulnerable: results.length > 0,
    findings: results
  };
};

// 命令注入测试
const testCommandInjection = async (endpoint, param = 'host') => {
  console.log(`🔍 测试命令注入: ${endpoint}`);
  const results = [];
  
  for (const payload of securityTestConfig.vulnerabilities.commandInjection) {
    try {
      const options = {
        hostname: securityTestConfig.target.host,
        port: securityTestConfig.target.port,
        protocol: securityTestConfig.target.protocol + ':',
        path: `${endpoint}?${param}=${encodeURIComponent(payload)}`,
        method: 'GET',
        headers: {
          'User-Agent': securityTestConfig.test.userAgent
        }
      };
      
      const response = await makeRequest(options);
      
      // 检测命令执行结果
      const commandSignatures = [
        'root:',
        'bin:',
        'daemon:',
        'administrator',
        'Volume in drive',
        'Directory of'
      ];
      
      const hasCommandOutput = commandSignatures.some(signature => 
        response.body.includes(signature)
      );
      
      if (hasCommandOutput) {
        results.push({
          payload,
          vulnerable: true,
          statusCode: response.statusCode,
          evidence: 'Command output found in response'
        });
      }
    } catch (error) {
      // 请求失败
    }
  }
  
  return {
    test: 'Command Injection',
    endpoint,
    vulnerable: results.length > 0,
    findings: results
  };
};

// 敏感文件暴露测试
const testSensitiveFiles = async () => {
  console.log('🔍 测试敏感文件暴露...');
  const results = [];
  
  for (const file of securityTestConfig.vulnerabilities.sensitiveFiles) {
    try {
      const options = {
        hostname: securityTestConfig.target.host,
        port: securityTestConfig.target.port,
        protocol: securityTestConfig.target.protocol + ':',
        path: file,
        method: 'GET',
        headers: {
          'User-Agent': securityTestConfig.test.userAgent
        }
      };
      
      const response = await makeRequest(options);
      
      if (response.statusCode === 200) {
        results.push({
          file,
          vulnerable: true,
          statusCode: response.statusCode,
          size: response.body.length,
          evidence: 'Sensitive file accessible'
        });
      }
    } catch (error) {
      // 请求失败
    }
  }
  
  return {
    test: 'Sensitive File Exposure',
    vulnerable: results.length > 0,
    findings: results
  };
};

// 安全头部测试
const testSecurityHeaders = async () => {
  console.log('🔍 测试安全头部...');
  
  try {
    const options = {
      hostname: securityTestConfig.target.host,
      port: securityTestConfig.target.port,
      protocol: securityTestConfig.target.protocol + ':',
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': securityTestConfig.test.userAgent
      }
    };
    
    const response = await makeRequest(options);
    const headers = response.headers;
    
    const requiredHeaders = {
      'strict-transport-security': 'HSTS',
      'content-security-policy': 'CSP',
      'x-content-type-options': 'X-Content-Type-Options',
      'x-frame-options': 'X-Frame-Options',
      'x-xss-protection': 'X-XSS-Protection',
      'referrer-policy': 'Referrer-Policy'
    };
    
    const missing = [];
    const present = [];
    
    for (const [header, name] of Object.entries(requiredHeaders)) {
      if (!headers[header]) {
        missing.push(name);
      } else {
        present.push(name);
      }
    }
    
    return {
      test: 'Security Headers',
      vulnerable: missing.length > 0,
      findings: {
        missing,
        present,
        allHeaders: headers
      }
    };
  } catch (error) {
    return {
      test: 'Security Headers',
      vulnerable: true,
      findings: {
        error: error.message
      }
    };
  }
};

// 运行所有安全测试
const runAllTests = async () => {
  console.log('🚀 开始安全测试...');
  console.log('='.repeat(60));
  
  const results = {
    timestamp: new Date().toISOString(),
    target: securityTestConfig.target,
    tests: []
  };
  
  // 测试SQL注入
  results.tests.push(await testSQLInjection('/api/users', 'GET', 'id'));
  results.tests.push(await testSQLInjection('/api/assets', 'GET', 'symbol'));
  
  // 测试XSS
  results.tests.push(await testXSS('/api/search', 'GET', 'q'));
  
  // 测试路径遍历
  results.tests.push(await testPathTraversal('/api/download', 'file'));
  
  // 测试命令注入
  results.tests.push(await testCommandInjection('/api/ping', 'host'));
  
  // 测试敏感文件
  results.tests.push(await testSensitiveFiles());
  
  // 测试安全头部
  results.tests.push(await testSecurityHeaders());
  
  console.log('='.repeat(60));
  
  // 生成报告
  const report = generateReport(results);
  console.log(report);
  
  return results;
};

// 生成测试报告
const generateReport = (results) => {
  let report = '\n📊 安全测试报告\n';
  report += '='.repeat(60) + '\n';
  report += `测试时间: ${results.timestamp}\n`;
  report += `目标: ${results.target.protocol}://${results.target.host}:${results.target.port}\n`;
  report += '-'.repeat(60) + '\n\n';
  
  let totalVulnerabilities = 0;
  
  results.tests.forEach(test => {
    const status = test.vulnerable ? '❌ 存在漏洞' : '✅ 安全';
    report += `${status} - ${test.test}\n`;
    
    if (test.vulnerable && test.findings) {
      if (Array.isArray(test.findings)) {
        totalVulnerabilities += test.findings.length;
        test.findings.forEach(finding => {
          report += `   ⚠️  ${finding.evidence || finding.file || 'Vulnerability detected'}\n`;
          if (finding.payload) {
            report += `      载荷: ${finding.payload.substring(0, 50)}...\n`;
          }
        });
      } else if (test.findings.missing) {
        totalVulnerabilities += test.findings.missing.length;
        report += `   缺失头部: ${test.findings.missing.join(', ')}\n`;
      }
    }
    report += '\n';
  });
  
  report += '-'.repeat(60) + '\n';
  report += `总计: ${totalVulnerabilities} 个潜在漏洞\n`;
  report += '='.repeat(60) + '\n';
  
  return report;
};

// 导出模块
module.exports = {
  securityTestConfig,
  testSQLInjection,
  testXSS,
  testPathTraversal,
  testCommandInjection,
  testSensitiveFiles,
  testSecurityHeaders,
  runAllTests,
  generateReport
};

// 如果直接运行此文件
if (require.main === module) {
  runAllTests().then(results => {
    process.exit(results.tests.some(t => t.vulnerable) ? 1 : 0);
  }).catch(error => {
    console.error('安全测试失败:', error);
    process.exit(1);
  });
}
