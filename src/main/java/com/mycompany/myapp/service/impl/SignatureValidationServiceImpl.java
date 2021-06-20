package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.SignatureValidation;
import com.mycompany.myapp.repository.SignatureValidationRepository;
import com.mycompany.myapp.service.SignatureValidationService;
import com.mycompany.myapp.service.dto.SignatureValidationDTO;
import com.mycompany.myapp.service.mapper.SignatureValidationMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SignatureValidation}.
 */
@Service
@Transactional
public class SignatureValidationServiceImpl implements SignatureValidationService {

    private final Logger log = LoggerFactory.getLogger(SignatureValidationServiceImpl.class);

    private final SignatureValidationRepository signatureValidationRepository;

    private final SignatureValidationMapper signatureValidationMapper;

    public SignatureValidationServiceImpl(
        SignatureValidationRepository signatureValidationRepository,
        SignatureValidationMapper signatureValidationMapper
    ) {
        this.signatureValidationRepository = signatureValidationRepository;
        this.signatureValidationMapper = signatureValidationMapper;
    }

    @Override
    public SignatureValidationDTO save(SignatureValidationDTO signatureValidationDTO) {
        log.debug("Request to save SignatureValidation : {}", signatureValidationDTO);
        SignatureValidation signatureValidation = signatureValidationMapper.toEntity(signatureValidationDTO);
        signatureValidation = signatureValidationRepository.save(signatureValidation);
        return signatureValidationMapper.toDto(signatureValidation);
    }

    @Override
    public Optional<SignatureValidationDTO> partialUpdate(SignatureValidationDTO signatureValidationDTO) {
        log.debug("Request to partially update SignatureValidation : {}", signatureValidationDTO);

        return signatureValidationRepository
            .findById(signatureValidationDTO.getId())
            .map(
                existingSignatureValidation -> {
                    signatureValidationMapper.partialUpdate(existingSignatureValidation, signatureValidationDTO);
                    return existingSignatureValidation;
                }
            )
            .map(signatureValidationRepository::save)
            .map(signatureValidationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SignatureValidationDTO> findAll() {
        log.debug("Request to get all SignatureValidations");
        return signatureValidationRepository
            .findAll()
            .stream()
            .map(signatureValidationMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the signatureValidations where Signature is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<SignatureValidationDTO> findAllWhereSignatureIsNull() {
        log.debug("Request to get all signatureValidations where Signature is null");
        return StreamSupport
            .stream(signatureValidationRepository.findAll().spliterator(), false)
            .filter(signatureValidation -> signatureValidation.getSignature() == null)
            .map(signatureValidationMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SignatureValidationDTO> findOne(Long id) {
        log.debug("Request to get SignatureValidation : {}", id);
        return signatureValidationRepository.findById(id).map(signatureValidationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SignatureValidation : {}", id);
        signatureValidationRepository.deleteById(id);
    }
}
