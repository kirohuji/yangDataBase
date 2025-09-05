import { api } from './api';
import type { 
  FileInfo, 
  UploadFileRequest, 
  FileSearchParams,
  DownloadItem,
  CreateDownloadRequest,
  DownloadSearchParams,
  PaginatedResponse 
} from '@/types/api';

// ============================================================================
// 文件管理服务
// ============================================================================

export class FileService {
  private static readonly BASE_URL = '/files';
  private static readonly DOWNLOADS_URL = '/downloads';

  // ============================================================================
  // 文件管理
  // ============================================================================

  // 获取文件列表
  static async getFiles(params?: FileSearchParams): Promise<PaginatedResponse<FileInfo>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.BASE_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await api.get<PaginatedResponse<FileInfo>>(url);
  }

  // 根据ID获取文件信息
  static async getFileById(id: string): Promise<FileInfo> {
    return await api.get<FileInfo>(`${this.BASE_URL}/${id}`);
  }

  // 上传文件
  static async uploadFile(data: UploadFileRequest): Promise<FileInfo> {
    const formData = new FormData();
    formData.append('file', data.file);
    
    if (data.category) {
      formData.append('category', data.category);
    }
    
    if (data.isPublic !== undefined) {
      formData.append('isPublic', data.isPublic.toString());
    }

    return await api.post<FileInfo>(`${this.BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // 批量上传文件
  static async uploadFiles(files: File[], category?: string, isPublic?: boolean): Promise<FileInfo[]> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    if (category) {
      formData.append('category', category);
    }
    
    if (isPublic !== undefined) {
      formData.append('isPublic', isPublic.toString());
    }

    return await api.post<FileInfo[]>(`${this.BASE_URL}/upload-batch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // 下载文件
  static async downloadFile(id: string): Promise<Blob> {
    const response = await api.get(`${this.BASE_URL}/${id}/download`, {
      responseType: 'blob'
    });

    return response as unknown as Blob;
  }

  // 获取文件预览
  static async getFilePreview(id: string): Promise<{
    content: string;
    type: 'text' | 'image' | 'json' | 'csv' | 'binary';
    size: number;
    encoding?: string;
  }> {
    return await api.get(`${this.BASE_URL}/${id}/preview`);
  }

  // 删除文件
  static async deleteFile(id: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }

  // 批量删除文件
  static async deleteFiles(ids: string[]): Promise<void> {
    await api.post(`${this.BASE_URL}/batch-delete`, { ids });
  }

  // 更新文件信息
  static async updateFile(id: string, updates: {
    filename?: string;
    category?: string;
    isPublic?: boolean;
  }): Promise<FileInfo> {
    return await api.put<FileInfo>(`${this.BASE_URL}/${id}`, updates);
  }

  // 复制文件
  static async copyFile(id: string, newName?: string): Promise<FileInfo> {
    return await api.post<FileInfo>(`${this.BASE_URL}/${id}/copy`, {
      ...(newName && { filename: newName })
    });
  }

  // 移动文件
  static async moveFile(id: string, category: string): Promise<FileInfo> {
    return await api.post<FileInfo>(`${this.BASE_URL}/${id}/move`, { category });
  }

  // 获取文件分享链接
  static async shareFile(id: string, expiresIn?: number): Promise<{
    shareUrl: string;
    expiresAt: string;
    shareId: string;
  }> {
    return await api.post(`${this.BASE_URL}/${id}/share`, {
      ...(expiresIn && { expiresIn })
    });
  }

  // 取消文件分享
  static async unshareFile(shareId: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/shares/${shareId}`);
  }

  // 通过分享链接下载文件
  static async downloadSharedFile(shareId: string): Promise<Blob> {
    const response = await api.get(`${this.BASE_URL}/shares/${shareId}/download`, {
      responseType: 'blob',
      skipAuth: true
    });

    return response as unknown as Blob;
  }

  // ============================================================================
  // 文件搜索和过滤
  // ============================================================================

  // 搜索文件
  static async searchFiles(query: string, filters?: Partial<FileSearchParams>): Promise<FileInfo[]> {
    const searchParams = new URLSearchParams({ query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return await api.get<FileInfo[]>(`${this.BASE_URL}/search?${searchParams.toString()}`);
  }

  // 获取文件分类
  static async getFileCategories(): Promise<string[]> {
    return await api.get<string[]>(`${this.BASE_URL}/categories`);
  }

  // 获取文件类型统计
  static async getFileStats(): Promise<{
    total: number;
    totalSize: number;
    categories: Record<string, number>;
    mimetypes: Record<string, number>;
    sizeDistribution: {
      range: string;
      count: number;
    }[];
    recentUploads: {
      date: string;
      count: number;
      size: number;
    }[];
  }> {
    return await api.get(`${this.BASE_URL}/stats`);
  }

  // ============================================================================
  // 下载中心
  // ============================================================================

  // 获取下载列表
  static async getDownloads(params?: DownloadSearchParams): Promise<PaginatedResponse<DownloadItem>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.DOWNLOADS_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await api.get<PaginatedResponse<DownloadItem>>(url);
  }

  // 根据ID获取下载项
  static async getDownloadById(id: string): Promise<DownloadItem> {
    return await api.get<DownloadItem>(`${this.DOWNLOADS_URL}/${id}`);
  }

  // 创建下载项
  static async createDownload(data: CreateDownloadRequest): Promise<DownloadItem> {
    return await api.post<DownloadItem>(this.DOWNLOADS_URL, data);
  }

  // 下载项目
  static async downloadItem(id: string): Promise<Blob> {
    // 增加下载计数
    await api.post(`${this.DOWNLOADS_URL}/${id}/increment-count`);
    
    // 下载文件
    const response = await api.get(`${this.DOWNLOADS_URL}/${id}/download`, {
      responseType: 'blob'
    });

    return response as unknown as Blob;
  }

  // 获取热门下载
  static async getPopularDownloads(limit: number = 10): Promise<DownloadItem[]> {
    return await api.get<DownloadItem[]>(`${this.DOWNLOADS_URL}/popular?limit=${limit}`);
  }

  // 获取最新下载
  static async getLatestDownloads(limit: number = 10): Promise<DownloadItem[]> {
    return await api.get<DownloadItem[]>(`${this.DOWNLOADS_URL}/latest?limit=${limit}`);
  }

  // 搜索下载项
  static async searchDownloads(query: string, filters?: Partial<DownloadSearchParams>): Promise<DownloadItem[]> {
    const searchParams = new URLSearchParams({ query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return await api.get<DownloadItem[]>(`${this.DOWNLOADS_URL}/search?${searchParams.toString()}`);
  }

  // 获取下载统计
  static async getDownloadStats(): Promise<{
    total: number;
    totalDownloads: number;
    totalSize: string;
    types: Record<string, number>;
    formats: Record<string, number>;
    downloadsByDay: {
      date: string;
      downloads: number;
    }[];
    topDownloads: {
      id: string;
      name: string;
      downloads: number;
    }[];
  }> {
    return await api.get(`${this.DOWNLOADS_URL}/stats`);
  }
}

export default FileService;
