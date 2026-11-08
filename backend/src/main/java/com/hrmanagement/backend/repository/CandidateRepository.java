package com.hrmanagement.backend.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hrmanagement.backend.entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    Optional<Candidate> findByAccount_AccId(UUID accId);

    boolean existsByAccountAccId(UUID id);
}
