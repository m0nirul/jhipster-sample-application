package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SignatureValidationDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SignatureValidationDTO.class);
        SignatureValidationDTO signatureValidationDTO1 = new SignatureValidationDTO();
        signatureValidationDTO1.setId(1L);
        SignatureValidationDTO signatureValidationDTO2 = new SignatureValidationDTO();
        assertThat(signatureValidationDTO1).isNotEqualTo(signatureValidationDTO2);
        signatureValidationDTO2.setId(signatureValidationDTO1.getId());
        assertThat(signatureValidationDTO1).isEqualTo(signatureValidationDTO2);
        signatureValidationDTO2.setId(2L);
        assertThat(signatureValidationDTO1).isNotEqualTo(signatureValidationDTO2);
        signatureValidationDTO1.setId(null);
        assertThat(signatureValidationDTO1).isNotEqualTo(signatureValidationDTO2);
    }
}
