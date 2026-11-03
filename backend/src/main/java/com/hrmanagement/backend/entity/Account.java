package com.hrmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
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
    @JoinColumn(name = "roleId")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "depId")
    private Department department;
}
