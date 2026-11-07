package com.hrmanagement.backend.config;

import com.hrmanagement.backend.security.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwt,
            JwtAuthenticationEntryPoint entryPoint) throws Exception {
        return http.csrf(c -> c.disable()).cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e.authenticationEntryPoint(entryPoint))
            .authorizeHttpRequests(a -> a
                .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/register-with-cv", "/api/public/**", "/error").permitAll()
                .requestMatchers("/api/auth/me").authenticated()
                .requestMatchers("/api/candidate/**").hasRole("CANDIDATE")
                .requestMatchers("/api/admin/accounts/**", "/api/admin/departments/**", "/api/admin/system/**").hasRole("HR_MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/admin/**").hasAnyRole("HR_MANAGER", "RECRUITER", "INTERVIEWER")
                .requestMatchers(HttpMethod.PUT, "/api/admin/interviews/*/*/feedback").hasAnyRole("HR_MANAGER", "RECRUITER", "INTERVIEWER")
                .requestMatchers("/api/admin/**").hasAnyRole("HR_MANAGER", "RECRUITER")
                .anyRequest().authenticated())
            .httpBasic(b -> b.authenticationEntryPoint(entryPoint))
            .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class).build();
    }
    // The JWT filter belongs to the security chain, not both servlet/security chains.
    @Bean FilterRegistrationBean<JwtAuthenticationFilter> jwtRegistration(JwtAuthenticationFilter filter) {
        var registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
    @Bean CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000}") String origins) {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(origins.split(",")).map(String::trim).toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
