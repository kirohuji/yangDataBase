import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAppStore } from '@/stores/useAppStore';

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = 30000; // 30秒超时

// 创建Axios实例
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证token
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求ID用于调试
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (config.headers) {
      config.headers['X-Request-ID'] = requestId;
    }

    // 开发环境下打印请求信息
    if (import.meta.env.DEV) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
        requestId,
        config,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 开发环境下打印响应信息
    if (import.meta.env.DEV) {
      const requestId = response.config.headers?.['X-Request-ID'];
      console.log(`✅ [${response.status}] ${response.config.url}`, {
        requestId,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    const { response, config } = error;
    const requestId = config?.headers?.['X-Request-ID'];

    // 开发环境下打印错误信息
    if (import.meta.env.DEV) {
      console.error(`❌ [${response?.status || 'Network'}] ${config?.url}`, {
        requestId,
        error: response?.data || error.message,
      });
    }

    // 统一错误处理
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // 未认证，清除token并跳转到登录页
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
          
        case 403:
          // 权限不足
          useAppStore.getState().addNotification({
            type: 'error',
            title: 'Access Denied',
            message: 'You do not have permission to perform this action.',
          });
          break;
          
        case 404:
          // 资源不存在
          useAppStore.getState().addNotification({
            type: 'error',
            title: 'Resource Not Found',
            message: 'The requested resource could not be found.',
          });
          break;
          
        case 422:
          // 数据验证失败
          const validationErrors = (data as any)?.errors || [];
          const errorMessage = validationErrors.length > 0 
            ? validationErrors.map((err: any) => `${err.field}: ${err.message}`).join(', ')
            : 'Validation failed';
          
          useAppStore.getState().addNotification({
            type: 'error',
            title: 'Validation Error',
            message: errorMessage,
          });
          break;
          
        case 429:
          // 请求过于频繁
          useAppStore.getState().addNotification({
            type: 'warning',
            title: 'Too Many Requests',
            message: 'Please slow down and try again later.',
          });
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          // 服务器错误
          useAppStore.getState().addNotification({
            type: 'error',
            title: 'Server Error',
            message: 'Something went wrong on our end. Please try again later.',
          });
          break;
          
        default:
          // 其他错误
          useAppStore.getState().addNotification({
            type: 'error',
            title: 'Request Failed',
            message: (data as any)?.message || 'An unexpected error occurred.',
          });
      }
    } else {
      // 网络错误
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
      });
    }

    return Promise.reject(error);
  }
);

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  code: number;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  code: number;
  timestamp: string;
}

// 通用API错误类型
export interface ApiError {
  success: false;
  message: string;
  code: number;
  errors?: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// HTTP方法枚举
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

// 请求配置类型
export interface RequestConfig extends Omit<InternalAxiosRequestConfig, 'url' | 'method'> {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

// 通用API请求函数
export const apiRequest = async <T = any>(
  method: HttpMethod,
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });

    return response.data.data as T;
  } catch (error) {
    throw error;
  }
};

// 便捷方法
export const api = {
  get: <T = any>(url: string, config?: RequestConfig) => 
    apiRequest<T>(HttpMethod.GET, url, undefined, config),
    
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    apiRequest<T>(HttpMethod.POST, url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    apiRequest<T>(HttpMethod.PUT, url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    apiRequest<T>(HttpMethod.PATCH, url, data, config),
    
  delete: <T = any>(url: string, config?: RequestConfig) => 
    apiRequest<T>(HttpMethod.DELETE, url, undefined, config),
};

export default apiClient;
