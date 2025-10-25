'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Eye, 
  Heart, 
  Tag, 
  FolderOpen, 
  MessageSquare, 
  Link as LinkIcon, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { dashboardApiService, type DashboardStats } from '@/lib/api/dashboard';

/**
 * 统计卡片组件
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 仪表盘页面组件
 */
export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApiService.getDashboardStats();
        if (response.code === 200) {
          setStats(response.data);
        } else {
          setError('获取统计数据失败');
        }
      } catch (err: any) {
        setError(err.message || '获取统计数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 快速操作处理函数
  const handleQuickAction = (action: string) => {
    console.log('快速操作按钮被点击:', action);
    try {
      switch (action) {
        case 'create-article':
          console.log('跳转到创建文章页面');
          router.push('/admin/articles/create');
          break;
        case 'review-comments':
          console.log('跳转到评论管理页面');
          router.push('/admin/comments');
          break;
        case 'manage-links':
          console.log('跳转到友链管理页面');
          router.push('/admin/links');
          break;
        default:
          console.log('未知操作:', action);
      }
    } catch (error) {
      console.error('快速操作执行失败:', error);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">仪表盘</h1>
          <p className="text-gray-600">欢迎回来，这里是您的博客管理概览</p>
        </motion.div>

        {/* 统计卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 文章统计 */}
          <StatCard
            title="总文章数"
            value={stats.totalArticles}
            icon={<FileText className="w-6 h-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="已发布"
            value={stats.publishedArticles}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="草稿"
            value={stats.draftArticles}
            icon={<Clock className="w-6 h-6 text-white" />}
            color="bg-yellow-500"
          />
          <StatCard
            title="置顶"
            value={stats.pinnedArticles}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            color="bg-purple-500"
          />
        </div>

        {/* 第二行统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总浏览量"
            value={stats.totalViews}
            icon={<Eye className="w-6 h-6 text-white" />}
            color="bg-indigo-500"
          />
          <StatCard
            title="总点赞数"
            value={stats.totalLikes}
            icon={<Heart className="w-6 h-6 text-white" />}
            color="bg-pink-500"
          />
          <StatCard
            title="分类数"
            value={stats.totalCategories}
            icon={<FolderOpen className="w-6 h-6 text-white" />}
            color="bg-orange-500"
          />
          <StatCard
            title="标签数"
            value={stats.totalTags}
            icon={<Tag className="w-6 h-6 text-white" />}
            color="bg-teal-500"
          />
        </div>

        {/* 第三行统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总评论数"
            value={stats.totalComments}
            icon={<MessageSquare className="w-6 h-6 text-white" />}
            color="bg-cyan-500"
          />
          <StatCard
            title="已审核评论"
            value={stats.approvedComments}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="待审核评论"
            value={stats.pendingComments}
            icon={<AlertCircle className="w-6 h-6 text-white" />}
            color="bg-red-500"
          />
          <StatCard
            title="友链数"
            value={stats.totalFriendLinks}
            icon={<LinkIcon className="w-6 h-6 text-white" />}
            color="bg-blue-600"
          />
        </div>

        {/* 第四行统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="留言数"
            value={stats.totalGuestbookMessages}
            icon={<MessageSquare className="w-6 h-6 text-white" />}
            color="bg-violet-500"
          />
          <StatCard
            title="用户数"
            value={stats.totalUsers}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-gray-500"
          />
          <StatCard
            title="今日文章"
            value={stats.todayArticles}
            icon={<FileText className="w-6 h-6 text-white" />}
            color="bg-emerald-500"
          />
          <StatCard
            title="今日评论"
            value={stats.todayComments}
            icon={<MessageSquare className="w-6 h-6 text-white" />}
            color="bg-rose-500"
          />
        </div>

        {/* 快速操作区域 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
          
          {/* 测试按钮 */}
          <div className="mb-4">
            <button 
              onClick={() => console.log('测试按钮被点击')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              测试按钮
            </button>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <button 
               onClick={() => handleQuickAction('create-article')}
               className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer border border-blue-200 hover:border-blue-300 relative z-10"
               type="button"
             >
               <FileText className="w-5 h-5 text-blue-600 mr-2" />
               <span className="text-blue-600 font-medium">写文章</span>
             </button>
             <button 
               onClick={() => handleQuickAction('review-comments')}
               className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer border border-green-200 hover:border-green-300 relative z-10"
               type="button"
             >
               <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
               <span className="text-green-600 font-medium">审核评论</span>
             </button>
             <button 
               onClick={() => handleQuickAction('manage-links')}
               className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer border border-purple-200 hover:border-purple-300 relative z-10"
               type="button"
             >
               <LinkIcon className="w-5 h-5 text-purple-600 mr-2" />
               <span className="text-purple-600 font-medium">管理友链</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
