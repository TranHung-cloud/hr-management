package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.service.RoleService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrmanagement.backend.dto.RoleViewDTO;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping()
    public ResponseEntity<List<RoleViewDTO>> getAll() {
        return ResponseEntity.ok(roleService.getAll());
    }

}
