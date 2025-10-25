'use client';

import {Suspense, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Calendar, ExternalLink, Globe} from 'lucide-react';
import {formatDate} from '@/lib/utils';
import {SearchBar} from '@/components/ui/search-bar';
import {MainLayout} from '@/components/layout/main-layout';
import {friendLinkApiService} from '@/lib/api/friend-links';
import {useSystemConfig} from '@/lib/hooks/use-system-config';
import type {FriendLink} from '@/types';
import Image from "next/image";

interface FriendLinkCardProps {
    link: FriendLink;
}

function FriendLinkCard({link}: Readonly<FriendLinkCardProps>) {
    return (
        <motion.div
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            transition={{duration: 0.2}}
        >
            <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card rounded-lg border p-6 hover:shadow-md transition-all duration-300 group"
            >
                <div className="flex items-start space-x-4">
                    {/* 头像 */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            {link.logo ? (
                                <Image
                                    src={link.logo}
                                    alt={link.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                        ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                                    }}
                                />
                            ) : <div
                                className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                                {link.name.charAt(0).toUpperCase()}
                            </div>}
                        </div>
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {link.name}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground"/>
                        </div>

                        <p className="text-muted-foreground mb-3 line-clamp-2">
                            {link.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                                <Globe className="h-4 w-4"/>
                                <span className="truncate max-w-32">{link.url}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4"/>
                                <span>{formatDate(link.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </motion.div>
    );
}

interface LinkApplicationFormProps {
    onSubmit: (data: Omit<FriendLink, 'id' | 'createdAt' | 'isApproved'>) => void;
    isSubmitting?: boolean;
    submitSuccess?: boolean;
}

function LinkApplicationForm({
                                 onSubmit,
                                 isSubmitting = false,
                                 submitSuccess = false
                             }: Readonly<LinkApplicationFormProps>) {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        logo: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() && formData.url.trim() && formData.description.trim()) {
            onSubmit({
                name: formData.name.trim(),
                url: formData.url.trim(),
                description: formData.description.trim(),
                logo: formData.logo.trim() || undefined
            });
            setFormData({name: '', url: '', description: '', logo: ''});
        }
    };

    return (
        <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">申请友情链接</h3>

            {/* 成功提示 */}
            {submitSuccess && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800"
                >
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"/>
                        </svg>
                        申请已提交，我们会尽快审核！
                    </div>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">网站名称 *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="请输入网站名称"
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">网站地址 *</label>
                    <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                        placeholder="https://example.com"
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">网站描述 *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="请简要描述您的网站"
                        rows={3}
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">网站图标 (可选)</label>
                    <input
                        type="url"
                        value={formData.logo}
                        onChange={(e) => setFormData({...formData, logo: e.target.value})}
                        placeholder="https://example.com/favicon.ico"
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex justify-end">
                    <motion.button
                        type="submit"
                        whileHover={{scale: isSubmitting ? 1 : 1.02}}
                        whileTap={{scale: isSubmitting ? 1 : 0.98}}
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                            isSubmitting
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                    >
                        {isSubmitting ? '提交中...' : '提交申请'}
                    </motion.button>
                </div>
            </form>

            <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">申请须知：</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 网站内容健康，无违法违规内容</li>
                    <li>• 网站正常运行，访问稳定</li>
                    <li>• 建议在您的网站也添加我们的链接</li>
                    <li>• 申请通过后我们会及时通知您</li>
                </ul>
            </div>
        </div>
    );
}

export default function LinksPage() {
    const {config} = useSystemConfig();
    const [friendLinks, setFriendLinks] = useState<FriendLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // 获取友链数据
    useEffect(() => {
        const fetchFriendLinks = async () => {
            try {
                setLoading(true);
                setError(null);

                // 获取已审核通过的友链
                const response = await friendLinkApiService.getApprovedFriendLinks();

                if (response.code === 200 && response.data) {
                    setFriendLinks(response.data);
                } else {
                    // 如果API失败，使用示例数据
                    const sampleFriendLinks: FriendLink[] = [
                        {
                            id: '1',
                            name: 'Vue.js 官方文档',
                            url: 'https://vuejs.org',
                            description: 'Vue.js 官方文档，学习 Vue 框架的最佳资源',
                            logo: 'https://vuejs.org/logo.svg',
                            createdAt: '2024-01-01',
                            isApproved: true
                        },
                        {
                            id: '2',
                            name: 'React 官方文档',
                            url: 'https://react.dev',
                            description: 'React 官方文档，掌握 React 开发技能',
                            logo: 'https://react.dev/favicon.ico',
                            createdAt: '2024-01-01',
                            isApproved: true
                        },
                        {
                            id: '3',
                            name: 'MDN Web 文档',
                            url: 'https://developer.mozilla.org',
                            description: 'Mozilla 开发者网络，Web 开发权威文档',
                            logo: 'https://developer.mozilla.org/favicon.ico',
                            createdAt: '2024-01-01',
                            isApproved: true
                        },
                        {
                            id: '4',
                            name: 'GitHub',
                            url: 'https://github.com',
                            description: '全球最大的代码托管平台，开源项目的聚集地',
                            logo: 'https://github.com/favicon.ico',
                            createdAt: '2024-01-01',
                            isApproved: true
                        },
                        {
                            id: '5',
                            name: 'Stack Overflow',
                            url: 'https://stackoverflow.com',
                            description: '程序员问答社区，解决技术问题的好地方',
                            logo: 'https://stackoverflow.com/favicon.ico',
                            createdAt: '2024-01-01',
                            isApproved: true
                        },
                        {
                            id: '6',
                            name: '掘金',
                            url: 'https://juejin.cn',
                            description: '中文技术社区，分享技术文章和心得',
                            logo: 'https://juejin.cn/favicon.ico',
                            createdAt: '2024-01-01',
                            isApproved: true
                        }
                    ];
                    setFriendLinks(sampleFriendLinks);
                }
            } catch (err: any) {
                console.error('获取友链数据失败:', err);
                setError(err.message || '获取友链数据失败');

                // 使用示例数据作为降级方案
                const sampleFriendLinks: FriendLink[] = [
                    {
                        id: '1',
                        name: 'Vue.js 官方文档',
                        url: 'https://vuejs.org',
                        description: 'Vue.js 官方文档，学习 Vue 框架的最佳资源',
                        logo: 'https://vuejs.org/logo.svg',
                        createdAt: '2024-01-01',
                        isApproved: true
                    },
                    {
                        id: '2',
                        name: 'React 官方文档',
                        url: 'https://react.dev',
                        description: 'React 官方文档，掌握 React 开发技能',
                        logo: 'https://react.dev/favicon.ico',
                        createdAt: '2024-01-01',
                        isApproved: true
                    },
                    {
                        id: '3',
                        name: 'MDN Web 文档',
                        url: 'https://developer.mozilla.org',
                        description: 'Mozilla 开发者网络，Web 开发权威文档',
                        logo: 'https://developer.mozilla.org/favicon.ico',
                        createdAt: '2024-01-01',
                        isApproved: true
                    },
                    {
                        id: '4',
                        name: 'GitHub',
                        url: 'https://github.com',
                        description: '全球最大的代码托管平台，开源项目的聚集地',
                        logo: 'https://github.com/favicon.ico',
                        createdAt: '2024-01-01',
                        isApproved: true
                    },
                    {
                        id: '5',
                        name: 'Stack Overflow',
                        url: 'https://stackoverflow.com',
                        description: '程序员问答社区，解决技术问题的好地方',
                        logo: 'https://stackoverflow.com/favicon.ico',
                        createdAt: '2024-01-01',
                        isApproved: true
                    },
                    {
                        id: '6',
                        name: '掘金',
                        url: 'https://juejin.cn',
                        description: '中文技术社区，分享技术文章和心得',
                        logo: 'https://juejin.cn/favicon.ico',
                        createdAt: '2024-01-01',
                        isApproved: true
                    }
                ];
                setFriendLinks(sampleFriendLinks);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendLinks();
    }, []);

    // 处理友链申请
    const handleLinkApplication = async (data: Omit<FriendLink, 'id' | 'createdAt' | 'isApproved'>) => {
        try {
            setIsSubmitting(true);

            // 调用API创建友链申请
            const response = await friendLinkApiService.createFriendLink({
                name: data.name,
                url: data.url,
                description: data.description,
                logo: data.logo, // 前端使用avatar字段
                isApproved: false, // 新申请的友链默认未审核
                sortOrder: 0,
                clickCount: 0,
                email: '' // 可以后续添加邮箱字段
            });

            if (response.code === 200) {
                setSubmitSuccess(true);
                // 3秒后自动隐藏成功提示
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 3000);
            } else {
                setError('申请提交失败，请稍后重试');
            }
        } catch (err: any) {
            console.error('友链申请失败:', err);
            setError('申请提交失败，请稍后重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 过滤友链数据
    const filteredFriendLinks = friendLinks.filter(link =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        link.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
                    <h1 className="text-3xl font-bold mb-4">友情链接</h1>
                    <p className="text-muted-foreground">
                        与{config.bloggerName}志同道合的朋友们分享优质资源，共同成长
                    </p>
                </div>

                {/* 搜索栏 */}
                <div className="mb-8">
                    <Suspense fallback={<div>加载中...</div>}>
                        <SearchBar
                            placeholder="搜索友情链接..."
                            onSearch={setSearchTerm}
                        />
                    </Suspense>
                </div>

                {/* 统计信息 */}
                <div className="mb-8">
                    <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">链接统计</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {friendLinks.length}
                                </div>
                                <div className="text-sm text-muted-foreground">友情链接</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {friendLinks.filter(link => link.isApproved).length}
                                </div>
                                <div className="text-sm text-muted-foreground">已审核</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {friendLinks.filter(link => !link.isApproved).length}
                                </div>
                                <div className="text-sm text-muted-foreground">待审核</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {friendLinks.length > 0 ? Math.round((friendLinks.filter(link => link.isApproved).length / friendLinks.length) * 100) : 0}%
                                </div>
                                <div className="text-sm text-muted-foreground">通过率</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 友情链接列表 */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">推荐链接</h2>
                        {filteredFriendLinks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredFriendLinks.map((link) => (
                                    <FriendLinkCard key={link.id} link={link}/>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {searchTerm ? '没有找到匹配的友链' : '暂无友链数据'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 申请表单 */}
                    <div className="lg:col-span-1">
                        <LinkApplicationForm onSubmit={handleLinkApplication} isSubmitting={isSubmitting}
                                             submitSuccess={submitSuccess}/>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
