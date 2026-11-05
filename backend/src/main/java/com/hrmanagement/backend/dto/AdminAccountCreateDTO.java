package com.hrmanagement.backend.dto;

import java.util.UUID;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminAccountCreateDTO {
    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotNull(message = "Vai trò là bắt buộc")
    private UUID roleId;

    private UUID depId;
}
