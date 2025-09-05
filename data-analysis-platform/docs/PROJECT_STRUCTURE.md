# 项目结构说明

## 完整目录结构

```
data-analysis-platform/
├── README.md                    # 项目说明文档
├── package.json                 # 根项目配置
├── pnpm-workspace.yaml         # PNPM工作区配置
├── .gitignore                  # Git忽略文件
├── env.example                 # 环境变量示例
│
├── frontend/                   # 前端应用
│   ├── src/                   # 源代码
│   │   ├── components/        # 通用组件
│   │   │   ├── common/        # 基础组件
│   │   │   ├── layout/        # 布局组件
│   │   │   ├── forms/         # 表单组件
│   │   │   └── charts/        # 图表组件
│   │   ├── pages/             # 页面组件
│   │   │   ├── auth/          # 认证页面
│   │   │   ├── dashboard/     # 仪表板
│   │   │   ├── scripts/       # 脚本管理
│   │   │   ├── files/         # 文件管理
│   │   │   ├── executions/    # 执行历史
│   │   │   └── settings/      # 设置页面
│   │   ├── hooks/             # 自定义钩子
│   │   │   ├── useAuth.ts     # 认证钩子
│   │   │   ├── useWebSocket.ts # WebSocket钩子
│   │   │   └── useApi.ts      # API钩子
│   │   ├── services/          # API服务
│   │   │   ├── api.ts         # API基础配置
│   │   │   ├── auth.ts        # 认证服务
│   │   │   ├── scripts.ts     # 脚本服务
│   │   │   ├── files.ts       # 文件服务
│   │   │   └── websocket.ts   # WebSocket服务
│   │   ├── stores/            # 状态管理
│   │   │   ├── authStore.ts   # 认证状态
│   │   │   ├── scriptStore.ts # 脚本状态
│   │   │   └── uiStore.ts     # UI状态
│   │   ├── types/             # TypeScript类型
│   │   │   ├── api.ts         # API类型
│   │   │   ├── auth.ts        # 认证类型
│   │   │   ├── script.ts      # 脚本类型
│   │   │   └── common.ts      # 通用类型
│   │   ├── utils/             # 工具函数
│   │   │   ├── format.ts      # 格式化工具
│   │   │   ├── validation.ts  # 验证工具
│   │   │   └── constants.ts   # 常量定义
│   │   ├── App.tsx            # 根组件
│   │   ├── main.tsx           # 入口文件
│   │   └── index.css          # 全局样式
│   ├── public/                # 静态资源
│   │   ├── index.html         # HTML模板
│   │   ├── favicon.ico        # 网站图标
│   │   └── logo.png           # Logo图片
│   ├── package.json           # 前端依赖
│   ├── vite.config.ts         # Vite配置
│   ├── tsconfig.json          # TypeScript配置
│   └── tsconfig.node.json     # Node环境TS配置
│
├── backend/                    # 后端应用
│   ├── src/                   # 源代码
│   │   ├── modules/           # 业务模块
│   │   │   ├── auth/          # 认证模块
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── dto/       # 数据传输对象
│   │   │   │   ├── guards/    # 守卫
│   │   │   │   └── strategies/ # 认证策略
│   │   │   ├── scripts/       # 脚本管理模块
│   │   │   │   ├── scripts.controller.ts
│   │   │   │   ├── scripts.service.ts
│   │   │   │   ├── scripts.module.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   ├── files/         # 文件管理模块
│   │   │   │   ├── files.controller.ts
│   │   │   │   ├── files.service.ts
│   │   │   │   ├── files.module.ts
│   │   │   │   └── dto/
│   │   │   ├── users/         # 用户管理模块
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.module.ts
│   │   │   │   └── dto/
│   │   │   └── executions/    # 执行管理模块
│   │   │       ├── executions.controller.ts
│   │   │       ├── executions.service.ts
│   │   │       ├── executions.module.ts
│   │   │       ├── executions.gateway.ts
│   │   │       └── dto/
│   │   ├── common/            # 通用模块
│   │   │   ├── decorators/    # 装饰器
│   │   │   ├── filters/       # 异常过滤器
│   │   │   ├── guards/        # 通用守卫
│   │   │   ├── interceptors/  # 拦截器
│   │   │   ├── pipes/         # 管道
│   │   │   └── dto/           # 通用DTO
│   │   ├── database/          # 数据库配置
│   │   │   ├── database.module.ts
│   │   │   └── database.service.ts
│   │   ├── config/            # 配置模块
│   │   │   ├── config.module.ts
│   │   │   └── config.service.ts
│   │   ├── app.module.ts      # 应用主模块
│   │   ├── app.controller.ts  # 应用控制器
│   │   ├── app.service.ts     # 应用服务
│   │   └── main.ts            # 入口文件
│   ├── prisma/                # 数据库相关
│   │   ├── schema.prisma      # 数据库模式
│   │   ├── seed.ts            # 数据种子
│   │   └── migrations/        # 数据库迁移文件
│   ├── test/                  # 测试文件
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── package.json           # 后端依赖
│   ├── nest-cli.json          # NestJS CLI配置
│   └── tsconfig.json          # TypeScript配置
│
├── docker/                     # Docker配置
│   ├── frontend.Dockerfile    # 前端Docker文件
│   ├── backend.Dockerfile     # 后端Docker文件
│   ├── nginx.conf             # Nginx配置
│   └── docker-compose.yml     # Docker编排文件
│
├── scripts/                   # 部署脚本
│   ├── deploy.sh              # 部署脚本
│   ├── setup.sh               # 环境设置脚本
│   └── backup.sh              # 备份脚本
│
└── docs/                      # 项目文档
    ├── ARCHITECTURE.md        # 架构设计文档
    ├── API.md                 # API接口文档
    ├── DEPLOYMENT.md          # 部署指南
    ├── DEVELOPMENT.md         # 开发指南
    └── postman/               # Postman测试集合
        ├── Data Analysis Platform.postman_collection.json
        ├── Development.postman_environment.json
        └── Production.postman_environment.json
```

