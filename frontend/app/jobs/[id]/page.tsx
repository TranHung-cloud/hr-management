"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, FileText } from "lucide-react";
import { useSession } from "@/components/auth/session-provider";
import { careerRequest, useCareerQuery } from "@/hooks/use-career-query";
import { isStaff } from "@/lib/auth-routing";
import { BackToJobs, CareerErrorState, salaryLabel } from "@/components/careers/shared";
import type { ApplicationReceipt, ApplicationState, CandidateProfile, CareerJob } from "@/types/careers";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>(); const { user, ready } = useSession(); const router = useRouter();
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const job = useCareerQuery<CareerJob>(valid ? `/api/careers/jobs/${id}` : null);
  const candidate = !!user?.roles.includes("CANDIDATE");
  const profile = useCareerQuery<CandidateProfile>(candidate ? "/api/candidate/profile" : null);
  const applied = useCareerQuery<ApplicationState>(candidate && valid ? `/api/candidate/jobs/${id}/application` : null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const existing = receipt || applied.data?.application;
  const next = encodeURIComponent(`/jobs/${id}`);
  return <div className="career-container career-detail"><BackToJobs />
    {!valid ? <CareerErrorState message="Đường dẫn tin tuyển dụng không hợp lệ." /> : job.loading ? <div className="career-detail-loading" role="status">Đang tải chi tiết vị trí…</div> : job.error ? <CareerErrorState message={job.error.status === 404 ? "Tin tuyển dụng không còn được đăng hoặc không tồn tại." : job.error.message} retry={job.error.status === 404 ? undefined : job.reload} /> : job.data && <>
      <div className="career-detail-heading"><p className="career-context">{job.data.department || "Tuyển dụng"}</p><h1>{job.data.title}</h1><p>{job.data.major || "Xem yêu cầu vị trí và thông tin ứng tuyển bên dưới."}</p></div>
      <div className="career-detail-layout"><div className="career-detail-body"><section className="career-block"><h2>Mô tả công việc</h2><p className="career-description">{job.data.description}</p></section>
        <section className="career-block"><h2>Thông tin vị trí</h2><dl className="career-facts"><div><dt>Phòng ban</dt><dd>{job.data.department || "Chưa cung cấp"}</dd></div><div><dt>Trình độ</dt><dd>{job.data.degree || "Không yêu cầu cụ thể"}</dd></div><div><dt>Chuyên ngành</dt><dd>{job.data.major || "Không yêu cầu cụ thể"}</dd></div><div><dt>Chỉ tiêu tuyển dụng</dt><dd>{job.data.target} người</dd></div></dl></section>
        <section className="career-block"><h2>Kỹ năng liên quan</h2>{job.data.skills.length ? <ul className="career-skills">{job.data.skills.map(skill => <li key={skill}>{skill}</li>)}</ul> : <p className="career-muted">Tin tuyển dụng chưa liệt kê kỹ năng cụ thể.</p>}</section>
      </div><aside className="career-apply-panel"><section className="career-apply-card"><p className="career-muted">Mức lương / tháng</p><h2>{salaryLabel(job.data)}</h2><div className="career-apply-divider" />
        {!ready ? <p role="status">Đang kiểm tra tài khoản…</p> : !user ? <><h3>Bạn quan tâm vị trí này?</h3><p>Đăng nhập để gửi hồ sơ và CV của bạn đến đội ngũ tuyển dụng.</p><Link className="career-button" href={`/login?next=${next}`}>Đăng nhập để ứng tuyển <ArrowRight size={16} /></Link><p className="career-apply-small">Chưa có tài khoản? <Link href={`/register?next=${next}`}>Tạo hồ sơ ứng viên</Link></p></> : isStaff(user) ? <><p>Bạn đang dùng tài khoản nhân sự hoặc người phỏng vấn.</p><Link className="career-button" href="/admin/dashboard">Vào khu vực admin</Link></> : existing ? <div className="career-applied" role="status"><Check size={21} /><h3>Đã gửi hồ sơ ứng tuyển</h3><p>Hồ sơ được ghi nhận ngày {new Date(existing.createdAt).toLocaleDateString("vi-VN")}.</p><Link className="career-text-link" href="/candidate/profile">Xem hồ sơ và CV chung</Link></div> : profile.loading || applied.loading ? <p role="status">Đang kiểm tra hồ sơ ứng viên…</p> : profile.error || applied.error ? <CareerErrorState message={(profile.error || applied.error)!.message} retry={() => { profile.reload(); applied.reload(); }} /> : !profile.data?.hasCv ? <><FileText size={24} /><h3>Hoàn thiện CV trước khi ứng tuyển</h3><p>Tải CV PDF lên hồ sơ của bạn. CV này sẽ được dùng chung cho các lần ứng tuyển.</p><Link className="career-button" href={`/candidate/profile?next=${next}`}>Cập nhật CV</Link></> : <form onSubmit={async event => {
          event.preventDefault(); const data = new FormData(event.currentTarget); setBusy(true); setError("");
          try {
            const salary = String(data.get("expectedSalary") || "");
            const result = await careerRequest<ApplicationReceipt>(`/api/candidate/jobs/${id}/applications`, { method: "POST", body: JSON.stringify({ expectedSalary: salary ? Number(salary) : null }) });
            setReceipt(result); applied.reload();
          } catch (e) { setError(e instanceof Error ? e.message : "Chưa gửi được hồ sơ."); applied.reload(); } finally { setBusy(false); }
        }}><div className="career-cv-summary"><FileText size={19} /><span>CV trong hồ sơ<strong>{profile.data.name}</strong></span><Link href={`/candidate/profile?next=${next}`}>Kiểm tra</Link></div><label>Mức lương mong muốn <span className="auth-optional">(tùy chọn)</span><input name="expectedSalary" type="number" min={0} max={2147483647} step={100000} placeholder="VNĐ / tháng" /></label><p className="career-apply-small">Hệ thống gửi thông tin và CV chung trong hồ sơ của bạn.</p>{error && <p className="career-error" role="alert">{error}</p>}<button className="career-button" disabled={busy}>{busy ? "Đang gửi hồ sơ…" : "Xác nhận ứng tuyển"}<ArrowRight size={16} /></button></form>}
      </section><button className="career-text-link career-mobile-back" onClick={() => router.push("/jobs")}>Xem vị trí khác</button></aside></div>
    </>}
  </div>;
}
