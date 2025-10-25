package com.myblog.repository;

import com.myblog.entity.GuestbookMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 留言板数据访问层
 */
@Repository
public interface GuestbookMessageRepository extends JpaRepository<GuestbookMessage, Long> {

    /**
     * 查找已审核的留言
     */
    Page<GuestbookMessage> findByIsApprovedTrueOrderByCreatedAtDesc(Pageable pageable);

    /**
     * 查找待审核的留言
     */
    Page<GuestbookMessage> findByIsApprovedFalseOrderByCreatedAtDesc(Pageable pageable);

    /**
     * 根据父留言ID查找子留言
     */
    List<GuestbookMessage> findByParentIdOrderByCreatedAtAsc(Long parentId);

    /**
     * 统计已审核留言数
     */
    long countByIsApprovedTrue();

    /**
     * 统计待审核留言数
     */
    long countByIsApprovedFalse();

    /**
     * 统计已审核留言数
     */
    long countByIsApproved(Boolean isApproved);

    /**
     * 统计指定时间范围内的留言数量
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
