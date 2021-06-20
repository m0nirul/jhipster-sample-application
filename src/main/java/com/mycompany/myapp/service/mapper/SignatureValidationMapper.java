package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.SignatureValidationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SignatureValidation} and its DTO {@link SignatureValidationDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SignatureValidationMapper extends EntityMapper<SignatureValidationDTO, SignatureValidation> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SignatureValidationDTO toDtoId(SignatureValidation signatureValidation);
}
