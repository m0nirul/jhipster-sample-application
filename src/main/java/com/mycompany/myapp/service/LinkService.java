package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.LinkDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Link}.
 */
public interface LinkService {
    /**
     * Save a link.
     *
     * @param linkDTO the entity to save.
     * @return the persisted entity.
     */
    LinkDTO save(LinkDTO linkDTO);

    /**
     * Partially updates a link.
     *
     * @param linkDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LinkDTO> partialUpdate(LinkDTO linkDTO);

    /**
     * Get all the links.
     *
     * @return the list of entities.
     */
    List<LinkDTO> findAll();

    /**
     * Get the "id" link.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LinkDTO> findOne(Long id);

    /**
     * Delete the "id" link.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
