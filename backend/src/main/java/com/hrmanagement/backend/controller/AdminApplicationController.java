package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.dto.ApplicationDetailViewDTO;
import com.hrmanagement.backend.dto.ApplicationViewDTO;
import com.hrmanagement.backend.entity.enums.InterviewProcessStatus;
import com.hrmanagement.backend.service.AccountService;
import com.hrmanagement.backend.service.ApplicationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/admin/applications")
@RequiredArgsConstructor
public class AdminApplicationController {
    private final ApplicationService applicationService;

    @GetMapping()
    public ResponseEntity<Page<ApplicationViewDTO>> getApplicationsPage(
            @RequestParam(required = false) UUID depId,
            @RequestParam(required = false) InterviewProcessStatus ipStatus,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(applicationService.getApplicationsPage(depId, ipStatus, keyword, pageable));
    }

    @PostMapping("/accept")
    public ResponseEntity<Void> acceptApplications(
            @RequestBody List<UUID> applicationIds) {
        applicationService.acceptApplications(applicationIds);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/reject")
    public ResponseEntity<Void> rejectApplications(
            @RequestBody List<UUID> applicationIds) {
        applicationService.rejectApplications(applicationIds);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{appId}")
    public ResponseEntity<ApplicationDetailViewDTO> getApplicationDetail(
            @PathVariable UUID appId) {
        return ResponseEntity.ok(applicationService.getApplicationDetail(appId));
    }

}
