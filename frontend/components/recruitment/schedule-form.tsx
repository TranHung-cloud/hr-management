"use client";
import { useState } from "react";
import { api, useApi } from "@/hooks/use-api";
import { useRecruitment } from "./provider";
import { Empty, LoadState, Modal, Pagination } from "./shared";
import { today, interviewPath } from "@/lib/recruitment";
import type { Application, Interview, Lookups, PageResult } from "@/types/api";

export function ScheduleForm({ onClose, interview }: { onClose: () => void; interview?: Interview }) {
  const { refresh, notify } = useRecruitment();
  const [query, setQuery] = useState(""); const [page, setPage] = useState(0); const [selectedKey, setSelectedKey] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const lookups = useApi<Lookups>("admin/lookups");
  const applications = useApi<PageResult<Application>>(interview ? null : `admin/pipeline?status=SUBMITTED&page=${page}&size=20&query=${encodeURIComponent(query)}`);
  const [allStatuses, setAllStatuses] = useState(false);
  const submitted = useApi<PageResult<Application>>(!interview && allStatuses ? `admin/pipeline?page=${page}&size=20&query=${encodeURIComponent(query)}` : null);
  const source = allStatuses ? submitted : applications;
  const rows = source.data?.content || [];
  const selected = rows.find(a => a.applicationId === selectedKey) || rows[0];
  const current = interview || selected?.currentInterview;
  const stages = lookups.data?.stages || [];
  const currentOrder = current?.stage.order ?? -Infinity;
  return <Modal title={interview ? "Điều chỉnh lịch phỏng vấn" : "Lên lịch phỏng vấn"} onClose={onClose}>
    <form className="schedule-form" key={selected?.applicationId} onSubmit={async e => {
      e.preventDefault(); if (!interview && !selected) return; const data = new FormData(e.currentTarget); setBusy(true); setError("");
      const payload = { scheduledAt: `${data.get("date")}T${data.get("time")}:00`, interviewerId: data.get("interviewer"), methodId: data.get("method") };
      try {
        if (interview) await api(interviewPath(interview.id) + "/schedule", { method: "PUT", body: JSON.stringify(payload) });
        else await api(`admin/applications/${selected.applicationId}/interviews`, { method: "POST", body: JSON.stringify({ ...payload, stageId: data.get("stage") }) });
        refresh(); notify("Đã lưu lịch phỏng vấn vào database."); onClose();
      } catch (e) { setError(e instanceof Error ? e.message : "Không lưu được lịch."); } finally { setBusy(false); }
    }}>
      <p className="muted">Lịch được lưu theo giờ Việt Nam (UTC+7).</p>
      {!interview && <><label>Tìm hồ sơ<input value={query} onChange={e => { setQuery(e.target.value); setPage(0); setSelectedKey(""); }} placeholder="Tên ứng viên hoặc vị trí" /></label><label>Nhóm hồ sơ<select value={allStatuses ? "ALL" : "SUBMITTED"} onChange={e => { setAllStatuses(e.target.value === "ALL"); setPage(0); setSelectedKey(""); }}><option value="SUBMITTED">Hồ sơ đang ứng tuyển</option><option value="ALL">Tất cả</option></select></label><LoadState loading={source.loading} error={source.error} reload={source.reload} />{source.data && <><label>Hồ sơ ứng tuyển<select required value={selected ? `${selected.candidateId}_${selected.jobId}` : ""} onChange={e => setSelectedKey(e.target.value)}>{!rows.length && <option value="">Không có hồ sơ phù hợp</option>}{rows.map(a => <option key={`${a.candidateId}_${a.jobId}`} value={`${a.candidateId}_${a.jobId}`}>{a.candidate.name || "Chưa có tên"} · {a.job.title}</option>)}</select></label><Pagination page={page} total={source.data.totalElements} size={20} onPage={p => { setPage(p); setSelectedKey(""); }} /></>}</>}
      {interview && <p><strong>{interview.candidate.name}</strong> · {interview.job.title}</p>}
      <LoadState loading={lookups.loading} error={lookups.error} reload={lookups.reload} />
      {lookups.data && <><label>Vòng phỏng vấn<select name="stage" required disabled={!!interview} defaultValue={current?.stage.id || ""}><option value="" disabled>Chọn vòng phỏng vấn</option>{stages.filter(s => s.order !== null && s.order >= currentOrder).map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><div className="form-grid"><label>Ngày<input name="date" type="date" required min={today()} defaultValue={current?.scheduledAt?.slice(0, 10) || today()} /></label><label>Giờ bắt đầu<input name="time" type="time" required defaultValue={current?.scheduledAt?.slice(11, 16) || "09:00"} /></label></div><label>Người phỏng vấn<select name="interviewer" required defaultValue={current?.interviewer?.id || ""}><option value="" disabled>Chọn người phỏng vấn</option>{lookups.data.interviewers.map(i => <option value={i.id} key={i.id}>{i.name || i.id}</option>)}</select></label><label>Hình thức<select name="method" required defaultValue={current?.method?.id || ""}><option value="" disabled>Chọn hình thức</option>{lookups.data.methods.map(m => <option value={m.id} key={m.id}>{m.name}</option>)}</select></label>{!stages.length && <Empty>Chưa có danh mục vòng phỏng vấn trong database.</Empty>}</>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose} disabled={busy}>Hủy</button><button className="button primary" disabled={busy || !lookups.data || (!interview && !selected)}>{busy ? "Đang lưu…" : "Lưu lịch phỏng vấn"}</button></div>
    </form>
  </Modal>;
}
