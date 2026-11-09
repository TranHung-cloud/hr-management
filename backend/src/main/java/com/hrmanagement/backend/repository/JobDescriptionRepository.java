package com.hrmanagement.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrmanagement.backend.entity.JobDescription;
import com.hrmanagement.backend.entity.enums.JobStatus;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID> {
    long countByJdStatus(JobStatus status);
    List<JobDescription> findAllByOrderByJdTitleAscJdIdAsc();
}
