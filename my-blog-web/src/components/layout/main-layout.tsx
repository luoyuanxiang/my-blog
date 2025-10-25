'use client';

import { Navigation } from './navigation';
import { Footer } from './footer';
import { BackToTop } from '../ui/back-to-top';
import { useSystemConfig } from '@/lib/hooks/use-system-config';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { config, loading } = useSystemConfig();

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
