/**
 * 文章类型定义
 * 用于表示博客文章的基本信息
 */
export interface Article {
  /** 文章唯一标识符 */
  id: number;
  /** 文章标题 */
  title: string;
  /** 文章摘要描述 */
  summary: string;
  /** 文章完整内容（Markdown格式） */
  content: string;
  /** 文章URL友好的标识符 */
  slug: string;
  /** 文章封面图片URL（可选） */
  coverImage?: string;
  /** 文章是否已发布 */
  isPublished: boolean;
  /** 文章是否置顶显示 */
  isPinned: boolean;
  /** 文章浏览次数 */
  viewCount: number;
  /** 文章点赞次数 */
  likeCount: number;
  /** 文章评论数量 */
  commentCount: number;
  /** 文章所属分类 */
  category: Category;
  /** 文章关联的标签列表 */
  tags: Tag[];
  /** 文章创建时间 */
  createdAt: string;
  /** 文章最后更新时间 */
  updatedAt: string;
  /** 文章发布时间 */
  publishedAt?: string;
}

/**
 * 分类类型定义
 * 用于表示文章分类信息
 */
export interface Category {
  /** 分类唯一标识符 */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类URL友好的标识符 */
  slug: string;
  /** 分类描述（可选） */
  description?: string;
  /** 分类显示颜色（十六进制颜色值） */
  color: string;
  /** 该分类下的文章数量 */
  articleCount: number;
  /** 分类创建时间 */
  createdAt: string;
}

/**
 * 标签类型定义
 * 用于表示文章标签信息
 */
export interface Tag {
  /** 标签唯一标识符 */
  id: string;
  /** 标签名称 */
  name: string;
  /** 标签URL友好的标识符 */
  slug: string;
  /** 标签显示颜色（十六进制颜色值） */
  color: string;
  /** 使用该标签的文章数量 */
  articleCount: number;
  /** 标签创建时间 */
  createdAt: string;
}

/**
 * 作者类型定义
 * 用于表示文章作者信息
 */
export interface Author {
  /** 作者唯一标识符 */
  id: string;
  /** 作者姓名 */
  name: string;
  /** 作者头像图片URL（可选） */
  avatar?: string;
  /** 作者个人简介（可选） */
  bio?: string;
  /** 作者社交媒体链接（可选） */
  socialLinks?: {
    /** GitHub个人主页链接 */
    github?: string;
    /** Twitter个人主页链接 */
    twitter?: string;
    /** 邮箱地址 */
    email?: string;
  };
}

/**
 * 评论类型定义
 * 用于表示文章评论信息
 */
export interface Comment {
  /** 评论唯一标识符 */
  id: number;
  /** 评论所属文章ID */
  articleId: number;
  /** 评论作者姓名 */
  author: string;
  /** 评论作者邮箱 */
  email: string;
  /** 评论作者网站（可选） */
  website?: string;
  /** 评论内容 */
  content: string;
  /** 父评论ID（用于嵌套回复） */
  parentId?: number;
  /** 评论是否已审核通过 */
  isApproved: boolean;
  /** 评论点赞次数 */
  likeCount: number;
  /** 评论者IP地址 */
  ipAddress?: string;
  /** 评论者浏览器信息 */
  userAgent?: string;
  /** 评论创建时间 */
  createdAt: string;
  /** 评论最后更新时间 */
  updatedAt: string;
  /** 评论的回复列表 */
  replies?: Comment[];
}

/**
 * 友情链接类型定义
 * 用于表示网站友情链接信息
 */
export interface FriendLink {
  /** 友链唯一标识符 */
  id: string;
  /** 友链网站名称 */
  name: string;
  /** 友链网站URL */
  url: string;
  /** 友链网站描述（可选） */
  description?: string;
  /** 友链网站Logo图片URL（可选） */
  logo?: string;
  /** 友链是否已审核通过 */
  isApproved: boolean;
  /** 友链排序顺序 */
  sortOrder?: number;
  /** 友链点击次数 */
  clickCount?: number;
  /** 友链申请者邮箱 */
  email?: string;
  /** 友链创建时间 */
  createdAt: string;
  /** 友链最后更新时间 */
  updatedAt?: string;
}

/**
 * 留言板消息类型定义
 * 用于表示留言板消息信息
 */
export interface GuestbookMessage {
  /** 留言唯一标识符 */
  id: string;
  /** 留言内容 */
  content: string;
  /** 留言作者姓名 */
  author: string;
  /** 留言作者邮箱 */
  email: string;
  /** 留言作者网站（可选） */
  website?: string;
  /** 留言创建时间 */
  createdAt: string;
  /** 留言点赞次数 */
  likeCount: number;
  /** 留言的回复列表（可选） */
  replies?: GuestbookMessage[];
  /** 父留言ID（用于嵌套回复） */
  parentId?: string;
  /** 留言是否已审核通过 */
  isApproved: boolean;
  /** 留言者IP地址 */
  ipAddress?: string;
  /** 留言者浏览器信息 */
  userAgent?: string;
  /** 留言最后更新时间 */
  updatedAt?: string;
}

