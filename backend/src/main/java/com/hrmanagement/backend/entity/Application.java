package com.hrmanagement.backend.entity;

import com.hrmanagement.backend.entity.id.ApplicationId;
import com.hrmanagement.backend.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Application {
    @EmbeddedId
    private ApplicationId appId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @ManyToOne
    @MapsId("candId")
    @JoinColumn(name = "cand_id")
    private Candidate candidate;

    @ManyToOne
    @MapsId("jobId")
    @JoinColumn(name = "job_id")
    private JobDescription jobDescription;
}
