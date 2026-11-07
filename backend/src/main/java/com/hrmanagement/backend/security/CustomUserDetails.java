package com.hrmanagement.backend.security;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hrmanagement.backend.entity.Account;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final UUID accId;
    private final String accEmail;
    private final String accPassword;
    private final String accName;
    private final AppRole appRole;
    private final Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails build(Account account) {
        String roleName = (account.getRole() != null) ? account.getRole().getRoleName() : null;
        AppRole appRole = AppRole.fromRoleName(roleName);
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(appRole.getAuthority()));

        return new CustomUserDetails(
                account.getAccId(),
                account.getAccEmail(),
                account.getAccPassword(),
                account.getAccName(),
                appRole,
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return accPassword;
    }

    @Override
    public String getUsername() {
        return accEmail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
