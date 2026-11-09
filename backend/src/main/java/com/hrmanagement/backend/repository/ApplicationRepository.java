package com.hrmanagement.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.backend.entity.Application;
import com.hrmanagement.backend.entity.enums.ApplicationStatus;

import jakarta.persistence.LockModeType;

public interface ApplicationRepository extends JpaRepository<Application, UUID>, JpaSpecificationExecutor<Application> {
    long countByAppStatus(ApplicationStatus appStatus);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Application a where a.candidate.candId = :candId and a.jobDescription.jdId = :jdId")
    Optional<Application> findLockedByCandidateAndJob(@Param("candId") UUID candId, @Param("jdId") UUID jdId);

    Optional<Application> findByCandidate_CandIdAndJobDescription_JdId(UUID candId, UUID jdId);
}
