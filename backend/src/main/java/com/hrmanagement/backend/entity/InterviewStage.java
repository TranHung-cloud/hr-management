package com.hrmanagement.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewStage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID isId;
    @Column(nullable = false, unique = true)
    private String isName;
    @Column(nullable = false, unique = true)
    private Integer isOrder;
}
