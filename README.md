# 个人博客系统

一个功能完整、设计优美的现代化个人博客系统，采用前后端分离架构，提供完整的博客管理功能和优雅的用户体验。

## 🎯 项目概述

这是一个全栈个人博客系统，包含前端展示网站和管理后台，以及完整的后端API服务。系统采用现代化的技术栈，提供丰富的功能和良好的用户体验。

### 🌟 核心特性
- **前后端分离** - 清晰的架构分离，便于维护和扩展
- **现代化技术栈** - 使用最新的技术框架和工具
- **完整功能** - 涵盖博客的所有核心功能
- **优雅设计** - 现代化的UI设计和用户体验
- **系统配置** - 动态配置系统，支持实时更新
- **API集成** - 完整的REST API集成
- **响应式设计** - 完美适配各种设备

## 📁 项目结构

```
my-blog/
├── my-blog-web/          # 前端项目 (Next.js)
│   ├── src/
│   │   ├── app/         # Next.js App Router页面
│   │   ├── components/  # React组件
│   │   ├── lib/         # 工具函数和API
│   │   └── types/       # TypeScript类型定义
│   ├── public/          # 静态资源
│   ├── package.json     # 前端依赖配置
│   └── README.md        # 前端项目说明
├── my-blog-server/       # 后端项目 (Spring Boot)
│   ├── src/main/java/   # Java源代码
│   ├── src/main/resources/ # 配置文件
│   ├── pom.xml          # Maven依赖配置
│   └── README.md        # 后端项目说明
└── README.md            # 项目总体说明
```

## 🛠️ 技术栈

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **主题**: next-themes
- **图标**: Lucide React
- **HTTP客户端**: 自定义HttpClient类
- **状态管理**: React Context + Hooks

### 后端技术栈
- **框架**: Spring Boot 3.2.0
- **Java版本**: JDK 21
- **数据库**: MySQL 8.0
- **ORM**: Spring Data JPA
- **安全**: Spring Security + JWT
- **构建工具**: Maven
- **数据库迁移**: Flyway

## ✨ 功能特性

### 🏠 前端功能
- **首页展示** - 轮播图、博客统计、最新文章、分类标签
- **文章系统** - 文章列表、详情页、分类筛选、标签筛选
- **分类标签** - 分类页面、标签页面、标签云展示
- **归档功能** - 时间线归档、年份分组、月份展开
- **友链系统** - 友链展示、申请功能、链接统计
- **留言板** - 留言功能、回复功能、点赞功能、评论弹窗
- **搜索功能** - 全局搜索、实时搜索、搜索模态框
- **管理后台** - 完整的后台管理系统

### 🔧 后端功能
- **文章管理** - 文章CRUD、发布、置顶、搜索
- **分类管理** - 分类CRUD、文章统计
- **标签管理** - 标签CRUD、文章统计
- **评论系统** - 评论管理、审核、点赞
- **友链管理** - 友链申请、审核、点击统计
- **留言板** - 留言管理、审核、点赞
- **系统设置** - 动态配置管理、批量更新
- **用户认证** - JWT认证、权限控制
- **数据统计** - 博客数据统计、仪表盘

### ⚙️ 系统配置
- **基本信息** - 站点名称、描述、博主信息
- **外观设置** - 主题、主色调、Logo、Favicon
- **SEO设置** - 页面标题、描述、关键词
- **功能开关** - 评论、留言板、友链、搜索功能
- **社交链接** - GitHub、Twitter、LinkedIn、邮箱
- **其他设置** - 版权信息、备案号、分析代码

## 🚀 快速开始

### 环境要求
- **前端**: Node.js 18+, npm 或 yarn
- **后端**: JDK 21+, Maven 3.6+, MySQL 8.0+
- **IDE**: VS Code (前端), IntelliJ IDEA (后端)

### 1. 克隆项目
```bash
git clone https://github.com/luoyuanxiang/my-blog.git
cd my-blog
```

### 2. 启动后端服务

#### 配置数据库
```sql
CREATE DATABASE myblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 修改配置
编辑 `my-blog-server/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/myblog?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

