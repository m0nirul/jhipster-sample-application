package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Signature;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Signature entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SignatureRepository extends JpaRepository<Signature, Long> {

    @Query("select signature from Signature signature where signature.owner.login = ?#{principal.preferredUsername}")
    List<Signature> findByOwnerIsCurrentUser();
}