/**
 * 轮播图项目类型定义
 * 用于表示首页轮播图信息
 */
export interface CarouselItem {
  /** 轮播图唯一标识符 */
  id: string;
  /** 轮播图标题 */
  title: string;
  /** 轮播图描述 */
  description: string;
  /** 轮播图背景图片URL */
  image: string;
  /** 轮播图点击跳转链接（可选） */
  link?: string;
  /** 轮播图按钮文字（可选） */
  buttonText?: string;
}

/**
 * 归档项目类型定义
 * 用于表示按年月归档的文章信息
 */
export interface ArchiveItem {
  /** 归档年份 */
  year: number;
  /** 归档月份 */
  month: number;
  /** 该年月下的文章列表 */
  articles: Article[];
}

/**
 * API响应类型定义
 * 用于表示API接口的统一响应格式
 */
export interface ApiResponse<T> {
  /** HTTP状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 响应时间戳 */
  timestamp: number;
}

/**
 * 分页响应类型定义
 * 用于表示分页查询的响应格式
 */
export interface PageResponse<T> {
  /** 当前页的数据列表 */
  content: T[];
  /** 当前页码（从0开始） */
  page: number;
  /** 每页大小 */
  size: number;
  /** 总元素数量 */
  totalElements: number;
  /** 总页数 */
  totalPages: number;
  /** 是否为第一页 */
  first: boolean;
  /** 是否为最后一页 */
  last: boolean;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrevious: boolean;
}

/**
 * 搜索结果类型定义
 * 用于表示搜索接口返回的结果
 */
export interface SearchResult {
  /** 匹配的文章列表 */
  articles: Article[];
  /** 匹配的分类列表 */
  categories: Category[];
  /** 匹配的标签列表 */
  tags: Tag[];
  /** 搜索结果总数 */
  total: number;
}

/**
 * 主题类型定义
 * 用于表示网站主题模式
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 分页参数类型定义
 * 用于表示分页查询的基本参数
 */
export interface PaginationParams {
  /** 当前页码（从1开始） */
  page: number;
  /** 每页显示数量 */
  limit: number;
}

/**
 * 文章查询参数类型定义
 * 用于表示文章列表查询的完整参数
 */
export interface ArticleQueryParams extends PaginationParams {
  /** 按分类筛选（可选） */
  category?: string;
  /** 按标签筛选（可选） */
  tag?: string;
  /** 关键词搜索（可选） */
  search?: string;
  /** 按年份筛选（可选） */
  year?: number;
  /** 按月份筛选（可选） */
  month?: number;
}

/**
 * 登录请求类型定义
 * 用于表示用户登录请求的参数
 */
export interface LoginRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
}

/**
 * 登录响应类型定义
 * 用于表示用户登录成功后的响应数据
 */
export interface LoginResponse {
  /** JWT访问令牌 */
  token: string;
  /** 用户信息 */
  user: {
    /** 用户唯一标识符 */
    id: string;
    /** 用户名 */
    username: string;
    /** 用户邮箱 */
    email?: string;
    /** 用户昵称 */
    nickname?: string;
    /** 用户头像 */
    avatar?: string;
    /** 用户个人简介 */
    bio?: string;
    /** 用户是否启用 */
    isEnabled: boolean;
    /** 用户最后登录时间 */
    lastLoginAt?: string;
    /** 用户创建时间 */
    createdAt: string;
    /** 用户最后更新时间 */
    updatedAt: string;
  };
  /** 令牌过期时间（毫秒） */
  expiresIn: number;
}

/**
 * 系统设置类型定义
 * 用于表示系统配置信息
 */
export interface SystemSetting {
  /** 设置项唯一标识符 */
  id: number;
  /** 设置项键名 */
  key: string;
  /** 设置项值 */
  value: string;
  /** 设置项描述 */
  description: string;
  /** 设置项数据类型 */
  settingType: string;
  /** 设置项是否公开（前端可访问） */
  isPublic: boolean;
  /** 设置项创建时间 */
  createdAt: string;
  /** 设置项最后更新时间 */
  updatedAt: string;
}

/**
 * 博客统计数据类型定义
 * 用于表示博客的整体统计信息
 */
export interface BlogStats {
  /** 文章总数 */
  totalArticles: number;
  /** 分类总数 */
  totalCategories: number;
  /** 标签总数 */
  totalTags: number;
  /** 评论总数 */
  totalComments: number;
  /** 总浏览次数 */
  totalViews: number;
  /** 总点赞次数 */
  totalLikes: number;
}
