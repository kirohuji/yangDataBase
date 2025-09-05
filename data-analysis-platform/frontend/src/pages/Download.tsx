import React, { useState } from 'react';
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
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Storage as StorageIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  GetApp as GetAppIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 模拟数据集
  const datasets = [
    {
      id: 1,
      name: 'Genome Assembly v2.1',
      description: 'Complete genome assembly with annotations',
      size: '2.3 GB',
      format: 'FASTA',
      downloadCount: 1250,
      lastUpdated: '2024-01-15',
    },
    {
      id: 2,
      name: 'Phenotype Data Collection',
      description: 'Comprehensive phenotypic measurements dataset',
      size: '145 MB',
      format: 'CSV',
      downloadCount: 890,
      lastUpdated: '2024-01-12',
    },
    {
      id: 3,
      name: 'Expression Profiles',
      description: 'RNA-seq expression data across conditions',
      size: '890 MB',
      format: 'TSV',
      downloadCount: 567,
      lastUpdated: '2024-01-10',
    },
  ];

  // 模拟分析结果
  const analysisResults = [
    {
      id: 1,
      name: 'GWAS Analysis Results',
      description: 'Genome-wide association study output',
      size: '67 MB',
      format: 'ZIP',
      status: 'Completed',
      date: '2024-01-16',
    },
    {
      id: 2,
      name: 'Population Structure',
      description: 'Principal component analysis results',
      size: '23 MB',
      format: 'PDF',
      status: 'Completed',
      date: '2024-01-15',
    },
    {
      id: 3,
      name: 'Differential Expression',
      description: 'Gene expression comparison analysis',
      size: '156 MB',
      format: 'XLSX',
      status: 'Processing',
      date: '2024-01-16',
    },
  ];

  // 模拟文档
  const documentation = [
    {
      id: 1,
      name: 'User Manual',
      description: 'Complete guide for using the platform',
      size: '5.2 MB',
      format: 'PDF',
      version: 'v2.1',
    },
    {
      id: 2,
      name: 'API Documentation',
      description: 'RESTful API reference guide',
      size: '2.8 MB',
      format: 'PDF',
      version: 'v1.5',
    },
    {
      id: 3,
      name: 'Tutorial Videos',
      description: 'Step-by-step video tutorials',
      size: '450 MB',
      format: 'ZIP',
      version: 'v1.0',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
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
        <DownloadIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
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
          }}
        >
          {t('download.subtitle')}
        </Typography>
      </Box>

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
            icon={<AssessmentIcon />}
            label={t('download.results')}
            iconPosition="start"
          />
          <Tab
            icon={<DescriptionIcon />}
            label={t('download.documentation')}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Datasets Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {datasets.map((dataset) => (
            <Grid item xs={12} md={6} lg={4} key={dataset.id}>
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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {dataset.name}
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}
                  >
                    {dataset.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={dataset.format} size="small" color="primary" variant="outlined" />
                    <Chip label={dataset.size} size="small" variant="outlined" />
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Downloads: {dataset.downloadCount.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Updated: {dataset.lastUpdated}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    startIcon={<GetAppIcon />}
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    {t('download.downloadBtn')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Analysis Results Tab */}
      <TabPanel value={tabValue} index={1}>
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          {analysisResults.map((result, index) => (
            <ListItem
              key={result.id}
              sx={{
                borderBottom: index < analysisResults.length - 1 ? '1px solid' : 'none',
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
                      label={result.status}
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
                      {result.size} • {result.format} • {result.date}
                    </Typography>
                    {result.status === 'Processing' && (
                      <LinearProgress sx={{ mt: 1, height: 4, borderRadius: 2 }} />
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  disabled={result.status !== 'Completed'}
                  sx={{
                    color: result.status === 'Completed' ? 'primary.main' : 'text.disabled',
                  }}
                >
                  <CloudDownloadIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </TabPanel>

      {/* Documentation Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {documentation.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
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
                    <DescriptionIcon sx={{ color: 'info.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {doc.name}
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}
                  >
                    {doc.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip label={doc.format} size="small" color="info" variant="outlined" />
                    <Chip label={doc.version} size="small" variant="outlined" />
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Size: {doc.size}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    {t('download.downloadBtn')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Download;
