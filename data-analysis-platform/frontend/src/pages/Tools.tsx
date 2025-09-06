import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  // useTheme,
  // useMediaQuery,
} from '@mui/material';
import {
  Build as BuildIcon,
  Analytics as AnalyticsIcon,
  Biotech as BiotechIcon,
  BarChart as BarChartIcon,
  Visibility as VisibilityIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Tools: React.FC = () => {
  const { t } = useTranslation();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toolCategories = [
    {
      title: t('tools.categories.genomic'),
      tools: [
        {
          name: 'Genome Browser',
          description: 'Interactive genome visualization and annotation tool',
          icon: <BiotechIcon sx={{ fontSize: 32 }} />,
          status: 'Available',
          complexity: 'Intermediate',
        },
        {
          name: 'Variant Caller',
          description: 'Identify genetic variants from sequencing data',
          icon: <ScienceIcon sx={{ fontSize: 32 }} />,
          status: 'Available',
          complexity: 'Advanced',
        },
        {
          name: 'Gene Expression',
          description: 'Analyze gene expression patterns and differential expression',
          icon: <TimelineIcon sx={{ fontSize: 32 }} />,
          status: 'Available',
          complexity: 'Intermediate',
        },
      ],
    },
    {
      title: t('tools.categories.phenotypic'),
      tools: [
        {
          name: 'Phenotype Analyzer',
          description: 'Statistical analysis of phenotypic data',
          icon: <AnalyticsIcon sx={{ fontSize: 32 }} />,
          status: 'Available',
          complexity: 'Beginner',
        },
        {
          name: 'Trait Mapper',
          description: 'Map phenotypic traits to genomic regions',
          icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
          status: 'Beta',
          complexity: 'Advanced',
        },
      ],
    },
    {
      title: t('tools.categories.statistical'),
      tools: [
        {
          name: 'GWAS Analysis',
          description: 'Genome-wide association study analysis pipeline',
          icon: <BarChartIcon sx={{ fontSize: 32 }} />,
          status: 'Available',
          complexity: 'Advanced',
        },
        {
          name: 'Population Genetics',
          description: 'Population structure and genetic diversity analysis',
          icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
          status: 'Available',
          complexity: 'Intermediate',
        },
      ],
    },
    {
      title: t('tools.categories.visualization'),
      tools: [
        {
          name: 'Data Visualizer',
          description: 'Create interactive charts and plots',
          icon: <VisibilityIcon sx={{ fontSize: 32 }} />,
          status: 'Available',
          complexity: 'Beginner',
        },
        {
          name: 'Network Viewer',
          description: 'Visualize biological networks and pathways',
          icon: <TimelineIcon sx={{ fontSize: 32 }} />,
          status: 'Coming Soon',
          complexity: 'Intermediate',
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Beta':
        return 'warning';
      case 'Coming Soon':
        return 'info';
      default:
        return 'default';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
  };

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
        <BuildIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          {t('tools.title')}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {t('tools.subtitle')}
        </Typography>
      </Box>

      {/* Tool Categories */}
      {toolCategories.map((category, categoryIndex) => (
        <Box key={categoryIndex} sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' },
              fontWeight: 600,
              color: 'text.primary',
              mb: 3,
              pb: 1,
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              display: 'inline-block',
            }}
          >
            {category.title}
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {category.tools.map((tool, toolIndex) => (
              <Grid item xs={12} sm={6} lg={4} key={toolIndex}>
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
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: 'grey.100',
                          color: 'secondary.main',
                          mr: 2,
                        }}
                      >
                        {tool.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          flexGrow: 1,
                        }}
                      >
                        {tool.name}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 3,
                        lineHeight: 1.6,
                        minHeight: 40,
                      }}
                    >
                      {tool.description}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        mb: 2,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Chip
                        label={tool.status}
                        size="small"
                        color={getStatusColor(tool.status) as any}
                        variant={tool.status === 'Available' ? 'filled' : 'outlined'}
                      />
                      <Chip
                        label={tool.complexity}
                        size="small"
                        color={getComplexityColor(tool.complexity) as any}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant={tool.status === 'Available' ? 'contained' : 'outlined'}
                      fullWidth
                      disabled={tool.status === 'Coming Soon'}
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2,
                      }}
                    >
                      {tool.status === 'Available' ? 'Launch Tool' : 
                       tool.status === 'Beta' ? 'Try Beta' : 'Coming Soon'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Help Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(74, 144, 164, 0.1), rgba(46, 139, 87, 0.1))',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2,
          }}
        >
          Need Help Getting Started?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 3,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Check out our documentation and tutorials to learn how to use these powerful analysis tools effectively.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{ px: 3, py: 1 }}
          >
            View Documentation
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ px: 3, py: 1 }}
          >
            Watch Tutorials
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Tools;
