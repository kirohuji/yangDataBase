# API接口设计文档

## 接口概览

### 基础信息
- **Base URL**: `http://localhost:3000/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  code: number;
  timestamp: string;
}

// 成功响应
{
  "success": true,
  "data": { /* 具体数据 */ },
  "message": "操作成功",
  "code": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// 错误响应
{
  "success": false,
  "message": "错误描述",
  "code": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

## 认证授权模块

### 1. 用户注册

**POST** `/auth/register`

```typescript
// 请求体
interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  name?: string;
}

// 响应体
interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: 'USER' | 'ANALYST' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  };
  token: string;
}
```

**示例:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123",
    "name": "测试用户"
  }'
```

### 2. 用户登录

**POST** `/auth/login`

```typescript
// 请求体
interface LoginRequest {
  email: string;
  password: string;
}

// 响应体
interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: string;
    avatar?: string;
  };
  token: string;
  expiresIn: string;
}
```

### 3. 刷新令牌

**POST** `/auth/refresh`

```typescript
// 请求头
Authorization: Bearer <refresh_token>

// 响应体
interface RefreshResponse {
  token: string;
  expiresIn: string;
}
```

### 4. 用户登出

**POST** `/auth/logout`

```typescript
// 请求头
Authorization: Bearer <access_token>

// 响应
{
  "success": true,
  "message": "登出成功"
}
```

### 5. 获取用户信息

**GET** `/auth/profile`

```typescript
// 请求头
Authorization: Bearer <access_token>

// 响应体
interface ProfileResponse {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
```

## 脚本管理模块

### 1. 获取脚本列表

**GET** `/scripts`

```typescript
// 查询参数
interface ScriptsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isActive?: boolean;
}

// 响应体
interface ScriptsResponse {
  scripts: Script[];
  total: number;
  page: number;
  limit: number;
}

interface Script {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: Parameter[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'select';
  required: boolean;
  default?: any;
  options?: string[];
  description?: string;
}
```

### 2. 创建脚本

**POST** `/scripts`

```typescript
// 请求体
interface CreateScriptRequest {
  name: string;
  description?: string;
  category?: string;
  scriptPath: string;
  configPath?: string;
  parameters?: Parameter[];
}

// 响应体
interface CreateScriptResponse {
  script: Script;
}
```

### 3. 更新脚本

**PUT** `/scripts/:id`

```typescript
// 请求体
interface UpdateScriptRequest {
  name?: string;
  description?: string;
  category?: string;
  parameters?: Parameter[];
  isActive?: boolean;
}
```

### 4. 删除脚本

**DELETE** `/scripts/:id`

### 5. 获取脚本详情

**GET** `/scripts/:id`

```typescript
// 响应体
interface ScriptDetailResponse {
  script: Script & {
    executions: ScriptExecution[];
  };
}
```

## 脚本执行模块

### 1. 执行脚本

**POST** `/scripts/:id/execute`

```typescript
// 请求体
interface ExecuteScriptRequest {
  parameters: Record<string, any>;
}

// 响应体
interface ExecuteScriptResponse {
  execution: {
    id: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    parameters: Record<string, any>;
    createdAt: string;
  };
}
```

### 2. 获取执行历史

**GET** `/executions`

```typescript
// 查询参数
interface ExecutionsQuery {
  page?: number;
  limit?: number;
  status?: string;
  scriptId?: string;
  startDate?: string;
  endDate?: string;
}

// 响应体
interface ExecutionsResponse {
  executions: ScriptExecution[];
  total: number;
  page: number;
  limit: number;
}

interface ScriptExecution {
  id: string;
  status: string;
  parameters: Record<string, any>;
  output?: string;
  error?: string;
  startTime?: string;
  endTime?: string;
  resultPath?: string;
  createdAt: string;
  script: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}
```

### 3. 获取执行详情

**GET** `/executions/:id`

```typescript
// 响应体
interface ExecutionDetailResponse {
  execution: ScriptExecution;
}
```

### 4. 取消执行

**POST** `/executions/:id/cancel`

### 5. 下载执行结果

**GET** `/executions/:id/download`

```typescript
// 响应头
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="result.csv"
```

## 文件管理模块

### 1. 上传文件

**POST** `/files/upload`

```typescript
// 请求体 (multipart/form-data)
interface UploadRequest {
  file: File;
  category?: 'DATA' | 'RESULT' | 'SCRIPT' | 'CONFIG' | 'OTHER';
  isPublic?: boolean;
}

// 响应体
interface UploadResponse {
  file: {
    id: string;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    category: string;
    isPublic: boolean;
    createdAt: string;
  };
}
```

### 2. 获取文件列表

**GET** `/files`

```typescript
// 查询参数
interface FilesQuery {
  page?: number;
  limit?: number;
  category?: string;
  mimetype?: string;
  search?: string;
}

// 响应体
interface FilesResponse {
  files: FileInfo[];
  total: number;
  page: number;
  limit: number;
}

interface FileInfo {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  category: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}
```

### 3. 下载文件

**GET** `/files/:id/download`

### 4. 删除文件

**DELETE** `/files/:id`

### 5. 获取文件预览

