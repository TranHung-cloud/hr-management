package com.hrmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.UUID;
import com.hrmanagement.backend.entity.enums.AccountStatus;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private AccountStatus accStatus = AccountStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "roleId", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "dep_id")
    private Department department;
}
