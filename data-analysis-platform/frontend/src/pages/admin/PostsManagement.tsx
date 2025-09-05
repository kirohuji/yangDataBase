import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Breadcrumbs,
  Link,
  Fab,
  Tooltip,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

interface PostItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  author: string;
}

interface CategoryItem {
  id: string;
  name: string;
  children?: CategoryItem[];
  posts?: PostItem[];
}

const PostsManagement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 状态管理
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    item: PostItem | CategoryItem | null;
    type: 'post' | 'category';
  } | null>(null);

  // 表单状态
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryParent, setNewCategoryParent] = useState('');

  // 模拟数据
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: 'research',
      name: '研究成果',
      children: [
        { id: 'papers', name: '学术论文' },
        { id: 'reports', name: '研究报告' },
      ],
    },
    {
      id: 'news',
      name: '新闻动态',
      children: [
        { id: 'updates', name: '系统更新' },
        { id: 'announcements', name: '公告通知' },
      ],
    },
    {
      id: 'tutorials',
      name: '教程文档',
      children: [
        { id: 'guides', name: '使用指南' },
        { id: 'api', name: 'API文档' },
      ],
    },
  ]);

  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: '1',
      title: 'Yanglab数据库最新研究成果发表',
      content: `# 研究背景

我们的研究团队在植物基因组学领域取得了重要突破...

## 主要发现

1. 发现了新的基因调控机制
2. 建立了高精度的预测模型
3. 开发了创新的分析方法

## 研究意义

这项研究对于理解植物生长发育具有重要意义...`,
      category: 'papers',
      tags: ['基因组学', '研究成果', 'Nature'],
      status: 'published',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      author: '研究团队',
    },
    {
      id: '2',
      title: '数据库系统升级公告',
      content: `# 系统升级通知

为了提供更好的服务，我们将于本周末对数据库系统进行升级...

## 升级内容

- 性能优化
- 界面改进
- 新功能上线

## 注意事项

请在升级期间注意保存您的工作...`,
      category: 'announcements',
      tags: ['系统升级', '公告'],
      status: 'published',
      createdAt: '2024-01-12T15:30:00Z',
      updatedAt: '2024-01-12T15:30:00Z',
      author: '技术团队',
    },
    {
      id: '3',
      title: '新用户使用指南',
      content: `# 欢迎使用Yanglab数据库

本指南将帮助您快速上手我们的平台...

## 注册账户

1. 点击注册按钮
2. 填写必要信息
3. 验证邮箱

## 开始使用

登录后，您可以...`,
      category: 'guides',
      tags: ['教程', '新手指南'],
      status: 'draft',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-14T16:20:00Z',
      author: '教育团队',
    },
  ]);

  // 获取分类下的文章
  const getPostsByCategory = (categoryId: string) => {
    if (categoryId === 'all') return posts;
    return posts.filter(post => post.category === categoryId);
  };

  // 获取分类名称
  const getCategoryName = (categoryId: string): string => {
    const findCategory = (cats: CategoryItem[]): string => {
      for (const cat of cats) {
        if (cat.id === categoryId) return cat.name;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return '';
    };
    return findCategory(categories) || '未分类';
  };

  // 处理文章选择
  const handlePostSelect = (post: PostItem) => {
    setSelectedPost(post);
    setIsEditing(false);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  // 处理文章编辑
  const handleEditPost = () => {
    setIsEditing(true);
  };

  // 处理文章保存
  const handleSavePost = () => {
    if (!selectedPost) return;
    
    setPosts(prev => prev.map(post => 
      post.id === selectedPost.id 
        ? { ...selectedPost, updatedAt: new Date().toISOString() }
        : post
    ));
    setIsEditing(false);
  };

  // 处理创建新文章
  const handleCreatePost = () => {
    const newPost: PostItem = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      tags: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: '当前用户',
    };
    
    setPosts(prev => [...prev, newPost]);
    setSelectedPost(newPost);
    setShowCreateDialog(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setIsEditing(true);
  };

  // 处理删除文章
  const handleDeletePost = (postId: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      setPosts(prev => prev.filter(post => post.id !== postId));
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
    }
  };

  // 右键菜单处理
  const handleContextMenu = (
    event: React.MouseEvent,
    item: PostItem | CategoryItem,
    type: 'post' | 'category'
  ) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      item,
      type,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // 渲染分类树
  const renderCategoryTree = (cats: CategoryItem[], level: number = 0) => {
    return cats.map((category) => (
      <Box key={category.id}>
        <ListItemButton
          sx={{ 
            pl: 2 + level * 2,
            py: 0.5,
            '&:hover': { backgroundColor: 'action.hover' },
          }}
          selected={selectedCategory === category.id}
          onClick={() => setSelectedCategory(category.id)}
          onContextMenu={(e) => handleContextMenu(e, category, 'category')}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            {category.children ? <FolderIcon /> : <FolderOpenIcon />}
          </ListItemIcon>
          <ListItemText 
            primary={category.name}
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </ListItemButton>
        
        {category.children && renderCategoryTree(category.children, level + 1)}
        
        {/* 显示该分类下的文章 */}
        {getPostsByCategory(category.id).map((post) => (
          <ListItemButton
            key={post.id}
            sx={{ 
              pl: 4 + level * 2,
              py: 0.5,
              '&:hover': { backgroundColor: 'action.hover' },
            }}
            selected={selectedPost?.id === post.id}
            onClick={() => handlePostSelect(post)}
            onContextMenu={(e) => handleContextMenu(e, post, 'post')}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArticleIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary={post.title}
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={post.status}
                    size="small"
                    color={post.status === 'published' ? 'success' : 'default'}
                    sx={{ fontSize: '0.7rem', height: 16 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              }
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                noWrap: true,
              }}
              secondaryTypographyProps={{ sx: { mt: 0.5 } }}
            />
          </ListItemButton>
        ))}
      </Box>
    ));
  };

  // 侧边栏内容
  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 侧边栏头部 */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          文章管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          size="small"
          onClick={() => setShowCreateDialog(true)}
        >
          新建文章
        </Button>
      </Box>

      {/* 分类树 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List dense sx={{ py: 1 }}>
          <ListItemButton
            sx={{ pl: 2, py: 0.5 }}
            selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FolderOpenIcon />
            </ListItemIcon>
            <ListItemText 
              primary="所有文章"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
            />
            <Chip 
              label={posts.length} 
              size="small" 
              sx={{ fontSize: '0.7rem', height: 18 }}
            />
          </ListItemButton>
          
          <Divider sx={{ my: 1 }} />
          
          {renderCategoryTree(categories)}
        </List>
      </Box>

      {/* 侧边栏底部 */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          fullWidth
          size="small"
          onClick={() => setShowCategoryDialog(true)}
        >
          新建分类
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* 移动端顶栏 */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              文章管理
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* 侧边栏 */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 300,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {sidebarContent}
        </Drawer>
      ) : (
        <Paper
          sx={{
            width: 300,
            borderRadius: 0,
            borderRight: 1,
            borderColor: 'divider',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {sidebarContent}
        </Paper>
      )}

      {/* 主内容区 */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          mt: isMobile ? 8 : 0,
        }}
      >
        {selectedPost ? (
          <>
            {/* 内容区头部 */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 0,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                  <Link color="inherit" href="#" onClick={() => setSelectedCategory('all')}>
                    所有文章
                  </Link>
                  <Link color="inherit" href="#">
                    {getCategoryName(selectedPost.category)}
                  </Link>
                  <Typography color="text.primary">
                    {selectedPost.title}
                  </Typography>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Chip
                    label={selectedPost.status}
                    size="small"
                    color={selectedPost.status === 'published' ? 'success' : 'default'}
                  />
                  {selectedPost.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditPost}
                  >
                    编辑
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSavePost}
                  >
                    保存
                  </Button>
                )}
                <IconButton
                  onClick={() => handleDeletePost(selectedPost.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>

            {/* 编辑器区域 */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              {isEditing ? (
                <MarkdownEditor
                  value={selectedPost.content}
                  onChange={(content) => setSelectedPost({ ...selectedPost, content })}
                  onSave={handleSavePost}
                  height="100%"
                />
              ) : (
                <Box
                  sx={{
                    p: 3,
                    height: '100%',
                    overflow: 'auto',
                    backgroundColor: 'background.paper',
                    '& h1': { fontSize: '2rem', fontWeight: 700, mb: 2 },
                    '& h2': { fontSize: '1.5rem', fontWeight: 600, mb: 2 },
                    '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1.5 },
                    '& p': { mb: 2, lineHeight: 1.6 },
                    '& blockquote': {
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      pl: 2,
                      py: 1,
                      my: 2,
                      backgroundColor: 'action.hover',
                      fontStyle: 'italic',
                    },
                    '& code': {
                      backgroundColor: 'action.hover',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    },
                    '& pre': {
                      backgroundColor: 'action.hover',
                      p: 2,
                      borderRadius: 1,
                      overflow: 'auto',
                      my: 2,
                    },
                    '& ul, & ol': { pl: 3, mb: 2 },
                    '& li': { mb: 0.5 },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: selectedPost.content
                      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`(.*?)`/g, '<code>$1</code>')
                      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
                      .replace(/^- (.*$)/gm, '<li>$1</li>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
                      .replace(/\n/g, '<br>'),
                  }}
                />
              )}
            </Box>
          </>
        ) : (
          // 空状态
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'text.secondary',
            }}
          >
            <ArticleIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              选择一篇文章开始编辑
            </Typography>
            <Typography variant="body2">
              从左侧列表中选择文章，或创建新文章
            </Typography>
          </Box>
        )}
      </Box>

      {/* 新建文章对话框 */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新建文章</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="文章标题"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>选择分类</InputLabel>
            <Select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              label="选择分类"
            >
              {categories.map((cat) => [
                <MenuItemComponent key={cat.id} value={cat.id}>{cat.name}</MenuItemComponent>,
                ...(cat.children?.map((child) => (
                  <MenuItemComponent key={child.id} value={child.id} sx={{ pl: 4 }}>
                    {child.name}
                  </MenuItemComponent>
                )) || [])
              ]).flat()}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="初始内容"
            multiline
            rows={4}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="# 文章标题&#10;&#10;在这里开始编写您的内容..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>取消</Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPostTitle || !newPostCategory}
          >
            创建
          </Button>
        </DialogActions>
      </Dialog>

      {/* 右键菜单 */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextMenu?.type === 'post' && [
          <MenuItemComponent key="edit" onClick={() => {
            if (contextMenu.item) {
              handlePostSelect(contextMenu.item as PostItem);
              handleEditPost();
            }
            handleCloseContextMenu();
          }}>
            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
            <ListItemText>编辑</ListItemText>
          </MenuItemComponent>,
          <MenuItemComponent key="delete" onClick={() => {
            if (contextMenu.item) {
              handleDeletePost(contextMenu.item.id);
            }
            handleCloseContextMenu();
          }}>
            <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
            <ListItemText>删除</ListItemText>
          </MenuItemComponent>
        ]}
      </Menu>
    </Box>
  );
};

export default PostsManagement;
