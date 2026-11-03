package com.hrmanagement.backend.repository;

import com.hrmanagement.backend.entity.*;
import com.hrmanagement.backend.entity.id.*;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.data.jpa.repository.*;

public interface InterviewProcessRepository extends JpaRepository<InterviewProcess, InterviewProcessId>, JpaSpecificationExecutor<InterviewProcess> {
    @Query("select i from InterviewProcess i where i.application.appId = :id order by i.interviewStage.isOrder, i.interviewStage.isId")
    List<InterviewProcess> findRounds(ApplicationId id);

    @Query("select i from InterviewProcess i where i.application in :applications")
    List<InterviewProcess> findForApplications(Collection<Application> applications);

    @Query("select i from InterviewProcess i where i.interviewer.accId = :interviewer and i.status = com.hrmanagement.backend.entity.enums.InterviewProcessStatus.SCHEDULED and i.scheduledAt > :after and i.scheduledAt < :before")
    List<InterviewProcess> findConflicting(UUID interviewer, LocalDateTime after, LocalDateTime before);
}
