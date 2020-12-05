package com.mycompany.myapp.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class SignatureDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SignatureDTO.class);
        SignatureDTO signatureDTO1 = new SignatureDTO();
        signatureDTO1.setId(1L);
        SignatureDTO signatureDTO2 = new SignatureDTO();
        assertThat(signatureDTO1).isNotEqualTo(signatureDTO2);
        signatureDTO2.setId(signatureDTO1.getId());
        assertThat(signatureDTO1).isEqualTo(signatureDTO2);
        signatureDTO2.setId(2L);
        assertThat(signatureDTO1).isNotEqualTo(signatureDTO2);
        signatureDTO1.setId(null);
        assertThat(signatureDTO1).isNotEqualTo(signatureDTO2);
    }
}
