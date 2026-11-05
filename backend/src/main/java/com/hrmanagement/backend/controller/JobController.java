package com.hrmanagement.backend.controller;

import com.hrmanagement.backend.dto.JobViewDTO;
import com.hrmanagement.backend.repository.JobDescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobController {

    private final JobDescriptionRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<JobViewDTO>> getAllJobs() {
        List<Object[]> rawData = jobRepository.findAllJobCustom();

        List<JobViewDTO> dtos = rawData.stream().map(row -> {
            UUID jdId = (UUID) row[0];
            String title = (String) row[1];
            String depName = (String) row[2];
            Integer salMin = (Integer) row[3];
            Integer salMax = (Integer) row[4];
            Integer targetMax = (Integer) row[5];
            String accName = (String) row[6];
            String status = (String) row[7];
            Long acceptedCount = (Long) row[8];
            Long totalCandidates = (Long) row[9];

            int accepted = acceptedCount != null ? acceptedCount.intValue() : 0;
            int totalTarget = targetMax != null ? targetMax : 1;
            int progressPercent = (int) Math.min(100, Math.round(((double) accepted / totalTarget) * 100));

            // Format mức lương đơn vị triệu VND
            String salaryStr = "Thỏa thuận";
            if (salMin != null && salMax != null) {
                salaryStr = String.format("%d – %d triệu", salMin / 1000000, salMax / 1000000);
            }

            // Lấy initials cho Avatar (vd: Trần Minh Quân -> TMQ)
            String avatarStr = "HR";
            if (accName != null && !accName.isBlank()) {
                avatarStr = Arrays.stream(accName.trim().split("\\s+"))
                        .map(s -> String.valueOf(s.charAt(0)).toUpperCase())
                        .collect(Collectors.joining());
            }

            return JobViewDTO.builder()
                    .id(jdId)
                    .code("TD-" + jdId.toString().substring(0, 5).toUpperCase())
                    .title(title)
                    .department(depName != null ? depName : "Chưa phân công")
                    .type("Toàn thời gian")
                    .salary(salaryStr)
                    .target(accepted + "/" + totalTarget)
                    .progress(progressPercent)
                    .candidates(totalCandidates != null ? totalCandidates.intValue() : 0)
                    .deadline("15/11/2026")
                    .isWarning(false)
                    .assignee(accName != null ? accName : "Chưa rõ")
                    .avatar(avatarStr)
                    .status(status)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}