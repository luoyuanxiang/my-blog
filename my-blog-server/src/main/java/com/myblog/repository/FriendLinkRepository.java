package com.myblog.repository;

import com.myblog.entity.FriendLink;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 友链数据访问层
 */
@Repository
public interface FriendLinkRepository extends JpaRepository<FriendLink, Long> {

    /**
     * 查找已审核的友链
     */
    List<FriendLink> findByIsApprovedTrueOrderBySortOrderAsc();

    /**
     * 查找待审核的友链
     */
    Page<FriendLink> findByIsApprovedFalseOrderByCreatedAtDesc(Pageable pageable);

    /**
     * 统计已审核友链数
     */
    long countByIsApprovedTrue();

    /**
     * 统计待审核友链数
     */
    long countByIsApprovedFalse();

    /**
     * 统计指定时间范围内的友链数量
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
