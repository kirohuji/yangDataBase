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
import PlantIcon from '@/components/common/PlantIcon';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { setLanguage } = useAppStore();
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
    setLanguage(language as 'en' | 'zh');
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
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: '#4A90A4', // 类似生物数据库的青绿色
        background: 'linear-gradient(135deg, #4A90A4 0%, #5BA0B4 100%)',
        minHeight: '70px',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 }, minHeight: '70px !important' }}>
        {/* Logo和标题 */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
          <PlantIcon 
            variant="leaf" 
            sx={{ 
              fontSize: 40, 
              mr: 2, 
              color: '#FFFFFF',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' },
                color: '#FFFFFF',
                cursor: 'pointer',
                letterSpacing: 0.5,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
              onClick={() => handleNavigation('/')}
            >
              {t('home.title')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.75rem',
                fontStyle: 'italic',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {t('home.subtitle')}
            </Typography>
          </Box>
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
