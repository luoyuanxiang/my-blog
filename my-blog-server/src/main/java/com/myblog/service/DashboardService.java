package com.myblog.service;

import com.myblog.dto.DashboardStats;
import com.myblog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 仪表盘服务类
 * 提供管理端仪表盘数据统计功能
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final FriendLinkRepository friendLinkRepository;
    private final GuestbookMessageRepository guestbookMessageRepository;
    private final UserRepository userRepository;

    /**
     * 获取仪表盘统计数据
     * @return 仪表盘统计数据
     */
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        // 文章统计
        stats.setTotalArticles(articleRepository.count());
        stats.setPublishedArticles(articleRepository.countByIsPublished(true));
        stats.setDraftArticles(articleRepository.countByIsPublished(false));
        stats.setPinnedArticles(articleRepository.countByIsPinned(true));
        
        // 文章浏览量和点赞数统计
        Long totalViews = articleRepository.sumViewCount();
        Long totalLikes = articleRepository.sumLikeCount();
        stats.setTotalViews(totalViews != null ? totalViews : 0L);
        stats.setTotalLikes(totalLikes != null ? totalLikes : 0L);
        
        // 分类和标签统计
        stats.setTotalCategories(categoryRepository.count());
        stats.setTotalTags(tagRepository.count());
        
        // 评论统计
        stats.setTotalComments(commentRepository.count());
        stats.setApprovedComments(commentRepository.countByIsApproved(true));
        stats.setPendingComments(commentRepository.countByIsApproved(false));
        
        // 友链统计
        stats.setTotalFriendLinks(friendLinkRepository.count());
        stats.setApprovedFriendLinks(friendLinkRepository.countByIsApprovedTrue());
        stats.setPendingFriendLinks(friendLinkRepository.countByIsApprovedFalse());
        
        // 留言板统计
        stats.setTotalGuestbookMessages(guestbookMessageRepository.count());
        stats.setApprovedGuestbookMessages(guestbookMessageRepository.countByIsApproved(true));
        stats.setPendingGuestbookMessages(guestbookMessageRepository.countByIsApproved(false));
        
        // 用户统计
        stats.setTotalUsers(userRepository.count());
        stats.setEnabledUsers(userRepository.countByIsEnabled(true));
        
        // 今日统计
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        stats.setTodayArticles(articleRepository.countByCreatedAtBetween(startOfDay, endOfDay));
        stats.setTodayComments(commentRepository.countByCreatedAtBetween(startOfDay, endOfDay));
        stats.setTodayGuestbookMessages(guestbookMessageRepository.countByCreatedAtBetween(startOfDay, endOfDay));
        stats.setTodayFriendLinks(friendLinkRepository.countByCreatedAtBetween(startOfDay, endOfDay));
        
        return stats;
    }
}
