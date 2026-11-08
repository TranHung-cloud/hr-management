package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.security.AccountPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class AuthController {
    public record Identity(UUID accountId, String username, String displayName, Set<String> roles) {}
    @GetMapping("/api/auth/me")
    public Identity me(@AuthenticationPrincipal AccountPrincipal account) {
        return new Identity(account.accountId(), account.email(), account.displayName(), account.roles());
    }
}
