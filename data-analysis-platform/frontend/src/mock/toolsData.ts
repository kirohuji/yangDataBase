// 工具数据 Mock 数据
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  tags: string[];
  inputFormats: string[];
  outputFormats: string[];
  parameters: ToolParameter[];
  documentation?: string;
  example?: string;
  status: 'active' | 'deprecated' | 'beta';
  createdAt: string;
  updatedAt: string;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'select';
  required: boolean;
  description: string;
  defaultValue?: any;
  options?: string[];
  min?: number;
  max?: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

// Mock 工具分类
export const mockToolCategories: ToolCategory[] = [
  {
    id: 'genomics',
    name: '基因组学分析',
    description: '基因组数据处理和分析工具',
    icon: 'dna'
  },
  {
    id: 'statistics',
    name: '统计分析',
    description: '数据统计和建模工具',
    icon: 'chart'
  },
  {
    id: 'visualization',
    name: '数据可视化',
    description: '图表和可视化工具',
    icon: 'chart-bar'
  },
  {
    id: 'preprocessing',
    name: '数据预处理',
    description: '数据清洗和转换工具',
    icon: 'filter'
  },
  {
    id: 'machine-learning',
    name: '机器学习',
    description: '机器学习和AI分析工具',
    icon: 'brain'
  }
];

