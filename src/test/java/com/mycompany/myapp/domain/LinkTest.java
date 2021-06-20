package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LinkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Link.class);
        Link link1 = new Link();
        link1.setId(1L);
        Link link2 = new Link();
        link2.setId(link1.getId());
        assertThat(link1).isEqualTo(link2);
        link2.setId(2L);
        assertThat(link1).isNotEqualTo(link2);
        link1.setId(null);
        assertThat(link1).isNotEqualTo(link2);
    }
}
