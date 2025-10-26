package com.myblog.controller;

import com.myblog.dto.ImageDTO;
import com.myblog.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 图片管理控制器
 */
@RestController
@RequestMapping("/images")
@Tag(name = "图片管理", description = "图片上传、管理相关接口")
@Slf4j
public class ImageController {

    @Resource
    private ImageService imageService;

    /**
     * 上传图片
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "上传图片", description = "上传单张图片到服务器")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @Parameter(description = "图片文件") @RequestParam("file") MultipartFile file,
            @Parameter(description = "图片描述") @RequestParam(value = "description", required = false) String description,
            @Parameter(description = "上传者") @RequestParam(value = "uploadedBy", defaultValue = "admin") String uploadedBy) {
        
        try {
            ImageDTO imageDTO = imageService.uploadImage(file, description, uploadedBy);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "图片上传成功");
            response.put("data", imageDTO);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("图片上传参数错误: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("code", 400);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (IOException e) {
            log.error("图片上传失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "图片上传失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取图片列表
     */
    @GetMapping
    @Operation(summary = "获取图片列表", description = "分页获取图片列表，支持搜索和筛选")
    public ResponseEntity<Map<String, Object>> getImages(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(value = "size", defaultValue = "20") int size,
            @Parameter(description = "搜索关键词") @RequestParam(value = "keyword", required = false) String keyword,
            @Parameter(description = "上传者") @RequestParam(value = "uploadedBy", required = false) String uploadedBy,
            @Parameter(description = "存储类型") @RequestParam(value = "storageType", required = false) String storageType) {
        
        try {
            Page<ImageDTO> imagePage = imageService.getImages(page, size, keyword, uploadedBy, storageType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取图片列表成功");
            
            Map<String, Object> data = new HashMap<>();
            data.put("images", imagePage.getContent());
            data.put("totalElements", imagePage.getTotalElements());
            data.put("totalPages", imagePage.getTotalPages());
            data.put("currentPage", imagePage.getNumber());
            data.put("size", imagePage.getSize());
            data.put("hasNext", imagePage.hasNext());
            data.put("hasPrevious", imagePage.hasPrevious());
            
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取图片列表失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "获取图片列表失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 根据ID获取图片详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取图片详情", description = "根据ID获取图片详细信息")
    public ResponseEntity<Map<String, Object>> getImageById(
            @Parameter(description = "图片ID") @PathVariable Long id) {
        
        try {
            return imageService.getImageById(id)
                    .map(imageDTO -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("code", 200);
                        response.put("message", "获取图片详情成功");
                        response.put("data", imageDTO);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("code", 404);
                        response.put("message", "图片不存在");
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            log.error("获取图片详情失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "获取图片详情失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 更新图片描述
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新图片描述", description = "更新指定图片的描述信息")
    public ResponseEntity<Map<String, Object>> updateImageDescription(
            @Parameter(description = "图片ID") @PathVariable Long id,
            @Parameter(description = "图片描述") @RequestBody Map<String, String> request) {
        
        try {
            String description = request.get("description");
            return imageService.updateImageDescription(id, description)
                    .map(imageDTO -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("code", 200);
                        response.put("message", "更新图片描述成功");
                        response.put("data", imageDTO);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("code", 404);
                        response.put("message", "图片不存在");
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            log.error("更新图片描述失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "更新图片描述失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 删除图片
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除图片", description = "软删除指定图片")
    public ResponseEntity<Map<String, Object>> deleteImage(
            @Parameter(description = "图片ID") @PathVariable Long id) {
        
        try {
            boolean deleted = imageService.deleteImage(id);
            Map<String, Object> response = new HashMap<>();
            
            if (deleted) {
                response.put("code", 200);
                response.put("message", "图片删除成功");
            } else {
                response.put("code", 404);
                response.put("message", "图片不存在");
                return ResponseEntity.status(404).body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("删除图片失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "删除图片失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 批量删除图片
     */
    @DeleteMapping("/batch-delete")
    @Operation(summary = "批量删除图片", description = "批量软删除多个图片")
    public ResponseEntity<Map<String, Object>> batchDeleteImages(
            @Parameter(description = "图片ID列表") @RequestBody List<Long> ids) {
        
        try {
            int deletedCount = imageService.batchDeleteImages(ids);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", String.format("批量删除完成，共删除 %d 个图片", deletedCount));
            response.put("data", Map.of("deletedCount", deletedCount));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("批量删除图片失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "批量删除图片失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取图片统计信息
     */
    @GetMapping("/stats")
    @Operation(summary = "获取图片统计", description = "获取图片相关的统计信息")
    public ResponseEntity<Map<String, Object>> getImageStats() {
        try {
            ImageService.ImageStatsDTO stats = imageService.getImageStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取图片统计成功");
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取图片统计失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "获取图片统计失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
