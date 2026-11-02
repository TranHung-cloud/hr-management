"use client";
import { useState } from "react";
import { useRecruitment } from "./provider";
import { Modal } from "./shared";
import { DEMO_TODAY, stages } from "@/lib/recruitment-data";
import type { Interview, StageId } from "@/types/recruitment";
export function ScheduleForm({ onClose, interview }: { onClose: () => void; interview?: Interview }) {
  const { interviews, updateInterview, notify } = useRecruitment();
  const [id, setId] = useState(interview?.id || interviews.find(i => i.stage !== "hired")!.id); const [error, setError] = useState("");
  const selected = interviews.find(i => i.id === id)!;
  return <Modal title={interview ? "Điều chỉnh lịch phỏng vấn" : "Lên lịch phỏng vấn"} onClose={onClose}><form className="schedule-form" key={id} onSubmit={e => {
    e.preventDefault(); const data = new FormData(e.currentTarget); const date = String(data.get("date")); const time = String(data.get("time")); const endTime = String(data.get("endTime"));
    if (endTime <= time) { setError("Giờ kết thúc phải sau giờ bắt đầu."); return; }
    const interviewer = String(data.get("interviewer"));
    if (interviews.some(i => i.id !== id && i.status === "scheduled" && i.date === date && i.interviewer === interviewer && i.time < endTime && i.endTime > time)) { setError("Người phỏng vấn đã có lịch trong khoảng thời gian này."); return; }
    updateInterview(id, { date, time, endTime, interviewer, stage: String(data.get("stage")) as StageId, method: String(data.get("method")) as Interview["method"], location: String(data.get("location")), status: "scheduled" }); notify(`Đã lưu lịch mẫu cho ${selected.name}.`); onClose();
  }}><p className="muted">Sắp xếp buổi gặp tiếp theo cùng ứng viên.</p>
    <label>Ứng viên<select value={id} onChange={e => setId(e.target.value)} disabled={!!interview}>{interviews.filter(i => i.stage !== "hired" || i.id === interview?.id).map(i => <option key={i.id} value={i.id}>{i.name} · {i.job}</option>)}</select></label>
    <label>Vòng phỏng vấn<select name="stage" defaultValue={selected.stage}>{stages.filter(s => s.id !== "hired").map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    <div className="form-grid"><label>Ngày phỏng vấn<input type="date" name="date" min={DEMO_TODAY} defaultValue={selected.date < DEMO_TODAY ? DEMO_TODAY : selected.date} required /></label><label>Người phỏng vấn<select name="interviewer" defaultValue={selected.interviewer}>{["Lê Quốc Anh", "Trần Mai Lan", "Phạm Thu Trang"].map(n => <option key={n}>{n}</option>)}</select></label></div>
    <div className="form-grid"><label>Bắt đầu<input type="time" name="time" defaultValue={selected.time} required /></label><label>Kết thúc<input type="time" name="endTime" defaultValue={selected.endTime} required /></label></div>
    <label>Hình thức<select name="method" defaultValue={selected.method}><option>Trực tuyến</option><option>Trực tiếp</option></select></label>
    <label>Địa điểm / liên kết cuộc họp<input name="location" defaultValue={selected.location} required placeholder="Phòng họp hoặc đường dẫn Google Meet" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}<p className="form-hint">Lịch mẫu chỉ lưu trong phiên xem, chưa gửi thông báo cho ứng viên.</p><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Hủy</button><button className="button primary" type="submit">Lưu lịch phỏng vấn</button></div>
  </form></Modal>;
}
