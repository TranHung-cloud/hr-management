package com.hrmanagement.backend.dto;

import com.hrmanagement.backend.entity.enums.*;
import jakarta.validation.constraints.*;
import java.time.*;
import java.util.*;

public final class RecruitmentDtos {
    private RecruitmentDtos() {}
    public record Option(UUID id, String name) {}
    public record Stage(UUID id, String name, Integer order) {}
    public record Job(UUID id, String title, String department, JobStatus status) {}
    public record Lookups(List<Stage> stages, List<Option> methods, List<Option> interviewers, List<Job> jobs) {}
    public record CandidateInfo(UUID id, String name, String email, String phone, String cvPath,
                                Integer experienceYears, String degree, String major, List<String> skills) {}
    public record InterviewKey(UUID candidateId, UUID jobId, UUID stageId) {}
    public record InterviewView(InterviewKey id, CandidateInfo candidate, Job job, Stage stage,
                                InterviewProcessStatus status, LocalDateTime createdAt, LocalDateTime scheduledAt,
                                String feedback, Option interviewer, Option method, ApplicationStatus applicationStatus) {}
    public record ApplicationView(UUID candidateId, UUID jobId, CandidateInfo candidate, Job job,
                                  ApplicationStatus status, InterviewView currentInterview) {}
    public record Detail(InterviewView interview, List<InterviewView> rounds) {}
    public record PageResult<T>(List<T> content, long totalElements, int page, int size) {}
    public record StageCount(UUID stageId, String name, long count) {}
    public record DailyCount(LocalDate date, long count) {}
    public record Dashboard(long openJobs, long totalApplications, long totalCandidates, long acceptedApplications,
                            long interviewsToday, long upcomingInterviews, List<StageCount> stages,
                            long applicationsWithoutStage, List<DailyCount> dailyInterviews) {}
    public record MoveStage(@NotNull UUID stageId) {}
    public record Schedule(@NotNull LocalDateTime scheduledAt, @NotNull UUID interviewerId, @NotNull UUID methodId) {}
    public record CreateSchedule(@NotNull UUID stageId, @NotNull LocalDateTime scheduledAt, @NotNull UUID interviewerId, @NotNull UUID methodId) {}
    public record Feedback(@NotNull InterviewProcessStatus status, @NotBlank @Size(max = 255) String feedback) {}
    public record Decision(@NotNull ApplicationStatus status) {}
}
