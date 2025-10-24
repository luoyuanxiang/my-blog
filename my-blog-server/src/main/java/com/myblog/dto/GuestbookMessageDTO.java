package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 留言板消息数据传输对象
 * 用于在API接口中传输留言板数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class GuestbookMessageDTO {
    
    /** 留言唯一标识符 */
    private Long id;
    
    /** 留言作者姓名 */
    private String author;
    
    /** 留言作者邮箱 */
    private String email;
    
    /** 留言作者网站 */
    private String website;
    
    /** 留言内容 */
    private String content;
    
    /** 父留言ID（用于嵌套回复） */
    private Long parentId;
    
    /** 留言是否已审核通过 */
    private Boolean isApproved;
    
    /** 留言点赞次数 */
    private Integer likeCount;
    
    /** 留言者IP地址 */
    private String ipAddress;
    
    /** 留言者浏览器信息 */
    private String userAgent;
    
    /** 留言创建时间 */
    private LocalDateTime createdAt;
    
    /** 留言最后更新时间 */
    private LocalDateTime updatedAt;
    
    /** 留言的回复列表 */
    private List<GuestbookMessageDTO> replies;
}
