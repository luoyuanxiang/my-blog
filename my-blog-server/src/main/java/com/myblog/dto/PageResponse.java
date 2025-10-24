package com.myblog.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 分页响应数据传输对象
 * 用于封装分页查询的结果数据
 * 
 * @param <T> 分页数据的泛型类型
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class PageResponse<T> {
    
    /** 当前页的数据列表 */
    private List<T> content;
    
    /** 总记录数 */
    private long totalElements;
    
    /** 总页数 */
    private int totalPages;
    
    /** 每页大小 */
    private int size;
    
    /** 当前页码（从0开始） */
    private int number;
    
    /** 是否为第一页 */
    private boolean first;
    
    /** 是否为最后一页 */
    private boolean last;
    
    /** 当前页实际元素数量 */
    private int numberOfElements;

    /**
     * 从Spring Data Page对象构造分页响应
     * @param page Spring Data Page对象
     */
    public PageResponse(Page<T> page) {
        this.content = page.getContent();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.size = page.getSize();
        this.number = page.getNumber();
        this.first = page.isFirst();
        this.last = page.isLast();
        this.numberOfElements = page.getNumberOfElements();
    }
}
