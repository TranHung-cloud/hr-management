package com.hrmanagement.backend.repository;

import com.hrmanagement.backend.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID> {

    @Query("""
        SELECT j.jdId, j.jdTitle, d.depName, j.salaryMin, j.salaryMax, j.jobTarget, 
               a.accName, j.jobStatus,
               (SELECT COUNT(app) FROM Application app WHERE app.jobDescription.jdId = j.jdId AND app.appStatus = 'ACCEPTED'),
               (SELECT COUNT(app) FROM Application app WHERE app.jobDescription.jdId = j.jdId)
        FROM JobDescription j
        LEFT JOIN j.department d
        LEFT JOIN j.recruiter a
    """)
    List<Object[]> findAllJobCustom();
}