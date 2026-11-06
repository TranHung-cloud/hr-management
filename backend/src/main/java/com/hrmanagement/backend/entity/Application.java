package com.hrmanagement.backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.hrmanagement.backend.entity.enums.ApplicationStatus;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID appId;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime appCreatedAt;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus appStatus = ApplicationStatus.SUBMITTED;

    @ManyToOne
    @JoinColumn(name = "candId", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "jdId", nullable = false)
    private JobDescription jobDescription;
}
