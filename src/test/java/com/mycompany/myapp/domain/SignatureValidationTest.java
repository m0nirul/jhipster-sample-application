package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SignatureValidationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SignatureValidation.class);
        SignatureValidation signatureValidation1 = new SignatureValidation();
        signatureValidation1.setId(1L);
        SignatureValidation signatureValidation2 = new SignatureValidation();
        signatureValidation2.setId(signatureValidation1.getId());
        assertThat(signatureValidation1).isEqualTo(signatureValidation2);
        signatureValidation2.setId(2L);
        assertThat(signatureValidation1).isNotEqualTo(signatureValidation2);
        signatureValidation1.setId(null);
        assertThat(signatureValidation1).isNotEqualTo(signatureValidation2);
    }
}
