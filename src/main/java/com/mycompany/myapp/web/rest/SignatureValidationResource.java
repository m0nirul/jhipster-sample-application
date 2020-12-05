package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.service.SignatureValidationService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.service.dto.SignatureValidationDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.SignatureValidation}.
 */
@RestController
@RequestMapping("/api")
public class SignatureValidationResource {

    private final Logger log = LoggerFactory.getLogger(SignatureValidationResource.class);

    private static final String ENTITY_NAME = "signatureValidation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SignatureValidationService signatureValidationService;

    public SignatureValidationResource(SignatureValidationService signatureValidationService) {
        this.signatureValidationService = signatureValidationService;
    }

    /**
     * {@code POST  /signature-validations} : Create a new signatureValidation.
     *
     * @param signatureValidationDTO the signatureValidationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new signatureValidationDTO, or with status {@code 400 (Bad Request)} if the signatureValidation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/signature-validations")
    public ResponseEntity<SignatureValidationDTO> createSignatureValidation(@RequestBody SignatureValidationDTO signatureValidationDTO) throws URISyntaxException {
        log.debug("REST request to save SignatureValidation : {}", signatureValidationDTO);
        if (signatureValidationDTO.getId() != null) {
            throw new BadRequestAlertException("A new signatureValidation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SignatureValidationDTO result = signatureValidationService.save(signatureValidationDTO);
        return ResponseEntity.created(new URI("/api/signature-validations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /signature-validations} : Updates an existing signatureValidation.
     *
     * @param signatureValidationDTO the signatureValidationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated signatureValidationDTO,
     * or with status {@code 400 (Bad Request)} if the signatureValidationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the signatureValidationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/signature-validations")
    public ResponseEntity<SignatureValidationDTO> updateSignatureValidation(@RequestBody SignatureValidationDTO signatureValidationDTO) throws URISyntaxException {
        log.debug("REST request to update SignatureValidation : {}", signatureValidationDTO);
        if (signatureValidationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SignatureValidationDTO result = signatureValidationService.save(signatureValidationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, signatureValidationDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /signature-validations} : get all the signatureValidations.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of signatureValidations in body.
     */
    @GetMapping("/signature-validations")
    public List<SignatureValidationDTO> getAllSignatureValidations(@RequestParam(required = false) String filter) {
        if ("signature-is-null".equals(filter)) {
            log.debug("REST request to get all SignatureValidations where signature is null");
            return signatureValidationService.findAllWhereSignatureIsNull();
        }
        log.debug("REST request to get all SignatureValidations");
        return signatureValidationService.findAll();
    }

    /**
     * {@code GET  /signature-validations/:id} : get the "id" signatureValidation.
     *
     * @param id the id of the signatureValidationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the signatureValidationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/signature-validations/{id}")
    public ResponseEntity<SignatureValidationDTO> getSignatureValidation(@PathVariable Long id) {
        log.debug("REST request to get SignatureValidation : {}", id);
        Optional<SignatureValidationDTO> signatureValidationDTO = signatureValidationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(signatureValidationDTO);
    }

    /**
     * {@code DELETE  /signature-validations/:id} : delete the "id" signatureValidation.
     *
     * @param id the id of the signatureValidationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/signature-validations/{id}")
    public ResponseEntity<Void> deleteSignatureValidation(@PathVariable Long id) {
        log.debug("REST request to delete SignatureValidation : {}", id);
        signatureValidationService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
