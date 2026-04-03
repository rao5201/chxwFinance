/**
 * 账号数据库管理系统
 * 集中管理所有账号信息，包括内部人员、外部人员、财务审计人员、操作人员和第三方账号
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 账号管理配置
const ACCOUNT_CONFIG = {
  // 账号存储路径
  accountPaths: {
    internal: path.join(__dirname, '..', 'internal-accounts', 'internal-accounts.json'),
    external: path.join(__dirname, '..', 'external-accounts', 'external-accounts.json'),
    finance: path.join(__dirname, '..', 'finance-accounts', 'finance-accounts.json'),
    operations: path.join(__dirname, '..', 'operations-accounts', 'operations-accounts.json'),
    thirdParty: path.join(__dirname, '..', 'third-party-accounts', 'third-party-accounts.json'),
    clients: path.join(__dirname, '..', 'accounts', 'accounts.json')
  },
  
  // 备份配置
  backup: {
    enabled: true,
    path: path.join(__dirname, '..', 'backups'),
    retentionDays: 30
  },
  
  // 加密配置
  encryption: {
    enabled: true,
    algorithm: 'aes-256-cbc',
    key: 'Your32ByteEncryptionKeyHere',
    iv: 'Your16ByteIVHere'
  }
};

// 确保备份目录存在
if (!fs.existsSync(ACCOUNT_CONFIG.backup.path)) {
  fs.mkdirSync(ACCOUNT_CONFIG.backup.path, { recursive: true });
}

// 账号管理器
class AccountManager {
  constructor() {
    this.accounts = {
      internal: {},
      external: {},
      finance: {},
      operations: {},
      thirdParty: {},
      clients: {}
    };
    this.loadAllAccounts();
  }

  // 加载所有账号
  loadAllAccounts() {
    console.log('加载所有账号...');
    
    for (const [type, filePath] of Object.entries(ACCOUNT_CONFIG.accountPaths)) {
      if (fs.existsSync(filePath)) {
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          this.accounts[type] = JSON.parse(data);
          console.log(`✅ 加载 ${type} 账号成功: ${Object.keys(this.accounts[type]).length} 个账号`);
        } catch (error) {
          console.error(`❌ 加载 ${type} 账号失败:`, error);
          this.accounts[type] = {};
        }
      } else {
        console.warn(`⚠️ ${type} 账号文件不存在: ${filePath}`);
        this.accounts[type] = {};
      }
    }
  }

  // 保存所有账号
  saveAllAccounts() {
    console.log('保存所有账号...');
    
    for (const [type, filePath] of Object.entries(ACCOUNT_CONFIG.accountPaths)) {
      try {
        // 确保目录存在
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        const data = JSON.stringify(this.accounts[type], null, 2);
        fs.writeFileSync(filePath, data);
        console.log(`✅ 保存 ${type} 账号成功`);
      } catch (error) {
        console.error(`❌ 保存 ${type} 账号失败:`, error);
      }
    }
  }

  // 添加账号
  addAccount(type, username, accountData) {
    if (!this.accounts[type]) {
      this.accounts[type] = {};
    }
    
    accountData.createdAt = new Date().toISOString();
    accountData.lastLogin = new Date().toISOString();
    
    this.accounts[type][username] = accountData;
    this.saveAllAccounts();
    
    console.log(`✅ 添加账号成功: ${username} (${type})`);
    return accountData;
  }

  // 更新账号
  updateAccount(type, username, updates) {
    if (!this.accounts[type] || !this.accounts[type][username]) {
      console.error(`❌ 账号不存在: ${username} (${type})`);
      return null;
    }
    
    this.accounts[type][username] = {
      ...this.accounts[type][username],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveAllAccounts();
    console.log(`✅ 更新账号成功: ${username} (${type})`);
    return this.accounts[type][username];
  }

  // 删除账号
  deleteAccount(type, username) {
    if (!this.accounts[type] || !this.accounts[type][username]) {
      console.error(`❌ 账号不存在: ${username} (${type})`);
      return false;
    }
    
    delete this.accounts[type][username];
    this.saveAllAccounts();
    console.log(`✅ 删除账号成功: ${username} (${type})`);
    return true;
  }

  // 获取账号
  getAccount(type, username) {
    if (!this.accounts[type]) {
      return null;
    }
    return this.accounts[type][username] || null;
  }

  // 获取所有账号
  getAllAccounts(type = null) {
    if (type) {
      return this.accounts[type] || {};
    }
    return this.accounts;
  }

  // 搜索账号
  searchAccounts(query) {
    const results = {};
    
    for (const [type, accounts] of Object.entries(this.accounts)) {
      results[type] = {};
      
      for (const [username, account] of Object.entries(accounts)) {
        if (
          username.includes(query) ||
          (account.email && account.email.includes(query)) ||
          (account.fullName && account.fullName.includes(query)) ||
          (account.company && account.company.includes(query))
        ) {
          results[type][username] = account;
        }
      }
    }
    
    return results;
  }

  // 验证账号
  verifyAccount(type, username, password) {
    const account = this.getAccount(type, username);
    if (!account) {
      return { valid: false, message: '账号不存在' };
    }
    
    // 这里应该使用实际的密码验证逻辑
    // 现在只是简单的示例
    if (account.password === password) {
      // 更新最后登录时间
      this.updateAccount(type, username, { lastLogin: new Date().toISOString() });
      return { valid: true, account };
    }
    
    return { valid: false, message: '密码错误' };
  }

  // 备份账号
  backupAccounts() {
    if (!ACCOUNT_CONFIG.backup.enabled) {
      console.log('⚠️ 备份功能已禁用');
      return;
    }
    
    console.log('备份账号...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(ACCOUNT_CONFIG.backup.path, `accounts-backup-${timestamp}.json`);
    
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        accounts: this.accounts,
        version: '1.0'
      };
      
      fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
      console.log(`✅ 账号备份成功: ${backupFile}`);
      
      // 清理过期备份
      this.cleanupOldBackups();
    } catch (error) {
      console.error('❌ 账号备份失败:', error);
    }
  }

  // 恢复备份
  restoreBackup(backupFile) {
    if (!fs.existsSync(backupFile)) {
      console.error(`❌ 备份文件不存在: ${backupFile}`);
      return false;
    }
    
    console.log(`恢复备份: ${backupFile}`);
    
    try {
      const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      this.accounts = backupData.accounts;
      this.saveAllAccounts();
      console.log('✅ 账号恢复成功');
      return true;
    } catch (error) {
      console.error('❌ 账号恢复失败:', error);
      return false;
    }
  }

  // 清理过期备份
  cleanupOldBackups() {
    const now = Date.now();
    const retentionMs = ACCOUNT_CONFIG.backup.retentionDays * 24 * 60 * 60 * 1000;
    
    try {
      const files = fs.readdirSync(ACCOUNT_CONFIG.backup.path);
      for (const file of files) {
        if (file.startsWith('accounts-backup-')) {
          const filePath = path.join(ACCOUNT_CONFIG.backup.path, file);
          const stats = fs.statSync(filePath);
          
          if (now - stats.mtimeMs > retentionMs) {
            fs.unlinkSync(filePath);
            console.log(`✅ 删除过期备份: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ 清理过期备份失败:', error);
    }
  }

  // 获取账号统计
  getAccountStats() {
    const stats = {
      total: 0,
      byType: {}
    };
    
    for (const [type, accounts] of Object.entries(this.accounts)) {
      const count = Object.keys(accounts).length;
      stats.byType[type] = count;
      stats.total += count;
    }
    
    return stats;
  }

  // 生成账号报告
  generateAccountReport() {
    const stats = this.getAccountStats();
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      accounts: this.accounts
    };
    
    const reportFile = path.join(ACCOUNT_CONFIG.backup.path, `account-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    
    try {
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
      console.log(`✅ 账号报告生成成功: ${reportFile}`);
      return report;
    } catch (error) {
      console.error('❌ 账号报告生成失败:', error);
      return null;
    }
  }
}

// 加密工具
class EncryptionTool {
  constructor() {
    this.algorithm = ACCOUNT_CONFIG.encryption.algorithm;
    this.key = Buffer.from(ACCOUNT_CONFIG.encryption.key, 'utf8');
    this.iv = Buffer.from(ACCOUNT_CONFIG.encryption.iv, 'utf8');
  }

  // 加密数据
  encrypt(data) {
    if (!ACCOUNT_CONFIG.encryption.enabled) {
      return data;
    }
    
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // 解密数据
  decrypt(encryptedData) {
    if (!ACCOUNT_CONFIG.encryption.enabled) {
      return encryptedData;
    }
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}

// 导出
module.exports = {
  AccountManager,
  EncryptionTool,
  ACCOUNT_CONFIG
};

// 如果直接运行此脚本
if (require.main === module) {
  const accountManager = new AccountManager();
  
  // 生成账号统计
  const stats = accountManager.getAccountStats();
  console.log('\n账号统计:');
  console.log(`总账号数: ${stats.total}`);
  console.log('按类型统计:');
  for (const [type, count] of Object.entries(stats.byType)) {
    console.log(`- ${type}: ${count}`);
  }
  
  // 备份账号
  accountManager.backupAccounts();
  
  // 生成账号报告
  accountManager.generateAccountReport();
}
