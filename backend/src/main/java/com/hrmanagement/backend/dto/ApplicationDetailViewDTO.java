package com.hrmanagement.backend.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class ApplicationDetailViewDTO {
    private String appName;
    private String appEmail;
    private String appPhone;
    private Boolean appIsMale;
    private LocalDate appDob;
    private String appDegreeType;
    private List<String> appSkills;
    // jd
    private String jdTitle;
    // interview
    private String interviewStage;
    private String interviewSchedule;
    private String interviewStatus;
    private String interviewFeedback;
}
