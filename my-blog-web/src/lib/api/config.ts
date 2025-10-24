// API 配置
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API 端点
export const API_ENDPOINTS = {
  // 认证
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  
  // 文章
  ARTICLES: {
    LIST: '/api/articles',
    CREATE: '/api/articles',
    GET: (id: string) => `/api/articles/${id}`,
    UPDATE: (id: string) => `/api/articles/${id}`,
    DELETE: (id: string) => `/api/articles/${id}`,
    PUBLISH: (id: string) => `/api/articles/${id}/publish`,
    UNPUBLISH: (id: string) => `/api/articles/${id}/unpublish`,
    PIN: (id: string) => `/api/articles/${id}/pin`,
    UNPIN: (id: string) => `/api/articles/${id}/unpin`,
  },
  
  // 分类
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
    GET: (id: string) => `/api/categories/${id}`,
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },
  
  // 标签
  TAGS: {
    LIST: '/api/tags',
    CREATE: '/api/tags',
    GET: (id: string) => `/api/tags/${id}`,
    UPDATE: (id: string) => `/api/tags/${id}`,
    DELETE: (id: string) => `/api/tags/${id}`,
  },
  
  // 评论
  COMMENTS: {
    LIST: '/api/comments',
    CREATE: '/api/comments',
    GET: (id: string) => `/api/comments/${id}`,
    UPDATE: (id: string) => `/api/comments/${id}`,
    DELETE: (id: string) => `/api/comments/${id}`,
    APPROVE: (id: string) => `/api/comments/${id}/approve`,
    DISAPPROVE: (id: string) => `/api/comments/${id}/disapprove`,
    BY_ARTICLE: (articleId: string) => `/api/comments/article/${articleId}`,
  },
  
  // 友链
  FRIEND_LINKS: {
    LIST: '/api/friend-links',
    CREATE: '/api/friend-links',
    GET: (id: string) => `/api/friend-links/${id}`,
    UPDATE: (id: string) => `/api/friend-links/${id}`,
    DELETE: (id: string) => `/api/friend-links/${id}`,
    APPROVE: (id: string) => `/api/friend-links/${id}/approve`,
    DISAPPROVE: (id: string) => `/api/friend-links/${id}/disapprove`,
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
    LIST: '/api/system-settings',
    CREATE: '/api/system-settings',
    GET: (key: string) => `/api/system-settings/${key}`,
    UPDATE: (key: string) => `/api/system-settings/${key}`,
    DELETE: (key: string) => `/api/system-settings/${key}`,
  },
  
  // 用户
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    PROFILE: '/api/users/profile',
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
