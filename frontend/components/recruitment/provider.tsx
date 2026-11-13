"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session-provider";
import { isStaff } from "@/lib/auth-routing";
import { Identity } from "@/types/careers";

const RecruitmentContext = createContext<{ revision: number; refresh: () => void; notify: (text: string) => void; username: string; displayName: string; accountId: string; canManage: boolean; logout: () => Promise<void> } | null>(null);
export function RecruitmentProvider({ children }: { children: ReactNode }) {
  const { user, ready, logout } = useSession();
  const router = useRouter(); const pathname = usePathname();
  const [revision, setRevision] = useState(0); const [message, setMessage] = useState("");
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (!isStaff(user)) router.replace("/jobs");
  }, [ready, user, router, pathname]);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(""), 4500); return () => clearTimeout(timer); }, [message]);
  async function signOut() {
    try { await logout(); router.replace("/jobs"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Chưa đăng xuất được."); }
  }
  if (!ready || !user || !isStaff(user)) return <div className="loading-screen" role="status">Đang mở khu vực quản trị…</div>;
  return <RecruitmentContext.Provider value={{ revision, refresh: () => setRevision(n => n + 1), notify: setMessage,
    username: user.username, displayName: user.displayName || user.username, accountId: user.accountId,
    canManage: user.roles.some(role => role === "HR_MANAGER" || role === "RECRUITER"), logout: signOut }}>
    {children}{message && <div className="toast" role="status"><span>{message}</span><button aria-label="Đóng thông báo" onClick={() => setMessage("")}>×</button></div>}
  </RecruitmentContext.Provider>;
  
}
function Login({ onLogin }: { onLogin: (user: Identity) => void }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  return <div className="login-screen"><form className="panel login-form" onSubmit={async event => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setBusy(true); setError("");
    try {
      const response = await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: data.get("username"), password: data.get("password") }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.detail || "Đăng nhập thất bại.");
      form.reset(); onLogin(result);
    } catch (error) { setError(error instanceof Error ? error.message : "Không kết nối được server."); } finally { setBusy(false); }
  }}><div className="eyebrow">RecruitHR · Không gian nhân sự</div><h1>Đăng nhập RecruitHR</h1><p className="muted">Dùng email và mật khẩu tài khoản của bạn.</p><label>Email<input name="username" type="email" autoComplete="username" required maxLength={255} /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required maxLength={1024} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary" disabled={busy}>{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button></form></div>;
}
export function useRecruitment() { const value = useContext(RecruitmentContext); if (!value) throw new Error("RecruitmentProvider is required"); return value; }
