"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useCareerQuery } from "@/hooks/use-career-query";
import { CareerErrorState, JobListSkeleton, salaryLabel } from "@/components/careers/shared";
import type { CareerFilters, CareerPage } from "@/types/careers";

export default function JobsPage() {
  const router = useRouter(); const params = useSearchParams(); const [filtersOpen, setFiltersOpen] = useState(false); const [error, setError] = useState("");
  const page = Math.max(0, Number.parseInt(params.get("page") || "0", 10) || 0);
  const apiParams = new URLSearchParams({ page: String(page), size: "12" });
  for (const key of ["query", "departmentId", "degreeId", "salaryMin", "salaryMax"]) if (params.get(key)) apiParams.set(key, params.get(key)!);
  const jobs = useCareerQuery<CareerPage>(`/api/careers/jobs?${apiParams}`); const filters = useCareerQuery<CareerFilters>("/api/careers/jobs/filters");
  const active = ["query", "departmentId", "degreeId", "salaryMin", "salaryMax"].filter(k => params.get(k));
  function goPage(next: number) { const q = new URLSearchParams(params.toString()); if (next) q.set("page", String(next)); else q.delete("page"); router.push(`/jobs${q.size ? `?${q}` : ""}`, { scroll: false }); }
  return <div className="career-container"><div className="career-page-intro"><h1>Tìm công việc phù hợp với bạn.</h1></div>
    <div className="career-search-row"><label className="career-search"><Search size={19} /><span className="sr-only">Tên vị trí hoặc chuyên ngành</span><input key={`search:${params.get("query")}`} form="job-filters" name="query" maxLength={200} defaultValue={params.get("query") || ""} placeholder="Tìm theo tên vị trí hoặc chuyên ngành…" /></label><button className="career-button" type="submit" form="job-filters">Tìm công việc</button></div>
    <div className="career-list-layout"><aside className="career-filters" data-open={filtersOpen}><div className="career-filter-heading"><h2>Bộ lọc</h2>{active.length > 0 && <Link href="/jobs" onClick={() => setError("")}>Xóa bộ lọc</Link>}<button className="career-filter-toggle" onClick={() => setFiltersOpen(v => !v)} aria-expanded={filtersOpen} aria-controls="career-filter-body"><SlidersHorizontal size={17} />{filtersOpen ? "Thu gọn" : "Lọc tin"}</button></div>
      <form id="job-filters" key={params.toString()} className="career-filter-body" onSubmit={event => {
        event.preventDefault(); const data = new FormData(event.currentTarget); const min = String(data.get("salaryMin") || ""); const max = String(data.get("salaryMax") || "");
        if (min && max && Number(min) > Number(max)) { setError("Mức lương từ không được lớn hơn mức lương đến."); return; }
        const q = new URLSearchParams(); for (const key of ["query", "departmentId", "degreeId", "salaryMin", "salaryMax"]) { const v = String(data.get(key) || "").trim(); if (v) q.set(key, v); }
        setError(""); setFiltersOpen(false); router.push(`/jobs${q.size ? `?${q}` : ""}`, { scroll: false });
      }}>
        <label>Phòng ban<select name="departmentId" defaultValue={params.get("departmentId") || ""}><option value="">Tất cả phòng ban</option>{filters.data?.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <fieldset className="career-salary-filter"><legend>Mức lương / tháng</legend><label>Từ (VNĐ)<input name="salaryMin" type="number" min={0} max={2147483647} step={100000} defaultValue={params.get("salaryMin") || ""} placeholder="15000000" /></label><label>Đến (VNĐ)<input name="salaryMax" type="number" min={0} max={2147483647} step={100000} defaultValue={params.get("salaryMax") || ""} placeholder="30000000" /></label></fieldset>
        <label>Trình độ<select name="degreeId" defaultValue={params.get("degreeId") || ""}><option value="">Tất cả trình độ</option>{filters.data?.degrees.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <button className="career-button secondary" type="submit">Áp dụng bộ lọc</button>{error && <p className="career-error" role="alert">{error}</p>}{filters.error && <CareerErrorState message="Chưa tải được danh mục bộ lọc." retry={filters.reload} />}
      </form>
    </aside>
    <section className="career-results" aria-labelledby="career-results-title"><div className="career-results-heading"><h2 id="career-results-title">{jobs.data ? `${jobs.data.totalElements} vị trí đang tuyển` : "Vị trí đang tuyển"}</h2><span>Sắp xếp theo tên vị trí</span></div>
      {active.length > 0 && <div className="career-active-filters"><span>{active.length} điều kiện đang áp dụng</span><Link href="/jobs" aria-label="Xóa tất cả điều kiện lọc"><X size={14} />Xóa</Link></div>}
      {jobs.loading && <JobListSkeleton />}{jobs.error && <CareerErrorState message={jobs.error.message} retry={jobs.reload} />}
      {jobs.data && <><div className="career-job-list">{jobs.data.content.map(job => <article className="career-job-row" key={job.id}><div className="career-job-top"><div><p className="career-job-department">{job.department || "Chưa nêu phòng ban"}</p><h3><Link href={`/jobs/${job.id}`}>{job.title}</Link></h3></div><p className="career-job-salary">{salaryLabel(job)}</p></div><p className="career-job-excerpt">{job.description.length > 170 ? job.description.slice(0, 170) + "…" : job.description}</p><div className="career-job-bottom"><div><span>{job.degree || "Không yêu cầu trình độ cụ thể"}</span><span>Chỉ tiêu: {job.target} người</span></div><Link href={`/jobs/${job.id}`}>Xem chi tiết <ArrowRight size={16} /></Link></div></article>)}</div>
      {!jobs.data.content.length && <div className="career-empty"><h3>{jobs.data.totalElements ? "Trang này chưa có tin." : "Chưa có vị trí phù hợp."}</h3><p>{jobs.data.totalElements ? "Quay lại trang đầu để xem các vị trí hiện có." : "Bạn có thể thay đổi từ khóa hoặc mở rộng bộ lọc."}</p>{jobs.data.totalElements ? <button className="career-text-link" onClick={() => goPage(0)}>Về trang đầu</button> : <Link className="career-text-link" href="/jobs">Xem tất cả tin tuyển dụng</Link>}</div>}
      {jobs.data.totalElements > 12 && <nav className="career-pagination" aria-label="Phân trang tin tuyển dụng"><button disabled={page === 0} onClick={() => goPage(page - 1)}>Trang trước</button><span>Trang {page + 1} / {Math.ceil(jobs.data.totalElements / 12)}</span><button disabled={(page + 1) * 12 >= jobs.data.totalElements} onClick={() => goPage(page + 1)}>Trang sau</button></nav>}</>}
    </section></div></div>;
}
