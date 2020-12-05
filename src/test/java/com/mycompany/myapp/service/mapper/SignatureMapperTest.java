package com.mycompany.myapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class SignatureMapperTest {

    private SignatureMapper signatureMapper;

    @BeforeEach
    public void setUp() {
        signatureMapper = new SignatureMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(signatureMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(signatureMapper.fromId(null)).isNull();
    }
}
