// ============================================================================
// API 相关类型定义
// ============================================================================

// 基础实体类型
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 搜索参数
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}

// ============================================================================
// 用户相关类型
// ============================================================================

export interface User extends BaseEntity {
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ANALYST' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

// ============================================================================
// 表型数据相关类型
// ============================================================================

export interface PhenotypeData extends BaseEntity {
  name: string;
  description: string;
  category: string;
  samples: number;
  traits: string[];
  dataPath?: string;
  metadata?: Record<string, any>;
  user: {
    id: string;
    name: string;
  };
}

export interface CreatePhenotypeRequest {
  name: string;
  description?: string;
  category: string;
  traits: string[];
  metadata?: Record<string, any>;
}

export interface UpdatePhenotypeRequest extends Partial<CreatePhenotypeRequest> {}

export interface PhenotypeSearchParams extends SearchParams {
  category?: string;
  traits?: string[];
  trait?: string;
  accession?: string;
  environment?: string;
  year?: number;
  minSamples?: number;
  maxSamples?: number;
}

// ============================================================================
// 分析工具相关类型
// ============================================================================

export interface AnalysisTool extends BaseEntity {
  name: string;
  description: string;
  category: string;
  status: 'Available' | 'Beta' | 'Coming Soon';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  version: string;
  parameters: ToolParameter[];
  documentation?: string;
  user: {
    id: string;
    name: string;
  };
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'select' | 'multiselect';
  required: boolean;
  default?: any;
  options?: string[];
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedTypes?: string[];
    maxSize?: number;
  };
}

export interface CreateToolRequest {
  name: string;
  description: string;
  category: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  parameters: ToolParameter[];
  documentation?: string;
}

export interface UpdateToolRequest extends Partial<CreateToolRequest> {}

export interface ToolSearchParams extends SearchParams {
  category?: string;
  status?: string;
  complexity?: string;
  search?: string;
}

// ============================================================================
// 脚本执行相关类型
// ============================================================================

export interface ScriptExecution extends BaseEntity {
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  parameters: Record<string, any>;
  output?: string;
  error?: string;
  startTime?: string;
  endTime?: string;
  resultPath?: string;
  progress?: number;
  script: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

export interface ExecuteScriptRequest {
  scriptId: string;
  parameters: Record<string, any>;
}

export interface ExecutionSearchParams extends SearchParams {
  status?: string;
  scriptId?: string;
  toolId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// 文件管理相关类型
// ============================================================================

export interface FileInfo extends BaseEntity {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  category: 'DATA' | 'RESULT' | 'SCRIPT' | 'CONFIG' | 'OTHER';
  isPublic: boolean;
  downloadCount?: number;
  user: {
    id: string;
    name: string;
  };
}

export interface UploadFileRequest {
  file: File;
  category?: 'DATA' | 'RESULT' | 'SCRIPT' | 'CONFIG' | 'OTHER';
  isPublic?: boolean;
}

export interface FileSearchParams extends SearchParams {
  category?: string;
  mimetype?: string;
  isPublic?: boolean;
  userId?: string;
}

// ============================================================================
// 下载相关类型
// ============================================================================

export interface DownloadItem extends BaseEntity {
  name: string;
  description: string;
  type: 'dataset' | 'result' | 'documentation';
  size: string;
  format: string;
  downloadCount?: number;
  lastUpdated?: string;
  status?: 'Completed' | 'Processing' | 'Failed';
  version?: string;
  filePath: string;
  metadata?: Record<string, any>;
}

export interface CreateDownloadRequest {
  name: string;
  description: string;
  type: 'dataset' | 'result' | 'documentation';
  format: string;
  filePath: string;
  version?: string;
  metadata?: Record<string, any>;
}

export interface DownloadSearchParams extends SearchParams {
  type?: string;
  format?: string;
  status?: string;
}

// ============================================================================
// 系统统计相关类型
// ============================================================================

export interface SystemStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    byRole: Record<string, number>;
  };
  phenotypes: {
    total: number;
    active: number;
    categories: Record<string, number>;
  };
  tools: {
    total: number;
    available: number;
    categories: Record<string, number>;
  };
  executions: {
    total: number;
    today: number;
    running: number;
    success: number;
    failed: number;
    byStatus: Record<string, number>;
  };
  files: {
    total: number;
    totalSize: number;
    categories: Record<string, number>;
  };
  downloads: {
    total: number;
    totalSize: string;
    types: Record<string, number>;
  };
}

// ============================================================================
// 审计日志相关类型
// ============================================================================

export interface AuditLog extends BaseEntity {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface AuditLogSearchParams extends SearchParams {
  action?: string;
  resource?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// WebSocket 事件类型
// ============================================================================

export interface WebSocketEvent<T = any> {
  event: string;
  data: T;
  timestamp: string;
  userId?: string;
}

export interface ExecutionStatusEvent {
  executionId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress?: number;
  message?: string;
  error?: string;
  resultPath?: string;
  duration?: number;
}

export interface SystemNotificationEvent {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  userId?: string;
}
