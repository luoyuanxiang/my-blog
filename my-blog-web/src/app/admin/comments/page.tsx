'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Check, 
  X, 
  Reply, 
  Trash2, 
  MessageSquare,
  User
} from 'lucide-react';

// 模拟评论数据
const initialComments = [
  {
    id: 1,
    content: '这篇文章写得很好，学到了很多新知识！',
    author: '张三',
    email: 'zhangsan@example.com',
    website: 'https://zhangsan.com',
    articleTitle: 'Next.js 14 新特性详解',
    articleId: 1,
    createdAt: '2024-01-15T10:30:00Z',
    isApproved: true,
    likes: 5,
    replies: [
      {
        id: 2,
        content: '同感！作者的技术水平很高。',
        author: '李四',
        email: 'lisi@example.com',
        createdAt: '2024-01-15T11:00:00Z',
        isApproved: true,
        likes: 2,
      }
    ]
  },
  {
    id: 3,
    content: '感谢分享，期待更多这样的好文章！',
    author: '王五',
    email: 'wangwu@example.com',
    articleTitle: 'React 18 并发特性深度解析',
    articleId: 2,
    createdAt: '2024-01-15T14:20:00Z',
    isApproved: false,
    likes: 3,
    replies: []
  },
  {
    id: 4,
    content: '请问博主，关于 React 18 的并发特性，有什么推荐的深入学习资源吗？',
    author: '赵六',
    email: 'zhaoliu@example.com',
    website: 'https://zhaoliu.dev',
    articleTitle: 'React 18 并发特性深度解析',
    articleId: 2,
    createdAt: '2024-01-13T09:15:00Z',
    isApproved: true,
    likes: 1,
    replies: [
      {
        id: 5,
        content: '推荐看看 React 官方文档和 Dan Abramov 的博客，里面有很多深入的内容。',
        author: '博主',
        email: 'admin@example.com',
        createdAt: '2024-01-13T10:30:00Z',
        isApproved: true,
        likes: 4,
      }
    ]
  }
];

interface Comment {
  id: number;
  content: string;
  author: string;
  email: string;
  website?: string;
  articleTitle: string;
  articleId: number;
  createdAt: string;
  isApproved: boolean;
  likes: number;
  replies: Comment[];
}

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const idCounterRef = useRef(1000); // 用于生成唯一 ID

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.articleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && comment.isApproved) ||
                         (filterStatus === 'pending' && !comment.isApproved);
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, isApproved: true }
        : comment
    ));
  };

  const handleReject = (id: number) => {
    if (confirm('确定要拒绝这个评论吗？')) {
      setComments(comments.filter(comment => comment.id !== id));
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个评论吗？')) {
      setComments(comments.filter(comment => comment.id !== id));
    }
  };

  const handleReply = (commentId: number) => {
    if (!replyContent.trim()) return;

    // 使用 ref 来生成唯一 ID
    idCounterRef.current += 1;

    const newReply: Comment = {
      id: idCounterRef.current,
      content: replyContent,
      author: '博主',
      email: 'admin@example.com',
      articleTitle: comments.find(c => c.id === commentId)?.articleTitle || '',
      articleId: comments.find(c => c.id === commentId)?.articleId || 0,
      createdAt: new Date().toISOString(),
      isApproved: true,
      likes: 0,
      replies: []
    };

    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    ));

    setReplyContent('');
    setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">评论管理</h1>
        <p className="text-gray-600">管理博客评论，共 {comments.length} 条评论</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索评论..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            已审核
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            待审核
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">评论列表</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredComments.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到评论</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* 评论头部 */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          {comment.website && (
                            <a
                              href={comment.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              {comment.website}
                            </a>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            comment.isApproved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {comment.isApproved ? '已审核' : '待审核'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{comment.email}</span>
                          <span>{formatDate(comment.createdAt)}</span>
                          <span>文章: {comment.articleTitle}</span>
                        </div>
                      </div>
                    </div>

                    {/* 评论内容 */}
                    <div className="ml-11 mb-4">
                      <p className="text-gray-900">{comment.content}</p>
                    </div>

                    {/* 回复区域 */}
                    {comment.replies.length > 0 && (
                      <div className="ml-11 mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">回复 ({comment.replies.length})</h5>
                        <div className="space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{reply.author}</span>
                                  <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                                </div>
                                <button
                                  onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="回复"
                                >
                                  <Reply className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-gray-700">{reply.content}</p>
                              
                              {/* 子级回复表单 */}
                              {replyingTo === reply.id && (
                                <div className="mt-3 bg-blue-50 rounded-lg p-3">
                                  <h6 className="text-sm font-medium text-gray-700 mb-2">回复 @{reply.author}</h6>
                                  <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                                    placeholder="输入回复内容..."
                                    rows={2}
                                  />
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyContent('');
                                      }}
                                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={() => handleReply(comment.id)}
                                      className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                      回复
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 回复表单 */}
                    {replyingTo === comment.id && (
                      <div className="ml-11 mb-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">回复 @{comment.author}</h5>
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                            placeholder="输入回复内容..."
                            rows={3}
                          />
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => handleReply(comment.id)}
                              className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              回复
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!comment.isApproved && (
                      <>
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="审核通过"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(comment.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="拒绝"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="回复"
                    >
                      <Reply className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
