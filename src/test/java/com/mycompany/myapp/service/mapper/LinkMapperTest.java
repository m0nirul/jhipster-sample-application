package com.mycompany.myapp.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LinkMapperTest {

    private LinkMapper linkMapper;

    @BeforeEach
    public void setUp() {
        linkMapper = new LinkMapperImpl();
    }
}
