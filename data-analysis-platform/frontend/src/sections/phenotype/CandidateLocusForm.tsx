import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  SelectChangeEvent,
} from '@mui/material';

interface CandidateLocusParams {
  variation?: string;
  phenotype?: string;
  trait?: string;
}

interface CandidateLocusFormProps {
  onSubmit: (params: CandidateLocusParams) => void;
  onReset: () => void;
  loading?: boolean;
  availableOptions?: {
    variations: string[];
    phenotypes: string[];
    traits: string[];
  };
}

const CandidateLocusForm: React.FC<CandidateLocusFormProps> = ({
  onSubmit,
  onReset,
  loading = false,
  availableOptions = {
    variations: [],
    phenotypes: [],
    traits: []
  }
}) => {
  const [params, setParams] = useState<CandidateLocusParams>({});

  const handleChange = (field: keyof CandidateLocusParams) => (
    event: SelectChangeEvent<string>
  ) => {
    setParams(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = () => {
    onSubmit(params);
  };

  const handleReset = () => {
    setParams({});
    onReset();
  };

  const defaultVariations = [
    'SNP_001', 'SNP_002', 'SNP_003', 'INDEL_001', 'INDEL_002',
    'CNV_001', 'CNV_002', 'SV_001', 'SV_002', 'PAV_001'
  ];

  const defaultPhenotypes = [
    '果实颜色', '果实形状', '果实大小', '抗病性', '耐逆性',
    '营养品质', '口感品质', '产量性状', '生长习性', '开花期'
  ];

  const defaultTraits = [
    '株高', '叶长', '叶宽', '果重', '果长', '果宽',
    '开花期', '成熟期', '单株产量', '糖含量', '维C含量'
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        border: '2px dashed #D1D5DB',
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -10,
          left: 20,
          backgroundColor: '#4A90A4',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: 600,
        }
      }}
    >
      {/* 标题标签 */}
      <Box
        sx={{
          position: 'absolute',
          top: -12,
          left: 20,
          backgroundColor: '#4A90A4',
          color: 'white',
          px: 2,
          py: 0.5,
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: 600,
          zIndex: 1,
        }}
      >
        Candidate Locus
      </Box>

      {/* 说明文字 */}
      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.6 }}>
          The GWAS (Genome-Wide Association Studies) method was performed to identify the genetic candidate loci for important traits in tomato accessions. 
          The genotype data were filtered with a minor allele frequency (MAF) greater than 0.05 and a missing rate less than 0.1, resulting 2,580,676 variations for 665 samples, 
          6,082,869 variations for 706 samples and 32,381 variations for RIL samples, respectively.
        </Typography>
      </Box>

      {/* 参数选择 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: '#6B7280', fontWeight: 500 }}>
              Variation
            </InputLabel>
            <Select
              value={params.variation || ''}
              onChange={handleChange('variation')}
              label="Variation"
              displayEmpty
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90A4',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90A4',
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: '#9CA3AF' }}>select...</em>
              </MenuItem>
              {(availableOptions.variations.length > 0 ? availableOptions.variations : defaultVariations).map((variation) => (
                <MenuItem key={variation} value={variation}>
                  {variation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: '#6B7280', fontWeight: 500 }}>
              Phenotype
            </InputLabel>
            <Select
              value={params.phenotype || ''}
              onChange={handleChange('phenotype')}
              label="Phenotype"
              displayEmpty
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90A4',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90A4',
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: '#9CA3AF' }}>select...</em>
              </MenuItem>
              {(availableOptions.phenotypes.length > 0 ? availableOptions.phenotypes : defaultPhenotypes).map((phenotype) => (
                <MenuItem key={phenotype} value={phenotype}>
                  {phenotype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: '#6B7280', fontWeight: 500 }}>
              Trait
            </InputLabel>
            <Select
              value={params.trait || ''}
              onChange={handleChange('trait')}
              label="Trait"
              displayEmpty
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90A4',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90A4',
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: '#9CA3AF' }}>select...</em>
              </MenuItem>
              {(availableOptions.traits.length > 0 ? availableOptions.traits : defaultTraits).map((trait) => (
                <MenuItem key={trait} value={trait}>
                  {trait}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 操作按钮 */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4, alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={loading}
          sx={{
            borderColor: '#4A90A4',
            color: '#4A90A4',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#3A7A8A',
              backgroundColor: 'rgba(74, 144, 164, 0.04)',
            },
          }}
        >
          Reset
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: '#4A90A4',
            color: 'white',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#3A7A8A',
            },
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>

        <Typography
          variant="body2"
          sx={{
            color: '#6366F1',
            fontWeight: 500,
            cursor: 'pointer',
            ml: 2,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() => {
            // 示例数据
            setParams({
              variation: 'SNP_001',
              phenotype: '果实颜色',
              trait: '果重'
            });
          }}
        >
          example
        </Typography>
      </Box>
    </Paper>
  );
};

export default CandidateLocusForm;
