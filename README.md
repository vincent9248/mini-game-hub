# Mini Game Hub - 小游戏平台

一个类似 4399 的网页小游戏平台，基于 Next.js 14 + PostgreSQL + Shadcn UI 构建。

## ✨ 功能特性

### 用户端
- 🎮 游戏分类浏览（动作、益智、射击、策略、休闲等）
- 🔍 搜索功能（游戏名称、标签搜索）
- ⭐ 热门推荐（首页推荐位、排行榜）
- 📺 在线游戏播放（支持 Flash/HTML5）
- 💬 用户评分评论系统

### 管理后台
- 🔐 管理员登录认证
- 📤 游戏上传管理（游戏文件、封面、描述）
- 📁 分类管理
- 👥 用户管理
- 📊 数据统计

## 🛠 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: Shadcn UI + Tailwind CSS
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js v5
- **表单**: React Hook Form + Zod

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- pnpm / npm / yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd mini-game-hub
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入数据库连接信息和认证密钥
```

4. **初始化数据库**
```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库 schema
npm run db:push

# (可选) 打开 Prisma Studio 管理数据
npm run db:studio
```

5. **启动开发服务器**
```bash
npm run dev
```

6. **访问页面**
- 用户端: http://localhost:3000
- 管理后台: http://localhost:3000/admin

## 📁 项目结构

```
mini-game-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (user)/             # 用户端页面
│   │   ├── (admin)/            # 管理后台页面
│   │   └── api/                # API 路由
│   ├── components/
│   │   ├── ui/                 # Shadcn UI 组件
│   │   ├── game/              # 游戏相关组件
│   │   └── layout/             # 布局组件
│   └── lib/                    # 工具函数
├── prisma/
│   └── schema.prisma           # 数据库模型
└── public/                     # 静态资源
```

## 🎨 设计规范

### 主题色彩
- 主色: `#6B4EFF` (紫色)
- 强调色: `#00D9FF` (青色), `#FF6B9D` (粉色), `#FFD93D` (金色)
- 背景: `#0D0D1A`, `#1A1A2E`

### Shadcn 组件
使用 `npx shadcn-ui@latest add <component>` 添加组件:
```bash
npx shadcn-ui@latest add button card dialog input textarea select table tabs badge avatar skeleton
```

## 📝 API 路由

| 路由 | 描述 |
|------|------|
| `POST /api/auth/*` | 认证相关 |
| `GET/POST /api/games` | 游戏 CRUD |
| `GET/POST /api/categories` | 分类 CRUD |
| `GET/POST /api/comments` | 评论 CRUD |
| `POST /api/upload` | 文件上传 |

## 🔧 数据库模型

- **User**: 用户 (id, email, password, name, avatar, role)
- **Category**: 分类 (id, name, slug, description)
- **Game**: 游戏 (id, title, slug, coverImage, gameFile, categoryId, playCount)
- **Comment**: 评论 (id, content, rating, userId, gameId)
- **Favorite**: 收藏 (id, userId, gameId)

## 📄 License

MIT License
