package com.hrmanagement.backend.service;

import com.hrmanagement.backend.dto.CareerDtos.*;
import com.hrmanagement.backend.dto.CandidateRegisterDTO;
import com.hrmanagement.backend.entity.*;
import com.hrmanagement.backend.entity.enums.*;
import com.hrmanagement.backend.repository.*;
import com.hrmanagement.backend.security.CustomUserDetails;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly=true)
public class CareerService {
    private final JobDescriptionRepository jobs;
    private final DepartmentRepository departments;
    private final DegreeTypeRepository degrees;
    private final AccountRepository accounts;
    private final CandidateRepository candidates;
    private final ApplicationRepository applications;
    private final AccountService accountService;
    private final CandidateCvStorage cv;

    public com.hrmanagement.backend.dto.CareerDtos.Page<Job> jobs(String query,UUID departmentId,UUID degreeId,Integer salaryMin,Integer salaryMax,int page,int size) {
        if(salaryMin!=null && salaryMin<0 || salaryMax!=null && salaryMax<0 || salaryMin!=null && salaryMax!=null && salaryMin>salaryMax)
            throw bad("Khoảng lương không hợp lệ.");
        Specification<JobDescription> spec=(r,q,b)->b.equal(r.get("jdStatus"),JobStatus.PUBLISHED);
        if(departmentId!=null) spec=spec.and((r,q,b)->b.equal(r.get("department").get("depId"),departmentId));
        if(degreeId!=null) spec=spec.and((r,q,b)->b.equal(r.get("degreeType").get("dtId"),degreeId));
        if(salaryMin!=null) spec=spec.and((r,q,b)->b.ge(b.<Integer>coalesce(r.get("jdSalMax"),r.get("jdSalMin")),salaryMin));
        if(salaryMax!=null) spec=spec.and((r,q,b)->b.le(b.<Integer>coalesce(r.get("jdSalMin"),r.get("jdSalMax")),salaryMax));
        if(query!=null && !query.isBlank()) {
            String term="%"+query.trim().toLowerCase(Locale.ROOT).replace("!","!!").replace("%","!%").replace("_","!_")+"%";
            spec=spec.and((r,q,b)->b.or(b.like(b.lower(r.get("jdTitle")),term,'!'),b.like(b.lower(r.get("jdMajor")),term,'!'),b.like(b.lower(r.join("department",JoinType.LEFT).get("depName")),term,'!')));
        }
        var result=jobs.findAll(spec,PageRequest.of(page,size,Sort.by("jdTitle","jdId")));
        return new com.hrmanagement.backend.dto.CareerDtos.Page<>(result.stream().map(this::job).toList(),result.getTotalElements(),page,size);
    }
    public Filters filters() {
        return new Filters(departments.findAll(Sort.by("depName")).stream().map(d->new Option(d.getDepId(),d.getDepName())).toList(),
            degrees.findAll(Sort.by("dtName")).stream().map(d->new Option(d.getDtId(),d.getDtName())).toList());
    }
    public Job detail(UUID id) {return job(published(id));}
    private JobDescription published(UUID id) {
        return jobs.findByJdIdAndJdStatus(id,JobStatus.PUBLISHED).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Tin tuyển dụng không còn được đăng."));
    }
    private Job job(JobDescription j) {
        return new Job(j.getJdId(),j.getJdTitle(),j.getJdDesc(),j.getDepartment()==null?null:j.getDepartment().getDepName(),j.getDepartment()==null?null:j.getDepartment().getDepId(),
            j.getJdSalMin(),j.getJdSalMax(),j.getJdTarget(),j.getJdMajor(),j.getDegreeType()==null?null:j.getDegreeType().getDtName(),j.getDegreeType()==null?null:j.getDegreeType().getDtId(),
            j.getSkills()==null?List.of():j.getSkills().stream().map(Skill::getSkillName).filter(Objects::nonNull).sorted().toList());
    }
    private Candidate candidate(UUID accountId) {return candidates.findByAccount_AccId(accountId).orElseThrow(()->bad("Tài khoản chưa có hồ sơ ứng viên."));}
    public Profile profile(CustomUserDetails user) {
        Candidate c=candidate(user.getAccId()); Account a=c.getAccount();
        boolean hasCv=cv.exists(a.getAccId(),c.getCandCvPath());
        return new Profile(a.getAccName(),a.getAccEmail(),a.getAccPhone(),c.getCandExpYear(),c.getCandMajor(),c.getDt()==null?null:c.getDt().getDtName(),
            c.getSkills()==null?List.of():c.getSkills().stream().map(Skill::getSkillName).filter(Objects::nonNull).sorted().toList(),hasCv,hasCv?"CV.pdf":null);
    }
    public Resource download(CustomUserDetails user) {return cv.resource(user.getAccId(),candidate(user.getAccId()).getCandCvPath());}
    @Transactional public Profile upload(CustomUserDetails user,MultipartFile file) {
        lockAccount(user.getAccId());
        Candidate c=candidate(user.getAccId());String old=c.getCandCvPath();
        c.setCandCvPath(cv.save(user.getAccId(),file));cv.removeOldAfterCommit(user.getAccId(),old);
        return profile(user);
    }
    public ApplicationState applicationState(CustomUserDetails user,UUID jobId) {
        published(jobId);
        var application=applications.findFirstByCandidate_AccIdAndJobId(user.getAccId(),jobId);
        return new ApplicationState(application.isPresent(),application.map(this::receipt).orElse(null));
    }
    @Transactional public Receipt apply(CustomUserDetails user,UUID jobId,Apply input) {
        // Serializes submissions by this candidate, including simultaneous requests.
        lockAccount(user.getAccId());
        JobDescription j=published(jobId); Candidate c=candidate(user.getAccId());
        if(applications.findFirstByCandidate_AccIdAndJobId(user.getAccId(),jobId).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Bạn đã ứng tuyển vị trí này.");
        if(!cv.exists(user.getAccId(),c.getCandCvPath())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Vui lòng tải CV PDF lên hồ sơ trước khi ứng tuyển.");
        var a=new Application();a.setCandidate(c);a.setJobDescription(j);a.setAppExpctedSal(input.expectedSalary());
        return receipt(applications.saveAndFlush(a));
    }
    private void lockAccount(UUID id) {
        Account account=accounts.findLockedById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if(account.getAccStatus()!=AccountStatus.ACTIVE) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Tài khoản không hoạt động.");
    }
    private Receipt receipt(Application a) {return new Receipt(a.getAppId(),a.getAppStatus().name(),a.getAppCreatedAt());}
    @Transactional public void register(Signup input) {
        cv.validate(input.getCv());
        if(input.getAccPassword().getBytes(StandardCharsets.UTF_8).length>72) throw bad("Mật khẩu tối đa 72 byte UTF-8.");
        String email=input.getAccEmail().trim().toLowerCase(Locale.ROOT);
        if(input.getDtId()!=null && !degrees.existsById(input.getDtId())) throw bad("Trình độ không tồn tại.");
        var dto=new CandidateRegisterDTO();dto.setAccName(input.getAccName().trim());dto.setAccEmail(email);dto.setAccPassword(input.getAccPassword());
        dto.setAccIsMale(input.getAccIsMale());dto.setAccDob(input.getAccDob());dto.setAccPhone(input.getAccPhone());
        dto.setCandExpYear(input.getCandExpYear());dto.setCandMajor(input.getCandMajor());dto.setDtId(input.getDtId());
        dto.setCandCvPath("/pending");accountService.createCandidateAccount(dto);
        var matches=accounts.findByAccEmailIgnoreCase(email);
        if(matches.size()!=1) throw bad("Email đã tồn tại.");
        Account a=matches.getFirst();candidate(a.getAccId()).setCandCvPath(cv.save(a.getAccId(),input.getCv()));
    }
    private ResponseStatusException bad(String message) {return new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
}
