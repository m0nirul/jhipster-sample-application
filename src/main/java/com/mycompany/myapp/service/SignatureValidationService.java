package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.SignatureValidationDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.SignatureValidation}.
 */
public interface SignatureValidationService {
    /**
     * Save a signatureValidation.
     *
     * @param signatureValidationDTO the entity to save.
     * @return the persisted entity.
     */
    SignatureValidationDTO save(SignatureValidationDTO signatureValidationDTO);

    /**
     * Partially updates a signatureValidation.
     *
     * @param signatureValidationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SignatureValidationDTO> partialUpdate(SignatureValidationDTO signatureValidationDTO);

    /**
     * Get all the signatureValidations.
     *
     * @return the list of entities.
     */
    List<SignatureValidationDTO> findAll();
    /**
     * Get all the SignatureValidationDTO where Signature is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<SignatureValidationDTO> findAllWhereSignatureIsNull();

    /**
     * Get the "id" signatureValidation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SignatureValidationDTO> findOne(Long id);

    /**
     * Delete the "id" signatureValidation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
