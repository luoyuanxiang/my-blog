package com.myblog.service.impl;

import com.myblog.dto.FriendLinkDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.FriendLink;
import com.myblog.repository.FriendLinkRepository;
import com.myblog.service.FriendLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 友链服务实现类
 */
@Service
@RequiredArgsConstructor
public class FriendLinkServiceImpl implements FriendLinkService {

    private final FriendLinkRepository friendLinkRepository;

    @Override
    @Transactional
    public FriendLinkDTO createFriendLink(FriendLinkDTO friendLinkDTO) {
        FriendLink friendLink = new FriendLink();
        BeanUtils.copyProperties(friendLinkDTO, friendLink);
        friendLink = friendLinkRepository.save(friendLink);
        return convertToDTO(friendLink);
    }

    @Override
    @Transactional
    public FriendLinkDTO updateFriendLink(Long id, FriendLinkDTO friendLinkDTO) {
        FriendLink friendLink = friendLinkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("友链不存在"));
        
        BeanUtils.copyProperties(friendLinkDTO, friendLink, "id", "createdAt");
        friendLink = friendLinkRepository.save(friendLink);
        return convertToDTO(friendLink);
    }

    @Override
    @Transactional
    public void deleteFriendLink(Long id) {
        if (!friendLinkRepository.existsById(id)) {
            throw new RuntimeException("友链不存在");
        }
        friendLinkRepository.deleteById(id);
    }

    @Override
    public FriendLinkDTO getFriendLinkById(Long id) {
        FriendLink friendLink = friendLinkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("友链不存在"));
        return convertToDTO(friendLink);
    }

    @Override
    public PageResponse<FriendLinkDTO> getFriendLinks(Pageable pageable) {
        Page<FriendLink> page = friendLinkRepository.findAll(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public List<FriendLinkDTO> getApprovedFriendLinks() {
        List<FriendLink> friendLinks = friendLinkRepository.findByIsApprovedTrueOrderBySortOrderAsc();
        return friendLinks.stream().map(this::convertToDTO).toList();
    }

    @Override
    public PageResponse<FriendLinkDTO> getPendingFriendLinks(Pageable pageable) {
        Page<FriendLink> page = friendLinkRepository.findByIsApprovedFalseOrderByCreatedAtDesc(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    @Transactional
    public FriendLinkDTO approveFriendLink(Long id) {
        FriendLink friendLink = friendLinkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("友链不存在"));
        friendLink.setIsApproved(true);
        friendLink = friendLinkRepository.save(friendLink);
        return convertToDTO(friendLink);
    }

    @Override
    @Transactional
    public FriendLinkDTO rejectFriendLink(Long id) {
        FriendLink friendLink = friendLinkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("友链不存在"));
        friendLink.setIsApproved(false);
        friendLink = friendLinkRepository.save(friendLink);
        return convertToDTO(friendLink);
    }

    @Override
    @Transactional
    public void incrementClickCount(Long id) {
        FriendLink friendLink = friendLinkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("友链不存在"));
        friendLink.setClickCount(friendLink.getClickCount() + 1);
        friendLinkRepository.save(friendLink);
    }

    private FriendLinkDTO convertToDTO(FriendLink friendLink) {
        FriendLinkDTO dto = new FriendLinkDTO();
        BeanUtils.copyProperties(friendLink, dto);
        return dto;
    }
}
