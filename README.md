# Mini Game Hub - 小游戏平台

<p align="center">
  <img src="public/favicon.ico" alt="Mini Game Hub Logo" width="120" height="120">
</p>

<p align="center">
  <strong>一个类似 4399 的现代化网页小游戏平台</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#api-文档">API 文档</a>
</p>

---

## 📖 项目简介

Mini Game Hub 是一个基于 Next.js 14 构建的现代化网页小游戏平台，提供类似 4399 的游戏浏览、游玩、评论和收藏功能。项目采用前后端一体化架构，包含完整的用户系统和管理后台。

### 核心亮点

- 🎮 **即点即玩** - 无需下载，在线游玩 HTML5 游戏
- 🎨 **现代 UI** - 基于 Shadcn UI 的精美霓虹风格界面
- 🔐 **双认证系统** - 用户与管理员独立认证体系
- 📊 **完整后台** - 游戏管理、分类管理、用户管理、数据统计
- 🚀 **高性能** - 服务端渲染 + 数据库优化查询

---

## ✨ 功能特性

### 用户端

| 功能 | 描述 |
|------|------|
| 🏠 **首页展示** | 热门游戏推荐、最新上线、游戏分类导航 |
| 🎮 **游戏列表** | 多维度排序（最新/热门/评分/名称）、分类筛选、实时搜索 |
| 🕹️ **在线游玩** | 支持 HTML5 游戏在线播放，自动记录游玩次数 |
| 💬 **评论系统** | 游戏评分（1-5星）、评论发表、评论列表展示 |
| ❤️ **收藏功能** | 收藏喜欢的游戏，个人中心管理收藏列表 |
| 👤 **个人中心** | 用户资料管理、收藏游戏管理、评论历史 |

### 管理后台

| 功能 | 描述 |
|------|------|
| 📊 **数据仪表盘** | 游戏统计、用户统计、游玩趋势图表 |
| 🎮 **游戏管理** | 游戏CRUD、封面上传、状态切换（热门/发布） |
| 📁 **分类管理** | 分类CRUD、排序管理、游戏数量统计 |
| 👥 **用户管理** | 用户列表、禁用/启用、搜索筛选 |
| 🔐 **权限控制** | 独立管理员认证、Token 验证 |

---

## 🛠 技术栈

