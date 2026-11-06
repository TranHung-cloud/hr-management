package com.hrmanagement.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrmanagement.backend.entity.InterviewProcess;
import com.hrmanagement.backend.entity.id.InterviewProcessId;

public interface InterviewProcessRepository extends JpaRepository<InterviewProcess, InterviewProcessId> {
    Optional<InterviewProcess> findByApplication_AppId(UUID appId);
}
