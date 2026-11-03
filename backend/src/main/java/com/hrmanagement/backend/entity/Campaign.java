package com.hrmanagement.backend.entity;

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
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID cpId;
    private String cpMedium;
    private String cpSource;
}
