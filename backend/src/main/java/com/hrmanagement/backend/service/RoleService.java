package com.hrmanagement.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hrmanagement.backend.dto.RoleViewDTO;
import com.hrmanagement.backend.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public List<RoleViewDTO> getAll() {
        return roleRepository.findAll().stream().map(role -> new RoleViewDTO(role.getRoleId(), role.getRoleName()))
                .toList();
    }
}
