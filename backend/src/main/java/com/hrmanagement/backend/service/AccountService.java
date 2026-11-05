package com.hrmanagement.backend.service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrmanagement.backend.dto.AccountViewDTO;
import com.hrmanagement.backend.dto.AdminAccountCreateDTO;
import com.hrmanagement.backend.dto.AdminAccountDetailDTO;
import com.hrmanagement.backend.dto.AdminAccountUpdateDTO;
import com.hrmanagement.backend.dto.CandidateAccountDetailDTO;
import com.hrmanagement.backend.dto.CandidateRegisterDTO;
import com.hrmanagement.backend.entity.Account;
import com.hrmanagement.backend.entity.Candidate;
import com.hrmanagement.backend.entity.Department;
import com.hrmanagement.backend.entity.Role;
import com.hrmanagement.backend.entity.Skill;
import com.hrmanagement.backend.notification.event.AdminAccountCreatedEvent;
import com.hrmanagement.backend.notification.event.AdminPasswordResetEvent;
import com.hrmanagement.backend.repository.AccountRepository;
import com.hrmanagement.backend.repository.CandidateRepository;
import com.hrmanagement.backend.repository.DegreeTypeRepository;
import com.hrmanagement.backend.repository.DepartmentRepository;
import com.hrmanagement.backend.repository.RoleRepository;
import com.hrmanagement.backend.repository.SkillRepository;
import com.hrmanagement.backend.security.AppRole;
import com.hrmanagement.backend.security.CustomUserDetails;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final CandidateRepository candidateRepository;
    private final DegreeTypeRepository degreeTypeRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public Page<AccountViewDTO> getAccountsPage(
            UUID roleId,
            UUID depId,
            String keyword,
            Pageable pageable) {
        // Xử lý pageable mặc định size 10 và sort theo accName
        if (pageable == null || pageable.isUnpaged()) {
            pageable = PageRequest.of(0, 10, Sort.by("accName"));
        } else if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10,
                    Sort.by("accName"));
        }

        // Lọc theo role, department và like search theo accName, accEmail, accPhone
        Specification<Account> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (roleId != null) {
                predicates.add(cb.equal(root.get("role").get("roleId"), roleId));
            }

            if (depId != null) {
                predicates.add(cb.equal(root.get("department").get("depId"), depId));
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("accName")), searchPattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("accEmail")), searchPattern);
                Predicate phoneMatch = cb.like(root.get("accPhone"), searchPattern);

                predicates.add(cb.or(nameMatch, emailMatch, phoneMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Query và map trực tiếp sang AccountViewDTO
        return accountRepository.findAll(spec, pageable).map(account -> new AccountViewDTO(
                account.getAccId(),
                account.getAccName(),
                account.getAccEmail(),
                account.getAccPhone(),
                account.getRole() != null ? account.getRole().getRoleName() : null,
                account.getAccStatus(),
                account.getDepartment() != null ? account.getDepartment().getDepName() : null));
    }

    @PreAuthorize("hasRole('HR_MANAGER')")
    @Transactional
    public void createAdminAccount(AdminAccountCreateDTO dto) {
        Set<AppRole> allowedRoles = Set.of(
                AppRole.HR_MANAGER,
                AppRole.RECRUITER,
                AppRole.INTERVIEWER);
        if (accountRepository.findByAccEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại: " + dto.getEmail());
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Vai trò không tồn tại với id: " + dto.getRoleId()));

        AppRole appRole = AppRole.fromRoleName(role.getRoleName());
        if (!allowedRoles.contains(appRole)) {
            throw new IllegalArgumentException(
                    "Không thể tạo tài khoản admin với vai trò: " + appRole.getVietnameseName());
        }

        Department department = null;
        if (dto.getDepId() != null) {
            department = departmentRepository.findById(dto.getDepId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Không tìm thấy phòng ban với id: " + dto.getDepId()));
        }

        // Tự sinh mật khẩu ngẫu nhiên
        String rawPassword = generateRandomPassword(10);

        Account account = new Account();
        account.setAccEmail(dto.getEmail());
        account.setAccPassword(passwordEncoder.encode(rawPassword));
        account.setRole(role);
        account.setDepartment(department);
        // Để trắng các thông tin cá nhân (accName, accGender, accDob, accPhone = null)

        Account saved = accountRepository.save(account);

        // Gửi mail thông tin tài khoản và mật khẩu tạm thời cho nhân viên
        eventPublisher.publishEvent(new AdminAccountCreatedEvent(
                saved.getAccEmail(),
                rawPassword,
                role.getRoleName()));
    }

    @Transactional
    public void createCandidateAccount(CandidateRegisterDTO dto) {
        if (accountRepository.findByAccEmail(dto.getAccEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại: " + dto.getAccEmail());
        }

        // Tìm role Ứng viên (CANDIDATE)
        Role candidateRole = roleRepository.findByRoleName(AppRole.CANDIDATE.getVietnameseName())
                .or(() -> roleRepository.findByRoleName(AppRole.CANDIDATE.name()))
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy vai trò ứng viên trong cơ sở dữ liệu"));

        // 1. Tạo và lưu Account của ứng viên
        Account account = new Account();
        account.setAccEmail(dto.getAccEmail());
        account.setAccPassword(passwordEncoder.encode(dto.getAccPassword()));
        account.setAccName(dto.getAccName());
        account.setAccIsMale(dto.getAccIsMale());
        account.setAccDob(dto.getAccDob());
        account.setAccPhone(dto.getAccPhone());
        account.setRole(candidateRole);

        Account savedAccount = accountRepository.save(account);

        // 2. Tạo và lưu Candidate
        Candidate candidate = new Candidate();
        candidate.setAccount(savedAccount);
        candidate.setCandExpYear(dto.getCandExpYear());
        candidate.setCandCvPath(dto.getCandCvPath());

        if (dto.getDtId() != null) {
            degreeTypeRepository.findById(dto.getDtId()).ifPresent(candidate::setDt);
        }

        if (dto.getSkillIds() != null && !dto.getSkillIds().isEmpty()) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(dto.getSkillIds()));
            candidate.setSkills(skills);
        }

        if (dto.getCandMajor() != null) {
            candidate.setCandMajor(dto.getCandMajor());
        }

        candidateRepository.save(candidate);
    }

    @PreAuthorize("hasRole('HR_MANAGER')")
    @Transactional
    public void resetAdminPassword(UUID accId) {
        Account account = accountRepository.findById(accId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));
        if (account.getRole().getRoleName().equalsIgnoreCase(AppRole.CANDIDATE.name())
                || account.getRole().getRoleName().equalsIgnoreCase(AppRole.CANDIDATE.getVietnameseName())) {
            throw new IllegalArgumentException("Không thể reset mật khẩu cho tài khoản ứng viên");
        }
        String rawPassword = generateRandomPassword(10);
        account.setAccPassword(passwordEncoder.encode(rawPassword));
        accountRepository.save(account);
        eventPublisher.publishEvent(new AdminPasswordResetEvent(
                account.getAccEmail(),
                rawPassword));
    }

    private String generateRandomPassword(int length) {
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public Account getCurrentAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Người dùng chưa được xác thực");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return accountRepository.findById(userDetails.getAccId())
                    .orElseThrow(() -> new AccessDeniedException("Không tìm thấy tài khoản hiện tại"));
        }

        throw new AccessDeniedException("Không xác định được danh tính người dùng hiện tại");
    }

    @Transactional(readOnly = true)
    public Object getCurrentAccountDetails() {
        Account currentAccount = getCurrentAccount();
        String roleName = currentAccount.getRole() != null
                ? currentAccount.getRole().getRoleName()
                : null;
        if (roleName == null) {
            throw new IllegalStateException("Tài khoản hiện tại không có vai trò");
        }
        if (roleName.equalsIgnoreCase(AppRole.CANDIDATE.name())
                || roleName.equalsIgnoreCase(AppRole.CANDIDATE.getVietnameseName())) {
            Candidate candidate = candidateRepository.findByAccount_AccId(currentAccount.getAccId())
                    .orElseThrow(() -> new IllegalStateException(
                            "Không tìm thấy thông tin ứng viên cho tài khoản hiện tại"));
            return new CandidateAccountDetailDTO(
                    currentAccount.getAccId(),
                    currentAccount.getAccName(),
                    currentAccount.getAccEmail(),
                    currentAccount.getAccIsMale(),
                    currentAccount.getAccDob(),
                    currentAccount.getAccPhone(),
                    candidate.getCandExpYear(),
                    candidate.getCandCvPath(),
                    candidate.getCandMajor());
        } else {
            String depName = currentAccount.getDepartment() != null
                    ? currentAccount.getDepartment().getDepName()
                    : null;
            return new AdminAccountDetailDTO(
                    currentAccount.getAccId(),
                    currentAccount.getAccName(),
                    currentAccount.getAccEmail(),
                    currentAccount.getAccIsMale(),
                    currentAccount.getAccDob(),
                    currentAccount.getAccPhone(),
                    roleName,
                    depName);
        }
    }

    @Transactional
    public void updateAdminAccount(AdminAccountUpdateDTO dto) {
        Account currentAccount = getCurrentAccount();
        Department department = departmentRepository.findById(dto.getDepId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng ban với id: " + dto.getDepId()));
        if (currentAccount.getRole().getRoleName().equalsIgnoreCase(AppRole.CANDIDATE.name())
                || currentAccount.getRole().getRoleName().equalsIgnoreCase(AppRole.CANDIDATE.getVietnameseName())) {
            throw new IllegalArgumentException("Không thể cập nhật thông tin tài khoản ứng viên bằng phương thức này");
        }
        if (dto.getAccPassword() != null && !dto.getAccPassword().isEmpty()) {
            currentAccount.setAccPassword(passwordEncoder.encode(dto.getAccPassword()));
        }
        currentAccount.setAccName(dto.getAccName());
        currentAccount.setAccEmail(dto.getAccEmail());
        currentAccount.setAccIsMale(dto.getAccIsMale());
        currentAccount.setAccDob(dto.getAccDob());
        currentAccount.setAccPhone(dto.getAccPhone());
        currentAccount.setDepartment(department);
        accountRepository.save(currentAccount);
    }

    @Transactional
    public void updateCandidateAccount(CandidateRegisterDTO dto) {
        Account currentAccount = getCurrentAccount();
        if (!currentAccount.getRole().getRoleName().equalsIgnoreCase(AppRole.CANDIDATE.name())
                && !currentAccount.getRole().getRoleName().equalsIgnoreCase(AppRole.CANDIDATE.getVietnameseName())) {
            throw new IllegalArgumentException("Không thể cập nhật thông tin tài khoản admin bằng phương thức này");
        }
        Candidate candidate = candidateRepository.findByAccount_AccId(currentAccount.getAccId())
                .orElseThrow(() -> new IllegalStateException(
                        "Không tìm thấy thông tin ứng viên cho tài khoản hiện tại"));

        if (dto.getAccPassword() != null && !dto.getAccPassword().isEmpty()) {
            currentAccount.setAccPassword(passwordEncoder.encode(dto.getAccPassword()));
        }
        currentAccount.setAccName(dto.getAccName());
        currentAccount.setAccEmail(dto.getAccEmail());
        currentAccount.setAccIsMale(dto.getAccIsMale());
        currentAccount.setAccDob(dto.getAccDob());
        currentAccount.setAccPhone(dto.getAccPhone());

        candidate.setCandExpYear(dto.getCandExpYear());
        candidate.setCandCvPath(dto.getCandCvPath());
        candidate.setCandMajor(dto.getCandMajor());

        if (dto.getDtId() != null) {
            degreeTypeRepository.findById(dto.getDtId()).ifPresent(candidate::setDt);
        }

        if (dto.getSkillIds() != null && !dto.getSkillIds().isEmpty()) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(dto.getSkillIds()));
            candidate.setSkills(skills);
        }

        accountRepository.save(currentAccount);
        candidateRepository.save(candidate);
    }
}
