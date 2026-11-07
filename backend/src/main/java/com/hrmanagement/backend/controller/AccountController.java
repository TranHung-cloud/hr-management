package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.dto.AdminAccountUpdateDTO;
import com.hrmanagement.backend.dto.CandidateAccountUpdateDTO;
import com.hrmanagement.backend.entity.Account;
import com.hrmanagement.backend.security.AppRole;
import com.hrmanagement.backend.service.AccountService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final ObjectMapper objectMapper;

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentAccountDetails() {
        return ResponseEntity.ok(
                accountService.getCurrentAccountDetails());
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateCurrentAccount(
            @RequestBody JsonNode data) {
        Account account = accountService.getCurrentAccount();
        String roleName = account.getRole().getRoleName();
        if (roleName.equalsIgnoreCase(AppRole.CANDIDATE.name())
                || roleName.equalsIgnoreCase(AppRole.CANDIDATE.getVietnameseName())) {
            CandidateAccountUpdateDTO candidateData = objectMapper.convertValue(data, CandidateAccountUpdateDTO.class);
            accountService.updateCandidateAccount(candidateData);
        } else if (roleName.equalsIgnoreCase(AppRole.HR_MANAGER.name())
                || roleName.equalsIgnoreCase(AppRole.HR_MANAGER.getVietnameseName())
                || roleName.equalsIgnoreCase(AppRole.RECRUITER.name())
                || roleName.equalsIgnoreCase(AppRole.RECRUITER.getVietnameseName())
                || roleName.equalsIgnoreCase(AppRole.INTERVIEWER.name())
                || roleName.equalsIgnoreCase(AppRole.INTERVIEWER.getVietnameseName())) {
            AdminAccountUpdateDTO adminData = objectMapper.convertValue(data, AdminAccountUpdateDTO.class);
            accountService.updateAdminAccount(adminData);
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
