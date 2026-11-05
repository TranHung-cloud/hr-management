export interface JobItem {
  id: string;             // jd_id (UUID)
  code: string;           // Mã tin sinh từ UUID (vd: TD-A1B2C)
  title: string;          // jd_title
  department: string;     // dep_name
  type: string;           // Hình thức công việc
  salary: string;         // jd_sal_min - jd_sal_max
  target: string;         // Format: "2/5" (Đã tuyển / jd_target)
  progress: number;       // % hoàn thành chỉ tiêu
  candidates: number;     // Tổng số đơn application nộp vào jd_id
  deadline: string;       // Hạn nộp hồ sơ
  isWarning?: boolean;    // Cảnh báo hết hạn
  assignee: string;       // Tên người phụ trách (account.acc_name)
  avatar: string;         // Chữ cái viết tắt tên người phụ trách
  status: "DRAFT" | "PUBLISHED" | string; // jd_status trong DB
  checked?: boolean;
}