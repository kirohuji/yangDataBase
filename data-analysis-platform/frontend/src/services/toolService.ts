import { api } from './api';
import type { 
  AnalysisTool, 
  CreateToolRequest, 
  UpdateToolRequest, 
  ToolSearchParams,
  ScriptExecution,
  ExecuteScriptRequest,
  ExecutionSearchParams,
  PaginatedResponse 
} from '@/types/api';
import { 
  mockTools, 
  mockToolCategories, 
  mockToolResults, 
  generateMockToolResults
} from '../mock/toolsData';
import { mockApiDelay, createPaginatedResponse } from '../mock';

// ============================================================================
// 分析工具服务
// ============================================================================

export class ToolService {
  private static readonly BASE_URL = '/tools';
  private static readonly EXECUTIONS_URL = '/executions';

  // ============================================================================
  // 工具管理
  // ============================================================================

  // 获取工具列表
  static async getTools(params?: ToolSearchParams): Promise<PaginatedResponse<AnalysisTool>> {
    await mockApiDelay(300);
    
    let data = [...mockTools] as any[];
    
    // 应用筛选
    if (params) {
      if (params.category) {
        data = data.filter(tool => tool.category === params.category);
      }
      if (params.status) {
        data = data.filter(tool => tool.status === params.status);
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        data = data.filter(tool => 
          tool.name.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
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

  // 根据ID获取工具
  static async getToolById(id: string): Promise<AnalysisTool> {
    await mockApiDelay(200);
    
    const tool = mockTools.find(t => t.id === id);
    if (!tool) {
      throw new Error('工具不存在');
    }
    
    return tool as any;
  }

  // 创建工具
  static async createTool(data: CreateToolRequest): Promise<AnalysisTool> {
    return await api.post<AnalysisTool>(this.BASE_URL, data);
  }

  // 更新工具
  static async updateTool(id: string, data: UpdateToolRequest): Promise<AnalysisTool> {
    return await api.put<AnalysisTool>(`${this.BASE_URL}/${id}`, data);
  }

  // 删除工具
  static async deleteTool(id: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }

  // 获取工具分类
  static async getToolCategories(): Promise<string[]> {
    await mockApiDelay(150);
    
    return mockToolCategories.map(cat => cat.id);
  }

  // 搜索工具
  static async searchTools(query: string, filters?: Partial<ToolSearchParams>): Promise<AnalysisTool[]> {
    const searchParams = new URLSearchParams({ query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return await api.get<AnalysisTool[]>(`${this.BASE_URL}/search?${searchParams.toString()}`);
  }

  // 获取推荐工具
  static async getRecommendedTools(limit: number = 5): Promise<AnalysisTool[]> {
    await mockApiDelay(200);
    
    // 返回前几个工具作为推荐
    return mockTools.slice(0, limit) as any[];
  }

  // 获取热门工具
  static async getPopularTools(limit: number = 10): Promise<AnalysisTool[]> {
    await mockApiDelay(200);
    
    // 返回活跃状态的工具
    const activeTools = mockTools.filter(tool => tool.status === 'active');
    return activeTools.slice(0, limit) as any[];
  }

  // ============================================================================
  // 脚本执行
  // ============================================================================

  // 执行脚本
  static async executeScript(data: ExecuteScriptRequest): Promise<ScriptExecution> {
    return await api.post<ScriptExecution>(`${this.BASE_URL}/${data.scriptId}/execute`, {
      parameters: data.parameters
    });
  }

  // 获取执行历史
  static async getExecutions(params?: ExecutionSearchParams): Promise<PaginatedResponse<ScriptExecution>> {
    await mockApiDelay(300);
    
    let data = [...mockToolResults, ...generateMockToolResults(20)] as any[];
    
    // 应用筛选
    if (params) {
      if (params.status) {
        data = data.filter(execution => execution.status === params.status);
      }
      if (params.toolId) {
        data = data.filter(execution => execution.toolId === params.toolId);
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

  // 根据ID获取执行详情
  static async getExecutionById(id: string): Promise<ScriptExecution> {
    return await api.get<ScriptExecution>(`${this.EXECUTIONS_URL}/${id}`);
  }

  // 取消执行
  static async cancelExecution(id: string): Promise<void> {
    await api.post(`${this.EXECUTIONS_URL}/${id}/cancel`);
  }

  // 重新执行
  static async rerunExecution(id: string): Promise<ScriptExecution> {
    return await api.post<ScriptExecution>(`${this.EXECUTIONS_URL}/${id}/rerun`);
  }

  // 下载执行结果
  static async downloadExecutionResult(id: string): Promise<Blob> {
    await api.get(`${this.EXECUTIONS_URL}/${id}/download`);
    // 模拟返回Blob数据
    const blob = new Blob(['mock result data'], { type: 'application/octet-stream' });
    return blob;
  }

  // 获取执行日志
  static async getExecutionLogs(id: string): Promise<{
    logs: string;
    lastUpdated: string;
  }> {
    return await api.get(`${this.EXECUTIONS_URL}/${id}/logs`);
  }

  // 获取执行统计
  static async getExecutionStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byTool: Record<string, number>;
    recentActivity: {
      date: string;
      executions: number;
      success: number;
      failed: number;
    }[];
    averageDuration: number;
    successRate: number;
  }> {
    return await api.get(`${this.EXECUTIONS_URL}/stats`);
  }

  // ============================================================================
  // 工具验证和测试
  // ============================================================================

  // 验证工具参数
  static async validateToolParameters(toolId: string, parameters: Record<string, any>): Promise<{
    valid: boolean;
    errors?: Record<string, string>;
    warnings?: Record<string, string>;
  }> {
    return await api.post(`${this.BASE_URL}/${toolId}/validate`, { parameters });
  }

  // 测试工具
  static async testTool(toolId: string, parameters: Record<string, any>): Promise<{
    success: boolean;
    output?: string;
    error?: string;
    duration: number;
  }> {
    return await api.post(`${this.BASE_URL}/${toolId}/test`, { parameters });
  }

  // 获取工具示例参数
  static async getToolExamples(toolId: string): Promise<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }[]> {
    return await api.get(`${this.BASE_URL}/${toolId}/examples`);
  }

  // ============================================================================
  // 工具文档和帮助
  // ============================================================================

  // 获取工具文档
  static async getToolDocumentation(toolId: string): Promise<{
    content: string;
    format: 'markdown' | 'html';
    lastUpdated: string;
  }> {
    return await api.get(`${this.BASE_URL}/${toolId}/documentation`);
  }

  // 更新工具文档
  static async updateToolDocumentation(
    toolId: string, 
    content: string, 
    format: 'markdown' | 'html' = 'markdown'
  ): Promise<void> {
    await api.put(`${this.BASE_URL}/${toolId}/documentation`, { content, format });
  }

  // 获取工具使用统计
  static async getToolUsageStats(toolId: string, period: '7d' | '30d' | '90d' = '30d'): Promise<{
    executions: number;
    uniqueUsers: number;
    successRate: number;
    averageDuration: number;
    usageByDay: {
      date: string;
      executions: number;
    }[];
    parameterUsage: Record<string, number>;
  }> {
    return await api.get(`${this.BASE_URL}/${toolId}/usage-stats?period=${period}`);
  }
}

export default ToolService;
