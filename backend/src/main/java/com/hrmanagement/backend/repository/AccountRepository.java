package com.hrmanagement.backend.repository;
import com.hrmanagement.backend.entity.Account;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByAccEmailIgnoreCase(String email);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.accId = :id")
    Optional<Account> findLockedById(UUID id);
    @Query("select a from Account a where not exists (select c from Candidate c where c.account = a) order by a.accName, a.accId")
    List<Account> findStaff();
}