#### 启动后端
```bash
cd my-blog-server
mvn spring-boot:run
```

后端服务将在 http://localhost:8080 启动

### 3. 启动前端服务

#### 安装依赖
```bash
cd my-blog-web
npm install
```

#### 启动前端
```bash
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 4. 访问系统
- **前端网站**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin
- **后端API**: http://localhost:8080/api

## 📖 使用指南

### 管理后台使用
1. 访问 http://localhost:3000/admin
2. 使用默认账号登录：`admin` / `admin123`
3. 在系统设置中配置博客基本信息
4. 开始创建文章、分类、标签等内容

### 系统配置
1. 进入管理后台的"系统设置"
2. 配置基本信息（站点名称、博主信息等）
3. 设置外观（主题、主色调、Logo等）
4. 配置功能开关（开启/关闭各种功能）
5. 设置社交链接和SEO信息

### 内容管理
1. **文章管理**: 创建、编辑、发布文章
2. **分类管理**: 创建和管理文章分类
3. **标签管理**: 创建和管理文章标签
4. **评论管理**: 审核和管理文章评论
5. **友链管理**: 审核和管理友情链接
6. **留言板管理**: 审核和管理留言板消息

## 🔧 开发指南

### 前端开发
```bash
cd my-blog-web
npm run dev          # 开发模式
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 后端开发
```bash
cd my-blog-server
mvn spring-boot:run  # 开发模式运行
mvn clean package    # 构建JAR包
mvn test            # 运行测试
```

### API文档
后端提供完整的REST API，主要接口包括：
- `/api/articles` - 文章相关接口
- `/api/categories` - 分类相关接口
- `/api/tags` - 标签相关接口
- `/api/comments` - 评论相关接口
- `/api/friend-links` - 友链相关接口
- `/api/guestbook` - 留言板相关接口
- `/api/system-settings` - 系统设置相关接口

## 🚀 部署指南

### 前端部署 (Vercel推荐)
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量（API地址等）
4. 自动部署完成

### 后端部署
#### Docker部署
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/my-blog-server.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

#### 传统部署
```bash
mvn clean package -Pprod
java -jar target/my-blog-server.jar
```

### 数据库部署
1. 安装MySQL 8.0+
2. 创建数据库和用户
3. 运行Flyway迁移脚本
4. 配置数据库连接

## 📊 项目特色

### 🎨 设计特色
- **现代化UI** - 简洁美观的界面设计
- **暗黑模式** - 支持明暗主题切换
- **响应式设计** - 完美适配各种设备
- **动画效果** - 流畅的动画和交互效果
- **个性化** - 基于系统配置的个性化体验

### 🔧 技术特色
- **类型安全** - 完整的TypeScript类型定义
- **API集成** - 统一的HTTP客户端和错误处理
- **状态管理** - React Context + Hooks状态管理
- **配置驱动** - 动态配置系统，支持实时更新
- **模块化** - 清晰的模块化架构设计

### 🚀 性能特色
- **SSR支持** - Next.js服务端渲染
- **代码分割** - 自动代码分割和懒加载
- **图片优化** - Next.js Image组件优化
- **缓存策略** - 合理的缓存策略
- **数据库优化** - JPA查询优化和索引

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范
- **前端**: 使用ESLint和Prettier
- **后端**: 遵循Java编码规范
- **提交信息**: 使用清晰的提交信息
- **测试**: 确保新功能有相应的测试

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- **邮箱**: contact@example.com
- **GitHub**: [@luoyuanxiang](https://github.com/luoyuanxiang)
- **Issues**: [GitHub Issues](https://github.com/luoyuanxiang/my-blog/issues)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！

## 📈 项目状态

![GitHub stars](https://img.shields.io/github/stars/luoyuanxiang/my-blog?style=social)
![GitHub forks](https://img.shields.io/github/forks/luoyuanxiang/my-blog?style=social)
![GitHub issues](https://img.shields.io/github/issues/luoyuanxiang/my-blog)
![GitHub license](https://img.shields.io/github/license/luoyuanxiang/my-blog)
