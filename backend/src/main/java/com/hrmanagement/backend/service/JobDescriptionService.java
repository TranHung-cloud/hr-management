package com.hrmanagement.backend.service;

import com.hrmanagement.backend.dto.DepartmentViewDTO;
import com.hrmanagement.backend.dto.JobDescriptionDTO.*;
import com.hrmanagement.backend.dto.RecruitmentDtos.Option;
import com.hrmanagement.backend.entity.*;
import com.hrmanagement.backend.entity.enums.ApplicationStatus;
import com.hrmanagement.backend.entity.enums.JobStatus;
import com.hrmanagement.backend.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class JobDescriptionService {

    private final JobDescriptionRepository jobRepository;
    private final DepartmentRepository departmentRepository;
    private final AccountRepository accountRepository;
    private final DegreeTypeRepository degreeTypeRepository;
    private final SkillRepository skillRepository;
    private final CampaignRepository campaignRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public Page<JobViewDTO> getJobsPage(UUID depId, JobStatus status, String keyword, Pageable pageable) {
        if (pageable == null || pageable.isUnpaged()) {
            pageable = PageRequest.of(0, 8, Sort.by("jdTitle").ascending());
        } else if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize() > 0 ? pageable.getPageSize() : 8, Sort.by("jdTitle").ascending());
        }

        Specification<JobDescription> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (depId != null) {
                predicates.add(cb.equal(root.get("department").get("depId"), depId));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("jdStatus"), status));
            }
            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("jdTitle")), pattern),
                        cb.like(cb.lower(root.get("jdMajor")), pattern)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return jobRepository.findAll(spec, pageable).map(jd -> new JobViewDTO(
                jd.getJdId(),
                jd.getJdTitle(),
                jd.getDepartment() != null ? jd.getDepartment().getDepName() : null,
                jd.getJdSalMin(),
                jd.getJdSalMax(),
                applicationRepository.countByJobDescription_JdIdAndAppStatus(jd.getJdId(), ApplicationStatus.ACCEPTED),
                jd.getJdTarget(),
                jd.getJdStatus(),
                jd.getRecruiter() != null ? jd.getRecruiter().getAccName() : null
        ));
    }

    @Transactional(readOnly = true)
    public JobDetailDTO getJobDetail(UUID jdId) {
        JobDescription jd = jobRepository.findById(jdId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin tuyển dụng."));
        return new JobDetailDTO(
                jd.getJdId(),
                jd.getJdTitle(),
                jd.getJdDesc(),
                jd.getJdSalMin(),
                jd.getJdSalMax(),
                jd.getJdStatus(),
                jd.getJdTarget(),
                applicationRepository.countByJobDescription_JdIdAndAppStatus(jd.getJdId(), ApplicationStatus.ACCEPTED),
                jd.getJdMajor(),
                jd.getDepartment() != null ? jd.getDepartment().getDepId() : null,
                jd.getDepartment() != null ? jd.getDepartment().getDepName() : null,
                jd.getRecruiter() != null ? jd.getRecruiter().getAccId() : null,
                jd.getRecruiter() != null ? jd.getRecruiter().getAccName() : null,
                jd.getDegreeType() != null ? jd.getDegreeType().getDtId() : null,
                jd.getDegreeType() != null ? jd.getDegreeType().getDtName() : null,
                jd.getSkills() != null ? jd.getSkills().stream().map(Skill::getSkillId).toList() : List.of(),
                jd.getSkills() != null ? jd.getSkills().stream().map(Skill::getSkillName).sorted().toList() : List.of(),
                jd.getCampaigns() != null ? jd.getCampaigns().stream().map(Campaign::getCpId).toList() : List.of()
        );
    }

    @Transactional(readOnly = true)
    public JobLookupsDTO getLookups() {
        return new JobLookupsDTO(
                departmentRepository.findAll().stream().map(d -> new DepartmentViewDTO(d.getDepId(), d.getDepName())).toList(),
                accountRepository.findStaff().stream().map(a -> new Option(a.getAccId(), a.getAccName())).toList(),
                degreeTypeRepository.findAll().stream().map(dt -> new Option(dt.getDtId(), dt.getDtName())).toList(),
                skillRepository.findAll().stream().map(s -> new Option(s.getSkillId(), s.getSkillName())).toList(),
                campaignRepository.findAll().stream().map(c -> new Option(c.getCpId(), c.getCpSource() + " (" + c.getCpMedium() + ")")).toList()
        );
    }

    @PreAuthorize("hasAnyRole('HR_MANAGER', 'RECRUITER')")
    @Transactional
    public void createJob(JobUpsertDTO dto) {
        JobDescription jd = new JobDescription();
        applyUpsert(jd, dto);
        jobRepository.save(jd);
    }

    @PreAuthorize("hasAnyRole('HR_MANAGER', 'RECRUITER')")
    @Transactional
    public void updateJob(UUID jdId, JobUpsertDTO dto) {
        JobDescription jd = jobRepository.findById(jdId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin tuyển dụng."));
        applyUpsert(jd, dto);
        jobRepository.save(jd);
    }

    @PreAuthorize("hasAnyRole('HR_MANAGER', 'RECRUITER')")
    @Transactional
    public void closeJobs(List<UUID> jdIds) {
        if (jdIds == null || jdIds.isEmpty()) return;
        for (UUID id : jdIds) {
            JobDescription jd = jobRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin tuyển dụng: " + id));
            jd.setJdStatus(JobStatus.CLOSED);
            jobRepository.save(jd);
        }
    }

    @PreAuthorize("hasAnyRole('HR_MANAGER', 'RECRUITER')")
    @Transactional
    public void deleteJob(UUID jdId) {
        JobDescription jd = jobRepository.findById(jdId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin tuyển dụng."));
        jobRepository.delete(jd);
    }

    private void applyUpsert(JobDescription jd, JobUpsertDTO dto) {
        if (dto.jdSalMin() != null && dto.jdSalMax() != null && dto.jdSalMin() > dto.jdSalMax()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mức lương tối thiểu không được lớn hơn mức lương tối đa.");
        }
        Department dep = departmentRepository.findById(dto.depId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Phòng ban không tồn tại."));
        Account recruiter = accountRepository.findById(dto.recruiterId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người phụ trách không tồn tại."));

        jd.setJdTitle(dto.jdTitle().trim());
        jd.setJdDesc(dto.jdDesc().trim());
        jd.setJdSalMin(dto.jdSalMin());
        jd.setJdSalMax(dto.jdSalMax());
        jd.setJdStatus(dto.jdStatus());
        jd.setJdTarget(dto.jdTarget());
        jd.setJdMajor(dto.jdMajor());
        jd.setDepartment(dep);
        jd.setRecruiter(recruiter);
        jd.setDegreeType(dto.dtId() != null ? degreeTypeRepository.findById(dto.dtId()).orElse(null) : null);
        jd.setSkills(dto.skillIds() != null ? new HashSet<>(skillRepository.findAllById(dto.skillIds())) : new HashSet<>());
        jd.setCampaigns(dto.campaignIds() != null ? new HashSet<>(campaignRepository.findAllById(dto.campaignIds())) : new HashSet<>());
    }
}