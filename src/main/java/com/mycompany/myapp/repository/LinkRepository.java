package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Link;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Link entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LinkRepository extends JpaRepository<Link, Long> {
}
