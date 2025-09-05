import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Error as ErrorIcon, Home as HomeIcon } from '@mui/icons-material';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RouterErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  let errorMessage = 'An unexpected error occurred';
  let errorStatus = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Page not found';
    errorStatus = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
        
        {errorStatus && (
          <Typography
            variant="h2"
            sx={{
              fontSize: '3rem',
              fontWeight: 700,
              color: 'error.main',
            }}
          >
            {errorStatus}
          </Typography>
        )}

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Oops! Something went wrong
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 500,
            lineHeight: 1.6,
          }}
        >
          {errorMessage}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{ px: 3, py: 1 }}
          >
            {t('navigation.home')}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleGoBack}
            sx={{ px: 3, py: 1 }}
          >
            {t('common.back')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RouterErrorBoundary;
