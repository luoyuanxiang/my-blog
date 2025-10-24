'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Github, MessageCircle, Cloud, UploadCloud } from 'lucide-react';
import { useAdminAuth } from '@/lib/hooks/use-admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果已经登录，重定向到管理后台
  if (isAuthenticated) {
    router.push('/admin');
    return null;
  }

  /**
   * 处理表单输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (error) setError('');
  };

  /**
   * 处理登录提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        // 登录成功，跳转到管理后台
        router.push('/admin');
      } else {
        setError('登录失败，请检查用户名和密码');
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理第三方登录
   */
  const handleThirdPartyLogin = (provider: string) => {
    // 这里可以集成第三方登录逻辑
    console.log(`第三方登录: ${provider}`);
    // 暂时显示提示信息
    setError(`${provider} 登录功能正在开发中...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 登录卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* 标题 */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">管理后台登录</h1>
            <p className="text-white/70">请输入管理员凭据</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名输入 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors backdrop-blur-sm"
                  placeholder="请输入管理员用户名"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors backdrop-blur-sm"
                  placeholder="请输入密码"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 错误信息 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm"
              >
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            {/* 登录按钮 */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  登录中...
                </div>
              ) : (
                '登录管理后台'
              )}
            </motion.button>
          </form>

          {/* 第三方登录 */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/70">或使用第三方登录</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThirdPartyLogin('GitHub')}
                className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                disabled={isLoading}
              >
                <Github className="w-5 h-5 text-white mr-2" />
                <span className="text-sm font-medium text-white">GitHub</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThirdPartyLogin('QQ')}
                className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                disabled={isLoading}
              >
                <MessageCircle className="w-5 h-5 text-white mr-2" />
                <span className="text-sm font-medium text-white">QQ</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThirdPartyLogin('Gitee')}
                className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                disabled={isLoading}
              >
                <Cloud className="w-5 h-5 text-white mr-2" />
                <span className="text-sm font-medium text-white">Gitee</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThirdPartyLogin('Alibaba Cloud')}
                className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                disabled={isLoading}
              >
                <UploadCloud className="w-5 h-5 text-white mr-2" />
                <span className="text-sm font-medium text-white">阿里云</span>
              </motion.button>
            </div>
          </div>

          {/* 返回首页链接 */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              ← 返回首页
            </button>
          </div>
        </div>

        {/* 页脚信息 */}
        <div className="text-center mt-8 text-white/50 text-sm">
          <p>© 2024 MyBlog Admin. 管理后台登录。</p>
        </div>
      </motion.div>
    </div>
  );
}