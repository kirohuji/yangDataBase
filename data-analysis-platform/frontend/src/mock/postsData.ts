// 文章数据 Mock 数据
import { PostMeta, CategoryMeta, PostsIndex } from '../services/postsService';

// Mock 分类数据
export const mockCategories: CategoryMeta[] = [
  {
    id: 'research',
    name: '研究论文',
    description: '学术研究和科研成果',
    children: [
      {
        id: 'papers',
        name: '期刊论文',
        description: '发表在学术期刊上的研究论文'
      },
      {
        id: 'reports',
        name: '研究报告',
        description: '项目研究报告和技术文档'
      }
    ]
  },
  {
    id: 'news',
    name: '新闻动态',
    description: '最新消息和公告',
    children: [
      {
        id: 'updates',
        name: '系统更新',
        description: '平台功能更新和改进'
      },
      {
        id: 'announcements',
        name: '重要公告',
        description: '重要通知和公告信息'
      }
    ]
  },
  {
    id: 'tutorials',
    name: '教程指南',
    description: '使用教程和操作指南',
    children: [
      {
        id: 'guides',
        name: '用户指南',
        description: '平台使用指南和最佳实践'
      },
      {
        id: 'api',
        name: 'API文档',
        description: 'API接口文档和示例'
      }
    ]
  }
];

// Mock 文章数据
export const mockPosts: PostMeta[] = [
  {
    id: 'cucumber-gwas',
    title: '黄瓜全基因组关联分析研究',
    path: '/posts/research/cucumber-gwas.md',
    category: 'papers',
    tags: ['GWAS', '黄瓜', '基因组学', '表型分析'],
    status: 'published',
    featured: true,
    summary: '本研究通过全基因组关联分析(GWAS)方法，对200份黄瓜种质资源的重要农艺性状进行了遗传解析，发现了多个与果实大小、抗病性相关的重要位点。',
    author: '张研究员',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z',
    readTime: 8,
    views: 1250,
    image: '/images/cucumber-research.jpg'
  },
  {
    id: 'tomato-resistance',
    title: '番茄抗病基因挖掘与功能验证',
    path: '/posts/research/tomato-resistance.md',
    category: 'papers',
    tags: ['番茄', '抗病基因', '功能基因组学'],
    status: 'published',
    featured: true,
    summary: '通过比较基因组学和转录组分析，我们鉴定了番茄中新的抗病基因家族，并通过功能验证确认了其抗病机制。',
    author: '李教授',
    createdAt: '2023-11-15T14:30:00Z',
    updatedAt: '2023-11-15T14:30:00Z',
    readTime: 12,
    views: 980,
    image: '/images/tomato-genes.jpg'
  },
  {
    id: 'maize-kernel-development',
    title: '玉米籽粒发育的转录调控网络',
    path: '/posts/research/maize-kernel-development.md',
    category: 'papers',
    tags: ['玉米', '籽粒发育', '转录调控', 'RNA-seq'],
    status: 'published',
    summary: '利用时间序列转录组数据，构建了玉米籽粒发育过程中的基因调控网络，揭示了关键转录因子的调控机制。',
    author: '王博士',
    createdAt: '2023-10-20T09:15:00Z',
    updatedAt: '2023-10-20T09:15:00Z',
    readTime: 10,
    views: 756,
    image: '/images/maize-kernel.jpg'
  },
  {
    id: 'system-upgrade',
    title: '数据分析平台v2.0重大更新',
    path: '/posts/news/system-upgrade.md',
    category: 'updates',
    tags: ['系统更新', '新功能', '用户体验'],
    status: 'published',
    featured: false,
    summary: '平台迎来重大更新，新增了高级数据可视化功能、批量数据处理工具，以及改进的用户界面设计。',
    author: '开发团队',
    createdAt: '2023-12-10T16:00:00Z',
    updatedAt: '2023-12-10T16:00:00Z',
    readTime: 5,
    views: 2100,
    image: '/images/platform-update.jpg'
  },
  {
    id: 'genomics-analysis-guide',
    title: '基因组学数据分析完整指南',
    path: '/posts/tutorials/genomics-analysis-guide.md',
    category: 'guides',
    tags: ['基因组学', '数据分析', '教程', 'NGS'],
    status: 'published',
    featured: true,
    summary: '从原始测序数据到生物学解释的完整分析流程，包括质控、比对、变异检测、注释等关键步骤的详细说明。',
    author: '分析团队',
    createdAt: '2023-11-01T11:00:00Z',
    updatedAt: '2023-12-05T15:30:00Z',
    readTime: 25,
    views: 3200,
    image: '/images/genomics-guide.jpg'
  },
  {
    id: 'api-documentation',
    title: 'REST API 接口文档',
    path: '/posts/tutorials/api-documentation.md',
    category: 'api',
    tags: ['API', '接口文档', '开发者'],
    status: 'published',
    summary: '平台提供的REST API接口详细文档，包括认证、数据查询、文件上传等功能的使用说明和示例代码。',
    author: '技术团队',
    createdAt: '2023-09-15T13:45:00Z',
    updatedAt: '2023-11-20T10:20:00Z',
    readTime: 15,
    views: 1800,
    image: '/images/api-docs.jpg'
  },
  {
    id: 'data-privacy-policy',
    title: '数据隐私保护政策更新',
    path: '/posts/news/data-privacy-policy.md',
    category: 'announcements',
    tags: ['隐私政策', '数据保护', '合规'],
    status: 'published',
    summary: '根据最新的数据保护法规，我们更新了平台的隐私保护政策，加强了用户数据的安全保障措施。',
    author: '法务部',
    createdAt: '2023-08-30T14:00:00Z',
    updatedAt: '2023-08-30T14:00:00Z',
    readTime: 7,
    views: 950,
    image: '/images/privacy-policy.jpg'
  },
  {
    id: 'phenotype-analysis-tutorial',
    title: '表型数据分析教程',
    path: '/posts/tutorials/phenotype-analysis-tutorial.md',
    category: 'guides',
    tags: ['表型分析', '统计分析', 'R语言', '数据可视化'],
    status: 'published',
    summary: '详细介绍如何使用平台进行表型数据的统计分析，包括描述性统计、方差分析、相关性分析等方法。',
    author: '统计团队',
    createdAt: '2023-07-10T10:30:00Z',
    updatedAt: '2023-10-15T16:45:00Z',
    readTime: 18,
    views: 2750,
    image: '/images/phenotype-analysis.jpg'
  }
];