## 核心文件说明

### 配置文件

| 文件 | 作用 | 说明 |
|------|------|------|
| `package.json` | 根项目配置 | 定义工作区脚本和公共依赖 |
| `pnpm-workspace.yaml` | PNPM工作区 | 配置多包管理 |
| `env.example` | 环境变量模板 | 开发和生产环境配置示例 |
| `.gitignore` | Git忽略规则 | 版本控制忽略文件 |

### 前端核心文件

| 文件 | 作用 | 技术栈 |
|------|------|--------|
| `vite.config.ts` | 构建配置 | Vite + 路径别名 |
| `tsconfig.json` | TypeScript配置 | 严格模式 + 路径映射 |
| `package.json` | 前端依赖 | React + MUI + TypeScript |

### 后端核心文件

| 文件 | 作用 | 技术栈 |
|------|------|--------|
| `main.ts` | 应用入口 | NestJS + Swagger |
| `app.module.ts` | 主模块 | 模块装配 |
| `prisma/schema.prisma` | 数据模型 | Prisma ORM |
| `nest-cli.json` | NestJS配置 | CLI和构建选项 |

### Docker配置

| 文件 | 作用 | 说明 |
|------|------|------|
| `frontend.Dockerfile` | 前端容器 | 多阶段构建 + Nginx |
| `backend.Dockerfile` | 后端容器 | Node.js + 健康检查 |
| `docker-compose.yml` | 服务编排 | 完整的服务栈 |
| `nginx.conf` | 反向代理 | API代理 + 静态资源 |

## 开发工作流

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd data-analysis-platform

# 安装依赖
pnpm install

# 配置环境变量
cp env.example .env.development
# 编辑 .env.development 文件

# 初始化数据库
cd backend
pnpm prisma:migrate
pnpm prisma:seed
```

### 2. 开发模式

```bash
# 启动开发服务器
pnpm dev

# 前端: http://localhost:5173
# 后端: http://localhost:3000
# 数据库: postgresql://localhost:5432/data_analysis
```

### 3. 构建部署

```bash
# 构建应用
pnpm build

# Docker部署
pnpm docker:build
pnpm docker:up

# 或使用部署脚本
./scripts/deploy.sh prod
```

## 扩展指南

### 添加新的前端页面

1. 在 `frontend/src/pages/` 创建页面组件
2. 在路由配置中添加路由
3. 更新导航菜单
4. 添加对应的API服务

### 添加新的后端模块

1. 在 `backend/src/modules/` 创建模块目录
2. 创建 Controller、Service、Module 文件
3. 定义 DTO 和实体类
4. 在主模块中导入新模块
5. 更新Prisma模式（如需要）

### 添加新的API接口

1. 在对应的Controller中添加新方法
2. 在Service中实现业务逻辑
3. 创建相应的DTO类
4. 更新API文档
5. 添加前端API服务调用

### 数据库变更

1. 修改 `prisma/schema.prisma`
2. 生成迁移文件: `pnpm prisma:migrate`
3. 更新种子数据（如需要）
4. 重新生成客户端: `pnpm prisma:generate`

## 最佳实践

### 代码组织

1. **模块化设计**: 按功能模块组织代码
2. **类型安全**: 全面使用TypeScript类型
3. **组件复用**: 抽取通用组件和钩子
4. **状态管理**: 合理使用本地和全局状态

### 性能优化

1. **代码分割**: 使用动态导入和懒加载
2. **缓存策略**: 合理使用React Query缓存
3. **虚拟化**: 大数据列表使用虚拟滚动
4. **资源优化**: 图片压缩和CDN加速

### 安全考虑

1. **输入验证**: 前后端双重验证
2. **权限控制**: 基于角色的访问控制
3. **数据加密**: 敏感数据加密存储
4. **安全头**: 配置安全HTTP头

### 测试策略

1. **单元测试**: 核心业务逻辑测试
2. **集成测试**: API接口测试
3. **端到端测试**: 关键用户流程测试
4. **性能测试**: 负载和压力测试

这个项目结构为你的数据分析平台提供了完整的基础框架，支持快速开发和部署。你可以根据具体需求进行定制和扩展。
