package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Signature;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Signature entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SignatureRepository extends JpaRepository<Signature, Long> {
    @Query("select signature from Signature signature where signature.owner.login = ?#{principal.preferredUsername}")
    List<Signature> findByOwnerIsCurrentUser();
}
