package com.mycompany.myapp.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class LinkDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LinkDTO.class);
        LinkDTO linkDTO1 = new LinkDTO();
        linkDTO1.setId(1L);
        LinkDTO linkDTO2 = new LinkDTO();
        assertThat(linkDTO1).isNotEqualTo(linkDTO2);
        linkDTO2.setId(linkDTO1.getId());
        assertThat(linkDTO1).isEqualTo(linkDTO2);
        linkDTO2.setId(2L);
        assertThat(linkDTO1).isNotEqualTo(linkDTO2);
        linkDTO1.setId(null);
        assertThat(linkDTO1).isNotEqualTo(linkDTO2);
    }
}
