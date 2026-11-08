"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, CalendarDays, ArrowRight, ChevronRight } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useRecruitment } from "@/components/recruitment/provider";
import { Avatar, Empty, LoadState, Status } from "@/components/recruitment/shared";
import { ScheduleForm } from "@/components/recruitment/schedule-form";
import { today, dateLabel, timeLabel, detailHref, stageColors, applicationLabels } from "@/lib/recruitment";
import type { Dashboard, Interview, Application, PageResult } from "@/types/api";

export default function DashboardPage() {
  const { canManage } = useRecruitment();
  const [showSchedule, setShowSchedule] = useState(false);
  const summary = useApi<Dashboard>("dashboard");
  const upcoming = useApi<PageResult<Interview>>(`interviews?status=SCHEDULED&from=${today()}&size=4`);
  const applications = useApi<PageResult<Application>>("applications?size=5");
  const d = summary.data;
  const max = Math.max(2, ...(d?.dailyInterviews.map(day => day.count) || []));
  const countStages = d ? [...d.stages.map(s => ({ name: s.name, count: s.count })), { name: "Chưa vào vòng", count: d.applicationsWithoutStage }] : [];
  return <>
    <div className="page-heading"><div><div className="eyebrow">{dateLabel(today())} · Giờ Việt Nam</div><h1>Tổng quan tuyển dụng<span className="heading-dot">.</span></h1><p>Theo dõi hồ sơ, lịch hẹn và kết quả tuyển dụng.</p></div><button className="button primary" disabled={!canManage} onClick={() => setShowSchedule(true)}><Plus size={17} />Lên lịch phỏng vấn</button></div>
    <LoadState loading={summary.loading} error={summary.error} reload={summary.reload} />
    {d && <><div className="attention-strip"><CalendarDays size={18} /><div><strong>{d.interviewsToday} buổi phỏng vấn hôm nay</strong><span>Lịch và số liệu được lấy từ hệ thống tuyển dụng.</span></div><Link href="/admin/interviews/schedule">Xem lịch <ArrowRight size={16} /></Link></div>
      <section className="metrics" aria-label="Số liệu tổng quan"><div className="metric"><span>Tin tuyển dụng đang mở</span><strong>{d.openJobs}</strong><small>Trạng thái đã đăng</small></div><div className="metric"><span>Hồ sơ ứng tuyển</span><strong>{d.totalApplications}</strong><small>{d.totalCandidates} ứng viên</small></div><div className="metric"><span>Lịch phỏng vấn sắp tới</span><strong>{d.upcomingInterviews}</strong><small>{d.interviewsToday} buổi hôm nay</small></div><div className="metric"><span>Hồ sơ đã tuyển</span><strong>{d.acceptedApplications}</strong><small>Tổng hồ sơ được chấp nhận</small></div></section>
      <div className="dashboard-charts"><section className="panel"><div className="panel-heading"><div><h2>Nhịp tuyển dụng</h2><p>Số buổi phỏng vấn theo ngày</p></div><span className="subtle-tag">7 ngày gần nhất</span></div><div className="bar-chart" role="img" aria-label={d.dailyInterviews.map(day => `${dateLabel(day.date)}: ${day.count} buổi`).join(", ")}><div className="chart-y"><span>{max}</span><span>{Math.round(max / 2)}</span><span>0</span></div><div className="chart-plot"><div className="gridlines"><i /><i /><i /></div>{d.dailyInterviews.map(day => <div className={`bar-column ${day.date === today() ? "current" : ""}`} key={day.date}><span className="bar-value">{day.count}</span><div className="bar" style={{ height: `${day.count / max * 80}%` }} /><small>{dateLabel(day.date).slice(0, 5)}</small></div>)}</div></div><div className="chart-foot"><span>Lịch phỏng vấn</span><span>{d.interviewsToday} buổi hôm nay</span></div></section>
      <section className="panel"><div className="panel-heading"><div><h2>Hồ sơ theo giai đoạn</h2><p>Mỗi hồ sơ được đếm ở vòng hiện tại</p></div><Link href="/admin/interviews" className="text-link">Mở Kanban</Link></div><div className="funnel-total"><strong>{d.totalApplications}</strong><span>hồ sơ ứng tuyển</span></div><div className="stage-distribution">{countStages.map((s, n) => <span key={n} style={{ width: `${d.totalApplications ? s.count / d.totalApplications * 100 : 0}%`, background: stageColors[n % stageColors.length] }} />)}</div><div className="stage-legend">{countStages.map((s, n) => <div key={n}><span><i style={{ background: stageColors[n % stageColors.length] }} />{s.name}</span><strong>{s.count}<small>{d.totalApplications ? Math.round(s.count / d.totalApplications * 100) : 0}%</small></strong></div>)}</div></section></div>
    </>}
    <div className="dashboard-lists"><section className="panel"><div className="panel-heading"><div><h2>Lịch phỏng vấn sắp tới</h2><p>Các lịch đã được xác nhận</p></div><Link className="text-link" href="/admin/interviews/schedule">Xem tất cả <ChevronRight size={14} /></Link></div><LoadState loading={upcoming.loading} error={upcoming.error} reload={upcoming.reload} />{upcoming.data?.content.map((i, n) => <Link className="appointment-row" key={detailHref(i.id)} href={detailHref(i.id)}><div className="appointment-time"><strong>{timeLabel(i.scheduledAt)}</strong><small>{dateLabel(i.scheduledAt).slice(0, 5)}</small></div><Avatar name={i.candidate.name || "?"} index={n} /><div className="row-person"><strong>{i.candidate.name || "Chưa có tên"}</strong><span>{i.job.title}</span><small>Người PV: {i.interviewer?.name || "Chưa phân công"}</small></div><ChevronRight size={16} /></Link>)}{upcoming.data && !upcoming.data.totalElements && <Empty>Chưa có lịch phỏng vấn sắp tới.</Empty>}</section>
    <section className="panel"><div className="panel-heading"><div><h2>Hồ sơ ứng tuyển</h2><p>Trạng thái hiện tại của từng hồ sơ</p></div><Link className="text-link" href="/admin/interviews">Xem tất cả</Link></div><LoadState loading={applications.loading} error={applications.error} reload={applications.reload} />{applications.data?.content.map((a, n) => <Link className="candidate-row" key={`${a.candidateId}_${a.jobId}`} href={a.currentInterview ? detailHref(a.currentInterview.id) : "/admin/interviews"}><Avatar name={a.candidate.name || "?"} index={n} /><div className="row-person"><strong>{a.candidate.name || "Chưa có tên"}</strong><span>{a.job.title}</span><small>{applicationLabels[a.status]}</small></div><div className="candidate-stage">{a.currentInterview ? <Status status={a.currentInterview.status} /> : <span className="stage-badge">Chưa vào vòng</span>}</div></Link>)}{applications.data && !applications.data.totalElements && <Empty>Chưa có hồ sơ ứng tuyển.</Empty>}</section></div>
    {showSchedule && <ScheduleForm onClose={() => setShowSchedule(false)} />}
  </>;
}
