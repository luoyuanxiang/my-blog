package com.myblog.service;

import com.myblog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 博客统计服务类
 * 提供前端首页所需的统计数据
 */
@Service
@RequiredArgsConstructor
public class BlogStatsService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final FriendLinkRepository friendLinkRepository;
    private final GuestbookMessageRepository guestbookMessageRepository;

    /**
     * 获取公共博客统计
     * @return 博客统计数据
     */
    public Map<String, Object> getPublicBlogStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 文章统计
        stats.put("totalArticles", articleRepository.count());
        stats.put("publishedArticles", articleRepository.countByIsPublished(true));
        
        // 文章浏览量和点赞数统计
        Long totalViews = articleRepository.sumViewCount();
        Long totalLikes = articleRepository.sumLikeCount();
        stats.put("totalViews", totalViews != null ? totalViews : 0L);
        stats.put("totalLikes", totalLikes != null ? totalLikes : 0L);
        
        // 分类和标签统计
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalTags", tagRepository.count());
        
        // 评论统计（只统计已审核的）
        stats.put("totalComments", commentRepository.countByIsApproved(true));
        
        // 友链统计（只统计已审核的）
        stats.put("totalFriendLinks", friendLinkRepository.countByIsApprovedTrue());
        
        // 留言板统计（只统计已审核的）
        stats.put("totalGuestbookMessages", guestbookMessageRepository.countByIsApproved(true));
        
        return stats;
    }
}
