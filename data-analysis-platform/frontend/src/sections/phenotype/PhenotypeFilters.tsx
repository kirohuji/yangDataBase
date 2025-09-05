import React from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Autocomplete,
  Slider,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PhenotypeFilter, PhenotypeData } from '@/types/phenotype';

interface PhenotypeFiltersProps {
  filters: PhenotypeFilter;
  onFiltersChange: (filters: PhenotypeFilter) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
  availableData?: {
    accessions: string[];
    varieties: string[];
    locations: string[];
    yearRange: [number, number];
  };
}

const phenotypeTraits: Array<{ key: keyof PhenotypeData; label: string; unit?: string }> = [
  { key: 'plantHeight', label: '株高', unit: 'cm' },
  { key: 'leafLength', label: '叶长', unit: 'cm' },
  { key: 'leafWidth', label: '叶宽', unit: 'cm' },
  { key: 'fruitWeight', label: '果重', unit: 'g' },
  { key: 'fruitLength', label: '果长', unit: 'cm' },
  { key: 'fruitWidth', label: '果宽', unit: 'cm' },
  { key: 'floweringTime', label: '开花期', unit: '天' },
  { key: 'maturityTime', label: '成熟期', unit: '天' },
  { key: 'yieldPerPlant', label: '单株产量', unit: 'g' },
  { key: 'sugarContent', label: '糖含量', unit: '%' },
  { key: 'vitaminC', label: '维C含量', unit: 'mg/100g' },
];

const PhenotypeFilters: React.FC<PhenotypeFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  loading = false,
  availableData,
}) => {
  const { t } = useTranslation();

  const handleFilterChange = (key: keyof PhenotypeFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleYearRangeChange = (_: Event, newValue: number | number[]) => {
    handleFilterChange('yearRange', newValue as [number, number]);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        mb: 4,
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: '#1F2937',
          fontWeight: 700,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          <SearchIcon />
        </Box>
        {t('phenotype.candidateLoci')}
      </Typography>

      <Grid container spacing={3}>
        {/* 品种编号 */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={availableData?.accessions || []}
            value={filters.accession ? [filters.accession] : []}
            onChange={(_, newValue) => handleFilterChange('accession', newValue[0] || undefined)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('phenotype.variation')}
                placeholder={`${t('common.select')} ${t('phenotype.variation')}...`}
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Grid>

        {/* 品种名称 */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={availableData?.varieties || []}
            value={filters.variety ? [filters.variety] : []}
            onChange={(_, newValue) => handleFilterChange('variety', newValue[0] || undefined)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('phenotype.phenotypeTrait')}
                placeholder={`${t('common.select')} ${t('phenotype.phenotypeTrait')}...`}
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Grid>

        {/* 种植地点 */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t('phenotype.trait')}</InputLabel>
            <Select
              value={filters.trait || ''}
              onChange={(e) => handleFilterChange('trait', e.target.value as keyof PhenotypeData)}
              label={t('phenotype.trait')}
            >
              <MenuItem value="">
                <em>{t('common.all')} {t('phenotype.trait')}</em>
              </MenuItem>
              {phenotypeTraits.map((trait) => (
                <MenuItem key={trait.key} value={trait.key}>
                  {trait.label} {trait.unit && `(${trait.unit})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 年份范围 */}
        {availableData?.yearRange && (
          <Grid item xs={12} md={6}>
            <Box sx={{ px: 1 }}>
              <Typography gutterBottom>
                {t('phenotype.yearRange')}: {filters.yearRange?.[0] || availableData.yearRange[0]} - {filters.yearRange?.[1] || availableData.yearRange[1]}
              </Typography>
              <Slider
                value={filters.yearRange || availableData.yearRange}
                onChange={handleYearRangeChange}
                valueLabelDisplay="auto"
                min={availableData.yearRange[0]}
                max={availableData.yearRange[1]}
                marks={[
                  { value: availableData.yearRange[0], label: availableData.yearRange[0].toString() },
                  { value: availableData.yearRange[1], label: availableData.yearRange[1].toString() },
                ]}
                sx={{
                  color: '#4A90A4',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#4A90A4',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#4A90A4',
                  },
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>

      {/* 操作按钮 */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onReset}
          disabled={loading}
          sx={{
            borderColor: '#6c757d',
            color: '#6c757d',
            '&:hover': {
              borderColor: '#5a6268',
              backgroundColor: 'rgba(108, 117, 125, 0.04)',
            },
          }}
        >
          {t('phenotype.reset')}
        </Button>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5B61E6 0%, #7C4DDB 100%)',
            },
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? t('phenotype.submitting') : t('phenotype.submit')}
        </Button>
      </Box>

      {/* 当前筛选条件显示 */}
      {(filters.accession || filters.variety || filters.trait || filters.yearRange) && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            当前筛选条件:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.accession && (
              <Chip
                label={`变异: ${filters.accession}`}
                size="small"
                onDelete={() => handleFilterChange('accession', undefined)}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.variety && (
              <Chip
                label={`表型: ${filters.variety}`}
                size="small"
                onDelete={() => handleFilterChange('variety', undefined)}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.trait && (
              <Chip
                label={`性状: ${phenotypeTraits.find(t => t.key === filters.trait)?.label}`}
                size="small"
                onDelete={() => handleFilterChange('trait', undefined)}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.yearRange && (
              <Chip
                label={`年份: ${filters.yearRange[0]}-${filters.yearRange[1]}`}
                size="small"
                onDelete={() => handleFilterChange('yearRange', undefined)}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PhenotypeFilters;