import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LoadingFallbackProps {
  message?: string;
  size?: number;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message, 
  size = 40 
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress size={size} />
      <Typography
        variant="body2"
        sx={{ 
          color: 'text.secondary', 
          fontSize: '0.875rem',
          textAlign: 'center',
        }}
      >
        {message || t('common.loading')}
      </Typography>
    </Box>
  );
};

export default LoadingFallback;
