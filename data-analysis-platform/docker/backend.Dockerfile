# 后端构建和运行
FROM node:18-alpine

# 安装pnpm
RUN npm install -g pnpm@8

# 安装系统依赖
RUN apk add --no-cache python3 make g++

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY backend/package.json backend/pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml package.json ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY backend/ ./backend/

# 生成Prisma客户端
WORKDIR /app/backend
RUN pnpm prisma:generate

# 构建应用
RUN pnpm build

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 创建必要目录并设置权限
RUN mkdir -p /app/uploads /app/results /app/logs
RUN chown -R nestjs:nodejs /app

# 切换到非root用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD ["pnpm", "start:prod"]
