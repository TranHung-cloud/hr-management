package com.hrmanagement.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.hrmanagement.backend.security.AppRole;
import com.hrmanagement.backend.security.JwtAuthenticationEntryPoint;
import com.hrmanagement.backend.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final JwtAuthenticationEntryPoint authenticationEntryPoint;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
                return configuration.getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(Customizer.withDefaults())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint))
                                .authorizeHttpRequests(auth -> auth
                                                // 1. Public API: Đăng nhập, đăng ký, tra cứu tin public
                                                .requestMatchers("/api/auth/**", "/api/public/**", "/error").permitAll()

                                                // 2. Tiền tố /api/admin/**: CANDIDATE tuyệt đối không được truy cập.
                                                // Trưởng phòng nhân sự (HR_MANAGER) có quyền toàn bộ /api/admin/**
                                                // RECRUITER và INTERVIEWER chỉ được vào các endpoint admin được phân
                                                // công
                                                .requestMatchers("/api/admin/accounts/**", "/api/admin/departments/**",
                                                                "/api/admin/system/**")
                                                .hasRole(AppRole.HR_MANAGER.name())
                                                .requestMatchers("/api/admin/jobs/**", "/api/admin/campaigns/**",
                                                                "/api/admin/candidates/**")
                                                .hasAnyRole(AppRole.HR_MANAGER.name(), AppRole.RECRUITER.name())
                                                .requestMatchers("/api/admin/interviews/**")
                                                .hasAnyRole(AppRole.HR_MANAGER.name(), AppRole.RECRUITER.name(),
                                                                AppRole.INTERVIEWER.name())
                                                .requestMatchers("/api/admin/**")
                                                .hasRole(AppRole.HR_MANAGER.name())

                                                // 3. Các API không có tiền tố /api/admin/** (cho CANDIDATE và các role
                                                // khác)
                                                .anyRequest().authenticated());

                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOriginPatterns(List.of("*"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
