'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { SearchBar } from '@/components/ui/search-bar';
import { MainLayout } from '@/components/layout/main-layout';
import type { FriendLink } from '@/types';
import Image from "next/image";

// 模拟数据 - 实际项目中这些数据应该来自API
const friendLinks: FriendLink[] = [
  {
    id: '1',
    name: 'Vue.js 官方文档',
    url: 'https://vuejs.org',
    description: 'Vue.js 官方文档，学习 Vue 框架的最佳资源',
    avatar: 'https://vuejs.org/logo.svg',
    createdAt: '2024-01-01',
    isApproved: true
  },
  {
    id: '2',
    name: 'React 官方文档',
    url: 'https://react.dev',
    description: 'React 官方文档，掌握 React 开发技能',
    avatar: 'https://react.dev/favicon.ico',
    createdAt: '2024-01-01',
    isApproved: true
  },
  {
    id: '3',
    name: 'MDN Web 文档',
    url: 'https://developer.mozilla.org',
    description: 'Mozilla 开发者网络，Web 开发权威文档',
    avatar: 'https://developer.mozilla.org/favicon.ico',
    createdAt: '2024-01-01',
    isApproved: true
  },
  {
    id: '4',
    name: 'GitHub',
    url: 'https://github.com',
    description: '全球最大的代码托管平台，开源项目的聚集地',
    avatar: 'https://github.com/favicon.ico',
    createdAt: '2024-01-01',
    isApproved: true
  },
  {
    id: '5',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: '程序员问答社区，解决技术问题的好地方',
    avatar: 'https://stackoverflow.com/favicon.ico',
    createdAt: '2024-01-01',
    isApproved: true
  },
  {
    id: '6',
    name: '掘金',
    url: 'https://juejin.cn',
    description: '中文技术社区，分享技术文章和心得',
    avatar: 'https://juejin.cn/favicon.ico',
    createdAt: '2024-01-01',
    isApproved: true
  }
];

interface FriendLinkCardProps {
  link: FriendLink;
}

function FriendLinkCard({ link }: Readonly<FriendLinkCardProps>) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-card rounded-lg border p-6 hover:shadow-md transition-all duration-300 group"
      >
        <div className="flex items-start space-x-4">
          {/* 头像 */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {link.avatar ? (
                <Image
                  src={link.avatar}
                  alt={link.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {link.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {link.name}
              </h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {link.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span className="truncate max-w-32">{link.url}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(link.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

interface LinkApplicationFormProps {
  onSubmit: (data: Omit<FriendLink, 'id' | 'createdAt' | 'isApproved'>) => void;
}

function LinkApplicationForm({ onSubmit }: Readonly<LinkApplicationFormProps>) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    avatar: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.url.trim() && formData.description.trim()) {
      onSubmit({
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        avatar: formData.avatar.trim() || undefined
      });
      setFormData({ name: '', url: '', description: '', avatar: '' });
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-4">申请友情链接</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">网站名称 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="请输入网站名称"
            className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">网站地址 *</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com"
            className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">网站描述 *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="请简要描述您的网站"
            rows={3}
            className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">网站图标 (可选)</label>
          <input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            placeholder="https://example.com/favicon.ico"
            className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            提交申请
          </motion.button>
        </div>
      </form>
      
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">申请须知：</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 网站内容健康，无违法违规内容</li>
          <li>• 网站正常运行，访问稳定</li>
          <li>• 建议在您的网站也添加我们的链接</li>
          <li>• 申请通过后我们会及时通知您</li>
        </ul>
      </div>
    </div>
  );
}

export default function LinksPage() {
  const handleLinkApplication = async (data: Omit<FriendLink, 'id' | 'createdAt' | 'isApproved'>) => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('友情链接申请:', data);
    alert('申请已提交，我们会尽快审核！');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">友情链接</h1>
          <p className="text-muted-foreground">
            与志同道合的朋友们分享优质资源，共同成长
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <Suspense fallback={<div>加载中...</div>}>
            <SearchBar placeholder="搜索友情链接..." />
          </Suspense>
        </div>

        {/* 统计信息 */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">链接统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {friendLinks.length}
                </div>
                <div className="text-sm text-muted-foreground">友情链接</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {friendLinks.filter(link => link.isApproved).length}
                </div>
                <div className="text-sm text-muted-foreground">已审核</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {friendLinks.filter(link => !link.isApproved).length}
                </div>
                <div className="text-sm text-muted-foreground">待审核</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">通过率</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 友情链接列表 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">推荐链接</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {friendLinks.map((link) => (
                <FriendLinkCard key={link.id} link={link} />
              ))}
            </div>
          </div>

          {/* 申请表单 */}
          <div className="lg:col-span-1">
            <LinkApplicationForm onSubmit={handleLinkApplication} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
