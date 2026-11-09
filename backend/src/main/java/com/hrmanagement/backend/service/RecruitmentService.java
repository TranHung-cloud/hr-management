package com.hrmanagement.backend.service;

import com.hrmanagement.backend.dto.RecruitmentDtos.*;
import com.hrmanagement.backend.entity.*;
import com.hrmanagement.backend.entity.enums.*;
import com.hrmanagement.backend.entity.id.*;
import com.hrmanagement.backend.mapper.RecruitmentMapper;
import com.hrmanagement.backend.repository.*;
import com.hrmanagement.backend.security.AppRole;
import com.hrmanagement.backend.security.CustomUserDetails;
import jakarta.persistence.criteria.JoinType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.hrmanagement.backend.repository.InterviewStageRepository;

import java.time.*;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class RecruitmentService {
    private final ApplicationRepository applications;
    private final InterviewProcessRepository interviews;
    private final InterviewStageRepository stages;
    private final InterviewMethodRepository methods;
    private final AccountRepository accounts;
    private final CandidateRepository candidates;
    private final JobDescriptionRepository jobs;
    private final RecruitmentMapper mapper;
    private final Clock clock;
    private final long duration;

    public RecruitmentService(ApplicationRepository applications, InterviewProcessRepository interviews,
            InterviewStageRepository stages, InterviewMethodRepository methods, AccountRepository accounts,
            CandidateRepository candidates, JobDescriptionRepository jobs, RecruitmentMapper mapper, Clock clock,
            @Value("${app.interview-duration-minutes:60}") long duration) {
        if (duration <= 0)
            throw new IllegalArgumentException("Interview duration must be positive");
        this.applications = applications;
        this.interviews = interviews;
        this.stages = stages;
        this.methods = methods;
        this.accounts = accounts;
        this.candidates = candidates;
        this.jobs = jobs;
        this.mapper = mapper;
        this.clock = clock;
        this.duration = duration;
    }

    public Lookups lookups() {
        return new Lookups(
                stages.findAllByOrderByIsOrderAscIsIdAsc().stream().map(mapper::stage).toList(),
                methods.findAll(Sort.by("imName", "imId")).stream().map(m -> new Option(m.getImId(), m.getImName()))
                        .toList(),
                accounts.findStaff().stream().map(mapper::account).toList(),
                jobs.findAllByOrderByJdTitleAscJdIdAsc().stream().map(mapper::job).toList());
    }

    public PageResult<ApplicationView> pipeline(String query, UUID jobId, ApplicationStatus status, UUID stageId,
            int page, int size) {
        Specification<Application> spec = (root, q, cb) -> cb.conjunction();
        if (jobId != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("jobDescription").get("jdId"), jobId));
        if (status != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("appStatus"), status));
        if (query != null && !query.isBlank())
            spec = spec.and((r, q, cb) -> {
                var candidate = r.join("candidate", JoinType.LEFT);
                var account = candidate.join("account", JoinType.LEFT);
                var jd = r.join("jobDescription", JoinType.LEFT);
                String term = "%"
                        + query.toLowerCase(Locale.ROOT).replace("!", "!!").replace("%", "!%").replace("_", "!_") + "%";
                return cb.or(
                        cb.like(cb.lower(account.get("accName")), term, '!'),
                        cb.like(cb.lower(account.get("accEmail")), term, '!'),
                        cb.like(cb.lower(jd.get("jdTitle")), term, '!'));
            });
        if (stageId != null)
            spec = spec.and((r, q, cb) -> {
                var matching = q.subquery(Integer.class);
                var ip = matching.from(InterviewProcess.class);
                var later = matching.subquery(Integer.class);
                var other = later.from(InterviewProcess.class);
                later.select(cb.literal(1)).where(
                        cb.equal(other.get("application"), r),
                        cb.greaterThan(other.get("interviewStage").get("isOrder"),
                                ip.get("interviewStage").get("isOrder")));
                matching.select(cb.literal(1)).where(
                        cb.equal(ip.get("application"), r),
                        cb.equal(ip.get("interviewStage").get("isId"), stageId),
                        cb.not(cb.exists(later)));
                return cb.exists(matching);
            });
        var result = applications.findAll(spec, PageRequest.of(page, size, Sort.by("appCreatedAt").descending()));
        var current = latest(result.isEmpty() ? List.of() : interviews.findForApplications(result.getContent()));
        return new PageResult<>(result.stream().map(a -> mapper.application(a, current.get(a.getAppId()))).toList(),
                result.getTotalElements(), page, size);
    }

    public PageResult<InterviewView> schedule(LocalDate from, LocalDate to, UUID interviewerId, UUID jobId,
            UUID stageId, InterviewProcessStatus status, String query, int page, int size) {
        if (from != null && to != null && to.isBefore(from))
            throw bad("Ngày kết thúc phải từ ngày bắt đầu trở đi.");
        Specification<InterviewProcess> spec = (r, q, cb) -> cb.conjunction();
        if (from != null)
            spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("ipScheduledAt"), from.atStartOfDay()));
        if (to != null)
            spec = spec.and((r, q, cb) -> cb.lessThan(r.get("ipScheduledAt"), to.plusDays(1).atStartOfDay()));
        if (interviewerId != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("interviewer").get("accId"), interviewerId));
        if (jobId != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("application").get("jobDescription").get("jdId"), jobId));
        if (stageId != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("interviewStage").get("isId"), stageId));
        if (status != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("ipStatus"), status));
        if (query != null && !query.isBlank())
            spec = spec.and((r, q, cb) -> {
                var account = r.join("application").join("candidate").join("account", JoinType.LEFT);
                var interviewer = r.join("interviewer", JoinType.LEFT);
                var jd = r.join("application").join("jobDescription", JoinType.LEFT);
                String term = "%"
                        + query.toLowerCase(Locale.ROOT).replace("!", "!!").replace("%", "!%").replace("_", "!_") + "%";
                return cb.or(
                        cb.like(cb.lower(account.get("accName")), term, '!'),
                        cb.like(cb.lower(interviewer.get("accName")), term, '!'),
                        cb.like(cb.lower(jd.get("jdTitle")), term, '!'));
            });
        var result = interviews.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "ipScheduledAt")));
        return new PageResult<>(result.stream().map(mapper::interview).toList(), result.getTotalElements(), page, size);
    }

    public Detail detail(UUID candidateId, UUID jobId, UUID stageId) {
        Application a = lockedApplication(candidateId, jobId);
        return new Detail(
                mapper.interview(find(a.getAppId(), stageId)),
                interviews.findRounds(a.getAppId()).stream().map(mapper::interview).toList());
    }

    @Transactional
    public InterviewView move(UUID candidateId, UUID jobId, MoveStage request) {
        Application a = lockedApplication(candidateId, jobId);
        if (a.getAppStatus() == ApplicationStatus.ACCEPTED || a.getAppStatus() == ApplicationStatus.REJECTED) {
            throw conflict("Hồ sơ đã có quyết định cuối cùng.");
        }
        InterviewStage stage = stages.findById(request.stageId()).orElseThrow(() -> missing("Vòng phỏng vấn"));
        if (stage.getIsOrder() == null)
            throw conflict("Vòng phỏng vấn chưa có thứ tự.");
        var rounds = interviews.findRounds(a.getAppId());
        if (rounds.stream().anyMatch(i -> i.getInterviewStage().getIsOrder() == null)) {
            throw conflict("Quy trình chứa vòng chưa có thứ tự.");
        }
        if (rounds.stream().anyMatch(i -> i.getInterviewStage().getIsOrder() > stage.getIsOrder())) {
            throw conflict("CDM hiện tại chỉ hỗ trợ tiến đến vòng tiếp theo, không lưu bước quay lại.");
        }
        if (rounds.stream().anyMatch(i -> !i.getInterviewStage().getIsId().equals(stage.getIsId())
                && i.getInterviewStage().getIsOrder().equals(stage.getIsOrder()))) {
            throw conflict("Hai vòng phỏng vấn đang trùng thứ tự.");
        }
        var existing = rounds.stream().filter(i -> i.getInterviewStage().getIsId().equals(stage.getIsId())).findFirst();
        if (existing.isPresent())
            return mapper.interview(existing.get());

        InterviewMethod defaultMethod = methods.findAll().stream().findFirst()
                .orElseThrow(() -> missing("Hình thức phỏng vấn"));

        InterviewProcess ip = new InterviewProcess();
        ip.setIpId(new InterviewProcessId(a.getAppId(), stage.getIsId()));
        ip.setApplication(a);
        ip.setInterviewStage(stage);
        ip.setInterviewMethod(defaultMethod);
        ip.setIpStatus(InterviewProcessStatus.UNSCHEDULED);
        return mapper.interview(interviews.saveAndFlush(ip));
    }

    @Transactional
    public InterviewView createSchedule(UUID candidateId, UUID jobId, CreateSchedule request) {
        move(candidateId, jobId, new MoveStage(request.stageId()));
        return reschedule(candidateId, jobId, request.stageId(),
                new Schedule(request.scheduledAt(), request.interviewerId(), request.methodId()));
    }

    @Transactional
    public InterviewView reschedule(UUID candidateId, UUID jobId, UUID stageId, Schedule request) {
        Application a = lockedApplication(candidateId, jobId);
        if (a.getAppStatus() == ApplicationStatus.ACCEPTED || a.getAppStatus() == ApplicationStatus.REJECTED) {
            throw conflict("Hồ sơ đã có quyết định cuối cùng.");
        }
        InterviewProcess ip = find(a.getAppId(), stageId);
        if (ip.getIpStatus() == InterviewProcessStatus.COMPLETED
                || ip.getIpStatus() == InterviewProcessStatus.REJECTED) {
            throw conflict("Buổi phỏng vấn đã có kết quả.");
        }
        if (!request.scheduledAt().isAfter(LocalDateTime.now(clock))) {
            throw bad("Lịch hẹn phải ở tương lai.");
        }
        Account interviewer = accounts.findLockedById(request.interviewerId())
                .orElseThrow(() -> missing("Người phỏng vấn"));
        if (candidates.existsByAccount_AccId(interviewer.getAccId())) {
            throw bad("Tài khoản ứng viên không thể làm người phỏng vấn.");
        }
        var method = methods.findById(request.methodId()).orElseThrow(() -> missing("Hình thức phỏng vấn"));
        boolean overlaps = interviews
                .findConflicting(interviewer.getAccId(), request.scheduledAt().minusMinutes(duration),
                        request.scheduledAt().plusMinutes(duration))
                .stream().anyMatch(i -> !i.getIpId().equals(ip.getIpId()));
        if (overlaps)
            throw conflict("Người phỏng vấn đã có lịch trong khoảng thời gian này.");
        ip.setIpScheduledAt(request.scheduledAt());
        ip.setInterviewer(interviewer);
        ip.setInterviewMethod(method);
        ip.setIpStatus(InterviewProcessStatus.SCHEDULED);
        return mapper.interview(interviews.saveAndFlush(ip));
    }

    @Transactional
    public InterviewView feedback(UUID candidateId, UUID jobId, UUID stageId, Feedback request) {
        Application a = lockedApplication(candidateId, jobId);
        if (request.status() != InterviewProcessStatus.COMPLETED
                && request.status() != InterviewProcessStatus.REJECTED) {
            throw bad("Kết quả phải là COMPLETED hoặc REJECTED.");
        }
        InterviewProcess ip = find(a.getAppId(), stageId);
        if (ip.getIpScheduledAt() == null)
            throw conflict("Cần lên lịch trước khi ghi nhận kết quả.");
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails principal
                && principal.getAppRole() != AppRole.HR_MANAGER
                && (ip.getInterviewer() == null || !ip.getInterviewer().getAccId().equals(principal.getAccId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Bạn chỉ được đánh giá buổi phỏng vấn được phân công.");
        }
        ip.setIpStatus(request.status());
        ip.setIpFeedback(request.feedback().trim());
        return mapper.interview(interviews.saveAndFlush(ip));
    }

    @Transactional
    public ApplicationView decide(UUID candidateId, UUID jobId, Decision request) {
        Application a = lockedApplication(candidateId, jobId);
        a.setAppStatus(request.status());
        applications.saveAndFlush(a);
        return mapper.application(a, latest(interviews.findRounds(a.getAppId())).get(a.getAppId()));
    }

    public Dashboard dashboard(LocalDate from, LocalDate to) {
        LocalDate today = LocalDate.now(clock);
        if (from == null)
            from = today.minusDays(6);
        if (to == null)
            to = today;
        if (to.isBefore(from) || java.time.temporal.ChronoUnit.DAYS.between(from, to) > 365) {
            throw bad("Khoảng thống kê phải từ 1 đến 366 ngày.");
        }
        List<InterviewProcess> all = interviews.findAll();
        Map<UUID, InterviewProcess> latest = latest(all);
        List<StageCount> stageCounts = stages.findAllByOrderByIsOrderAscIsIdAsc().stream().map(s -> new StageCount(
                s.getIsId(),
                s.getIsName(),
                latest.values().stream().filter(i -> i.getIpId().getIsId().equals(s.getIsId())).count())).toList();
        var fromDate = from;
        var toDate = to;
        List<DailyCount> days = fromDate.datesUntil(toDate.plusDays(1)).map(d -> new DailyCount(
                d,
                all.stream().filter(i -> i.getIpScheduledAt() != null && i.getIpScheduledAt().toLocalDate().equals(d))
                        .count()))
                .toList();
        return new Dashboard(
                jobs.countByJdStatus(JobStatus.PUBLISHED),
                applications.count(),
                candidates.count(),
                applications.countByAppStatus(ApplicationStatus.ACCEPTED),
                all.stream()
                        .filter(i -> i.getIpStatus() == InterviewProcessStatus.SCHEDULED && i.getIpScheduledAt() != null
                                && i.getIpScheduledAt().toLocalDate().equals(today))
                        .count(),
                all.stream()
                        .filter(i -> i.getIpStatus() == InterviewProcessStatus.SCHEDULED && i.getIpScheduledAt() != null
                                && !i.getIpScheduledAt().isBefore(LocalDateTime.now(clock)))
                        .count(),
                stageCounts,
                applications.count() - latest.size(),
                days);
    }

    private Map<UUID, InterviewProcess> latest(List<InterviewProcess> rows) {
        Map<UUID, InterviewProcess> result = new HashMap<>();
        Comparator<InterviewProcess> order = Comparator.comparing(
                i -> i.getInterviewStage().getIsOrder(),
                Comparator.nullsFirst(Comparator.naturalOrder()));
        order = order.thenComparing(i -> i.getIpId().getIsId());
        final var comparison = order;
        for (var i : rows) {
            result.merge(i.getApplication().getAppId(), i,
                    (prev, curr) -> comparison.compare(prev, curr) >= 0 ? prev : curr);
        }
        return result;
    }

    private Application lockedApplication(UUID c, UUID j) {
        return applications.findLockedByCandidateAndJob(c, j).orElseThrow(() -> missing("Hồ sơ ứng tuyển"));
    }

    private InterviewProcess find(UUID appId, UUID s) {
        return interviews.findById(new InterviewProcessId(appId, s)).orElseThrow(() -> missing("Buổi phỏng vấn"));
    }

    private ResponseStatusException missing(String name) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, name + " không tồn tại.");
    }

    private ResponseStatusException bad(String text) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, text);
    }

    private ResponseStatusException conflict(String text) {
        return new ResponseStatusException(HttpStatus.CONFLICT, text);
    }
}
