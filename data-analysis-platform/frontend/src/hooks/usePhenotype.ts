import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PhenotypeService } from '@/services/phenotypeService';
import { useAppStore } from '@/stores/useAppStore';
import type { 
  PhenotypeData, 
  CreatePhenotypeRequest, 
  UpdatePhenotypeRequest, 
  PhenotypeSearchParams 
} from '@/types/api';

// ============================================================================
// 查询键常量
// ============================================================================

export const PHENOTYPE_QUERY_KEYS = {
  all: ['phenotypes'] as const,
  lists: () => [...PHENOTYPE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: PhenotypeSearchParams) => [...PHENOTYPE_QUERY_KEYS.lists(), params] as const,
  details: () => [...PHENOTYPE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PHENOTYPE_QUERY_KEYS.details(), id] as const,
  categories: () => [...PHENOTYPE_QUERY_KEYS.all, 'categories'] as const,
  traits: (category?: string) => [...PHENOTYPE_QUERY_KEYS.all, 'traits', category] as const,
  stats: () => [...PHENOTYPE_QUERY_KEYS.all, 'stats'] as const,
  search: (query: string, filters?: Partial<PhenotypeSearchParams>) => 
    [...PHENOTYPE_QUERY_KEYS.all, 'search', query, filters] as const,
};

// ============================================================================
// 查询 Hooks
// ============================================================================

// 获取表型数据列表
export const usePhenotypes = (params?: PhenotypeSearchParams) => {
  return useQuery({
    queryKey: PHENOTYPE_QUERY_KEYS.list(params),
    queryFn: () => PhenotypeService.getPhenotypes(params),
    staleTime: 5 * 60 * 1000, // 5分钟
    keepPreviousData: true,
  });
};

// 获取表型数据详情
export const usePhenotype = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: PHENOTYPE_QUERY_KEYS.detail(id),
    queryFn: () => PhenotypeService.getPhenotypeById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// 获取表型数据分类
export const usePhenotypeCategories = () => {
  return useQuery({
    queryKey: PHENOTYPE_QUERY_KEYS.categories(),
    queryFn: () => PhenotypeService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
};

// 获取表型特征
export const usePhenotypeTraits = (category?: string) => {
  return useQuery({
    queryKey: PHENOTYPE_QUERY_KEYS.traits(category),
    queryFn: () => PhenotypeService.getTraits(category),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
};

// 搜索表型数据
export const useSearchPhenotypes = (
  query: string, 
  filters?: Partial<PhenotypeSearchParams>,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: PHENOTYPE_QUERY_KEYS.search(query, filters),
    queryFn: () => PhenotypeService.searchPhenotypes(query, filters),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
};

// 获取表型数据统计
export const usePhenotypeStats = () => {
  return useQuery({
    queryKey: PHENOTYPE_QUERY_KEYS.stats(),
    queryFn: () => PhenotypeService.getPhenotypeStats(),
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// ============================================================================
// 变更 Hooks
// ============================================================================

// 创建表型数据
export const useCreatePhenotype = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (data: CreatePhenotypeRequest) => PhenotypeService.createPhenotype(data),
    onSuccess: (data) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `Phenotype "${data.name}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.response?.data?.message || 'Failed to create phenotype.',
      });
    },
  });
};

// 更新表型数据
export const useUpdatePhenotype = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePhenotypeRequest }) => 
      PhenotypeService.updatePhenotype(id, data),
    onSuccess: (data, variables) => {
      // 更新缓存
      queryClient.setQueryData(PHENOTYPE_QUERY_KEYS.detail(variables.id), data);
      
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `Phenotype "${data.name}" has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update phenotype.',
      });
    },
  });
};

// 删除表型数据
export const useDeletePhenotype = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => PhenotypeService.deletePhenotype(id),
    onSuccess: (_, id) => {
      // 移除详情缓存
      queryClient.removeQueries({ queryKey: PHENOTYPE_QUERY_KEYS.detail(id) });
      
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Phenotype has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.response?.data?.message || 'Failed to delete phenotype.',
      });
    },
  });
};

// 批量删除表型数据
export const useDeletePhenotypes = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (ids: string[]) => PhenotypeService.deletePhenotypes(ids),
    onSuccess: (_, ids) => {
      // 移除详情缓存
      ids.forEach(id => {
        queryClient.removeQueries({ queryKey: PHENOTYPE_QUERY_KEYS.detail(id) });
      });
      
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${ids.length} phenotypes have been deleted successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.response?.data?.message || 'Failed to delete phenotypes.',
      });
    },
  });
};

// 导出表型数据
export const useExportPhenotypes = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ 
      ids, 
      format = 'csv' 
    }: { 
      ids?: string[]; 
      format?: 'csv' | 'json' | 'xlsx' 
    }) => PhenotypeService.exportPhenotypes(ids, format),
    onSuccess: (blob, variables) => {
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `phenotypes_export.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addNotification({
        type: 'success',
        title: 'Export Successful',
        message: 'Phenotypes have been exported successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: error.response?.data?.message || 'Failed to export phenotypes.',
      });
    },
  });
};

// 导入表型数据
export const useImportPhenotypes = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (file: File) => PhenotypeService.importPhenotypes(file),
    onSuccess: (result) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Import Successful',
        message: `${result.success} phenotypes imported successfully. ${result.failed} failed.`,
      });
      
      if (result.errors && result.errors.length > 0) {
        addNotification({
          type: 'warning',
          title: 'Import Warnings',
          message: result.errors.join(', '),
          autoHide: false,
        });
      }
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Import Failed',
        message: error.response?.data?.message || 'Failed to import phenotypes.',
      });
    },
  });
};

// 复制表型数据
export const useDuplicatePhenotype = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName?: string }) => 
      PhenotypeService.duplicatePhenotype(id, newName),
    onSuccess: (data) => {
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: PHENOTYPE_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `Phenotype "${data.name}" has been duplicated successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Duplication Failed',
        message: error.response?.data?.message || 'Failed to duplicate phenotype.',
      });
    },
  });
};
