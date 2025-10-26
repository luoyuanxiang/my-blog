# 网站图标和头像

本目录包含了为个人博客网站生成的图标和头像文件。

## 文件说明

### 网站图标
- `favicon.svg` - SVG格式的网站图标（32x32）
- `favicon.ico` - ICO格式的网站图标（32x32）
- `logo.svg` - SVG格式的网站Logo（64x64）

### 博主头像
- `avatar.svg` - SVG格式的博主头像（120x120）
- `blogger-avatar.svg` - SVG格式的博主头像（200x200）

## 设计特点

### 网站图标
- **主题**: 现代化博客图标
- **元素**: 书本 + 代码符号
- **颜色**: 蓝色到紫色的渐变
- **风格**: 简洁、现代、专业

### 博主头像
- **主题**: 友好的技术博主形象
- **元素**: 简化的卡通人物 + 代码装饰
- **颜色**: 蓝色到紫色的渐变背景
- **风格**: 温馨、专业、技术感

## 使用方式

### 在HTML中使用
```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- Logo -->
<img src="/logo.svg" alt="网站Logo" width="64" height="64">

<!-- 博主头像 -->
<img src="/blogger-avatar.svg" alt="博主头像" width="200" height="200">
```

### 在React组件中使用
```tsx
import Image from 'next/image';

// Logo
<Image src="/logo.svg" alt="网站Logo" width={64} height={64} />

// 博主头像
<Image src="/blogger-avatar.svg" alt="博主头像" width={200} height={200} />
```

## 自定义

所有图标都是SVG格式，可以通过以下方式自定义：

1. **颜色**: 修改渐变定义中的颜色值
2. **大小**: SVG是矢量格式，可以任意缩放
3. **元素**: 可以添加或修改装饰性元素

## 技术规格

- **格式**: SVG（矢量）+ ICO（位图）
- **分辨率**: 矢量格式，支持任意缩放
- **兼容性**: 现代浏览器完全支持
- **文件大小**: SVG文件通常小于5KB

## 更新记录

- 2024-10-25: 创建初始版本
- 包含网站图标、Logo和博主头像
- 采用现代化设计风格
- 支持深色和浅色主题
