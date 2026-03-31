---
name: mini-game-hub-project
overview: 开发一个类似4399的网页小游戏平台，采用Next.js全栈架构。前台实现游戏分类浏览、搜索、热门推荐、在线游戏播放、用户评分评论；后台实现管理员登录、游戏上传管理、分类管理、用户管理、数据统计等功能。
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - 现代简约
    - 卡片式
    - 渐变色
    - 游戏风格
    - 响应式
  fontSystem:
    fontFamily: Inter, PingFang-SC, Microsoft YaHei
    heading:
      size: 32px
      weight: 700
    subheading:
      size: 20px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#6366F1"
      - "#8B5CF6"
      - "#EC4899"
    background:
      - "#0F172A"
      - "#1E293B"
      - "#F8FAFC"
    text:
      - "#FFFFFF"
      - "#1E293B"
      - "#94A3B8"
    functional:
      - "#22C55E"
      - "#EF4444"
      - "#F59E0B"
todos:
  - id: init-project
    content: 使用 [subagent:Frontend Architect] 和 [subagent:Backend Architect] 初始化Next.js 14项目，配置TypeScript、Tailwind CSS、shadcn/ui和Prisma
    status: completed
  - id: create-database
    content: 使用 [subagent:Backend Architect] 设计并创建Prisma数据库模型（Game、Category、User、Comment）
    status: completed
    dependencies:
      - init-project
  - id: develop-api
    content: 使用 [subagent:Backend Architect] 开发RESTful API接口（游戏CRUD、分类、评论、管理员认证）
    status: completed
    dependencies:
      - create-database
  - id: build-frontend-pages
    content: 使用 [subagent:Frontend Architect] 构建前台页面（首页、游戏列表、游戏播放、搜索）
    status: completed
    dependencies:
      - develop-api
  - id: build-admin-panel
    content: 使用 [subagent:Frontend Architect] 开发后台管理系统（登录、游戏管理、分类管理、用户管理、数据统计）
    status: completed
    dependencies:
      - develop-api
  - id: design-ui
    content: 使用 [skill:ui-ux-pro-max] 设计并优化全部页面UI，确保美观和响应式
    status: completed
  - id: optimize-performance
    content: 使用 [skill:performance-expert] 优化前端性能（图片懒加载、代码分割、首屏渲染）
    status: completed
    dependencies:
      - build-frontend-pages
      - build-admin-panel
---

## 用户需求

开发一个类似4399的网页小游戏平台，包含前端展示和后台管理系统。

## 产品概述

一个面向游戏玩家的网页小游戏平台，提供游戏浏览、搜索、在线播放和社交互动功能，同时配备完整的后台管理系统供运营者管理游戏内容和用户数据。

## 核心功能

### 前台功能

- 游戏分类浏览（动作、益智、休闲、射击、策略等）
- 关键词搜索功能
- 热门推荐和最新游戏展示
- 在线游戏播放窗口（支持Flash和HTML5）
- 用户评分系统（1-5星）
- 用户评论互动系统
- 响应式布局适配各种设备

### 后台功能

- 管理员登录认证
- 游戏上传管理（游戏文件、封面图、游戏描述）
- 游戏分类管理（增删改查）
- 用户管理（查看用户、封禁管理）
- 数据统计（访问量、游戏数量、用户活跃度）

## 技术栈选择

- **框架**: Next.js 14 (App Router) 全栈一体化
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **文件存储**: 本地文件系统
- **认证**: JWT (JSON Web Token)

## 实施方案

### 系统架构

采用Next.js 14的App Router架构，实现前后端一体化：

- **前台**: Next.js服务端渲染页面，提升SEO和加载速度
- **API**: Next.js API Routes处理业务逻辑
- **后台**: 独立的管理员界面，JWT认证保护

### 性能优化

- 图片懒加载和优化
- 服务端渲染减少客户端负担
- 静态资源CDN加速（可选）
- 数据库索引优化查询

### 安全措施

- 管理员密码bcrypt加密
- JWT令牌过期机制
- 文件上传类型和大小限制
- SQL注入防护（Prisma ORM）
- XSS防护

## 数据库模型

### Game (游戏表)

```
id, title, slug, description, coverImage, gameFile, 
gameType(flash/html5), categoryId, tags, 
playCount, likeCount, averageRating, status, 
createdAt, updatedAt
```

### Category (分类表)

```
id, name, slug, icon, order, createdAt
```

### User (用户表)

```
id, username, email, password, avatar, role(admin/user), createdAt
```

### Comment (评论表)

```
id, gameId, userId, content, rating(1-5), createdAt
```

## 目录结构

```
mini-game-hub/
├── src/
│   ├── app/
│   │   ├── (user)/           # 前台用户界面
│   │   │   ├── page.tsx      # 首页
│   │   │   ├── games/        # 游戏列表
│   │   │   ├── play/[id]/    # 游戏播放页
│   │   │   └── search/       # 搜索页
│   │   ├── admin/            # 后台管理
│   │   │   ├── login/        # 管理员登录
│   │   │   ├── dashboard/    # 数据统计
│   │   │   ├── games/        # 游戏管理
│   │   │   ├── categories/   # 分类管理
│   │   │   └── users/        # 用户管理
│   │   └── api/              # API接口
│   │       ├── games/
│   │       ├── categories/
│   │       ├── comments/
│   │       └── admin/
│   ├── components/           # 组件库
│   ├── lib/                  # 工具函数
│   └── types/                # 类型定义
├── prisma/
│   └── schema.prisma         # 数据库模型
└── public/
    └── uploads/              # 上传文件目录
```

## 设计风格

采用现代简约风格，以游戏娱乐为主题，打造视觉活跃但不失专业的界面。

## 页面规划

1. **首页**: 顶部导航 + 热门推荐横幅 + 分类入口 + 热门游戏网格 + 页脚
2. **游戏列表页**: 侧边分类筛选 + 游戏卡片网格 + 分页
3. **游戏播放页**: 游戏播放器 + 游戏信息 + 评分评论区
4. **搜索页**: 搜索框 + 结果列表
5. **后台管理**: 侧边栏导航 + 内容区

## 设计特点

- 卡片式游戏展示，hover动效
- 鲜艳的渐变色强调色
- 游戏封面圆角设计
- 评分星星动画效果
- 流畅的页面切换过渡

## Agent Extensions

### Skill

- **ui-ux-pro-max**: AI驱动的UI/UX设计工具，用于设计和优化网页小游戏的用户界面，包括57种UI样式、95+配色方案、响应式设计等。
- **performance-expert**: 性能优化专家，用于优化页面加载速度、图片懒加载、首屏渲染等性能问题。

### SubAgent

- **Frontend Architect**: 前端架构师，负责前端架构设计和技术选型
- **Backend Architect**: 后端架构师，负责后端API设计和数据库架构
- **UI Designer**: UI设计师，负责界面设计和交互体验