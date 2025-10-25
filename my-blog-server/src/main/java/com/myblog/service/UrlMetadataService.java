package com.myblog.service;

import com.myblog.dto.UrlMetadataDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

/**
 * URL元数据服务
 */
@Service
public class UrlMetadataService {

    /**
     * 获取URL的元数据信息
     */
    public UrlMetadataDTO fetchUrlMetadata(String url) {
        UrlMetadataDTO metadata = new UrlMetadataDTO();
        metadata.setUrl(url);
        
        try {
            // 验证URL格式
            if (!isValidUrl(url)) {
                metadata.setSuccess(false);
                metadata.setError("无效的URL格式");
                return metadata;
            }
            
            // 确保URL有协议
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
                metadata.setUrl(url);
            }
            
            // 获取域名
            String domain = extractDomain(url);
            metadata.setDomain(domain);
            
            // 获取网页内容
            Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                .timeout(10000)
                .followRedirects(true)
                .get();
            
            // 获取标题
            String title = getTitle(doc);
            metadata.setTitle(title);
            
            // 获取描述
            String description = getDescription(doc);
            metadata.setDescription(description);
            
            // 获取favicon
            String favicon = getFavicon(doc, url);
            metadata.setLogo(favicon);
            
            metadata.setSuccess(true);
            
        } catch (IOException e) {
            metadata.setSuccess(false);
            metadata.setError("无法访问该URL: " + e.getMessage());
        } catch (Exception e) {
            metadata.setSuccess(false);
            metadata.setError("解析失败: " + e.getMessage());
        }
        
        return metadata;
    }
    
    /**
     * 验证URL格式
     */
    private boolean isValidUrl(String url) {
        try {
            new URL(url);
            return true;
        } catch (Exception e) {
            // 尝试添加协议后再次验证
            try {
                new URL("https://" + url);
                return true;
            } catch (Exception ex) {
                return false;
            }
        }
    }
    
    /**
     * 提取域名
     */
    private String extractDomain(String url) {
        try {
            URL urlObj = new URL(url);
            return urlObj.getHost();
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * 获取网页标题
     */
    private String getTitle(Document doc) {
        // 优先获取og:title
        Element ogTitle = doc.select("meta[property=og:title]").first();
        if (ogTitle != null && !ogTitle.attr("content").isEmpty()) {
            return ogTitle.attr("content");
        }
        
        // 获取twitter:title
        Element twitterTitle = doc.select("meta[name=twitter:title]").first();
        if (twitterTitle != null && !twitterTitle.attr("content").isEmpty()) {
            return twitterTitle.attr("content");
        }
        
        // 获取页面标题
        String title = doc.title();
        if (title != null && !title.isEmpty()) {
            return title;
        }
        
        return "";
    }
    
    /**
     * 获取网页描述
     */
    private String getDescription(Document doc) {
        // 优先获取og:description
        Element ogDesc = doc.select("meta[property=og:description]").first();
        if (ogDesc != null && !ogDesc.attr("content").isEmpty()) {
            return ogDesc.attr("content");
        }
        
        // 获取twitter:description
        Element twitterDesc = doc.select("meta[name=twitter:description]").first();
        if (twitterDesc != null && !twitterDesc.attr("content").isEmpty()) {
            return twitterDesc.attr("content");
        }
        
        // 获取meta description
        Element metaDesc = doc.select("meta[name=description]").first();
        if (metaDesc != null && !metaDesc.attr("content").isEmpty()) {
            return metaDesc.attr("content");
        }
        
        return "";
    }
    
    /**
     * 获取favicon
     */
    private String getFavicon(Document doc, String baseUrl) {
        // 优先获取apple-touch-icon
        Element appleIcon = doc.select("link[rel=apple-touch-icon]").first();
        if (appleIcon != null && !appleIcon.attr("href").isEmpty()) {
            return resolveUrl(appleIcon.attr("href"), baseUrl);
        }
        
        // 获取icon
        Element icon = doc.select("link[rel=icon]").first();
        if (icon != null && !icon.attr("href").isEmpty()) {
            return resolveUrl(icon.attr("href"), baseUrl);
        }
        
        // 获取shortcut icon
        Element shortcutIcon = doc.select("link[rel=shortcut icon]").first();
        if (shortcutIcon != null && !shortcutIcon.attr("href").isEmpty()) {
            return resolveUrl(shortcutIcon.attr("href"), baseUrl);
        }
        
        // 尝试获取og:image
        Element ogImage = doc.select("meta[property=og:image]").first();
        if (ogImage != null && !ogImage.attr("content").isEmpty()) {
            return resolveUrl(ogImage.attr("content"), baseUrl);
        }
        
        // 默认favicon路径
        try {
            URL urlObj = new URL(baseUrl);
            return urlObj.getProtocol() + "://" + urlObj.getHost() + "/favicon.ico";
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * 解析相对URL为绝对URL
     */
    private String resolveUrl(String url, String baseUrl) {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        
        if (url.startsWith("//")) {
            try {
                URL baseUrlObj = new URL(baseUrl);
                return baseUrlObj.getProtocol() + ":" + url;
            } catch (Exception e) {
                return url;
            }
        }
        
        if (url.startsWith("/")) {
            try {
                URL baseUrlObj = new URL(baseUrl);
                return baseUrlObj.getProtocol() + "://" + baseUrlObj.getHost() + url;
            } catch (Exception e) {
                return url;
            }
        }
        
        // 相对路径
        try {
            URL baseUrlObj = new URL(baseUrl);
            String basePath = baseUrlObj.getPath();
            if (basePath.endsWith("/")) {
                return baseUrlObj.getProtocol() + "://" + baseUrlObj.getHost() + basePath + url;
            } else {
                String parentPath = basePath.substring(0, basePath.lastIndexOf("/") + 1);
                return baseUrlObj.getProtocol() + "://" + baseUrlObj.getHost() + parentPath + url;
            }
        } catch (Exception e) {
            return url;
        }
    }
}
