package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.JobDescription;
import com.hrmanagement.backend.entity.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<JobDescription> {
    Optional<JobDescription> findByJdIdAndJdStatus(UUID id, JobStatus status);
    long countByJdStatus(JobStatus status);
    List<JobDescription> findAllByOrderByJdTitleAscJdIdAsc();
}
