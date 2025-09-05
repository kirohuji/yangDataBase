import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Alert, CircularProgress, Button, Stack } from '@mui/material';
import { Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ViewSwitcher, { ViewType } from '@/components/common/ViewSwitcher';
import CompactFilters from '@/components/common/CompactFilters';
import FileUpload, { ParsedData } from '@/components/common/FileUpload';
import PhenotypeChart from '@/sections/phenotype/PhenotypeChart';
import PhenotypeTable from '@/sections/phenotype/PhenotypeTable';
import BoardView from '@/sections/phenotype/BoardView';
import { PhenotypeData, ChartConfig } from '@/types/phenotype';

// 模拟数据生成函数
const generateMockData = (): PhenotypeData[] => {
  const accessions = ['SL001', 'SL002', 'SL003', 'SL004', 'SL005', 'SL006', 'SL007', 'SL008', 'SL009', 'SL010'];
  const varieties = ['红樱桃', '黄樱桃', '大红果', '粉果', '绿果'];
  const locations = ['北京', '上海', '广州', '深圳', '杭州'];
  
  return accessions.map((accession, index) => ({
    id: `phenotype-${index + 1}`,
    accession,
    variety: varieties[index % varieties.length],
    location: locations[index % locations.length],
    year: 2020 + (index % 4),
    plantHeight: 80 + Math.random() * 40,
    leafLength: 8 + Math.random() * 4,
    leafWidth: 4 + Math.random() * 2,
    fruitWeight: 150 + Math.random() * 100,
    fruitLength: 5 + Math.random() * 3,
    fruitWidth: 4 + Math.random() * 2,
    floweringTime: 45 + Math.floor(Math.random() * 20),
    maturityTime: 75 + Math.floor(Math.random() * 30),
    yieldPerPlant: 2000 + Math.random() * 1000,
    sugarContent: 4 + Math.random() * 3,
    vitaminC: 15 + Math.random() * 10,
  }));
};

// 将上传的数据转换为表型数据格式
const convertParsedDataToPhenotype = (parsedData: ParsedData): PhenotypeData[] => {
  const { headers, rows } = parsedData;
  
  return rows.map((row, index) => {
    const item: any = { id: `row-${index + 1}` };
    
    headers.forEach((header, headerIndex) => {
      const value = row[headerIndex];
      const lowerHeader = header.toLowerCase();
      
      // 智能映射字段
      if (lowerHeader.includes('accession') || lowerHeader.includes('编号')) {
        item.accession = String(value || `Sample-${index + 1}`);
      } else if (lowerHeader.includes('variety') || lowerHeader.includes('品种')) {
        item.variety = String(value || '未知品种');
      } else if (lowerHeader.includes('location') || lowerHeader.includes('地点')) {
        item.location = String(value || '未知地点');
      } else if (lowerHeader.includes('year') || lowerHeader.includes('年份')) {
        item.year = Number(value) || new Date().getFullYear();
      } else if (lowerHeader.includes('height') || lowerHeader.includes('株高')) {
        item.plantHeight = Number(value) || 0;
      } else if (lowerHeader.includes('leaf') && lowerHeader.includes('length')) {
        item.leafLength = Number(value) || 0;
      } else if (lowerHeader.includes('leaf') && lowerHeader.includes('width')) {
        item.leafWidth = Number(value) || 0;
      } else if (lowerHeader.includes('fruit') && lowerHeader.includes('weight')) {
        item.fruitWeight = Number(value) || 0;
      } else if (lowerHeader.includes('fruit') && lowerHeader.includes('length')) {
        item.fruitLength = Number(value) || 0;
      } else if (lowerHeader.includes('fruit') && lowerHeader.includes('width')) {
        item.fruitWidth = Number(value) || 0;
      } else if (lowerHeader.includes('flowering') || lowerHeader.includes('开花')) {
        item.floweringTime = Number(value) || 0;
      } else if (lowerHeader.includes('maturity') || lowerHeader.includes('成熟')) {
        item.maturityTime = Number(value) || 0;
      } else if (lowerHeader.includes('yield') || lowerHeader.includes('产量')) {
        item.yieldPerPlant = Number(value) || 0;
      } else if (lowerHeader.includes('sugar') || lowerHeader.includes('糖')) {
        item.sugarContent = Number(value) || 0;
      } else if (lowerHeader.includes('vitamin') || lowerHeader.includes('维')) {
        item.vitaminC = Number(value) || 0;
      } else {
        // 其他字段保持原样
        item[header] = value;
      }
    });
    
    // 确保必要字段存在
    return {
      id: item.id,
      accession: item.accession || `Sample-${index + 1}`,
      variety: item.variety || '未知品种',
      location: item.location || '未知地点',
      year: item.year || new Date().getFullYear(),
      plantHeight: item.plantHeight || Math.random() * 50 + 50,
      leafLength: item.leafLength || Math.random() * 5 + 5,
      leafWidth: item.leafWidth || Math.random() * 3 + 2,
      fruitWeight: item.fruitWeight || Math.random() * 100 + 100,
      fruitLength: item.fruitLength || Math.random() * 3 + 3,
      fruitWidth: item.fruitWidth || Math.random() * 2 + 2,
      floweringTime: item.floweringTime || Math.floor(Math.random() * 20) + 40,
      maturityTime: item.maturityTime || Math.floor(Math.random() * 30) + 70,
      yieldPerPlant: item.yieldPerPlant || Math.random() * 1000 + 1500,
      sugarContent: item.sugarContent || Math.random() * 3 + 4,
      vitaminC: item.vitaminC || Math.random() * 10 + 15,
      ...item, // 包含其他自定义字段
    };
  });
};

const Phenotype: React.FC = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [loading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [data, setData] = useState<PhenotypeData[]>([]);
  const [filteredData, setFilteredData] = useState<PhenotypeData[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // 图表配置
  const chartConfigs: ChartConfig[] = [
    {
      type: 'bar',
      xAxis: 'variety',
      yAxis: 'plantHeight',
      groupBy: 'variety',
      title: t('phenotype.charts.varietyHeightComparison'),
      color: '#6366F1',
    },
    {
      type: 'scatter',
      xAxis: 'fruitWeight',
      yAxis: 'sugarContent',
      title: t('phenotype.charts.fruitWeightSugarRelation'),
      color: '#EC4899',
    },
    {
      type: 'line',
      xAxis: 'year',
      yAxis: 'yieldPerPlant',
      groupBy: 'year',
      title: t('phenotype.charts.yieldTrend'),
      color: '#10B981',
    },
    {
      type: 'bar',
      xAxis: 'location',
      yAxis: 'vitaminC',
      groupBy: 'location',
      title: t('phenotype.charts.vitaminCByLocation'),
      color: '#F59E0B',
    },
  ];

  // 筛选字段配置
  const availableFields = [
    { key: 'accession', label: '品种编号', type: 'text' as const },
    { key: 'variety', label: '品种名称', type: 'select' as const, options: ['红樱桃', '黄樱桃', '大红果', '粉果', '绿果'] },
    { key: 'location', label: '种植地点', type: 'select' as const, options: ['北京', '上海', '广州', '深圳', '杭州'] },
    { key: 'year', label: '年份', type: 'number' as const },
    { key: 'plantHeight', label: '株高', type: 'number' as const },
    { key: 'fruitWeight', label: '果重', type: 'number' as const },
    { key: 'sugarContent', label: '糖含量', type: 'number' as const },
    { key: 'yieldPerPlant', label: '单株产量', type: 'number' as const },
  ];

  // 初始化数据
  useEffect(() => {
    if (data.length === 0) {
      const mockData = generateMockData();
      setData(mockData);
      setFilteredData(mockData);
    }
  }, []);

  // 应用筛选条件
  useEffect(() => {
    let filtered = [...data];
    
    filters.forEach(filter => {
      switch (filter.operator) {
        case 'contains':
          filtered = filtered.filter(item => 
            String(item[filter.field as keyof PhenotypeData]).toLowerCase().includes(String(filter.value).toLowerCase())
          );
          break;
        case 'equals':
          filtered = filtered.filter(item => item[filter.field as keyof PhenotypeData] === filter.value);
          break;
        case 'gt':
          filtered = filtered.filter(item => Number(item[filter.field as keyof PhenotypeData]) > Number(filter.value));
          break;
        case 'lt':
          filtered = filtered.filter(item => Number(item[filter.field as keyof PhenotypeData]) < Number(filter.value));
          break;
      }
    });
    
    setFilteredData(filtered);
  }, [data, filters]);

  // 处理文件上传
  const handleFileUpload = async (parsedData: ParsedData) => {
    setUploadLoading(true);
    setError(null);
    
    try {
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const convertedData = convertParsedDataToPhenotype(parsedData);
      setData(convertedData);
      setFilteredData(convertedData);
      setUploadedFileName(parsedData.fileName);
      setShowUpload(false);
      
      // 显示成功消息
      console.log(`成功上传 ${parsedData.fileName}，共 ${convertedData.length} 条记录`);
    } catch (err) {
      setError('文件处理失败，请重试');
    } finally {
      setUploadLoading(false);
    }
  };

  // 处理下载
  const handleDownload = (format: 'csv' | 'xlsx' = 'csv') => {
    const headers = Object.keys(filteredData[0] || {});
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => row[header as keyof PhenotypeData]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `phenotype_data_${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
  };

  // 处理图表导出
  const handleChartExport = (format: 'png' | 'svg' | 'pdf') => {
    console.log(`导出图表为 ${format} 格式`);
  };

  const renderCurrentView = () => {
    if (loading || uploadLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#6366F1' }} />
        </Box>
      );
    }

    if (filteredData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {data.length === 0 ? '暂无数据' : t('phenotype.noDataFound')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {data.length === 0 ? '请上传数据文件开始分析' : t('phenotype.adjustFilters')}
          </Typography>
        </Box>
      );
    }

    switch (currentView) {
      case 'chart':
        return (
          <Grid container spacing={3}>
            {chartConfigs.map((config, index) => (
              <Grid item xs={12} lg={6} key={index}>
                <PhenotypeChart
                  data={filteredData}
                  config={config}
                  onExport={handleChartExport}
                />
              </Grid>
            ))}
          </Grid>
        );
      case 'board':
        return <BoardView data={filteredData} onRowClick={(row) => console.log('点击行:', row)} />;
      default:
        return (
          <PhenotypeTable
            data={filteredData}
            loading={loading}
            onRowClick={(row) => console.log('点击行:', row)}
          />
        );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 头部 */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                color: '#1F2937',
                fontWeight: 700,
                mb: 1,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              }}
            >
              {t('phenotype.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {uploadedFileName ? `当前数据: ${uploadedFileName} (${filteredData.length} 条记录)` : t('phenotype.subtitle')}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setShowUpload(true)}
              sx={{
                borderColor: '#6366F1',
                color: '#6366F1',
                '&:hover': {
                  borderColor: '#5B61E6',
                  backgroundColor: 'rgba(99, 102, 241, 0.04)',
                },
              }}
            >
              上传数据
            </Button>
            
            {filteredData.length > 0 && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload('csv')}
                sx={{
                  backgroundColor: '#6366F1',
                  '&:hover': { backgroundColor: '#5B61E6' },
                }}
              >
                下载数据
              </Button>
            )}
          </Stack>
        </Box>

        {/* 工具栏 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <CompactFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableFields={availableFields}
          />
          
          {filteredData.length > 0 && (
            <ViewSwitcher
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          )}
        </Box>
      </Box>

      {/* 文件上传弹窗 */}
      {showUpload && (
        <Box sx={{ mb: 4 }}>
          <FileUpload
            onDataParsed={handleFileUpload}
            onError={setError}
            loading={uploadLoading}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setShowUpload(false)} disabled={uploadLoading}>
              取消
            </Button>
          </Box>
        </Box>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 主内容区域 */}
      <Box sx={{ minHeight: 400 }}>
        {renderCurrentView()}
      </Box>
    </Container>
  );
};

export default Phenotype;