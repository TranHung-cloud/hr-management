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

    @GetMapping("/applications")
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

    @GetMapping("/interviews/{candidateId}/{jobId}/{stageId}")
    public Detail detail(@PathVariable UUID candidateId, @PathVariable UUID jobId, @PathVariable UUID stageId) {
        return service.detail(candidateId, jobId, stageId);
    }

    @PostMapping("/applications/{candidateId}/{jobId}/stages")
    public InterviewView move(@PathVariable UUID candidateId, @PathVariable UUID jobId, @RequestBody @Valid MoveStage request) {
        return service.move(candidateId, jobId, request);
    }

    @PostMapping("/applications/{candidateId}/{jobId}/interviews")
    public InterviewView createSchedule(@PathVariable UUID candidateId, @PathVariable UUID jobId, @RequestBody @Valid CreateSchedule request) {
        return service.createSchedule(candidateId, jobId, request);
    }

    @PutMapping("/interviews/{candidateId}/{jobId}/{stageId}/schedule")
    public InterviewView schedule(@PathVariable UUID candidateId, @PathVariable UUID jobId, @PathVariable UUID stageId, @RequestBody @Valid Schedule request) {
        return service.reschedule(candidateId, jobId, stageId, request);
    }

    @PutMapping("/interviews/{candidateId}/{jobId}/{stageId}/feedback")
    public InterviewView feedback(@PathVariable UUID candidateId, @PathVariable UUID jobId, @PathVariable UUID stageId, @RequestBody @Valid Feedback request) {
        return service.feedback(candidateId, jobId, stageId, request);
    }

    @PutMapping("/applications/{candidateId}/{jobId}/status")
    public ApplicationView decision(@PathVariable UUID candidateId, @PathVariable UUID jobId, @RequestBody @Valid Decision request) {
        return service.decide(candidateId, jobId, request);
    }
}
