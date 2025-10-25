'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, ChevronDown } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { commentApiService } from '@/lib/api/comments';
import type { Comment } from '@/types';

interface CommentSectionProps {
  articleId: number;
}

interface CommentFormProps {
  onSubmit: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'isApproved'>) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
  articleId: number;
}

function CommentForm({ onSubmit, isSubmitting, onCancel, articleId }: CommentFormProps) {
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
        articleId: articleId,
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
  onReply: (parentId: number) => void;
  onSubmitComment?: (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'isApproved'>) => void;
  isSubmitting?: boolean;
  replyingTo?: number | null;
}

function CommentItem({ comment, onReply, onSubmitComment, isSubmitting, replyingTo }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleLike = async () => {
    try {
      await commentApiService.incrementLikeCount(comment.id);
      setIsLiked(!isLiked);
      // 更新本地状态
      // 这里可以添加本地状态更新逻辑
    } catch (err) {
      console.error('点赞失败:', err);
    }
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
              <span>{comment.likeCount + (isLiked ? 1 : 0)}</span>
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
                                  onCancel={() => onReply(0)}
                                  articleId={comment.articleId}
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
export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // 获取评论列表
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await commentApiService.getCommentsByArticleId(articleId, 0, 100);
        if (response.code === 200 && response.data && Array.isArray(response.data.content)) {
          setComments(response.data.content);
        } else {
          setError('获取评论列表失败');
          setComments([]);
        }
      } catch (err: any) {
        setError(err.message || '获取评论列表失败');
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmitComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'isApproved'>) => {
    setIsSubmitting(true);
    
    try {
      const response = await commentApiService.createComment({
        ...commentData,
        likeCount: 0,
        isApproved: false
      });
      if (response.code === 200 && response.data) {
        const newComment = response.data;
        
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
      } else {
        setError('提交评论失败');
      }
    } catch (err: any) {
      setError(err.message || '提交评论失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6">评论 ({comments.length})</h3>
        
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* 评论表单 */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <h4 className="text-lg font-semibold mb-4">发表评论</h4>
          <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} articleId={articleId} />
        </div>
        
        {/* 加载状态 */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">加载评论中...</p>
          </div>
        ) : (
          /* 评论列表 */
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>暂无评论，快来发表第一条评论吧！</p>
              </div>
            ) : (
              comments.map((comment) => (
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
                            articleId={articleId}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
