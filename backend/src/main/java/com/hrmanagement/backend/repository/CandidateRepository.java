package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    boolean existsByAccountAccId(UUID id);
}
