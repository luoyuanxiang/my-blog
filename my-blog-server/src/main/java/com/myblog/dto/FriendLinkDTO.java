package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 友情链接数据传输对象
 * 用于在API接口中传输友链数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class FriendLinkDTO {
    
    /** 友链唯一标识符 */
    private Long id;
    
    /** 友链网站名称 */
    private String name;
    
    /** 友链网站URL */
    private String url;
    
    /** 友链网站描述 */
    private String description;
    
    /** 友链网站Logo图片URL */
    private String logo;
    
    /** 友链是否已审核通过 */
    private Boolean isApproved;
    
    /** 友链排序顺序 */
    private Integer sortOrder;
    
    /** 友链点击次数 */
    private Integer clickCount;
    
    /** 友链申请者邮箱 */
    private String email;
    
    /** 友链创建时间 */
    private LocalDateTime createdAt;
    
    /** 友链最后更新时间 */
    private LocalDateTime updatedAt;
}
