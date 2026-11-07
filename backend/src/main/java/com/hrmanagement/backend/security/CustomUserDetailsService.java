package com.hrmanagement.backend.security;
import com.hrmanagement.backend.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final AccountRepository accountRepository;
    @Override @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        var matches = accountRepository.findByAccEmailIgnoreCase(email.trim());
        if (matches.size() != 1) throw new UsernameNotFoundException("Email hoặc mật khẩu không đúng.");
        return CustomUserDetails.build(matches.getFirst());
    }
}
