package com.myblog.service;

import com.myblog.dto.GuestbookMessageDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 留言板服务接口
 * 定义留言板相关的业务逻辑方法
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
public interface GuestbookService {
    
    /**
     * 创建新留言
     * @param messageDTO 留言数据传输对象
     * @return 创建后的留言信息
     */
    GuestbookMessageDTO createMessage(GuestbookMessageDTO messageDTO);
    
    /**
     * 更新留言信息
     * @param id 留言ID
     * @param messageDTO 留言数据传输对象
     * @return 更新后的留言信息
     */
    GuestbookMessageDTO updateMessage(Long id, GuestbookMessageDTO messageDTO);
    
    /**
     * 删除留言
     * @param id 留言ID
     */
    void deleteMessage(Long id);
    
    /**
     * 根据ID获取留言详情
     * @param id 留言ID
     * @return 留言信息
     */
    GuestbookMessageDTO getMessageById(Long id);
    
    /**
     * 分页获取留言列表
     * @param pageable 分页参数
     * @return 分页留言列表
     */
    PageResponse<GuestbookMessageDTO> getMessages(Pageable pageable);
    
    /**
     * 获取已审核通过的留言列表
     * @param pageable 分页参数
     * @return 分页已审核留言列表
     */
    PageResponse<GuestbookMessageDTO> getApprovedMessages(Pageable pageable);
    
    /**
     * 获取待审核的留言列表
     * @param pageable 分页参数
     * @return 分页待审核留言列表
     */
    PageResponse<GuestbookMessageDTO> getPendingMessages(Pageable pageable);
    
    /**
     * 审核通过留言
     * @param id 留言ID
     * @return 审核后的留言信息
     */
    GuestbookMessageDTO approveMessage(Long id);
    
    /**
     * 拒绝留言
     * @param id 留言ID
     * @return 拒绝后的留言信息
     */
    GuestbookMessageDTO rejectMessage(Long id);
    
    /**
     * 增加留言点赞数
     * @param id 留言ID
     */
    void incrementLikeCount(Long id);
    
    /**
     * 获取留言的回复列表
     * @param parentId 父留言ID
     * @return 回复列表
     */
    List<GuestbookMessageDTO> getMessageReplies(Long parentId);
}
