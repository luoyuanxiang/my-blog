'use client';

import {useRef, useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Check, MessageSquare, Reply, Search, Trash2, User, X, AlertCircle} from 'lucide-react';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { commentApiService } from '@/lib/api/comments';
import type { Comment } from '@/types';


export default function CommentsManagement() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingComment, setRejectingComment] = useState<Comment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const idCounterRef = useRef(1000); // 用于生成唯一 ID

    // 获取评论列表
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                setError('');
                const response = await commentApiService.getAllComments(0, 1000);
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
    }, []);

    const filteredComments = comments.filter(comment => {
        const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'approved' && comment.isApproved) ||
            (filterStatus === 'pending' && !comment.isApproved);

        return matchesSearch && matchesStatus;
    });

    // 分页功能
    const {
        currentPage,
        totalPages,
        totalItems,
        currentItems,
        goToPage,
    } = usePagination(filteredComments, 5);

    const handleApprove = async (comment: Comment) => {
        try {
            const response = await commentApiService.approveComment(comment.id);
            if (response.code === 200) {
                setComments(comments.map(c =>
                    c.id === comment.id ? response.data : c
                ));
            }
        } catch (err: any) {
            console.error('审核通过失败:', err);
            setError(err.message || '审核通过失败');
        }
    };

    const handleReject = (comment: Comment) => {
        setRejectingComment(comment);
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!rejectingComment) return;
        
        try {
            const response = await commentApiService.rejectComment(rejectingComment.id);
            if (response.code === 200) {
                setComments(comments.filter(comment => comment.id !== rejectingComment.id));
                setShowRejectModal(false);
                setRejectingComment(null);
            }
        } catch (err: any) {
            console.error('拒绝评论失败:', err);
            setError(err.message || '拒绝评论失败');
        }
    };

    const cancelReject = () => {
        setShowRejectModal(false);
        setRejectingComment(null);
    };

    const handleDelete = (comment: Comment) => {
        setDeletingComment(comment);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingComment) return;
        
        try {
            const response = await commentApiService.deleteComment(deletingComment.id);
            if (response.code === 200) {
                setComments(comments.filter(comment => comment.id !== deletingComment.id));
                setShowDeleteModal(false);
                setDeletingComment(null);
            }
        } catch (err: any) {
            console.error('删除评论失败:', err);
            setError(err.message || '删除评论失败');
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingComment(null);
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
            articleId: comments.find(c => c.id === commentId)?.articleId || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isApproved: true,
            likeCount: 0,
            replies: []
        };

        setComments(comments.map(comment =>
            comment.id === commentId
                ? {...comment, replies: [...(comment.replies || []), newReply]}
                : comment
        ));

        setReplyContent('');
        setReplyingTo(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                </div>
            </div>
        );
    }

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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
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
                    {currentItems.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                            <p className="text-gray-500">没有找到评论</p>
                        </div>
                    ) : (
                        currentItems.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* 评论头部 */}
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div
                                                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-white"/>
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
                                                    <span>文章ID: {comment.articleId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 评论内容 */}
                                        <div className="ml-11 mb-4">
                                            <p className="text-gray-900">{comment.content}</p>
                                        </div>

                                        {/* 回复区域 */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-11 mb-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">回复
                                                    ({comment.replies.length})</h5>
                                                <div className="space-y-3">
                                                    {comment.replies.map((reply) => (
                                                        <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center space-x-2">
                                                                    <span
                                                                        className="font-medium text-gray-900">{reply.author}</span>
                                                                    <span
                                                                        className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                                                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                    title="回复"
                                                                >
                                                                    <Reply className="h-4 w-4"/>
                                                                </button>
                                                            </div>
                                                            <p className="text-gray-700">{reply.content}</p>

                                                            {/* 子级回复表单 */}
                                                            {replyingTo === reply.id && (
                                                                <div className="mt-3 bg-blue-50 rounded-lg p-3">
                                                                    <h6 className="text-sm font-medium text-gray-700 mb-2">回复
                                                                        @{reply.author}</h6>
                                                                    <textarea
                                                                        value={replyContent}
                                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                                                                        placeholder="输入回复内容..."
                                                                        rows={2}
                                                                    />
                                                                    <div
                                                                        className="flex items-center justify-end space-x-2">
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
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">回复
                                                        @{comment.author}</h5>
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
                                                    onClick={() => handleApprove(comment)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="审核通过"
                                                >
                                                    <Check className="h-4 w-4"/>
                                                </button>
                                                <button
                                                    onClick={() => handleReject(comment)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="拒绝"
                                                >
                                                    <X className="h-4 w-4"/>
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="回复"
                                        >
                                            <Reply className="h-4 w-4"/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="删除"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
                
                {/* 分页组件 */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={5}
                            onPageChange={goToPage}
                        />
                    </div>
                )}
            </div>

            {/* 拒绝确认对话框 */}
            {showRejectModal && rejectingComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <X className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">拒绝评论</h3>
                                    <p className="text-sm text-gray-600">此操作将永久删除该评论</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-700 mb-2">
                                    确定要拒绝评论 <span className="font-semibold text-red-600">"{rejectingComment.author}"</span> 的评论吗？
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-start space-x-2">
                                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-yellow-800">
                                            <p className="font-medium">拒绝后影响：</p>
                                            <ul className="mt-1 space-y-1">
                                                <li>• 该评论将被永久删除</li>
                                                <li>• 评论者将无法看到此评论</li>
                                                <li>• 此操作无法撤销</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    onClick={cancelReject}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={confirmReject}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    确认拒绝
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 删除确认对话框 */}
            {showDeleteModal && deletingComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">删除评论</h3>
                                    <p className="text-sm text-gray-600">此操作将永久删除该评论</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-700 mb-2">
                                    确定要删除评论 <span className="font-semibold text-red-600">"{deletingComment.author}"</span> 的评论吗？
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-start space-x-2">
                                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-yellow-800">
                                            <p className="font-medium">删除后影响：</p>
                                            <ul className="mt-1 space-y-1">
                                                <li>• 该评论将被永久删除</li>
                                                <li>• 所有回复也将被删除</li>
                                                <li>• 此操作无法撤销</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    确认删除
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
