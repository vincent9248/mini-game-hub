---
name: mini-game-hub-platform
overview: 开发一个类似4399的小游戏平台，包含用户端（游戏浏览、搜索、在线游戏、评分评论）和后台管理系统（管理员、游戏/分类/用户管理、数据统计）。采用Next.js全栈+PostgreSQL技术架构。
design:
  architecture:
    component: tdesign
  styleKeywords:
    - 霓虹
    - 深色主题
    - 游戏风格
    - 现代简约
    - 响应式
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 32px
      weight: 600
    subheading:
      size: 20px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#6B4EFF"
      - "#8B6FFF"
      - "#9D85FF"
    background:
      - "#0D0D1A"
      - "#1A1A2E"
      - "#16213E"
    text:
      - "#FFFFFF"
      - "#E8E8E8"
      - "#B8B8B8"
    functional:
      - "#00D9FF"
      - "#FF6B9D"
      - "#FFD93D"
      - "#4ADE80"
todos:
  - id: init-project
    content: 初始化Next.js项目，配置Prisma、PostgreSQL、TDesign React和Tailwind CSS
    status: completed
  - id: db-schema
    content: 设计并创建Prisma数据模型（User, Category, Game, Comment, Favorite）
    status: completed
    dependencies:
      - init-project
  - id: auth-system
    content: 实现NextAuth.js认证系统（注册、登录、会话管理、角色权限）
    status: completed
    dependencies:
      - db-schema
  - id: user-pages
    content: 开发用户端页面（首页、游戏列表、游戏详情、个人中心）
    status: completed
    dependencies:
      - auth-system
  - id: game-player
    content: 实现游戏播放功能（iframe嵌入、Flash/HTML5支持）
    status: completed
    dependencies:
      - user-pages
  - id: comment-system
    content: 开发评论系统（评分、评论列表、发表/编辑/删除）
    status: completed
    dependencies:
      - game-player
  - id: search-feature
    content: 实现搜索功能（关键词搜索、分类筛选、热门推荐）
    status: completed
    dependencies:
      - comment-system
  - id: admin-layout
    content: 开发管理后台布局（侧边栏、导航、数据统计仪表盘）
    status: completed
    dependencies:
      - search-feature
  - id: game-management
    content: 实现游戏管理功能（上传游戏文件/封面、CRUD操作）
    status: completed
    dependencies:
      - admin-layout
  - id: admin-features
    content: 完成分类管理和用户管理模块
    status: completed
    dependencies:
      - game-management
---

## 用户需求

开发一个类似4399的网页小游戏平台，包含用户端展示系统和后台管理系统。

## 用户端功能

- 游戏分类浏览（动作、益智、射击、策略、休闲等分类）
- 搜索功能（游戏名称、标签搜索）
- 热门推荐（首页推荐位、排行榜）
- 在线游戏播放窗口（Flash/HTML5游戏内嵌播放）
- 用户评分评论系统（1-5星评分、文字评论）
- 完整用户系统（注册/登录/个人中心/我的收藏）

## 后台管理功能

- 管理员登录认证
- 游戏上传与管理（上传游戏文件、封面图、标题、描述、分类）
- 分类管理（创建/编辑/删除游戏分类）
- 用户管理（查看/禁用用户）
- 数据统计（游戏数量、用户数量、访问量）

## 技术方案

- **前端框架**: Next.js 14 (App Router)
- **UI组件库**: Shadcn UI (基于Radix UI + Tailwind CSS)
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js (支持邮箱/密码注册登录)
- **文件存储**: 本地服务器存储 (public/games/)
- **样式**: Tailwind CSS

## 性能与体验要求

- 界面简洁美观，符合游戏平台风格
- 首屏加载快（图片懒加载、代码分割）
- 响应式布局，适配桌面和移动设备

## 技术栈选择

- **全栈框架**: Next.js 14 (App Router) + TypeScript
- **UI组件库**: Shadcn UI + Tailwind CSS
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js v5
- **状态管理**: React Hooks + SWR数据获取
- **文件上传**: Next.js API Routes + 本地存储
- **表单处理**: React Hook Form + Zod验证

## 项目架构

