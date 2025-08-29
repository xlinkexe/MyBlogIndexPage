# 我的博客首页

一个现代化的博客首页，包含导航栏和管理后台。

## 功能特性

- 🎨 响应式设计的主页
- 🧭 可配置的导航菜单
- ⚙️ 管理员后台 (/dashboard)
- 🔐 基于环境变量的身份验证
- 📱 移动端友好

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
复制 `.env.local.example` 为 `.env.local` 并设置管理员凭据：
```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:3000

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库

2. 在 Vercel 中导入项目：
   - 连接到你的 GitHub 账户
   - 选择此仓库
   - 配置环境变量：
     - `ADMIN_USERNAME`: 管理员用户名
     - `ADMIN_PASSWORD`: 管理员密码

3. 部署！

## 配置说明

编辑 `config.json` 文件来配置网站：

- `siteName`: 网站名称
- `logo`: Logo 图片路径
- `backgroundImage`: 背景图片路径
- `author`: 作者信息（名称、头像、简介）
- `navigation`: 导航菜单项

## 后台管理

访问 `/dashboard` 进入管理后台，使用配置的管理员凭据登录后可以：

- 修改网站基本信息
- 更新作者信息
- 编辑导航菜单
- 实时预览更改

## 技术栈

- Next.js 14
- React 18
- TypeScript
- CSS-in-JS (styled-jsx)