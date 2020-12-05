package com.mycompany.myapp.service.mapper;


import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.SignatureValidationDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link SignatureValidation} and its DTO {@link SignatureValidationDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SignatureValidationMapper extends EntityMapper<SignatureValidationDTO, SignatureValidation> {


    @Mapping(target = "signature", ignore = true)
    SignatureValidation toEntity(SignatureValidationDTO signatureValidationDTO);

    default SignatureValidation fromId(Long id) {
        if (id == null) {
            return null;
        }
        SignatureValidation signatureValidation = new SignatureValidation();
        signatureValidation.setId(id);
        return signatureValidation;
    }
}
