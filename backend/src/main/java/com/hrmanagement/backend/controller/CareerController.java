package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.dto.CareerDtos.*;
import com.hrmanagement.backend.security.CustomUserDetails;
import com.hrmanagement.backend.service.CareerService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController @RequiredArgsConstructor @Validated
public class CareerController {
    private final CareerService careers;
    @GetMapping("/api/public/jobs")
    public Page<Job> jobs(@RequestParam(required=false) @Size(max=200) String query,
            @RequestParam(required=false) UUID departmentId,@RequestParam(required=false) UUID degreeId,
            @RequestParam(required=false) Integer salaryMin,@RequestParam(required=false) Integer salaryMax,
            @RequestParam(defaultValue="0") @Min(0) int page,@RequestParam(defaultValue="12") @Min(1) @Max(50) int size) {
        return careers.jobs(query,departmentId,degreeId,salaryMin,salaryMax,page,size);
    }
    @GetMapping("/api/public/jobs/filters") public Filters filters() {return careers.filters();}
    @GetMapping("/api/public/jobs/{id}") public Job detail(@PathVariable UUID id) {return careers.detail(id);}
    @GetMapping("/api/candidate/profile") public Profile profile(@AuthenticationPrincipal CustomUserDetails user) {return careers.profile(user);}
    @GetMapping("/api/candidate/profile/cv") public ResponseEntity<Resource> cv(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=CV.pdf")
            .header(HttpHeaders.CACHE_CONTROL,"private, no-store").header("X-Content-Type-Options","nosniff").body(careers.download(user));
    }
    @PutMapping(value="/api/candidate/profile/cv",consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public Profile upload(@AuthenticationPrincipal CustomUserDetails user,@RequestParam("cv") MultipartFile cv) {return careers.upload(user,cv);}
    @GetMapping("/api/candidate/jobs/{id}/application")
    public ApplicationState state(@AuthenticationPrincipal CustomUserDetails user,@PathVariable UUID id) {return careers.applicationState(user,id);}
    @PostMapping("/api/candidate/jobs/{id}/applications") @ResponseStatus(HttpStatus.CREATED)
    public Receipt apply(@AuthenticationPrincipal CustomUserDetails user,@PathVariable UUID id,@RequestBody @Valid Apply input) {return careers.apply(user,id,input);}
    @PostMapping(value="/api/auth/register-with-cv",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) @ResponseStatus(HttpStatus.CREATED)
    public void register(@ModelAttribute @Valid Signup input) {careers.register(input);}
}
