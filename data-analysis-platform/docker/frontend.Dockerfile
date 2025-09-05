# 前端构建阶段
FROM node:18-alpine as build

# 安装pnpm
RUN npm install -g pnpm@8

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml package.json ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY frontend/ ./frontend/

# 构建应用
WORKDIR /app/frontend
RUN pnpm build

# 生产阶段 - 使用nginx服务静态文件
FROM nginx:alpine

# 复制构建产物
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# 复制nginx配置
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