// Mock 工具数据
export const mockTools: Tool[] = [
  {
    id: 'gwas-analysis',
    name: 'GWAS分析工具',
    description: '全基因组关联分析，用于识别与性状相关的遗传变异',
    category: 'genomics',
    version: '2.1.0',
    author: '基因组学团队',
    tags: ['GWAS', '关联分析', 'SNP', '遗传学'],
    inputFormats: ['VCF', 'PLINK', 'HapMap'],
    outputFormats: ['TXT', 'PDF', 'PNG'],
    parameters: [
      {
        name: 'pvalue_threshold',
        type: 'number',
        required: true,
        description: 'P值阈值',
        defaultValue: 0.05,
        min: 0.001,
        max: 0.1
      },
      {
        name: 'maf_threshold',
        type: 'number',
        required: true,
        description: '最小等位基因频率',
        defaultValue: 0.05,
        min: 0.01,
        max: 0.5
      },
      {
        name: 'model',
        type: 'select',
        required: true,
        description: '分析模型',
        defaultValue: 'additive',
        options: ['additive', 'dominant', 'recessive']
      },
      {
        name: 'covariate_file',
        type: 'file',
        required: false,
        description: '协变量文件'
      }
    ],
    documentation: '详细的GWAS分析使用说明...',
    example: 'gwas_tool --vcf input.vcf --pheno pheno.txt --out results',
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-11-20T14:30:00Z'
  },
  {
    id: 'pca-analysis',
    name: '主成分分析',
    description: '对高维数据进行降维分析，识别主要变异模式',
    category: 'statistics',
    version: '1.5.2',
    author: '统计分析团队',
    tags: ['PCA', '降维', '统计分析', '数据挖掘'],
    inputFormats: ['CSV', 'TSV', 'XLSX'],
    outputFormats: ['PNG', 'PDF', 'SVG', 'CSV'],
    parameters: [
      {
        name: 'n_components',
        type: 'number',
        required: false,
        description: '主成分数量',
        defaultValue: 10,
        min: 2,
        max: 50
      },
      {
        name: 'standardize',
        type: 'boolean',
        required: false,
        description: '是否标准化数据',
        defaultValue: true
      },
      {
        name: 'plot_type',
        type: 'select',
        required: false,
        description: '图表类型',
        defaultValue: 'scatter',
        options: ['scatter', 'biplot', 'scree']
      }
    ],
    status: 'active',
    createdAt: '2023-02-10T09:00:00Z',
    updatedAt: '2023-10-15T16:45:00Z'
  },
  {
    id: 'heatmap-generator',
    name: '热图生成器',
    description: '生成高质量的热图，用于展示数据矩阵和相关性',
    category: 'visualization',
    version: '3.0.1',
    author: '可视化团队',
    tags: ['热图', '可视化', '相关性', '聚类'],
    inputFormats: ['CSV', 'TSV', 'XLSX'],
    outputFormats: ['PNG', 'PDF', 'SVG'],
    parameters: [
      {
        name: 'clustering_method',
        type: 'select',
        required: false,
        description: '聚类方法',
        defaultValue: 'ward',
        options: ['ward', 'complete', 'average', 'single']
      },
      {
        name: 'color_scheme',
        type: 'select',
        required: false,
        description: '颜色方案',
        defaultValue: 'RdYlBu',
        options: ['RdYlBu', 'viridis', 'plasma', 'coolwarm']
      },
      {
        name: 'show_dendrograms',
        type: 'boolean',
        required: false,
        description: '显示聚类树',
        defaultValue: true
      },
      {
        name: 'figure_width',
        type: 'number',
        required: false,
        description: '图像宽度(英寸)',
        defaultValue: 10,
        min: 5,
        max: 20
      },
      {
        name: 'figure_height',
        type: 'number',
        required: false,
        description: '图像高度(英寸)',
        defaultValue: 8,
        min: 4,
        max: 16
      }
    ],
    status: 'active',
    createdAt: '2023-03-05T11:30:00Z',
    updatedAt: '2023-12-01T10:15:00Z'
  },
  {
    id: 'data-cleaner',
    name: '数据清洗工具',
    description: '自动检测和处理数据中的缺失值、异常值和重复项',
    category: 'preprocessing',
    version: '2.3.0',
    author: '数据处理团队',
    tags: ['数据清洗', '预处理', '缺失值', '异常值'],
    inputFormats: ['CSV', 'TSV', 'XLSX', 'JSON'],
    outputFormats: ['CSV', 'TSV', 'XLSX'],
    parameters: [
      {
        name: 'missing_threshold',
        type: 'number',
        required: false,
        description: '缺失值阈值(%)',
        defaultValue: 20,
        min: 0,
        max: 100
      },
      {
        name: 'outlier_method',
        type: 'select',
        required: false,
        description: '异常值检测方法',
        defaultValue: 'iqr',
        options: ['iqr', 'zscore', 'isolation_forest']
      },
      {
        name: 'remove_duplicates',
        type: 'boolean',
        required: false,
        description: '移除重复行',
        defaultValue: true
      },
      {
        name: 'imputation_method',
        type: 'select',
        required: false,
        description: '缺失值填补方法',
        defaultValue: 'mean',
        options: ['mean', 'median', 'mode', 'forward_fill', 'backward_fill']
      }
    ],
    status: 'active',
    createdAt: '2023-04-12T14:20:00Z',
    updatedAt: '2023-11-30T09:45:00Z'
  },
  {
    id: 'random-forest',
    name: '随机森林分类器',
    description: '基于随机森林算法的机器学习分类和回归工具',
    category: 'machine-learning',
    version: '1.8.5',
    author: 'AI团队',
    tags: ['机器学习', '随机森林', '分类', '回归', '特征选择'],
    inputFormats: ['CSV', 'TSV', 'XLSX'],
    outputFormats: ['CSV', 'PNG', 'PDF', 'JSON'],
    parameters: [
      {
        name: 'n_estimators',
        type: 'number',
        required: false,
        description: '决策树数量',
        defaultValue: 100,
        min: 10,
        max: 1000
      },
      {
        name: 'max_depth',
        type: 'number',
        required: false,
        description: '最大深度',
        defaultValue: 10,
        min: 1,
        max: 50
      },
      {
        name: 'test_size',
        type: 'number',
        required: false,
        description: '测试集比例',
        defaultValue: 0.2,
        min: 0.1,
        max: 0.5
      },
      {
        name: 'random_state',
        type: 'number',
        required: false,
        description: '随机种子',
        defaultValue: 42
      },
      {
        name: 'cross_validation',
        type: 'boolean',
        required: false,
        description: '交叉验证',
        defaultValue: true
      }
    ],
    status: 'active',
    createdAt: '2023-05-20T16:00:00Z',
    updatedAt: '2023-12-05T11:20:00Z'
  },
  {
    id: 'correlation-analysis',
    name: '相关性分析',
    description: '计算变量间的相关系数，支持多种相关性度量方法',
    category: 'statistics',
    version: '2.0.3',
    author: '统计分析团队',
    tags: ['相关性', '统计分析', 'Pearson', 'Spearman'],
    inputFormats: ['CSV', 'TSV', 'XLSX'],
    outputFormats: ['CSV', 'PNG', 'PDF'],
    parameters: [
      {
        name: 'method',
        type: 'select',
        required: false,
        description: '相关性方法',
        defaultValue: 'pearson',
        options: ['pearson', 'spearman', 'kendall']
      },
      {
        name: 'significance_test',
        type: 'boolean',
        required: false,
        description: '显著性检验',
        defaultValue: true
      },
      {
        name: 'alpha',
        type: 'number',
        required: false,
        description: '显著性水平',
        defaultValue: 0.05,
        min: 0.001,
        max: 0.1
      }
    ],
    status: 'active',
    createdAt: '2023-06-15T13:45:00Z',
    updatedAt: '2023-09-20T15:30:00Z'
  },
  {
    id: 'phylogenetic-tree',
    name: '系统发育树构建',
    description: '基于分子数据构建系统发育树，支持多种建树方法',
    category: 'genomics',
    version: '1.2.1',
    author: '进化生物学团队',
    tags: ['系统发育', '进化分析', '分子钟', 'NJ', 'ML'],
    inputFormats: ['FASTA', 'PHYLIP', 'NEXUS'],
    outputFormats: ['NEWICK', 'PNG', 'PDF', 'SVG'],
    parameters: [
      {
        name: 'method',
        type: 'select',
        required: true,
        description: '建树方法',
        defaultValue: 'neighbor_joining',
        options: ['neighbor_joining', 'maximum_likelihood', 'maximum_parsimony']
      },
      {
        name: 'bootstrap',
        type: 'number',
        required: false,
        description: 'Bootstrap重复次数',
        defaultValue: 1000,
        min: 100,
        max: 10000
      },
      {
        name: 'outgroup',
        type: 'string',
        required: false,
        description: '外群序列名称'
      }
    ],
    status: 'beta',
    createdAt: '2023-07-10T10:15:00Z',
    updatedAt: '2023-11-25T14:00:00Z'
  },
  {
    id: 'gene-expression-analysis',
    name: '基因表达分析',
    description: 'RNA-seq数据的差异表达分析和功能富集分析',
    category: 'genomics',
    version: '3.1.2',
    author: '转录组学团队',
    tags: ['RNA-seq', '差异表达', 'DEG', 'GO富集', 'KEGG'],
    inputFormats: ['CSV', 'TSV', 'XLSX'],
    outputFormats: ['CSV', 'PNG', 'PDF', 'HTML'],
    parameters: [
      {
        name: 'fold_change_threshold',
        type: 'number',
        required: false,
        description: '倍数变化阈值',
        defaultValue: 2.0,
        min: 1.2,
        max: 10.0
      },
      {
        name: 'pvalue_threshold',
        type: 'number',
        required: false,
        description: 'P值阈值',
        defaultValue: 0.05,
        min: 0.001,
        max: 0.1
      },
      {
        name: 'normalization_method',
        type: 'select',
        required: false,
        description: '标准化方法',
        defaultValue: 'TMM',
        options: ['TMM', 'RLE', 'upperquartile', 'none']
      },
      {
        name: 'go_enrichment',
        type: 'boolean',
        required: false,
        description: 'GO富集分析',
        defaultValue: true
      },
      {
        name: 'kegg_enrichment',
        type: 'boolean',
        required: false,
        description: 'KEGG通路分析',
        defaultValue: true
      }
    ],
    status: 'active',
    createdAt: '2023-08-05T12:30:00Z',
    updatedAt: '2023-12-10T16:20:00Z'
  }
];

