package com.mycompany.myapp.service.mapper;


import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.SignatureDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Signature} and its DTO {@link SignatureDTO}.
 */
@Mapper(componentModel = "spring", uses = {SignatureValidationMapper.class, UserMapper.class})
public interface SignatureMapper extends EntityMapper<SignatureDTO, Signature> {

    @Mapping(source = "signatureValidation.id", target = "signatureValidationId")
    @Mapping(source = "owner.id", target = "ownerId")
    SignatureDTO toDto(Signature signature);

    @Mapping(source = "signatureValidationId", target = "signatureValidation")
    @Mapping(source = "ownerId", target = "owner")
    Signature toEntity(SignatureDTO signatureDTO);

    default Signature fromId(Long id) {
        if (id == null) {
            return null;
        }
        Signature signature = new Signature();
        signature.setId(id);
        return signature;
    }
}
