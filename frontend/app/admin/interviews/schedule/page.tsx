"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, Search, ChevronRight, CalendarDays } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useRecruitment } from "@/components/recruitment/provider";
import { Avatar, Empty, LoadState, Pagination, Status } from "@/components/recruitment/shared";
import { ScheduleForm } from "@/components/recruitment/schedule-form";
import { dateLabel, timeLabel, today, detailHref } from "@/lib/recruitment";
import type { Interview, PageResult } from "@/types/api";

export default function InterviewSchedulePage() {
  const { canManage } = useRecruitment();
  const [tab, setTab] = useState("upcoming"); const [outcome, setOutcome] = useState("COMPLETED");
  const [query, setQuery] = useState(""); const [date, setDate] = useState(""); const [page, setPage] = useState(0); const [schedule, setSchedule] = useState(false);
  const params = new URLSearchParams({ page: String(page), size: "20", query, status: tab === "completed" ? outcome : tab === "unscheduled" ? "UNSCHEDULED" : "SCHEDULED" });
  if (date) { params.set("from", date); params.set("to", date); }
  else if (tab === "today") { params.set("from", today()); params.set("to", today()); }
  else if (tab === "upcoming") params.set("from", today());
  const result = useApi<PageResult<Interview>>(`interviews?${params}`);
  return <><div className="page-heading"><div><div className="eyebrow">Tuyển dụng / Lịch phỏng vấn</div><h1>Những cuộc gặp sắp tới<span className="heading-dot">.</span></h1><p>Sắp xếp lịch hẹn và xem kết quả từng vòng phỏng vấn.</p></div><button className="button primary" disabled={!canManage} onClick={() => setSchedule(true)}><Plus size={17} />Lên lịch phỏng vấn</button></div>
    <div className="schedule-overview"><div><CalendarDays size={22} /><span><strong>Lịch phỏng vấn</strong><small>{dateLabel(today())} · UTC+7</small></span></div><Link className="button secondary" href="/admin/interviews">Xem quy trình Kanban</Link></div>
    <section className="panel schedule-panel"><div className="schedule-tabs" role="tablist" aria-label="Nhóm lịch phỏng vấn">{[{ id: "upcoming", label: "Sắp tới" }, { id: "today", label: "Hôm nay" }, { id: "completed", label: "Đã có kết quả" }, { id: "unscheduled", label: "Chưa lên lịch" }].map(t => <button role="tab" aria-selected={tab === t.id} key={t.id} className={tab === t.id ? "selected" : ""} onClick={() => { setTab(t.id); setPage(0); setDate(""); }}>{t.label}</button>)}</div>
    <div className="list-toolbar"><label className="search-field"><Search size={16} /><input aria-label="Tìm buổi phỏng vấn" placeholder="Tên ứng viên, vị trí, người phỏng vấn..." value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} /></label>{tab === "completed" && <select aria-label="Lọc kết quả" value={outcome} onChange={e => { setOutcome(e.target.value); setPage(0); }}><option value="COMPLETED">Đã hoàn tất</option><option value="REJECTED">Không đạt</option></select>}<label className="date-filter">Ngày<input type="date" aria-label="Lọc ngày phỏng vấn" value={date} onChange={e => { setDate(e.target.value); setPage(0); }} /></label>{(query || date) && <button className="text-link" onClick={() => { setQuery(""); setDate(""); setPage(0); }}>Xóa bộ lọc</button>}</div>
    <LoadState loading={result.loading} error={result.error} reload={result.reload} />
    {result.data && <><div className="table-wrap"><table><thead><tr><th>Ứng viên / Vị trí</th><th>Lịch phỏng vấn</th><th>Giai đoạn</th><th>Người phỏng vấn</th><th>Trạng thái</th><th><span className="sr-only">Chi tiết</span></th></tr></thead><tbody>{result.data.content.map((i, n) => <tr key={detailHref(i.id)}><td><Link href={detailHref(i.id)} className="table-person"><Avatar name={i.candidate.name || "?"} index={n} /><span><strong>{i.candidate.name || "Chưa có tên"}</strong><small>{i.job.title}</small></span></Link></td><td><strong className="time-value">{timeLabel(i.scheduledAt)}</strong><small>{dateLabel(i.scheduledAt)} · {i.method?.name || "Chưa chọn hình thức"}</small></td><td><span className="stage-badge">{i.stage.name}</span></td><td><span>{i.interviewer?.name || "Chưa phân công"}</span></td><td><Status status={i.status} /></td><td><Link className="icon-button" href={detailHref(i.id)} aria-label={`Chi tiết phỏng vấn ${i.candidate.name}`}><ChevronRight size={17} /></Link></td></tr>)}</tbody></table></div>{!result.data.totalElements && <Empty>Không có buổi phỏng vấn phù hợp.</Empty>}<Pagination page={page} total={result.data.totalElements} size={20} onPage={setPage} /></>}
    </section>{schedule && <ScheduleForm onClose={() => setSchedule(false)} />}
  </>;
}
