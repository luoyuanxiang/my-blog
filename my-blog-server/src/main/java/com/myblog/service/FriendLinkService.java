package com.myblog.service;

import com.myblog.dto.FriendLinkDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 友链服务接口
 */
public interface FriendLinkService {
    
    /**
     * 创建友链
     */
    FriendLinkDTO createFriendLink(FriendLinkDTO friendLinkDTO);
    
    /**
     * 更新友链
     */
    FriendLinkDTO updateFriendLink(Long id, FriendLinkDTO friendLinkDTO);
    
    /**
     * 删除友链
     */
    void deleteFriendLink(Long id);
    
    /**
     * 根据ID获取友链
     */
    FriendLinkDTO getFriendLinkById(Long id);
    
    /**
     * 分页获取友链列表
     */
    PageResponse<FriendLinkDTO> getFriendLinks(Pageable pageable);
    
    /**
     * 获取已审核的友链
     */
    List<FriendLinkDTO> getApprovedFriendLinks();
    
    /**
     * 获取待审核的友链
     */
    PageResponse<FriendLinkDTO> getPendingFriendLinks(Pageable pageable);
    
    /**
     * 审核友链
     */
    FriendLinkDTO approveFriendLink(Long id);
    
    /**
     * 拒绝友链
     */
    FriendLinkDTO rejectFriendLink(Long id);
    
    /**
     * 增加点击量
     */
    void incrementClickCount(Long id);
}
