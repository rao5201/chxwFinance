/**
 * 茶海虾王@金融交易所看板平台 - 数据备份系统
 * 包含MongoDB和Redis的自动备份策略
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// 备份配置
const backupConfig = {
  // 备份目录
  backupDir: process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups'),
  
  // 备份保留策略
  retention: {
    daily: 7,    // 保留7天
    weekly: 4,   // 保留4周
    monthly: 12  // 保留12个月
  },
  
  // 备份时间配置
  schedule: {
    daily: '0 2 * * *',    // 每天凌晨2点
    weekly: '0 3 * * 0',   // 每周日凌晨3点
    monthly: '0 4 1 * *'   // 每月1日凌晨4点
  },
  
  // 压缩配置
  compression: {
    enabled: true,
    level: 6, // 压缩级别 1-9
    format: 'gzip' // gzip, bzip2, xz
  },
  
  // 加密配置
  encryption: {
    enabled: process.env.BACKUP_ENCRYPTION_ENABLED === 'true',
    algorithm: 'aes-256-cbc',
    key: process.env.BACKUP_ENCRYPTION_KEY
  },
  
  // 远程存储配置
  remoteStorage: {
    enabled: process.env.REMOTE_BACKUP_ENABLED === 'true',
    type: process.env.REMOTE_BACKUP_TYPE || 's3', // s3, ftp, sftp
    config: {
      s3: {
        bucket: process.env.AWS_S3_BUCKET,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      },
      ftp: {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT || 21,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        remotePath: process.env.FTP_REMOTE_PATH
      },
      sftp: {
        host: process.env.SFTP_HOST,
        port: process.env.SFTP_PORT || 22,
        user: process.env.SFTP_USER,
        privateKey: process.env.SFTP_PRIVATE_KEY,
        remotePath: process.env.SFTP_REMOTE_PATH
      }
    }
  }
};

// 确保备份目录存在
const ensureBackupDir = () => {
  if (!fs.existsSync(backupConfig.backupDir)) {
    fs.mkdirSync(backupConfig.backupDir, { recursive: true });
  }
  
  // 创建子目录
  const subdirs = ['mongodb', 'redis', 'logs', 'config'];
  subdirs.forEach(dir => {
    const dirPath = path.join(backupConfig.backupDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// 生成备份文件名
const generateBackupFileName = (type, extension = 'dump') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${type}_backup_${timestamp}.${extension}`;
};

// MongoDB备份
const backupMongoDB = async () => {
  try {
    console.log('🔄 开始备份MongoDB...');
    
    const backupFileName = generateBackupFileName('mongodb', 'gz');
    const backupPath = path.join(backupConfig.backupDir, 'mongodb', backupFileName);
    
    // 构建mongodump命令
    const mongodumpCmd = [
      'mongodump',
      `--uri="${process.env.MONGODB_URI}"`,
      `--archive="${backupPath}"`,
      '--gzip'
    ].join(' ');
    
    await execAsync(mongodumpCmd);
    
    console.log(`✅ MongoDB备份完成: ${backupPath}`);
    
    // 如果启用了加密，加密备份文件
    if (backupConfig.encryption.enabled) {
      await encryptBackup(backupPath);
    }
    
    // 如果启用了远程存储，上传到远程
    if (backupConfig.remoteStorage.enabled) {
      await uploadToRemote(backupPath, 'mongodb');
    }
    
    return {
      success: true,
      file: backupPath,
      size: fs.statSync(backupPath).size,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ MongoDB备份失败:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Redis备份
const backupRedis = async () => {
  try {
    console.log('🔄 开始备份Redis...');
    
    const backupFileName = generateBackupFileName('redis', 'rdb');
    const backupPath = path.join(backupConfig.backupDir, 'redis', backupFileName);
    
    // 使用redis-cli执行BGSAVE命令
    const redisCliCmd = [
      'redis-cli',
      `-h ${process.env.REDIS_HOST}`,
      `-p ${process.env.REDIS_PORT}`,
      process.env.REDIS_PASSWORD ? `-a ${process.env.REDIS_PASSWORD}` : '',
      '--rdb',
      backupPath
    ].join(' ');
    
    await execAsync(redisCliCmd);
    
    // 压缩备份文件
    if (backupConfig.compression.enabled) {
      await compressBackup(backupPath);
    }
    
    console.log(`✅ Redis备份完成: ${backupPath}`);
    
    // 如果启用了加密，加密备份文件
    if (backupConfig.encryption.enabled) {
      await encryptBackup(backupPath + '.gz');
    }
    
    // 如果启用了远程存储，上传到远程
    if (backupConfig.remoteStorage.enabled) {
      await uploadToRemote(backupPath + '.gz', 'redis');
    }
    
    return {
      success: true,
      file: backupPath,
      size: fs.statSync(backupPath).size,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Redis备份失败:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// 配置文件备份
const backupConfig = async () => {
  try {
    console.log('🔄 开始备份配置文件...');
    
    const backupFileName = generateBackupFileName('config', 'tar.gz');
    const backupPath = path.join(backupConfig.backupDir, 'config', backupFileName);
    
    // 需要备份的配置文件
    const configFiles = [
      '.env',
      '.env.production',
      'nginx.conf',
      'prometheus.yml',
      'grafana.ini'
    ];
    
    // 创建临时目录
    const tempDir = path.join(backupConfig.backupDir, 'temp_config');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // 复制配置文件
    configFiles.forEach(file => {
      const sourcePath = path.join(__dirname, '..', file);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, path.join(tempDir, file));
      }
    });
    
    // 打包压缩
    const tarCmd = [
      'tar',
      '-czf',
      backupPath,
      '-C',
      tempDir,
      '.'
    ].join(' ');
    
    await execAsync(tarCmd);
    
    // 清理临时目录
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log(`✅ 配置文件备份完成: ${backupPath}`);
    
    return {
      success: true,
      file: backupPath,
      size: fs.statSync(backupPath).size,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ 配置文件备份失败:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// 压缩备份文件
const compressBackup = async (filePath) => {
  try {
    const compressCmd = `gzip -${backupConfig.compression.level} "${filePath}"`;
    await execAsync(compressCmd);
    return filePath + '.gz';
  } catch (error) {
    console.error('压缩备份文件失败:', error.message);
    throw error;
  }
};

// 加密备份文件
const encryptBackup = async (filePath) => {
  try {
    const crypto = require('crypto');
    const algorithm = backupConfig.encryption.algorithm;
    const key = Buffer.from(backupConfig.encryption.key, 'hex');
    const iv = crypto.randomBytes(16);
    
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(filePath + '.enc');
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    output.write(iv);
    input.pipe(cipher).pipe(output);
    
    return new Promise((resolve, reject) => {
      output.on('finish', () => {
        fs.unlinkSync(filePath); // 删除未加密的文件
        resolve(filePath + '.enc');
      });
      output.on('error', reject);
    });
  } catch (error) {
    console.error('加密备份文件失败:', error.message);
    throw error;
  }
};

// 上传到远程存储
const uploadToRemote = async (filePath, type) => {
  try {
    const storageType = backupConfig.remoteStorage.type;
    const config = backupConfig.remoteStorage.config[storageType];
    
    switch (storageType) {
      case 's3':
        await uploadToS3(filePath, type, config);
        break;
      case 'ftp':
        await uploadToFTP(filePath, type, config);
        break;
      case 'sftp':
        await uploadToSFTP(filePath, type, config);
        break;
      default:
        throw new Error(`不支持的远程存储类型: ${storageType}`);
    }
    
    console.log(`✅ 备份文件已上传到远程存储: ${filePath}`);
  } catch (error) {
    console.error('上传备份文件到远程存储失败:', error.message);
    throw error;
  }
};

// 上传到AWS S3
const uploadToS3 = async (filePath, type, config) => {
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  });
  
  const fileName = path.basename(filePath);
  const key = `backups/${type}/${fileName}`;
  
  await s3.upload({
    Bucket: config.bucket,
    Key: key,
    Body: fs.createReadStream(filePath)
  }).promise();
};

// 上传到FTP
const uploadToFTP = async (filePath, type, config) => {
  const ftp = require('basic-ftp');
  const client = new ftp.Client();
  
  await client.access({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password
  });
  
  const remotePath = path.join(config.remotePath, type, path.basename(filePath));
  await client.uploadFrom(filePath, remotePath);
  client.close();
};

// 上传到SFTP
const uploadToSFTP = async (filePath, type, config) => {
  const { Client } = require('ssh2-sftp-client');
  const sftp = new Client();
  
  await sftp.connect({
    host: config.host,
    port: config.port,
    username: config.user,
    privateKey: fs.readFileSync(config.privateKey)
  });
  
  const remotePath = path.join(config.remotePath, type, path.basename(filePath));
  await sftp.put(filePath, remotePath);
  await sftp.end();
};

// 清理过期备份
const cleanupOldBackups = async () => {
  try {
    console.log('🧹 开始清理过期备份...');
    
    const now = new Date();
    const backupTypes = ['mongodb', 'redis', 'config'];
    
    backupTypes.forEach(type => {
      const typeDir = path.join(backupConfig.backupDir, type);
      if (!fs.existsSync(typeDir)) return;
      
      const files = fs.readdirSync(typeDir);
      
      files.forEach(file => {
        const filePath = path.join(typeDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = (now - stats.mtime) / (1000 * 60 * 60 * 24); // 天数
        
        let shouldDelete = false;
        
        // 根据文件年龄决定保留策略
        if (fileAge > backupConfig.retention.monthly * 30) {
          shouldDelete = true;
        } else if (fileAge > backupConfig.retention.weekly * 7 && !file.includes('weekly')) {
          shouldDelete = true;
        } else if (fileAge > backupConfig.retention.daily && !file.includes('daily') && !file.includes('weekly')) {
          shouldDelete = true;
        }
        
        if (shouldDelete) {
          fs.unlinkSync(filePath);
          console.log(`🗑️  删除过期备份: ${file}`);
        }
      });
    });
    
    console.log('✅ 过期备份清理完成');
  } catch (error) {
    console.error('❌ 清理过期备份失败:', error.message);
  }
};

// 验证备份完整性
const verifyBackup = async (backupPath) => {
  try {
    console.log(`🔍 验证备份完整性: ${backupPath}`);
    
    const stats = fs.statSync(backupPath);
    
    if (stats.size === 0) {
      throw new Error('备份文件大小为0');
    }
    
    // 检查文件是否可读
    fs.accessSync(backupPath, fs.constants.R_OK);
    
    console.log('✅ 备份完整性验证通过');
    return {
      valid: true,
      size: stats.size,
      modified: stats.mtime
    };
  } catch (error) {
    console.error('❌ 备份完整性验证失败:', error.message);
    return {
      valid: false,
      error: error.message
    };
  }
};

// 恢复备份
const restoreBackup = async (backupPath, type) => {
  try {
    console.log(`🔄 开始恢复备份: ${backupPath}`);
    
    switch (type) {
      case 'mongodb':
        await restoreMongoDB(backupPath);
        break;
      case 'redis':
        await restoreRedis(backupPath);
        break;
      case 'config':
        await restoreConfig(backupPath);
        break;
      default:
        throw new Error(`不支持的备份类型: ${type}`);
    }
    
    console.log('✅ 备份恢复完成');
  } catch (error) {
    console.error('❌ 备份恢复失败:', error.message);
    throw error;
  }
};

// 恢复MongoDB备份
const restoreMongoDB = async (backupPath) => {
  const mongorestoreCmd = [
    'mongorestore',
    `--uri="${process.env.MONGODB_URI}"`,
    `--archive="${backupPath}"`,
    '--gzip',
    '--drop' // 删除现有数据
  ].join(' ');
  
  await execAsync(mongorestoreCmd);
};

// 恢复Redis备份
const restoreRedis = async (backupPath) => {
  // 停止Redis服务
  await execAsync('redis-cli shutdown');
  
  // 复制备份文件到Redis数据目录
  const redisDataDir = '/var/lib/redis'; // 根据实际配置调整
  fs.copyFileSync(backupPath, path.join(redisDataDir, 'dump.rdb'));
  
  // 启动Redis服务
  await execAsync('systemctl start redis');
};

// 恢复配置文件
const restoreConfig = async (backupPath) => {
  const extractCmd = [
    'tar',
    '-xzf',
    backupPath,
    '-C',
    path.join(__dirname, '..')
  ].join(' ');
  
  await execAsync(extractCmd);
};

// 执行完整备份
const performFullBackup = async () => {
  console.log('🚀 开始执行完整备份...');
  console.log('='.repeat(50));
  
  ensureBackupDir();
  
  const results = {
    mongodb: await backupMongoDB(),
    redis: await backupRedis(),
    config: await backupConfig()
  };
  
  // 清理过期备份
  await cleanupOldBackups();
  
  console.log('='.repeat(50));
  console.log('✅ 完整备份执行完成');
  
  return results;
};

// 获取备份状态
const getBackupStatus = () => {
  const status = {
    lastBackup: null,
    totalBackups: 0,
    totalSize: 0,
    backupTypes: {}
  };
  
  const backupTypes = ['mongodb', 'redis', 'config'];
  
  backupTypes.forEach(type => {
    const typeDir = path.join(backupConfig.backupDir, type);
    if (!fs.existsSync(typeDir)) return;
    
    const files = fs.readdirSync(typeDir);
    const typeStats = {
      count: files.length,
      size: 0,
      lastBackup: null
    };
    
    files.forEach(file => {
      const filePath = path.join(typeDir, file);
      const stats = fs.statSync(filePath);
      typeStats.size += stats.size;
      
      if (!typeStats.lastBackup || stats.mtime > typeStats.lastBackup) {
        typeStats.lastBackup = stats.mtime;
      }
    });
    
    status.backupTypes[type] = typeStats;
    status.totalBackups += typeStats.count;
    status.totalSize += typeStats.size;
    
    if (!status.lastBackup || typeStats.lastBackup > status.lastBackup) {
      status.lastBackup = typeStats.lastBackup;
    }
  });
  
  return status;
};

module.exports = {
  backupConfig,
  backupMongoDB,
  backupRedis,
  backupConfig: backupConfig,
  performFullBackup,
  restoreBackup,
  verifyBackup,
  cleanupOldBackups,
  getBackupStatus,
  generateBackupFileName,
  ensureBackupDir
};
