# 快速开始指南

## 项目概述

这是一个为团队提供数据分析服务的Web平台，解决了以下核心问题：

- ✅ **简化服务器脚本调用**: 通过Web界面调用服务器上的分析脚本
- ✅ **降低技术门槛**: 团队成员无需掌握服务器操作
- ✅ **统一数据分析流程**: 提供标准化的数据处理界面
- ✅ **结果管理**: 自动管理分析结果并支持下载

## 5分钟快速体验

### 前置要求

确保你的系统已安装：
- **Node.js** >= 18.0.0
- **PNPM** >= 8.0.0  
- **Docker** & **Docker Compose** (用于生产部署)
- **PostgreSQL** (本地开发可选，Docker会自动启动)

### 1. 获取项目

```bash
# 进入项目目录
cd data-analysis-platform

# 查看项目结构
ls -la
```

### 2. 安装依赖

```bash
# 安装所有依赖 (前端+后端)
pnpm install
```

### 3. 环境配置

```bash
# 复制环境变量模板
cp env.example .env.development

# 编辑环境配置 (可选，默认配置已可用)
# nano .env.development
```

### 4. 启动开发服务器

```bash
# 启动完整开发环境
pnpm dev
```

等待几秒钟，服务启动后你将看到：

```
🎯 开发服务器已启动
前端: http://localhost:5173
后端: http://localhost:3000
数据库: postgresql://localhost:5432/data_analysis
```

### 5. 访问应用

打开浏览器访问 http://localhost:5173，你将看到：

1. **登录页面** - 现代化的Material-UI界面
2. **注册功能** - 创建你的第一个账户
3. **仪表板** - 数据分析平台主界面

## 核心功能演示

### 用户管理
- 注册新用户账户
- 角色权限管理 (User/Analyst/Admin)
- 个人信息管理

### 脚本管理
- 添加服务器脚本配置
- 设置脚本参数和描述
- 管理脚本分类和权限

### 交互式执行
- 友好的参数输入界面
- 实时执行状态显示
- WebSocket进度推送

### 文件管理
- 数据文件上传下载
- 结果文件管理
- 文件预览功能

### 结果下载
- 一键下载分析结果
- 支持多种文件格式
- 历史结果管理

## 生产部署

### Docker一键部署

```bash
# 构建并启动所有服务
./scripts/deploy.sh prod

# 或者手动执行
pnpm docker:build
pnpm docker:up
```

服务将在以下端口启动：
- **前端**: http://localhost (端口80)
- **后端API**: http://localhost:3000
- **数据库**: localhost:5432

### 健康检查

```bash
# 检查所有服务状态
docker-compose -f docker/docker-compose.yml ps

# 查看服务日志
docker-compose -f docker/docker-compose.yml logs -f
```

## 配置你的服务器脚本

### 1. 脚本路径配置

编辑环境变量文件：

```bash
# .env.development 或 .env.production
SCRIPTS_PATH="/path/to/your/scripts"
```

### 2. 脚本注册示例

通过Web界面或API注册你的脚本：

```json
{
  "name": "数据清洗脚本",
  "description": "清洗和预处理CSV数据",
  "category": "数据预处理",
  "scriptPath": "/scripts/data_cleaning.py",
  "parameters": [
    {
      "name": "input_file",
      "type": "file",
      "required": true,
      "description": "输入的CSV文件"
    },
    {
      "name": "output_format",
      "type": "select",
      "options": ["csv", "json", "xlsx"],
      "default": "csv",
      "description": "输出格式"
    }
  ]
}
```

### 3. 脚本标准化

为了更好地集成，建议你的脚本遵循以下规范：

```python
#!/usr/bin/env python3
import sys
import json
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_file', required=True)
    parser.add_argument('--output_format', default='csv')
    parser.add_argument('--output_path', required=True)
    
    args = parser.parse_args()
    
    try:
        # 你的分析逻辑
        result = process_data(args.input_file, args.output_format)
        
        # 保存结果到指定路径
        save_result(result, args.output_path)
        
        # 返回成功状态
        print(json.dumps({
            "status": "success",
            "message": "数据处理完成",
            "output_path": args.output_path
        }))
        
    except Exception as e:
        # 返回错误信息
        print(json.dumps({
            "status": "error", 
            "message": str(e)
        }), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

## 常用操作

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 仅启动前端
cd frontend && pnpm dev

# 仅启动后端
cd backend && pnpm start:dev

# 数据库操作
cd backend
pnpm prisma:studio    # 打开数据库管理界面
pnpm prisma:migrate   # 执行数据库迁移
pnpm prisma:generate  # 重新生成客户端
```

### 代码检查

```bash
# 代码格式检查
pnpm lint

# 自动修复格式问题
pnpm lint:fix

# TypeScript类型检查
cd frontend && pnpm type-check
```

### 构建部署

```bash
# 构建所有应用
pnpm build

# 构建Docker镜像
pnpm docker:build

# 启动生产环境
pnpm docker:up

# 停止所有服务
pnpm docker:down
```

## 故障排除

### 常见问题

**Q: 端口被占用**
```bash
# 检查端口占用
lsof -i :3000
lsof -i :5173

# 杀死占用进程
kill -9 <PID>
```

**Q: 数据库连接失败**
```bash
# 检查数据库状态
docker ps | grep postgres

# 重启数据库服务
docker-compose -f docker/docker-compose.yml restart database
```

**Q: 依赖安装失败**
```bash
# 清理缓存重新安装
pnpm clean
rm -rf node_modules
pnpm install
```

**Q: 脚本执行失败**
```bash
# 检查脚本路径和权限
ls -la /path/to/your/scripts/
chmod +x /path/to/your/scripts/script.py

# 检查Python环境
which python3
python3 --version
```

### 日志查看

```bash
# 开发模式日志
pnpm dev  # 直接在终端查看

# Docker模式日志
docker-compose -f docker/docker-compose.yml logs -f backend
docker-compose -f docker/docker-compose.yml logs -f frontend

# 应用日志文件
tail -f backend/logs/app.log
```

## 下一步

🎉 **恭喜！** 你已经成功搭建了数据分析平台。

接下来你可以：

1. **添加你的脚本** - 将现有的分析脚本注册到平台
2. **邀请团队成员** - 创建用户账户并分配权限
3. **自定义界面** - 根据团队需求调整UI组件
4. **扩展功能** - 添加新的分析模块或集成第三方服务

### 深入学习

- 📖 [架构设计文档](./ARCHITECTURE.md) - 了解系统架构
- 📚 [API接口文档](./API.md) - 开发自定义功能
- 🏗️ [项目结构说明](./PROJECT_STRUCTURE.md) - 理解代码组织
- 🚀 [部署指南](./DEPLOYMENT.md) - 生产环境部署

### 获取帮助

- 查看项目文档目录 `docs/`
- 检查GitHub Issues
- 联系开发团队

---

**开始你的数据分析之旅吧！** 🚀
