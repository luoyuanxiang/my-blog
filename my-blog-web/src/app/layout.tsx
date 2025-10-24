import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "我的博客 - 分享技术，记录生活",
    description: "一个现代化的个人博客网站，分享技术文章、生活感悟，记录成长的足迹。",
    keywords: ["博客", "技术", "前端", "React", "Next.js", "JavaScript"],
    authors: [{name: "作者"}],
    creator: "作者",
    openGraph: {
        type: "website",
        locale: "zh_CN",
        url: "https://myblog.com",
        title: "我的博客 - 分享技术，记录生活",
        description: "一个现代化的个人博客网站，分享技术文章、生活感悟，记录成长的足迹。",
        siteName: "我的博客",
    },
    twitter: {
        card: "summary_large_image",
        title: "我的博客 - 分享技术，记录生活",
        description: "一个现代化的个人博客网站，分享技术文章、生活感悟，记录成长的足迹。",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
