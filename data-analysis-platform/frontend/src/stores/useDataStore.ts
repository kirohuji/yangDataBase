import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 数据类型定义
export interface PhenotypeData {
  id: string;
  name: string;
  description: string;
  category: string;
  samples: number;
  traits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisTool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Available' | 'Beta' | 'Coming Soon';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
}

export interface DownloadItem {
  id: string;
  name: string;
  description: string;
  type: 'dataset' | 'result' | 'documentation';
  size: string;
  format: string;
  downloadCount?: number;
  lastUpdated?: string;
  status?: 'Completed' | 'Processing' | 'Failed';
  version?: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  sortBy: 'name' | 'date' | 'size' | 'downloads';
  sortOrder: 'asc' | 'desc';
}

// 数据状态接口
interface DataState {
  // 表型数据
  phenotypes: PhenotypeData[];
  phenotypeLoading: boolean;
  phenotypeError: string | null;
  
  // 分析工具
  tools: AnalysisTool[];
  toolsLoading: boolean;
  toolsError: string | null;
  
  // 下载数据
  downloads: DownloadItem[];
  downloadsLoading: boolean;
  downloadsError: string | null;
  
  // 搜索和过滤
  searchFilters: SearchFilters;
  searchResults: any[];
  
  // 选中的项目
  selectedItems: string[];
  
  // 分页
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface DataActions {
  // 表型数据操作
  fetchPhenotypes: () => Promise<void>;
  setPhenotypes: (phenotypes: PhenotypeData[]) => void;
  addPhenotype: (phenotype: PhenotypeData) => void;
  updatePhenotype: (id: string, updates: Partial<PhenotypeData>) => void;
  deletePhenotype: (id: string) => void;
  
  // 分析工具操作
  fetchTools: () => Promise<void>;
  setTools: (tools: AnalysisTool[]) => void;
  
  // 下载数据操作
  fetchDownloads: () => Promise<void>;
  setDownloads: (downloads: DownloadItem[]) => void;
  
  // 搜索和过滤操作
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchFilters: () => void;
  performSearch: () => Promise<void>;
  
  // 选择操作
  setSelectedItems: (items: string[]) => void;
  toggleItemSelection: (id: string) => void;
  clearSelection: () => void;
  
  // 分页操作
  setPagination: (pagination: Partial<DataState['pagination']>) => void;
  
  // 重置操作
  resetDataState: () => void;
}

type DataStore = DataState & DataActions;

// 默认搜索过滤器
const defaultSearchFilters: SearchFilters = {
  query: '',
  category: 'All',
  dateRange: {
    start: null,
    end: null,
  },
  sortBy: 'name',
  sortOrder: 'asc',
};

// 创建数据存储
export const useDataStore = create<DataStore>()(
  devtools(
    (set, get) => ({
      // 初始状态
      phenotypes: [],
      phenotypeLoading: false,
      phenotypeError: null,
      
      tools: [],
      toolsLoading: false,
      toolsError: null,
      
      downloads: [],
      downloadsLoading: false,
      downloadsError: null,
      
      searchFilters: defaultSearchFilters,
      searchResults: [],
      
      selectedItems: [],
      
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
      },

      // 表型数据操作
      fetchPhenotypes: async () => {
        set({ phenotypeLoading: true, phenotypeError: null }, false, 'fetchPhenotypes/start');
        
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockPhenotypes: PhenotypeData[] = [
            {
              id: '1',
              name: 'Plant Height',
              description: 'Measurement of plant height in centimeters',
              category: 'Morphology',
              samples: 1250,
              traits: ['Height', 'Growth'],
              createdAt: '2024-01-01',
              updatedAt: '2024-01-15',
            },
            // 更多模拟数据...
          ];
          
          set({
            phenotypes: mockPhenotypes,
            phenotypeLoading: false,
            pagination: { ...get().pagination, total: mockPhenotypes.length },
          }, false, 'fetchPhenotypes/success');
          
        } catch (error) {
          set({
            phenotypeError: error instanceof Error ? error.message : 'Failed to fetch phenotypes',
            phenotypeLoading: false,
          }, false, 'fetchPhenotypes/error');
        }
      },

      setPhenotypes: (phenotypes) => {
        set({ phenotypes }, false, 'setPhenotypes');
      },

      addPhenotype: (phenotype) => {
        set((state) => ({
          phenotypes: [...state.phenotypes, phenotype],
        }), false, 'addPhenotype');
      },

      updatePhenotype: (id, updates) => {
        set((state) => ({
          phenotypes: state.phenotypes.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }), false, 'updatePhenotype');
      },

      deletePhenotype: (id) => {
        set((state) => ({
          phenotypes: state.phenotypes.filter((p) => p.id !== id),
        }), false, 'deletePhenotype');
      },

      // 分析工具操作
      fetchTools: async () => {
        set({ toolsLoading: true, toolsError: null }, false, 'fetchTools/start');
        
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const mockTools: AnalysisTool[] = [
            {
              id: '1',
              name: 'Genome Browser',
              description: 'Interactive genome visualization and annotation tool',
              category: 'Genomic Analysis',
              status: 'Available',
              complexity: 'Intermediate',
              icon: 'BiotechIcon',
            },
            // 更多模拟数据...
          ];
          
          set({ tools: mockTools, toolsLoading: false }, false, 'fetchTools/success');
          
        } catch (error) {
          set({
            toolsError: error instanceof Error ? error.message : 'Failed to fetch tools',
            toolsLoading: false,
          }, false, 'fetchTools/error');
        }
      },

      setTools: (tools) => {
        set({ tools }, false, 'setTools');
      },

      // 下载数据操作
      fetchDownloads: async () => {
        set({ downloadsLoading: true, downloadsError: null }, false, 'fetchDownloads/start');
        
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const mockDownloads: DownloadItem[] = [
            {
              id: '1',
              name: 'Genome Assembly v2.1',
              description: 'Complete genome assembly with annotations',
              type: 'dataset',
              size: '2.3 GB',
              format: 'FASTA',
              downloadCount: 1250,
              lastUpdated: '2024-01-15',
            },
            // 更多模拟数据...
          ];
          
          set({ downloads: mockDownloads, downloadsLoading: false }, false, 'fetchDownloads/success');
          
        } catch (error) {
          set({
            downloadsError: error instanceof Error ? error.message : 'Failed to fetch downloads',
            downloadsLoading: false,
          }, false, 'fetchDownloads/error');
        }
      },

