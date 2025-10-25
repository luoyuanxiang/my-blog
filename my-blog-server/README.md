# 个人博客后端

一个功能完整、架构清晰的现代化个人博客后端服务，使用 Spring Boot 3、JDK 21、Spring Data JPA、MySQL 构建，提供完整的REST API和系统配置管理。

## ✨ 主要特性

### 🏗️ 架构设计
- **分层架构** - Controller、Service、Repository 三层架构
- **RESTful API** - 标准的REST API设计
- **统一响应格式** - 统一的API响应格式
- **全局异常处理** - 统一的异常处理机制
- **CORS支持** - 跨域资源共享支持

### 🔐 安全认证
- **JWT认证** - 基于JWT的无状态认证
- **Spring Security** - 集成Spring Security安全框架
- **密码加密** - BCrypt密码加密
- **权限控制** - 基于角色的权限控制

### 📊 数据管理
- **MySQL数据库** - 关系型数据库存储
- **Spring Data JPA** - 数据访问层抽象
- **数据库迁移** - Flyway数据库版本管理
- **连接池** - HikariCP高性能连接池

### 🎯 核心功能
- **文章管理** - 完整的文章CRUD操作
- **分类管理** - 文章分类管理
- **标签管理** - 文章标签管理
- **评论系统** - 评论管理和审核
- **友链管理** - 友情链接申请和审核
- **留言板** - 留言管理和审核
- **系统设置** - 动态系统配置管理
- **统计功能** - 博客数据统计

## 🛠️ 技术栈

- **框架**: Spring Boot 3.2.0
- **Java版本**: JDK 21
- **数据库**: MySQL 8.0
- **ORM**: Spring Data JPA
- **安全**: Spring Security + JWT
- **构建工具**: Maven
- **数据库迁移**: Flyway
- **连接池**: HikariCP
- **日志**: Logback
- **测试**: JUnit 5 + Mockito

## 📦 安装和运行

### 环境要求
- JDK 21+
- Maven 3.6+
- MySQL 8.0+
- IDE (推荐 IntelliJ IDEA)

### 数据库配置
1. 创建MySQL数据库
```sql
CREATE DATABASE myblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置数据库连接
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/myblog?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

### 安装依赖
```bash
mvn clean install
```

### 开发环境运行
```bash
mvn spring-boot:run
```

服务将在 http://localhost:8080 启动

### 构建生产版本
```bash
mvn clean package -Pprod
```

## 📁 项目结构

```
src/main/java/com/myblog/
├── controller/            # 控制器层
│   ├── ArticleController.java
│   ├── CategoryController.java
│   ├── TagController.java
│   ├── CommentController.java
│   ├── FriendLinkController.java
│   ├── GuestbookController.java
│   ├── SystemSettingController.java
│   ├── AuthController.java
│   ├── DashboardController.java
│   └── PublicController.java
├── service/               # 服务层
│   ├── ArticleService.java
│   ├── CategoryService.java
│   ├── TagService.java
│   ├── CommentService.java
│   ├── FriendLinkService.java
│   ├── GuestbookService.java
│   ├── SystemSettingService.java
│   ├── AuthService.java
│   ├── DashboardService.java
│   └── BlogStatsService.java
├── repository/            # 数据访问层
│   ├── ArticleRepository.java
│   ├── CategoryRepository.java
│   ├── TagRepository.java
│   ├── CommentRepository.java
│   ├── FriendLinkRepository.java
│   ├── GuestbookMessageRepository.java
│   ├── SystemSettingRepository.java
│   └── UserRepository.java
├── entity/                # 实体类
│   ├── Article.java
│   ├── Category.java
│   ├── Tag.java
│   ├── Comment.java
│   ├── FriendLink.java
│   ├── GuestbookMessage.java
│   ├── SystemSetting.java
│   └── User.java
├── dto/                   # 数据传输对象
│   ├── ArticleDTO.java
│   ├── CategoryDTO.java
│   ├── TagDTO.java
│   ├── CommentDTO.java
│   ├── FriendLinkDTO.java
│   ├── GuestbookMessageDTO.java
│   ├── SystemSettingDTO.java
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── DashboardStats.java
│   └── BlogStats.java
├── config/                # 配置类
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── JwtConfig.java
├── util/                  # 工具类
│   ├── JwtUtil.java
│   └── ResponseUtil.java
└── exception/             # 异常处理
    ├── GlobalExceptionHandler.java
    └── BusinessException.java
```

## 🔌 API接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/validate` - 验证Token

### 文章接口
- `GET /api/articles` - 获取文章列表（分页）
- `GET /api/articles/{id}` - 获取文章详情
- `GET /api/articles/slug/{slug}` - 根据slug获取文章
- `POST /api/articles` - 创建文章
- `PUT /api/articles/{id}` - 更新文章
- `DELETE /api/articles/{id}` - 删除文章
- `GET /api/articles/published` - 获取已发布文章
- `GET /api/articles/pinned` - 获取置顶文章
- `GET /api/articles/popular` - 获取热门文章
- `GET /api/articles/search` - 搜索文章
- `GET /api/articles/category/{categoryId}` - 根据分类获取文章
- `GET /api/articles/tag/{tagId}` - 根据标签获取文章
- `POST /api/articles/{id}/publish` - 发布文章
- `POST /api/articles/{id}/unpublish` - 取消发布
- `POST /api/articles/{id}/pin` - 置顶文章
- `POST /api/articles/{id}/unpin` - 取消置顶
- `POST /api/articles/{id}/view` - 增加浏览量
- `POST /api/articles/{id}/like` - 点赞文章

