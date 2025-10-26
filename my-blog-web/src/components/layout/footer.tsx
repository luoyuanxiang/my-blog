'use client';

import Link from 'next/link';
import { Github, Twitter, Mail, Heart, Linkedin } from 'lucide-react';
import { useSystemConfig } from '@/lib/hooks/use-system-config';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { config } = useSystemConfig();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-8">*/}
        {/*  /!* About *!/*/}
        {/*  <div className="space-y-4">*/}
        {/*    <div className="flex items-center space-x-2">*/}
        {/*      {config.logo ? (*/}
        {/*        <img */}
        {/*          src={config.logo} */}
        {/*          alt={config.siteName}*/}
        {/*          className="h-8 w-8 rounded-lg object-cover"*/}
        {/*        />*/}
        {/*      ) : (*/}
        {/*        <div */}
        {/*          className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"*/}
        {/*          style={{ */}
        {/*            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.primaryColor}dd)`*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      )}*/}
        {/*      <span className="text-xl font-bold">{config.siteName}</span>*/}
        {/*    </div>*/}
        {/*    <p className="text-sm text-muted-foreground">*/}
        {/*      {config.siteDescription}*/}
        {/*    </p>*/}
        {/*    <div className="flex space-x-4">*/}
        {/*      {config.githubUrl && (*/}
        {/*        <Link*/}
        {/*          href={config.githubUrl}*/}
        {/*          className="text-muted-foreground hover:text-primary transition-colors"*/}
        {/*          target="_blank"*/}
        {/*          rel="noopener noreferrer"*/}
        {/*        >*/}
        {/*          <Github className="h-5 w-5" />*/}
        {/*        </Link>*/}
        {/*      )}*/}
        {/*      {config.twitterUrl && (*/}
        {/*        <Link*/}
        {/*          href={config.twitterUrl}*/}
        {/*          className="text-muted-foreground hover:text-primary transition-colors"*/}
        {/*          target="_blank"*/}
        {/*          rel="noopener noreferrer"*/}
        {/*        >*/}
        {/*          <Twitter className="h-5 w-5" />*/}
        {/*        </Link>*/}
        {/*      )}*/}
        {/*      {config.linkedinUrl && (*/}
        {/*        <Link*/}
        {/*          href={config.linkedinUrl}*/}
        {/*          className="text-muted-foreground hover:text-primary transition-colors"*/}
        {/*          target="_blank"*/}
        {/*          rel="noopener noreferrer"*/}
        {/*        >*/}
        {/*          <Linkedin className="h-5 w-5" />*/}
        {/*        </Link>*/}
        {/*      )}*/}
        {/*      {config.emailUrl && (*/}
        {/*        <Link*/}
        {/*          href={`mailto:${config.emailUrl}`}*/}
        {/*          className="text-muted-foreground hover:text-primary transition-colors"*/}
        {/*        >*/}
        {/*          <Mail className="h-5 w-5" />*/}
        {/*        </Link>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  /!* Quick Links *!/*/}
        {/*  <div className="space-y-4">*/}
        {/*    <h3 className="text-sm font-semibold">快速导航</h3>*/}
        {/*    <div className="space-y-2">*/}
        {/*      <Link*/}
        {/*        href="/articles"*/}
        {/*        className="block text-sm text-muted-foreground hover:text-primary transition-colors"*/}
        {/*      >*/}
        {/*        文章列表*/}
        {/*      </Link>*/}
        {/*      <Link*/}
        {/*        href="/categories"*/}
        {/*        className="block text-sm text-muted-foreground hover:text-primary transition-colors"*/}
        {/*      >*/}
        {/*        分类*/}
        {/*      </Link>*/}
        {/*      <Link*/}
        {/*        href="/tags"*/}
        {/*        className="block text-sm text-muted-foreground hover:text-primary transition-colors"*/}
        {/*      >*/}
        {/*        标签*/}
        {/*      </Link>*/}
        {/*      <Link*/}
        {/*        href="/archive"*/}
        {/*        className="block text-sm text-muted-foreground hover:text-primary transition-colors"*/}
        {/*      >*/}
        {/*        归档*/}
        {/*      </Link>*/}
        {/*      {config.enableFriendLinks && (*/}
        {/*        <Link*/}
        {/*          href="/links"*/}
        {/*          className="block text-sm text-muted-foreground hover:text-primary transition-colors"*/}
        {/*        >*/}
        {/*          友链*/}
        {/*        </Link>*/}
        {/*      )}*/}
        {/*      {config.enableGuestbook && (*/}
        {/*        <Link*/}
        {/*          href="/guestbook"*/}
        {/*          className="block text-sm text-muted-foreground hover:text-primary transition-colors"*/}
        {/*        >*/}
        {/*          留言板*/}
        {/*        </Link>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  /!* About Blogger *!/*/}
        {/*  <div className="space-y-4">*/}
        {/*    <h3 className="text-sm font-semibold">关于博主</h3>*/}
        {/*    <div className="space-y-2 text-sm text-muted-foreground">*/}
        {/*      <p>{config.bloggerName}</p>*/}
        {/*      <p>{config.bloggerBio}</p>*/}
        {/*      {config.adminEmail && (*/}
        {/*        <p>邮箱: {config.adminEmail}</p>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  /!* Contact *!/*/}
        {/*  <div className="space-y-4">*/}
        {/*    <h3 className="text-sm font-semibold">联系我</h3>*/}
        {/*    <div className="space-y-2 text-sm text-muted-foreground">*/}
        {/*      {config.adminEmail && (*/}
        {/*        <p>邮箱: {config.adminEmail}</p>*/}
        {/*      )}*/}
        {/*      {config.siteUrl && (*/}
        {/*        <p>网站: {config.siteUrl}</p>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            {config.copyright || `© ${currentYear} ${config.siteName}`}
            {config.icpNumber && (
              <>
                {' | '}
                <a 
                  href="https://beian.miit.gov.cn/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {config.icpNumber}
                </a>
              </>
            )}
            {config.beianNumber && (
              <>
                {' | '}
                <a 
                  href="https://www.beian.gov.cn/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {config.beianNumber}
                </a>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Made with{' '}
            <Heart className="inline h-3 w-3 text-red-500" /> by{' '}
            <Link href="/" className="text-primary hover:underline">
              {config.bloggerName}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
