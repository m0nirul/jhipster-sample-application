package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.service.SignatureService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.service.dto.SignatureDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Signature}.
 */
@RestController
@RequestMapping("/api")
public class SignatureResource {

    private final Logger log = LoggerFactory.getLogger(SignatureResource.class);

    private static final String ENTITY_NAME = "signature";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SignatureService signatureService;

    public SignatureResource(SignatureService signatureService) {
        this.signatureService = signatureService;
    }

    /**
     * {@code POST  /signatures} : Create a new signature.
     *
     * @param signatureDTO the signatureDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new signatureDTO, or with status {@code 400 (Bad Request)} if the signature has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/signatures")
    public ResponseEntity<SignatureDTO> createSignature(@Valid @RequestBody SignatureDTO signatureDTO) throws URISyntaxException {
        log.debug("REST request to save Signature : {}", signatureDTO);
        if (signatureDTO.getId() != null) {
            throw new BadRequestAlertException("A new signature cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (Objects.isNull(signatureDTO.getSignatureValidationId())) {
            throw new BadRequestAlertException("Invalid association value provided", ENTITY_NAME, "null");
        }
        SignatureDTO result = signatureService.save(signatureDTO);
        return ResponseEntity.created(new URI("/api/signatures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /signatures} : Updates an existing signature.
     *
     * @param signatureDTO the signatureDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated signatureDTO,
     * or with status {@code 400 (Bad Request)} if the signatureDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the signatureDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/signatures")
    public ResponseEntity<SignatureDTO> updateSignature(@Valid @RequestBody SignatureDTO signatureDTO) throws URISyntaxException {
        log.debug("REST request to update Signature : {}", signatureDTO);
        if (signatureDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SignatureDTO result = signatureService.save(signatureDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, signatureDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /signatures} : get all the signatures.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of signatures in body.
     */
    @GetMapping("/signatures")
    public List<SignatureDTO> getAllSignatures() {
        log.debug("REST request to get all Signatures");
        return signatureService.findAll();
    }

    /**
     * {@code GET  /signatures/:id} : get the "id" signature.
     *
     * @param id the id of the signatureDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the signatureDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/signatures/{id}")
    public ResponseEntity<SignatureDTO> getSignature(@PathVariable Long id) {
        log.debug("REST request to get Signature : {}", id);
        Optional<SignatureDTO> signatureDTO = signatureService.findOne(id);
        return ResponseUtil.wrapOrNotFound(signatureDTO);
    }

    /**
     * {@code DELETE  /signatures/:id} : delete the "id" signature.
     *
     * @param id the id of the signatureDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/signatures/{id}")
    public ResponseEntity<Void> deleteSignature(@PathVariable Long id) {
        log.debug("REST request to delete Signature : {}", id);
        signatureService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
