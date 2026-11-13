package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.service.AccountService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrmanagement.backend.dto.AccountViewDTO;
import com.hrmanagement.backend.dto.AdminAccountCreateDTO;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {
    private final AccountService accountService;

    @GetMapping()
    public ResponseEntity<Page<AccountViewDTO>> getAccountsPage(
            @RequestParam(required = false) UUID roleId,
            @RequestParam(required = false) UUID depId,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(
                accountService.getAccountsPage(roleId, depId, keyword, pageable));
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createAdminAccount(
            @RequestBody @jakarta.validation.Valid AdminAccountCreateDTO dto) {
        accountService.createAdminAccount(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/set-inactive")
    public ResponseEntity<Void> inactiveAccounts(
            @RequestBody List<UUID> accIds) {
        accountService.inactiveAccounts(accIds);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/set-active")
    public ResponseEntity<Void> activeAccounts(
            @RequestBody List<UUID> accIds) {
        accountService.activeAccounts(accIds);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(accountService.getAccountDetailsById(id));
    }

}
