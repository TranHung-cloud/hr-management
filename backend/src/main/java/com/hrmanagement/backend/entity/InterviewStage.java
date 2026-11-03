package com.hrmanagement.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class InterviewStage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID isId;
    private String isName;
    private Integer isOrder;
}
