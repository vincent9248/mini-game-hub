---
name: MiniGameHub-小游戏平台开发计划
overview: 基于Next.js + Supabase开发4399风格小游戏平台，包含前台展示（游戏分类、搜索、推荐、在线游戏、评分评论）和后台管理（登录、游戏/分类/用户管理、数据统计），采用本地存储存放游戏文件。
design:
  architecture:
    component: shadcn
  styleKeywords:
    - 现代游戏风格
    - 深色主题
    - 卡片式
    - 沉浸式
  fontSystem:
    fontFamily: system-ui
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
    background:
      - "#0F172A"
      - "#1E293B"
    text:
      - "#F8FAFC"
      - "#94A3B8"
    functional:
      - "#10B981"
      - "#EF4444"
      - "#F59E0B"
todos:
  - id: init-project
    content: 初始化Next.js 14项目，配置TypeScript、Tailwind CSS、shadcn/ui
    status: completed
  - id: setup-supabase
    content: 配置Supabase客户端，创建数据库Schema和种子数据
    status: completed
    dependencies:
      - init-project
  - id: create-layout
    content: 创建前台布局组件：导航栏、页脚、响应式容器
    status: completed
    dependencies:
      - init-project
  - id: build-homepage
    content: 构建首页：热门推荐、分类浏览、最新游戏模块
    status: completed
    dependencies:
      - create-layout
      - setup-supabase
  - id: build-game-detail
    content: 构建游戏详情页：播放器、评分评论系统
    status: completed
    dependencies:
      - setup-supabase
  - id: build-category-search
    content: 构建分类页和搜索页
    status: completed
    dependencies:
      - create-layout
  - id: build-admin-auth
    content: 构建后台登录认证系统
    status: completed
    dependencies:
      - init-project
  - id: build-admin-dashboard
    content: 构建后台仪表盘：数据统计图表
    status: completed
    dependencies:
      - build-admin-auth
  - id: build-admin-games
    content: 构建游戏管理：列表、上传、编辑功能
    status: completed
    dependencies:
      - build-admin-auth
  - id: build-admin-categories
    content: 构建分类管理和用户管理页面
    status: completed
    dependencies:
      - build-admin-auth
  - id: optimize-performance
    content: 性能优化：图片懒加载、列表虚拟化、API缓存
    status: completed
    dependencies:
      - build-homepage
      - build-game-detail
---

## 产品概述

开发一个类似4399的网页小游戏平台，包含前台用户端和后台管理系统。

## 核心功能

### 前台功能

1. **首页展示**：热门推荐游戏、分类入口、最新游戏
2. **游戏分类浏览**：动作、休闲、射击、益智等分类筛选
3. **搜索功能**：按名称、标签搜索，实时建议
4. **游戏详情页**：封面展示、游戏播放、评分评论
5. **在线播放**：HTML5内嵌/Falash播放器，支持全屏

### 后台功能

1. **管理员认证**：JWT token安全登录
2. **游戏管理**：上传游戏文件、封面、描述，支持Flash和HTML5
3. **分类管理**：增删改分类，排序设置
4. **用户管理**：查看用户、封禁管理
5. **数据统计**：播放量、活跃度可视化

## 技术栈

- **前端框架**：Next.js 14 (App Router) + TypeScript
- **UI组件**：Tailwind CSS + shadcn/ui
- **数据库**：Supabase PostgreSQL
- **文件存储**：本地文件系统 (/public/uploads)
- **数据获取**：SWR
- **图表**：Recharts
- **认证**：JWT + bcrypt

## 架构设计

采用 Next.js 全栈架构，前台 SSR/CSR 混合，后台纯 CSR，API Routes 提供数据服务。

### 目录结构

```
MiniGameHub/
├── public/uploads/           # 本地文件存储
├── src/app/(main)/           # 前台页面
│   ├── page.tsx              # 首页
│   ├── category/[slug]/      # 分类页
│   ├── game/[id]/            # 游戏详情页
│   └── search/               # 搜索页
├── src/app/(admin)/          # 后台页面
│   └── admin/
│       ├── dashboard/        # 仪表盘
│       ├── games/            # 游戏管理
│       ├── categories/       # 分类管理
│       └── users/            # 用户管理
├── src/app/api/              # API Routes
├── src/components/           # 组件库
└── src/lib/                   # 工具函数
```

## 设计风格

采用现代游戏风格设计，深色主题为主，融合卡片式布局，营造沉浸式游戏平台体验。

### 色彩方案

- 主色：#6366F1 (Indigo) - 按钮、链接
- 背景：#0F172A (深色) + #1E293B (卡片)
- 文字：#F8FAFC (主) + #94A3B8 (次)
- 功能：#10B981 (成功) + #EF4444 (错误)

### 布局特点

- 首页：导航 + 搜索 + 分类横滑 + 游戏网格
- 详情页：左侧播放器 + 右侧信息评论
- 后台：左侧边栏 + 右侧内容区

### 交互效果

- 游戏卡片 hover 放大效果
- 渐变色强调交互元素
- 平滑过渡动画
- 响应式适配移动端

## Agent Extensions

### Skill

- **ui-ux-pro-max**
- 用途：生成高质量UI/UX代码
- 预期效果：完整的React组件代码

### SubAgent

- **Frontend Architect**
- 用途：设计前端架构和组件结构
- 预期效果：合理的模块划分和状态管理

- **Backend Architect**
- 用途：设计后端API和数据模型
- 预期效果：RESTful API设计和数据库Schema