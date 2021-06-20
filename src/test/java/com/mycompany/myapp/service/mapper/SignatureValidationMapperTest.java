package com.mycompany.myapp.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SignatureValidationMapperTest {

    private SignatureValidationMapper signatureValidationMapper;

    @BeforeEach
    public void setUp() {
        signatureValidationMapper = new SignatureValidationMapperImpl();
    }
}
