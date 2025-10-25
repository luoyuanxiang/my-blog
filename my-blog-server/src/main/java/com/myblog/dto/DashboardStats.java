package com.myblog.dto;

import lombok.Data;

/**
 * 仪表盘统计数据传输对象
 * 用于返回管理端仪表盘的各种统计数据
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class DashboardStats {
    
    /** 文章总数 */
    private Long totalArticles;
    
    /** 已发布文章数 */
    private Long publishedArticles;
    
    /** 草稿文章数 */
    private Long draftArticles;
    
    /** 置顶文章数 */
    private Long pinnedArticles;
    
    /** 文章总浏览量 */
    private Long totalViews;
    
    /** 文章总点赞数 */
    private Long totalLikes;
    
    /** 分类总数 */
    private Long totalCategories;
    
    /** 标签总数 */
    private Long totalTags;
    
    /** 评论总数 */
    private Long totalComments;
    
    /** 已审核评论数 */
    private Long approvedComments;
    
    /** 待审核评论数 */
    private Long pendingComments;
    
    /** 友链总数 */
    private Long totalFriendLinks;
    
    /** 已审核友链数 */
    private Long approvedFriendLinks;
    
    /** 待审核友链数 */
    private Long pendingFriendLinks;
    
    /** 留言板消息总数 */
    private Long totalGuestbookMessages;
    
    /** 已审核留言数 */
    private Long approvedGuestbookMessages;
    
    /** 待审核留言数 */
    private Long pendingGuestbookMessages;
    
    /** 用户总数 */
    private Long totalUsers;
    
    /** 启用用户数 */
    private Long enabledUsers;
    
    /** 今日新增文章数 */
    private Long todayArticles;
    
    /** 今日新增评论数 */
    private Long todayComments;
    
    /** 今日新增留言数 */
    private Long todayGuestbookMessages;
    
    /** 今日新增友链数 */
    private Long todayFriendLinks;
}
