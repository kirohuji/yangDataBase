import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';

export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  height?: number | string;
  showDots?: boolean;
  showArrows?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  height = 400,
  showDots = true,
  showArrows = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 自动播放
  useEffect(() => {
    if (!autoPlay || isHovered || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, items.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'relative',
        height,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: currentItem.link ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={currentItem.link ? () => window.open(currentItem.link, '_blank') : undefined}
    >
      {/* 背景图片 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${currentItem.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 遮罩层 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* 内容区域 */}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
          color: 'white',
        }}
      >
        <Fade in={true} timeout={800} key={currentItem.id}>
          <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
            {currentItem.subtitle && (
              <Typography
                variant="overline"
                sx={{
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)',
                  mb: 1,
                  display: 'block',
                }}
              >
                {currentItem.subtitle}
              </Typography>
            )}
            
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {currentItem.title}
            </Typography>
            
            {currentItem.description && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  lineHeight: 1.6,
                  mb: 3,
                  maxWidth: 500,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {currentItem.description}
              </Typography>
            )}

            {currentItem.action && (
              <Box
                component="button"
                onClick={(e) => {
                  e.stopPropagation();
                  currentItem.action!.onClick();
                }}
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 2,
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {currentItem.action.text}
              </Box>
            )}
          </Box>
        </Fade>
      </Box>

      {/* 导航箭头 */}
      {showArrows && items.length > 1 && !isMobile && (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </>
      )}

      {/* 指示点 */}
      {showDots && items.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {items.map((_, index) => (
            <IconButton
              key={index}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(index);
              }}
              sx={{
                p: 0.5,
                color: 'white',
                opacity: index === currentIndex ? 1 : 0.5,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <DotIcon sx={{ fontSize: index === currentIndex ? 12 : 8 }} />
            </IconButton>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default Carousel;
