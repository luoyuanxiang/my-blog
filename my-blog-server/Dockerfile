# 基于官方JDK 1.8镜像作为构建环境
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制Maven配置文件
COPY . .

# 构建应用，跳过测试以加快构建速度
RUN mvn install -Dmaven.test.skip=true

# 运行阶段使用精简的JRE 21镜像
FROM eclipse-temurin:21-jdk-alpine

# 维护者信息
LABEL maintainer="1141306760@qq.com"

# 设置时区为Asia/Shanghai
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 设置工作目录
WORKDIR /app

# 从构建阶段复制打包好的jar文件
COPY --from=builder /app/target/*.jar app.jar

# 暴露应用端口
EXPOSE 8080

# 启动命令，使用exec形式以确保应用接收信号
# 修改启动命令
ENTRYPOINT ["sh", "-c", "java -jar app.jar"]