package com.hrmanagement.backend.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class RoleViewDTO {
    private UUID roleId;
    private String roleName;
}
