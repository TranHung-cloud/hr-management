package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.InterviewStage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface InterviewStageRepository extends JpaRepository<InterviewStage, UUID> {
    List<InterviewStage> findAllByOrderByIsOrderAscIsIdAsc();
}
