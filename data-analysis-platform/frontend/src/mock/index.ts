// Mock 数据统一导出
export * from './phenotypeData';
export * from './postsData';
export * from './toolsData';

// 用户数据 Mock
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'researcher' | 'user';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export const mockUsers: User[] = [
  {
    id: 'user_001',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2023-12-01T10:00:00Z'
  },
  {
    id: 'user_002',
    username: 'researcher1',
    email: 'researcher1@example.com',
    role: 'researcher',
    avatar: '/avatars/researcher1.jpg',
    createdAt: '2023-02-15T00:00:00Z',
    lastLogin: '2023-11-30T15:30:00Z'
  },
  {
    id: 'user_003',
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    createdAt: '2023-03-10T00:00:00Z',
    lastLogin: '2023-11-29T09:20:00Z'
  }
];

// 文件数据 Mock
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  path: string;
  description?: string;
  tags: string[];
}

export const mockFiles: FileInfo[] = [
  {
    id: 'file_001',
    name: 'phenotype_data.csv',
    size: 1024000,
    type: 'text/csv',
    uploadedAt: '2023-11-15T10:00:00Z',
    uploadedBy: 'researcher1',
    path: '/uploads/phenotype_data.csv',
    description: '表型数据文件',
    tags: ['表型', '数据', 'CSV']
  },
  {
    id: 'file_002',
    name: 'genotype.vcf',
    size: 5120000,
    type: 'text/plain',
    uploadedAt: '2023-11-20T14:30:00Z',
    uploadedBy: 'researcher1',
    path: '/uploads/genotype.vcf',
    description: '基因型VCF文件',
    tags: ['基因型', 'VCF', '遗传学']
  },
  {
    id: 'file_003',
    name: 'expression_matrix.xlsx',
    size: 2048000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedAt: '2023-11-25T09:15:00Z',
    uploadedBy: 'user1',
    path: '/uploads/expression_matrix.xlsx',
    description: '基因表达矩阵',
    tags: ['表达', 'RNA-seq', 'Excel']
  }
];

// API 响应格式
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 创建成功响应
export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message
});

// 创建错误响应
export const createErrorResponse = (error: string): ApiResponse<never> => ({
  success: false,
  error
});

// 创建分页响应
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): ApiResponse<T[]> => ({
  success: true,
  data,
  pagination: {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  }
});

// 模拟API延迟
export const mockApiDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// 模拟随机错误
export const mockRandomError = (probability: number = 0.1): boolean => 
  Math.random() < probability;
