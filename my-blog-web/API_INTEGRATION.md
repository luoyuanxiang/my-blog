# 前端 API 集成说明

## 🚀 项目概述

本项目已成功集成 Spring Boot 后端 API，实现了完整的前后端分离架构。前端使用 Next.js 14 + React + TypeScript，后端使用 Spring Boot 3 + JPA + MySQL。

## 📁 API 服务结构

```
src/lib/api/
├── config.ts          # API 配置和端点定义
├── client.ts          # HTTP 客户端封装
├── auth.ts            # 认证相关 API
├── articles.ts        # 文章管理 API
├── categories.ts      # 分类管理 API
├── tags.ts           # 标签管理 API
├── comments.ts        # 评论管理 API
├── friend-links.ts   # 友链管理 API
├── guestbook.ts      # 留言板 API
├── system-settings.ts # 系统设置 API
├── index.ts          # 统一导出
└── examples.ts       # 使用示例
```

## 🔧 环境配置

### 1. 环境变量设置

创建 `.env.local` 文件：

```bash
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8080

# 应用配置
NEXT_PUBLIC_APP_NAME=我的博客
NEXT_PUBLIC_APP_DESCRIPTION=一个优雅的个人博客
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 开发环境配置
NODE_ENV=development
```

### 2. 后端服务启动

```bash
# 进入后端目录
cd my-blog-server

# 启动 Spring Boot 应用
./start.sh  # Linux/Mac
# 或
start.bat   # Windows
```

## 📋 API 服务使用

### 1. 认证服务

```typescript
import { authApiService } from '@/lib/api';

// 用户登录
const loginResponse = await authApiService.login({
  username: 'admin',
  password: 'password'
});

// 获取当前用户信息
const user = await authApiService.getCurrentUser();

// 用户登出
await authApiService.logout();
```

### 2. 文章服务

```typescript
import { articleApiService } from '@/lib/api';

// 获取文章列表
const articles = await articleApiService.getArticles({
  page: 1,
  limit: 10,
  search: 'Next.js',
  category: 'frontend'
});

// 获取文章详情
const article = await articleApiService.getArticle('1');

// 创建文章
const newArticle = await articleApiService.createArticle({
  title: '新文章',
  content: '文章内容',
  categoryId: '1',
  tagIds: ['1', '2']
});
```

### 3. 分类服务

```typescript
import { categoryApiService } from '@/lib/api';

// 获取所有分类
const categories = await categoryApiService.getAllCategories();

// 创建分类
const category = await categoryApiService.createCategory({
  name: '前端开发',
  description: '前端技术相关文章',
  color: '#3B82F6'
});
```

### 4. 标签服务

```typescript
import { tagApiService } from '@/lib/api';

// 获取所有标签
const tags = await tagApiService.getAllTags();

// 获取热门标签
const popularTags = await tagApiService.getPopularTags(20);

// 创建标签
const tag = await tagApiService.createTag({
  name: 'React',
  description: 'React 相关文章',
  color: '#61DAFB'
});
```

### 5. 评论服务

```typescript
import { commentApiService } from '@/lib/api';

// 获取文章评论
const comments = await commentApiService.getArticleComments('1');

// 创建评论
const comment = await commentApiService.createComment({
  articleId: '1',
  author: '张三',
  email: 'zhangsan@example.com',
  content: '这是一条评论'
});

// 点赞评论
await commentApiService.likeComment('1');
```

### 6. 友链服务

```typescript
import { friendLinkApiService } from '@/lib/api';

// 获取已审核的友链
const friendLinks = await friendLinkApiService.getApprovedFriendLinks();

// 申请友链
const friendLink = await friendLinkApiService.applyFriendLink({
  name: '示例网站',
  url: 'https://example.com',
  description: '这是一个示例网站'
});
```

### 7. 留言板服务

```typescript
import { guestbookApiService } from '@/lib/api';

// 获取已审核的留言
const messages = await guestbookApiService.getApprovedMessages();

// 创建留言
const message = await guestbookApiService.createMessage({
  author: '李四',
  email: 'lisi@example.com',
  content: '这是一条留言'
});

// 点赞留言
await guestbookApiService.likeMessage('1');
```

### 8. 系统设置服务

```typescript
import { systemSettingApiService } from '@/lib/api';

// 获取网站信息
const siteInfo = await systemSettingApiService.getSiteInfo();

// 获取社交媒体链接
const socialLinks = await systemSettingApiService.getSocialLinks();

// 更新设置
await systemSettingApiService.updateSetting('site.name', '我的新博客');
```

## 🔄 页面集成状态

### ✅ 已集成的页面

1. **首页** (`/`) - 使用真实 API 获取文章、分类、标签数据
2. **文章列表页** (`/articles`) - 支持搜索、筛选、分页

### 🔄 待集成的页面

1. **文章详情页** (`/articles/[slug]`) - 需要集成文章详情和评论 API
2. **分类页面** (`/categories`) - 需要集成分类列表 API
3. **标签页面** (`/tags`) - 需要集成标签列表 API
4. **归档页面** (`/archive`) - 需要集成文章归档 API
5. **友链页面** (`/links`) - 需要集成友链列表 API
6. **留言板页面** (`/guestbook`) - 需要集成留言板 API
7. **管理后台** (`/admin/*`) - 需要集成所有管理 API

## 🛠️ 错误处理

API 服务包含完整的错误处理机制：

```typescript
try {
  const data = await articleApiService.getArticles();
  // 处理成功数据
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API 错误: ${error.status} - ${error.message}`);
  } else {
    console.error('未知错误:', error);
  }
}
```

## 🔐 认证机制

- 使用 JWT Token 进行身份认证
- Token 自动存储在 localStorage
- 请求时自动添加 Authorization 头
- 支持 Token 刷新和自动登出

## 📊 数据流

```
前端组件 → API 服务 → HTTP 客户端 → 后端 API → 数据库
    ↓           ↓           ↓           ↓
  状态管理   错误处理   请求拦截   响应处理
```

## 🚀 下一步计划

1. **完成剩余页面集成** - 将所有页面与后端 API 集成
2. **添加数据缓存** - 使用 React Query 或 SWR 优化数据获取
3. **实现实时更新** - 使用 WebSocket 实现评论和留言的实时更新
4. **添加离线支持** - 使用 Service Worker 实现离线功能
5. **性能优化** - 添加图片懒加载、代码分割等优化

## 📝 注意事项

1. **类型安全** - 所有 API 调用都有完整的 TypeScript 类型支持
2. **错误边界** - 建议在组件中添加错误边界处理 API 错误
3. **加载状态** - 所有异步操作都应该显示加载状态
4. **数据验证** - 前端验证与后端验证保持一致
5. **安全性** - 敏感操作需要用户认证和权限验证

## 🎯 快速开始

1. 确保后端服务正在运行 (`http://localhost:8080`)
2. 配置环境变量
3. 启动前端开发服务器 (`npm run dev`)
4. 访问 `http://localhost:3000` 查看集成效果

---

**集成完成！** 🎉 前端已成功与后端 API 集成，可以开始使用真实数据进行开发和测试。
