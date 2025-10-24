# 个人博客后端服务

基于 Spring Boot 3 的个人博客后端管理 API，提供文章、标签、分类、友链、评论、留言板、系统设置等功能的增删改查操作。

## 技术栈

- **Java 21**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring Security**
- **MySQL 8.0**
- **JWT 认证**
- **Swagger/OpenAPI 3**
- **Maven**

## 功能特性

### 核心功能
- ✅ 文章管理（增删改查、发布、置顶、搜索）
- ✅ 分类管理（增删改查）
- ✅ 标签管理（增删改查）
- ✅ 评论管理（增删改查、审核）
- ✅ 友链管理（增删改查、审核）
- ✅ 留言板管理（增删改查、审核）
- ✅ 系统设置管理
- ✅ 用户认证（JWT）

### 技术特性
- 🔐 JWT 身份认证
- 📝 完整的 CRUD 操作
- 🔍 全文搜索功能
- 📊 分页查询
- 🛡️ 参数验证
- 📚 API 文档（Swagger）
- 🌐 CORS 支持
- ⚡ 事务管理

## 快速开始

### 环境要求

- JDK 21+
- Maven 3.6+
- MySQL 8.0+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd my-blog-server
   ```

2. **配置数据库**
   - 创建 MySQL 数据库
   - 修改 `src/main/resources/application.yml` 中的数据库连接信息
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/my_blog?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
       username: your_username
       password: your_password
   ```

3. **运行项目**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **访问应用**
   - API 服务：http://localhost:8080/api
   - Swagger 文档：http://localhost:8080/api/swagger-ui.html

### 默认账户

- 用户名：`admin`
- 密码：`admin123`

## API 接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 文章接口
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/{id}` - 获取文章详情
- `POST /api/articles` - 创建文章
- `PUT /api/articles/{id}` - 更新文章
- `DELETE /api/articles/{id}` - 删除文章
- `GET /api/articles/published` - 获取已发布文章
- `GET /api/articles/search` - 搜索文章
- `POST /api/articles/{id}/publish` - 发布文章
- `POST /api/articles/{id}/pin` - 置顶文章

### 分类接口
- `GET /api/categories` - 获取分类列表
- `GET /api/categories/{id}` - 获取分类详情
- `POST /api/categories` - 创建分类
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类

### 标签接口
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/{id}` - 获取标签详情
- `POST /api/tags` - 创建标签
- `PUT /api/tags/{id}` - 更新标签
- `DELETE /api/tags/{id}` - 删除标签

## 数据库设计

### 主要表结构

- **users** - 用户表
- **articles** - 文章表
- **categories** - 分类表
- **tags** - 标签表
- **article_tags** - 文章标签关联表
- **comments** - 评论表
- **friend_links** - 友链表
- **guestbook_messages** - 留言板表
- **system_settings** - 系统设置表

## 配置说明

### JWT 配置
```yaml
jwt:
  secret: myBlogSecretKey2024  # JWT 密钥
  expiration: 86400000         # 过期时间（毫秒）
```

### 数据库配置
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update         # 自动更新表结构
    show-sql: true            # 显示SQL语句
```

## 开发指南

### 项目结构
```
src/main/java/com/myblog/
├── config/          # 配置类
├── controller/      # 控制器
├── dto/            # 数据传输对象
├── entity/         # 实体类
├── exception/      # 异常处理
├── repository/     # 数据访问层
├── security/       # 安全相关
├── service/        # 服务层
└── util/          # 工具类
```

### 添加新功能

1. 创建实体类（Entity）
2. 创建 Repository 接口
3. 创建 DTO 类
4. 创建 Service 接口和实现
5. 创建 Controller
6. 添加 API 文档注解

## 部署说明

### Docker 部署（可选）

```dockerfile
FROM openjdk:21-jdk-slim
COPY target/my-blog-server-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 生产环境配置

1. 修改数据库连接为生产环境
2. 修改 JWT 密钥
3. 配置日志级别
4. 启用 HTTPS

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请联系：admin@example.com
