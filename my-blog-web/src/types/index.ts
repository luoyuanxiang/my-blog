// 文章类型
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  likes: number;
  category: Category;
  tags: Tag[];
  author: Author;
  comments: Comment[];
  isPublished: boolean;
  isPinned?: boolean; // 是否置顶
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  articleCount: number;
  createdAt: string;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  articleCount: number;
  createdAt: string;
}

// 作者类型
export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

// 评论类型
export interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  website?: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  parentId?: string;
  isApproved: boolean;
}

// 友情链接类型
export interface FriendLink {
  id: string;
  name: string;
  url: string;
  description?: string;
  avatar?: string;
  createdAt: string;
  isApproved: boolean;
}

// 留言类型
export interface GuestbookMessage {
  id: string;
  content: string;
  author: string;
  email: string;
  website?: string;
  createdAt: string;
  likes: number;
  replies?: GuestbookMessage[];
  parentId?: string;
  isApproved: boolean;
}

// 轮播图类型
export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  buttonText?: string;
}

// 归档类型
export interface ArchiveItem {
  year: number;
  month: number;
  articles: Article[];
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 搜索类型
export interface SearchResult {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  total: number;
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
}

// 文章查询参数
export interface ArticleQueryParams extends PaginationParams {
  category?: string;
  tag?: string;
  search?: string;
  year?: number;
  month?: number;
}

// 统计数据类型
export interface BlogStats {
  totalArticles: number;
  totalCategories: number;
  totalTags: number;
  totalComments: number;
  totalViews: number;
  totalLikes: number;
}
