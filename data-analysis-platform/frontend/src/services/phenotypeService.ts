import { api } from './api';
import type { 
  PhenotypeData, 
  CreatePhenotypeRequest, 
  UpdatePhenotypeRequest, 
  PhenotypeSearchParams,
  PaginatedResponse 
} from '@/types/api';

// ============================================================================
// 表型数据服务
// ============================================================================

export class PhenotypeService {
  private static readonly BASE_URL = '/phenotypes';

  // 获取表型数据列表
  static async getPhenotypes(params?: PhenotypeSearchParams): Promise<PaginatedResponse<PhenotypeData>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    const url = `${this.BASE_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await api.get<PaginatedResponse<PhenotypeData>>(url);
  }

  // 根据ID获取表型数据
  static async getPhenotypeById(id: string): Promise<PhenotypeData> {
    return await api.get<PhenotypeData>(`${this.BASE_URL}/${id}`);
  }

  // 创建表型数据
  static async createPhenotype(data: CreatePhenotypeRequest): Promise<PhenotypeData> {
    return await api.post<PhenotypeData>(this.BASE_URL, data);
  }

  // 更新表型数据
  static async updatePhenotype(id: string, data: UpdatePhenotypeRequest): Promise<PhenotypeData> {
    return await api.put<PhenotypeData>(`${this.BASE_URL}/${id}`, data);
  }

  // 删除表型数据
  static async deletePhenotype(id: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }

  // 批量删除表型数据
  static async deletePhenotypes(ids: string[]): Promise<void> {
    await api.post(`${this.BASE_URL}/batch-delete`, { ids });
  }

  // 获取表型数据分类
  static async getCategories(): Promise<string[]> {
    return await api.get<string[]>(`${this.BASE_URL}/categories`);
  }

  // 获取表型特征列表
  static async getTraits(category?: string): Promise<string[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return await api.get<string[]>(`${this.BASE_URL}/traits${params}`);
  }

  // 搜索表型数据
  static async searchPhenotypes(query: string, filters?: Partial<PhenotypeSearchParams>): Promise<PhenotypeData[]> {
    const searchParams = new URLSearchParams({ query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    return await api.get<PhenotypeData[]>(`${this.BASE_URL}/search?${searchParams.toString()}`);
  }

  // 导出表型数据
  static async exportPhenotypes(
    ids?: string[], 
    format: 'csv' | 'json' | 'xlsx' = 'csv'
  ): Promise<Blob> {
    const params = {
      format,
      ...(ids && ids.length > 0 && { ids: ids.join(',') })
    };

    const searchParams = new URLSearchParams(params);
    
    const response = await api.get(`${this.BASE_URL}/export?${searchParams.toString()}`, {
      responseType: 'blob'
    });

    return response as unknown as Blob;
  }

  // 导入表型数据
  static async importPhenotypes(file: File): Promise<{
    success: number;
    failed: number;
    errors?: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post(`${this.BASE_URL}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // 获取表型数据统计信息
  static async getPhenotypeStats(): Promise<{
    total: number;
    categories: Record<string, number>;
    traits: Record<string, number>;
    sampleDistribution: {
      range: string;
      count: number;
    }[];
    recentActivity: {
      date: string;
      created: number;
      updated: number;
    }[];
  }> {
    return await api.get(`${this.BASE_URL}/stats`);
  }

  // 验证表型数据
  static async validatePhenotype(data: CreatePhenotypeRequest | UpdatePhenotypeRequest): Promise<{
    valid: boolean;
    errors?: string[];
    warnings?: string[];
  }> {
    return await api.post(`${this.BASE_URL}/validate`, data);
  }

  // 复制表型数据
  static async duplicatePhenotype(id: string, newName?: string): Promise<PhenotypeData> {
    return await api.post<PhenotypeData>(`${this.BASE_URL}/${id}/duplicate`, {
      ...(newName && { name: newName })
    });
  }

  // 获取表型数据版本历史
  static async getPhenotypeHistory(id: string): Promise<{
    id: string;
    version: number;
    changes: Record<string, any>;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
  }[]> {
    return await api.get(`${this.BASE_URL}/${id}/history`);
  }

  // 恢复表型数据版本
  static async restorePhenotypeVersion(id: string, version: number): Promise<PhenotypeData> {
    return await api.post<PhenotypeData>(`${this.BASE_URL}/${id}/restore/${version}`);
  }
}

export default PhenotypeService;
