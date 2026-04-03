/**
 * 自动修复脚本
 * 定期运行错误检测和修复
 */

const { QuickFixTool } = require('./error-tracker');

async function runAutoFix() {
  console.log('='.repeat(60));
  console.log('开始自动修复流程');
  console.log('='.repeat(60));
  
  const quickFixTool = new QuickFixTool();
  
  try {
    // 运行自动修复
    await quickFixTool.autoFix();
    
    // 生成修复报告
    const report = quickFixTool.generateFixReport();
    
    console.log('\n修复报告:');
    console.log('='.repeat(60));
    console.log(`生成时间: ${report.timestamp}`);
    console.log(`总错误数: ${report.totalErrors}`);
    console.log(`待处理错误: ${report.pendingErrors}`);
    console.log(`处理中错误: ${report.inProgressErrors}`);
    console.log(`已完成错误: ${report.completedErrors}`);
    console.log(`失败错误: ${report.failedErrors}`);
    console.log(`总修复数: ${report.totalFixes}`);
    console.log(`成功率: ${report.successRate}`);
    console.log('='.repeat(60));
    
    if (report.recentErrors.length > 0) {
      console.log('\n最近的错误:');
      report.recentErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message} (${error.type})`);
      });
    }
    
    if (report.recentFixes.length > 0) {
      console.log('\n最近的修复:');
      report.recentFixes.forEach((fix, index) => {
        console.log(`${index + 1}. ${fix.description} - ${fix.status}`);
      });
    }
    
  } catch (error) {
    console.error('自动修复过程中出错:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('自动修复流程完成');
  console.log('='.repeat(60));
}

// 运行自动修复
runAutoFix();

// 导出函数（用于其他模块调用）
module.exports = { runAutoFix };
