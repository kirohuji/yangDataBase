import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Error as ErrorIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        <ErrorIcon sx={{ fontSize: 120, color: 'primary.main', opacity: 0.7 }} />
        
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            color: 'primary.main',
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 500,
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          Sorry, the page you are looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to the home page.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
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

        {/* 装饰性元素 */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.1), rgba(74, 144, 164, 0.1))',
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(74, 144, 164, 0.1), rgba(46, 139, 87, 0.1))',
            zIndex: -1,
          }}
        />
      </Box>
    </Container>
  );
};

export default NotFound;
