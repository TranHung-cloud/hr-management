package com.hrmanagement.backend.security;

import lombok.Getter;

@Getter
public enum AppRole {
    HR_MANAGER("Trưởng phòng nhân sự"),
    RECRUITER("Nhân viên tuyển dụng"),
    INTERVIEWER("Người phỏng vấn"),
    CANDIDATE("Ứng viên");

    private final String vietnameseName;

    AppRole(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public String getAuthority() {
        return "ROLE_" + this.name();
    }

    public static AppRole fromRoleName(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            return CANDIDATE;
        }

        String normalized = roleName.trim().toUpperCase();
        for (AppRole role : values()) {
            if (role.name().equalsIgnoreCase(normalized) 
                    || role.getVietnameseName().equalsIgnoreCase(roleName.trim())) {
                return role;
            }
        }
        return CANDIDATE;
    }
}
