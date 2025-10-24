package com.myblog.service.impl;

import com.myblog.dto.GuestbookMessageDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.GuestbookMessage;
import com.myblog.repository.GuestbookMessageRepository;
import com.myblog.service.GuestbookService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 留言板服务实现类
 */
@Service
@RequiredArgsConstructor
public class GuestbookServiceImpl implements GuestbookService {

    private final GuestbookMessageRepository guestbookMessageRepository;

    @Override
    @Transactional
    public GuestbookMessageDTO createMessage(GuestbookMessageDTO messageDTO) {
        GuestbookMessage message = new GuestbookMessage();
        BeanUtils.copyProperties(messageDTO, message);
        message = guestbookMessageRepository.save(message);
        return convertToDTO(message);
    }

    @Override
    @Transactional
    public GuestbookMessageDTO updateMessage(Long id, GuestbookMessageDTO messageDTO) {
        GuestbookMessage message = guestbookMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("留言不存在"));
        
        BeanUtils.copyProperties(messageDTO, message, "id", "createdAt");
        message = guestbookMessageRepository.save(message);
        return convertToDTO(message);
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        if (!guestbookMessageRepository.existsById(id)) {
            throw new RuntimeException("留言不存在");
        }
        guestbookMessageRepository.deleteById(id);
    }

    @Override
    public GuestbookMessageDTO getMessageById(Long id) {
        GuestbookMessage message = guestbookMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("留言不存在"));
        return convertToDTO(message);
    }

    @Override
    public PageResponse<GuestbookMessageDTO> getMessages(Pageable pageable) {
        Page<GuestbookMessage> page = guestbookMessageRepository.findAll(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public PageResponse<GuestbookMessageDTO> getApprovedMessages(Pageable pageable) {
        Page<GuestbookMessage> page = guestbookMessageRepository.findByIsApprovedTrueOrderByCreatedAtDesc(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public PageResponse<GuestbookMessageDTO> getPendingMessages(Pageable pageable) {
        Page<GuestbookMessage> page = guestbookMessageRepository.findByIsApprovedFalseOrderByCreatedAtDesc(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    @Transactional
    public GuestbookMessageDTO approveMessage(Long id) {
        GuestbookMessage message = guestbookMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("留言不存在"));
        message.setIsApproved(true);
        message = guestbookMessageRepository.save(message);
        return convertToDTO(message);
    }

    @Override
    @Transactional
    public GuestbookMessageDTO rejectMessage(Long id) {
        GuestbookMessage message = guestbookMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("留言不存在"));
        message.setIsApproved(false);
        message = guestbookMessageRepository.save(message);
        return convertToDTO(message);
    }

    @Override
    @Transactional
    public void incrementLikeCount(Long id) {
        GuestbookMessage message = guestbookMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("留言不存在"));
        message.setLikeCount(message.getLikeCount() + 1);
        guestbookMessageRepository.save(message);
    }

    @Override
    public List<GuestbookMessageDTO> getMessageReplies(Long parentId) {
        List<GuestbookMessage> replies = guestbookMessageRepository.findByParentIdOrderByCreatedAtAsc(parentId);
        return replies.stream().map(this::convertToDTO).toList();
    }

    private GuestbookMessageDTO convertToDTO(GuestbookMessage message) {
        GuestbookMessageDTO dto = new GuestbookMessageDTO();
        BeanUtils.copyProperties(message, dto);
        return dto;
    }
}
