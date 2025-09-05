import React, { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';
import { Box, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreIcon, Download as DownloadIcon, Fullscreen as FullscreenIcon } from '@mui/icons-material';
import { ChartConfig, PhenotypeData } from '@/types/phenotype';

interface PhenotypeChartProps {
  data: PhenotypeData[];
  config: ChartConfig;
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
  onFullscreen?: () => void;
}

const PhenotypeChart: React.FC<PhenotypeChartProps> = ({ data, config, onExport, onFullscreen }) => {
  const chartRef = useRef<ReactECharts>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'png' | 'svg' | 'pdf') => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      if (format === 'png') {
        const dataURL = chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
        const link = document.createElement('a');
        link.download = `${config.title}.png`;
        link.href = dataURL;
        link.click();
      }
    }
    onExport?.(format);
    handleMenuClose();
  };

  // 准备ECharts配置
  const getChartOption = (): EChartsOption => {
    // 现代化渐变色彩方案
    const colors = [
      '#6366F1', // 靛蓝
      '#EC4899', // 粉红
      '#10B981', // 翠绿
      '#F59E0B', // 琥珀
      '#8B5CF6', // 紫色
      '#06B6D4', // 青色
      '#EF4444', // 红色
      '#84CC16', // 酸橙
      '#F97316', // 橙色
      '#3B82F6'  // 蓝色
    ];

    const baseOption: EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: config.title,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 600,
          color: '#1F2937',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.98)',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        borderRadius: 12,
        textStyle: {
          color: '#374151',
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 10px 25px rgba(0,0,0,0.1); backdrop-filter: blur(8px);',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: 'rgba(0,0,0,0.2)',
            type: 'dashed'
          }
        }
      },
      legend: {
        top: 45,
        left: 'center',
        textStyle: {
          color: '#6B7280',
          fontSize: 12,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        },
        itemGap: 20
      },
      grid: {
        left: 60,
        right: 40,
        bottom: 80,
        top: 80,
        containLabel: false
      },
      toolbox: {
        show: false
      }
    };

    if (config.type === 'scatter') {
      return {
        ...baseOption,
        xAxis: {
          type: 'value',
          name: String(config.xAxis),
          nameLocation: 'middle',
          nameGap: 35,
          nameTextStyle: {
            color: '#6B7280',
            fontSize: 13,
            fontWeight: 500
          },
          axisLine: { 
            show: false
          },
          axisTick: { show: false },
          axisLabel: {
            color: '#9CA3AF',
            fontSize: 12
          },
          splitLine: { 
            lineStyle: { 
              color: 'rgba(0,0,0,0.06)',
              type: 'solid'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: String(config.yAxis),
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#6B7280',
            fontSize: 13,
            fontWeight: 500
          },
          axisLine: { 
            show: false
          },
          axisTick: { show: false },
          axisLabel: {
            color: '#9CA3AF',
            fontSize: 12
          },
          splitLine: { 
            lineStyle: { 
              color: 'rgba(0,0,0,0.06)',
              type: 'solid'
            }
          }
        },
        series: [{
          name: `${config.xAxis} vs ${config.yAxis}`,
          type: 'scatter',
          data: data.map(item => [
            item[config.xAxis] as number,
            item[config.yAxis] as number,
            item.accession
          ]),
          itemStyle: {
            color: colors[1], // 使用粉红色
            opacity: 0.8,
            borderColor: 'rgba(255,255,255,0.8)',
            borderWidth: 1
          },
          symbolSize: 10,
          emphasis: {
            itemStyle: {
              opacity: 1,
              borderWidth: 2
            }
          },
          tooltip: {
            formatter: (params: any) => {
              const [x, y, accession] = params.data;
              return `<div style="font-weight: 600; margin-bottom: 4px;">${accession}</div>
                      <div style="color: #6B7280;">${config.xAxis}: <span style="color: #374151; font-weight: 500;">${x.toFixed(2)}</span></div>
                      <div style="color: #6B7280;">${config.yAxis}: <span style="color: #374151; font-weight: 500;">${y.toFixed(2)}</span></div>`;
            }
          }
        }]
      };
    }

    // 对于条形图和折线图，按groupBy字段分组
    if (config.groupBy) {
      const groups = data.reduce((acc, item) => {
        const groupKey = String(item[config.groupBy!]);
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {} as Record<string, PhenotypeData[]>);

      const categories = Object.keys(groups);
      const seriesData = categories.map(category => {
        const groupData = groups[category];
        return groupData.reduce((sum, item) => sum + (item[config.yAxis] as number), 0) / groupData.length;
      });

      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: categories,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#6B7280',
            fontSize: 12,
            rotate: categories.some(c => c.length > 6) ? 30 : 0,
            margin: 15,
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }
        },
        yAxis: {
          type: 'value',
          name: String(config.yAxis),
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#6B7280',
            fontSize: 13,
            fontWeight: 500
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#9CA3AF',
            fontSize: 12
          },
          splitLine: { 
            lineStyle: { 
              color: 'rgba(0,0,0,0.06)',
              type: 'solid'
            }
          }
        },
        series: [{
          name: String(config.yAxis),
          type: config.type === 'line' ? 'line' : 'bar',
          data: seriesData,
          itemStyle: config.type === 'bar' ? {
            color: (params: any) => {
              const color = colors[params.dataIndex % colors.length];
              return {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: color },
                  { offset: 1, color: color + '80' }
                ]
              };
            },
            borderRadius: [4, 4, 0, 0]
          } : {
            color: colors[0]
          },
          ...(config.type === 'line' && {
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { 
              width: 4,
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: colors[2] },
                  { offset: 1, color: colors[0] }
                ]
              }
            },
            areaStyle: {
              opacity: 0.1,
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colors[2] },
                  { offset: 1, color: 'transparent' }
                ]
              }
            }
          }),
          emphasis: {
            itemStyle: {
              borderWidth: config.type === 'bar' ? 2 : 0,
              borderColor: '#fff'
            }
          }
        }]
      };
    }

    // 默认：使用accession作为X轴
    const categories = data.map(item => item.accession);
    const seriesData = data.map(item => item[config.yAxis] as number);

    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: {
          rotate: 45,
          interval: Math.ceil(categories.length / 10) - 1
        }
      },
      yAxis: {
        type: 'value',
        name: String(config.yAxis),
        nameLocation: 'middle',
        nameGap: 40,
        axisLine: { lineStyle: { color: '#ccc' } },
        splitLine: { lineStyle: { type: 'dashed' } }
      },
      series: [{
        name: String(config.yAxis),
        type: config.type === 'line' ? 'line' : 'bar',
        data: seriesData,
        itemStyle: {
          color: config.color || colors[0]
        },
        ...(config.type === 'line' && {
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 3 }
        })
      }]
    };
  };

  const chartOption = getChartOption();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: 500, 
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-2px)',
        },
        '&:hover .chart-actions': {
          opacity: 1,
        },
      }}
    >
      <Box 
        className="chart-actions"
        sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12, 
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 1000,
          display: 'flex',
          gap: 1,
        }}
      >
        {onFullscreen && (
          <IconButton 
            size="small" 
            onClick={onFullscreen}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <FullscreenIcon />
          </IconButton>
        )}
        <IconButton 
          size="small" 
          onClick={handleMenuClick}
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
        >
          <MoreIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleExport('png')}>
            <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
            导出为 PNG
          </MenuItem>
          <MenuItem onClick={() => handleExport('svg')}>
            <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
            导出为 SVG
          </MenuItem>
          <MenuItem onClick={() => handleExport('pdf')}>
            <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
            导出为 PDF
          </MenuItem>
        </Menu>
      </Box>
      
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </Paper>
  );
};

export default PhenotypeChart;