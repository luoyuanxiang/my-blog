'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, ChevronDown } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { Comment } from '@/types';

interface CommentSectionProps {
  articleId: string;
}

interface CommentFormProps {
  onSubmit: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

function CommentForm({ onSubmit, isSubmitting, onCancel }: CommentFormProps) {
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
        website: formData.website.trim() || undefined
      });
      setFormData({ content: '', author: '', email: '', website: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="写下你的评论..."
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
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
          >
            取消
          </button>
        )}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '提交中...' : '发表评论'}
        </motion.button>
      </div>
    </form>
  );
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onSubmitComment?: (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => void;
  isSubmitting?: boolean;
  replyingTo?: string | null;
}

function CommentItem({ comment, onReply, onSubmitComment, isSubmitting, replyingTo }: CommentItemProps) {
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
          {comment.author.charAt(0).toUpperCase()}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">{comment.author}</span>
            {comment.website && (
              <a
                href={comment.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                {comment.website}
              </a>
            )}
            <span className="text-sm text-muted-foreground">
              {formatDateTime(comment.createdAt)}
            </span>
          </div>
          
          <div className="text-foreground mb-4">
            {comment.content}
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
              <span>{comment.likes + (isLiked ? 1 : 0)}</span>
            </motion.button>
            <motion.button
              onClick={() => onReply(comment.id)}
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
          {comment.replies && comment.replies.length > 0 && (
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
                <span>{comment.replies.length} 条回复</span>
              </motion.button>
              
              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <CommentItem 
                          comment={reply} 
                          onReply={onReply}
                          onSubmitComment={onSubmitComment}
                          isSubmitting={isSubmitting}
                          replyingTo={replyingTo}
                        />
                        
                        {/* 子级回复表单 */}
                        <AnimatePresence>
                          {replyingTo === reply.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="ml-8 mt-4"
                            >
                              <div className="bg-muted/50 rounded-lg border p-4">
                                <h5 className="text-sm font-semibold mb-3 text-foreground">回复 @{reply.author}</h5>
                                <CommentForm 
                                  onSubmit={onSubmitComment || (() => {})} 
                                  isSubmitting={isSubmitting || false}
                                  onCancel={() => onReply('')}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CommentSection({ articleId: _articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: '这篇文章写得很好，学到了很多新知识！',
      author: '张三',
      email: 'zhangsan@example.com',
      website: 'https://zhangsan.com',
      createdAt: '2024-01-15T10:30:00Z',
      likes: 5,
      isApproved: true,
      replies: [
        {
          id: '2',
          content: '同感！作者的技术水平很高。',
          author: '李四',
          email: 'lisi@example.com',
          createdAt: '2024-01-15T11:00:00Z',
          likes: 2,
          isApproved: true,
          parentId: '1'
        }
      ]
    },
    {
      id: '3',
      content: '感谢分享，期待更多这样的好文章！',
      author: '王五',
      email: 'wangwu@example.com',
      createdAt: '2024-01-15T14:20:00Z',
      likes: 3,
      isApproved: true
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => {
    setIsSubmitting(true);
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true
    };
    
    if (replyingTo) {
      // 添加回复
      setComments(prev => prev.map(comment => 
        comment.id === replyingTo 
          ? { ...comment, replies: [...(comment.replies || []), newComment] }
          : comment
      ));
      setReplyingTo(null);
    } else {
      // 添加新评论
      setComments(prev => [...prev, newComment]);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6">评论 ({comments.length})</h3>
        
        {/* 评论表单 */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <h4 className="text-lg font-semibold mb-4">发表评论</h4>
          <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
        </div>
        
        {/* 评论列表 */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem 
                comment={comment} 
                onReply={setReplyingTo}
                onSubmitComment={handleSubmitComment}
                isSubmitting={isSubmitting}
                replyingTo={replyingTo}
              />
              
              {/* 回复表单 */}
              <AnimatePresence>
                {replyingTo === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-8 mt-4"
                  >
                    <div className="bg-muted/50 rounded-lg border p-4">
                      <h5 className="text-sm font-semibold mb-3 text-foreground">回复 @{comment.author}</h5>
                      <CommentForm 
                        onSubmit={handleSubmitComment} 
                        isSubmitting={isSubmitting}
                        onCancel={() => setReplyingTo(null)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
