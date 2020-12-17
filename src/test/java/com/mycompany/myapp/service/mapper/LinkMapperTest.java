package com.mycompany.myapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class LinkMapperTest {

    private LinkMapper linkMapper;

    @BeforeEach
    public void setUp() {
        linkMapper = new LinkMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(linkMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(linkMapper.fromId(null)).isNull();
    }
}
