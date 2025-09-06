// ============================================================================
// 服务模块统一导出
// ============================================================================

import api from './api';
import AuthService from './authService';
import FileService from './fileService';
import PhenotypeService from './phenotypeService';
import ToolService from './toolService';

// API 基础配置
export { apiClient, api, HttpMethod } from './api';
export type { 
  ApiResponse, 
  PaginatedResponse, 
  ApiError, 
  ValidationError, 
  RequestConfig 
} from './api';

// 认证服务
export { AuthService } from './authService';

// 表型数据服务
export { PhenotypeService } from './phenotypeService';

// 分析工具服务
export { ToolService } from './toolService';

// 文件管理服务
export { FileService } from './fileService';

// ============================================================================
// 服务工厂函数 (可选)
// ============================================================================

export class ServiceFactory {
  // 获取所有服务实例
  static getAllServices() {
    return {
      auth: AuthService,
      phenotype: PhenotypeService,
      tool: ToolService,
      file: FileService,
    };
  }

  // 检查服务健康状态
  static async checkServicesHealth() {
    try {
      const response = await api.get('/health');
      return {
        status: 'healthy',
        services: response,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 批量API调用辅助函数
  static async batchRequest<T>(
    requests: Array<() => Promise<T>>
  ): Promise<Array<{ success: boolean; data?: T; error?: any }>> {
    const results = await Promise.allSettled(requests.map(req => req()));
    
    return results.map(result => {
      if (result.status === 'fulfilled') {
        return { success: true, data: result.value };
      } else {
        return { success: false, error: result.reason };
      }
    });
  }
}

export default ServiceFactory;
