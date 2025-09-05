#!/bin/bash

# 数据分析平台部署脚本
# 使用方法: ./scripts/deploy.sh [dev|prod]

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 默认环境为开发环境
ENVIRONMENT=${1:-dev}

echo "🚀 开始部署数据分析平台 (环境: $ENVIRONMENT)"

# 检查必要的工具
check_requirements() {
    echo "📋 检查部署要求..."
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo "❌ PNPM 未安装，请先安装 PNPM"
        exit 1
    fi
    
    echo "✅ 所有要求已满足"
}

# 设置环境变量
setup_environment() {
    echo "🔧 设置环境变量..."
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        ENV_FILE="$PROJECT_ROOT/.env.production"
        COMPOSE_FILE="$PROJECT_ROOT/docker/docker-compose.yml"
    else
        ENV_FILE="$PROJECT_ROOT/.env.development"
        COMPOSE_FILE="$PROJECT_ROOT/docker/docker-compose.dev.yml"
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        echo "⚠️  环境文件 $ENV_FILE 不存在，从示例文件创建..."
        cp "$PROJECT_ROOT/env.example" "$ENV_FILE"
        echo "📝 请编辑 $ENV_FILE 文件设置正确的环境变量"
        exit 1
    fi
    
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    echo "✅ 环境变量设置完成"
}

# 构建应用
build_application() {
    echo "🔨 构建应用..."
    
    cd "$PROJECT_ROOT"
    
    # 安装依赖
    echo "📦 安装依赖..."
    pnpm install
    
    # 生成Prisma客户端
    echo "🗄️  生成数据库客户端..."
    cd backend
    pnpm prisma:generate
    cd ..
    
    # 构建前端
    echo "🎨 构建前端..."
    cd frontend
    pnpm build
    cd ..
    
    # 构建后端
    echo "⚙️  构建后端..."
    cd backend
    pnpm build
    cd ..
    
    echo "✅ 应用构建完成"
}

# 数据库迁移
migrate_database() {
    echo "🗄️  执行数据库迁移..."
    
    cd "$PROJECT_ROOT/backend"
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        pnpm prisma:deploy
    else
        pnpm prisma:migrate
    fi
    
    echo "✅ 数据库迁移完成"
}

# 启动服务
start_services() {
    echo "🚀 启动服务..."
    
    cd "$PROJECT_ROOT"
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker/docker-compose.yml up -d
    else
        # 开发环境直接启动
        pnpm dev &
        echo "🎯 开发服务器已启动"
        echo "前端: http://localhost:5173"
        echo "后端: http://localhost:3000"
        echo "数据库: postgresql://localhost:5432/data_analysis"
    fi
    
    echo "✅ 服务启动完成"
}

# 健康检查
health_check() {
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo "🔍 执行健康检查..."
        
        # 等待服务启动
        sleep 30
        
        # 检查前端
        if curl -f http://localhost >/dev/null 2>&1; then
            echo "✅ 前端服务正常"
        else
            echo "❌ 前端服务异常"
        fi
        
        # 检查后端
        if curl -f http://localhost:3000/health >/dev/null 2>&1; then
            echo "✅ 后端服务正常"
        else
            echo "❌ 后端服务异常"
        fi
        
        # 检查数据库
        if docker exec data-analysis-db pg_isready -U postgres >/dev/null 2>&1; then
            echo "✅ 数据库服务正常"
        else
            echo "❌ 数据库服务异常"
        fi
    fi
}

# 显示部署信息
show_info() {
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "📊 服务信息:"
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo "🌐 前端地址: http://localhost"
        echo "🔗 API地址: http://localhost:3000"
        echo "🗄️  数据库: postgresql://localhost:5432/data_analysis"
        echo ""
        echo "📝 管理命令:"
        echo "  查看日志: docker-compose -f docker/docker-compose.yml logs -f"
        echo "  停止服务: docker-compose -f docker/docker-compose.yml down"
        echo "  重启服务: docker-compose -f docker/docker-compose.yml restart"
    else
        echo "🌐 前端地址: http://localhost:5173"
        echo "🔗 API地址: http://localhost:3000"
        echo "🗄️  数据库: postgresql://localhost:5432/data_analysis"
        echo ""
        echo "📝 开发命令:"
        echo "  停止服务: Ctrl+C"
        echo "  查看日志: pnpm logs"
    fi
    
    echo ""
    echo "📚 文档: $PROJECT_ROOT/docs/"
    echo "🔧 配置: $ENV_FILE"
}

# 主执行流程
main() {
    cd "$PROJECT_ROOT"
    
    check_requirements
    setup_environment
    build_application
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        migrate_database
    fi
    
    start_services
    health_check
    show_info
}

# 错误处理
trap 'echo "❌ 部署过程中发生错误，请检查日志"; exit 1' ERR

# 执行主流程
main
