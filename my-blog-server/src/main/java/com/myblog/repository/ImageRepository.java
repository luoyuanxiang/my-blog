package com.myblog.repository;

import com.myblog.entity.Image;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 图片数据访问层
 */
@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    /**
     * 根据文件名查找图片
     */
    Optional<Image> findByFilename(String filename);

    /**
     * 根据URL查找图片
     */
    Optional<Image> findByUrl(String url);

    /**
     * 查找未删除的图片
     */
    Page<Image> findByIsDeletedFalse(Pageable pageable);

    /**
     * 根据上传者查找图片
     */
    Page<Image> findByUploadedByAndIsDeletedFalse(String uploadedBy, Pageable pageable);

    /**
     * 根据存储类型查找图片
     */
    Page<Image> findByStorageTypeAndIsDeletedFalse(String storageType, Pageable pageable);

    /**
     * 搜索图片（按文件名、原始文件名、描述）
     */
    @Query("SELECT i FROM Image i WHERE i.isDeleted = false AND " +
           "(LOWER(i.filename) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.originalFilename) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Image> searchImages(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 统计未删除的图片数量
     */
    long countByIsDeletedFalse();

    /**
     * 统计指定上传者的图片数量
     */
    long countByUploadedByAndIsDeletedFalse(String uploadedBy);

    /**
     * 统计指定存储类型的图片数量
     */
    long countByStorageTypeAndIsDeletedFalse(String storageType);

    /**
     * 计算总文件大小
     */
    @Query("SELECT COALESCE(SUM(i.fileSize), 0) FROM Image i WHERE i.isDeleted = false")
    long getTotalFileSize();

    /**
     * 计算指定上传者的文件大小
     */
    @Query("SELECT COALESCE(SUM(i.fileSize), 0) FROM Image i WHERE i.uploadedBy = :uploadedBy AND i.isDeleted = false")
    long getTotalFileSizeByUploader(@Param("uploadedBy") String uploadedBy);

    /**
     * 查找最近上传的图片
     */
    List<Image> findTop10ByIsDeletedFalseOrderByCreatedAtDesc();

    /**
     * 查找指定时间范围内上传的图片
     */
    @Query("SELECT i FROM Image i WHERE i.isDeleted = false AND i.createdAt BETWEEN :startTime AND :endTime")
    List<Image> findByCreatedAtBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 根据文件类型查找图片
     */
    Page<Image> findByContentTypeContainingAndIsDeletedFalse(String contentType, Pageable pageable);

    /**
     * 查找大文件（超过指定大小）
     */
    @Query("SELECT i FROM Image i WHERE i.isDeleted = false AND i.fileSize > :minSize")
    Page<Image> findLargeFiles(@Param("minSize") long minSize, Pageable pageable);
}
