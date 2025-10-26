'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText,
  Code
} from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { ImageSelector } from './image-selector';
import Image from 'next/image';
import type { Image as ImageType } from '@/lib/api/images';

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isPinned: boolean;
}

interface ArticleEditorProps {
  article?: ArticleFormData;
  mode: 'create' | 'edit';
}

const categories = [
  { id: '1', name: '前端开发', slug: 'frontend' },
  { id: '2', name: '后端开发', slug: 'backend' },
  { id: '3', name: '编程语言', slug: 'programming' },
  { id: '4', name: '工具与框架', slug: 'tools' },
  { id: '5', name: '算法与数据结构', slug: 'algorithms' },
];

const availableTags = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Vue.js',
  'Python', 'Java', 'CSS', 'HTML', 'Webpack', 'Docker', 'Kubernetes',
  'MongoDB', 'MySQL', 'Redis', 'AWS', 'GraphQL', 'REST API'
];

export function ArticleEditor({ article, mode }: ArticleEditorProps) {
  const router = useRouter();
  const [editorType, setEditorType] = useState<'rich' | 'markdown'>('rich');
  const [isSaving, setIsSaving] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [selectedCoverImage, setSelectedCoverImage] = useState<ImageType | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [],
    isPublished: false,
    isPinned: false,
    ...article
  });

  // 自动生成 slug
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      // 使用 setTimeout 来避免在 effect 中直接调用 setState
      const timer = setTimeout(() => {
        setFormData(prev => ({ ...prev, slug }));
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [formData.title, formData.slug]);

  const handleInputChange = (field: keyof ArticleFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // 处理封面图片选择
  const handleCoverImageSelect = (image: ImageType) => {
    setSelectedCoverImage(image);
    setFormData(prev => ({
      ...prev,
      coverImage: image.url
    }));
    setShowImageSelector(false);
  };

  // 处理封面图片输入
  const handleCoverImageInput = (value: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: value
    }));
    // 如果输入的是URL，清除选中的图片
    if (value && !value.startsWith('/api/images/')) {
      setSelectedCoverImage(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('保存文章:', formData);
    
    setIsSaving(false);
    
    // 保存成功后返回文章列表
    router.push('/admin/articles');
  };

  const handleSaveAndPublish = async () => {
    setFormData(prev => ({ ...prev, isPublished: true }));
    await handleSave();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">
                  {mode === 'create' ? '创建文章' : '编辑文章'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {mode === 'create' ? '写一篇新文章' : '修改文章内容'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* 编辑器类型切换 */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setEditorType('rich')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    editorType === 'rich' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-1" />
                  富文本
                </button>
                <button
                  onClick={() => setEditorType('markdown')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    editorType === 'markdown' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Code className="h-4 w-4 inline mr-1" />
                  Markdown
                </button>
              </div>

              {/* 保存按钮 */}
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isSaving ? '保存中...' : '保存草稿'}
              </motion.button>

              <motion.button
                onClick={handleSaveAndPublish}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? '发布中...' : '发布文章'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium mb-2">文章标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="请输入文章标题..."
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-2">URL 别名</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="article-slug"
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            {/* 摘要 */}
            <div>
              <label className="block text-sm font-medium mb-2">文章摘要</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="请输入文章摘要..."
                rows={3}
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>

            {/* 内容编辑器 */}
            <div>
              <label className="block text-sm font-medium mb-2">文章内容 *</label>
              {editorType === 'rich' ? (
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => handleInputChange('content', content)}
                  placeholder="开始写作..."
                />
              ) : (
                <MarkdownEditor
                  content={formData.content}
                  onChange={(content) => handleInputChange('content', content)}
                  placeholder="开始写作..."
                />
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 封面图片 */}
            <div className="bg-card rounded-lg border p-4">
              <label className="block text-sm font-medium mb-2">封面图片</label>
              
              {/* 图片选择按钮 */}
              <div className="flex space-x-2 mb-3">
                <button
                  type="button"
                  onClick={() => setShowImageSelector(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  选择图片
                </button>
                {selectedCoverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCoverImage(null);
                      setFormData(prev => ({ ...prev, coverImage: '' }));
                    }}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors text-sm"
                  >
                    清除选择
                  </button>
                )}
              </div>

              {/* 手动输入URL */}
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => handleCoverImageInput(e.target.value)}
                placeholder="https://example.com/image.jpg 或选择上方图片"
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent mb-3"
              />

              {/* 图片预览 */}
              {formData.coverImage && (
                <div className="w-full h-32 rounded-lg overflow-hidden border">
                  <Image
                    src={formData.coverImage}
                    alt="封面预览"
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">图片加载失败</span>
                  </div>
                </div>
              )}

              {/* 选中图片信息 */}
              {selectedCoverImage && (
                <div className="mt-2 p-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
                  已选择: {selectedCoverImage.originalName} ({Math.round(selectedCoverImage.size / 1024)}KB)
                </div>
              )}
            </div>

            {/* 分类 */}
            <div className="bg-card rounded-lg border p-4">
              <label className="block text-sm font-medium mb-2">分类</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">选择分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 标签 */}
            <div className="bg-card rounded-lg border p-4">
              <label className="block text-sm font-medium mb-2">标签</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 发布设置 */}
            <div className="bg-card rounded-lg border p-4">
              <label className="block text-sm font-medium mb-3">发布设置</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">立即发布</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => handleInputChange('isPinned', e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">置顶文章</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图片选择器 */}
      <ImageSelector
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleCoverImageSelect}
        multiple={false}
      />
    </div>
  );
}
