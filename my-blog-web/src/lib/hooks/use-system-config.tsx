'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { systemSettingApiService } from '@/lib/api/system-settings';
import type { SystemSetting } from '@/types';

// 系统配置接口
export interface SystemConfig {
  // 基本信息
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  adminName: string;
  bloggerName: string;
  bloggerBio: string;
  bloggerAvatar: string;
  
  // 外观设置
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  logo: string;
  favicon: string;
  
  // SEO设置
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // 功能设置
  enableComments: boolean;
  enableGuestbook: boolean;
  enableFriendLinks: boolean;
  enableSearch: boolean;
  
  // 社交链接
  githubUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  emailUrl: string;
  
  // 统计设置
  enableAnalytics: boolean;
  analyticsCode: string;
  
  // 其他设置
  copyright: string;
  icpNumber: string;
  beianNumber: string;
}

// 默认配置
const defaultConfig: SystemConfig = {
  siteName: '个人博客',
  siteDescription: '分享技术文章，记录学习心得',
  siteUrl: 'https://example.com',
  adminEmail: 'admin@example.com',
  adminName: '管理员',
  bloggerName: '博主',
  bloggerBio: '热爱技术，分享知识',
  bloggerAvatar: '/blogger-avatar.svg',
  
  theme: 'auto',
  primaryColor: '#3b82f6',
  logo: '/logo.svg',
  favicon: '/favicon.svg',
  
  metaTitle: '个人博客 - 技术分享',
  metaDescription: '分享技术文章，记录学习心得',
  metaKeywords: '技术,博客,编程,学习',
  
  enableComments: true,
  enableGuestbook: true,
  enableFriendLinks: true,
  enableSearch: true,
  
  githubUrl: 'https://github.com/luoyuanxiang',
  twitterUrl: '',
  linkedinUrl: '',
  emailUrl: '',
  
  enableAnalytics: false,
  analyticsCode: '',
  
  copyright: '© 2024 个人博客',
  icpNumber: '',
  beianNumber: ''
};

// 系统配置上下文
interface SystemConfigContextType {
  config: SystemConfig;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  updateConfig: (key: keyof SystemConfig, value: string | boolean) => void;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

// 系统配置提供者
export function SystemConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从系统设置映射到配置
  const mapSettingsToConfig = (settings: SystemSetting[]): SystemConfig => {
    const configMap: Partial<SystemConfig> = { ...defaultConfig };
    
    settings.forEach(setting => {
      const key = setting.key as keyof SystemConfig;
      if (key in defaultConfig) {
        // 根据设置类型转换值
        if (typeof defaultConfig[key] === 'boolean') {
          (configMap as any)[key] = setting.value === 'true';
        } else {
          (configMap as any)[key] = setting.value;
        }
      }
    });
    
    return configMap as SystemConfig;
  };

  // 获取系统配置
  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await systemSettingApiService.getPublicSettings();
      
      if (response.code === 200 && response.data) {
        const mappedConfig = mapSettingsToConfig(response.data);
        setConfig(mappedConfig);
      } else {
        // 如果API失败，使用默认配置
        setConfig(defaultConfig);
      }
    } catch (err: any) {
      console.error('获取系统配置失败:', err);
      setError(err.message || '获取系统配置失败');
      // 使用默认配置作为降级方案
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  // 刷新配置
  const refreshConfig = async () => {
    await fetchConfig();
  };

  // 更新配置（本地状态）
  const updateConfig = (key: keyof SystemConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 初始化时获取配置
  useEffect(() => {
    fetchConfig();
  }, []);

  // 应用主题
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // 应用主色调
      root.style.setProperty('--primary-color', config.primaryColor);
      
      // 应用主题
      if (config.theme === 'dark') {
        root.classList.add('dark');
      } else if (config.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // auto模式，根据系统偏好设置
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (config.theme === 'auto') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [config.theme, config.primaryColor]);

  // 应用favicon
  useEffect(() => {
    if (config.favicon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = config.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [config.favicon]);

  // 应用页面标题和meta信息
  useEffect(() => {
    if (config.metaTitle) {
      document.title = config.metaTitle;
    }
    
    // 更新meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription && config.metaDescription) {
      metaDescription.content = config.metaDescription;
    }
    
    // 更新meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (metaKeywords && config.metaKeywords) {
      metaKeywords.content = config.metaKeywords;
    }
  }, [config.metaTitle, config.metaDescription, config.metaKeywords]);

  const value: SystemConfigContextType = {
    config,
    loading,
    error,
    refreshConfig,
    updateConfig
  };

  return (
    <SystemConfigContext.Provider value={value}>
      {children}
    </SystemConfigContext.Provider>
  );
}

// 使用系统配置的Hook
export function useSystemConfig() {
  const context = useContext(SystemConfigContext);
  if (context === undefined) {
    throw new Error('useSystemConfig must be used within a SystemConfigProvider');
  }
  return context;
}

// 获取特定配置值的Hook
export function useConfigValue<K extends keyof SystemConfig>(key: K): SystemConfig[K] {
  const { config } = useSystemConfig();
  return config[key];
}