```
mini-game-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (user)/             # 用户端路由组
│   │   │   ├── layout.tsx      # 用户端布局
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── games/          # 游戏列表
│   │   │   ├── play/[id]/      # 游戏播放页
│   │   │   ├── search/         # 搜索页
│   │   │   ├── auth/           # 认证页面
│   │   │   └── profile/        # 个人中心
│   │   ├── (admin)/            # 管理后台路由组
│   │   │   ├── layout.tsx      # 管理后台布局
│   │   │   ├── dashboard/      # 数据统计
│   │   │   ├── games/          # 游戏管理
│   │   │   ├── categories/     # 分类管理
│   │   │   └── users/          # 用户管理
│   │   ├── api/                # API路由
│   │   │   ├── auth/           # 认证API
│   │   │   ├── games/          # 游戏API
│   │   │   ├── categories/     # 分类API
│   │   │   ├── comments/       # 评论API
│   │   │   └── upload/         # 文件上传API
│   │   ├── layout.tsx          # 根布局
│   │   └── globals.css         # 全局样式
│   ├── components/
│   │   ├── ui/                # Shadcn UI组件 (button, card, dialog, input, etc.)
│   │   ├── game/              # 游戏相关组件 (GameCard, GamePlayer, Rating)
│   │   ├── layout/            # 布局组件 (Header, Footer, Sidebar)
│   │   └── admin/             # 管理后台组件 (DataTable, AdminForm)
│   ├── components.json         # Shadcn CLI配置文件
│   ├── lib/                    # 工具函数
│   │   ├── prisma.ts          # Prisma客户端
│   │   ├── auth.ts            # 认证配置
│   │   └── utils.ts           # 通用工具
│   └── types/                  # TypeScript类型
├── prisma/
│   └── schema.prisma          # 数据库模型
├── public/
│   ├── games/                 # 游戏文件存储
│   ├── covers/                # 游戏封面存储
│   └── avatars/               # 用户头像存储
└── package.json
```

## 数据模型设计

- **User**: 用户（id, email, password, name, avatar, role, createdAt）
- **Category**: 分类（id, name, slug, description, order）
- **Game**: 游戏（id, title, slug, description, coverImage, gameFile, categoryId, playCount, isHot, createdAt）
- **Comment**: 评论（id, content, rating, userId, gameId, createdAt）
- **Favorite**: 收藏（id, userId, gameId, createdAt）

## 核心模块实现

1. **认证系统**: NextAuth.js实现邮箱注册/登录/会话管理
2. **游戏播放**: iframe内嵌游戏文件，支持Flash(.swf)和HTML5(.html)
3. **评论系统**: 5星评分+文字评论，支持编辑删除
4. **搜索**: 基于标题和标签的全文搜索
5. **文件上传**: 支持游戏文件和图片上传到本地存储

## 设计风格

采用现代游戏平台风格，融合活泼与专业感。深色主题为主，搭配明亮的霓虹色彩作为点缀，营造游戏氛围。

### Shadcn UI配置

- **主题**: 深色模式 (dark theme) + 自定义游戏风格配色
- **主色**: #6B4EFF (紫色渐变)
- **强调色**: #00D9FF (青色霓虹), #FF6B9D (粉色), #FFD93D (金色)
- **背景色**: #0D0D1A, #1A1A2E, #16213E

### Shadcn组件清单

基础组件: Button, Card, Dialog, DropdownMenu, Input, Textarea, Select, Table, Tabs, Badge, Avatar, Skeleton, Separator, Progress
表单组件: Form (react-hook-form + zod)
数据展示: DataTable, Pagination

## 页面规划

### 用户端页面 (6个核心页面)

1. **首页** - 热门推荐轮播、游戏分类入口、热门游戏列表
2. **游戏列表页** - 分类筛选、排序、分页游戏卡片展示
3. **游戏详情页** - 游戏信息、评分评论、开始游戏按钮
4. **游戏播放页** - 全屏游戏播放器、评论区
5. **搜索页** - 搜索结果列表、筛选功能
6. **个人中心** - 用户信息、我的收藏、我的评论

### 管理后台页面 (4个核心页面)

1. **仪表盘** - 数据统计卡片、访问趋势图表
2. **游戏管理** - 游戏列表、添加/编辑游戏表单
3. **分类管理** - 分类列表、添加/编辑分类
4. **用户管理** - 用户列表、用户详情、禁用启用

## 布局结构

### 用户端

- 顶部导航栏：Logo、搜索框、导航菜单、用户头像
- 内容区域：根据页面功能灵活布局
- 底部：版权信息、友链

### 管理后台

- 左侧侧边栏：导航菜单、Logo
- 顶部：面包屑、用户信息
- 内容区域：表格、表单、数据展示

## 组件设计 (Shadcn UI风格)

- 游戏卡片 (GameCard): 使用Card组件，封面图、标题、评分Badge、播放量、收藏按钮
- 游戏播放器 (GamePlayer): Dialog组件封装，自适应尺寸、全屏按钮、加载Skeleton
- 评论组件 (CommentSection): Avatar + Card组合，评分星级、评论内容、时间戳
- 表单组件: Input, Textarea, Select, FileUpload, Button
- 数据表格 (DataTable): Table, Pagination, DropdownMenu, Badge组件组合

## Agent Extensions

### Skill

- **ui-ux-pro-max**: UI/UX设计优化专家
- 用途: 设计游戏平台的界面布局和组件样式
- 预期效果: 提供专业的UI设计建议，确保界面美观、交互流畅

### SubAgent

- **Frontend Architect**: 前端架构师
- 用途: 设计前端架构和组件结构
- 预期效果: 提供前端开发指导和代码规范
- **Backend Architect**: 后端架构师
- 用途: 设计后端API和数据模型
- 预期效果: 提供数据库设计和API规范