// ============================================================================
// React Query Hooks 统一导出
// ============================================================================

// 认证相关 hooks
export * from './useAuth';

// 表型数据相关 hooks
export * from './usePhenotype';

// 分析工具相关 hooks
export * from './useTools';

// 文件管理相关 hooks
export * from './useFiles';

// ============================================================================
// 查询键统一导出 (用于手动缓存操作)
// ============================================================================

export { AUTH_QUERY_KEYS } from './useAuth';
export { PHENOTYPE_QUERY_KEYS } from './usePhenotype';
export { TOOL_QUERY_KEYS, EXECUTION_QUERY_KEYS } from './useTools';
export { FILE_QUERY_KEYS, DOWNLOAD_QUERY_KEYS } from './useFiles';

// ============================================================================
// 通用 hooks 工厂
// ============================================================================

import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    // 使所有查询失效
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },

    // 使认证相关查询失效
    invalidateAuth: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },

    // 使表型数据相关查询失效
    invalidatePhenotypes: () => {
      queryClient.invalidateQueries({ queryKey: ['phenotypes'] });
    },

    // 使工具相关查询失效
    invalidateTools: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },

    // 使执行相关查询失效
    invalidateExecutions: () => {
      queryClient.invalidateQueries({ queryKey: ['executions'] });
    },

    // 使文件相关查询失效
    invalidateFiles: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },

    // 使下载相关查询失效
    invalidateDownloads: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
    },
  };
};

export const useClearCache = () => {
  const queryClient = useQueryClient();

  return {
    // 清除所有缓存
    clearAll: () => {
      queryClient.clear();
    },

    // 清除特定查询的缓存
    clearQuery: (queryKey: any[]) => {
      queryClient.removeQueries({ queryKey });
    },

    // 清除认证缓存
    clearAuth: () => {
      queryClient.removeQueries({ queryKey: ['auth'] });
    },

    // 清除表型数据缓存
    clearPhenotypes: () => {
      queryClient.removeQueries({ queryKey: ['phenotypes'] });
    },

    // 清除工具缓存
    clearTools: () => {
      queryClient.removeQueries({ queryKey: ['tools'] });
    },

    // 清除文件缓存
    clearFiles: () => {
      queryClient.removeQueries({ queryKey: ['files'] });
    },
  };
};

export const useApiStatus = () => {
  const { isLoading, error } = useAppStore();

  return {
    isLoading,
    hasError: !!error,
    error,
  };
};

// ============================================================================
// 批量操作 hooks
// ============================================================================

export const useBatchOperations = () => {
  const { addNotification } = useAppStore();

  const executeBatch = async <T>(
    operations: Array<() => Promise<T>>,
    options?: {
      onSuccess?: (results: T[]) => void;
      onError?: (errors: any[]) => void;
      showNotifications?: boolean;
    }
  ) => {
    const { onSuccess, onError, showNotifications = true } = options || {};

    try {
      const results = await Promise.allSettled(operations.map(op => op()));
      
      const successful = results
        .filter((result): result is PromiseFulfilledResult<Awaited<T>> => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failed = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);

      if (showNotifications) {
        if (successful.length > 0) {
          addNotification({
            type: 'success',
            title: 'Batch Operation',
            message: `${successful.length} operations completed successfully.`,
          });
        }

        if (failed.length > 0) {
          addNotification({
            type: 'error',
            title: 'Batch Operation',
            message: `${failed.length} operations failed.`,
          });
        }
      }

      if (successful.length > 0 && onSuccess) {
        onSuccess(successful);
      }

      if (failed.length > 0 && onError) {
        onError(failed);
      }

      return {
        successful,
        failed,
        total: results.length,
        successCount: successful.length,
        failureCount: failed.length,
      };
    } catch (error) {
      if (showNotifications) {
        addNotification({
          type: 'error',
          title: 'Batch Operation Failed',
          message: 'Failed to execute batch operations.',
        });
      }

      throw error;
    }
  };

  return { executeBatch };
};

export default {
  useInvalidateQueries,
  useClearCache,
  useApiStatus,
  useBatchOperations,
};
