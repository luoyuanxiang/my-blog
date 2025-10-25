package com.myblog.controller;

import com.myblog.dto.UrlMetadataDTO;
import com.myblog.service.UrlMetadataService;
import jakarta.annotation.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * URL元数据控制器
 */
@RestController
@RequestMapping("/url-metadata")
@CrossOrigin(origins = "*")
public class UrlMetadataController {

    @Resource
    private UrlMetadataService urlMetadataService;

    /**
     * 获取URL的元数据信息
     */
    @GetMapping("/fetch")
    public ResponseEntity<Map<String, Object>> fetchUrlMetadata(@RequestParam String url) {
        try {
            UrlMetadataDTO metadata = urlMetadataService.fetchUrlMetadata(url);
            return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "获取成功",
                "data", metadata
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "code", 500,
                "message", "获取失败: " + e.getMessage(),
                "data", null
            ));
        }
    }
}
