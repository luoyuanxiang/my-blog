package com.myblog.service;

import com.myblog.dto.GuestbookMessageDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 留言板服务接口
 */
public interface GuestbookService {
    
    /**
     * 创建留言
     */
    GuestbookMessageDTO createMessage(GuestbookMessageDTO messageDTO);
    
    /**
     * 更新留言
     */
    GuestbookMessageDTO updateMessage(Long id, GuestbookMessageDTO messageDTO);
    
    /**
     * 删除留言
     */
    void deleteMessage(Long id);
    
    /**
     * 根据ID获取留言
     */
    GuestbookMessageDTO getMessageById(Long id);
    
    /**
     * 分页获取留言列表
     */
    PageResponse<GuestbookMessageDTO> getMessages(Pageable pageable);
    
    /**
     * 获取已审核的留言
     */
    PageResponse<GuestbookMessageDTO> getApprovedMessages(Pageable pageable);
    
    /**
     * 获取待审核的留言
     */
    PageResponse<GuestbookMessageDTO> getPendingMessages(Pageable pageable);
    
    /**
     * 审核留言
     */
    GuestbookMessageDTO approveMessage(Long id);
    
    /**
     * 拒绝留言
     */
    GuestbookMessageDTO rejectMessage(Long id);
    
    /**
     * 增加点赞数
     */
    void incrementLikeCount(Long id);
    
    /**
     * 获取留言的回复
     */
    List<GuestbookMessageDTO> getMessageReplies(Long parentId);
}
