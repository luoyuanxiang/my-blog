import Link from 'next/link';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
              <span className="text-xl font-bold">我的博客</span>
            </div>
            <p className="text-sm text-muted-foreground">
              分享技术、记录生活，用文字记录成长的足迹。
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">快速导航</h3>
            <div className="space-y-2">
              <Link
                href="/articles"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                文章列表
              </Link>
              <Link
                href="/categories"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                分类
              </Link>
              <Link
                href="/tags"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                标签
              </Link>
              <Link
                href="/archive"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                归档
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">热门分类</h3>
            <div className="space-y-2">
              <Link
                href="/categories/javascript"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                JavaScript
              </Link>
              <Link
                href="/categories/react"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                React
              </Link>
              <Link
                href="/categories/nodejs"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Node.js
              </Link>
              <Link
                href="/categories/web"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                前端开发
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">联系我</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>邮箱: contact@example.com</p>
              <p>微信: your-wechat-id</p>
              <p>QQ: 123456789</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} 我的博客. Made with{' '}
            <Heart className="inline h-4 w-4 text-red-500" /> by{' '}
            <Link href="/" className="text-primary hover:underline">
              作者
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
