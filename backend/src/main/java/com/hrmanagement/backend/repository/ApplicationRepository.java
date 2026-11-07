package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.Application;
import com.hrmanagement.backend.entity.enums.ApplicationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface ApplicationRepository extends JpaRepository<Application, UUID>, JpaSpecificationExecutor<Application> {
    @Query("select a from Application a where a.candidate.account.accId = :accountId and a.jobDescription.jdId = :jobId order by a.appCreatedAt desc, a.appId")
    List<Application> findCandidateApplications(@Param("accountId") UUID accountId, @Param("jobId") UUID jobId);
    default Optional<Application> findFirstByCandidate_AccIdAndJobId(UUID accountId, UUID jobId) {
        return findCandidateApplications(accountId,jobId).stream().findFirst();
    }
    long countByAppStatus(ApplicationStatus status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Application a where a.appId = :id")
    Optional<Application> findLockedById(@Param("id") UUID id);
}
