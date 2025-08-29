const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const REPO_PATH = __dirname;
const CHECK_INTERVAL = 30000; // 30秒检查一次
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'out',
  '.github'
];

let lastCommitHash = null;

function getCurrentCommitHash() {
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_PATH }).toString().trim();
  } catch {
    return null;
  }
}

function hasChanges() {
  try {
    const status = execSync('git status --porcelain', { cwd: REPO_PATH }).toString();
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

function commitAndPush() {
  try {
    console.log('🚀 检测到文件变化，准备提交...');
    
    // 添加所有文件
    execSync('git add .', { cwd: REPO_PATH, stdio: 'inherit' });
    
    // 提交
    const timestamp = new Date().toLocaleString('zh-CN');
    execSync(`git commit -m "🔁 自动同步: ${timestamp}"`, { 
      cwd: REPO_PATH, 
      stdio: 'inherit' 
    });
    
    // 推送到GitHub
    execSync('git push origin main', { 
      cwd: REPO_PATH, 
      stdio: 'inherit' 
    });
    
    console.log('✅ 自动同步完成！');
    lastCommitHash = getCurrentCommitHash();
    
  } catch (error) {
    console.log('❌ 同步失败:', error.message);
  }
}

function startWatching() {
  console.log('👀 开始监控文件变化...');
  console.log('📁 监控目录:', REPO_PATH);
  console.log('⏰ 检查间隔:', CHECK_INTERVAL / 1000 + '秒');
  console.log('──────────────────────────────');
  
  lastCommitHash = getCurrentCommitHash();
  
  setInterval(() => {
    const currentHash = getCurrentCommitHash();
    
    if (currentHash !== lastCommitHash) {
      lastCommitHash = currentHash;
      return; // 已经有新的提交
    }
    
    if (hasChanges()) {
      commitAndPush();
    }
  }, CHECK_INTERVAL);
}

// 启动监控
startWatching();