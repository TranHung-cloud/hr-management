import type { InterviewKey, InterviewStatus, ApplicationStatus } from "@/types/api";
export const statusLabels: Record<InterviewStatus, string> = { UNSCHEDULED: "Chưa lên lịch", SCHEDULED: "Chờ phỏng vấn", COMPLETED: "Đã hoàn tất", REJECTED: "Không đạt" };
export const applicationLabels: Record<ApplicationStatus, string> = { SUBMITTED: "Đã nộp hồ sơ", ACCEPTED: "Đã tuyển", REJECTED: "Từ chối" };
export function initials(name: string) { return name.trim().split(/\s+/).slice(-2).map(s => s[0] || "").join("") || "?"; }
export function dateLabel(date?: string | null) { return date ? date.slice(0, 10).split("-").reverse().join("/") : "Chưa lên lịch"; }
export function timeLabel(value?: string | null) { return value ? value.slice(11, 16) : "—"; }
export function today() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
export function detailHref(id: InterviewKey) { return `/admin/interviews/${id.applicationId}_${id.stageId}`; }
export function interviewPath(id: InterviewKey) { return `admin/interviews/${id.applicationId}/${id.stageId}`; }
export const stageColors = ["#87938b", "#cba58d", "#34786e", "#b18c49", "#668b79", "#9c7870"];
