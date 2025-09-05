import React from 'react';
import { DataGrid, GridColDef, GridToolbar, GridValueFormatterParams } from '@mui/x-data-grid';
import { Paper, Box, Typography, Chip } from '@mui/material';
import { PhenotypeData } from '@/types/phenotype';

interface PhenotypeTableProps {
  data: PhenotypeData[];
  loading?: boolean;
  onRowClick?: (row: PhenotypeData) => void;
}

const PhenotypeTable: React.FC<PhenotypeTableProps> = ({ 
  data, 
  loading = false, 
  onRowClick 
}) => {
  const columns: GridColDef[] = [
    {
      field: 'accession',
      headerName: '品种编号',
      width: 120
    },
    {
      field: 'variety',
      headerName: '品种名称',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'location',
      headerName: '种植地点',
      width: 120,
    },
    {
      field: 'year',
      headerName: '年份',
      width: 80,
      type: 'number',
    },
    {
      field: 'plantHeight',
      headerName: '株高 (cm)',
      width: 110,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
    {
      field: 'leafLength',
      headerName: '叶长 (cm)',
      width: 110,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
    {
      field: 'leafWidth',
      headerName: '叶宽 (cm)',
      width: 110,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
    {
      field: 'fruitWeight',
      headerName: '果重 (g)',
      width: 110,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
    {
      field: 'fruitLength',
      headerName: '果长 (cm)',
      width: 110,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
    {
      field: 'fruitWidth',
      headerName: '果宽 (cm)',
      width: 110,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
    {
      field: 'floweringTime',
      headerName: '开花期 (天)',
      width: 120,
      type: 'number',
    },
    {
      field: 'maturityTime',
      headerName: '成熟期 (天)',
      width: 120,
      type: 'number',
    },
    {
      field: 'yieldPerPlant',
      headerName: '单株产量 (g)',
      width: 130,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
    {
      field: 'sugarContent',
      headerName: '糖含量 (%)',
      width: 120,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(2)}` : '';
      },
    },
    {
      field: 'vitaminC',
      headerName: '维C含量 (mg/100g)',
      width: 150,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value != null ? `${params.value.toFixed(1)}` : '';
      },
    },
  ];

  return (
    <Paper elevation={2} sx={{ height: 600, width: '100%' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          表型数据表格
        </Typography>
        <Typography variant="body2" color="text.secondary">
          共 {data.length} 条记录
        </Typography>
      </Box>
      
      <Box sx={{ height: 'calc(100% - 80px)', width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowClick={(params) => onRowClick?.(params.row)}
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'grey.50',
              borderBottom: 2,
              borderColor: 'grey.200',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default PhenotypeTable;