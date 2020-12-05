package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class SignatureTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Signature.class);
        Signature signature1 = new Signature();
        signature1.setId(1L);
        Signature signature2 = new Signature();
        signature2.setId(signature1.getId());
        assertThat(signature1).isEqualTo(signature2);
        signature2.setId(2L);
        assertThat(signature1).isNotEqualTo(signature2);
        signature1.setId(null);
        assertThat(signature1).isNotEqualTo(signature2);
    }
}
