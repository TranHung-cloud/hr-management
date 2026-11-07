package com.hrmanagement.backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.hrmanagement.backend.entity.enums.ApplicationStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID appId;

    @Column(name = "app_expcted_sal")
    private Integer appExpctedSal;
    private Integer appProposalSal;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime appCreatedAt;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus appStatus = ApplicationStatus.SUBMITTED;

    @ManyToOne
    @JoinColumn(name = "cand_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "jd_id", nullable = false)
    private JobDescription jobDescription;
}
