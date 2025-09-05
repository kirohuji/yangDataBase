import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileService } from '@/services/fileService';
import { useAppStore } from '@/stores/useAppStore';
import type { 
  FileInfo, 
  UploadFileRequest, 
  FileSearchParams,
  DownloadItem,
  CreateDownloadRequest,
  DownloadSearchParams
} from '@/types/api';

// ============================================================================
// 查询键常量
// ============================================================================

export const FILE_QUERY_KEYS = {
  all: ['files'] as const,
  lists: () => [...FILE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: FileSearchParams) => [...FILE_QUERY_KEYS.lists(), params] as const,
  details: () => [...FILE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...FILE_QUERY_KEYS.details(), id] as const,
  preview: (id: string) => [...FILE_QUERY_KEYS.all, 'preview', id] as const,
  categories: () => [...FILE_QUERY_KEYS.all, 'categories'] as const,
  stats: () => [...FILE_QUERY_KEYS.all, 'stats'] as const,
  search: (query: string, filters?: Partial<FileSearchParams>) => 
    [...FILE_QUERY_KEYS.all, 'search', query, filters] as const,
};

export const DOWNLOAD_QUERY_KEYS = {
  all: ['downloads'] as const,
  lists: () => [...DOWNLOAD_QUERY_KEYS.all, 'list'] as const,
  list: (params?: DownloadSearchParams) => [...DOWNLOAD_QUERY_KEYS.lists(), params] as const,
  details: () => [...DOWNLOAD_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...DOWNLOAD_QUERY_KEYS.details(), id] as const,
  popular: (limit?: number) => [...DOWNLOAD_QUERY_KEYS.all, 'popular', limit] as const,
  latest: (limit?: number) => [...DOWNLOAD_QUERY_KEYS.all, 'latest', limit] as const,
  stats: () => [...DOWNLOAD_QUERY_KEYS.all, 'stats'] as const,
  search: (query: string, filters?: Partial<DownloadSearchParams>) => 
    [...DOWNLOAD_QUERY_KEYS.all, 'search', query, filters] as const,
};

// ============================================================================
// 文件查询 Hooks
// ============================================================================

// 获取文件列表
export const useFiles = (params?: FileSearchParams) => {
  return useQuery({
    queryKey: FILE_QUERY_KEYS.list(params),
    queryFn: () => FileService.getFiles(params),
    staleTime: 2 * 60 * 1000, // 2分钟
    keepPreviousData: true,
  });
};

// 获取文件详情
export const useFile = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: FILE_QUERY_KEYS.detail(id),
    queryFn: () => FileService.getFileById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

