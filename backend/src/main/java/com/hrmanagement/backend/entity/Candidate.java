package com.hrmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID candId;
    private String candNote;
    @CreationTimestamp
    @Column(name = "cand_created_at", updatable = false)
    private LocalDateTime candCreatedAt;
    private Integer candExpectedSal;
    private Integer candProposalSal;
    private String candCvPath;
    private Integer candExpYear;
    private String candMajor;

    @OneToOne
    @JoinColumn(name = "acc_id", unique = true)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "dt_id")
    private DegreeType dt;

    @ManyToMany
    @JoinTable(
            name = "skill_candidate",
            joinColumns = @JoinColumn(name = "cand_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills;
}
