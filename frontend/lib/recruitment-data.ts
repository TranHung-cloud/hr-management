import type { Interview, StageId } from "@/types/recruitment";

export const DEMO_TODAY = "2026-11-02";
export const stages: { id: StageId; name: string; short: string; color: string }[] = [
  { id: "screening", name: "Đã lọc CV", short: "Lọc CV", color: "#87938b" },
  { id: "hr", name: "Phỏng vấn HR", short: "PV HR", color: "#cba58d" },
  { id: "technical", name: "Phỏng vấn chuyên môn", short: "Chuyên môn", color: "#34786e" },
  { id: "offer", name: "Đề xuất hợp đồng", short: "Đề xuất HĐ", color: "#b18c49" },
  { id: "hired", name: "Đã tuyển", short: "Đã tuyển", color: "#668b79" },
];
export const jobs = [
  { title: "Frontend Developer", department: "Công nghệ", target: 3 },
  { title: "Backend Developer", department: "Công nghệ", target: 2 },
  { title: "UI/UX Designer", department: "Sản phẩm", target: 2 },
  { title: "Business Analyst", department: "Sản phẩm", target: 1 },
  { title: "Talent Acquisition", department: "Nhân sự", target: 1 },
];
const people: [string, string, StageId, Interview["status"], string, string, string][] = [
  ["Nguyễn Hoàng Nam", "Frontend Developer", "technical", "scheduled", "2026-11-02", "09:00", "Lê Quốc Anh"],
  ["Phạm Thu Hà", "UI/UX Designer", "hr", "scheduled", "2026-11-02", "10:30", "Trần Mai Lan"],
  ["Lê Quốc Bảo", "Backend Developer", "technical", "passed", "2026-10-30", "14:00", "Lê Quốc Anh"],
  ["Đặng Tuấn Kiệt", "Frontend Developer", "offer", "passed", "2026-10-29", "09:00", "Lê Quốc Anh"],
  ["Vũ Thùy Linh", "Business Analyst", "technical", "scheduled", "2026-11-02", "14:00", "Phạm Thu Trang"],
  ["Bùi Phương Thảo", "Talent Acquisition", "offer", "passed", "2026-10-30", "15:00", "Trần Mai Lan"],
  ["Hoàng Gia Huy", "Backend Developer", "hr", "scheduled", "2026-11-03", "09:30", "Trần Mai Lan"],
  ["Trương Diệu My", "Talent Acquisition", "hr", "failed", "2026-10-29", "10:00", "Trần Mai Lan"],
  ["Lê Thanh Tùng", "Backend Developer", "screening", "scheduled", "2026-11-04", "14:00", "Lê Quốc Anh"],
  ["Nguyễn Đức Thịnh", "Frontend Developer", "hired", "passed", "2026-10-28", "14:00", "Lê Quốc Anh"],
  ["Trần Ngọc Anh", "UI/UX Designer", "screening", "scheduled", "2026-11-04", "10:00", "Trần Mai Lan"],
  ["Đỗ Minh Khang", "Backend Developer", "technical", "scheduled", "2026-11-03", "14:30", "Lê Quốc Anh"],
  ["Phan Minh Châu", "Business Analyst", "screening", "scheduled", "2026-11-05", "09:00", "Phạm Thu Trang"],
  ["Nguyễn Khánh Vy", "UI/UX Designer", "hired", "passed", "2026-10-27", "09:00", "Trần Mai Lan"],
  ["Trần Hải Đăng", "Frontend Developer", "hr", "scheduled", "2026-11-05", "15:00", "Trần Mai Lan"],
];
export const initialInterviews: Interview[] = people.map(([name, job, stage, status, date, time, interviewer], i) => ({
  id: `PV-${String(i + 1).padStart(3, "0")}`, name, job, stage, status, date, time,
  endTime: `${String(Number(time.split(":")[0]) + 1).padStart(2, "0")}:${time.split(":")[1]}`,
  email: ["hoangnam", "thuha", "quocbao", "tuankiet", "thuylinh", "phuongthao", "giahuy", "dieumy", "thanhtung", "ducthinh", "ngocanh", "minhkhang", "minhchau", "khanhvy", "haidang"][i] + "@example.com",
  phone: `090 123 ${4500 + i}`, department: jobs.find(j => j.title === job)!.department,
  interviewer, method: i % 3 === 1 ? "Trực tiếp" : "Trực tuyến",
  location: i % 3 === 1 ? "Phòng họp Hoa Sen · Tầng 3" : "Google Meet · Chưa tạo liên kết",
  experience: [3, 2, 5, 3, 4, 2, 2, 1, 3, 4, 2, 3, 2, 3, 1][i], degree: "Đại học",
  skills: job.includes("Frontend") ? ["React", "TypeScript", "Next.js"] : job.includes("Backend") ? ["Java", "Spring Boot", "PostgreSQL"] : job.includes("Designer") ? ["Figma", "UI Design", "UX Research"] : job.includes("Analyst") ? ["BPMN", "SQL", "Agile"] : ["Sourcing", "Phỏng vấn", "Giao tiếp"],
  feedback: status === "passed" ? "Ứng viên có nền tảng chuyên môn tốt, trình bày rõ ràng và phù hợp với yêu cầu vị trí. Đề xuất tiếp tục quy trình tuyển dụng." : status === "failed" ? "Kinh nghiệm thực tế chưa đáp ứng yêu cầu của vị trí ở thời điểm hiện tại." : "",
  history: [
    { title: "Tiếp nhận hồ sơ ứng tuyển", date: "23/10/2026 · 09:15", note: "Ứng viên nộp hồ sơ qua cổng tuyển dụng." },
    { title: "Hồ sơ đã qua sàng lọc", date: "26/10/2026 · 10:30", note: "Nguyễn Minh Tuấn chuyển hồ sơ vào quy trình phỏng vấn." },
  ],
}));
export function initials(name: string) { return name.split(" ").slice(-2).map(s => s[0]).join(""); }
export function dateLabel(date: string) { return date.split("-").reverse().join("/"); }
export const statusLabels = { scheduled: "Chờ phỏng vấn", passed: "Đạt", failed: "Không đạt" };
