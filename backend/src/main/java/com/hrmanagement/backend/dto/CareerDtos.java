package com.hrmanagement.backend.dto;

import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.Setter;
import java.time.*;
import java.util.*;

public final class CareerDtos {
    private CareerDtos() {}
    public record Option(UUID id, String name) {}
    public record Filters(List<Option> departments, List<Option> degrees) {}
    public record Job(UUID id, String title, String description, String department, UUID departmentId,
        Integer salaryMin, Integer salaryMax, Integer target, String major, String degree, UUID degreeId, List<String> skills) {}
    public record Page<T>(List<T> content, long totalElements, int page, int size) {}
    public record Profile(String name, String email, String phone, Integer experienceYears, String major,
        String degree, List<String> skills, boolean hasCv, String cvName) {}
    public record Apply(@Min(0) Integer expectedSalary) {}
    public record Receipt(UUID applicationId, String status, LocalDateTime createdAt) {}
    public record ApplicationState(boolean applied, Receipt application) {}
    @Getter @Setter
    public static class Signup {
        @NotBlank @Size(max=255) private String accName;
        @NotBlank @Email @Size(max=255) private String accEmail;
        @NotBlank @Size(min=8,max=72) private String accPassword;
        @NotNull private Boolean accIsMale;
        @NotNull @Past @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) private LocalDate accDob;
        @NotBlank @Size(max=25) private String accPhone;
        @NotNull @Min(0) @Max(80) private Integer candExpYear;
        @Size(max=255) private String candMajor;
        private UUID dtId;
        @NotNull private MultipartFile cv;
    }
}
