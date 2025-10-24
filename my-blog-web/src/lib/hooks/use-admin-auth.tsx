'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthApiService } from '@/lib/api/admin-auth';

/**
 * 管理员用户信息接口
 */
interface AdminUser {
  id: string;
  username: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  isEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 认证上下文接口
 */
interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * 认证上下文
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 认证提供者组件
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * 检查是否已认证
   */
  const isAuthenticated = !!user && !!token;

  /**
   * 初始化认证状态
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // 验证token是否有效
          try {
            await adminAuthApiService.validateToken(storedToken);
          } catch {
            // token无效，清除存储
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('认证初始化失败:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * 登录
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await adminAuthApiService.login({ username, password });
      
      if (response.code === 200 && response.data) {
        const { token: newToken, user: userData } = response.data;
        
        // 保存到本地存储
        localStorage.setItem('admin_token', newToken);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        
        // 更新状态
        setToken(newToken);
        setUser(userData);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  /**
   * 登出
   */
  const logout = async () => {
    try {
      if (token) {
        await adminAuthApiService.logout();
      }
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      // 清除本地存储和状态
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setToken(null);
      setUser(null);
      
      // 跳转到登录页
      router.push('/admin/login');
    }
  };

  /**
   * 刷新用户信息
   */
  const refreshUser = async () => {
    try {
      const response = await adminAuthApiService.getCurrentUser();
      if (response.code === 200 && response.data) {
        const userData = response.data;
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 使用认证上下文的Hook
 */
export function useAdminAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

/**
 * 认证保护组件
 */
export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
