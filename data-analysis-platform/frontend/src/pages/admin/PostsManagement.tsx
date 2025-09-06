import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  // ListItem,
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
  // MenuItem,
  Chip,
  Divider,
  Breadcrumbs,
  Link,
  // Fab,
  // Tooltip,
  Menu,
  // MenuList,
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
  // MoreVert as MoreIcon,
  Save as SaveIcon,
  // Preview as PreviewIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import PostsService, { PostMeta, CategoryMeta } from '@/services/postsService';

// 使用服务中定义的接口
type PostItem = PostMeta & { content?: string };
type CategoryItem = CategoryMeta;

const PostsManagement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 状态管理
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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
  // const [newCategoryName] = useState('');
  // const [newCategoryParent] = useState('');

  // 数据状态
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, postsData] = await Promise.all([
          PostsService.getCategories(),
          PostsService.getAllPosts()
        ]);
        
        setCategories(categoriesData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

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
  const handlePostSelect = async (post: PostItem) => {
    try {
      // 如果文章没有内容，从服务加载
      if (!post.content) {
        const content = await PostsService.getPostContent(post.path);
        post.content = content;
      }
      
      setSelectedPost(post);
      setIsEditing(false);
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    } catch (error) {
      console.error('Error loading post content:', error);
    }
  };

  // 处理文章编辑
  const handleEditPost = () => {
    setIsEditing(true);
  };

  // 处理文章保存
  const handleSavePost = async () => {
    if (!selectedPost || !selectedPost.content) return;
    
    try {
      // 保存到服务
      await PostsService.savePostContent(selectedPost.path, selectedPost.content);
      
      // 更新本地状态
      const updatedPost = { ...selectedPost, updatedAt: new Date().toISOString() };
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id ? updatedPost : post
      ));
      setSelectedPost(updatedPost);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving post:', error);
      // 这里可以显示错误提示
    }
  };

  // 处理创建新文章
  const handleCreatePost = async () => {
    try {
      const newPost = await PostsService.createPost({
        title: newPostTitle,
        category: newPostCategory,
        content: newPostContent,
        tags: [],
        status: 'draft',
      });
      
      // 添加内容到新文章对象
      const newPostWithContent = { ...newPost, content: newPostContent };
      
      setPosts(prev => [...prev, newPostWithContent]);
      setSelectedPost(newPostWithContent);
      setShowCreateDialog(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // 处理删除文章
  const handleDeletePost = async (postId: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await PostsService.deletePost(postId);
        setPosts(prev => prev.filter(post => post.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
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
          onClick={() => {}}
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
                  value={selectedPost.content || ''}
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
                    __html: selectedPost.content || ''
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
