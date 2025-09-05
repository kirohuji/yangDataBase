import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { PhenotypeData } from '@/types/phenotype';

interface BoardViewProps {
  data: PhenotypeData[];
  onRowClick?: (row: PhenotypeData) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ data, onRowClick }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = React.useState<PhenotypeData | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: PhenotypeData) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const getVarietyColor = (variety: string) => {
    const colors = {
      '红樱桃': '#EF4444',
      '黄樱桃': '#F59E0B',
      '大红果': '#DC2626',
      '粉果': '#EC4899',
      '绿果': '#10B981',
    };
    return colors[variety as keyof typeof colors] || '#6366F1';
  };

  const getVarietyInitial = (variety: string) => {
    return variety.charAt(0);
  };

  return (
    <>
      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 3,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  borderColor: '#6366F1',
                },
              }}
              onClick={() => onRowClick?.(item)}
            >
              <CardContent sx={{ p: 3 }}>
                {/* 头部 */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: getVarietyColor(item.variety),
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {getVarietyInitial(item.variety)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                        {item.accession}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.year} · {item.location}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, item)}
                    sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                  >
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* 品种标签 */}
                <Chip
                  label={item.variety}
                  size="small"
                  sx={{
                    backgroundColor: `${getVarietyColor(item.variety)}15`,
                    color: getVarietyColor(item.variety),
                    fontWeight: 500,
                    mb: 2,
                  }}
                />

                {/* 关键指标 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      株高
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.plantHeight.toFixed(1)} cm
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      果重
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.fruitWeight.toFixed(1)} g
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      糖含量
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.sugarContent.toFixed(1)}%
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      单株产量
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.yieldPerPlant.toFixed(0)} g
                    </Typography>
                  </Box>
                </Box>

                {/* 进度条示例 */}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      综合评分
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((item.sugarContent + item.yieldPerPlant / 100) * 10)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.06)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.min(100, (item.sugarContent + item.yieldPerPlant / 100) * 10)}%`,
                        height: '100%',
                        backgroundColor: getVarietyColor(item.variety),
                        borderRadius: 2,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { onRowClick?.(selectedItem!); handleMenuClose(); }}>
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          查看详情
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          导出数据
        </MenuItem>
      </Menu>
    </>
  );
};

export default BoardView;
