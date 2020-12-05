package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.SignatureDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Signature}.
 */
public interface SignatureService {

    /**
     * Save a signature.
     *
     * @param signatureDTO the entity to save.
     * @return the persisted entity.
     */
    SignatureDTO save(SignatureDTO signatureDTO);

    /**
     * Get all the signatures.
     *
     * @return the list of entities.
     */
    List<SignatureDTO> findAll();


    /**
     * Get the "id" signature.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SignatureDTO> findOne(Long id);

    /**
     * Delete the "id" signature.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