### 分类接口
- `GET /api/categories` - 获取分类列表
- `GET /api/categories/{id}` - 获取分类详情
- `GET /api/categories/slug/{slug}` - 根据slug获取分类
- `POST /api/categories` - 创建分类
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类
- `GET /api/categories/with-articles` - 获取带文章的分类

### 标签接口
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/{id}` - 获取标签详情
- `GET /api/tags/slug/{slug}` - 根据slug获取标签
- `POST /api/tags` - 创建标签
- `PUT /api/tags/{id}` - 更新标签
- `DELETE /api/tags/{id}` - 删除标签
- `GET /api/tags/with-articles` - 获取带文章的标签
- `GET /api/tags/popular` - 获取热门标签

### 评论接口
- `GET /api/comments` - 获取评论列表
- `GET /api/comments/{id}` - 获取评论详情
- `GET /api/comments/article/{articleId}` - 获取文章评论
- `POST /api/comments` - 创建评论
- `PUT /api/comments/{id}` - 更新评论
- `DELETE /api/comments/{id}` - 删除评论
- `GET /api/comments/pending` - 获取待审核评论
- `POST /api/comments/{id}/approve` - 审核通过评论
- `POST /api/comments/{id}/reject` - 拒绝评论
- `POST /api/comments/{id}/like` - 点赞评论
- `GET /api/comments/{id}/replies` - 获取评论回复

### 友链接口
- `GET /api/friend-links` - 获取友链列表
- `GET /api/friend-links/{id}` - 获取友链详情
- `POST /api/friend-links` - 创建友链
- `PUT /api/friend-links/{id}` - 更新友链
- `DELETE /api/friend-links/{id}` - 删除友链
- `GET /api/friend-links/approved` - 获取已审核友链
- `GET /api/friend-links/pending` - 获取待审核友链
- `POST /api/friend-links/{id}/approve` - 审核通过友链
- `POST /api/friend-links/{id}/reject` - 拒绝友链
- `POST /api/friend-links/{id}/click` - 增加点击量

### 留言板接口
- `GET /api/guestbook` - 获取留言列表
- `GET /api/guestbook/{id}` - 获取留言详情
- `POST /api/guestbook` - 创建留言
- `PUT /api/guestbook/{id}` - 更新留言
- `DELETE /api/guestbook/{id}` - 删除留言
- `GET /api/guestbook/approved` - 获取已审核留言
- `GET /api/guestbook/pending` - 获取待审核留言
- `POST /api/guestbook/{id}/approve` - 审核通过留言
- `POST /api/guestbook/{id}/reject` - 拒绝留言
- `POST /api/guestbook/{id}/like` - 点赞留言
- `GET /api/guestbook/{id}/replies` - 获取留言回复

### 系统设置接口
- `GET /api/system-settings` - 获取所有设置
- `GET /api/system-settings/{id}` - 获取设置详情
- `GET /api/system-settings/key/{key}` - 根据key获取设置
- `POST /api/system-settings` - 创建设置
- `PUT /api/system-settings/{id}` - 更新设置
- `DELETE /api/system-settings/{id}` - 删除设置
- `GET /api/system-settings/public` - 获取公开设置
- `GET /api/system-settings/type/{type}` - 根据类型获取设置
- `PUT /api/system-settings/batch` - 批量更新设置

### 仪表盘接口
- `GET /api/dashboard/stats` - 获取仪表盘统计

### 公开接口
- `GET /api/public/stats` - 获取博客公开统计

## 🗄️ 数据库设计

### 核心表结构
- **articles** - 文章表
- **categories** - 分类表
- **tags** - 标签表
- **comments** - 评论表
- **friend_links** - 友链表
- **guestbook_messages** - 留言表
- **system_settings** - 系统设置表
- **users** - 用户表

### 关系设计
- 文章与分类：多对一关系
- 文章与标签：多对多关系
- 文章与评论：一对多关系
- 评论与回复：自关联关系
- 留言与回复：自关联关系

## 🔧 配置说明

### 应用配置
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: my-blog-server
  datasource:
    url: jdbc:mysql://localhost:3306/myblog
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
  flyway:
    enabled: true
    locations: classpath:db/migration

jwt:
  secret: your-secret-key-here
  expiration: 86400000 # 24小时
```

### 安全配置
- JWT密钥配置
- Token过期时间配置
- CORS跨域配置
- 认证路径配置

## 🚀 部署

### Docker部署
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/my-blog-server.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 传统部署
1. 构建JAR包
```bash
mvn clean package -Pprod
```

2. 运行JAR包
```bash
java -jar target/my-blog-server.jar
```

## 📊 监控和日志

### 日志配置
- 使用Logback作为日志框架
- 支持不同环境的日志级别配置
- 日志文件自动轮转

### 健康检查
- Spring Boot Actuator健康检查
- 数据库连接状态监控
- JVM性能监控

## 🧪 测试

### 单元测试
```bash
mvn test
```

### 集成测试
```bash
mvn verify
```

### 测试覆盖率
```bash
mvn jacoco:report
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：contact@example.com
- GitHub：[@luoyuanxiang](https://github.com/luoyuanxiang)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！