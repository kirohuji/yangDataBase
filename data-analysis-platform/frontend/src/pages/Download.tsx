import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  Storage as StorageIcon,
  Assessment as AssessmentIcon,
  GetApp as GetAppIcon,
  CloudDownload as CloudDownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  useFiles, 
  useDownloads, 
  usePopularDownloads, 
  useDownloadStats,
  useFileStats,
  useUploadFile,
  useDownloadFile,
  useDownloadItem,
  useDeleteFile 
} from '@/hooks/useFiles';
import FileUpload from '@/components/common/FileUpload';
import type { FileInfo, FileSearchParams } from '@/types/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`download-tabpanel-${index}`}
      aria-labelledby={`download-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Download: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 状态管理
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('DATA');
  const [uploadDescription, setUploadDescription] = useState('');
  const [isPublicUpload, setIsPublicUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [showFileDetails, setShowFileDetails] = useState(false);

  // API Hooks
  const fileSearchParams = useMemo<FileSearchParams>(() => ({
    query: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    page: 1,
    limit: 20,
  }), [searchQuery, selectedCategory]);

  const { data: filesData, isLoading: filesLoading } = useFiles(fileSearchParams);
  const { data: downloadsData, isLoading: downloadsLoading } = useDownloads();
  const { data: popularDownloads } = usePopularDownloads(5);
  const { data: downloadStats } = useDownloadStats();
  const { data: fileStats } = useFileStats();

  const uploadFileMutation = useUploadFile();
  const downloadFileMutation = useDownloadFile();
  const downloadItemMutation = useDownloadItem();
  const deleteFileMutation = useDeleteFile();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileUpload = (data: any) => {
    // 这里处理文件上传后的数据解析
    console.log('File uploaded and parsed:', data);
    setShowUploadDialog(false);
  };

  const handleFileUploadError = (error: string) => {
    console.error('File upload error:', error);
  };

  const handleDownloadFile = (fileId: string) => {
    downloadFileMutation.mutate(fileId);
  };

  const handleDownloadItem = (itemId: string) => {
    downloadItemMutation.mutate(itemId);
  };

  const handleDeleteFile = (fileId: string) => {
    if (window.confirm('确定要删除这个文件吗？')) {
      deleteFileMutation.mutate(fileId);
    }
  };

  const handleViewFileDetails = (file: FileInfo) => {
    setSelectedFile(file);
    setShowFileDetails(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFormat('all');
  };

  // 预设数据集数据
  const referenceDatasets = [
    {
      id: 'clv4-genome',
      name: 'CLv4.0参考基因组',
      description: '完整的CLv4.0参考基因组序列和注释文件',
      size: '2.3 GB',
      format: 'FASTA + GFF',
      downloadCount: 1250,
      lastUpdated: '2024-01-15',
      category: 'reference',
      files: [
        { name: '基因组序列', format: 'FASTA', size: '80M' },
        { name: 'GFF注释文件', format: 'GFF', size: '21M' },
        { name: 'CDS序列', format: 'FASTA', size: '18M' },
        { name: '蛋白质序列', format: 'FASTA', size: '8.2M' },
      ]
    },
    {
      id: 'pan-genome',
      name: '泛基因组数据集',
      description: '12个代表性基因组的泛基因组分析数据',
      size: '890 MB',
      format: 'Multiple',
      downloadCount: 567,
      lastUpdated: '2024-01-10',
      category: 'genome',
      files: [
        { name: 'Cu2基因组', format: 'FASTA', size: '78M' },
        { name: 'W8基因组', format: 'FASTA', size: '82M' },
        { name: 'Cuc80基因组', format: 'FASTA', size: '79M' },
        { name: 'XTMC基因组', format: 'FASTA', size: '81M' },
      ]
    },
    {
      id: 'phenotype-collection',
      name: '表型数据集合',
      description: '多年多地点表型测量数据的综合集合',
      size: '145 MB',
      format: 'CSV + XLSX',
      downloadCount: 890,
      lastUpdated: '2024-01-12',
      category: 'phenotype',
      files: [
        { name: '2020-2023表型数据', format: 'CSV', size: '45M' },
        { name: '品种信息表', format: 'XLSX', size: '12M' },
        { name: '环境数据', format: 'CSV', size: '23M' },
        { name: '数据说明文档', format: 'PDF', size: '8M' },
      ]
    },
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.1), rgba(74, 144, 164, 0.1))',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: { xs: 3, md: 4 },
          textAlign: 'center',
        }}
      >
        <StorageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          {t('download.title')}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            mb: 3,
          }}
        >
          {t('download.subtitle')}
        </Typography>

        {/* 统计数据 */}
        {(fileStats || downloadStats) && (
          <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  {fileStats?.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('download.stats.totalFiles')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {downloadStats?.totalDownloads || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('download.stats.totalDownloads')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                  {downloadStats?.totalSize || '0 GB'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('download.stats.totalSize')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  {popularDownloads?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('download.stats.popularFiles')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* 搜索和筛选栏 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t('download.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('download.categories.all')}</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={t('download.categories.all')}
              >
                <MenuItem value="all">{t('download.categories.all')}</MenuItem>
                <MenuItem value="DATA">{t('download.categories.phenotype')}</MenuItem>
                <MenuItem value="RESULT">{t('download.categories.analysis')}</MenuItem>
                <MenuItem value="SCRIPT">{t('download.categories.reference')}</MenuItem>
                <MenuItem value="CONFIG">{t('download.categories.documentation')}</MenuItem>
                <MenuItem value="OTHER">{t('download.categories.other')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('download.formats.all')}</InputLabel>
              <Select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                label={t('download.formats.all')}
              >
                <MenuItem value="all">{t('download.formats.all')}</MenuItem>
                <MenuItem value="csv">{t('download.formats.csv')}</MenuItem>
                <MenuItem value="xlsx">{t('download.formats.xlsx')}</MenuItem>
                <MenuItem value="fasta">{t('download.formats.fasta')}</MenuItem>
                <MenuItem value="vcf">{t('download.formats.vcf')}</MenuItem>
                <MenuItem value="gff">{t('download.formats.gff')}</MenuItem>
                <MenuItem value="pdf">{t('download.formats.pdf')}</MenuItem>
                <MenuItem value="zip">{t('download.formats.zip')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                disabled={!searchQuery && selectedCategory === 'all' && selectedFormat === 'all'}
              >
                清空
              </Button>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setShowUploadDialog(true)}
              >
                {t('download.uploadBtn')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            icon={<StorageIcon />}
            label={t('download.datasets')}
            iconPosition="start"
          />
          <Tab
            icon={<FolderIcon />}
            label={t('download.myFiles')}
            iconPosition="start"
          />
          <Tab
            icon={<PublicIcon />}
            label={t('download.publicFiles')}
            iconPosition="start"
          />
          <Tab
            icon={<AssessmentIcon />}
            label={t('download.results')}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* 参考数据集 Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {referenceDatasets.map((dataset) => (
            <Grid item xs={12} lg={6} xl={4} key={dataset.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StorageIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                      {dataset.name}
                    </Typography>
                    <Chip 
                      label={dataset.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}
                  >
                    {dataset.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      包含文件:
                    </Typography>
                    {dataset.files.map((file: any, index: number) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {file.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip label={file.format} size="small" variant="outlined" />
                          <Chip label={file.size} size="small" variant="outlined" />
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={dataset.format} size="small" color="primary" variant="outlined" />
                    <Chip label={dataset.size} size="small" variant="outlined" />
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    下载次数: {dataset.downloadCount.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    更新时间: {dataset.lastUpdated}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    startIcon={<GetAppIcon />}
                    fullWidth
                    sx={{ borderRadius: 2 }}
                    onClick={() => handleDownloadItem(dataset.id)}
                  >
                    {t('download.downloadBtn')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* 我的文件 Tab */}
      <TabPanel value={tabValue} index={1}>
        {filesLoading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={30} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filesData?.data && filesData.data.length > 0 ? (
          <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            {filesData.data.map((file: FileInfo, index: number) => (
              <ListItem
                key={file.id}
                sx={{
                  borderBottom: index < filesData.data.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  py: 2,
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <FileIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {file.originalName}
                      </Typography>
                      <Chip
                        label={file.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {file.isPublic ? (
                        <Tooltip title="公开文件">
                          <PublicIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="私有文件">
                          <PrivateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {file.mimetype} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        上传时间: {new Date(file.createdAt).toLocaleDateString()} • 
                        下载次数: {file.downloadCount || 0}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="查看详情">
                      <IconButton
                        size="small"
                        onClick={() => handleViewFileDetails(file)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="下载文件">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleDownloadFile(file.id)}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除文件">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('download.noFiles')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              点击上传按钮开始上传您的文件
            </Typography>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setShowUploadDialog(true)}
            >
              {t('download.uploadBtn')}
            </Button>
          </Paper>
        )}
      </TabPanel>

      {/* 公共文件 Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          公共资源库
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          这里展示所有用户共享的公开文件资源
        </Typography>
        {/* 这里可以展示公共文件列表 */}
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PublicIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            公共资源功能正在开发中...
          </Typography>
        </Paper>
      </TabPanel>

      {/* 分析结果 Tab */}
      <TabPanel value={tabValue} index={3}>
        {downloadsLoading ? (
          <LinearProgress />
        ) : downloadsData?.data && downloadsData.data.length > 0 ? (
          <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            {downloadsData.data.map((result: any, index: number) => (
              <ListItem
                key={result.id}
                sx={{
                  borderBottom: index < downloadsData.data.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  py: 2,
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <AssessmentIcon sx={{ color: 'secondary.main' }} />
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {result.name}
                      </Typography>
                      <Chip
                        label={result.status || 'Completed'}
                        size="small"
                        color={result.status === 'Completed' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {result.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {result.size} • {result.format} • {result.lastUpdated}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleDownloadItem(result.id)}
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              暂无分析结果
            </Typography>
            <Typography variant="body2" color="text.secondary">
              完成数据分析后，结果将显示在这里
            </Typography>
          </Paper>
        )}
      </TabPanel>

      {/* 文件上传对话框 */}
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UploadIcon />
            {t('download.uploadBtn')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <FileUpload
              onDataParsed={handleFileUpload}
              onError={handleFileUploadError}
              loading={uploadFileMutation.isPending}
            />
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('download.upload.category')}</InputLabel>
                <Select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  label={t('download.upload.category')}
                >
                  <MenuItem value="DATA">数据文件</MenuItem>
                  <MenuItem value="RESULT">分析结果</MenuItem>
                  <MenuItem value="SCRIPT">脚本文件</MenuItem>
                  <MenuItem value="CONFIG">配置文件</MenuItem>
                  <MenuItem value="OTHER">其他文件</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublicUpload}
                    onChange={(e) => setIsPublicUpload(e.target.checked)}
                  />
                }
                label={t('download.upload.isPublic')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('download.upload.description')}
                multiline
                rows={3}
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="请输入文件描述（可选）"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>
            取消
          </Button>
          <Button variant="contained" disabled={uploadFileMutation.isPending}>
            确认上传
          </Button>
        </DialogActions>
      </Dialog>

      {/* 文件详情对话框 */}
      <Dialog
        open={showFileDetails}
        onClose={() => setShowFileDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileIcon />
            文件详情
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('download.details.fileName')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedFile.originalName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('download.details.category')}
                  </Typography>
                  <Chip label={selectedFile.category} size="small" color="primary" sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('download.details.size')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('download.details.uploadedAt')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(selectedFile.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('download.details.downloads')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedFile.downloadCount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('download.details.isPublic')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedFile.isPublic ? (
                      <>
                        <PublicIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography>公开</Typography>
                      </>
                    ) : (
                      <>
                        <PrivateIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography>私有</Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFileDetails(false)}>
            关闭
          </Button>
          {selectedFile && (
            <Button
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                handleDownloadFile(selectedFile.id);
                setShowFileDetails(false);
              }}
            >
              下载
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Download;