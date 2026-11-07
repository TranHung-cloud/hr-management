package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.dto.RecruitmentDtos.*;
import com.hrmanagement.backend.entity.enums.*;
import com.hrmanagement.backend.service.RecruitmentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@Validated
public class RecruitmentController {
    private final RecruitmentService service;
    public RecruitmentController(RecruitmentService service) { this.service = service; }

    @GetMapping("/lookups")
    public Lookups lookups() { return service.lookups(); }

    @GetMapping("/dashboard")
    public Dashboard dashboard(@RequestParam(required = false) LocalDate from, @RequestParam(required = false) LocalDate to) {
        return service.dashboard(from, to);
    }

    @GetMapping("/pipeline")
    public PageResult<ApplicationView> pipeline(@RequestParam(required = false) String query,
            @RequestParam(required = false) UUID jobId, @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) UUID stageId,
            @RequestParam(defaultValue = "0") @Min(0) int page, @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return service.pipeline(query, jobId, status, stageId, page, size);
    }

    @GetMapping("/interviews")
    public PageResult<InterviewView> schedule(@RequestParam(required = false) LocalDate from, @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false) UUID interviewerId, @RequestParam(required = false) UUID jobId,
            @RequestParam(required = false) UUID stageId, @RequestParam(required = false) InterviewProcessStatus status,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") @Min(0) int page, @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return service.schedule(from, to, interviewerId, jobId, stageId, status, query, page, size);
    }

    @GetMapping("/interviews/{appId}/{stageId}")
    public Detail detail(@PathVariable UUID appId, @PathVariable UUID stageId) {
        return service.detail(appId, stageId);
    }

    @PostMapping("/applications/{appId}/stages")
    public InterviewView move(@PathVariable UUID appId, @RequestBody @Valid MoveStage request) {
        return service.move(appId, request);
    }

    @PostMapping("/applications/{appId}/interviews")
    public InterviewView createSchedule(@PathVariable UUID appId, @RequestBody @Valid CreateSchedule request) {
        return service.createSchedule(appId, request);
    }

    @PutMapping("/interviews/{appId}/{stageId}/schedule")
    public InterviewView schedule(@PathVariable UUID appId, @PathVariable UUID stageId, @RequestBody @Valid Schedule request) {
        return service.reschedule(appId, stageId, request);
    }

    @PutMapping("/interviews/{appId}/{stageId}/feedback")
    public InterviewView feedback(@PathVariable UUID appId, @PathVariable UUID stageId, @RequestBody @Valid Feedback request) {
        return service.feedback(appId, stageId, request);
    }

    @PutMapping("/applications/{appId}/status")
    public ApplicationView decision(@PathVariable UUID appId, @RequestBody @Valid Decision request) {
        return service.decide(appId, request);
    }
}
