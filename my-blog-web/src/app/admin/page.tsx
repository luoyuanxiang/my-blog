'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  Tag, 
  FolderOpen, 
  Link as LinkIcon, 
  MessageSquare, 
  Eye, 
  Heart, 
  TrendingUp
} from 'lucide-react';

// 模拟统计数据
const stats = [
  {
    name: '总文章数',
    value: '45',
    change: '+12%',
    changeType: 'positive',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: '总标签数',
    value: '25',
    change: '+8%',
    changeType: 'positive',
    icon: Tag,
    color: 'from-green-500 to-green-600',
  },
  {
    name: '总分类数',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: FolderOpen,
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: '友链数量',
    value: '12',
    change: '+3',
    changeType: 'positive',
    icon: LinkIcon,
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: '总评论数',
    value: '234',
    change: '+15%',
    changeType: 'positive',
    icon: MessageSquare,
    color: 'from-pink-500 to-pink-600',
  },
  {
    name: '总浏览量',
    value: '12.5K',
    change: '+23%',
    changeType: 'positive',
    icon: Eye,
    color: 'from-indigo-500 to-indigo-600',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'article',
    title: '发布了新文章：Next.js 14 新特性详解',
    time: '2 小时前',
    icon: FileText,
    color: 'text-blue-500',
  },
  {
    id: 2,
    type: 'comment',
    title: '收到新评论：React 18 并发特性深度解析',
    time: '4 小时前',
    icon: MessageSquare,
    color: 'text-green-500',
  },
  {
    id: 3,
    type: 'tag',
    title: '创建了新标签：TypeScript',
    time: '6 小时前',
    icon: Tag,
    color: 'text-purple-500',
  },
  {
    id: 4,
    type: 'link',
    title: '添加了新友链：技术博客',
    time: '1 天前',
    icon: LinkIcon,
    color: 'text-orange-500',
  },
];

const topArticles = [
  {
    id: 1,
    title: 'Next.js 14 新特性详解',
    views: 1250,
    likes: 89,
    comments: 12,
    publishedAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'React 18 并发特性深度解析',
    views: 980,
    likes: 67,
    comments: 8,
    publishedAt: '2024-01-10',
  },
  {
    id: 3,
    title: 'TypeScript 5.0 新特性介绍',
    views: 756,
    likes: 45,
    comments: 5,
    publishedAt: '2024-01-05',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600">欢迎回来，这里是您的博客管理概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近活动</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 热门文章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">热门文章</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {topArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {article.title}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Eye className="h-3 w-3" />
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Heart className="h-3 w-3" />
                      <span>{article.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MessageSquare className="h-3 w-3" />
                      <span>{article.comments}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-4">
                  {article.publishedAt}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 快速操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">写文章</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">管理标签</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">管理分类</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">审核评论</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
