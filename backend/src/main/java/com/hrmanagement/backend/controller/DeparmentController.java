package com.hrmanagement.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrmanagement.backend.dto.DepartmentViewDTO;
import com.hrmanagement.backend.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DeparmentController {
    private final DepartmentService departmentService;

    @GetMapping()
    public ResponseEntity<List<DepartmentViewDTO>> getAll() {
        return ResponseEntity.ok(departmentService.getAll());
    }
}
