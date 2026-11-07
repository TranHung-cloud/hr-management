"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useSession } from "@/components/auth/session-provider";
import { careerRequest, useCareerQuery } from "@/hooks/use-career-query";
import { loginDestination, safeCandidateReturn } from "@/lib/auth-routing";
import type { CareerFilters } from "@/types/careers";

export default function RegisterPage() {
  const { user, ready, signIn } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const returnTo = safeCandidateReturn(next);
  const nextQuery = encodeURIComponent(returnTo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const filters = useCareerQuery<CareerFilters>("/api/careers/jobs/filters");

  useEffect(() => {
    if (ready && user) router.replace(loginDestination(user, next));
  }, [ready, user, router, next]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("accEmail") || "").trim();
    const password = String(data.get("accPassword") || "");
    setBusy(true);
    setError("");
    try {
      if (password !== data.get("confirmPassword")) throw new Error("Hai mật khẩu chưa khớp.");
      const cv = data.get("cv");
      if (!(cv instanceof File) || !cv.size || !cv.name.toLowerCase().endsWith(".pdf")) throw new Error("Vui lòng chọn CV PDF.");
      if (cv.size > 5 * 1024 * 1024) throw new Error("CV tối đa 5 MB.");
      data.set("accEmail", email);
      data.delete("confirmPassword");
      if (!data.get("dtId")) data.delete("dtId");
      await careerRequest("/api/register", { method: "POST", body: data });
      setCreated(true);
      const identity = await signIn(email, password);
      router.replace(loginDestination(identity, next));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa hoàn tất được yêu cầu. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <div className="auth-form-heading">
      <h2>Tạo hồ sơ ứng viên</h2>
      <p>Đã có tài khoản? <Link href={`/login?next=${nextQuery}`}>Đăng nhập</Link></p>
    </div>
    <form className="auth-form" onSubmit={handleSubmit}>
      <fieldset disabled={busy || created}>
        <legend className="sr-only">Thông tin đăng ký ứng viên</legend>
        <label>Họ và tên<input name="accName" autoComplete="name" required maxLength={255} placeholder="Nhập họ và tên" /></label>
        <label>Email<input name="accEmail" type="email" autoComplete="username" required maxLength={255} placeholder="ban@example.com" /></label>
        <div className="auth-field-pair">
          <label>Mật khẩu<input name="accPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={72} placeholder="Tối thiểu 8 ký tự" /></label>
          <label>Nhập lại mật khẩu<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={72} /></label>
        </div>
        <div className="auth-field-pair">
          <label>Ngày sinh<input name="accDob" type="date" autoComplete="bday" required /></label>
          <label>Giới tính<select name="accIsMale" required defaultValue=""><option value="" disabled>Chọn giới tính</option><option value="true">Nam</option><option value="false">Nữ</option></select></label>
        </div>
        <div className="auth-field-pair">
          <label>Số điện thoại<input name="accPhone" type="tel" autoComplete="tel" required maxLength={25} /></label>
          <label>Số năm kinh nghiệm<input name="candExpYear" type="number" min={0} max={80} defaultValue={0} required /></label>
        </div>
        <div className="auth-field-pair">
          <label>Chuyên ngành <span className="auth-optional">(tùy chọn)</span><input name="candMajor" maxLength={255} /></label>
          <label>Trình độ <span className="auth-optional">(tùy chọn)</span><select name="dtId" defaultValue=""><option value="">Chưa cung cấp</option>{filters.data?.degrees.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        </div>
        <label className="auth-cv">CV dùng chung<input name="cv" type="file" accept="application/pdf,.pdf" required aria-describedby="cv-help" /><span id="cv-help">File PDF, tối đa 5 MB. Có thể cập nhật sau trong hồ sơ.</span></label>
      </fieldset>
      {error && <p className="career-error" role="alert">{error}</p>}
      {created
        ? <p className="career-success" role="status">Tài khoản đã được tạo. Nếu chưa chuyển trang, <Link href={`/login?next=${nextQuery}`}>đăng nhập tại đây</Link>.</p>
        : <button className="career-button auth-submit" disabled={busy || !ready}>{busy ? "Đang tạo hồ sơ…" : "Tạo hồ sơ và tiếp tục"}</button>}
    </form>
  </>;
}
