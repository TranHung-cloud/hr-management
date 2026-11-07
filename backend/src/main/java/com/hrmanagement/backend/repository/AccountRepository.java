package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.Account;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface AccountRepository extends JpaRepository<Account, UUID>, JpaSpecificationExecutor<Account> {
    Optional<Account> findByAccEmail(String email);
    List<Account> findByAccEmailIgnoreCase(String email);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.accId = :id")
    Optional<Account> findLockedById(@Param("id") UUID id);
    @Query("select a from Account a where a.accStatus = com.hrmanagement.backend.entity.enums.AccountStatus.ACTIVE and a.role.roleName in ('Trưởng phòng nhân sự', 'Nhân viên tuyển dụng', 'Người phỏng vấn', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER') and not exists (select c from Candidate c where c.account = a) order by a.accName, a.accId")
    List<Account> findStaff();
}
