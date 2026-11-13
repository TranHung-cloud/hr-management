package com.hrmanagement.backend.dto;

import com.hrmanagement.backend.entity.enums.JobStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public final class JobDescriptionDTO {
    private JobDescriptionDTO() {}

    public record JobViewDTO(
            UUID jdId,
            String jdTitle,
            String depName,
            Integer jdSalMin,
            Integer jdSalMax,
            long hiredCount,
            Integer jdTarget,
            JobStatus jdStatus,
            String recruiterName
    ) {}

    public record JobDetailDTO(
            UUID jdId,
            String jdTitle,
            String jdDesc,
            Integer jdSalMin,
            Integer jdSalMax,
            JobStatus jdStatus,
            Integer jdTarget,
            long hiredCount,
            String jdMajor,
            UUID depId,
            String depName,
            UUID recruiterId,
            String recruiterName,
            UUID dtId,
            String dtName,
            List<UUID> skillIds,
            List<String> skillNames,
            List<UUID> campaignIds
    ) {}

    public record JobUpsertDTO(
            @NotBlank(message = "Tên vị trí là bắt buộc") String jdTitle,
            @NotBlank(message = "Mô tả công việc là bắt buộc") String jdDesc,
            Integer jdSalMin,
            Integer jdSalMax,
            @NotNull(message = "Trạng thái là bắt buộc") JobStatus jdStatus,
            @NotNull(message = "Chỉ tiêu là bắt buộc") @Min(1) Integer jdTarget,
            String jdMajor,
            @NotNull(message = "Phòng ban là bắt buộc") UUID depId,
            @NotNull(message = "Người phụ trách là bắt buộc") UUID recruiterId,
            UUID dtId,
            List<UUID> skillIds,
            List<UUID> campaignIds
    ) {}

    public record JobLookupsDTO(
            List<DepartmentViewDTO> departments,
            List<RecruitmentDtos.Option> recruiters,
            List<RecruitmentDtos.Option> degreeTypes,
            List<RecruitmentDtos.Option> skills,
            List<RecruitmentDtos.Option> campaigns
    ) {}
}