**GET** `/files/:id/preview`

```typescript
// 响应体
interface PreviewResponse {
  content: string; // 文件内容预览
  type: 'text' | 'image' | 'json' | 'csv';
  size: number;
}
```

## 用户管理模块

### 1. 获取用户列表

**GET** `/users`

```typescript
// 查询参数 (仅管理员)
interface UsersQuery {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

// 响应体
interface UsersResponse {
  users: UserInfo[];
  total: number;
  page: number;
  limit: number;
}

interface UserInfo {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
}
```

### 2. 更新用户信息

**PUT** `/users/:id`

```typescript
// 请求体
interface UpdateUserRequest {
  name?: string;
  role?: 'USER' | 'ANALYST' | 'ADMIN';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
```

### 3. 删除用户

**DELETE** `/users/:id`

## 系统管理模块

### 1. 系统健康检查

**GET** `/health`

```typescript
// 响应体
interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    fileSystem: 'up' | 'down';
  };
  version: string;
  uptime: number;
}
```

### 2. 系统统计

**GET** `/stats`

```typescript
// 响应体
interface StatsResponse {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  scripts: {
    total: number;
    active: number;
    categories: Record<string, number>;
  };
  executions: {
    total: number;
    today: number;
    running: number;
    success: number;
    failed: number;
  };
  files: {
    total: number;
    totalSize: number;
    categories: Record<string, number>;
  };
}
```

### 3. 审计日志

**GET** `/audit-logs`

```typescript
// 查询参数
interface AuditLogsQuery {
  page?: number;
  limit?: number;
  action?: string;
  resource?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// 响应体
interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}
```

## WebSocket事件

### 连接认证

```typescript
// 客户端连接时发送
{
  "event": "auth",
  "data": {
    "token": "jwt_token"
  }
}

// 服务器响应
{
  "event": "auth_success",
  "data": {
    "userId": "user_id"
  }
}
```

### 脚本执行状态

```typescript
// 服务器推送执行状态
{
  "event": "execution_status",
  "data": {
    "executionId": "execution_id",
    "status": "RUNNING",
    "progress": 50,
    "message": "正在处理数据..."
  }
}

// 执行完成
{
  "event": "execution_complete",
  "data": {
    "executionId": "execution_id",
    "status": "COMPLETED",
    "resultPath": "/results/output.csv",
    "duration": 120000
  }
}

// 执行失败
{
  "event": "execution_error",
  "data": {
    "executionId": "execution_id",
    "status": "FAILED",
    "error": "脚本执行错误信息"
  }
}
```

### 系统通知

```typescript
// 系统通知
{
  "event": "system_notification",
  "data": {
    "type": "info" | "warning" | "error",
    "title": "通知标题",
    "message": "通知内容",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 错误处理

### 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  code: number;
  errors?: ValidationError[];
  timestamp: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

### 常见错误码

| 错误码 | 说明 | 示例 |
|--------|------|------|
| 1001 | 认证失败 | JWT令牌无效 |
| 1002 | 权限不足 | 无权限访问资源 |
| 1003 | 参数验证失败 | 必填字段缺失 |
| 2001 | 脚本不存在 | 脚本ID无效 |
| 2002 | 脚本执行失败 | 脚本运行错误 |
| 3001 | 文件不存在 | 文件ID无效 |
| 3002 | 文件上传失败 | 文件格式不支持 |
| 5001 | 服务器内部错误 | 数据库连接失败 |

## 接口测试

### Postman集合

项目包含完整的Postman测试集合，位于 `docs/postman/` 目录：

- `Data Analysis Platform.postman_collection.json` - 接口集合
- `Development.postman_environment.json` - 开发环境变量
- `Production.postman_environment.json` - 生产环境变量

### 测试脚本示例

```bash
# 用户注册
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "name": "测试用户"
  }'

# 用户登录
TOKEN=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

# 获取脚本列表
curl -X GET http://localhost:3000/api/v1/scripts \
  -H "Authorization: Bearer $TOKEN"

# 执行脚本
curl -X POST http://localhost:3000/api/v1/scripts/script_id/execute \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {
      "input_file": "data.csv",
      "output_format": "json"
    }
  }'
```

## 接口版本管理

### 版本策略

- **URL版本控制**: `/api/v1/`, `/api/v2/`
- **向后兼容**: 旧版本保持6个月
- **废弃通知**: 提前3个月通知废弃

### 版本更新日志

#### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础CRUD操作
- JWT认证授权
- WebSocket实时通信

#### v1.1.0 (计划中)
- 批量操作支持
- 高级查询功能
- 性能优化

## 接口限流

### 限流策略

| 接口类型 | 限制 | 窗口期 |
|----------|------|--------|
| 认证接口 | 10次/分钟 | 1分钟 |
| 查询接口 | 100次/分钟 | 1分钟 |
| 上传接口 | 20次/小时 | 1小时 |
| 执行接口 | 5次/分钟 | 1分钟 |

### 限流响应

```typescript
// 触发限流时的响应
{
  "success": false,
  "message": "请求过于频繁，请稍后再试",
  "code": 429,
  "retryAfter": 60,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
