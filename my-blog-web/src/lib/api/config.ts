// API 配置
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API 端点
export const API_ENDPOINTS = {
  // 认证
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // 文章
  ARTICLES: {
    LIST: '/articles',
    GET: (id: string) => `/articles/${id}`,
    GET_BY_SLUG: (slug: string) => `/articles/slug/${slug}`,
    CREATE: '/articles',
    UPDATE: (id: string) => `/articles/${id}`,
    DELETE: (id: string) => `/articles/${id}`,
    PUBLISHED: '/articles/published',
    PINNED: '/articles/pinned',
    POPULAR: '/articles/popular',
    SEARCH: '/articles/search',
    BY_CATEGORY: (categoryId: string) => `/articles/category/${categoryId}`,
    BY_TAG: (tagId: string) => `/articles/tag/${tagId}`,
    PUBLISH: (id: string) => `/articles/${id}/publish`,
    UNPUBLISH: (id: string) => `/articles/${id}/unpublish`,
    PIN: (id: string) => `/articles/${id}/pin`,
    UNPIN: (id: string) => `/articles/${id}/unpin`,
    VIEW: (id: string) => `/articles/${id}/view`,
    LIKE: (id: string) => `/articles/${id}/like`,
  },
  
  // 分类
  CATEGORIES: {
    LIST: '/categories',
    ALL: '/categories/all',
    GET: (id: string) => `/categories/${id}`,
    GET_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
    WITH_ARTICLES: '/categories/with-articles',
  },
  
  // 标签
  TAGS: {
    LIST: '/tags',
    ALL: '/tags/all',
    GET: (id: string) => `/tags/${id}`,
    GET_BY_SLUG: (slug: string) => `/tags/slug/${slug}`,
    CREATE: '/tags',
    UPDATE: (id: string) => `/tags/${id}`,
    DELETE: (id: string) => `/tags/${id}`,
    WITH_ARTICLES: '/tags/with-articles',
    POPULAR: '/tags/popular',
  },
  
  // 友链
  FRIEND_LINKS: {
    LIST: '/friend-links',
    GET: (id: string) => `/friend-links/${id}`,
    CREATE: '/friend-links',
    UPDATE: (id: string) => `/friend-links/${id}`,
    DELETE: (id: string) => `/friend-links/${id}`,
    APPROVED: '/friend-links/approved',
    PENDING: '/friend-links/pending',
    APPROVE: (id: string) => `/friend-links/${id}/approve`,
    REJECT: (id: string) => `/friend-links/${id}/reject`,
    CLICK: (id: string) => `/friend-links/${id}/click`,
  },
  
  // 评论
  COMMENTS: {
    LIST: '/comments',
    GET: (id: string) => `/comments/${id}`,
    CREATE: '/comments',
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
    BY_ARTICLE: (articleId: string) => `/comments/article/${articleId}`,
    PENDING: '/comments/pending',
    APPROVE: (id: string) => `/comments/${id}/approve`,
    REJECT: (id: string) => `/comments/${id}/reject`,
    LIKE: (id: string) => `/comments/${id}/like`,
    REPLIES: (id: string) => `/comments/${id}/replies`,
  },
  
  
  // 留言板
  GUESTBOOK: {
    LIST: '/api/guestbook',
    CREATE: '/api/guestbook',
    GET: (id: string) => `/api/guestbook/${id}`,
    UPDATE: (id: string) => `/api/guestbook/${id}`,
    DELETE: (id: string) => `/api/guestbook/${id}`,
    APPROVE: (id: string) => `/api/guestbook/${id}/approve`,
    DISAPPROVE: (id: string) => `/api/guestbook/${id}/disapprove`,
  },
  
  
  // 系统设置
  SYSTEM_SETTINGS: {
    LIST: '/system-settings',
    GET: (id: string) => `/system-settings/${id}`,
    GET_BY_KEY: (key: string) => `/system-settings/key/${key}`,
    CREATE: '/system-settings',
    UPDATE: (id: string) => `/system-settings/${id}`,
    DELETE: (id: string) => `/system-settings/${id}`,
    PUBLIC: '/system-settings/public',
    BY_TYPE: (type: string) => `/system-settings/type/${type}`,
    BATCH_UPDATE: '/system-settings/batch',
  },

  // URL元数据
  URL_METADATA: {
    FETCH: '/url-metadata/fetch',
  },

  // 图片管理
  IMAGES: {
    LIST: '/images',
    GET_BY_ID: (id: number) => `/images/${id}`,
    UPLOAD: '/images/upload',
    UPDATE: (id: number) => `/images/${id}`,
    DELETE: (id: number) => `/images/${id}`,
    BATCH_DELETE: '/images/batch-delete',
    STATS: '/images/stats',
  },
  
  // 公共API
  PUBLIC: {
    STATS: '/api/public/stats',
  },
  
  // 用户
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  
  // 仪表盘
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ARTICLES: '/dashboard/recent-articles',
    RECENT_COMMENTS: '/dashboard/recent-comments',
    SYSTEM_INFO: '/dashboard/system-info',
  },
  
};

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API 错误类型
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
