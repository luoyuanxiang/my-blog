'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, ChevronDown, MessageCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { SearchBar } from '@/components/ui/search-bar';
import { MainLayout } from '@/components/layout/main-layout';
import type { GuestbookMessage } from '@/types';

// 模拟数据 - 实际项目中这些数据应该来自API
const initialMessages: GuestbookMessage[] = [
  {
    id: '1',
    content: '这个博客设计得真不错！内容也很丰富，学到了很多东西。',
    author: '张三',
    email: 'zhangsan@example.com',
    website: 'https://zhangsan.com',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 5,
    isApproved: true,
    replies: [
      {
        id: '2',
        content: '谢谢支持！欢迎常来看看。',
        author: '博主',
        email: 'admin@example.com',
        createdAt: '2024-01-15T11:00:00Z',
        likes: 2,
        isApproved: true,
        parentId: '1'
      }
    ]
  },
  {
    id: '3',
    content: '技术文章写得很好，期待更多关于前端开发的分享！',
    author: '李四',
    email: 'lisi@example.com',
    createdAt: '2024-01-14T14:20:00Z',
    likes: 3,
    isApproved: true
  },
  {
    id: '4',
    content: '请问博主，关于 React 18 的并发特性，有什么推荐的深入学习资源吗？',
    author: '王五',
    email: 'wangwu@example.com',
    website: 'https://wangwu.dev',
    createdAt: '2024-01-13T09:15:00Z',
    likes: 1,
    isApproved: true,
    replies: [
      {
        id: '5',
        content: '推荐看看 React 官方文档和 Dan Abramov 的博客，里面有很多深入的内容。',
        author: '博主',
        email: 'admin@example.com',
        createdAt: '2024-01-13T10:30:00Z',
        likes: 4,
        isApproved: true,
        parentId: '4'
      }
    ]
  }
];

interface MessageFormProps {
  onSubmit: (message: Omit<GuestbookMessage, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => void;
  isSubmitting: boolean;
  replyingTo?: number;
  onCancelReply?: () => void;
}

function MessageForm({ onSubmit, isSubmitting, replyingTo, onCancelReply }: MessageFormProps) {
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    email: '',
    website: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.content.trim() && formData.author.trim() && formData.email.trim()) {
      onSubmit({
        content: formData.content.trim(),
        author: formData.author.trim(),
        email: formData.email.trim(),
        website: formData.website.trim() || undefined,
        parentId: replyingTo?.toString()
      });
      setFormData({ content: '', author: '', email: '', website: '' });
      if (onCancelReply) onCancelReply();
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">
        {replyingTo ? '回复留言' : '留下你的足迹'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder={replyingTo ? '写下你的回复...' : '分享你的想法、建议或问题...'}
            className="w-full p-4 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={4}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="姓名 *"
              className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="邮箱 *"
              className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="网站 (可选)"
            className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          {replyingTo && onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
            >
              取消回复
            </button>
          )}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '提交中...' : (replyingTo ? '回复' : '发表留言')}
          </motion.button>
        </div>
      </form>
    </div>
  );
}

interface MessageItemProps {
  message: GuestbookMessage;
  onReply: (messageId: number) => void;
}

function MessageItem({ message, onReply }: MessageItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // 这里应该调用 API 来更新点赞数
  };

  return (
    <motion.div 
      className="bg-card rounded-lg border p-6 mb-6"
      whileHover={{ 
        y: -4,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start space-x-3">
        <motion.div 
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {message.author.charAt(0).toUpperCase()}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">{message.author}</span>
            {message.website && (
              <a
                href={message.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                {message.website}
              </a>
            )}
            <span className="text-sm text-muted-foreground">
              {formatDateTime(message.createdAt)}
            </span>
          </div>
          
          <div className="text-foreground mb-4">
            {message.content}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <motion.button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-primary transition-colors ${
                isLiked ? 'text-primary' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </motion.div>
              <span>{message.likes + (isLiked ? 1 : 0)}</span>
            </motion.button>
            <motion.button
              onClick={() => onReply(message.id)}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Reply className="h-4 w-4" />
              <span>回复</span>
            </motion.button>
          </div>
          
          {/* 回复 */}
          {message.replies && message.replies.length > 0 && (
            <div className="mt-4">
              <motion.button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  animate={{ rotate: showReplies ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
                <span>{message.replies.length} 条回复</span>
              </motion.button>
              
              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 ml-6"
                  >
                    {message.replies.map((reply) => (
                      <MessageItem key={reply.id} message={reply} onReply={onReply} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function GuestbookPage() {
  const [messages, setMessages] = useState<GuestbookMessage[]>(initialMessages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleSubmitMessage = async (messageData: Omit<GuestbookMessage, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => {
    setIsSubmitting(true);
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMessage: GuestbookMessage = {
      ...messageData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true
    };
    
    if (replyingTo) {
      // 添加回复
      setMessages(prev => prev.map(message => 
        message.id === replyingTo 
          ? { ...message, replies: [...(message.replies || []), newMessage] }
          : message
      ));
      setReplyingTo(null);
    } else {
      // 添加新留言
      setMessages(prev => [newMessage, ...prev]);
    }
    
    setIsSubmitting(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">留言板</h1>
          <p className="text-muted-foreground">
            在这里分享你的想法、建议或问题，让我们一起交流成长
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <SearchBar placeholder="搜索留言..." />
        </div>

        {/* 统计信息 */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">留言统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {messages.length}
                </div>
                <div className="text-sm text-muted-foreground">总留言数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {messages.reduce((total, message) => total + (message.replies?.length || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">总回复数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {messages.reduce((total, message) => total + message.likes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总点赞数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {messages.filter(message => message.website).length}
                </div>
                <div className="text-sm text-muted-foreground">有网站链接</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 留言列表 */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <MessageCircle className="h-6 w-6" />
              <h2 className="text-2xl font-bold">留言列表</h2>
              <span className="text-sm text-muted-foreground">({messages.length} 条)</span>
            </div>
            
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageItem 
                  key={message.id} 
                  message={message} 
                  onReply={setReplyingTo}
                />
              ))}
            </div>
          </div>

          {/* 留言表单 */}
          <div className="lg:col-span-1">
            <MessageForm 
              onSubmit={handleSubmitMessage} 
              isSubmitting={isSubmitting}
              replyingTo={replyingTo || undefined}
              onCancelReply={() => setReplyingTo(null)}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
