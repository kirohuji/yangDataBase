import React, { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Popover,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider,
  Typography,
  Autocomplete,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Filter {
  id: string;
  field: string;
  operator: string;
  value: any;
  label: string;
}

interface CompactFiltersProps {
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
  availableFields: Array<{ key: string; label: string; type: 'text' | 'number' | 'select'; options?: string[] }>;
}

const CompactFilters: React.FC<CompactFiltersProps> = ({
  filters,
  onFiltersChange,
  availableFields
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [newFilter, setNewFilter] = useState({ field: '', operator: '', value: '' });

  const operators = {
    text: [
      { value: 'contains', label: '包含' },
      { value: 'equals', label: '等于' },
      { value: 'startsWith', label: '开头是' },
    ],
    number: [
      { value: 'equals', label: '等于' },
      { value: 'gt', label: '大于' },
      { value: 'lt', label: '小于' },
      { value: 'between', label: '介于' },
    ],
    select: [
      { value: 'equals', label: '等于' },
      { value: 'in', label: '包含于' },
    ]
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setNewFilter({ field: '', operator: '', value: '' });
  };

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value) {
      const field = availableFields.find(f => f.key === newFilter.field);
      const operatorLabel = operators[field?.type || 'text'].find(op => op.value === newFilter.operator)?.label;
      
      const filter: Filter = {
        id: Date.now().toString(),
        field: newFilter.field,
        operator: newFilter.operator,
        value: newFilter.value,
        label: `${field?.label} ${operatorLabel} ${newFilter.value}`
      };

      onFiltersChange([...filters, filter]);
      setNewFilter({ field: '', operator: '', value: '' });
      handleClosePopover();
    }
  };

  const handleRemoveFilter = (filterId: string) => {
    onFiltersChange(filters.filter(f => f.id !== filterId));
  };

  const selectedField = availableFields.find(f => f.key === newFilter.field);
  const availableOperators = selectedField ? operators[selectedField.type] : [];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        p: 2,
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        minHeight: 56,
      }}
    >
      {/* 现有筛选器 */}
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          label={filter.label}
          onDelete={() => handleRemoveFilter(filter.id)}
          deleteIcon={<CloseIcon />}
          variant="outlined"
          size="small"
          sx={{
            backgroundColor: 'white',
            borderColor: '#6366F1',
            color: '#6366F1',
            '& .MuiChip-deleteIcon': {
              color: '#6366F1',
              '&:hover': {
                color: '#5B61E6',
              },
            },
          }}
        />
      ))}

      {/* 添加筛选器按钮 */}
      <IconButton
        size="small"
        onClick={handleOpenPopover}
        sx={{
          backgroundColor: 'white',
          border: '1px dashed #D1D5DB',
          borderRadius: 1,
          width: 32,
          height: 32,
          color: '#6B7280',
          '&:hover': {
            backgroundColor: '#F9FAFB',
            borderColor: '#6366F1',
            color: '#6366F1',
          },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>

      {filters.length === 0 && (
        <Typography
          variant="body2"
          sx={{
            color: '#9CA3AF',
            fontStyle: 'italic',
            ml: 1,
          }}
        >
          点击 + 添加筛选条件
        </Typography>
      )}

      {/* 筛选器配置弹窗 */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 3,
            minWidth: 320,
            borderRadius: 2,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          添加筛选条件
        </Typography>
        
        <Stack spacing={2}>
          {/* 字段选择 */}
          <FormControl fullWidth size="small">
            <InputLabel>字段</InputLabel>
            <Select
              value={newFilter.field}
              onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value, operator: '', value: '' })}
              label="字段"
            >
              {availableFields.map((field) => (
                <MenuItem key={field.key} value={field.key}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 操作符选择 */}
          {newFilter.field && (
            <FormControl fullWidth size="small">
              <InputLabel>条件</InputLabel>
              <Select
                value={newFilter.operator}
                onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value, value: '' })}
                label="条件"
              >
                {availableOperators.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* 值输入 */}
          {newFilter.operator && (
            <>
              {selectedField?.type === 'select' ? (
                <Autocomplete
                  size="small"
                  options={selectedField.options || []}
                  value={newFilter.value}
                  onChange={(_, value) => setNewFilter({ ...newFilter, value })}
                  renderInput={(params) => (
                    <TextField {...params} label="值" variant="outlined" />
                  )}
                />
              ) : (
                <TextField
                  size="small"
                  label="值"
                  value={newFilter.value}
                  onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                  type={selectedField?.type === 'number' ? 'number' : 'text'}
                  variant="outlined"
                  fullWidth
                />
              )}
            </>
          )}

          <Divider />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={handleClosePopover}
              sx={{ color: '#6B7280' }}
            >
              取消
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleAddFilter}
              disabled={!newFilter.field || !newFilter.operator || !newFilter.value}
              sx={{
                backgroundColor: '#6366F1',
                '&:hover': { backgroundColor: '#5B61E6' },
              }}
            >
              添加
            </Button>
          </Box>
        </Stack>
      </Popover>
    </Box>
  );
};

export default CompactFilters;
