'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  User,
  Palette,
  Shield,
  Database,
  Bell,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { systemSettingApiService } from '@/lib/api/system-settings';
import type { SystemSetting } from '@/types';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // 本地设置状态，用于UI绑定
  const [settings, setSettings] = useState({
    // 基本信息
    siteName: '个人博客',
    siteDescription: '分享技术文章，记录学习心得',
    siteUrl: 'https://example.com',
    adminEmail: 'admin@example.com',
    adminName: '管理员',
    
    // 外观设置
    theme: 'auto',
    primaryColor: '#3b82f6',
    logo: '',
    favicon: '',
    
    // 安全设置
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    
    // 通知设置
    emailNotifications: true,
    commentNotifications: true,
    systemNotifications: true,
    
    // 系统设置
    autoBackup: true,
    backupFrequency: 'daily',
    maxFileSize: '10MB',
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
  });

  // 获取系统设置
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await systemSettingApiService.getAllSettings();
        if (response.code === 200 && response.data) {
          setSystemSettings(response.data);
          // 将后端设置映射到本地状态
          mapSettingsToLocal(response.data);
        } else {
          setError('获取系统设置失败');
        }
      } catch (err: any) {
        setError(err.message || '获取系统设置失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 将后端设置映射到本地状态
  const mapSettingsToLocal = (settings: SystemSetting[]) => {
    const settingMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    setSettings(prev => ({
      ...prev,
      siteName: settingMap['site.title'] || prev.siteName,
      siteDescription: settingMap['site.description'] || prev.siteDescription,
      siteUrl: settingMap['site.url'] || prev.siteUrl,
      adminEmail: settingMap['site.email'] || prev.adminEmail,
      adminName: settingMap['site.author'] || prev.adminName,
      logo: settingMap['site.logo'] || prev.logo,
      favicon: settingMap['site.favicon'] || prev.favicon,
      emailNotifications: settingMap['notification.email'] === 'true',
      commentNotifications: settingMap['notification.comment'] === 'true',
      systemNotifications: settingMap['notification.system'] === 'true',
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      // 将本地设置转换为系统设置格式
      const settingsToUpdate: SystemSetting[] = [
        { id: 0, key: 'site.title', value: settings.siteName, description: '网站标题', settingType: 'string', isPublic: true, createdAt: '', updatedAt: '' },
        { id: 0, key: 'site.description', value: settings.siteDescription, description: '网站描述', settingType: 'string', isPublic: true, createdAt: '', updatedAt: '' },
        { id: 0, key: 'site.url', value: settings.siteUrl, description: '网站地址', settingType: 'string', isPublic: true, createdAt: '', updatedAt: '' },
        { id: 0, key: 'site.email', value: settings.adminEmail, description: '联系邮箱', settingType: 'string', isPublic: true, createdAt: '', updatedAt: '' },
        { id: 0, key: 'site.author', value: settings.adminName, description: '网站作者', settingType: 'string', isPublic: true, createdAt: '', updatedAt: '' },
        { id: 0, key: 'site.logo', value: settings.logo, description: 'Logo链接', settingType: 'string', isPublic: true, createdAt: '', updatedAt: '' },
        { id: 0, key: 'site.favicon', value: settings.favicon, description: 'Favicon链接', settingType: 'string', isPublic: true, createdAt: '', updatedAt: '' },
        { id: 0, key: 'notification.email', value: settings.emailNotifications.toString(), description: '邮件通知', settingType: 'boolean', isPublic: false, createdAt: '', updatedAt: '' },
        { id: 0, key: 'notification.comment', value: settings.commentNotifications.toString(), description: '评论通知', settingType: 'boolean', isPublic: false, createdAt: '', updatedAt: '' },
        { id: 0, key: 'notification.system', value: settings.systemNotifications.toString(), description: '系统通知', settingType: 'boolean', isPublic: false, createdAt: '', updatedAt: '' },
      ];

      // 使用现有的系统设置ID更新
      const updatedSettings = settingsToUpdate.map(setting => {
        const existingSetting = systemSettings.find(s => s.key === setting.key);
        return existingSetting ? { ...setting, id: existingSetting.id } : setting;
      });

      const response = await systemSettingApiService.updateSettings(updatedSettings);
      if (response.code === 200) {
        // 重新获取设置以确保数据同步
        const refreshResponse = await systemSettingApiService.getAllSettings();
        if (refreshResponse.code === 200 && refreshResponse.data) {
          setSystemSettings(refreshResponse.data);
          mapSettingsToLocal(refreshResponse.data);
        }
        alert('设置保存成功！');
      } else {
        setError('保存设置失败');
      }
    } catch (err: any) {
      console.error('保存设置失败:', err);
      setError(err.message || '保存设置失败');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', name: '基本信息', icon: User },
    { id: 'appearance', name: '外观设置', icon: Palette },
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'notifications', name: '通知设置', icon: Bell },
    { id: 'system', name: '系统设置', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-600">管理博客系统的基本配置和设置</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* 基本信息 */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">基本信息</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      网站名称
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      网站地址
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      网站描述
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      管理员姓名
                    </label>
                    <input
                      type="text"
                      value={settings.adminName}
                      onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      管理员邮箱
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 外观设置 */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">外观设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主题模式
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="auto">跟随系统</option>
                      <option value="light">浅色模式</option>
                      <option value="dark">深色模式</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主色调
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo 链接
                    </label>
                    <input
                      type="url"
                      value={settings.logo}
                      onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon 链接
                    </label>
                    <input
                      type="url"
                      value={settings.favicon}
                      onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 安全设置 */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">安全设置</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      当前密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settings.currentPassword}
                        onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      新密码
                    </label>
                    <input
                      type="password"
                      value={settings.newPassword}
                      onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      确认新密码
                    </label>
                    <input
                      type="password"
                      value={settings.confirmPassword}
                      onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      启用双因素认证
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 通知设置 */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">通知设置</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">邮件通知</h3>
                      <p className="text-sm text-gray-500">接收系统邮件通知</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">评论通知</h3>
                      <p className="text-sm text-gray-500">新评论时发送通知</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.commentNotifications}
                      onChange={(e) => setSettings({ ...settings, commentNotifications: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">系统通知</h3>
                      <p className="text-sm text-gray-500">系统更新和维护通知</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.systemNotifications}
                      onChange={(e) => setSettings({ ...settings, systemNotifications: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 系统设置 */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">系统设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      自动备份
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">启用自动备份</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      备份频率
                    </label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">每日</option>
                      <option value="weekly">每周</option>
                      <option value="monthly">每月</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最大文件大小
                    </label>
                    <input
                      type="text"
                      value={settings.maxFileSize}
                      onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      允许的文件类型
                    </label>
                    <input
                      type="text"
                      value={settings.allowedFileTypes}
                      onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 保存按钮 */}
            <div className="flex items-center justify-end pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: isSaving ? 1 : 1.02 }}
                whileTap={{ scale: isSaving ? 1 : 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 ${
                  isSaving 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                }`}
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? '保存中...' : '保存设置'}</span>
              </motion.button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
