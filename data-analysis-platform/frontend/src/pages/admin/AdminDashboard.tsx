import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as UploadIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import PostsManagement from './PostsManagement';

const drawerWidth = 240;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  component?: React.ComponentType;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '仪表板',
    icon: <DashboardIcon />,
  },
  {
    id: 'posts',
    label: '文章管理',
    icon: <ArticleIcon />,
    component: PostsManagement,
  },
  {
    id: 'users',
    label: '用户管理',
    icon: <PeopleIcon />,
  },
  {
    id: 'files',
    label: '文件管理',
    icon: <UploadIcon />,
  },
  {
    id: 'analytics',
    label: '数据分析',
    icon: <AnalyticsIcon />,
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: <SettingsIcon />,
  },
];

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('posts'); // 默认显示文章管理

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // 仪表板内容
  const DashboardContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        管理后台
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ArticleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">24</Typography>
                  <Typography color="text.secondary">文章总数</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">156</Typography>
                  <Typography color="text.secondary">注册用户</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <UploadIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">89</Typography>
                  <Typography color="text.secondary">上传文件</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AnalyticsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">1.2K</Typography>
                  <Typography color="text.secondary">页面访问</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        快速操作
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateY(-1px)',
              },
            }}
            onClick={() => handleMenuSelect('posts')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ArticleIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1">创建新文章</Typography>
                <Typography variant="body2" color="text.secondary">
                  编写和发布新的文章内容
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateY(-1px)',
              },
            }}
            onClick={() => handleMenuSelect('users')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ mr: 2, color: 'success.main' }} />
              <Box>
                <Typography variant="subtitle1">管理用户</Typography>
                <Typography variant="body2" color="text.secondary">
                  查看和管理用户账户
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateY(-1px)',
              },
            }}
            onClick={() => handleMenuSelect('settings')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: 2, color: 'info.main' }} />
              <Box>
                <Typography variant="subtitle1">系统设置</Typography>
                <Typography variant="body2" color="text.secondary">
                  配置系统参数和选项
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  // 渲染当前选中的内容
  const renderContent = () => {
    const selectedItem = menuItems.find(item => item.id === selectedMenu);
    
    if (selectedItem?.component) {
      const Component = selectedItem.component;
      return <Component />;
    }
    
    if (selectedMenu === 'dashboard') {
      return <DashboardContent />;
    }
    
    // 其他页面的占位内容
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {selectedItem?.label || '页面'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          此页面正在开发中...
        </Typography>
      </Box>
    );
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          管理后台
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedMenu === item.id}
              onClick={() => handleMenuSelect(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="通知" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="退出登录" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 顶部应用栏 */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          display: { md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(item => item.id === selectedMenu)?.label || '管理后台'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 侧边栏 */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* 移动端抽屉 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* 桌面端抽屉 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 主要内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, md: 0 },
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
