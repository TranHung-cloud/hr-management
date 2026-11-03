package com.hrmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID accId;
    private String accName;
    private String accEmail;
    private String accPassword;
    private String accGender;
    private LocalDate accDob;
    private String accPhone;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "dep_id")
    private Department department;
}
