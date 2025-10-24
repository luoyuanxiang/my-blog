'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Upload
} from 'lucide-react';
import { FileImportModal } from './file-import-modal';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:text-primary/80 underline',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('请输入图片URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('请输入链接URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImport = (importedContent: string, type: 'html' | 'markdown' | 'json') => {
    if (editor) {
      if (type === 'html') {
        editor.commands.setContent(importedContent);
      } else if (type === 'markdown') {
        // 简单的Markdown到HTML转换
        const htmlContent = importedContent
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
          .replace(/\*(.*)\*/gim, '<em>$1</em>')
          .replace(/^\* (.*$)/gim, '<li>$1</li>')
          .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
          .replace(/\n/gim, '<br>');
        editor.commands.setContent(htmlContent);
      } else if (type === 'json') {
        editor.commands.setContent(importedContent);
      }
    }
  };

  return (
    <div className="border border-input rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center gap-1 p-2 border-b border-input bg-muted/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('bold') ? 'bg-muted text-primary' : ''
          }`}
          title="粗体"
        >
          <Bold className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('italic') ? 'bg-muted text-primary' : ''
          }`}
          title="斜体"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-muted text-primary' : ''
          }`}
          title="标题1"
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : ''
          }`}
          title="标题2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-muted text-primary' : ''
          }`}
          title="标题3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('bulletList') ? 'bg-muted text-primary' : ''
          }`}
          title="无序列表"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('orderedList') ? 'bg-muted text-primary' : ''
          }`}
          title="有序列表"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('blockquote') ? 'bg-muted text-primary' : ''
          }`}
          title="引用"
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('codeBlock') ? 'bg-muted text-primary' : ''
          }`}
          title="代码块"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive('link') ? 'bg-muted text-primary' : ''
          }`}
          title="添加链接"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-muted transition-colors"
          title="添加图片"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
          title="撤销"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
          title="重做"
        >
          <Redo className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={() => setShowImportModal(true)}
          className="p-2 rounded hover:bg-muted transition-colors"
          title="导入文档"
        >
          <Upload className="h-4 w-4" />
        </button>
      </div>

      {/* 编辑器内容 */}
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>

      {/* 导入弹窗 */}
      <FileImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        editorType="rich"
      />
    </div>
  );
}
