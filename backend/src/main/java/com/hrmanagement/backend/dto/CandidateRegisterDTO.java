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
    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    private String accEmail;

    @NotBlank(message = "Password là bắt buộc")
    private String accPassword;

    @NotBlank(message = "Tên là bắt buộc")
    private String accName;

    @NotNull(message = "Giới tính là bắt buộc")
    private Boolean accIsMale;

    @NotNull(message = "Ngày sinh là bắt buộc")
    private LocalDate accDob;

    @NotBlank(message = "Số điện thoại là bắt buộc")
    private String accPhone;

    @NotNull(message = "Số năm kinh nghiệm là bắt buộc")
    private Integer candExpYear;

    @NotBlank(message = "CV là bắt buộc")
    private String candCvPath;

    // Thông tin bổ sung (tùy chọn)
    private String candMajor;
    private UUID dtId;
    private Set<UUID> skillIds;
}
