// 文章管理服务
export interface PostMeta {
  id: string;
  title: string;
  path: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured?: boolean;
  summary: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  readTime?: number;
  views?: number;
  image?: string;
}

export interface CategoryMeta {
  id: string;
  name: string;
  description: string;
  children?: CategoryMeta[];
}

export interface PostsIndex {
  categories: CategoryMeta[];
  posts: PostMeta[];
}

export class PostsService {
  private static indexCache: PostsIndex | null = null;
  private static contentCache: Map<string, string> = new Map();

  // 获取文章索引
  static async getIndex(): Promise<PostsIndex> {
    if (this.indexCache) {
      return this.indexCache;
    }

    try {
      const response = await fetch('/posts/index.json');
      if (!response.ok) {
        throw new Error('Failed to fetch posts index');
      }
      
      this.indexCache = await response.json();
      return this.indexCache!;
    } catch (error) {
      console.error('Error loading posts index:', error);
      // 返回默认的空索引
      return { categories: [], posts: [] };
    }
  }

  // 获取文章内容
  static async getPostContent(path: string): Promise<string> {
    if (this.contentCache.has(path)) {
      return this.contentCache.get(path)!;
    }

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch post content: ${path}`);
      }
      
      const content = await response.text();
      this.contentCache.set(path, content);
      return content;
    } catch (error) {
      console.error('Error loading post content:', error);
      return '# 文章加载失败\n\n抱歉，无法加载文章内容。请稍后重试。';
    }
  }

  // 获取所有文章
  static async getAllPosts(): Promise<PostMeta[]> {
    const index = await this.getIndex();
    return index.posts;
  }

  // 根据ID获取文章
  static async getPostById(id: string): Promise<PostMeta | null> {
    const index = await this.getIndex();
    return index.posts.find(post => post.id === id) || null;
  }

  // 根据分类获取文章
  static async getPostsByCategory(categoryId: string): Promise<PostMeta[]> {
    const index = await this.getIndex();
    if (categoryId === 'all') {
      return index.posts;
    }
    return index.posts.filter(post => post.category === categoryId);
  }

  // 搜索文章
  static async searchPosts(query: string): Promise<PostMeta[]> {
    const index = await this.getIndex();
    const lowerQuery = query.toLowerCase();
    
    return index.posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.summary.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      post.author.toLowerCase().includes(lowerQuery)
    );
  }

  // 获取分类树
  static async getCategories(): Promise<CategoryMeta[]> {
    const index = await this.getIndex();
    return index.categories;
  }

  // 获取分类名称
  static async getCategoryName(categoryId: string): Promise<string> {
    if (categoryId === 'all') return '所有文章';
    
    const categories = await this.getCategories();
    
    const findCategory = (cats: CategoryMeta[]): string => {
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
  }

  // 获取热门文章
  static async getPopularPosts(limit: number = 5): Promise<PostMeta[]> {
    const posts = await this.getAllPosts();
    return posts
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  // 获取最新文章
  static async getLatestPosts(limit: number = 5): Promise<PostMeta[]> {
    const posts = await this.getAllPosts();
    return posts
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  // 获取特色文章
  static async getFeaturedPosts(): Promise<PostMeta[]> {
    const posts = await this.getAllPosts();
    return posts.filter(post => post.featured);
  }

  // 保存文章内容（用于编辑器）
  static async savePostContent(path: string, content: string): Promise<void> {
    // 在实际应用中，这里应该调用后端API来保存文件
    // 目前只是更新缓存
    this.contentCache.set(path, content);
    
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Post saved:', path);
  }

  // 创建新文章
  static async createPost(postData: {
    title: string;
    category: string;
    content: string;
    tags?: string[];
    status?: 'draft' | 'published';
  }): Promise<PostMeta> {
    // 生成文章ID和路径
    const id = postData.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const categoryPath = this.getCategoryPath(postData.category);
    const path = `/posts/${categoryPath}/${id}.md`;
    
    // 创建文章元数据
    const newPost: PostMeta = {
      id,
      title: postData.title,
      path,
      category: postData.category,
      tags: postData.tags || [],
      status: postData.status || 'draft',
      summary: this.extractSummary(postData.content),
      author: '当前用户', // 实际应用中从用户信息获取
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: this.estimateReadTime(postData.content),
      views: 0,
    };
    
    // 保存内容到缓存
    this.contentCache.set(path, postData.content);
    
    // 更新索引缓存
    if (this.indexCache) {
      this.indexCache.posts.push(newPost);
    }
    
    console.log('Post created:', newPost);
    return newPost;
  }

  // 删除文章
  static async deletePost(id: string): Promise<void> {
    const post = await this.getPostById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // 从缓存中删除
    this.contentCache.delete(post.path);
    
    // 从索引中删除
    if (this.indexCache) {
      this.indexCache.posts = this.indexCache.posts.filter(p => p.id !== id);
    }
    
    console.log('Post deleted:', id);
  }

  // 辅助方法：获取分类路径
  private static getCategoryPath(categoryId: string): string {
    // 简单映射，实际应用中可能需要更复杂的逻辑
    const categoryPaths: Record<string, string> = {
      'papers': 'research',
      'reports': 'research',
      'updates': 'news',
      'announcements': 'news',
      'guides': 'tutorials',
      'api': 'tutorials',
    };
    
    return categoryPaths[categoryId] || 'other';
  }

  // 辅助方法：提取文章摘要
  private static extractSummary(content: string): string {
    // 移除Markdown标记，提取前200个字符作为摘要
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // 移除标题标记
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
      .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
      .replace(/`(.*?)`/g, '$1') // 移除代码标记
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
      .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
      .replace(/\n+/g, ' ') // 替换换行为空格
      .trim();
    
    return plainText.length > 200 
      ? plainText.substring(0, 200) + '...'
      : plainText;
  }

  // 辅助方法：估算阅读时间
  private static estimateReadTime(content: string): number {
    const wordsPerMinute = 200; // 平均阅读速度
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // 清除缓存
  static clearCache(): void {
    this.indexCache = null;
    this.contentCache.clear();
  }
}

export default PostsService;

