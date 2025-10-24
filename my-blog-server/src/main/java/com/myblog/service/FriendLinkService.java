package com.myblog.service;

import com.myblog.dto.FriendLinkDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 友情链接服务接口
 * 定义友情链接相关的业务逻辑方法
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
public interface FriendLinkService {
    
    /**
     * 创建新友链
     * @param friendLinkDTO 友链数据传输对象
     * @return 创建后的友链信息
     */
    FriendLinkDTO createFriendLink(FriendLinkDTO friendLinkDTO);
    
    /**
     * 更新友链信息
     * @param id 友链ID
     * @param friendLinkDTO 友链数据传输对象
     * @return 更新后的友链信息
     */
    FriendLinkDTO updateFriendLink(Long id, FriendLinkDTO friendLinkDTO);
    
    /**
     * 删除友链
     * @param id 友链ID
     */
    void deleteFriendLink(Long id);
    
    /**
     * 根据ID获取友链详情
     * @param id 友链ID
     * @return 友链信息
     */
    FriendLinkDTO getFriendLinkById(Long id);
    
    /**
     * 分页获取友链列表
     * @param pageable 分页参数
     * @return 分页友链列表
     */
    PageResponse<FriendLinkDTO> getFriendLinks(Pageable pageable);
    
    /**
     * 获取已审核通过的友链列表
     * @return 已审核的友链列表
     */
    List<FriendLinkDTO> getApprovedFriendLinks();
    
    /**
     * 获取待审核的友链列表
     * @param pageable 分页参数
     * @return 分页待审核友链列表
     */
    PageResponse<FriendLinkDTO> getPendingFriendLinks(Pageable pageable);
    
    /**
     * 审核通过友链
     * @param id 友链ID
     * @return 审核后的友链信息
     */
    FriendLinkDTO approveFriendLink(Long id);
    
    /**
     * 拒绝友链
     * @param id 友链ID
     * @return 拒绝后的友链信息
     */
    FriendLinkDTO rejectFriendLink(Long id);
    
    /**
     * 增加友链点击量
     * @param id 友链ID
     */
    void incrementClickCount(Long id);
}
