/**
 * API 使用示例
 * 
 * 这个文件展示了如何在 React 组件中使用 API 服务
 */

import { 
  authApiService,
  articleApiService,
  categoryApiService,
  tagApiService,
  commentApiService,
  friendLinkApiService,
  guestbookApiService,
  systemSettingApiService
} from '@/lib/api';

// 1. 认证相关示例
export const authExamples = {
  // 用户登录
  async login(username: string, password: string) {
    try {
      const response = await authApiService.login({ username, password });
      console.log('登录成功:', response);
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 用户注册
  async register(userData: { username: string; password: string; email: string }) {
    try {
      const response = await authApiService.register(userData);
      console.log('注册成功:', response);
      return response;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const user = await authApiService.getCurrentUser();
      console.log('当前用户:', user);
      return user;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  // 用户登出
  async logout() {
    try {
      await authApiService.logout();
      console.log('登出成功');
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  }
};

// 2. 文章相关示例
export const articleExamples = {
  // 获取文章列表
  async getArticles(page = 1, size = 10) {
    try {
      const response = await articleApiService.getArticles({ page, size });
      console.log('文章列表:', response);
      return response;
    } catch (error) {
      console.error('获取文章列表失败:', error);
      throw error;
    }
  },

  // 获取文章详情
  async getArticle(id: string) {
    try {
      const article = await articleApiService.getArticle(id);
      console.log('文章详情:', article);
      return article;
    } catch (error) {
      console.error('获取文章详情失败:', error);
      throw error;
    }
  },

  // 创建文章
  async createArticle(articleData: {
    title: string;
    content: string;
    categoryId: string;
    tagIds: string[];
  }) {
    try {
      const article = await articleApiService.createArticle(articleData);
      console.log('创建文章成功:', article);
      return article;
    } catch (error) {
      console.error('创建文章失败:', error);
      throw error;
    }
  },

  // 搜索文章
  async searchArticles(query: string) {
    try {
      const response = await articleApiService.searchArticles(query);
      console.log('搜索结果:', response);
      return response;
    } catch (error) {
      console.error('搜索文章失败:', error);
      throw error;
    }
  }
};

// 3. 分类相关示例
export const categoryExamples = {
  // 获取所有分类
  async getAllCategories() {
    try {
      const categories = await categoryApiService.getAllCategories();
      console.log('分类列表:', categories);
      return categories;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      throw error;
    }
  },

  // 创建分类
  async createCategory(categoryData: {
    name: string;
    description?: string;
    color?: string;
  }) {
    try {
      const category = await categoryApiService.createCategory(categoryData);
      console.log('创建分类成功:', category);
      return category;
    } catch (error) {
      console.error('创建分类失败:', error);
      throw error;
    }
  }
};

// 4. 标签相关示例
export const tagExamples = {
  // 获取所有标签
  async getAllTags() {
    try {
      const tags = await tagApiService.getAllTags();
      console.log('标签列表:', tags);
      return tags;
    } catch (error) {
      console.error('获取标签列表失败:', error);
      throw error;
    }
  },

  // 获取热门标签
  async getPopularTags(limit = 20) {
    try {
      const tags = await tagApiService.getPopularTags(limit);
      console.log('热门标签:', tags);
      return tags;
    } catch (error) {
      console.error('获取热门标签失败:', error);
      throw error;
    }
  },

  // 创建标签
  async createTag(tagData: {
    name: string;
    description?: string;
    color?: string;
  }) {
    try {
      const tag = await tagApiService.createTag(tagData);
      console.log('创建标签成功:', tag);
      return tag;
    } catch (error) {
      console.error('创建标签失败:', error);
      throw error;
    }
  }
};

// 5. 评论相关示例
export const commentExamples = {
  // 获取文章评论
  async getArticleComments(articleId: string) {
    try {
      const response = await commentApiService.getArticleComments(articleId);
      console.log('文章评论:', response);
      return response;
    } catch (error) {
      console.error('获取文章评论失败:', error);
      throw error;
    }
  },

  // 创建评论
  async createComment(commentData: {
    articleId: string;
    author: string;
    email: string;
    content: string;
    parentId?: string;
  }) {
    try {
      const comment = await commentApiService.createComment(commentData);
      console.log('创建评论成功:', comment);
      return comment;
    } catch (error) {
      console.error('创建评论失败:', error);
      throw error;
    }
  },

  // 点赞评论
  async likeComment(commentId: string) {
    try {
      const comment = await commentApiService.likeComment(commentId);
      console.log('点赞评论成功:', comment);
      return comment;
    } catch (error) {
      console.error('点赞评论失败:', error);
      throw error;
    }
  }
};

// 6. 友链相关示例
export const friendLinkExamples = {
  // 获取已审核的友链
  async getApprovedFriendLinks() {
    try {
      const friendLinks = await friendLinkApiService.getApprovedFriendLinks();
      console.log('友链列表:', friendLinks);
      return friendLinks;
    } catch (error) {
      console.error('获取友链列表失败:', error);
      throw error;
    }
  },

  // 申请友链
  async applyFriendLink(friendLinkData: {
    name: string;
    url: string;
    description?: string;
    logo?: string;
  }) {
    try {
      const friendLink = await friendLinkApiService.applyFriendLink(friendLinkData);
      console.log('申请友链成功:', friendLink);
      return friendLink;
    } catch (error) {
      console.error('申请友链失败:', error);
      throw error;
    }
  }
};

// 7. 留言板相关示例
export const guestbookExamples = {
  // 获取已审核的留言
  async getApprovedMessages(page = 1, size = 10) {
    try {
      const response = await guestbookApiService.getApprovedMessages({ page, size });
      console.log('留言列表:', response);
      return response;
    } catch (error) {
      console.error('获取留言列表失败:', error);
      throw error;
    }
  },

  // 创建留言
  async createMessage(messageData: {
    author: string;
    email: string;
    content: string;
    website?: string;
    parentId?: string;
  }) {
    try {
      const message = await guestbookApiService.createMessage(messageData);
      console.log('创建留言成功:', message);
      return message;
    } catch (error) {
      console.error('创建留言失败:', error);
      throw error;
    }
  },

  // 点赞留言
  async likeMessage(messageId: string) {
    try {
      const message = await guestbookApiService.likeMessage(messageId);
      console.log('点赞留言成功:', message);
      return message;
    } catch (error) {
      console.error('点赞留言失败:', error);
      throw error;
    }
  }
};

// 8. 系统设置相关示例
export const systemSettingExamples = {
  // 获取网站信息
  async getSiteInfo() {
    try {
      const siteInfo = await systemSettingApiService.getSiteInfo();
      console.log('网站信息:', siteInfo);
      return siteInfo;
    } catch (error) {
      console.error('获取网站信息失败:', error);
      throw error;
    }
  },

  // 获取社交媒体链接
  async getSocialLinks() {
    try {
      const socialLinks = await systemSettingApiService.getSocialLinks();
      console.log('社交媒体链接:', socialLinks);
      return socialLinks;
    } catch (error) {
      console.error('获取社交媒体链接失败:', error);
      throw error;
    }
  },

  // 更新系统设置
  async updateSetting(key: string, value: string) {
    try {
      const setting = await systemSettingApiService.updateSetting(key, { value });
      console.log('更新设置成功:', setting);
      return setting;
    } catch (error) {
      console.error('更新设置失败:', error);
      throw error;
    }
  }
};

// 9. React Hook 示例
export const useApiExamples = {
  // 使用 useEffect 获取数据
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const articles = await articleApiService.getArticles();
        setArticles(articles.content);
      } catch (error) {
        console.error('获取文章失败:', error);
      }
    };
    
    fetchData();
  }, []);
  */

  // 使用 useState 管理加载状态
  /*
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      await articleApiService.createArticle(data);
      // 处理成功
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  */
};
