package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Signature;
import com.mycompany.myapp.domain.SignatureValidation;
import com.mycompany.myapp.domain.enumeration.ValidationStatus;
import com.mycompany.myapp.repository.SignatureRepository;
import com.mycompany.myapp.service.dto.SignatureDTO;
import com.mycompany.myapp.service.mapper.SignatureMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SignatureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SignatureResourceIT {

    private static final String DEFAULT_EMAIL = "'@]d.*)";
    private static final String UPDATED_EMAIL = ":x@;q'x.i3C+j^";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_REPLY_EMAIL = "L4@o8'.:q}{9";
    private static final String UPDATED_REPLY_EMAIL = "2n.?p@[+.wqnu";

    private static final String DEFAULT_REPLY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_REPLY_NAME = "BBBBBBBBBB";

    private static final ValidationStatus DEFAULT_STATUS = ValidationStatus.VARIFIED;
    private static final ValidationStatus UPDATED_STATUS = ValidationStatus.PENDING;

    private static final String ENTITY_API_URL = "/api/signatures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SignatureRepository signatureRepository;

    @Autowired
    private SignatureMapper signatureMapper;

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
    void createSignature() throws Exception {
        int databaseSizeBeforeCreate = signatureRepository.findAll().size();
        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);
        restSignatureMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
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
    void createSignatureWithExistingId() throws Exception {
        // Create the Signature with an existing ID
        signature.setId(1L);
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        int databaseSizeBeforeCreate = signatureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSignatureMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void updateSignatureMapsIdAssociationWithNewId() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);
        int databaseSizeBeforeCreate = signatureRepository.findAll().size();

        // Add a new parent entity
        SignatureValidation signatureValidation = SignatureValidationResourceIT.createUpdatedEntity(em);
        em.persist(signatureValidation);
        em.flush();

        // Load the signature
        Signature updatedSignature = signatureRepository.findById(signature.getId()).get();
        assertThat(updatedSignature).isNotNull();
        // Disconnect from session so that the updates on updatedSignature are not directly saved in db
        em.detach(updatedSignature);

        // Update the SignatureValidation with new association value
        updatedSignature.setSignatureValidation(signatureValidation);
        SignatureDTO updatedSignatureDTO = signatureMapper.toDto(updatedSignature);
        assertThat(updatedSignatureDTO).isNotNull();

        // Update the entity
        restSignatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSignatureDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSignatureDTO))
            )
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
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = signatureRepository.findAll().size();
        // set the field null
        signature.setEmail(null);

        // Create the Signature, which fails.
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        restSignatureMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isBadRequest());

        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = signatureRepository.findAll().size();
        // set the field null
        signature.setName(null);

        // Create the Signature, which fails.
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        restSignatureMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isBadRequest());

        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSignatures() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        // Get all the signatureList
        restSignatureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
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
    void getSignature() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        // Get the signature
        restSignatureMockMvc
            .perform(get(ENTITY_API_URL_ID, signature.getId()))
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
    void getNonExistingSignature() throws Exception {
        // Get the signature
        restSignatureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSignature() throws Exception {
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

        restSignatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, signatureDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
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
    void putNonExistingSignature() throws Exception {
        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();
        signature.setId(count.incrementAndGet());

        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSignatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, signatureDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSignature() throws Exception {
        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();
        signature.setId(count.incrementAndGet());

        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSignatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSignature() throws Exception {
        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();
        signature.setId(count.incrementAndGet());

        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSignatureMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSignatureWithPatch() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();

        // Update the signature using partial update
        Signature partialUpdatedSignature = new Signature();
        partialUpdatedSignature.setId(signature.getId());

        partialUpdatedSignature.replyEmail(UPDATED_REPLY_EMAIL).replyName(UPDATED_REPLY_NAME).status(UPDATED_STATUS);

        restSignatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSignature.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSignature))
            )
            .andExpect(status().isOk());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
        Signature testSignature = signatureList.get(signatureList.size() - 1);
        assertThat(testSignature.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSignature.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSignature.getReplyEmail()).isEqualTo(UPDATED_REPLY_EMAIL);
        assertThat(testSignature.getReplyName()).isEqualTo(UPDATED_REPLY_NAME);
        assertThat(testSignature.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateSignatureWithPatch() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();

        // Update the signature using partial update
        Signature partialUpdatedSignature = new Signature();
        partialUpdatedSignature.setId(signature.getId());

        partialUpdatedSignature
            .email(UPDATED_EMAIL)
            .name(UPDATED_NAME)
            .replyEmail(UPDATED_REPLY_EMAIL)
            .replyName(UPDATED_REPLY_NAME)
            .status(UPDATED_STATUS);

        restSignatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSignature.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSignature))
            )
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
    void patchNonExistingSignature() throws Exception {
        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();
        signature.setId(count.incrementAndGet());

        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSignatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, signatureDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSignature() throws Exception {
        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();
        signature.setId(count.incrementAndGet());

        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSignatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSignature() throws Exception {
        int databaseSizeBeforeUpdate = signatureRepository.findAll().size();
        signature.setId(count.incrementAndGet());

        // Create the Signature
        SignatureDTO signatureDTO = signatureMapper.toDto(signature);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSignatureMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(signatureDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Signature in the database
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSignature() throws Exception {
        // Initialize the database
        signatureRepository.saveAndFlush(signature);

        int databaseSizeBeforeDelete = signatureRepository.findAll().size();

        // Delete the signature
        restSignatureMockMvc
            .perform(delete(ENTITY_API_URL_ID, signature.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Signature> signatureList = signatureRepository.findAll();
        assertThat(signatureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
