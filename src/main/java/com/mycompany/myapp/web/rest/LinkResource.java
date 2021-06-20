package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.LinkRepository;
import com.mycompany.myapp.service.LinkService;
import com.mycompany.myapp.service.dto.LinkDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Link}.
 */
@RestController
@RequestMapping("/api")
public class LinkResource {

    private final Logger log = LoggerFactory.getLogger(LinkResource.class);

    private static final String ENTITY_NAME = "link";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LinkService linkService;

    private final LinkRepository linkRepository;

    public LinkResource(LinkService linkService, LinkRepository linkRepository) {
        this.linkService = linkService;
        this.linkRepository = linkRepository;
    }

    /**
     * {@code POST  /links} : Create a new link.
     *
     * @param linkDTO the linkDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new linkDTO, or with status {@code 400 (Bad Request)} if the link has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/links")
    public ResponseEntity<LinkDTO> createLink(@RequestBody LinkDTO linkDTO) throws URISyntaxException {
        log.debug("REST request to save Link : {}", linkDTO);
        if (linkDTO.getId() != null) {
            throw new BadRequestAlertException("A new link cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LinkDTO result = linkService.save(linkDTO);
        return ResponseEntity
            .created(new URI("/api/links/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /links/:id} : Updates an existing link.
     *
     * @param id the id of the linkDTO to save.
     * @param linkDTO the linkDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated linkDTO,
     * or with status {@code 400 (Bad Request)} if the linkDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the linkDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/links/{id}")
    public ResponseEntity<LinkDTO> updateLink(@PathVariable(value = "id", required = false) final Long id, @RequestBody LinkDTO linkDTO)
        throws URISyntaxException {
        log.debug("REST request to update Link : {}, {}", id, linkDTO);
        if (linkDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, linkDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!linkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LinkDTO result = linkService.save(linkDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, linkDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /links/:id} : Partial updates given fields of an existing link, field will ignore if it is null
     *
     * @param id the id of the linkDTO to save.
     * @param linkDTO the linkDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated linkDTO,
     * or with status {@code 400 (Bad Request)} if the linkDTO is not valid,
     * or with status {@code 404 (Not Found)} if the linkDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the linkDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/links/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<LinkDTO> partialUpdateLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LinkDTO linkDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Link partially : {}, {}", id, linkDTO);
        if (linkDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, linkDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!linkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LinkDTO> result = linkService.partialUpdate(linkDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, linkDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /links} : get all the links.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of links in body.
     */
    @GetMapping("/links")
    public List<LinkDTO> getAllLinks() {
        log.debug("REST request to get all Links");
        return linkService.findAll();
    }

    /**
     * {@code GET  /links/:id} : get the "id" link.
     *
     * @param id the id of the linkDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the linkDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/links/{id}")
    public ResponseEntity<LinkDTO> getLink(@PathVariable Long id) {
        log.debug("REST request to get Link : {}", id);
        Optional<LinkDTO> linkDTO = linkService.findOne(id);
        return ResponseUtil.wrapOrNotFound(linkDTO);
    }

    /**
     * {@code DELETE  /links/:id} : delete the "id" link.
     *
     * @param id the id of the linkDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/links/{id}")
    public ResponseEntity<Void> deleteLink(@PathVariable Long id) {
        log.debug("REST request to delete Link : {}", id);
        linkService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
