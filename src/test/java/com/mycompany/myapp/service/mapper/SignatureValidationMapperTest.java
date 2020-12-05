package com.mycompany.myapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class SignatureValidationMapperTest {

    private SignatureValidationMapper signatureValidationMapper;

    @BeforeEach
    public void setUp() {
        signatureValidationMapper = new SignatureValidationMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(signatureValidationMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(signatureValidationMapper.fromId(null)).isNull();
    }
}
