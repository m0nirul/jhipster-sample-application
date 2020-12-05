package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterSampleApplicationApp;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import com.mycompany.myapp.domain.Signature;
import com.mycompany.myapp.domain.SignatureValidation;
import com.mycompany.myapp.repository.SignatureRepository;
import com.mycompany.myapp.service.SignatureService;
import com.mycompany.myapp.service.dto.SignatureDTO;
import com.mycompany.myapp.service.mapper.SignatureMapper;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.domain.enumeration.ValidationStatus;
/**
 * Integration tests for the {@link SignatureResource} REST controller.
 */
@SpringBootTest(classes = { JhipsterSampleApplicationApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class SignatureResourceIT {

    private static final String DEFAULT_EMAIL = "V@*Q.wGq#\\";
    private static final String UPDATED_EMAIL = "?_V@>o+.o:";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_REPLY_EMAIL = "Er7N@*R..";
    private static final String UPDATED_REPLY_EMAIL = "'J7OM@a.Y";

    private static final String DEFAULT_REPLY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_REPLY_NAME = "BBBBBBBBBB";

    private static final ValidationStatus DEFAULT_STATUS = ValidationStatus.VARIFIED;
    private static final ValidationStatus UPDATED_STATUS = ValidationStatus.PENDING;

    @Autowired
    private SignatureRepository signatureRepository;

    @Autowired
    private SignatureMapper signatureMapper;

    @Autowired
    private SignatureService signatureService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSignatureMockMvc;

    private Signature signature;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Signature createEntity(EntityManager em) {
        Signature signature = new Signature()
            .email(DEFAULT_EMAIL)
            .name(DEFAULT_NAME)
            .replyEmail(DEFAULT_REPLY_EMAIL)
            .replyName(DEFAULT_REPLY_NAME)
            .status(DEFAULT_STATUS);
        // Add required entity
        SignatureValidation signatureValidation;
        if (TestUtil.findAll(em, SignatureValidation.class).isEmpty()) {
            signatureValidation = SignatureValidationResourceIT.createEntity(em);
            em.persist(signatureValidation);
            em.flush();
        } else {
            signatureValidation = TestUtil.findAll(em, SignatureValidation.class).get(0);
        }
        signature.setSignatureValidation(signatureValidation);
        return signature;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Signature createUpdatedEntity(EntityManager em) {
        Signature signature = new Signature()
            .email(UPDATED_EMAIL)
            .name(UPDATED_NAME)
            .replyEmail(UPDATED_REPLY_EMAIL)
            .replyName(UPDATED_REPLY_NAME)
            .status(UPDATED_STATUS);
        // Add required entity
        SignatureValidation signatureValidation;
        if (TestUtil.findAll(em, SignatureValidation.class).isEmpty()) {
            signatureValidation = SignatureValidationResourceIT.createUpdatedEntity(em);
            em.persist(signatureValidation);
            em.flush();
        } else {
            signatureValidation = TestUtil.findAll(em, SignatureValidation.class).get(0);
        }
        signature.setSignatureValidation(signatureValidation);
        return signature;
    }

    @BeforeEach
    public void initTest() {
        signature = createEntity(em);
    }

    @Test
    @Transactional
    public void createSignature() throws Exception {
        int databaseSizeBeforeCreate = signatureRepository.findAll().size();
        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);
        restSignatureMockMvc.perform(post("/api/signatures").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureDTO)))
            .andExpect(status().isCreated());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeCreate + 1);
        Signature testSignature = signatureList.get(signatureList.size() - 1);
        assertThat(testSignature.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSignature.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSignature.getReplyEmail()).isEqualTo(DEFAULT_REPLY_EMAIL);
        assertThat(testSignature.getReplyName()).isEqualTo(DEFAULT_REPLY_NAME);
        assertThat(testSignature.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the id for MapsId, the ids must be same
        assertThat(testSignature.getId()).isEqualTo(testSignature.getSignatureValidation().getId());
    }

    @Test
    @Transactional
    public void createSignatureWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = signatureRepository.findAll().size();

        // Create the Signature with an existing ID
        signature.setId(1L);
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSignatureMockMvc.perform(post("/api/signatures").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void updateSignatureMapsIdAssociationWithNewId() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);
        int databaseSizeBeforeCreate = signatureRepository.findAll().size();

        // Add a new parent entity
        SignatureValidation signatureValidation = SignatureValidationResourceIT.createUpdatedEntity(em);
        em.persist(signatureValidation);
        em.flush();

        // Load the signature
        Signature updatedSignature = signatureRepository.findById(signature.getId()).get();
        // Disconnect from session so that the updates on updatedSignature are not directly saved in db
        em.detach(updatedSignature);

        // Update the SignatureValidation with new association value
        updatedSignature.setSignatureValidation(signatureValidation);
        SignatureDTO updatedSignatureDTO = signatureMapper.toDto(updatedSignature);

        // Update the entity
        restSignatureMockMvc.perform(put("/api/signatures").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSignatureDTO)))
            .andExpect(status().isOk());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeCreate);
        Signature testSignature = signatureList.get(signatureList.size() - 1);

        // Validate the id for MapsId, the ids must be same
        // Uncomment the following line for assertion. However, please note that there is a known issue and uncommenting will fail the test.
        // Please look at https://github.com/jhipster/generator-jhipster/issues/9100. You can modify this test as necessary.
        // assertThat(testSignature.getId()).isEqualTo(testSignature.getSignatureValidation().getId());
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = signatureRepository.findAll().size();
        // set the field null
        signature.setEmail(null);

        // Create the Signature, which fails.
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);


        restSignatureMockMvc.perform(post("/api/signatures").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureDTO)))
            .andExpect(status().isBadRequest());

        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = signatureRepository.findAll().size();
        // set the field null
        signature.setName(null);

        // Create the Signature, which fails.
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);


        restSignatureMockMvc.perform(post("/api/signatures").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureDTO)))
            .andExpect(status().isBadRequest());

        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSignatures() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        // Get all the signatureList
        restSignatureMockMvc.perform(get("/api/signatures?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(signature.getId().intValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].replyEmail").value(hasItem(DEFAULT_REPLY_EMAIL)))
            .andExpect(jsonPath("$.[*].replyName").value(hasItem(DEFAULT_REPLY_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getSignature() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        // Get the signature
        restSignatureMockMvc.perform(get("/api/signatures/{id}", signature.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(signature.getId().intValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.replyEmail").value(DEFAULT_REPLY_EMAIL))
            .andExpect(jsonPath("$.replyName").value(DEFAULT_REPLY_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingSignature() throws Exception {
        // Get the signature
        restSignatureMockMvc.perform(get("/api/signatures/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSignature() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();

        // Update the signature
        Signature updatedSignature = signatureRepository.findById(signature.getId()).get();
        // Disconnect from session so that the updates on updatedSignature are not directly saved in db
        em.detach(updatedSignature);
        updatedSignature
            .email(UPDATED_EMAIL)
            .name(UPDATED_NAME)
            .replyEmail(UPDATED_REPLY_EMAIL)
            .replyName(UPDATED_REPLY_NAME)
            .status(UPDATED_STATUS);
        SignatureDTO signatureDTO = signatureMapper.toDto(updatedSignature);

        restSignatureMockMvc.perform(put("/api/signatures").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureDTO)))
            .andExpect(status().isOk());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
        Signature testSignature = signatureList.get(signatureList.size() - 1);
        assertThat(testSignature.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSignature.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSignature.getReplyEmail()).isEqualTo(UPDATED_REPLY_EMAIL);
        assertThat(testSignature.getReplyName()).isEqualTo(UPDATED_REPLY_NAME);
        assertThat(testSignature.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingSignature() throws Exception {
        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();

        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSignatureMockMvc.perform(put("/api/signatures").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSignature() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        int databaseSizeBeforeDelete = signatureRepository.findAll().size();

        // Delete the signature
        restSignatureMockMvc.perform(delete("/api/signatures/{id}", signature.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