      setDownloads: (downloads) => {
        set({ downloads }, false, 'setDownloads');
      },

      // 搜索和过滤操作
      setSearchFilters: (filters) => {
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        }), false, 'setSearchFilters');
      },

      clearSearchFilters: () => {
        set({ searchFilters: defaultSearchFilters }, false, 'clearSearchFilters');
      },

      performSearch: async () => {
        const { searchFilters, phenotypes, tools, downloads } = get();
        
        // 简单的客户端搜索实现
        const allItems = [
          ...phenotypes.map(p => ({ ...p, type: 'phenotype' })),
          ...tools.map(t => ({ ...t, type: 'tool' })),
          ...downloads.map(d => ({ ...d, type: 'download' })),
        ];
        
        let results = allItems;
        
        // 应用查询过滤器
        if (searchFilters.query) {
          results = results.filter(item =>
            item.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
            item.description.toLowerCase().includes(searchFilters.query.toLowerCase())
          );
        }
        
        // 应用分类过滤器
        if (searchFilters.category !== 'All') {
          results = results.filter(item => item.category === searchFilters.category);
        }
        
        // 应用排序
        results.sort((a, b) => {
          const aValue = a[searchFilters.sortBy as keyof typeof a];
          const bValue = b[searchFilters.sortBy as keyof typeof b];
          
          if (searchFilters.sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
        
        set({ searchResults: results }, false, 'performSearch');
      },

      // 选择操作
      setSelectedItems: (items) => {
        set({ selectedItems: items }, false, 'setSelectedItems');
      },

      toggleItemSelection: (id) => {
        set((state) => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter(item => item !== id)
            : [...state.selectedItems, id],
        }), false, 'toggleItemSelection');
      },

      clearSelection: () => {
        set({ selectedItems: [] }, false, 'clearSelection');
      },

      // 分页操作
      setPagination: (pagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        }), false, 'setPagination');
      },

      // 重置操作
      resetDataState: () => {
        set({
          phenotypes: [],
          phenotypeLoading: false,
          phenotypeError: null,
          tools: [],
          toolsLoading: false,
          toolsError: null,
          downloads: [],
          downloadsLoading: false,
          downloadsError: null,
          searchFilters: defaultSearchFilters,
          searchResults: [],
          selectedItems: [],
          pagination: { page: 1, limit: 20, total: 0 },
        }, false, 'resetDataState');
      },
    }),
    {
      name: 'DataStore',
    }
  )
);
