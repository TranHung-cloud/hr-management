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
public class AccountViewDTO {
    private UUID accId;
    private String accName;
    private String accEmail;
    private Boolean accIsMale;
    private String accDob;
    private String accPhone;
    private String roleName;
    private String depName;
}
