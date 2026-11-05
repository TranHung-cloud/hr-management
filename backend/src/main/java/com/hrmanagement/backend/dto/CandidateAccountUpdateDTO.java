package com.hrmanagement.backend.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class CandidateAccountUpdateDTO {
    @NotBlank(message = "Tên là bắt buộc")
    private String accName;
    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    private String accEmail;
    private String accPassword;
    @NotNull(message = "Giới tính là bắt buộc")
    private Boolean accIsMale;

    @NotNull(message = "Ngày sinh là bắt buộc")
    private LocalDate accDob;

    @NotBlank(message = "Số điện thoại là bắt buộc")
    private String accPhone;

    @Min(value = 0, message = "Số năm kinh nghiệm phải lớn hơn hoặc bằng 0")
    @NotNull(message = "Số năm kinh nghiệm là bắt buộc")
    private Integer candExpYear;
    @NotNull(message = "CV là bắt buộc")
    private String candCvPath;
    private String candMajor;
    private List<UUID> skillIds;
    private UUID dtId;
}
