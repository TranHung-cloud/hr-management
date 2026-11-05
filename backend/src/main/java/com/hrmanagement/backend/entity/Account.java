package com.hrmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;
import com.hrmanagement.backend.entity.enums.AccountStatus;

@Entity
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID accId;
    private String accName;
    @Column(unique = true, nullable = false)
    private String accEmail;
    @Column(nullable = false)
    private String accPassword;
    @Column(nullable = false)
    private Boolean accIsMale;
    private LocalDate accDob;
    private String accPhone;
    @Enumerated(EnumType.STRING)
    private AccountStatus accStatus;

    @ManyToOne
    @JoinColumn(name = "roleId", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "depId")
    private Department department;
}
