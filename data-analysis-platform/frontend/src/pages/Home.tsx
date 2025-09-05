import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Visibility as VisibilityIcon,
  Groups as GroupsIcon,
  ArrowForward as ArrowForwardIcon,
  Science as ScienceIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.1), rgba(74, 144, 164, 0.1))',
          borderRadius: 3,
          p: { xs: 4, sm: 6, md: 8 },
          mb: { xs: 4, md: 6 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234CAF50" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {t('home.title')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              color: 'text.secondary',
              mb: 4,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            {t('home.subtitle')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: 'text.secondary',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {t('home.description')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/phenotype')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: '0 4px 14px 0 rgba(46, 139, 87, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px 0 rgba(46, 139, 87, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('home.getStarted')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/tools')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('home.learnMore')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
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

      {/* Quick Actions Section */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' },
            fontWeight: 600,
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
            color: 'text.primary',
          }}
        >
          Quick Access
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    borderColor: action.color,
                  },
                }}
                onClick={() => navigate(action.path)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${action.color}15`,
                      color: action.color,
                      mr: 2,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      flexGrow: 1,
                    }}
                  >
                    {action.title}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      color: action.color,
                      '&:hover': {
                        backgroundColor: `${action.color}10`,
                      },
                    }}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.5,
                  }}
                >
                  {action.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