// Mock 文章内容
export const mockPostContents: Record<string, string> = {
  'cucumber-gwas': `# 黄瓜全基因组关联分析研究

## 摘要

本研究通过全基因组关联分析(GWAS)方法，对200份黄瓜种质资源的重要农艺性状进行了遗传解析，发现了多个与果实大小、抗病性相关的重要位点。

## 研究背景

黄瓜(Cucumis sativus L.)是世界上重要的蔬菜作物之一，具有重要的经济价值。随着基因组学技术的发展，全基因组关联分析已成为挖掘复杂性状遗传基础的重要工具。

## 材料与方法

### 试验材料
- 200份黄瓜种质资源
- 来源于世界各地的不同生态型

### 表型调查
- 果实长度、直径、重量
- 抗病性评价
- 产量相关性状

### 基因型检测
- 全基因组重测序
- SNP标记开发
- 群体结构分析

## 结果与分析

### 表型变异分析
通过对200份材料的表型调查，发现各性状间存在丰富的遗传变异。

### GWAS分析结果
共检测到15个显著关联的SNP位点，分布在7条染色体上。

## 讨论

本研究为黄瓜重要农艺性状的遗传改良提供了重要的理论基础和分子标记。

## 参考文献

1. Li, Z. et al. (2023). Genome-wide association study reveals...
2. Wang, H. et al. (2022). Genetic diversity and population structure...`,

  'system-upgrade': `# 数据分析平台v2.0重大更新

## 更新概览

我们很高兴地宣布，数据分析平台迎来了v2.0版本的重大更新！本次更新包含了众多新功能和改进，旨在为用户提供更好的数据分析体验。

## 主要新功能

### 1. 高级数据可视化
- 新增交互式图表组件
- 支持多维数据展示
- 自定义图表样式和主题

### 2. 批量数据处理
- 支持大文件批量上传
- 并行数据处理引擎
- 进度实时监控

### 3. 改进的用户界面
- 全新的响应式设计
- 深色模式支持
- 更直观的操作流程

## 性能优化

- 数据加载速度提升50%
- 内存使用优化
- 更稳定的系统运行

## 升级说明

系统将在12月15日进行升级，预计停机时间2小时。请提前保存您的工作。

感谢您的支持！`,

  'genomics-analysis-guide': `# 基因组学数据分析完整指南

## 目录

1. [数据准备](#数据准备)
2. [质量控制](#质量控制)
3. [序列比对](#序列比对)
4. [变异检测](#变异检测)
5. [功能注释](#功能注释)
6. [结果解释](#结果解释)

## 数据准备

### 原始数据格式
- FASTQ格式的测序数据
- 参考基因组序列(FASTA格式)
- 基因注释文件(GFF/GTF格式)

### 数据质量评估
使用FastQC工具进行初步质量评估：

\`\`\`bash
fastqc sample_R1.fastq.gz sample_R2.fastq.gz
\`\`\`

## 质量控制

### 接头序列去除
使用Trimmomatic进行数据清洗：

\`\`\`bash
trimmomatic PE -threads 8 \\
  sample_R1.fastq.gz sample_R2.fastq.gz \\
  sample_R1_clean.fastq.gz sample_R1_unpaired.fastq.gz \\
  sample_R2_clean.fastq.gz sample_R2_unpaired.fastq.gz \\
  ILLUMINACLIP:adapters.fa:2:30:10 \\
  LEADING:3 TRAILING:3 \\
  SLIDINGWINDOW:4:15 MINLEN:36
\`\`\`

## 序列比对

### 使用BWA进行比对
\`\`\`bash
# 建立索引
bwa index reference.fa

# 序列比对
bwa mem -t 8 reference.fa \\
  sample_R1_clean.fastq.gz sample_R2_clean.fastq.gz \\
  > sample.sam
\`\`\`

### SAM文件处理
\`\`\`bash
# 转换为BAM格式并排序
samtools view -bS sample.sam | samtools sort -o sample_sorted.bam
samtools index sample_sorted.bam
\`\`\`

## 变异检测

### 使用GATK进行SNP/InDel检测
\`\`\`bash
# 标记重复序列
gatk MarkDuplicates \\
  -I sample_sorted.bam \\
  -O sample_dedup.bam \\
  -M sample_metrics.txt

# 变异检测
gatk HaplotypeCaller \\
  -R reference.fa \\
  -I sample_dedup.bam \\
  -O sample_variants.vcf
\`\`\`

## 功能注释

### 使用SnpEff进行注释
\`\`\`bash
snpEff -v genome_version sample_variants.vcf > sample_annotated.vcf
\`\`\`

## 结果解释

### 变异统计
- 总变异数量
- SNP/InDel比例
- 转换/颠换比例
- 功能影响分类

### 质量评估指标
- 测序深度分布
- 基因组覆盖度
- 变异质量分数

## 最佳实践建议

1. 始终进行质量控制
2. 使用适当的参考基因组
3. 验证重要变异
4. 注意批次效应
5. 保留原始数据备份

## 常见问题

### Q: 如何选择合适的比对软件？
A: 根据数据类型和分析目的选择，BWA适合短读长数据，minimap2适合长读长数据。

### Q: 变异检测的质量标准是什么？
A: 一般要求质量分数>20，深度>10x，等位基因频率>0.2。

## 相关资源

- [GATK最佳实践](https://gatk.broadinstitute.org/hc/en-us/sections/360007226651)
- [生信分析流程](https://www.bioinformatics.org/)
- [参考基因组数据库](https://www.ncbi.nlm.nih.gov/genome/)`
};

// Mock 索引数据
export const mockPostsIndex: PostsIndex = {
  categories: mockCategories,
  posts: mockPosts
};
