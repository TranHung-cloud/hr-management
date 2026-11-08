package com.hrmanagement.backend.security;

import com.hrmanagement.backend.repository.AccountRepository;
import com.hrmanagement.backend.repository.CandidateRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class AccountUserDetailsService implements UserDetailsService {
    private final AccountRepository accounts;
    private final CandidateRepository candidates;
    public AccountUserDetailsService(AccountRepository accounts, CandidateRepository candidates) {
        this.accounts = accounts; this.candidates = candidates;
    }
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        var matches = accounts.findByAccEmailIgnoreCase(email.trim());
        if (matches.size() != 1) throw invalid();
        var a = matches.getFirst();
        if (a.getAccPassword() == null || !a.getAccPassword().matches("^\\$2[aby]\\$\\d{2}\\$.{53}$")) throw invalid();
        Set<String> roles;
        String role = a.getRole() == null ? "" : Objects.toString(a.getRole().getRoleName(), "").trim();
        if (candidates.existsByAccountAccId(a.getAccId()) || role.equals("Ứng viên")) roles = Set.of("CANDIDATE");
        else if (role.equals("Trưởng phòng nhân sự") || role.equals("Nhân viên tuyển dụng")) roles = Set.of("ADMIN");
        else if (role.equals("Người phỏng vấn")) roles = Set.of("INTERVIEWER");
        else throw invalid();
        return new AccountPrincipal(a.getAccId(), a.getAccEmail(), a.getAccName(), a.getAccPassword(), roles);
    }
    private UsernameNotFoundException invalid() { return new UsernameNotFoundException("Email hoặc mật khẩu không hợp lệ."); }
}
