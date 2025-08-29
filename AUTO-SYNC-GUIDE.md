# 🚀 自动同步指南

## 功能说明

本自动化系统可以监控本地文件变化并自动同步到 GitHub 仓库。

## 使用方法

### 1. 安装依赖
```bash
npm install
```

### 2. 启动自动同步

**方式一：前台运行（推荐开发时使用）**
```bash
npm run auto-sync
```

**方式二：后台运行**
```bash
npm run auto-sync:background
```

**方式三：新窗口运行**
```bash
npm run auto-sync:start
```

### 3. 停止自动同步
按 `Ctrl+C` 停止前台运行的监控。

## 配置说明

- **检查间隔**: 30秒（可在 `auto-sync.js` 中修改 `CHECK_INTERVAL`）
- **忽略目录**: node_modules, .git, .next, out, .github
- **提交信息**: 自动包含时间戳

## GitHub Actions 自动部署

已配置 GitHub Actions 工作流：
- 当代码推送到 `main` 分支时自动构建
- 可手动触发部署
- 自动同步日志记录

## 注意事项

1. 确保已安装 Git 并配置好 SSH 密钥
2. 首次使用需要先手动提交一次：
   ```bash
   git add .
   git commit -m "初始提交"
   git push origin main
   ```
3. 确保有写入 GitHub 仓库的权限

## 故障排除

- 查看日志: `tail -f sync.log`
- 检查 Git 状态: `git status`
- 检查网络连接

## 自定义配置

编辑 `auto-sync.js` 文件可以：
- 修改检查频率
- 添加忽略文件模式
- 自定义提交信息格式