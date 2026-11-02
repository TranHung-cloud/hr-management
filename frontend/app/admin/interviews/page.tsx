"use client";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Search, Plus, Video, MapPin, ArrowUpRight, GripVertical, LayoutGrid, List, MessageSquareText } from "lucide-react";
import { useRecruitment } from "@/components/recruitment/provider";
import { Avatar, Empty, Status } from "@/components/recruitment/shared";
import { ScheduleForm } from "@/components/recruitment/schedule-form";
import { jobs, stages, dateLabel } from "@/lib/recruitment-data";
import type { StageId } from "@/types/recruitment";
export default function PipelinePage() {
  const { interviews, updateInterview, notify } = useRecruitment();
  const [query, setQuery] = useState(""); const [job, setJob] = useState(""); const [schedule, setSchedule] = useState(false); const [dragOver, setDragOver] = useState<StageId | null>(null); const [dragging, setDragging] = useState<string | null>(null);
  const filtered = interviews.filter(i => (!job || i.job === job) && `${i.name} ${i.email} ${i.job}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));
  function move(id: string, stage: StageId) { const item = interviews.find(i => i.id === id); if (!item || item.stage === stage) return; updateInterview(id, { stage, status: stage === "hired" ? "passed" : "scheduled", history: [...item.history, { title: `Chuyển sang ${stages.find(s => s.id === stage)!.name}`, date: "02/11/2026 · Phiên xem trước", note: "Nguyễn Minh Tuấn cập nhật giai đoạn tuyển dụng." }] }); notify(`Đã chuyển ${item.name} sang ${stages.find(s => s.id === stage)!.name}.`); }
  return <><div className="page-heading"><div><div className="eyebrow">Tuyển dụng / Quy trình phỏng vấn</div><h1>Mỗi ứng viên, một hành trình<span className="heading-dot">.</span></h1><p>Quản lý các vòng phỏng vấn trong cùng một không gian.</p></div><button className="button primary" onClick={() => setSchedule(true)}><Plus size={17} />Lên lịch phỏng vấn</button></div>
    <div className="pipeline-toolbar"><label className="search-field"><Search size={17} /><input placeholder="Tìm tên, email, vị trí..." aria-label="Tìm ứng viên" value={query} onChange={e => setQuery(e.target.value)} /></label><select className="filter-select" aria-label="Lọc vị trí tuyển dụng" value={job} onChange={e => setJob(e.target.value)}><option value="">Tất cả vị trí</option>{jobs.map(j => <option key={j.title}>{j.title}</option>)}</select><span className="result-count"><strong>{filtered.length}</strong> hồ sơ ứng tuyển</span><div className="view-switch"><span className="current-view"><LayoutGrid size={16} />Kanban</span><Link href="/admin/interviews/schedule"><List size={16} />Danh sách</Link></div></div>
    <div className="board-caption"><span><span className="tiny-dot" />{stages.length} giai đoạn tuyển dụng</span><span>Kéo thả thẻ hoặc chọn giai đoạn trên từng hồ sơ</span></div>
    <div className="kanban-board">{stages.map(stage => {
      const rows = filtered.filter(i => i.stage === stage.id);
      return <section className={`kanban-column ${dragOver === stage.id ? "drop-active" : ""}`} key={stage.id} onDragOver={e => { e.preventDefault(); setDragOver(stage.id); }} onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }} onDrop={e => { e.preventDefault(); move(e.dataTransfer.getData("text/plain"), stage.id); setDragging(null); setDragOver(null); }}>
        <div className="column-heading" style={{ borderBottomColor: stage.color }}><span className="stage-dot" style={{ background: stage.color }} /><h2>{stage.name}</h2><span className="column-count">{rows.length}</span></div>
        <div className="column-cards">{rows.map((i) => <article className={`kanban-card ${dragging === i.id ? "dragging" : ""}`} key={i.id} draggable onDragStart={e => { e.dataTransfer.setData("text/plain", i.id); e.dataTransfer.effectAllowed = "move"; setDragging(i.id); }} onDragEnd={() => { setDragging(null); setDragOver(null); }}>
          <div className="card-topline"><span className="card-id">{i.id}</span><GripVertical size={15} aria-label="Kéo để chuyển giai đoạn" /></div><Link href={`/admin/interviews/${i.id}`} className="card-person"><Avatar name={i.name} index={interviews.indexOf(i)} /><span><strong>{i.name}</strong><small>{i.job}</small></span><ArrowUpRight size={14} /></Link><a className="card-email" href={`mailto:${i.email}`}>{i.email}</a><Status status={i.status} /><div className="card-schedule"><span>{i.method === "Trực tuyến" ? <Video size={13} /> : <MapPin size={13} />}{i.method}</span><span><CalendarDays size={13} />{i.time} – {i.endTime}<small>{dateLabel(i.date)}</small></span></div>{i.feedback && <div className="card-feedback"><span><MessageSquareText size={12} />Nhận xét phỏng vấn</span><p>{i.feedback}</p></div>}<div className="card-bottom"><span>Người phỏng vấn</span><Avatar name={i.interviewer} index={2} /></div><label className="move-control"><span>Giai đoạn</span><select aria-label={`Chuyển giai đoạn ${i.name}`} value={i.stage} onChange={e => move(i.id, e.target.value as StageId)}>{stages.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label>
        </article>)}{!rows.length && <Empty>{query || job ? "Không có hồ sơ phù hợp." : "Chưa có ứng viên ở giai đoạn này."}</Empty>}</div>
      </section>;
    })}</div>{schedule && <ScheduleForm onClose={() => setSchedule(false)} />}</>;
}
