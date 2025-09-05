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
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.BASE_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await api.get<PaginatedResponse<AnalysisTool>>(url);
  }

  // 根据ID获取工具
  static async getToolById(id: string): Promise<AnalysisTool> {
    return await api.get<AnalysisTool>(`${this.BASE_URL}/${id}`);
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
    return await api.get<string[]>(`${this.BASE_URL}/categories`);
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
    return await api.get<AnalysisTool[]>(`${this.BASE_URL}/recommended?limit=${limit}`);
  }

  // 获取热门工具
  static async getPopularTools(limit: number = 10): Promise<AnalysisTool[]> {
    return await api.get<AnalysisTool[]>(`${this.BASE_URL}/popular?limit=${limit}`);
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
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.EXECUTIONS_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await api.get<PaginatedResponse<ScriptExecution>>(url);
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
    const response = await api.get(`${this.EXECUTIONS_URL}/${id}/download`, {
      responseType: 'blob'
    });

    return response as unknown as Blob;
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
