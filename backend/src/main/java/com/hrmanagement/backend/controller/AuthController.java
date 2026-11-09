package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.security.CustomUserDetails;
import com.hrmanagement.backend.security.JwtTokenProvider;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
    public record Identity(UUID accountId, String username, String displayName, Set<String> roles) {}
    public record AuthResponse(String token, Identity user) {}

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email().trim(), request.password())
            );
            String token = jwtTokenProvider.generateToken(authentication);
            CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
            Identity identity = new Identity(
                    principal.getAccId(),
                    principal.getUsername(),
                    principal.getAccName(),
                    Set.of(principal.getAppRole().name())
            );
            return ResponseEntity.ok(new AuthResponse(token, identity));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác.");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Identity> me(@AuthenticationPrincipal CustomUserDetails user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực.");
        }
        return ResponseEntity.ok(new Identity(
                user.getAccId(),
                user.getUsername(),
                user.getAccName(),
                Set.of(user.getAppRole().name())
        ));
    }
}
