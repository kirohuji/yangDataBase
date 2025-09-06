import { api } from './api';
import type { 
  PhenotypeData, 
  CreatePhenotypeRequest, 
  UpdatePhenotypeRequest, 
  PhenotypeSearchParams,
  PaginatedResponse 
} from '@/types/api';
import { 
  mockPhenotypeData, 
  mockTraitInfo, 
  generateMockData
} from '../mock/phenotypeData';
import { mockApiDelay, createPaginatedResponse } from '../mock';

// ============================================================================
// 表型数据服务
// ============================================================================

export class PhenotypeService {
  private static readonly BASE_URL = '/phenotypes';

  // 获取表型数据列表
  static async getPhenotypes(params?: PhenotypeSearchParams): Promise<PaginatedResponse<PhenotypeData>> {
    // 模拟API延迟
    await mockApiDelay(400);
    
    // 使用mock数据
    let data = [...mockPhenotypeData, ...generateMockData(50)] as any[];
    
    // 应用筛选
    if (params) {
      if (params.trait) {
        data = data.filter(item => item.trait.includes(params.trait!));
      }
      if (params.accession) {
        data = data.filter(item => item.accession.includes(params.accession!));
      }
      if (params.environment) {
        data = data.filter(item => item.environment === params.environment);
      }
      if (params.year) {
        data = data.filter(item => item.year === params.year);
      }
    }
    
    // 分页
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const total = data.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return createPaginatedResponse(paginatedData, page, pageSize, total) as any;
  }

  // 根据ID获取表型数据
  static async getPhenotypeById(id: string): Promise<PhenotypeData> {
    await mockApiDelay(200);
    
    const data = mockPhenotypeData.find(item => item.id === id);
    if (!data) {
      throw new Error('表型数据不存在');
    }
    
    return data as any;
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
    await mockApiDelay(150);
    
    const categories = [...new Set(mockTraitInfo.map(trait => trait.category))];
    return categories;
  }

  // 获取表型特征列表
  static async getTraits(category?: string): Promise<string[]> {
    await mockApiDelay(150);
    
    let traits = mockTraitInfo;
    if (category) {
      traits = traits.filter(trait => trait.category === category);
    }
    
    return traits.map(trait => trait.name);
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
    
    await api.get(`${this.BASE_URL}/export?${searchParams.toString()}`);
    // 模拟返回Blob数据
    const blob = new Blob(['mock data'], { type: 'text/csv' });

    return blob;
  }

  // 导入表型数据
  static async importPhenotypes(file: File): Promise<{
    success: number;
    failed: number;
    errors?: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post(`${this.BASE_URL}/import`, formData);
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
