package com.hrmanagement.backend.entity;

import com.hrmanagement.backend.entity.enums.JobStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
public class JobDescription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID jobId;
    private String jobTitle;
    private String jobDesc;
    private Integer salaryMin;
    private Integer salaryMax;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus jobStatus;
    private String jobTarget;
    private String jobMajor;

    @ManyToOne
    @JoinColumn(name = "dep_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private Account recruiter;

    @ManyToOne
    @JoinColumn(name = "dt_id")
    private DegreeType degreeType;

    @ManyToMany
    @JoinTable(
            name = "campaign_job_description",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "cp_id")
    )
    private Set<Campaign> campaigns;

    @ManyToMany
    @JoinTable(
            name = "skill_job_description",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills;
}
