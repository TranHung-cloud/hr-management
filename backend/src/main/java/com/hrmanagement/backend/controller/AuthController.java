package com.hrmanagement.backend.controller;
import com.hrmanagement.backend.security.*;
import com.hrmanagement.backend.service.AccountService;
import com.hrmanagement.backend.dto.CandidateRegisterDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokens;
    private final AccountService accounts;
    public record Identity(UUID accountId, String username, String displayName, Set<String> roles) {}
    public record Login(@NotBlank @Email String email, @NotBlank String password) {}
    public record Token(String accessToken, String tokenType, Identity identity) {}
    private Identity identity(CustomUserDetails user) {
        return new Identity(user.getAccId(), user.getAccEmail(), user.getAccName(), Set.of(user.getAppRole().name()));
    }
    @GetMapping("/me") public Identity me(@AuthenticationPrincipal CustomUserDetails user) { return identity(user); }
    @PostMapping("/login") public Token login(@RequestBody @Valid Login input) {
        Authentication auth = authenticationManager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(input.email().trim(), input.password()));
        return new Token(tokens.generateToken(auth), "Bearer", identity((CustomUserDetails) auth.getPrincipal()));
    }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody @Valid CandidateRegisterDTO input) { accounts.createCandidateAccount(input); }
}
