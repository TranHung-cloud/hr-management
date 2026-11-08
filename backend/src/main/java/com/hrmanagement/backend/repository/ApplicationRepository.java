package com.hrmanagement.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.hrmanagement.backend.entity.Application;
import com.hrmanagement.backend.entity.id.ApplicationId;
import com.hrmanagement.backend.entity.enums.ApplicationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, UUID>, JpaSpecificationExecutor<Application> {
    long countByStatus(ApplicationStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Application a where a.appId = :id")
    Optional<Application> findLockedById(ApplicationId id);
}
