package com.hrmanagement.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
public class InterviewMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID imId;
    @Column(nullable = false, unique = true)
    private String imName;
}
