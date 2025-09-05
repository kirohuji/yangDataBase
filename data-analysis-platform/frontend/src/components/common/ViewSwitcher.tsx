import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { 
  TableRows as TableIcon,
  BarChart as ChartIcon,
  Dashboard as BoardIcon,
  ViewList as ListIcon
} from '@mui/icons-material';

export type ViewType = 'table' | 'chart' | 'board' | 'list';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  availableViews?: ViewType[];
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  onViewChange,
  availableViews = ['table', 'chart', 'board']
}) => {
  const viewConfig = {
    table: { icon: <TableIcon />, label: '表格视图', tooltip: '以表格形式查看数据' },
    chart: { icon: <ChartIcon />, label: '图表视图', tooltip: '以图表形式分析数据' },
    board: { icon: <BoardIcon />, label: '看板视图', tooltip: '以卡片形式浏览数据' },
    list: { icon: <ListIcon />, label: '列表视图', tooltip: '以列表形式查看数据' }
  };

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: ViewType | null,
  ) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        p: 0.5,
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <ToggleButtonGroup
        value={currentView}
        exclusive
        onChange={handleViewChange}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            border: 'none',
            borderRadius: 1.5,
            px: 2,
            py: 1,
            minWidth: 40,
            color: '#6B7280',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              color: '#6366F1',
            },
            '&.Mui-selected': {
              backgroundColor: '#6366F1',
              color: 'white',
              '&:hover': {
                backgroundColor: '#5B61E6',
              },
            },
          }
        }}
      >
        {availableViews.map((view) => (
          <Tooltip key={view} title={viewConfig[view].tooltip} arrow>
            <ToggleButton value={view} aria-label={viewConfig[view].label}>
              {viewConfig[view].icon}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ViewSwitcher;
