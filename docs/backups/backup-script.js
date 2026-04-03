/**
 * 备份脚本
 * 定期备份数据库、账号信息、配置文件等
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 备份配置
const BACKUP_CONFIG = {
  // 备份目录
  backupDir: path.join(__dirname, '..', 'backups'),
  
  // 备份类型
  backupTypes: ['database', 'accounts', 'config', 'logs'],
  
  // 备份保留时间（天）
  retentionDays: 30,
  
  // 备份时间间隔（小时）
  intervalHours: 24,
  
  // 数据库配置
  database: {
    mongodb: {
      host: 'localhost',
      port: 27017,
      username: 'admin',
      password: 'Admin123!',
      database: 'chxw_finance'
    }
  },
  
  // 要备份的文件
  files: {
    accounts: [
      path.join(__dirname, '..', 'accounts', 'accounts.json')
    ],
    config: [
      path.join(__dirname, '..', 'backend', 'config'),
      path.join(__dirname, '..', 'docker-compose.yml'),
      path.join(__dirname, '..', 'init-mongo.js')
    ],
    logs: [
      path.join(__dirname, '..', 'logs')
    ]
  }
};

// 确保备份目录存在
if (!fs.existsSync(BACKUP_CONFIG.backupDir)) {
  fs.mkdirSync(BACKUP_CONFIG.backupDir, { recursive: true });
}

// 备份管理器
class BackupManager {
  constructor() {
    this.backupDir = BACKUP_CONFIG.backupDir;
  }

  // 运行完整备份
  async runFullBackup() {
    console.log('开始完整备份...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPrefix = `backup-${timestamp}`;
    
    const backupResults = [];
    
    for (const type of BACKUP_CONFIG.backupTypes) {
      try {
        const result = await this.backupType(type, backupPrefix);
        backupResults.push(result);
      } catch (error) {
        console.error(`备份 ${type} 失败:`, error);
        backupResults.push({ type, success: false, error: error.message });
      }
    }
    
    // 清理过期备份
    await this.cleanupOldBackups();
    
    console.log('备份完成！');
    return backupResults;
  }

  // 备份特定类型
  async backupType(type, backupPrefix) {
    console.log(`备份 ${type}...`);
    
    const backupPath = path.join(this.backupDir, `${backupPrefix}-${type}`);
    
    switch (type) {
      case 'database':
        await this.backupDatabase(backupPath);
        break;
      case 'accounts':
        await this.backupFiles('accounts', backupPath);
        break;
      case 'config':
        await this.backupFiles('config', backupPath);
        break;
      case 'logs':
        await this.backupFiles('logs', backupPath);
        break;
    }
    
    return { type, success: true, path: backupPath };
  }

  // 备份数据库
  async backupDatabase(backupPath) {
    fs.mkdirSync(backupPath, { recursive: true });
    
    const { host, port, username, password, database } = BACKUP_CONFIG.database.mongodb;
    const backupFile = path.join(backupPath, `${database}.gz`);
    
    // 使用 mongodump 命令备份
    try {
      const cmd = `mongodump --host ${host} --port ${port} --username ${username} --password ${password} --db ${database} --gzip --archive=${backupFile}`;
      execSync(cmd, { stdio: 'inherit' });
      console.log(`数据库备份成功: ${backupFile}`);
    } catch (error) {
      console.error('数据库备份失败:', error);
      throw error;
    }
  }

  // 备份文件
  async backupFiles(fileType, backupPath) {
    fs.mkdirSync(backupPath, { recursive: true });
    
    const files = BACKUP_CONFIG.files[fileType];
    if (!files) return;
    
    for (const file of files) {
      if (fs.existsSync(file)) {
        const fileName = path.basename(file);
        const destPath = path.join(backupPath, fileName);
        
        if (fs.lstatSync(file).isDirectory()) {
          // 备份目录
          this.copyDirectory(file, destPath);
        } else {
          // 备份文件
          fs.copyFileSync(file, destPath);
        }
        
        console.log(`备份文件: ${file} → ${destPath}`);
      }
    }
  }

  // 复制目录
  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      if (fs.lstatSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // 清理过期备份
  async cleanupOldBackups() {
    console.log('清理过期备份...');
    
    const now = Date.now();
    const retentionMs = BACKUP_CONFIG.retentionDays * 24 * 60 * 60 * 1000;
    
    const files = fs.readdirSync(this.backupDir);
    for (const file of files) {
      const filePath = path.join(this.backupDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > retentionMs) {
        if (fs.lstatSync(filePath).isDirectory()) {
          this.deleteDirectory(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
        console.log(`删除过期备份: ${filePath}`);
      }
    }
  }

  // 删除目录
  deleteDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        this.deleteDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    }
    fs.rmdirSync(dir);
  }

  // 列出所有备份
  listBackups() {
    const files = fs.readdirSync(this.backupDir);
    return files.map(file => {
      const filePath = path.join(this.backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: stats.size,
        mtime: stats.mtime,
        isDirectory: fs.lstatSync(filePath).isDirectory()
      };
    }).sort((a, b) => b.mtime - a.mtime);
  }

  // 恢复备份
  async restoreBackup(backupName) {
    console.log(`恢复备份: ${backupName}`);
    
    const backupPath = path.join(this.backupDir, backupName);
    if (!fs.existsSync(backupPath)) {
      throw new Error(`备份不存在: ${backupName}`);
    }
    
    // 解析备份类型
    const parts = backupName.split('-');
    const type = parts[parts.length - 1];
    
    switch (type) {
      case 'database':
        await this.restoreDatabase(backupPath);
        break;
      case 'accounts':
        await this.restoreFiles('accounts', backupPath);
        break;
      case 'config':
        await this.restoreFiles('config', backupPath);
        break;
      case 'logs':
        await this.restoreFiles('logs', backupPath);
        break;
      default:
        throw new Error(`未知的备份类型: ${type}`);
    }
    
    console.log(`恢复备份成功: ${backupName}`);
  }

  // 恢复数据库
  async restoreDatabase(backupPath) {
    const { host, port, username, password, database } = BACKUP_CONFIG.database.mongodb;
    const backupFile = path.join(backupPath, `${database}.gz`);
    
    if (!fs.existsSync(backupFile)) {
      throw new Error(`数据库备份文件不存在: ${backupFile}`);
    }
    
    try {
      const cmd = `mongorestore --host ${host} --port ${port} --username ${username} --password ${password} --gzip --archive=${backupFile}`;
      execSync(cmd, { stdio: 'inherit' });
      console.log('数据库恢复成功');
    } catch (error) {
      console.error('数据库恢复失败:', error);
      throw error;
    }
  }

  // 恢复文件
  async restoreFiles(fileType, backupPath) {
    const files = BACKUP_CONFIG.files[fileType];
    if (!files) return;
    
    for (const file of files) {
      const fileName = path.basename(file);
      const backupFilePath = path.join(backupPath, fileName);
      
      if (fs.existsSync(backupFilePath)) {
        if (fs.lstatSync(backupFilePath).isDirectory()) {
          // 恢复目录
          if (fs.existsSync(file)) {
            this.deleteDirectory(file);
          }
          this.copyDirectory(backupFilePath, file);
        } else {
          // 恢复文件
          fs.copyFileSync(backupFilePath, file);
        }
        
        console.log(`恢复文件: ${backupFilePath} → ${file}`);
      }
    }
  }
}

// 运行备份
async function runBackup() {
  const backupManager = new BackupManager();
  const results = await backupManager.runFullBackup();
  
  console.log('\n备份结果:');
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.type}: 成功 - ${result.path}`);
    } else {
      console.log(`❌ ${result.type}: 失败 - ${result.error}`);
    }
  });
  
  return results;
}

// 列出备份
function listBackups() {
  const backupManager = new BackupManager();
  const backups = backupManager.listBackups();
  
  console.log('\n当前备份:');
  backups.forEach((backup, index) => {
    console.log(`${index + 1}. ${backup.name}`);
    console.log(`   大小: ${(backup.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   时间: ${backup.mtime}`);
    console.log(`   类型: ${backup.isDirectory ? '目录' : '文件'}`);
  });
  
  return backups;
}

// 恢复备份
async function restoreBackup(backupName) {
  const backupManager = new BackupManager();
  await backupManager.restoreBackup(backupName);
}

// 导出
module.exports = {
  BackupManager,
  runBackup,
  listBackups,
  restoreBackup,
  BACKUP_CONFIG
};

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'list') {
    listBackups();
  } else if (args[0] === 'restore' && args[1]) {
    restoreBackup(args[1]);
  } else {
    runBackup();
  }
}