// 获取文件预览
export const useFilePreview = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: FILE_QUERY_KEYS.preview(id),
    queryFn: () => FileService.getFilePreview(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// 获取文件分类
export const useFileCategories = () => {
  return useQuery({
    queryKey: FILE_QUERY_KEYS.categories(),
    queryFn: () => FileService.getFileCategories(),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
};

// 获取文件统计
export const useFileStats = () => {
  return useQuery({
    queryKey: FILE_QUERY_KEYS.stats(),
    queryFn: () => FileService.getFileStats(),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

// 搜索文件
export const useSearchFiles = (
  query: string, 
  filters?: Partial<FileSearchParams>,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: FILE_QUERY_KEYS.search(query, filters),
    queryFn: () => FileService.searchFiles(query, filters),
    enabled: enabled && query.length > 0,
    staleTime: 1 * 60 * 1000, // 1分钟
  });
};

// ============================================================================
// 下载查询 Hooks
// ============================================================================

// 获取下载列表
export const useDownloads = (params?: DownloadSearchParams) => {
  return useQuery({
    queryKey: DOWNLOAD_QUERY_KEYS.list(params),
    queryFn: () => FileService.getDownloads(params),
    staleTime: 5 * 60 * 1000, // 5分钟
    keepPreviousData: true,
  });
};

// 获取下载详情
export const useDownload = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: DOWNLOAD_QUERY_KEYS.detail(id),
    queryFn: () => FileService.getDownloadById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// 获取热门下载
export const usePopularDownloads = (limit: number = 10) => {
  return useQuery({
    queryKey: DOWNLOAD_QUERY_KEYS.popular(limit),
    queryFn: () => FileService.getPopularDownloads(limit),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
};

// 获取最新下载
export const useLatestDownloads = (limit: number = 10) => {
  return useQuery({
    queryKey: DOWNLOAD_QUERY_KEYS.latest(limit),
    queryFn: () => FileService.getLatestDownloads(limit),
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// 获取下载统计
export const useDownloadStats = () => {
  return useQuery({
    queryKey: DOWNLOAD_QUERY_KEYS.stats(),
    queryFn: () => FileService.getDownloadStats(),
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

// 搜索下载项
export const useSearchDownloads = (
  query: string, 
  filters?: Partial<DownloadSearchParams>,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: DOWNLOAD_QUERY_KEYS.search(query, filters),
    queryFn: () => FileService.searchDownloads(query, filters),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
};

// ============================================================================
// 文件变更 Hooks
// ============================================================================

// 上传文件
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (data: UploadFileRequest) => FileService.uploadFile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Upload Successful',
        message: `File "${data.originalName}" has been uploaded successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error.response?.data?.message || 'Failed to upload file.',
      });
    },
  });
};

// 批量上传文件
export const useUploadFiles = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ 
      files, 
      category, 
      isPublic 
    }: { 
      files: File[]; 
      category?: string; 
      isPublic?: boolean 
    }) => FileService.uploadFiles(files, category, isPublic),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Upload Successful',
        message: `${data.length} files have been uploaded successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error.response?.data?.message || 'Failed to upload files.',
      });
    },
  });
};

// 下载文件
export const useDownloadFile = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => FileService.downloadFile(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `file_${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addNotification({
        type: 'success',
        title: 'Download Started',
        message: 'File download has started.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: error.response?.data?.message || 'Failed to download file.',
      });
    },
  });
};

// 删除文件
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => FileService.deleteFile(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: FILE_QUERY_KEYS.detail(id) });
      queryClient.removeQueries({ queryKey: FILE_QUERY_KEYS.preview(id) });
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'File has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.response?.data?.message || 'Failed to delete file.',
      });
    },
  });
};

// 批量删除文件
export const useDeleteFiles = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (ids: string[]) => FileService.deleteFiles(ids),
    onSuccess: (_, ids) => {
      ids.forEach(id => {
        queryClient.removeQueries({ queryKey: FILE_QUERY_KEYS.detail(id) });
        queryClient.removeQueries({ queryKey: FILE_QUERY_KEYS.preview(id) });
      });
      
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${ids.length} files have been deleted successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.response?.data?.message || 'Failed to delete files.',
      });
    },
  });
};

// 更新文件
export const useUpdateFile = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: { filename?: string; category?: string; isPublic?: boolean } 
    }) => FileService.updateFile(id, updates),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(FILE_QUERY_KEYS.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `File "${data.originalName}" has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update file.',
      });
    },
  });
};

// 复制文件
export const useCopyFile = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName?: string }) => 
      FileService.copyFile(id, newName),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.lists() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `File "${data.originalName}" has been copied successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: error.response?.data?.message || 'Failed to copy file.',
      });
    },
  });
};

// 分享文件
export const useShareFile = () => {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: ({ id, expiresIn }: { id: string; expiresIn?: number }) => 
      FileService.shareFile(id, expiresIn),
    onSuccess: (data) => {
      // 复制分享链接到剪贴板
      navigator.clipboard.writeText(data.shareUrl).then(() => {
        addNotification({
          type: 'success',
          title: 'Share Link Created',
          message: 'Share link has been copied to clipboard.',
        });
      }).catch(() => {
        addNotification({
          type: 'success',
          title: 'Share Link Created',
          message: `Share link: ${data.shareUrl}`,
          autoHide: false,
        });
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Share Failed',
        message: error.response?.data?.message || 'Failed to create share link.',
      });
    },
  });
};

// ============================================================================
// 下载变更 Hooks
// ============================================================================

// 创建下载项
export const useCreateDownload = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (data: CreateDownloadRequest) => FileService.createDownload(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DOWNLOAD_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOWNLOAD_QUERY_KEYS.stats() });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `Download "${data.name}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.response?.data?.message || 'Failed to create download.',
      });
    },
  });
};

// 下载项目
export const useDownloadItem = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: (id: string) => FileService.downloadItem(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `download_${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // 刷新统计数据
      queryClient.invalidateQueries({ queryKey: DOWNLOAD_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: DOWNLOAD_QUERY_KEYS.popular() });
      
      addNotification({
        type: 'success',
        title: 'Download Started',
        message: 'Download has started successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: error.response?.data?.message || 'Failed to download item.',
      });
    },
  });
};
