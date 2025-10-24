'use client';

import { motion } from 'framer-motion';
import { FileText, FolderOpen, Tag, MessageCircle, Eye, Heart } from 'lucide-react';
import type { BlogStats } from '@/types';

interface BlogStatsProps {
  stats: BlogStats;
}

export function BlogStats({ stats }: BlogStatsProps) {
  const statItems = [
    {
      label: '文章总数',
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      label: '分类数量',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'text-green-500',
    },
    {
      label: '标签数量',
      value: stats.totalTags,
      icon: Tag,
      color: 'text-purple-500',
    },
    {
      label: '评论总数',
      value: stats.totalComments,
      icon: MessageCircle,
      color: 'text-orange-500',
    },
    {
      label: '总浏览量',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-red-500',
    },
    {
      label: '总点赞数',
      value: stats.totalLikes,
      icon: Heart,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-card rounded-lg border p-6 text-center hover:shadow-md transition-shadow"
        >
          <div className={`${item.color} mb-2`}>
            <item.icon className="h-8 w-8 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {item.value}
          </div>
          <div className="text-sm text-muted-foreground">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
