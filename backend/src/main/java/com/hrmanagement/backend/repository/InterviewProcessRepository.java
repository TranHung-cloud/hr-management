package com.hrmanagement.backend.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.backend.entity.Application;
import com.hrmanagement.backend.entity.InterviewProcess;
import com.hrmanagement.backend.entity.id.InterviewProcessId;

public interface InterviewProcessRepository extends JpaRepository<InterviewProcess, InterviewProcessId>, JpaSpecificationExecutor<InterviewProcess> {
    Optional<InterviewProcess> findFirstByApplication_AppIdOrderByInterviewStage_IsOrderDesc(UUID appId);

    @Query("select i from InterviewProcess i where i.application.appId = :appId order by i.interviewStage.isOrder, i.interviewStage.isId")
    List<InterviewProcess> findRounds(@Param("appId") UUID appId);

    @Query("select i from InterviewProcess i where i.application in :applications")
    List<InterviewProcess> findForApplications(@Param("applications") Collection<Application> applications);

    @Query("select i from InterviewProcess i where i.interviewer.accId = :interviewer and i.ipStatus = com.hrmanagement.backend.entity.enums.InterviewProcessStatus.SCHEDULED and i.ipScheduledAt > :after and i.ipScheduledAt < :before")
    List<InterviewProcess> findConflicting(@Param("interviewer") UUID interviewer, @Param("after") LocalDateTime after, @Param("before") LocalDateTime before);
}
