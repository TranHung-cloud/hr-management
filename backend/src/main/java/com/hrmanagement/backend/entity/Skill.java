package com.hrmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Entity
@Data
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID skillId;
    @Column(nullable = false, unique = true)
    private String skillName;

    @ManyToMany(mappedBy = "skills")
    private Set<JobDescription> jobDescriptions;

    @ManyToMany(mappedBy = "skills")
    private Set<Candidate> candidates;
}
