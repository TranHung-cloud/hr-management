package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.InterviewMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface InterviewMethodRepository extends JpaRepository<InterviewMethod, UUID> {}
