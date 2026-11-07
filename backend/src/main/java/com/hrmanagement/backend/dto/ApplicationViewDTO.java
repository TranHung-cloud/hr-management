package com.hrmanagement.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.hrmanagement.backend.entity.enums.InterviewProcessStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class ApplicationViewDTO {
    private UUID appId;
    private LocalDateTime appCreatedAt;
    // account
    private String appName;
    private String appEmail;
    private String recruiterName;
    // department
    private String depName;
    // jd
    private String jdTitle;
    // interview process
    private LocalDateTime ipScheduledAt;
    private InterviewProcessStatus ipStatus;
}
