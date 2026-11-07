"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Sprout } from "lucide-react";
import { useSession } from "@/components/auth/session-provider";
import { isStaff } from "@/lib/auth-routing";
import type { CareerJob } from "@/types/careers";

export function CareerBrand() {
  return <Link href="/jobs" className="career-brand" aria-label="RecruitHR — trang tuyển dụng"><Sprout size={25} /><span>Recruit<strong>HR</strong><small>Cổng tuyển dụng</small></span></Link>;
}
export function CareerHeader() {
  const { user, ready, logout } = useSession(); const router = useRouter(); const pathname = usePathname();
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const next = encodeURIComponent(pathname); const staff = isStaff(user);
  return <>
    <header className="career-header"><div className="career-header-inner"><CareerBrand /><nav aria-label="Điều hướng tuyển dụng"><Link href="/jobs" aria-current={pathname.startsWith("/jobs") ? "page" : undefined}>Tin tuyển dụng</Link>{ready && user && !staff && <Link href="/candidate/profile" aria-current={pathname === "/candidate/profile" ? "page" : undefined}>Hồ sơ của tôi</Link>}</nav>
      <div className="career-account">{!ready ? <span className="career-muted">Đang kiểm tra tài khoản…</span> : user ? <><span className="career-user">{user.displayName || user.username}</span>{staff && <Link className="career-text-link" href="/admin/dashboard">Vào admin <ArrowUpRight size={15} /></Link>}<button className="career-text-link" disabled={busy} onClick={async () => { setBusy(true); setError(""); try { await logout(); router.replace("/jobs"); } catch (e) { setError(e instanceof Error ? e.message : "Chưa đăng xuất được."); } finally { setBusy(false); } }}>Đăng xuất</button></> : <><Link href={`/register?next=${next}`} className="career-signup-link">Tạo hồ sơ</Link><Link href={`/login?next=${next}`} className="career-button small">Đăng nhập</Link></>}</div>
    </div></header>{error && <p className="career-error career-container" role="alert">{error}</p>}
  </>;
}
export function CandidateGate({ children }: { children: ReactNode }) {
  const { ready, user } = useSession(); const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login?next=%2Fcandidate%2Fprofile");
    else if (isStaff(user)) router.replace("/admin/dashboard");
  }, [ready, user, router]);
  return ready && user?.roles.includes("CANDIDATE") ? children : <div className="career-container career-loading" role="status">Đang mở hồ sơ…</div>;
}
export function salaryLabel(job: Pick<CareerJob, "salaryMin" | "salaryMax">) {
  const f = (n: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(n / 1000000);
  const { salaryMin: min, salaryMax: max } = job;
  if (min == null && max == null) return "Lương thỏa thuận";
  if (min != null && max != null) return `${f(min)}${min === max ? "" : `–${f(max)}`} triệu / tháng`;
  return min != null ? `Từ ${f(min)} triệu / tháng` : `Đến ${f(max!)} triệu / tháng`;
}
export function BackToJobs() { return <Link className="career-back" href="/jobs"><ArrowLeft size={16} />Tất cả tin tuyển dụng</Link>; }
export function CareerErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return <div className="career-error-block" role="alert"><p>{message}</p>{retry && <button type="button" className="career-text-link" onClick={retry}>Thử lại</button>}</div>;
}
export function JobListSkeleton() {
  return <div className="career-skeleton-list" role="status" aria-label="Đang tải tin tuyển dụng">{[1, 2, 3].map(i => <div className="career-skeleton-row" key={i}><span /><span /><span /></div>)}</div>;
}
