"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface Identity { accountId: string; username: string; displayName: string | null; roles: string[] }
const RecruitmentContext = createContext<{ revision: number; refresh: () => void; notify: (text: string) => void; username: string; displayName: string; accountId: string; canManage: boolean; logout: () => Promise<void> } | null>(null);
export function RecruitmentProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Identity | null | undefined>(undefined);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/session", { cache: "no-store" }).then(async r => r.ok ? r.json() : null).then(user => { if (active) setUser(user?.username ? user : null); }).catch(() => { if (active) setUser(null); });
    const unauthorized = () => setUser(null);
    window.addEventListener("recruitment:unauthorized", unauthorized);
    return () => { active = false; window.removeEventListener("recruitment:unauthorized", unauthorized); };
  }, []);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(""), 4500); return () => clearTimeout(timer); }, [message]);
  async function logout() {
    const response = await fetch("/api/session", { method: "DELETE" });
    if (!response.ok) { setMessage("Không đăng xuất được. Vui lòng thử lại."); return; }
    setUser(null); setMessage("");
  }
  if (user === undefined) return <div className="loading-screen" role="status">Đang kiểm tra phiên đăng nhập…</div>;
  if (!user) return <Login onLogin={setUser} />;
  if (user.roles.includes("CANDIDATE")) return <div className="login-screen"><section className="panel login-form"><h1>Xin chào {user.displayName || user.username}</h1><p>Bạn đã đăng nhập bằng tài khoản ứng viên.</p><p className="muted">Trang quản lý tuyển dụng dành cho nhân sự nội bộ. Cổng nộp hồ sơ ứng viên chưa được triển khai.</p><button className="button secondary" onClick={() => void logout()}>Đăng xuất</button></section></div>;
  return <RecruitmentContext.Provider value={{ revision, refresh: () => setRevision(n => n + 1), notify: setMessage, username: user.username, displayName: user.displayName || user.username, accountId: user.accountId, canManage: user.roles.includes("HR_MANAGER"), logout }}>{children}{message && <div className="toast" role="status"><span>{message}</span><button aria-label="Đóng thông báo" onClick={() => setMessage("")}>×</button></div>}</RecruitmentContext.Provider>;
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
