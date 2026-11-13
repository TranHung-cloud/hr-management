"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Pencil, Check, Mail, Phone } from "lucide-react";
import { api, useApi } from "@/hooks/use-api";
import { useRecruitment } from "@/components/recruitment/provider";
import { Avatar, Empty, LoadState, Status } from "@/components/recruitment/shared";
import { ScheduleForm } from "@/components/recruitment/schedule-form";
import { applicationLabels, dateLabel, detailHref, interviewPath, timeLabel } from "@/lib/recruitment";
import type { Detail, Interview, Lookups } from "@/types/api";

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const parts = id.split("_");
  const valid = parts.length === 2 && parts.every(p => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p));
  const result = useApi<Detail>(valid ? `admin/interviews/${parts.join("/")}` : null);
  if (!valid) return <Empty>Đường dẫn phỏng vấn không hợp lệ. <Link className="text-link" href="/admin/interviews/schedule">Về lịch phỏng vấn</Link></Empty>;
  return <><LoadState loading={result.loading} error={result.error} reload={result.reload} />{result.data && <DetailContent key={`${id}:${result.data.interview.status}:${result.data.interview.scheduledAt}:${result.data.interview.feedback}`} detail={result.data} />}</>;
}
function DetailContent({ detail }: { detail: Detail }) {
  const i = detail.interview; const router = useRouter(); const { refresh, notify, canManage, accountId } = useRecruitment();
  const [schedule, setSchedule] = useState(false); const [tab, setTab] = useState("feedback"); const [feedback, setFeedback] = useState(i.feedback || "");
  const [status, setStatus] = useState(i.status === "REJECTED" ? "REJECTED" : "COMPLETED"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const lookups = useApi<Lookups>("admin/lookups");
  const closed = i.applicationStatus === "ACCEPTED" || i.applicationStatus === "REJECTED";
  const canSchedule = canManage && !closed && (i.status === "SCHEDULED" || i.status === "UNSCHEDULED");
  async function changeStage(stageId: string) {
    if (!stageId || busy) return; setBusy(true); setError("");
    try { const updated = await api<Interview>(`admin/applications/${i.id.applicationId}/stages`, { method: "POST", body: JSON.stringify({ stageId }) }); refresh(); notify("Đã chuyển vòng."); router.push(detailHref(updated.id)); }
    catch (e) { setError(e instanceof Error ? e.message : "Không chuyển được vòng."); } finally { setBusy(false); }
  }
  return <><Link href="/admin/interviews/schedule" className="back-link"><ArrowLeft size={15} />Quay lại lịch phỏng vấn</Link><div className="page-heading"><div><div className="eyebrow">{i.stage.name} / {i.job.title}</div><h1>Chi tiết phỏng vấn<span className="heading-dot">.</span></h1><p>{applicationLabels[i.applicationStatus]}</p></div>{canSchedule && <button className="button secondary" onClick={() => setSchedule(true)}><Pencil size={15} />{i.scheduledAt ? "Điều chỉnh lịch" : "Lên lịch phỏng vấn"}</button>}</div>
    {lookups.data && <div className="stage-stepper">{lookups.data.stages.map((s, n) => <div key={s.id} className={s.id === i.stage.id ? "current" : ""}><span>{n + 1}</span><strong>{s.name}</strong></div>)}</div>}
    {error && <div className="api-error" role="alert">{error}</div>}
    <div className="detail-grid"><aside className="panel profile-panel"><div className="profile-header"><Avatar name={i.candidate.name || "?"} large index={2} /><h2>{i.candidate.name || "Chưa có tên"}</h2><p>{i.job.title}</p><Status status={i.status} /></div><div className="profile-section"><h3>Thông tin liên hệ</h3>{i.candidate.email ? <a href={`mailto:${i.candidate.email}`}><Mail size={15} />{i.candidate.email}</a> : <p className="muted">Chưa có email</p>}{i.candidate.phone && <a href={`tel:${i.candidate.phone.replaceAll(" ", "")}`}><Phone size={15} />{i.candidate.phone}</a>}</div><div className="profile-section"><h3>Hồ sơ ứng tuyển</h3><div className="profile-fact"><span>Kinh nghiệm<strong>{i.candidate.experienceYears === null ? "Chưa cung cấp" : `${i.candidate.experienceYears} năm`}</strong></span></div><div className="profile-fact"><span>Trình độ<strong>{i.candidate.degree || "Chưa cung cấp"}</strong></span></div><div className="profile-fact"><span>Phòng ban<strong>{i.job.department || "Chưa phân công"}</strong></span></div><div className="profile-fact"><span>Chuyên ngành<strong>{i.candidate.major || "Chưa cung cấp"}</strong></span></div></div><div className="profile-section"><h3>Kỹ năng</h3><div className="skills">{i.candidate.skills.map(s => <span key={s}>{s}</span>)}{!i.candidate.skills.length && <span>Chưa cung cấp</span>}</div></div></aside>
      <div className="detail-main"><section className="panel"><div className="panel-heading"><div><h2>Thông tin buổi phỏng vấn</h2><p>{i.stage.name} · {i.job.title}</p></div></div><div className="meeting-facts"><div><CalendarDays size={19} /><span>Ngày phỏng vấn<strong>{dateLabel(i.scheduledAt)}</strong></span></div><div><Clock3 size={19} /><span>Giờ bắt đầu (UTC+7)<strong>{timeLabel(i.scheduledAt)}</strong></span></div><div><span>Hình thức<strong>{i.method?.name || "Chưa chọn"}</strong></span></div><div><span>Người phỏng vấn<strong>{i.interviewer?.name || "Chưa phân công"}</strong></span></div></div></section>
      <section className="panel"><div className="detail-tabs"><button className={tab === "feedback" ? "selected" : ""} onClick={() => setTab("feedback")}>Đánh giá & nhận xét</button><button className={tab === "rounds" ? "selected" : ""} onClick={() => setTab("rounds")}>Các vòng phỏng vấn</button></div>
        {tab === "feedback" ? <form className="feedback-form" onSubmit={async e => {
          e.preventDefault(); setBusy(true); setError("");
          try { await api(interviewPath(i.id) + "/feedback", { method: "PUT", body: JSON.stringify({ status, feedback }) }); refresh(); notify("Đã lưu kết quả phỏng vấn."); }
          catch (e) { setError(e instanceof Error ? e.message : "Không lưu được đánh giá."); } finally { setBusy(false); }
        }}><h2>Nhận xét sau phỏng vấn</h2><label>Nhận xét<textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={6} required maxLength={10000} /></label><fieldset className="result-options"><legend>Kết quả buổi phỏng vấn</legend>{[{ id: "COMPLETED", label: "Đã hoàn tất" }, { id: "REJECTED", label: "Không đạt" }].map(s => <label key={s.id} className={status === s.id ? "checked" : ""}><input type="radio" name="result" value={s.id} checked={status === s.id} onChange={() => setStatus(s.id)} />{s.label}</label>)}</fieldset><div className="feedback-actions"><span>{i.scheduledAt ? "Tối đa 10.000 ký tự. Hoàn tất buổi phỏng vấn chưa phải quyết định tuyển dụng." : "Cần lên lịch trước khi ghi nhận kết quả."}</span><button className="button primary" disabled={busy || !i.scheduledAt || (!canManage && i.interviewer?.id !== accountId)}><Check size={16} />{busy ? "Đang lưu…" : "Lưu đánh giá"}</button></div></form> : <div className="history-list">{detail.rounds.map(r => <Link href={detailHref(r.id)} className="history-item" key={detailHref(r.id)}><span className="history-dot" /><div><strong>{r.stage.name}</strong><small>{dateLabel(r.scheduledAt)} · {timeLabel(r.scheduledAt)}</small><p>{r.feedback || "Chưa có nhận xét"}</p><Status status={r.status} /></div></Link>)}</div>}
      </section>
      <section className="next-step"><div><h3>Chuyển vòng phỏng vấn</h3><p>Các vòng trước được giữ lại.</p></div><select aria-label="Chuyển vòng phỏng vấn" value="" disabled={busy || closed || !canManage} onChange={e => void changeStage(e.target.value)}><option value="">Chọn vòng tiếp theo</option>{lookups.data?.stages.filter(s => s.order !== null && s.order > Math.max(...detail.rounds.map(r => r.stage.order ?? -Infinity))).map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></section>
      <section className="next-step"><div><h3>Quyết định tuyển dụng</h3><p>{applicationLabels[i.applicationStatus]}</p></div><select aria-label="Quyết định tuyển dụng" value={i.applicationStatus} disabled={busy || !canManage} onChange={async e => {
        const value = e.target.value; setBusy(true); setError("");
        try { await api(`admin/applications/${i.id.applicationId}/status`, { method: "PUT", body: JSON.stringify({ status: value }) }); refresh(); notify("Đã cập nhật quyết định tuyển dụng."); }
        catch (e) { setError(e instanceof Error ? e.message : "Không cập nhật được quyết định."); } finally { setBusy(false); }
      }}>{Object.entries(applicationLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></section>
      <LoadState loading={lookups.loading} error={lookups.error} reload={lookups.reload} />
      </div></div>{schedule && <ScheduleForm interview={i} onClose={() => setSchedule(false)} />}
  </>;
}
