"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useSession } from "@/components/auth/session-provider";
import { loginDestination, safeCandidateReturn } from "@/lib/auth-routing";

export default function LoginPage() {
  const { user, ready, signIn } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const returnTo = safeCandidateReturn(next);
  const nextQuery = encodeURIComponent(returnTo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) router.replace(loginDestination(user, next));
  }, [ready, user, router, next]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    setBusy(true);
    setError("");
    try {
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
      <h2>Đăng nhập</h2>
    </div>
    <form className="auth-form" onSubmit={handleSubmit}>
      <fieldset disabled={busy}>
        <legend className="sr-only">Thông tin đăng nhập</legend>
        <label>Email<input name="email" type="email" autoComplete="username" required maxLength={255} placeholder="ban@example.com" /></label>
        <div><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required maxLength={72} placeholder="Nhập mật khẩu" /></label></div>
      </fieldset>
      {error && <p className="career-error" role="alert">{error}</p>}
      <button className="career-button auth-submit" disabled={busy || !ready}>{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button>
    </form>
    <p className="auth-form-footer">Chưa có tài khoản? <Link href={`/register?next=${nextQuery}`}>Tạo hồ sơ ứng viên</Link></p>
  </>;
}
