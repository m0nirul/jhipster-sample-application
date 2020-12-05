package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.service.SignatureService;
import com.mycompany.myapp.domain.Signature;
import com.mycompany.myapp.repository.SignatureRepository;
import com.mycompany.myapp.repository.SignatureValidationRepository;
import com.mycompany.myapp.service.dto.SignatureDTO;
import com.mycompany.myapp.service.mapper.SignatureMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Signature}.
 */
@Service
@Transactional
public class SignatureServiceImpl implements SignatureService {

    private final Logger log = LoggerFactory.getLogger(SignatureServiceImpl.class);

    private final SignatureRepository signatureRepository;

    private final SignatureMapper signatureMapper;

    private final SignatureValidationRepository signatureValidationRepository;

    public SignatureServiceImpl(SignatureRepository signatureRepository, SignatureMapper signatureMapper, SignatureValidationRepository signatureValidationRepository) {
        this.signatureRepository = signatureRepository;
        this.signatureMapper = signatureMapper;
        this.signatureValidationRepository = signatureValidationRepository;
    }

    @Override
    public SignatureDTO save(SignatureDTO signatureDTO) {
        log.debug("Request to save Signature : {}", signatureDTO);
        Signature signature = signatureMapper.toEntity(signatureDTO);
        Long signatureValidationId = signatureDTO.getSignatureValidationId();
        signatureValidationRepository.findById(signatureValidationId).ifPresent(signature::signatureValidation);
        signature = signatureRepository.save(signature);
        return signatureMapper.toDto(signature);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SignatureDTO> findAll() {
        log.debug("Request to get all Signatures");
        return signatureRepository.findAll().stream()
            .map(signatureMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<SignatureDTO> findOne(Long id) {
        log.debug("Request to get Signature : {}", id);
        return signatureRepository.findById(id)
            .map(signatureMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Signature : {}", id);
        signatureRepository.deleteById(id);
    }
}
