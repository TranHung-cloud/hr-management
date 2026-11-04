package com.hrmanagement.backend.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hrmanagement.backend.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {
}
