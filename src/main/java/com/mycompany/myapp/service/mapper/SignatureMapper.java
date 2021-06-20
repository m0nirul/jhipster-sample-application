package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.SignatureDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Signature} and its DTO {@link SignatureDTO}.
 */
@Mapper(componentModel = "spring", uses = { SignatureValidationMapper.class, UserMapper.class })
public interface SignatureMapper extends EntityMapper<SignatureDTO, Signature> {
    @Mapping(target = "signatureValidation", source = "signatureValidation", qualifiedByName = "id")
    @Mapping(target = "owner", source = "owner", qualifiedByName = "id")
    SignatureDTO toDto(Signature s);
}
