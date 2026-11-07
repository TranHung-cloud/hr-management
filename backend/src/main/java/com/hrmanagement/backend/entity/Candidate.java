package com.hrmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID candId;
    @Column(nullable = false)
    private String candCvPath;
    private Integer candExpYear;
    private String candMajor;

    @OneToOne
    @JoinColumn(name = "acc_id", unique = true, nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "dt_id")
    private DegreeType dt;

    @ManyToMany
    @JoinTable(name = "skill_candidate", joinColumns = @JoinColumn(name = "cand_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<Skill> skills;
}
