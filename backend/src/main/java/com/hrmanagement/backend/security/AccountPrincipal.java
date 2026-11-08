package com.hrmanagement.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.*;

public record AccountPrincipal(UUID accountId, String email, String displayName, String password,
                               Set<String> roles) implements UserDetails {
    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r)).toList();
    }
    @Override public String toString() { return "AccountPrincipal[accountId=" + accountId + "]"; }
}
