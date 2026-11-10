package com.hrmanagement.backend.service;

import com.hrmanagement.backend.repository.DepartmentRepository;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hrmanagement.backend.dto.DepartmentViewDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public List<DepartmentViewDTO> getAll() {
        return departmentRepository.findAll().stream()
                .map(dep -> new DepartmentViewDTO(dep.getDepId(), dep.getDepName()))
                .toList();
    }
}
