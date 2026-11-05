package com.hrmanagement.backend.service;

import com.hrmanagement.backend.repository.ApplicationRepository;
import com.hrmanagement.backend.repository.InterviewProcessRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.hrmanagement.backend.dto.ApplicationDetailViewDTO;
import com.hrmanagement.backend.dto.ApplicationViewDTO;
import com.hrmanagement.backend.entity.Application;
import com.hrmanagement.backend.entity.InterviewProcess;
import com.hrmanagement.backend.entity.JobDescription;
import com.hrmanagement.backend.entity.enums.ApplicationStatus;
import com.hrmanagement.backend.entity.enums.InterviewProcessStatus;

import jakarta.persistence.criteria.Predicate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final InterviewProcessRepository interviewProcessRepository;
    private final AccountService accountService;

    @Transactional(readOnly = true)
    public Page<ApplicationViewDTO> getApplicationsPage(
            UUID depId, InterviewProcessStatus ipStatus,
            String keyword, // ten ung vien, email ung vien, ten job description
            Pageable pageable) {
        // Xử lý pageable mặc định size 10 và sort theo appCreatedAt
        if (pageable == null || pageable.isUnpaged()) {
            pageable = PageRequest.of(0, 10, Sort.by("appCreatedAt").descending());
        } else if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10,
                    Sort.by("appCreatedAt").descending());
        }

        Specification<Application> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (ipStatus != null) {
                predicates.add(cb.equal(root.get("ipStatus"), ipStatus));
            }

            if (depId != null) {
                predicates.add(cb.equal(root.get("department").get("depId"), depId));
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("candidate").get("account").get("accName")),
                        searchPattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("candidate").get("account").get("accEmail")),
                        searchPattern);
                Predicate jdMatch = cb.like(cb.lower(root.get("jobDescription").get("jdTitle")), searchPattern);

                predicates.add(cb.or(nameMatch, emailMatch, jdMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return applicationRepository.findAll(spec, pageable).map(application -> {
            InterviewProcess process = interviewProcessRepository.findByApplicationId(application.getAppId())
                    .orElse(null);
            return new ApplicationViewDTO(
                    application.getAppId(),
                    application.getAppCreatedAt(),
                    application.getCandidate().getAccount().getAccName(),
                    application.getCandidate().getAccount().getAccEmail(),
                    application.getJobDescription().getRecruiter().getAccName(),
                    application.getJobDescription().getDepartment().getDepName(),
                    application.getJobDescription().getJdTitle(),
                    process != null ? process.getIpScheduledAt() : null,
                    process != null ? process.getIpStatus() : null);
        });
    }

    @Transactional
    public void acceptApplications(List<UUID> appIds) {
        if (appIds == null || appIds.isEmpty())
            return;
        UUID currentAccountId = accountService.getCurrentAccountId();
        for (UUID appId : appIds) {
            Application application = applicationRepository.findById(appId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn ứng tuyển với id: " + appId));

            JobDescription jd = application.getJobDescription();
            if (jd == null || jd.getRecruiter() == null) {
                throw new IllegalStateException(
                        "Đơn ứng tuyển chưa được liên kết với tin tuyển dụng hoặc người phụ trách");
            }

            if (!jd.getRecruiter().getAccId().equals(currentAccountId)) {
                throw new AccessDeniedException(
                        "Bạn không có quyền duyệt đơn ứng tuyển này vì không phải là người được phân công tuyển dụng cho vị trí: "
                                + jd.getJdTitle());
            }

            application.setAppStatus(ApplicationStatus.ACCEPTED);
            applicationRepository.save(application);
        }
    }

    @Transactional
    public ApplicationDetailViewDTO getApplicationDetail(UUID appId) {
        Application application = applicationRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn ứng tuyển với id: " + appId));

        InterviewProcess interviewProcess = interviewProcessRepository.findByApplicationId(appId).orElse(null);

        String degreeType = application.getCandidate().getDt() != null
                ? application.getCandidate().getDt().getDtName()
                : null;
        List<String> skills = application.getCandidate().getSkills() != null
                ? application.getCandidate().getSkills().stream().map(skill -> skill.getSkillName()).toList()
                : List.of();

        return new ApplicationDetailViewDTO(
                application.getCandidate().getAccount().getAccName(),
                application.getCandidate().getAccount().getAccEmail(),
                application.getCandidate().getAccount().getAccPhone(),
                application.getCandidate().getAccount().getAccIsMale(),
                application.getCandidate().getAccount().getAccDob(),
                degreeType,
                skills,
                application.getJobDescription().getJdTitle(),
                interviewProcess != null
                        ? interviewProcess.getInterviewStage().getIsName()
                        : null,
                interviewProcess != null
                        ? (interviewProcess.getIpScheduledAt() != null
                                ? interviewProcess.getIpScheduledAt().toString()
                                : null)
                        : null,
                interviewProcess != null
                        ? (interviewProcess.getIpStatus() != null
                                ? interviewProcess.getIpStatus().name()
                                : null)
                        : null,
                interviewProcess != null ? interviewProcess.getIpFeedback() : null);
    }
}
