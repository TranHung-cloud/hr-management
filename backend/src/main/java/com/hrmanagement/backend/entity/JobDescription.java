package com.hrmanagement.backend.entity;

import com.hrmanagement.backend.entity.enums.JobStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Entity
@Data
public class JobDescription {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID jobId;
        @Column(nullable = false)
        private String jobTitle;
        @Column(nullable = false)
        private String jobDesc;
        private Integer salaryMin;
        private Integer salaryMax;
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private JobStatus jobStatus;
        @Column(nullable = false)
        @Min(1)
        private String jobTarget;
        private String jobMajor;

        @ManyToOne
        @JoinColumn(name = "dep_id", nullable = false)
        private Department department;

        @ManyToOne
        @JoinColumn(name = "recruiter_id", nullable = false)
        private Account recruiter;

        @ManyToOne
        @JoinColumn(name = "dt_id")
        private DegreeType degreeType;

        @ManyToMany
        @JoinTable(name = "campaign_job_description", joinColumns = @JoinColumn(name = "job_id"), inverseJoinColumns = @JoinColumn(name = "cp_id"))
        private Set<Campaign> campaigns;

        @ManyToMany
        @JoinTable(name = "skill_job_description", joinColumns = @JoinColumn(name = "job_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
        private Set<Skill> skills;
}
