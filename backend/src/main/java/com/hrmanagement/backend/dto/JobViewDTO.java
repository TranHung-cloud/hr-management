package com.hrmanagement.backend.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobViewDTO {
    private UUID id;
    private String code;            // vd: TD-014
    private String title;           // jd_title
    private String department;      // dep_name
    private String type;            // Toàn thời gian / Thực tập
    private String salary;          // Format: 15 – 30 triệu
    private String target;          // Format: "2/5" (Đã tuyển/Chỉ tiêu)
    private Integer progress;       // Tỷ lệ % hoàn thành chỉ tiêu
    private Integer candidates;     // Số lượng ứng viên nộp hồ sơ
    private String deadline;        // Hạn nộp
    private Boolean isWarning;      // Cảnh báo gần hết hạn
    private String assignee;        // Tên nhân viên phụ trách (acc_name)
    private String avatar;          // Chữ cái viết tắt (vd: TMQ)
    private String status;          // PUBLISHED, DRAFT...
}