// Mock 工具执行结果
export interface ToolResult {
  id: string;
  toolId: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  startTime: string;
  endTime?: string;
  inputFiles: string[];
  outputFiles: string[];
  parameters: Record<string, any>;
  logs: string[];
  error?: string;
}

export const mockToolResults: ToolResult[] = [
  {
    id: 'result_001',
    toolId: 'gwas-analysis',
    status: 'completed',
    progress: 100,
    startTime: '2023-12-01T10:00:00Z',
    endTime: '2023-12-01T10:15:00Z',
    inputFiles: ['genotype.vcf', 'phenotype.txt'],
    outputFiles: ['gwas_results.txt', 'manhattan_plot.png', 'qq_plot.png'],
    parameters: {
      pvalue_threshold: 0.05,
      maf_threshold: 0.05,
      model: 'additive'
    },
    logs: [
      '开始GWAS分析...',
      '读取基因型数据: 1000个样本, 50000个SNP',
      '读取表型数据: 1000个样本',
      '质量控制: 移除45000个低质量SNP',
      '关联分析完成',
      '生成曼哈顿图',
      '生成QQ图',
      '分析完成'
    ]
  },
  {
    id: 'result_002',
    toolId: 'pca-analysis',
    status: 'running',
    progress: 65,
    startTime: '2023-12-01T14:30:00Z',
    inputFiles: ['expression_data.csv'],
    outputFiles: [],
    parameters: {
      n_components: 10,
      standardize: true,
      plot_type: 'scatter'
    },
    logs: [
      '开始PCA分析...',
      '读取数据: 500个样本, 20000个特征',
      '数据标准化完成',
      '计算主成分中...'
    ]
  }
];

// 生成更多模拟工具结果
export const generateMockToolResults = (count: number): ToolResult[] => {
  const statuses: ToolResult['status'][] = ['completed', 'running', 'failed', 'queued'];
  const results: ToolResult[] = [];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const progress = status === 'completed' ? 100 : 
                    status === 'failed' ? 0 : 
                    status === 'queued' ? 0 : 
                    Math.floor(Math.random() * 90) + 10;
    
    results.push({
      id: `result_${i + 3}`,
      toolId: mockTools[Math.floor(Math.random() * mockTools.length)].id,
      status,
      progress,
      startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: status === 'completed' ? new Date().toISOString() : undefined,
      inputFiles: [`input_${i + 1}.csv`],
      outputFiles: status === 'completed' ? [`output_${i + 1}.csv`, `plot_${i + 1}.png`] : [],
      parameters: {},
      logs: [`任务 ${i + 1} 日志...`],
      error: status === 'failed' ? '分析过程中发生错误' : undefined
    });
  }
  
  return results;
};
