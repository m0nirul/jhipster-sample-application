package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SignatureValidation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SignatureValidation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SignatureValidationRepository extends JpaRepository<SignatureValidation, Long> {}
