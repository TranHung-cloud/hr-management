package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.*;
import com.hrmanagement.backend.entity.id.InterviewProcessId;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.*;
public interface InterviewProcessRepository extends JpaRepository<InterviewProcess, InterviewProcessId>, JpaSpecificationExecutor<InterviewProcess> {
    Optional<InterviewProcess> findFirstByApplication_AppIdOrderByInterviewStage_IsOrderDesc(UUID appId);
    @Query("select i from InterviewProcess i where i.application in :applications")
    List<InterviewProcess> findForApplications(@Param("applications") List<Application> applications);
    @Query("select i from InterviewProcess i where i.application.appId = :id order by i.interviewStage.isOrder, i.ipId.isId")
    List<InterviewProcess> findRounds(@Param("id") UUID id);
    @Query("select i from InterviewProcess i where i.interviewer.accId = :id and i.ipStatus = com.hrmanagement.backend.entity.enums.InterviewProcessStatus.SCHEDULED and i.ipScheduledAt > :from and i.ipScheduledAt < :to")
    List<InterviewProcess> findConflicting(@Param("id") UUID id, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