### 前端框架
- **[Next.js 14](https://nextjs.org/)** - React 全栈框架（App Router）
- **[React 18](https://react.dev/)** - 用户界面库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全

### UI 组件
- **[Shadcn UI](https://ui.shadcn.com/)** - 基于 Radix UI 的组件库
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化 CSS 框架
- **[Lucide Icons](https://lucide.dev/)** - 图标库

### 后端技术
- **[Prisma](https://www.prisma.io/)** - ORM 数据库工具
- **[PostgreSQL](https://www.postgresql.org/)** - 关系型数据库
- **[NextAuth.js v5](https://authjs.dev/)** - 用户认证
- **[Jose](https://github.com/panva/jose)** - JWT Token 处理

### 表单与验证
- **[React Hook Form](https://react-hook-form.com/)** - 表单管理
- **[Zod](https://zod.dev/)** - Schema 验证

### 图表
- **[Recharts](https://recharts.org/)** - 数据可视化图表

---

## 📋 环境要求

| 软件 | 版本要求 |
|------|---------|
| Node.js | >= 18.0.0 |
| PostgreSQL | >= 14.0 |
| npm / pnpm / yarn | 任意包管理器 |

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd mini-game-hub
```

### 2. 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 3. 配置环境变量

创建 `.env` 文件：

```bash
# 数据库连接
DATABASE_URL="postgresql://用户名:密码@localhost:5432/minigamehub?schema=public"

# NextAuth 配置（用户认证）
AUTH_SECRET="生成一个32字符以上的随机字符串"
AUTH_URL="http://localhost:3000"

# 管理员认证密钥
ADMIN_SECRET_KEY="生产环境请更换为安全的密钥"

# 默认管理员账户（首次初始化使用）
ADMIN_DEFAULT_EMAIL="admin@example.com"
ADMIN_DEFAULT_PASSWORD="admin123456"
ADMIN_DEFAULT_NAME="超级管理员"
```

> 💡 生成 AUTH_SECRET: `openssl rand -base64 32`

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库 Schema
npm run db:push

# 初始化管理员账户
npm run db:init-admin

# （可选）填充示例数据
npm run db:seed

# （可选）打开 Prisma Studio 管理数据
npm run db:studio
```

### 5. 启动开发服务器

```bash
npm run dev
```

### 6. 访问页面

| 页面 | 地址 |
|------|------|
| 用户端首页 | http://localhost:3000 |
| 游戏列表 | http://localhost:3000/games |
| 管理后台 | http://localhost:3000/admin |
| 管理员登录 | http://localhost:3000/admin/login |

---

## 📁 项目结构

```
mini-game-hub/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── seed.ts                # 示例数据填充脚本
├── public/                     # 静态资源文件
├── scripts/
│   └── init-admin.ts          # 管理员初始化脚本
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/            # 管理后台路由组
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/  # 仪表盘
│   │   │   │   ├── games/      # 游戏管理
│   │   │   │   ├── categories/ # 分类管理
│   │   │   │   └── users/      # 用户管理
│   │   │   └── layout.tsx      # 管理后台布局
│   │   ├── (user)/             # 用户端路由组
│   │   │   ├── games/          # 游戏列表
│   │   │   ├── play/           # 游戏游玩
│   │   │   ├── favorites/      # 我的收藏
│   │   │   ├── profile/        # 个人中心
│   │   │   └── layout.tsx      # 用户端布局
│   │   ├── api/                # API 路由
│   │   │   ├── admin/          # 管理员 API
│   │   │   ├── auth/           # 认证 API
│   │   │   ├── games/          # 游戏 CRUD
│   │   │   ├── categories/     # 分类 CRUD
│   │   │   ├── users/          # 用户管理
│   │   │   └── comments/       # 评论 API
│   │   ├── auth/               # 认证页面
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/
│   │   ├── ui/                 # Shadcn UI 组件
│   │   └── layout/             # 布局组件
│   └── lib/
│       ├── prisma.ts           # Prisma 客户端
│       ├── data-service.ts     # 数据服务层
│       ├── auth.ts             # 用户认证配置
│       └── admin-auth.ts       # 管理员认证
├── components.json             # Shadcn UI 配置
├── tailwind.config.ts          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

---

## 📚 API 文档

### 认证相关

| 方法 | 路由 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/auth/session` | 获取用户会话 |

### 管理员认证

| 方法 | 路由 | 描述 |
|------|------|------|
| POST | `/api/admin/login` | 管理员登录 |
| POST | `/api/admin/logout` | 管理员登出 |
| GET | `/api/admin/session` | 获取管理员会话 |

### 游戏管理

| 方法 | 路由 | 描述 |
|------|------|------|
| GET | `/api/games` | 获取游戏列表（支持筛选、排序、搜索） |
| POST | `/api/games` | 创建游戏（需管理员权限） |
| GET | `/api/games/[id]` | 获取游戏详情 |
| PUT | `/api/games/[id]` | 更新游戏（需管理员权限） |
| DELETE | `/api/games/[id]` | 删除游戏（需管理员权限） |
| PATCH | `/api/games/[id]` | 切换游戏状态（热门/发布） |

### 分类管理

| 方法 | 路由 | 描述 |
|------|------|------|
| GET | `/api/categories` | 获取分类列表 |
| POST | `/api/categories` | 创建分类（需管理员权限） |
| PUT | `/api/categories/[id]` | 更新分类（需管理员权限） |
| DELETE | `/api/categories/[id]` | 删除分类（需管理员权限） |

### 用户管理

| 方法 | 路由 | 描述 |
|------|------|------|
| GET | `/api/users` | 获取用户列表（需管理员权限） |
| PATCH | `/api/users/[id]` | 更新用户状态（需管理员权限） |
| DELETE | `/api/users/[id]` | 删除用户（需管理员权限） |

### 评论系统

| 方法 | 路由 | 描述 |
|------|------|------|
| GET | `/api/comments?gameId=xxx` | 获取游戏评论 |
| POST | `/api/comments` | 发表评论（需登录） |
| DELETE | `/api/comments/[id]` | 删除评论 |

---

## 🗄️ 数据库模型

### ER 关系图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Admin    │     │    User     │     │  Category   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ email       │     │ email       │     │ name        │
│ password    │     │ password    │     │ slug        │
│ name        │     │ name        │     │ description │
│ avatar      │     │ avatar      │     │ icon        │
│ isActive    │     │ role        │     │ order       │
│ lastLogin   │     │ isActive    │     └──────┬──────┘
└─────────────┘     └──────┬──────┘            │
                           │                   │
                           │    ┌──────────────┘
                           │    │
                           ▼    ▼
                    ┌─────────────┐
                    │    Game     │
                    ├─────────────┤
                    │ id          │
                    │ title       │
                    │ slug        │
                    │ description │
                    │ coverImage  │
                    │ gameFile    │
                    │ gameType    │
                    │ categoryId  │
                    │ playCount   │
                    │ isHot       │
                    │ isPublished │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
     ┌───────────┐  ┌───────────┐  ┌───────────┐
     │  Comment  │  │ Favorite  │  │           │
     ├───────────┤  ├───────────┤  └───────────┘
     │ content   │  │ userId    │
     │ rating    │  │ gameId    │
     │ userId    │  └───────────┘
     │ gameId    │
     └───────────┘
```

### 模型说明

| 模型 | 描述 |
|------|------|
| **Admin** | 管理员账户，独立于用户系统 |
| **User** | 普通用户，支持角色（USER/ADMIN） |
| **Category** | 游戏分类 |
| **Game** | 游戏信息，包含封面、文件、统计 |
| **Comment** | 用户评论，包含评分（1-5星） |
| **Favorite** | 用户收藏关联表 |

---

## 🎨 设计规范

### 主题色彩

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 霓虹紫 | `#6B4EFF` | 主色调、按钮、链接 |
| 霓虹青 | `#00D9FF` | 强调色、渐变 |
| 霓虹粉 | `#FF6B9D` | 热门标签、特殊强调 |
| 霓虹金 | `#FFD93D` | 评分星星、NEW 标签 |
| 深色背景 | `#0D0D1A` | 主背景 |
| 次级背景 | `#1A1A2E` | 卡片背景 |

### 组件规范

添加 Shadcn UI 组件：

```bash
npx shadcn-ui@latest add button card dialog input textarea select table tabs badge avatar
```

---

## 📝 常用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 代码检查

# 数据库
npm run db:generate      # 生成 Prisma Client
npm run db:push          # 推送 Schema 到数据库
npm run db:studio        # 打开 Prisma Studio
npm run db:init-admin    # 初始化管理员账户
npm run db:seed          # 填充示例数据
```

---

## 🤝 贡献指南

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 类型规范
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS 原子类

### 提交信息规范

```
feat: 新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

---

## 🔒 安全注意事项

1. **生产环境必须更换以下密钥**：
   - `AUTH_SECRET` - 用户认证密钥
   - `ADMIN_SECRET_KEY` - 管理员认证密钥
   - 默认管理员密码

2. **数据库安全**：
   - 使用强密码
   - 限制数据库访问权限
   - 定期备份

3. **HTTPS**：
   - 生产环境必须使用 HTTPS
   - 设置正确的 `AUTH_URL`

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<p align="center">
  Made with ❤️ by Mini Game Hub Team
</p>
