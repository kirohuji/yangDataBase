import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Science as ScienceIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
  Language as LanguageIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [languageAnchorEl, setLanguageAnchorEl] = React.useState<null | HTMLElement>(null);

  const navigationItems = [
    {
      key: 'home',
      label: t('navigation.home'),
      path: '/',
      icon: <HomeIcon />,
    },
    {
      key: 'phenotype',
      label: t('navigation.phenotype'),
      path: '/phenotype',
      icon: <ScienceIcon />,
    },
    {
      key: 'tools',
      label: t('navigation.tools'),
      path: '/tools',
      icon: <BuildIcon />,
    },
    {
      key: 'download',
      label: t('navigation.download'),
      path: '/download',
      icon: <DownloadIcon />,
    },
  ];

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Logo和标题 */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <ScienceIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigation('/')}
          >
            {t('home.title')}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* 桌面端导航 */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.key}
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActivePath(item.path) 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* 语言切换 */}
        <Box sx={{ ml: 2 }}>
          <IconButton
            color="inherit"
            onClick={handleLanguageMenuOpen}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem 
              onClick={() => handleLanguageChange('en')}
              selected={i18n.language === 'en'}
            >
              {t('common.english')}
            </MenuItem>
            <MenuItem 
              onClick={() => handleLanguageChange('zh')}
              selected={i18n.language === 'zh'}
            >
              {t('common.chinese')}
            </MenuItem>
          </Menu>
        </Box>

        {/* 移动端菜单按钮 */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={onMobileMenuOpen}
            sx={{
              ml: 1,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
