'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, ChevronDown, MessageCircle, X, ChevronUp, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { SearchBar } from '@/components/ui/search-bar';
import { MainLayout } from '@/components/layout/main-layout';
import { guestbookApiService } from '@/lib/api/guestbook';
import { useSystemConfig } from '@/lib/hooks/use-system-config';
import type { GuestbookMessage } from '@/types';

// 弹幕组件
interface DanmakuItem {
  id: string;
  content: string;
  author: string;
  color: string;
  speed: number;
  top: number;
}

interface DanmakuProps {
  messages: GuestbookMessage[];
  isActive: boolean;
}

function Danmaku({ messages, isActive }: DanmakuProps) {
  const [danmakuItems, setDanmakuItems] = useState<DanmakuItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 生成弹幕颜色
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];

  // 创建弹幕项
  const createDanmakuItem = (message: GuestbookMessage): DanmakuItem => {
    const containerHeight = containerRef.current?.clientHeight || 400;
    const maxTop = Math.max(0, containerHeight - 50);
    
    return {
      id: `${message.id}-${Date.now()}`,
      content: message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content,
      author: message.author,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 0.5, // 0.5-1.0 秒
      top: Math.random() * maxTop
    };
  };

  // 启动弹幕
  useEffect(() => {
    if (!isActive || messages.length === 0) {
      setDanmakuItems([]); // 清空弹幕
      return;
    }

    const interval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const newDanmaku = createDanmakuItem(randomMessage);
      
      setDanmakuItems(prev => [...prev, newDanmaku]);

      // 移除过期的弹幕
      setTimeout(() => {
        setDanmakuItems(prev => prev.filter(item => item.id !== newDanmaku.id));
      }, 15000); // 15秒后移除
    }, 1500); // 每1.5秒添加一个弹幕

    return () => clearInterval(interval);
  }, [isActive, messages]);

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
    >
      {danmakuItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ x: '100vw', opacity: 0 }}
          animate={{ 
            x: '-100vw', 
            opacity: [0, 1, 1, 0],
            transition: { 
              duration: item.speed * 15, // 转换为秒
              ease: 'linear',
              opacity: {
                times: [0, 0.1, 0.9, 1],
                duration: item.speed * 15
              }
            }
          }}
          className="absolute whitespace-nowrap text-sm font-medium px-3 py-2 rounded-full shadow-lg backdrop-blur-sm"
          style={{
            top: `${item.top}px`,
            backgroundColor: `${item.color}cc`, // 添加透明度
            color: 'white',
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <span className="font-semibold">{item.author}:</span> {item.content}
        </motion.div>
      ))}
    </div>
  );
}

interface MessageFormProps {
  onSubmit: (message: Omit<GuestbookMessage, 'id' | 'createdAt' | 'likeCount' | 'isApproved'>) => void;
  isSubmitting: boolean;
  submitSuccess?: boolean;
  replyingTo?: number;
  onCancelReply?: () => void;
}

function MessageForm({ onSubmit, isSubmitting, submitSuccess = false, replyingTo, onCancelReply }: MessageFormProps) {
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
      
      {/* 成功提示 */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            留言提交成功，等待审核通过后显示！
          </div>
        </motion.div>
      )}
      
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
  onLike: (messageId: string) => void;
  onOpenComments: (message: GuestbookMessage) => void;
}

