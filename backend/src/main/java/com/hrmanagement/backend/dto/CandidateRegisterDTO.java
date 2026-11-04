package com.hrmanagement.backend.dto;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CandidateRegisterDTO {
    // Thông tin bắt buộc bên Account
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String accEmail;

    @NotBlank(message = "Password is required")
    private String accPassword;

    @NotBlank(message = "Full name is required")
    private String accName;

    @NotBlank(message = "Gender is required")
    private String accGender;

    @NotNull(message = "Date of birth is required")
    private LocalDate accDob;

    @NotBlank(message = "Phone is required")
    private String accPhone;

    // Thông tin bắt buộc bên Candidate
    @NotBlank(message = "Major is required")
    private String candMajor;

    @NotNull(message = "Experience year is required")
    private Integer candExpYear;

    @NotNull(message = "Expected salary is required")
    private Integer candExpectedSal;

    @NotBlank(message = "CV path is required")
    private String candCvPath;

    // Thông tin bổ sung (tùy chọn)
    private String candNote;
    private UUID dtId;
    private Set<UUID> skillIds;
}
