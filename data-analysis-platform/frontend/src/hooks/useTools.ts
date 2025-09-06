import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ToolService } from '@/services/toolService';
import { useAppStore } from '@/stores/useAppStore';
import type { 
  CreateToolRequest, 
  UpdateToolRequest, 
  ToolSearchParams,
  ExecuteScriptRequest,
  ExecutionSearchParams
} from '@/types/api';

// ============================================================================
// 查询键常量
// ============================================================================

export const TOOL_QUERY_KEYS = {
  all: ['tools'] as const,
  lists: () => [...TOOL_QUERY_KEYS.all, 'list'] as const,
  list: (params?: ToolSearchParams) => [...TOOL_QUERY_KEYS.lists(), params] as const,
  details: () => [...TOOL_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TOOL_QUERY_KEYS.details(), id] as const,
  categories: () => [...TOOL_QUERY_KEYS.all, 'categories'] as const,
  recommended: (limit?: number) => [...TOOL_QUERY_KEYS.all, 'recommended', limit] as const,
  popular: (limit?: number) => [...TOOL_QUERY_KEYS.all, 'popular', limit] as const,
  search: (query: string, filters?: Partial<ToolSearchParams>) => 
    [...TOOL_QUERY_KEYS.all, 'search', query, filters] as const,
  documentation: (id: string) => [...TOOL_QUERY_KEYS.all, 'documentation', id] as const,
  examples: (id: string) => [...TOOL_QUERY_KEYS.all, 'examples', id] as const,
  usageStats: (id: string, period?: string) => [...TOOL_QUERY_KEYS.all, 'usage-stats', id, period] as const,
};

export const EXECUTION_QUERY_KEYS = {
  all: ['executions'] as const,
  lists: () => [...EXECUTION_QUERY_KEYS.all, 'list'] as const,
  list: (params?: ExecutionSearchParams) => [...EXECUTION_QUERY_KEYS.lists(), params] as const,
  details: () => [...EXECUTION_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...EXECUTION_QUERY_KEYS.details(), id] as const,
  logs: (id: string) => [...EXECUTION_QUERY_KEYS.all, 'logs', id] as const,
  stats: () => [...EXECUTION_QUERY_KEYS.all, 'stats'] as const,
};

// ============================================================================
// 工具查询 Hooks
// ============================================================================

// 获取工具列表
export const useTools = (params?: ToolSearchParams) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.list(params),
    queryFn: () => ToolService.getTools(params),
    staleTime: 5 * 60 * 1000, // 5分钟
    keepPreviousData: true,
  });
};

// 获取工具详情
export const useTool = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.detail(id),
    queryFn: () => ToolService.getToolById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// 获取工具分类
export const useToolCategories = () => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.categories(),
    queryFn: () => ToolService.getToolCategories(),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
};

// 获取推荐工具
export const useRecommendedTools = (limit: number = 5) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.recommended(limit),
    queryFn: () => ToolService.getRecommendedTools(limit),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
};

// 获取热门工具
export const usePopularTools = (limit: number = 10) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.popular(limit),
    queryFn: () => ToolService.getPopularTools(limit),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
};

// 搜索工具
export const useSearchTools = (
  query: string, 
  filters?: Partial<ToolSearchParams>,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.search(query, filters),
    queryFn: () => ToolService.searchTools(query, filters),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
};

// 获取工具文档
export const useToolDocumentation = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.documentation(id),
    queryFn: () => ToolService.getToolDocumentation(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30分钟
  });
};

// 获取工具示例
export const useToolExamples = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.examples(id),
    queryFn: () => ToolService.getToolExamples(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30分钟
  });
};

