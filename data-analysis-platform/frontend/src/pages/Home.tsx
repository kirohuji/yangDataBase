import React from 'react';
import {
  Box,
  Typography,
  // Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Visibility as VisibilityIcon,
  Groups as GroupsIcon,
  // ArrowForward as ArrowForwardIcon,
  Science as ScienceIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  // Work as WorkIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  // Phone as PhoneIcon,
  Language as WebsiteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Carousel, { CarouselItem } from '@/components/common/Carousel';
import NewsSection, { NewsItem } from '@/components/common/NewsSection';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 轮播图数据
  const carouselItems: CarouselItem[] = [
    // {
    //   id: '1',
    //   title: 'CLv4.0参考基因组发布',
    //   subtitle: '重大更新',
    //   description: '最新的CLv4.0参考基因组现已发布，包含更完整的注释信息和更高的组装质量。',
    //   image: '/images/home/home1.jpg',
    //   action: {
    //     text: '立即下载',
    //     onClick: () => navigate('/download'),
    //   },
    // },
    {
      id: '1',
      title: '泛基因组分析平台',
      subtitle: '新功能上线',
      description: '全新的泛基因组分析工具现已上线，支持多基因组比较和变异检测。',
      image: '/images/home1.PNG',
      action: {
        text: '开始分析',
        onClick: () => navigate('/tools'),
      },
    },
    {
      id: '2',
      title: '表型数据库扩容',
      subtitle: '数据更新',
      description: '新增2024年度表型测量数据，覆盖更多品种和环境条件。',
      image: '/images/database.jpg',
      action: {
        text: '探索数据',
        onClick: () => navigate('/phenotype'),
      },
    },
  ];

  // 新闻数据
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Yanglab数据库在Nature Genetics发表最新研究成果',
      summary: '基于我们数据库的大规模基因组关联分析揭示了作物产量调控的新机制',
      category: '研究成果',
      author: { name: '研究团队', avatar: '' },
      publishDate: '2024-01-15',
      views: 1250,
      featured: true,
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=300&fit=crop',
    },
    {
      id: '2',
      title: '数据库系统升级完成，性能提升50%',
      summary: '经过为期一个月的系统升级，数据库查询速度和稳定性得到显著提升',
      category: '系统更新',
      author: { name: '技术团队', avatar: '' },
      publishDate: '2024-01-12',
      views: 890,
    },
    {
      id: '3',
      title: '新增基因功能注释数据集',
      summary: '整合了最新的GO、KEGG和InterPro注释信息，为功能分析提供更全面的支持',
      category: '数据更新',
      author: { name: '数据团队', avatar: '' },
      publishDate: '2024-01-10',
      views: 567,
    },
    {
      id: '4',
      title: '用户培训课程即将开始',
      summary: '下周将举办线上培训课程，介绍平台的高级功能和最佳实践',
      category: '通知公告',
      author: { name: '教育团队', avatar: '' },
      publishDate: '2024-01-08',
      views: 423,
    },
  ];

  const features = [
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: t('home.features.analysis.title'),
      description: t('home.features.analysis.description'),
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: t('home.features.visualization.title'),
      description: t('home.features.visualization.description'),
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      title: t('home.features.collaboration.title'),
      description: t('home.features.collaboration.description'),
    },
  ];

  const quickActions = [
    {
      icon: <ScienceIcon sx={{ fontSize: 32 }} />,
      title: t('navigation.phenotype'),
      description: t('phenotype.subtitle'),
      path: '/phenotype',
      color: 'primary.main',
    },
    {
      icon: <BuildIcon sx={{ fontSize: 32 }} />,
      title: t('navigation.tools'),
      description: t('tools.subtitle'),
      path: '/tools',
      color: 'secondary.main',
    },
    {
      icon: <DownloadIcon sx={{ fontSize: 32 }} />,
      title: t('navigation.download'),
      description: t('download.subtitle'),
      path: '/download',
      color: 'success.main',
    },
  ];

  const handleNewsClick = (news: NewsItem) => {
    console.log('News clicked:', news);
    // 这里可以跳转到新闻详情页
  };

  const handleViewAllNews = () => {
    console.log('View all news');
    // 这里可以跳转到新闻列表页
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 轮播图区域 */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Carousel
          items={carouselItems}
          height={isMobile ? 300 : 500}
          autoPlay={true}
          autoPlayInterval={6000}
        />
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* 主要内容区域 */}
          <Grid item xs={12} lg={8}>
            {/* 平台介绍 */}
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
                variant="h3"
            sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'text.primary',
                  mb: 3,
                  textAlign: 'center',
            }}
          >
            {t('home.title')}
          </Typography>
          <Typography
                variant="h6"
            sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
              color: 'text.secondary',
              mb: 4,
                  textAlign: 'center',
                  lineHeight: 1.6,
            }}
          >
            {t('home.subtitle')}
          </Typography>
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.05), rgba(74, 144, 164, 0.05))',
                }}
              >
          <Typography
            variant="body1"
            sx={{
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    color: 'text.primary',
                    lineHeight: 1.8,
                    mb: 3,
            }}
          >
            {t('home.description')}
          </Typography>
                <Typography
                  variant="body1"
            sx={{
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    color: 'text.primary',
                    lineHeight: 1.8,
                  }}
                >
                  我们的平台整合了最新的基因组学和表型组学数据，提供了从数据存储、处理到分析的完整解决方案。
                  无论您是研究人员、学生还是行业专家，都可以在这里找到所需的工具和数据资源。
                </Typography>
              </Paper>
      </Box>

            {/* 核心功能 */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
                variant="h4"
          sx={{
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 600,
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
            color: 'text.primary',
          }}
        >
          {t('home.features.title')}
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      flexGrow: 1,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

            {/* 新闻动态 */}
            <NewsSection
              news={newsItems}
              title="最新动态"
              maxItems={4}
              onNewsClick={handleNewsClick}
              onViewAll={handleViewAllNews}
            />
          </Grid>

          {/* 侧边栏 */}
          <Grid item xs={12} lg={4}>
            {/* 快速访问 */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                快速访问
              </Typography>
              <List sx={{ p: 0 }}>
                {quickActions.map((action, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      p: 0,
                      mb: 1,
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: action.color,
                    }}
                  >
                    {action.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={action.title}
                      secondary={action.description}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.8rem',
                        noWrap: true,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* 实验室介绍 */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                  mb: 3,
                      color: 'text.primary',
                    }}
                  >
                关于Yanglab
                  </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                    sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  Y
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Yang实验室
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    植物基因组学与生物信息学
                  </Typography>
                </Box>
              </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Yang实验室专注于植物基因组学和生物信息学研究，致力于通过大数据分析和机器学习方法解析植物重要性状的遗传机制。
                我们的研究涵盖基因组组装、变异检测、表型预测等多个领域。
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <List sx={{ p: 0 }}>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <SchoolIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="某某大学生命科学学院"
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                </ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="北京市海淀区"
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                </ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="yanglab@university.edu"
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                </ListItem>
                <ListItem sx={{ p: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <WebsiteIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="www.yanglab.org"
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                </ListItem>
              </List>
            </Paper>

            {/* 统计信息 */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                平台统计
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: 'primary.main' }}
                    >
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      基因组数据集
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: 'secondary.main' }}
                    >
                      2.3K
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      表型记录
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: 'success.main' }}
                    >
                      15
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      分析工具
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: 'warning.main' }}
                    >
                      500+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      注册用户
                </Typography>
                  </Box>
                </Grid>
              </Grid>
              </Paper>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;