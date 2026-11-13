package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.dto.JobDescriptionDTO.*;
import com.hrmanagement.backend.entity.enums.JobStatus;
import com.hrmanagement.backend.service.JobDescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/jobs")
@RequiredArgsConstructor
public class AdminJobController {

    private final JobDescriptionService jobService;

    @GetMapping
    public ResponseEntity<Page<JobViewDTO>> getJobsPage(
            @RequestParam(required = false) UUID depId,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(jobService.getJobsPage(depId, status, keyword, pageable));
    }

    @GetMapping("/lookups")
    public ResponseEntity<JobLookupsDTO> getLookups() {
        return ResponseEntity.ok(jobService.getLookups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDetailDTO> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(jobService.getJobDetail(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Void> create(@RequestBody @Valid JobUpsertDTO dto) {
        jobService.createJob(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable UUID id, @RequestBody @Valid JobUpsertDTO dto) {
        jobService.updateJob(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/close")
    public ResponseEntity<Void> closeJobs(@RequestBody List<UUID> jdIds) {
        jobService.closeJobs(jdIds);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable UUID id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}