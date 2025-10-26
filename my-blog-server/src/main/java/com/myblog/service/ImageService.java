package com.myblog.service;

import com.myblog.dto.ImageDTO;
import com.myblog.entity.Image;
import com.myblog.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 图片服务类
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService {

    private final ImageRepository imageRepository;
    private final SystemSettingService systemSettingService;

    /**
     * 上传图片
     */
    @Transactional
    public ImageDTO uploadImage(MultipartFile file, String description, String uploadedBy) throws IOException {
        // 验证文件
        validateImageFile(file);

        // 获取存储配置
        String storageType = getStorageType();
        
        // 生成文件名和路径
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("文件名不能为空");
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = System.currentTimeMillis() + "_" + originalFilename;
        String filePath = "./uploads/images/" + filename;
        String url = "/api/images/" + filename;
        
        // 保存文件到本地
        java.io.File uploadDir = new java.io.File("/uploads/images/");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        
        java.io.File targetFile = new java.io.File(uploadDir, filename);
        Files.copy(file.getInputStream(), targetFile.toPath());

        // 创建图片记录
        Image image = new Image();
        image.setFilename(filename);
        image.setOriginalFilename(originalFilename);
        image.setFilePath(filePath);
        image.setUrl(url);
        image.setFileSize(file.getSize());
        image.setContentType(file.getContentType());
        image.setExtension(extension);
        image.setDescription(description);
        image.setStorageType(storageType);
        image.setUploadedBy(uploadedBy);
        image.setIsDeleted(false);

        Image savedImage = imageRepository.save(image);
        log.info("图片上传成功: {}", savedImage.getUrl());

        return convertToDTO(savedImage);
    }

    /**
     * 获取图片列表（分页）
     */
    public Page<ImageDTO> getImages(int page, int size, String keyword, String uploadedBy, String storageType) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Image> imagePage;

        if (keyword != null && !keyword.trim().isEmpty()) {
            imagePage = imageRepository.searchImages(keyword.trim(), pageable);
        } else if (uploadedBy != null && !uploadedBy.trim().isEmpty()) {
            imagePage = imageRepository.findByUploadedByAndIsDeletedFalse(uploadedBy.trim(), pageable);
        } else if (storageType != null && !storageType.trim().isEmpty()) {
            imagePage = imageRepository.findByStorageTypeAndIsDeletedFalse(storageType.trim(), pageable);
        } else {
            imagePage = imageRepository.findByIsDeletedFalse(pageable);
        }

        return imagePage.map(this::convertToDTO);
    }

    /**
     * 根据ID获取图片
     */
    public Optional<ImageDTO> getImageById(Long id) {
        return imageRepository.findById(id)
                .filter(image -> !image.getIsDeleted())
                .map(this::convertToDTO);
    }

    /**
     * 根据URL获取图片
     */
    public Optional<ImageDTO> getImageByUrl(String url) {
        return imageRepository.findByUrl(url)
                .filter(image -> !image.getIsDeleted())
                .map(this::convertToDTO);
    }

    /**
     * 更新图片描述
     */
    @Transactional
    public Optional<ImageDTO> updateImageDescription(Long id, String description) {
        return imageRepository.findById(id)
                .filter(image -> !image.getIsDeleted())
                .map(image -> {
                    image.setDescription(description);
                    image.setUpdatedAt(LocalDateTime.now());
                    Image savedImage = imageRepository.save(image);
                    return convertToDTO(savedImage);
                });
    }

    /**
     * 删除图片（软删除）
     */
    @Transactional
    public boolean deleteImage(Long id) {
        return imageRepository.findById(id)
                .filter(image -> !image.getIsDeleted())
                .map(image -> {
                    image.setIsDeleted(true);
                    image.setUpdatedAt(LocalDateTime.now());
                    imageRepository.save(image);
                    log.info("图片删除成功: {}", image.getUrl());
                    return true;
                })
                .orElse(false);
    }

    /**
     * 批量删除图片
     */
    @Transactional
    public int batchDeleteImages(List<Long> ids) {
        int deletedCount = 0;
        for (Long id : ids) {
            if (deleteImage(id)) {
                deletedCount++;
            }
        }
        log.info("批量删除图片完成，共删除 {} 个", deletedCount);
        return deletedCount;
    }

    /**
     * 获取图片统计信息
     */
    public ImageStatsDTO getImageStats() {
        ImageStatsDTO stats = new ImageStatsDTO();
        stats.setTotalImages(imageRepository.countByIsDeletedFalse());
        stats.setTotalFileSize(imageRepository.getTotalFileSize());
        stats.setRecentImages(imageRepository.findTop10ByIsDeletedFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));

        // 按存储类型统计
        List<String> storageTypes = imageRepository.findByIsDeletedFalse(PageRequest.of(0, 1000))
                .getContent()
                .stream()
                .map(Image::getStorageType)
                .distinct()
                .collect(Collectors.toList());

        for (String storageType : storageTypes) {
            long count = imageRepository.countByStorageTypeAndIsDeletedFalse(storageType);
            stats.getStorageTypeStats().put(storageType, count);
        }

        return stats;
    }

    /**
     * 验证图片文件
     */
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("只支持图片文件");
        }

        // 检查文件大小（默认10MB）
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("文件大小不能超过10MB");
        }

        // 检查文件扩展名
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new IllegalArgumentException("文件名格式不正确");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "gif", "webp", "bmp", "svg");
        if (!allowedExtensions.contains(extension)) {
            throw new IllegalArgumentException("不支持的文件格式，支持的格式：jpg, jpeg, png, gif, webp, bmp, svg");
        }
    }

    /**
     * 获取存储类型
     */
    private String getStorageType() {
        // 从系统设置中获取存储类型，默认为local
        return systemSettingService.getSettingValue("image.storage.type", "local");
    }

    /**
     * 转换为DTO
     */
    private ImageDTO convertToDTO(Image image) {
        ImageDTO dto = new ImageDTO();
        dto.setId(image.getId());
        dto.setFilename(image.getFilename());
        dto.setOriginalFilename(image.getOriginalFilename());
        dto.setFilePath(image.getFilePath());
        dto.setUrl(image.getUrl());
        dto.setFileSize(image.getFileSize());
        dto.setContentType(image.getContentType());
        dto.setExtension(image.getExtension());
        dto.setWidth(image.getWidth());
        dto.setHeight(image.getHeight());
        dto.setDescription(image.getDescription());
        dto.setStorageType(image.getStorageType());
        dto.setUploadedBy(image.getUploadedBy());
        dto.setCreatedAt(image.getCreatedAt());
        dto.setUpdatedAt(image.getUpdatedAt());
        return dto;
    }

    /**
     * 图片统计DTO
     */
    public static class ImageStatsDTO {
        private long totalImages;
        private long totalFileSize;
        private List<ImageDTO> recentImages;
        private java.util.Map<String, Long> storageTypeStats = new java.util.HashMap<>();

        // Getters and Setters
        public long getTotalImages() { return totalImages; }
        public void setTotalImages(long totalImages) { this.totalImages = totalImages; }

        public long getTotalFileSize() { return totalFileSize; }
        public void setTotalFileSize(long totalFileSize) { this.totalFileSize = totalFileSize; }

        public List<ImageDTO> getRecentImages() { return recentImages; }
        public void setRecentImages(List<ImageDTO> recentImages) { this.recentImages = recentImages; }

        public java.util.Map<String, Long> getStorageTypeStats() { return storageTypeStats; }
        public void setStorageTypeStats(java.util.Map<String, Long> storageTypeStats) { this.storageTypeStats = storageTypeStats; }
    }
}
