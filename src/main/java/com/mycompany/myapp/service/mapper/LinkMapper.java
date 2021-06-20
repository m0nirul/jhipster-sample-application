package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.LinkDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Link} and its DTO {@link LinkDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface LinkMapper extends EntityMapper<LinkDTO, Link> {}
