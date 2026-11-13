package com.hrmanagement.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.hrmanagement.backend.entity.JobDescription;
import com.hrmanagement.backend.entity.enums.JobStatus;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID>, JpaSpecificationExecutor<JobDescription> {
    Optional<JobDescription> findByJdIdAndJdStatus(UUID id, JobStatus status);

    long countByJdStatus(JobStatus status);
    List<JobDescription> findAllByOrderByJdTitleAscJdIdAsc();
}
