import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred';
  let errorStatus = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Page not found';
    errorStatus = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleRefresh = () => {
    window.location.reload();
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
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ px: 3, py: 1 }}
          >
            Refresh Page
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            sx={{ px: 3, py: 1 }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;