function MessageItem({ message, onReply, onLike, onOpenComments }: MessageItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(message.id);
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
              <span>{message.likeCount + (isLiked ? 1 : 0)}</span>
            </motion.button>
            <motion.button
              onClick={() => onReply(Number(message.id))}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Reply className="h-4 w-4" />
              <span>回复</span>
            </motion.button>
            <motion.button
              onClick={() => onOpenComments(message)}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>评论 ({message.replies?.length || 0})</span>
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
                      <MessageItem key={reply.id} message={reply} onReply={onReply} onLike={onLike} onOpenComments={onOpenComments} />
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

interface CommentModalProps {
  message: GuestbookMessage;
  isOpen: boolean;
  onClose: () => void;
  onReply: (messageId: number) => void;
  onLike: (messageId: string) => void;
}

function CommentModal({ message, isOpen, onClose, onReply, onLike }: CommentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // 强制检查滚动状态
  const forceCheckScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    console.log('Force check scroll:', { 
      scrollTop, 
      scrollHeight, 
      clientHeight, 
      canScroll: scrollHeight > clientHeight,
      repliesCount: message.replies?.length || 0
    });
    
    const canScroll = scrollHeight > clientHeight;
    setShowScrollTop(canScroll && scrollTop > 100);
    setShowScrollBottom(canScroll && scrollTop < scrollHeight - clientHeight - 100);
  };

  // 监听滚动事件
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      console.log('CommentModal Scroll info:', { 
        scrollTop, 
        scrollHeight, 
        clientHeight, 
        canScroll: scrollHeight > clientHeight,
        repliesCount: message.replies?.length || 0
      });
      
      // 检查是否可以滚动
      const canScroll = scrollHeight > clientHeight;
      
      setShowScrollTop(canScroll && scrollTop > 100);
      setShowScrollBottom(canScroll && scrollTop < scrollHeight - clientHeight - 100);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    
    // 延迟再次检查，确保内容已加载
    const timeoutId = setTimeout(handleScroll, 100);
    const timeoutId2 = setTimeout(handleScroll, 500); // 额外延迟检查

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [message.replies, isOpen]); // 依赖回复数据变化和弹窗状态

  // 弹窗打开时强制检查滚动状态
  useEffect(() => {
    if (isOpen) {
      // 延迟检查，确保DOM已渲染
      const timeoutId = setTimeout(forceCheckScroll, 100);
      const timeoutId2 = setTimeout(forceCheckScroll, 300);
      const timeoutId3 = setTimeout(forceCheckScroll, 500);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
        clearTimeout(timeoutId3);
      };
    }
  }, [isOpen, message.replies]);

  // 滚动到顶部
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 滚动到底部
  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  // 处理回复提交
  const handleSubmitReply = async (replyData: Omit<GuestbookMessage, 'id' | 'createdAt' | 'likeCount' | 'isApproved'>) => {
    try {
      setIsSubmitting(true);
      
      const createData = {
        content: replyData.content,
        author: replyData.author,
        email: replyData.email,
        website: replyData.website,
        parentId: parseInt(message.id), // 回复当前留言
        isApproved: false,
        likeCount: 0,
        ipAddress: '',
        userAgent: ''
      };
      
      const response = await guestbookApiService.createMessage(createData as any);
      
      if (response.code === 200) {
        setSubmitSuccess(true);
        setReplyingTo(null);
        // 3秒后自动隐藏成功提示
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        console.error('回复提交失败');
      }
    } catch (err: any) {
      console.error('回复提交失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-lg border w-full max-w-2xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {message.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold">{message.author}</h3>
              <p className="text-sm text-muted-foreground">{formatDateTime(message.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 原始留言内容 */}
        <div className="p-4 border-b bg-muted/30">
          <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
          <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
            <button
              onClick={() => onLike(message.id)}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>{message.likeCount}</span>
            </button>
            <span>{message.replies?.length || 0} 条回复</span>
          </div>
        </div>

        {/* 滚动容器 */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <div
            ref={scrollContainerRef}
            className="h-full min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="p-4 space-y-4">
              {message.replies && message.replies.length > 0 ? (
                message.replies.map((reply) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background rounded-lg border p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xs">
                        {reply.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-sm">{reply.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">
                          {reply.content}
                        </p>
                        <button
                          onClick={() => onLike(reply.id)}
                          className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Heart className="h-3 w-3" />
                          <span>{reply.likeCount}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>暂无回复</p>
                </div>
              )}
            </div>
          </div>

          {/* 滚动按钮 */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className="absolute top-4 right-4 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10"
                title="滚动到顶部"
              >
                <ChevronUp className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showScrollBottom && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10"
                title="滚动到底部"
              >
                <ChevronDownIcon className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* 回复表单 */}
        <div className="border-t p-4">
          {replyingTo ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">回复 {message.author}</h4>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  取消
                </button>
              </div>
              <MessageForm
                onSubmit={handleSubmitReply}
                isSubmitting={isSubmitting}
                submitSuccess={submitSuccess}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>
          ) : (
            <button
              onClick={() => setReplyingTo(parseInt(message.id))}
              className="w-full p-3 border border-dashed border-muted-foreground rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center space-x-2"
            >
              <Reply className="h-4 w-4" />
              <span>回复这条留言</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GuestbookPage() {
  const { config } = useSystemConfig();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<GuestbookMessage | null>(null);
  const [danmakuActive, setDanmakuActive] = useState(false);

  // 获取留言数据
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取已审核通过的留言
        const response = await guestbookApiService.getApprovedMessages(0, 1000);
        
        if (response.code === 200 && response.data && response.data.content) {
          setMessages(response.data.content);
        } else {
          // 如果API失败，使用示例数据
          const sampleMessages: GuestbookMessage[] = [
            {
              id: '1',
              content: '这个博客设计得真不错！内容也很丰富，学到了很多东西。',
              author: '张三',
              email: 'zhangsan@example.com',
              website: 'https://zhangsan.com',
              createdAt: '2024-01-15T10:30:00Z',
              likeCount: 5,
              isApproved: true,
              replies: [
                {
                  id: '2',
                  content: '谢谢支持！欢迎常来看看。',
                  author: '博主',
                  email: 'admin@example.com',
                  createdAt: '2024-01-15T11:00:00Z',
                  likeCount: 2,
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
              likeCount: 3,
              isApproved: true
            },
            {
              id: '4',
              content: '请问博主，关于 React 18 的并发特性，有什么推荐的深入学习资源吗？',
              author: '王五',
              email: 'wangwu@example.com',
              website: 'https://wangwu.dev',
              createdAt: '2024-01-13T09:15:00Z',
              likeCount: 1,
              isApproved: true,
              replies: [
                {
                  id: '5',
                  content: '推荐看看 React 官方文档和 Dan Abramov 的博客，里面有很多深入的内容。',
                  author: '博主',
                  email: 'admin@example.com',
                  createdAt: '2024-01-13T10:30:00Z',
                  likeCount: 4,
                  isApproved: true,
                  parentId: '4'
                }
              ]
            }
          ];
          setMessages(sampleMessages);
        }
      } catch (err: any) {
        console.error('获取留言数据失败:', err);
        setError(err.message || '获取留言数据失败');
        
        // 使用示例数据作为降级方案
        const sampleMessages: GuestbookMessage[] = [
          {
            id: '1',
            content: '这个博客设计得真不错！内容也很丰富，学到了很多东西。',
            author: '张三',
            email: 'zhangsan@example.com',
            website: 'https://zhangsan.com',
            createdAt: '2024-01-15T10:30:00Z',
            likeCount: 5,
            isApproved: true,
            replies: [
              {
                id: '2',
                content: '谢谢支持！欢迎常来看看。',
                author: '博主',
                email: 'admin@example.com',
                createdAt: '2024-01-15T11:00:00Z',
                likeCount: 2,
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
            likeCount: 3,
            isApproved: true
          },
          {
            id: '4',
            content: '请问博主，关于 React 18 的并发特性，有什么推荐的深入学习资源吗？',
            author: '王五',
            email: 'wangwu@example.com',
            website: 'https://wangwu.dev',
            createdAt: '2024-01-13T09:15:00Z',
            likeCount: 1,
            isApproved: true,
            replies: [
              {
                id: '5',
                content: '推荐看看 React 官方文档和 Dan Abramov 的博客，里面有很多深入的内容。',
                author: '博主',
                email: 'admin@example.com',
                createdAt: '2024-01-13T10:30:00Z',
                likeCount: 4,
                isApproved: true,
                parentId: '4'
              }
            ]
          }
        ];
        setMessages(sampleMessages);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // 处理留言提交
  const handleSubmitMessage = async (messageData: Omit<GuestbookMessage, 'id' | 'createdAt' | 'likeCount' | 'isApproved'>) => {
    try {
      setIsSubmitting(true);
      
      // 调用API创建留言
      const createData = {
        content: messageData.content,
        author: messageData.author,
        email: messageData.email,
        website: messageData.website,
        parentId: messageData.parentId ? parseInt(messageData.parentId) : undefined,
        isApproved: false, // 新留言默认未审核
        likeCount: 0,
        ipAddress: '', // 后端会自动获取
        userAgent: '' // 后端会自动获取
      };
      
      const response = await guestbookApiService.createMessage(createData as any);
      
      if (response.code === 200) {
        // 创建成功，添加到本地状态（标记为未审核）
        const newMessage: GuestbookMessage = {
          ...messageData,
          id: response.data?.id?.toString() || Date.now().toString(),
          createdAt: new Date().toISOString(),
          likeCount: 0,
          isApproved: false
        };
        
        if (replyingTo) {
          // 添加回复
          setMessages(prev => prev.map(message => 
            message.id === replyingTo.toString() 
              ? { ...message, replies: [...(message.replies || []), newMessage] }
              : message
          ));
          setReplyingTo(null);
        } else {
          // 添加新留言
          setMessages(prev => [newMessage, ...prev]);
        }
        
        setSubmitSuccess(true);
        // 3秒后自动隐藏成功提示
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setError('留言提交失败，请稍后重试');
      }
    } catch (err: any) {
      console.error('留言提交失败:', err);
      setError('留言提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理点赞
  const handleLike = async (messageId: string) => {
    try {
      const response = await guestbookApiService.incrementLikeCount(messageId);
      if (response.code === 200) {
        // 更新本地状态
        setMessages(prev => prev.map(message => {
          if (message.id === messageId) {
            return { ...message, likeCount: message.likeCount + 1 };
          }
          // 检查回复
          if (message.replies) {
            return {
              ...message,
              replies: message.replies.map(reply => 
                reply.id === messageId ? { ...reply, likeCount: reply.likeCount + 1 } : reply
              )
            };
          }
          return message;
        }));
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  // 打开评论弹窗
  const openCommentModal = (message: GuestbookMessage) => {
    setSelectedMessage(message);
    setCommentModalOpen(true);
  };

  // 关闭评论弹窗
  const closeCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedMessage(null);
  };

  // 过滤留言数据
  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.website && message.website.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <p className="text-muted-foreground">已显示示例数据</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">留言板</h1>
            <motion.button
              onClick={() => setDanmakuActive(!danmakuActive)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                danmakuActive 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{danmakuActive ? '关闭弹幕' : '开启弹幕'}</span>
            </motion.button>
          </div>
          <p className="text-muted-foreground">
            在这里分享你的想法、建议或问题，与{config.bloggerName}一起交流成长
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <SearchBar 
            placeholder="搜索留言..." 
            onSearch={setSearchTerm}
          />
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
                  {messages.reduce((total, message) => total + (message.likeCount || 0), 0)}
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
              <span className="text-sm text-muted-foreground">({filteredMessages.length} 条)</span>
            </div>
            
            <div className="space-y-6">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <MessageItem 
                    key={message.id} 
                    message={message} 
                    onReply={setReplyingTo}
                    onLike={handleLike}
                    onOpenComments={openCommentModal}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? '没有找到匹配的留言' : '暂无留言数据'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 留言表单 */}
          <div className="lg:col-span-1">
            <MessageForm 
              onSubmit={handleSubmitMessage} 
              isSubmitting={isSubmitting}
              submitSuccess={submitSuccess}
              replyingTo={replyingTo || undefined}
              onCancelReply={() => setReplyingTo(null)}
            />
          </div>
        </div>
      </div>

      {/* 评论弹窗 */}
      <AnimatePresence>
        {commentModalOpen && selectedMessage && (
          <CommentModal
            message={selectedMessage}
            isOpen={commentModalOpen}
            onClose={closeCommentModal}
            onReply={setReplyingTo}
            onLike={handleLike}
          />
        )}
      </AnimatePresence>

      {/* 弹幕组件 */}
      <Danmaku messages={filteredMessages} isActive={danmakuActive} />
    </MainLayout>
  );
}
