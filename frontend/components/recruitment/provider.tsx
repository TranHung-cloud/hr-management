"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session-provider";
import { isStaff } from "@/lib/auth-routing";

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
export function useRecruitment() { const value = useContext(RecruitmentContext); if (!value) throw new Error("RecruitmentProvider is required"); return value; }
