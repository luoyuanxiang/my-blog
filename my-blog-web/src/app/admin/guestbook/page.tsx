'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  EyeOff,
  Heart,
  Reply
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/components/ui/pagination';
import { guestbookApiService } from '@/lib/api/guestbook';
import type { GuestbookMessage } from '@/types';

export default function AdminGuestbookPage() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<GuestbookMessage | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingMessage, setRejectingMessage] = useState<GuestbookMessage | null>(null);

  // 分页状态
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    currentItems: paginatedMessages
  } = usePagination(messages, 10);

  // 获取留言数据
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (filterStatus === 'approved') {
          response = await guestbookApiService.getApprovedMessages(0, 1000);
        } else if (filterStatus === 'pending') {
          response = await guestbookApiService.getPendingMessages(0, 1000);
        } else {
          response = await guestbookApiService.getAllMessages();
        }

        if (response.code === 200 && response.data) {
          setMessages(response.data);
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
              likes: 5,
              isApproved: true,
              ipAddress: '192.168.1.1',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              updatedAt: '2024-01-15T10:30:00Z'
            },
            {
              id: '2',
              content: '技术文章写得很好，期待更多关于前端开发的分享！',
              author: '李四',
              email: 'lisi@example.com',
              createdAt: '2024-01-14T14:20:00Z',
              likes: 3,
              isApproved: false,
              ipAddress: '192.168.1.2',
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              updatedAt: '2024-01-14T14:20:00Z'
            },
            {
              id: '3',
              content: '请问博主，关于 React 18 的并发特性，有什么推荐的深入学习资源吗？',
              author: '王五',
              email: 'wangwu@example.com',
              website: 'https://wangwu.dev',
              createdAt: '2024-01-13T09:15:00Z',
              likes: 1,
              isApproved: true,
              ipAddress: '192.168.1.3',
              userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
              updatedAt: '2024-01-13T09:15:00Z'
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
            likes: 5,
            isApproved: true,
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            updatedAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            content: '技术文章写得很好，期待更多关于前端开发的分享！',
            author: '李四',
            email: 'lisi@example.com',
            createdAt: '2024-01-14T14:20:00Z',
            likes: 3,
            isApproved: false,
            ipAddress: '192.168.1.2',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            updatedAt: '2024-01-14T14:20:00Z'
          },
          {
            id: '3',
            content: '请问博主，关于 React 18 的并发特性，有什么推荐的深入学习资源吗？',
            author: '王五',
            email: 'wangwu@example.com',
            website: 'https://wangwu.dev',
            createdAt: '2024-01-13T09:15:00Z',
            likes: 1,
            isApproved: true,
            ipAddress: '192.168.1.3',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            updatedAt: '2024-01-13T09:15:00Z'
          }
        ];
        setMessages(sampleMessages);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [filterStatus]);

  // 过滤留言数据
  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.website && message.website.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 处理审核通过
  const handleApprove = async (message: GuestbookMessage) => {
    try {
      const response = await guestbookApiService.approveMessage(message.id);
      if (response.code === 200) {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, isApproved: true } : m
        ));
      }
    } catch (err) {
      console.error('审核通过失败:', err);
    }
  };

  // 处理拒绝
  const handleReject = (message: GuestbookMessage) => {
    setRejectingMessage(message);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectingMessage) return;
    
    try {
      const response = await guestbookApiService.rejectMessage(rejectingMessage.id);
      if (response.code === 200) {
        setMessages(prev => prev.filter(m => m.id !== rejectingMessage.id));
      }
    } catch (err) {
      console.error('拒绝留言失败:', err);
    } finally {
      setShowRejectModal(false);
      setRejectingMessage(null);
    }
  };

  // 处理删除
  const handleDelete = (message: GuestbookMessage) => {
    setDeletingMessage(message);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingMessage) return;
    
    try {
      const response = await guestbookApiService.deleteMessage(deletingMessage.id);
      if (response.code === 200) {
        setMessages(prev => prev.filter(m => m.id !== deletingMessage.id));
      }
    } catch (err) {
      console.error('删除留言失败:', err);
    } finally {
      setShowDeleteModal(false);
      setDeletingMessage(null);
    }
  };

  // 处理点赞
  const handleLike = async (message: GuestbookMessage) => {
    try {
      const response = await guestbookApiService.incrementLikeCount(message.id);
      if (response.code === 200) {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, likeCount: m.likeCount + 1 } : m
        ));
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <p className="text-muted-foreground">已显示示例数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">留言板管理</h1>
        <p className="text-muted-foreground">管理用户留言，审核和回复留言</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索留言..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'approved' | 'pending')}
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">全部留言</option>
            <option value="approved">已审核</option>
            <option value="pending">待审核</option>
          </select>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{messages.length}</div>
              <div className="text-sm text-muted-foreground">总留言数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{messages.filter(m => m.isApproved).length}</div>
              <div className="text-sm text-muted-foreground">已审核</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{messages.filter(m => !m.isApproved).length}</div>
              <div className="text-sm text-muted-foreground">待审核</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{messages.reduce((total, m) => total + (m.likeCount || 0), 0)}</div>
              <div className="text-sm text-muted-foreground">总点赞数</div>
            </div>
          </div>
        </div>
      </div>

      {/* 留言列表 */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              className="bg-card rounded-lg border p-6"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {message.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{message.author}</span>
                        <span className="text-sm text-muted-foreground">{message.email}</span>
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
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-foreground mb-4 whitespace-pre-wrap">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{message.likeCount}</span>
                    </div>
                    {message.ipAddress && (
                      <div className="flex items-center space-x-1">
                        <span>IP: {message.ipAddress}</span>
                      </div>
                    )}
                    {message.userAgent && (
                      <div className="flex items-center space-x-1">
                        <span>UA: {message.userAgent.substring(0, 50)}...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!message.isApproved && (
                    <motion.button
                      onClick={() => handleApprove(message)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.button>
                  )}
                  
                  {!message.isApproved && (
                    <motion.button
                      onClick={() => handleReject(message)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XCircle className="h-5 w-5" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={() => handleLike(message)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleDelete(message)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
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

      {/* 分页 */}
      {filteredMessages.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            showInfo={true}
          />
        </div>
      )}

      {/* 拒绝确认对话框 */}
      {showRejectModal && rejectingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">拒绝留言</h3>
            <p className="text-muted-foreground mb-6">
              确定要拒绝这条留言吗？拒绝后留言将被删除。
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingMessage(null);
                }}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {showDeleteModal && deletingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">删除留言</h3>
            <p className="text-muted-foreground mb-6">
              确定要删除这条留言吗？删除后无法恢复。
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingMessage(null);
                }}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
