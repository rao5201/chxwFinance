/**
 * 茶海虾王@金融交易所看板平台 - 定时备份任务配置脚本
 * 支持Linux (cron) 和 Windows (Task Scheduler)
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

// 备份配置
const backupConfig = {
  backupDir: process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups'),
  logDir: path.join(__dirname, '..', 'logs'),
  scriptsDir: __dirname,
  mongodb: {
    enabled: true,
    schedule: '0 2 * * *', // 每天凌晨2点
    retention: 7 // 保留7天
  },
  redis: {
    enabled: true,
    schedule: '0 3 * * *', // 每天凌晨3点
    retention: 7
  },
  config: {
    enabled: true,
    schedule: '0 4 * * 0', // 每周日凌晨4点
    retention: 4 // 保留4周
  },
  full: {
    enabled: true,
    schedule: '0 5 1 * *', // 每月1日凌晨5点
    retention: 12 // 保留12个月
  }
};

// 确保目录存在
function ensureDirectories() {
  const dirs = [backupConfig.backupDir, backupConfig.logDir];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// 生成备份脚本 - MongoDB
function generateMongoDBBackupScript() {
  return `#!/bin/bash
# MongoDB备份脚本
# 茶海虾王@金融交易所看板平台

BACKUP_DIR="${backupConfig.backupDir}/mongodb"
LOG_FILE="${backupConfig.logDir}/mongodb-backup.log"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${backupConfig.mongodb.retention}

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 记录开始时间
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始MongoDB备份" >> "$LOG_FILE"

# 执行备份
mongodump --uri="$MONGODB_URI" --archive="$BACKUP_DIR/mongodb_backup_$DATE.gz" --gzip

if [ $? -eq 0 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ MongoDB备份成功: mongodb_backup_$DATE.gz" >> "$LOG_FILE"
  
  # 清理过期备份
  find "$BACKUP_DIR" -name "mongodb_backup_*.gz" -mtime +$RETENTION_DAYS -delete
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🧹 清理过期备份完成" >> "$LOG_FILE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ MongoDB备份失败" >> "$LOG_FILE"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 备份任务完成" >> "$LOG_FILE"
`;
}

// 生成备份脚本 - Redis
function generateRedisBackupScript() {
  return `#!/bin/bash
# Redis备份脚本
# 茶海虾王@金融交易所看板平台

BACKUP_DIR="${backupConfig.backupDir}/redis"
LOG_FILE="${backupConfig.logDir}/redis-backup.log"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${backupConfig.redis.retention}

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 记录开始时间
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始Redis备份" >> "$LOG_FILE"

# 执行备份
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --rdb "$BACKUP_DIR/redis_backup_$DATE.rdb"

if [ $? -eq 0 ]; then
  # 压缩备份文件
  gzip "$BACKUP_DIR/redis_backup_$DATE.rdb"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Redis备份成功: redis_backup_$DATE.rdb.gz" >> "$LOG_FILE"
  
  # 清理过期备份
  find "$BACKUP_DIR" -name "redis_backup_*.rdb.gz" -mtime +$RETENTION_DAYS -delete
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🧹 清理过期备份完成" >> "$LOG_FILE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Redis备份失败" >> "$LOG_FILE"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 备份任务完成" >> "$LOG_FILE"
`;
}

// 生成备份脚本 - 配置文件
function generateConfigBackupScript() {
  return `#!/bin/bash
# 配置文件备份脚本
# 茶海虾王@金融交易所看板平台

BACKUP_DIR="${backupConfig.backupDir}/config"
LOG_FILE="${backupConfig.logDir}/config-backup.log"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=$((${backupConfig.config.retention} * 7))
PROJECT_DIR="${path.join(__dirname, '..')}"

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 记录开始时间
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始配置文件备份" >> "$LOG_FILE"

# 备份配置文件
cd "$PROJECT_DIR"
tar -czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" \
  .env .env.production \
  config/*.js config/*.json \
  nginx.conf \
  prometheus.yml \
  grafana.ini \
  --exclude='node_modules' \
  --exclude='logs' \
  --exclude='backups'

if [ $? -eq 0 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ 配置文件备份成功: config_backup_$DATE.tar.gz" >> "$LOG_FILE"
  
  # 清理过期备份
  find "$BACKUP_DIR" -name "config_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🧹 清理过期备份完成" >> "$LOG_FILE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ 配置文件备份失败" >> "$LOG_FILE"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 备份任务完成" >> "$LOG_FILE"
`;
}

// 生成完整备份脚本
function generateFullBackupScript() {
  return `#!/bin/bash
# 完整备份脚本
# 茶海虾王@金融交易所看板平台

BACKUP_DIR="${backupConfig.backupDir}/full"
LOG_FILE="${backupConfig.logDir}/full-backup.log"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=$((${backupConfig.full.retention} * 30))

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 记录开始时间
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始完整备份" >> "$LOG_FILE"

# 执行完整备份
node "${backupConfig.scriptsDir}/run-full-backup.js" >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ 完整备份成功" >> "$LOG_FILE"
  
  # 清理过期备份
  find "$BACKUP_DIR" -name "full_backup_*" -mtime +$RETENTION_DAYS -delete
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🧹 清理过期备份完成" >> "$LOG_FILE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ 完整备份失败" >> "$LOG_FILE"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 备份任务完成" >> "$LOG_FILE"
`;
}

// 保存备份脚本
function saveBackupScripts() {
  const scriptsDir = path.join(__dirname, 'backup-scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  // 保存各个备份脚本
  fs.writeFileSync(path.join(scriptsDir, 'backup-mongodb.sh'), generateMongoDBBackupScript());
  fs.writeFileSync(path.join(scriptsDir, 'backup-redis.sh'), generateRedisBackupScript());
  fs.writeFileSync(path.join(scriptsDir, 'backup-config.sh'), generateConfigBackupScript());
  fs.writeFileSync(path.join(scriptsDir, 'backup-full.sh'), generateFullBackupScript());

  // 设置执行权限（Linux/Mac）
  if (os.platform() !== 'win32') {
    fs.chmodSync(path.join(scriptsDir, 'backup-mongodb.sh'), '755');
    fs.chmodSync(path.join(scriptsDir, 'backup-redis.sh'), '755');
    fs.chmodSync(path.join(scriptsDir, 'backup-config.sh'), '755');
    fs.chmodSync(path.join(scriptsDir, 'backup-full.sh'), '755');
  }

  console.log('✅ 备份脚本已生成');
  return scriptsDir;
}

// 设置Linux Cron任务
async function setupLinuxCron(scriptsDir) {
  console.log('🔧 设置Linux定时任务...');

  try {
    // 生成crontab条目
    const cronEntries = [];

    if (backupConfig.mongodb.enabled) {
      cronEntries.push(`${backupConfig.mongodb.schedule} ${scriptsDir}/backup-mongodb.sh`);
    }
    if (backupConfig.redis.enabled) {
      cronEntries.push(`${backupConfig.redis.schedule} ${scriptsDir}/backup-redis.sh`);
    }
    if (backupConfig.config.enabled) {
      cronEntries.push(`${backupConfig.config.schedule} ${scriptsDir}/backup-config.sh`);
    }
    if (backupConfig.full.enabled) {
      cronEntries.push(`${backupConfig.full.schedule} ${scriptsDir}/backup-full.sh`);
    }

    // 保存crontab文件
    const cronFile = path.join(__dirname, 'crontab.txt');
    fs.writeFileSync(cronFile, cronEntries.join('\n') + '\n');

    console.log('📄 Crontab配置已保存:', cronFile);
    console.log('\n📋 请手动添加以下crontab条目:');
    console.log(cronEntries.join('\n'));
    console.log('\n💡 执行命令: crontab ' + cronFile);

    return true;
  } catch (error) {
    console.error('❌ 设置Linux定时任务失败:', error.message);
    return false;
  }
}

// 设置Windows计划任务
async function setupWindowsTask(scriptsDir) {
  console.log('🔧 设置Windows计划任务...');

  try {
    const tasks = [];

    if (backupConfig.mongodb.enabled) {
      tasks.push({
        name: 'TeaSeaShrimpKing-MongoDB-Backup',
        script: path.join(scriptsDir, 'backup-mongodb.sh'),
        schedule: backupConfig.mongodb.schedule
      });
    }
    if (backupConfig.redis.enabled) {
      tasks.push({
        name: 'TeaSeaShrimpKing-Redis-Backup',
        script: path.join(scriptsDir, 'backup-redis.sh'),
        schedule: backupConfig.redis.schedule
      });
    }
    if (backupConfig.config.enabled) {
      tasks.push({
        name: 'TeaSeaShrimpKing-Config-Backup',
        script: path.join(scriptsDir, 'backup-config.sh'),
        schedule: backupConfig.config.schedule
      });
    }
    if (backupConfig.full.enabled) {
      tasks.push({
        name: 'TeaSeaShrimpKing-Full-Backup',
        script: path.join(scriptsDir, 'backup-full.sh'),
        schedule: backupConfig.full.schedule
      });
    }

    // 生成PowerShell脚本创建计划任务
    const psScript = generateWindowsTaskScript(tasks);
    const psFile = path.join(__dirname, 'setup-windows-tasks.ps1');
    fs.writeFileSync(psFile, psScript);

    console.log('📄 PowerShell脚本已生成:', psFile);
    console.log('\n📋 请以管理员身份运行PowerShell并执行:');
    console.log('   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser');
    console.log('   ' + psFile);

    return true;
  } catch (error) {
    console.error('❌ 设置Windows计划任务失败:', error.message);
    return false;
  }
}

// 生成Windows计划任务PowerShell脚本
function generateWindowsTaskScript(tasks) {
  let script = '# 茶海虾王@金融交易所看板平台 - Windows计划任务配置\n';
  script += '# 请以管理员身份运行此脚本\n\n';

  tasks.forEach(task => {
    const schedule = parseCronToWindows(task.schedule);
    script += `
# 创建任务: ${task.name}
$Action = New-ScheduledTaskAction -Execute "bash.exe" -Argument "${task.script}"
$Trigger = ${schedule}
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "${task.name}" -Action $Action -Trigger $Trigger -Settings $Settings -Force
Write-Host "✅ 任务创建成功: ${task.name}"
`;
  });

  script += '\nWrite-Host "🎉 所有计划任务创建完成!"\n';
  return script;
}

// 解析Cron表达式为Windows计划任务触发器
function parseCronToWindows(cron) {
  const parts = cron.split(' ');
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // 简单解析，支持基本的定时设置
  if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    // 每天
    return `New-ScheduledTaskTrigger -Daily -At "${hour.padStart(2, '0')}:${minute.padStart(2, '0')}"`;
  } else if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
    // 每周
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[parseInt(dayOfWeek)] || 'Sunday';
    return `New-ScheduledTaskTrigger -Weekly -DaysOfWeek ${day} -At "${hour.padStart(2, '0')}:${minute.padStart(2, '0')}"`;
  } else if (dayOfMonth !== '*' && month === '*') {
    // 每月
    return `New-ScheduledTaskTrigger -Monthly -DaysOfMonth ${dayOfMonth} -At "${hour.padStart(2, '0')}:${minute.padStart(2, '0')}"`;
  }

  // 默认每天
  return `New-ScheduledTaskTrigger -Daily -At "${hour.padStart(2, '0')}:${minute.padStart(2, '0')}"`;
}

// 显示配置摘要
function showConfigSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('⏰ 定时备份任务配置摘要');
  console.log('='.repeat(60));

  console.log('\n📊 备份计划:');
  if (backupConfig.mongodb.enabled) {
    console.log(`   MongoDB: ${backupConfig.mongodb.schedule} (保留${backupConfig.mongodb.retention}天)`);
  }
  if (backupConfig.redis.enabled) {
    console.log(`   Redis: ${backupConfig.redis.schedule} (保留${backupConfig.redis.retention}天)`);
  }
  if (backupConfig.config.enabled) {
    console.log(`   配置文件: ${backupConfig.config.schedule} (保留${backupConfig.config.retention}周)`);
  }
  if (backupConfig.full.enabled) {
    console.log(`   完整备份: ${backupConfig.full.schedule} (保留${backupConfig.full.retention}月)`);
  }

  console.log('\n📁 备份目录:');
  console.log(`   ${backupConfig.backupDir}`);

  console.log('\n📄 日志文件:');
  console.log(`   ${backupConfig.logDir}`);

  console.log('\n⚠️  重要提示:');
  console.log('   1. 确保备份目录有足够的磁盘空间');
  console.log('   2. 定期检查备份日志');
  console.log('   3. 定期测试备份恢复流程');
  console.log('   4. 考虑将备份复制到远程存储');

  console.log('='.repeat(60) + '\n');
}

// 主函数
async function main() {
  console.log('🚀 开始配置定时备份任务...\n');

  try {
    // 确保目录存在
    ensureDirectories();

    // 保存备份脚本
    const scriptsDir = saveBackupScripts();

    // 根据操作系统设置定时任务
    const platform = os.platform();
    if (platform === 'win32') {
      await setupWindowsTask(scriptsDir);
    } else {
      await setupLinuxCron(scriptsDir);
    }

    // 显示配置摘要
    showConfigSummary();

    console.log('✅ 定时备份任务配置完成！');

  } catch (error) {
    console.error('❌ 配置失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  backupConfig,
  generateMongoDBBackupScript,
  generateRedisBackupScript,
  generateConfigBackupScript,
  generateFullBackupScript,
  setupLinuxCron,
  setupWindowsTask
};
