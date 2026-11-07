"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Download, FileText, Upload } from "lucide-react";
import { safeCandidateReturn } from "@/lib/auth-routing";
import { careerRequest, useCareerQuery } from "@/hooks/use-career-query";
import { CareerErrorState } from "@/components/careers/shared";
import type { CandidateProfile } from "@/types/careers";

export default function ProfilePage() {
  const params = useSearchParams(); const next = safeCandidateReturn(params.get("next"));
  const profile = useCareerQuery<CandidateProfile>("/api/candidate/profile"); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [saved, setSaved] = useState(false);
  return <div className="career-container career-profile"><div className="career-page-intro"><p className="career-context">Tài khoản ứng viên</p><h1>Hồ sơ của tôi</h1><p>Thông tin và CV dùng chung khi bạn ứng tuyển.</p></div>
    {profile.loading && <p className="career-loading" role="status">Đang tải hồ sơ…</p>}{profile.error && <CareerErrorState message={profile.error.message} retry={profile.reload} />}
    {profile.data && <div className="career-profile-layout"><section className="career-block"><h2>Thông tin hồ sơ</h2><h3 className="career-profile-name">{profile.data.name}</h3><dl className="career-facts"><div><dt>Email</dt><dd>{profile.data.email}</dd></div><div><dt>Số điện thoại</dt><dd>{profile.data.phone || "Chưa cung cấp"}</dd></div><div><dt>Kinh nghiệm</dt><dd>{profile.data.experienceYears == null ? "Chưa cung cấp" : `${profile.data.experienceYears} năm`}</dd></div><div><dt>Chuyên ngành</dt><dd>{profile.data.major || "Chưa cung cấp"}</dd></div><div><dt>Trình độ</dt><dd>{profile.data.degree || "Chưa cung cấp"}</dd></div></dl></section>
      <section className="career-block career-cv-panel"><h2>CV dùng chung</h2><div className="career-current-cv"><FileText size={29} /><span><strong>{profile.data.hasCv ? profile.data.cvName : "Chưa có CV đã tải lên"}</strong><small>{profile.data.hasCv ? "Sẵn sàng dùng để ứng tuyển" : "Tải PDF để hoàn thiện hồ sơ ứng tuyển"}</small></span>{profile.data.hasCv && <a download="CV.pdf" href="/api/candidate/profile/cv" className="career-text-link"><Download size={16} />Tải CV</a>}</div>
      <form onSubmit={async event => {
        event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setError(""); setSaved(false);
        const file = data.get("cv"); if (!(file instanceof File) || !file.size || !file.name.toLowerCase().endsWith(".pdf")) { setError("Vui lòng chọn CV PDF."); return; }
        if (file.size > 5 * 1024 * 1024) { setError("CV tối đa 5 MB."); return; }
        setBusy(true);
        try { await careerRequest("/api/candidate/profile/cv", { method: "PUT", body: data }); setSaved(true); form.reset(); profile.reload(); }
        catch (e) { setError(e instanceof Error ? e.message : "Chưa lưu được CV."); } finally { setBusy(false); }
      }}><label>{profile.data.hasCv ? "Thay CV mới" : "Tải CV lên"}<input type="file" name="cv" accept="application/pdf,.pdf" required /></label><p className="career-muted">File PDF, tối đa 5 MB.</p><p className="career-cv-warning">CV được dùng chung cho các lần ứng tuyển. Khi thay CV, hồ sơ đã nộp cũng hiển thị CV mới.</p>{error && <p className="career-error" role="alert">{error}</p>}{saved && <p className="career-success" role="status">Đã cập nhật CV chung.</p>}<button className="career-button" disabled={busy}><Upload size={16} />{busy ? "Đang lưu CV…" : "Lưu CV"}</button></form></section>
    </div>}
    <Link href={next} className="career-text-link career-profile-back">{next.startsWith("/jobs/") ? "Quay lại tin tuyển dụng" : "Khám phá vị trí đang tuyển"}<ArrowRight size={16} /></Link>
  </div>;
}
