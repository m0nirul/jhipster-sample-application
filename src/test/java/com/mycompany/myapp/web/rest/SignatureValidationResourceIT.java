package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterSampleApplicationApp;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import com.mycompany.myapp.domain.SignatureValidation;
import com.mycompany.myapp.repository.SignatureValidationRepository;
import com.mycompany.myapp.service.SignatureValidationService;
import com.mycompany.myapp.service.dto.SignatureValidationDTO;
import com.mycompany.myapp.service.mapper.SignatureValidationMapper;

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

import com.mycompany.myapp.domain.enumeration.ValidationStatus;
/**
 * Integration tests for the {@link SignatureValidationResource} REST controller.
 */
@SpringBootTest(classes = { JhipsterSampleApplicationApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class SignatureValidationResourceIT {

    private static final String DEFAULT_OTP = "AAAAAAAAAA";
    private static final String UPDATED_OTP = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATEDTIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATEDTIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_VALID_TILL = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_VALID_TILL = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ValidationStatus DEFAULT_STATUS = ValidationStatus.VARIFIED;
    private static final ValidationStatus UPDATED_STATUS = ValidationStatus.PENDING;

    @Autowired
    private SignatureValidationRepository signatureValidationRepository;

    @Autowired
    private SignatureValidationMapper signatureValidationMapper;

    @Autowired
    private SignatureValidationService signatureValidationService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSignatureValidationMockMvc;

    private SignatureValidation signatureValidation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SignatureValidation createEntity(EntityManager em) {
        SignatureValidation signatureValidation = new SignatureValidation()
            .otp(DEFAULT_OTP)
            .createdtime(DEFAULT_CREATEDTIME)
            .validTill(DEFAULT_VALID_TILL)
            .status(DEFAULT_STATUS);
        return signatureValidation;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SignatureValidation createUpdatedEntity(EntityManager em) {
        SignatureValidation signatureValidation = new SignatureValidation()
            .otp(UPDATED_OTP)
            .createdtime(UPDATED_CREATEDTIME)
            .validTill(UPDATED_VALID_TILL)
            .status(UPDATED_STATUS);
        return signatureValidation;
    }

    @BeforeEach
    public void initTest() {
        signatureValidation = createEntity(em);
    }

    @Test
    @Transactional
    public void createSignatureValidation() throws Exception {
        int databaseSizeBeforeCreate = signatureValidationRepository.findAll().size();
        // Create the SignatureValidation
        SignatureValidationDTO signatureValidationDTO = signatureValidationMapper.toDto(signatureValidation);
        restSignatureValidationMockMvc.perform(post("/api/signature-validations").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureValidationDTO)))
            .andExpect(status().isCreated());

        // Validate the SignatureValidation in the database
        List<SignatureValidation> signatureValidationList = signatureValidationRepository.findAll();
        assertThat(signatureValidationList).hasSize(databaseSizeBeforeCreate + 1);
        SignatureValidation testSignatureValidation = signatureValidationList.get(signatureValidationList.size() - 1);
        assertThat(testSignatureValidation.getOtp()).isEqualTo(DEFAULT_OTP);
        assertThat(testSignatureValidation.getCreatedtime()).isEqualTo(DEFAULT_CREATEDTIME);
        assertThat(testSignatureValidation.getValidTill()).isEqualTo(DEFAULT_VALID_TILL);
        assertThat(testSignatureValidation.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createSignatureValidationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = signatureValidationRepository.findAll().size();

        // Create the SignatureValidation with an existing ID
        signatureValidation.setId(1L);
        SignatureValidationDTO signatureValidationDTO = signatureValidationMapper.toDto(signatureValidation);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSignatureValidationMockMvc.perform(post("/api/signature-validations").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureValidationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the SignatureValidation in the database
        List<SignatureValidation> signatureValidationList = signatureValidationRepository.findAll();
        assertThat(signatureValidationList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllSignatureValidations() throws Exception {
        // Initialize the database
        signatureValidationRepository.saveAndFlush(signatureValidation);

        // Get all the signatureValidationList
        restSignatureValidationMockMvc.perform(get("/api/signature-validations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(signatureValidation.getId().intValue())))
            .andExpect(jsonPath("$.[*].otp").value(hasItem(DEFAULT_OTP)))
            .andExpect(jsonPath("$.[*].createdtime").value(hasItem(sameInstant(DEFAULT_CREATEDTIME))))
            .andExpect(jsonPath("$.[*].validTill").value(hasItem(sameInstant(DEFAULT_VALID_TILL))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getSignatureValidation() throws Exception {
        // Initialize the database
        signatureValidationRepository.saveAndFlush(signatureValidation);

        // Get the signatureValidation
        restSignatureValidationMockMvc.perform(get("/api/signature-validations/{id}", signatureValidation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(signatureValidation.getId().intValue()))
            .andExpect(jsonPath("$.otp").value(DEFAULT_OTP))
            .andExpect(jsonPath("$.createdtime").value(sameInstant(DEFAULT_CREATEDTIME)))
            .andExpect(jsonPath("$.validTill").value(sameInstant(DEFAULT_VALID_TILL)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingSignatureValidation() throws Exception {
        // Get the signatureValidation
        restSignatureValidationMockMvc.perform(get("/api/signature-validations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSignatureValidation() throws Exception {
        // Initialize the database
        signatureValidationRepository.saveAndFlush(signatureValidation);

        int databaseSizeBeforeUpdate = signatureValidationRepository.findAll().size();

        // Update the signatureValidation
        SignatureValidation updatedSignatureValidation = signatureValidationRepository.findById(signatureValidation.getId()).get();
        // Disconnect from session so that the updates on updatedSignatureValidation are not directly saved in db
        em.detach(updatedSignatureValidation);
        updatedSignatureValidation
            .otp(UPDATED_OTP)
            .createdtime(UPDATED_CREATEDTIME)
            .validTill(UPDATED_VALID_TILL)
            .status(UPDATED_STATUS);
        SignatureValidationDTO signatureValidationDTO = signatureValidationMapper.toDto(updatedSignatureValidation);

        restSignatureValidationMockMvc.perform(put("/api/signature-validations").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureValidationDTO)))
            .andExpect(status().isOk());

        // Validate the SignatureValidation in the database
        List<SignatureValidation> signatureValidationList = signatureValidationRepository.findAll();
        assertThat(signatureValidationList).hasSize(databaseSizeBeforeUpdate);
        SignatureValidation testSignatureValidation = signatureValidationList.get(signatureValidationList.size() - 1);
        assertThat(testSignatureValidation.getOtp()).isEqualTo(UPDATED_OTP);
        assertThat(testSignatureValidation.getCreatedtime()).isEqualTo(UPDATED_CREATEDTIME);
        assertThat(testSignatureValidation.getValidTill()).isEqualTo(UPDATED_VALID_TILL);
        assertThat(testSignatureValidation.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingSignatureValidation() throws Exception {
        int databaseSizeBeforeUpdate = signatureValidationRepository.findAll().size();

        // Create the SignatureValidation
        SignatureValidationDTO signatureValidationDTO = signatureValidationMapper.toDto(signatureValidation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSignatureValidationMockMvc.perform(put("/api/signature-validations").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(signatureValidationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the SignatureValidation in the database
        List<SignatureValidation> signatureValidationList = signatureValidationRepository.findAll();
        assertThat(signatureValidationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSignatureValidation() throws Exception {
        // Initialize the database
        signatureValidationRepository.saveAndFlush(signatureValidation);

        int databaseSizeBeforeDelete = signatureValidationRepository.findAll().size();

        // Delete the signatureValidation
        restSignatureValidationMockMvc.perform(delete("/api/signature-validations/{id}", signatureValidation.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SignatureValidation> signatureValidationList = signatureValidationRepository.findAll();
        assertThat(signatureValidationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
