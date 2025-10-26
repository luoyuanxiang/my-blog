'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  FolderOpen, 
  Link as LinkIcon, 
  MessageSquare, 
  MessageCircle,
  Settings, 
  LogOut, 
  Menu,
  X,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Image as ImageIcon
} from 'lucide-react';
import { AdminAuthProvider, AdminAuthGuard, useAdminAuth } from '@/lib/hooks/use-admin-auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: '仪表盘', href: '/admin', icon: LayoutDashboard },
  { name: '文章管理', href: '/admin/articles', icon: FileText },
  { name: '标签管理', href: '/admin/tags', icon: Tag },
  { name: '分类管理', href: '/admin/categories', icon: FolderOpen },
  { name: '图片管理', href: '/admin/images', icon: ImageIcon },
  { name: '友链管理', href: '/admin/links', icon: LinkIcon },
  { name: '评论管理', href: '/admin/comments', icon: MessageSquare },
  { name: '留言板管理', href: '/admin/guestbook', icon: MessageCircle },
  { name: '系统设置', href: '/admin/settings', icon: Settings },
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
  };

  const handleUserCenter = () => {
    console.log('个人中心');
    setUserDropdownOpen(false);
    // router.push('/admin/profile');
  };

  // 如果是登录页面，直接返回 children，不显示菜单栏
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 对于其他管理端页面，需要认证保护
  if (!isLoading && !isAuthenticated) {
    // 重定向到登录页面
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端侧边栏遮罩 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
      }`}>
        <div className="flex h-full flex-col">
          {/* 侧边栏头部 */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden"
                  >
                    管理后台
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 px-2 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          {/* 底部标识信息 */}
          <div className="border-t border-gray-200 p-4">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-xs text-gray-500">© 2024 个人博客管理系统</p>
                  <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => item.href === pathname)?.name || '管理后台'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* 通知按钮 */}
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* 用户下拉菜单 */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.nickname || user?.username || '管理员'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <button
                        onClick={handleUserCenter}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <UserCircle className="h-4 w-4" />
                        <span>个人中心</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>退出登录</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* 点击外部关闭下拉菜单 */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
