import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Science as ScienceIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Phenotype: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // 模拟数据
  const phenotypeData = [
    {
      id: 1,
      name: 'Plant Height',
      description: 'Measurement of plant height in centimeters',
      category: 'Morphology',
      samples: 1250,
      traits: ['Height', 'Growth'],
    },
    {
      id: 2,
      name: 'Fruit Color',
      description: 'Color variation in fruit pigmentation',
      category: 'Appearance',
      samples: 890,
      traits: ['Color', 'Pigmentation'],
    },
    {
      id: 3,
      name: 'Disease Resistance',
      description: 'Resistance to common plant diseases',
      category: 'Immunity',
      samples: 2100,
      traits: ['Resistance', 'Health'],
    },
    {
      id: 4,
      name: 'Flowering Time',
      description: 'Days to flowering from germination',
      category: 'Development',
      samples: 1680,
      traits: ['Timing', 'Development'],
    },
    {
      id: 5,
      name: 'Leaf Shape',
      description: 'Morphological variation in leaf structure',
      category: 'Morphology',
      samples: 950,
      traits: ['Shape', 'Morphology'],
    },
    {
      id: 6,
      name: 'Yield Performance',
      description: 'Total yield per plant under standard conditions',
      category: 'Productivity',
      samples: 1500,
      traits: ['Yield', 'Performance'],
    },
  ];

  const categories = ['All', 'Morphology', 'Appearance', 'Immunity', 'Development', 'Productivity'];

  const filteredData = phenotypeData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <ScienceIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          {t('phenotype.title')}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {t('phenotype.subtitle')}
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mb: { xs: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: filtersExpanded ? 2 : 0,
          }}
        >
          <TextField
            fullWidth
            placeholder={t('phenotype.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { sm: 400 } }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('phenotype.filter')}
          </Button>
        </Box>

        <Collapse in={filtersExpanded}>
          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  variant="outlined"
                  clickable
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Results */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {filteredData.length} {t('phenotype.results')}
        </Typography>
      </Box>

      {/* Phenotype Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {filteredData.map((phenotype) => (
          <Grid item xs={12} sm={6} lg={4} key={phenotype.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
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
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      flexGrow: 1,
                    }}
                  >
                    {phenotype.name}
                  </Typography>
                  <Chip
                    label={phenotype.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  {phenotype.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Samples: {phenotype.samples.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {phenotype.traits.map((trait) => (
                    <Chip
                      key={trait}
                      label={trait}
                      size="small"
                      variant="filled"
                      sx={{
                        backgroundColor: 'grey.100',
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredData.length === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            mt: 4,
          }}
        >
          <ScienceIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            {t('phenotype.noResults')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Try adjusting your search terms or filters
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Phenotype;
