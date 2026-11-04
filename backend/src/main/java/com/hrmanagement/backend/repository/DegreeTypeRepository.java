package com.hrmanagement.backend.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hrmanagement.backend.entity.DegreeType;

public interface DegreeTypeRepository extends JpaRepository<DegreeType, UUID> {
}
