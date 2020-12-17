package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterSampleApplicationApp;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import com.mycompany.myapp.domain.Link;
import com.mycompany.myapp.repository.LinkRepository;
import com.mycompany.myapp.service.LinkService;
import com.mycompany.myapp.service.dto.LinkDTO;
import com.mycompany.myapp.service.mapper.LinkMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link LinkResource} REST controller.
 */
@SpringBootTest(classes = { JhipsterSampleApplicationApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class LinkResourceIT {

    private static final ZonedDateTime DEFAULT_ZONED_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ZONED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_ZONED_DATE_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ZONED_DATE_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private LinkMapper linkMapper;

    @Autowired
    private LinkService linkService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLinkMockMvc;

    private Link link;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Link createEntity(EntityManager em) {
        Link link = new Link()
            .zonedStartTime(DEFAULT_ZONED_START_TIME)
            .zonedDateTime(DEFAULT_ZONED_DATE_TIME);
        return link;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Link createUpdatedEntity(EntityManager em) {
        Link link = new Link()
            .zonedStartTime(UPDATED_ZONED_START_TIME)
            .zonedDateTime(UPDATED_ZONED_DATE_TIME);
        return link;
    }

    @BeforeEach
    public void initTest() {
        link = createEntity(em);
    }

    @Test
    @Transactional
    public void createLink() throws Exception {
        int databaseSizeBeforeCreate = linkRepository.findAll().size();
        // Create the Link
        LinkDTO linkDTO = linkMapper.toDto(link);
        restLinkMockMvc.perform(post("/api/links").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(linkDTO)))
            .andExpect(status().isCreated());

        // Validate the Link in the database
        List<Link> linkList = linkRepository.findAll();
        assertThat(linkList).hasSize(databaseSizeBeforeCreate + 1);
        Link testLink = linkList.get(linkList.size() - 1);
        assertThat(testLink.getZonedStartTime()).isEqualTo(DEFAULT_ZONED_START_TIME);
        assertThat(testLink.getZonedDateTime()).isEqualTo(DEFAULT_ZONED_DATE_TIME);
    }

    @Test
    @Transactional
    public void createLinkWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = linkRepository.findAll().size();

        // Create the Link with an existing ID
        link.setId(1L);
        LinkDTO linkDTO = linkMapper.toDto(link);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLinkMockMvc.perform(post("/api/links").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(linkDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Link in the database
        List<Link> linkList = linkRepository.findAll();
        assertThat(linkList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllLinks() throws Exception {
        // Initialize the database
        linkRepository.saveAndFlush(link);

        // Get all the linkList
        restLinkMockMvc.perform(get("/api/links?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(link.getId().intValue())))
            .andExpect(jsonPath("$.[*].zonedStartTime").value(hasItem(sameInstant(DEFAULT_ZONED_START_TIME))))
            .andExpect(jsonPath("$.[*].zonedDateTime").value(hasItem(sameInstant(DEFAULT_ZONED_DATE_TIME))));
    }
    
    @Test
    @Transactional
    public void getLink() throws Exception {
        // Initialize the database
        linkRepository.saveAndFlush(link);

        // Get the link
        restLinkMockMvc.perform(get("/api/links/{id}", link.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(link.getId().intValue()))
            .andExpect(jsonPath("$.zonedStartTime").value(sameInstant(DEFAULT_ZONED_START_TIME)))
            .andExpect(jsonPath("$.zonedDateTime").value(sameInstant(DEFAULT_ZONED_DATE_TIME)));
    }
    @Test
    @Transactional
    public void getNonExistingLink() throws Exception {
        // Get the link
        restLinkMockMvc.perform(get("/api/links/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLink() throws Exception {
        // Initialize the database
        linkRepository.saveAndFlush(link);

        int databaseSizeBeforeUpdate = linkRepository.findAll().size();

        // Update the link
        Link updatedLink = linkRepository.findById(link.getId()).get();
        // Disconnect from session so that the updates on updatedLink are not directly saved in db
        em.detach(updatedLink);
        updatedLink
            .zonedStartTime(UPDATED_ZONED_START_TIME)
            .zonedDateTime(UPDATED_ZONED_DATE_TIME);
        LinkDTO linkDTO = linkMapper.toDto(updatedLink);

        restLinkMockMvc.perform(put("/api/links").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(linkDTO)))
            .andExpect(status().isOk());

        // Validate the Link in the database
        List<Link> linkList = linkRepository.findAll();
        assertThat(linkList).hasSize(databaseSizeBeforeUpdate);
        Link testLink = linkList.get(linkList.size() - 1);
        assertThat(testLink.getZonedStartTime()).isEqualTo(UPDATED_ZONED_START_TIME);
        assertThat(testLink.getZonedDateTime()).isEqualTo(UPDATED_ZONED_DATE_TIME);
    }

    @Test
    @Transactional
    public void updateNonExistingLink() throws Exception {
        int databaseSizeBeforeUpdate = linkRepository.findAll().size();

        // Create the Link
        LinkDTO linkDTO = linkMapper.toDto(link);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLinkMockMvc.perform(put("/api/links").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(linkDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Link in the database
        List<Link> linkList = linkRepository.findAll();
        assertThat(linkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLink() throws Exception {
        // Initialize the database
        linkRepository.saveAndFlush(link);

        int databaseSizeBeforeDelete = linkRepository.findAll().size();

        // Delete the link
        restLinkMockMvc.perform(delete("/api/links/{id}", link.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Link> linkList = linkRepository.findAll();
        assertThat(linkList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
