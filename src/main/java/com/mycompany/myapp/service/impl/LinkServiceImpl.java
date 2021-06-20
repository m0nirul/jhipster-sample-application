package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Link;
import com.mycompany.myapp.repository.LinkRepository;
import com.mycompany.myapp.service.LinkService;
import com.mycompany.myapp.service.dto.LinkDTO;
import com.mycompany.myapp.service.mapper.LinkMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Link}.
 */
@Service
@Transactional
public class LinkServiceImpl implements LinkService {

    private final Logger log = LoggerFactory.getLogger(LinkServiceImpl.class);

    private final LinkRepository linkRepository;

    private final LinkMapper linkMapper;

    public LinkServiceImpl(LinkRepository linkRepository, LinkMapper linkMapper) {
        this.linkRepository = linkRepository;
        this.linkMapper = linkMapper;
    }

    @Override
    public LinkDTO save(LinkDTO linkDTO) {
        log.debug("Request to save Link : {}", linkDTO);
        Link link = linkMapper.toEntity(linkDTO);
        link = linkRepository.save(link);
        return linkMapper.toDto(link);
    }

    @Override
    public Optional<LinkDTO> partialUpdate(LinkDTO linkDTO) {
        log.debug("Request to partially update Link : {}", linkDTO);

        return linkRepository
            .findById(linkDTO.getId())
            .map(
                existingLink -> {
                    linkMapper.partialUpdate(existingLink, linkDTO);
                    return existingLink;
                }
            )
            .map(linkRepository::save)
            .map(linkMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LinkDTO> findAll() {
        log.debug("Request to get all Links");
        return linkRepository.findAll().stream().map(linkMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LinkDTO> findOne(Long id) {
        log.debug("Request to get Link : {}", id);
        return linkRepository.findById(id).map(linkMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Link : {}", id);
        linkRepository.deleteById(id);
    }
}
