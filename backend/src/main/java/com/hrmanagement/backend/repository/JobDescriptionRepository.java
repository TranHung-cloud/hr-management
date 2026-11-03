package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.JobDescription;
import com.hrmanagement.backend.entity.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID> {
    long countByJobStatus(JobStatus status);
    List<JobDescription> findAllByOrderByJobTitleAscJobIdAsc();
}