// 获取工具使用统计
export const useToolUsageStats = (
  id: string, 
  period: '7d' | '30d' | '90d' = '30d',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.usageStats(id, period),
    queryFn: () => ToolService.getToolUsageStats(id, period),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// ============================================================================
// 执行查询 Hooks
// ============================================================================

// 获取执行历史
export const useExecutions = (params?: ExecutionSearchParams) => {
  return useQuery({
    queryKey: EXECUTION_QUERY_KEYS.list(params),
    queryFn: () => ToolService.getExecutions(params),
    staleTime: 30 * 1000, // 30秒
    keepPreviousData: true,
    refetchInterval: 5000, // 5秒自动刷新
  });
};

// 获取执行详情
export const useExecution = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: EXECUTION_QUERY_KEYS.detail(id),
    queryFn: () => ToolService.getExecutionById(id),
    enabled: enabled && !!id,
    staleTime: 30 * 1000, // 30秒
    refetchInterval: (data) => {
      // 如果执行状态为运行中，则每5秒刷新一次
      return data?.status === 'RUNNING' || data?.status === 'PENDING' ? 5000 : false;
    },
  });
};

// 获取执行日志
export const useExecutionLogs = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: EXECUTION_QUERY_KEYS.logs(id),
    queryFn: () => ToolService.getExecutionLogs(id),
    enabled: enabled && !!id,
    staleTime: 10 * 1000, // 10秒
    refetchInterval: 5000, // 5秒自动刷新
  });
};

// 获取执行统计
export const useExecutionStats = () => {
  return useQuery({
    queryKey: EXECUTION_QUERY_KEYS.stats(),
    queryFn: () => ToolService.getExecutionStats(),
    staleTime: 2 * 60 * 1000, // 2分钟
  });
};

// ============================================================================
// 工具变更 Hooks
// ============================================================================

// 创建工具
export const useCreateTool = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (data: CreateToolRequest) => ToolService.createTool(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TOOL_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `Tool "${data.name}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.response?.data?.message || 'Failed to create tool.',
      });
    },
  });
};

// 更新工具
export const useUpdateTool = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateToolRequest }) => 
      ToolService.updateTool(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(TOOL_QUERY_KEYS.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: TOOL_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `Tool "${data.name}" has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update tool.',
      });
    },
  });
};

// 删除工具
export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => ToolService.deleteTool(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: TOOL_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: TOOL_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Tool has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.response?.data?.message || 'Failed to delete tool.',
      });
    },
  });
};

// ============================================================================
// 执行变更 Hooks
// ============================================================================

// 执行脚本
export const useExecuteScript = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (data: ExecuteScriptRequest) => ToolService.executeScript(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXECUTION_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Execution Started',
        message: 'Script execution has been started successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Execution Failed',
        message: error.response?.data?.message || 'Failed to start script execution.',
      });
    },
  });
};

// 取消执行
export const useCancelExecution = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => ToolService.cancelExecution(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: EXECUTION_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: EXECUTION_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Execution has been cancelled successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.response?.data?.message || 'Failed to cancel execution.',
      });
    },
  });
};

// 重新执行
export const useRerunExecution = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => ToolService.rerunExecution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXECUTION_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Execution has been restarted successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Rerun Failed',
        message: error.response?.data?.message || 'Failed to restart execution.',
      });
    },
  });
};

// 下载执行结果
export const useDownloadExecutionResult = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => ToolService.downloadExecutionResult(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `execution_${id}_result.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addNotification({
        type: 'success',
        title: 'Download Started',
        message: 'Execution result download has started.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: error.response?.data?.message || 'Failed to download execution result.',
      });
    },
  });
};

// 验证工具参数
export const useValidateToolParameters = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ toolId, parameters }: { toolId: string; parameters: Record<string, any> }) => 
      ToolService.validateToolParameters(toolId, parameters),
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Validation Failed',
        message: error.response?.data?.message || 'Failed to validate parameters.',
      });
    },
  });
};

// 测试工具
export const useTestTool = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ toolId, parameters }: { toolId: string; parameters: Record<string, any> }) => 
      ToolService.testTool(toolId, parameters),
    onSuccess: (result) => {
      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Test Successful',
          message: `Tool test completed in ${result.duration}ms.`,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Test Failed',
          message: result.error || 'Tool test failed.',
        });
      }
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Test Error',
        message: error.response?.data?.message || 'Failed to test tool.',
      });
    },
  });
};
