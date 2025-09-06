import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishDate: string;
  readTime?: number;
  views?: number;
  image?: string;
  tags?: string[];
  featured?: boolean;
}

interface NewsSectionProps {
  news: NewsItem[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onNewsClick?: (news: NewsItem) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  title = "最新动态",
  maxItems = 6,
  showViewAll = true,
  onViewAll,
  onNewsClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const displayNews = news.slice(0, maxItems);
  const featuredNews = displayNews.filter(item => item.featured);
  const regularNews = displayNews.filter(item => !item.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNewsClick = (newsItem: NewsItem) => {
    if (onNewsClick) {
      onNewsClick(newsItem);
    }
  };

  if (!news.length) return null;

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      {/* 标题栏 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2,
            },
          }}
        >
          {title}
        </Typography>
        
        {showViewAll && onViewAll && (
          <Button
            variant="outlined"
            endIcon={<ArrowIcon />}
            onClick={onViewAll}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            查看全部
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* 特色新闻 - 大卡片 */}
        {featuredNews.length > 0 && (
          <Grid item xs={12} md={8}>
            {featuredNews.slice(0, 1).map((newsItem) => (
              <Card
                key={newsItem.id}
                sx={{
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => handleNewsClick(newsItem)}
              >
                {newsItem.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={newsItem.image}
                    alt={newsItem.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={newsItem.category}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label="置顶"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {newsItem.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {newsItem.summary}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={newsItem.author.avatar}
                        sx={{ width: 24, height: 24 }}
                      >
                        {newsItem.author.name.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {newsItem.author.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(newsItem.publishDate)}
                        </Typography>
                      </Box>
                      {newsItem.views && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {newsItem.views}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        )}

        {/* 侧边栏新闻列表 */}
        <Grid item xs={12} md={featuredNews.length > 0 ? 4 : 12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {(featuredNews.length > 0 ? regularNews.slice(0, 4) : displayNews.slice(0, 4)).map((newsItem) => (
              <Card
                key={newsItem.id}
                sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => handleNewsClick(newsItem)}
              >
                {newsItem.image && (
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 80, objectFit: 'cover' }}
                    image={newsItem.image}
                    alt={newsItem.title}
                  />
                )}
                <CardContent sx={{ flex: 1, p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {newsItem.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      label={newsItem.category}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(newsItem.publishDate)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* 移动端或无特色新闻时的网格布局 */}
        {(isMobile || featuredNews.length === 0) && regularNews.length > 4 && (
          <>
            {regularNews.slice(4).map((newsItem) => (
              <Grid item xs={12} sm={6} md={4} key={newsItem.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => handleNewsClick(newsItem)}
                >
                  {newsItem.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={newsItem.image}
                      alt={newsItem.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Chip
                      label={newsItem.category}
                      size="small"
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {newsItem.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {newsItem.summary}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(newsItem.publishDate)}
                      </Typography>
                      {newsItem.views && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ViewIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {newsItem.views}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default NewsSection;
