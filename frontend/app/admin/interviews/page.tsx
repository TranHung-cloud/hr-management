"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, Search, CalendarDays, ArrowUpRight, GripVertical } from "lucide-react";
import { api, useApi } from "@/hooks/use-api";
import { useRecruitment } from "@/components/recruitment/provider";
import { Avatar, Empty, LoadState, Pagination, Status } from "@/components/recruitment/shared";
import { ScheduleForm } from "@/components/recruitment/schedule-form";
import { dateLabel, timeLabel, detailHref, stageColors, applicationLabels } from "@/lib/recruitment";
import type { Application, Lookups, PageResult } from "@/types/api";

export default function PipelinePage() {
  const { refresh, notify, canManage } = useRecruitment();
  const [query, setQuery] = useState(""); const [job, setJob] = useState(""); const [page, setPage] = useState(0);
  const [schedule, setSchedule] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [dragging, setDragging] = useState<string | null>(null);
  const lookups = useApi<Lookups>("admin/lookups");
  const result = useApi<PageResult<Application>>(`admin/pipeline?size=20&page=${page}&query=${encodeURIComponent(query)}${job ? `&jobId=${job}` : ""}`);
  const rows = result.data?.content || [];
  const columns = [{ id: "", name: "Chưa vào vòng", order: -Infinity }, ...(lookups.data?.stages || [])];
  async function move(key: string, stageId: string) {
    const a = rows.find(a => a.applicationId === key);
    if (!a || !stageId || a.currentInterview?.stage.id === stageId || busy || !canManage) return;
    setBusy(true); setError("");
    try { await api(`admin/applications/${a.applicationId}/stages`, { method: "POST", body: JSON.stringify({ stageId }) }); refresh(); notify("Đã chuyển vòng phỏng vấn."); }
    catch (e) { setError(e instanceof Error ? e.message : "Không chuyển được vòng."); } finally { setBusy(false); setDragging(null); }
  }
  return <><div className="page-heading"><div><div className="eyebrow">Tuyển dụng / Quy trình phỏng vấn</div><h1>Mỗi ứng viên, một hành trình<span className="heading-dot">.</span></h1><p>Chuyển vòng giữ lại các buổi phỏng vấn trước đó.</p></div><button className="button primary" disabled={!canManage} onClick={() => setSchedule(true)}><Plus size={17} />Lên lịch phỏng vấn</button></div>
    <div className="pipeline-toolbar"><label className="search-field"><Search size={17} /><input aria-label="Tìm ứng viên" placeholder="Tìm tên, email, vị trí..." value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} /></label><select className="filter-select" aria-label="Lọc vị trí tuyển dụng" value={job} onChange={e => { setJob(e.target.value); setPage(0); }}><option value="">Tất cả vị trí</option>{lookups.data?.jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select><span className="result-count">{result.data?.totalElements ?? "…"} hồ sơ</span><Link href="/admin/interviews/schedule" className="button secondary">Lịch phỏng vấn</Link></div>
    <br></br>
    <LoadState loading={result.loading || lookups.loading} error={result.error || lookups.error} reload={() => { result.reload(); lookups.reload(); }} />{error && <div className="api-error" role="alert">{error}</div>}
    {result.data && lookups.data && <><div className="kanban-board" aria-busy={busy}>{columns.map((stage, n) => {
      const items = rows.filter(a => (a.currentInterview?.stage.id || "") === stage.id);
      return <section className="kanban-column" key={stage.id || "unassigned"} onDragOver={e => { if (stage.id && !busy) e.preventDefault(); }} onDrop={e => { e.preventDefault(); void move(e.dataTransfer.getData("text/plain"), stage.id); }}><div className="column-heading" style={{ borderBottomColor: stageColors[n % stageColors.length] }}><h2>{stage.name}</h2><span className="column-count">{items.length}</span></div><div className="column-cards">{items.map(a => {
        const key = a.applicationId; const i = a.currentInterview; const closed = ["ACCEPTED", "REJECTED"].includes(a.status);
        return <article key={key} className={`kanban-card ${dragging === key ? "dragging" : ""}`} draggable={canManage && !closed && !busy} onDragStart={e => { e.dataTransfer.setData("text/plain", key); setDragging(key); }} onDragEnd={() => setDragging(null)}><div className="card-topline"><span className="card-id">{a.applicationId.slice(0, 8)}</span><GripVertical size={15} /></div><div className="card-person"><Avatar name={a.candidate.name || "?"} index={rows.indexOf(a)} /><span><strong>{a.candidate.name || "Chưa có tên"}</strong><small>{a.job.title}</small></span>{i && <Link href={detailHref(i.id)} aria-label={`Chi tiết ${a.candidate.name}`}><ArrowUpRight size={17} /></Link>}</div>{a.candidate.email && <a className="card-email" href={`mailto:${a.candidate.email}`}>{a.candidate.email}</a>}<p className="muted">{applicationLabels[a.status]}</p>{i && <><Status status={i.status} /><div className="card-schedule"><span><CalendarDays size={13} />{dateLabel(i.scheduledAt)} · {timeLabel(i.scheduledAt)}</span><span>{i.method?.name || "Chưa chọn hình thức"}</span></div>{i.feedback && <div className="card-feedback"><span>Nhận xét phỏng vấn</span><p>{i.feedback}</p></div>}<div className="card-bottom"><span>Người phỏng vấn</span><span>{i.interviewer?.name || "Chưa phân công"}</span></div></>}
          <label className="move-control"><span>Giai đoạn</span><select aria-label={`Chuyển giai đoạn ${a.candidate.name}`} value={i?.stage.id || ""} disabled={busy || closed || !canManage} onChange={e => void move(key, e.target.value)}><option value="" disabled>Chọn vòng</option>{lookups.data!.stages.map(s => <option key={s.id} value={s.id} disabled={s.order === null || (s.order ?? -Infinity) < (i?.stage.order ?? -Infinity)}>{s.name}</option>)}</select></label></article>;
      })}{!items.length && <Empty>Không có hồ sơ ở cột này trong trang hiện tại.</Empty>}</div></section>;
    })}</div><Pagination page={page} size={20} total={result.data.totalElements} onPage={setPage} /></>}
    {schedule && <ScheduleForm onClose={() => setSchedule(false)} />}
  </>;
}
