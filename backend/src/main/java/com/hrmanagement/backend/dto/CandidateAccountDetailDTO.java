package com.hrmanagement.backend.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class CandidateAccountDetailDTO {
    private UUID accId;
    private String accName;
    private String accEmail;
    private Boolean accIsMale;
    private LocalDate accDob;
    private String accPhone;
    private Integer candExpYear;
    private String candCvPath;
    private String candMajor;
}
