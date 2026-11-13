"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecruitment } from "./provider";
import { initials } from "@/lib/recruitment";
import { UserMenu } from "@/components/user-menu";
import { LayoutDashboard, UsersRound, BriefcaseBusiness, Workflow, CalendarDays, UserRound, ShieldCheck, ChevronDown, Menu, X, ArrowUpRight, Sprout } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import type { AdminAccountDetail } from "@/types/account";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { displayName, canManage, logout } = useRecruitment(); const path = usePathname(); const [open, setOpen] = useState(false);
  const title = path === "/admin/dashboard" ? "Dashboard" : path === "/admin/interviews" ? "Quy trình phỏng vấn" : path === "/admin/interviews/schedule" ? "Lịch phỏng vấn" : path === "/admin/accounts" ? "Quản lý tài khoản" : "Chi tiết phỏng vấn";
  const { data: accountDetail } = useApi<AdminAccountDetail>("accounts");

  return <div className="app-shell">
    {open && <button className="nav-backdrop" aria-label="Đóng menu" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <Link href="/admin/dashboard" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><Sprout size={24} /></span><span>Recruit<span className="brand-hr">HR</span><small>Tuyển dụng & nhân sự</small></span></Link>
      <button className="mobile-close icon-button" aria-label="Đóng menu" onClick={() => setOpen(false)}><X size={20} /></button>
      <div className="nav-label">Không gian làm việc</div>
      <nav aria-label="Điều hướng chính">
        <Link className={`nav-item ${path === "/admin/dashboard" ? "active" : ""}`} href="/admin/dashboard" onClick={() => setOpen(false)}><LayoutDashboard />Dashboard</Link>
        <div className="nav-item unavailable" title="Chưa triển khai"><UsersRound />Quản lý ứng viên</div>
        <Link className={`nav-item ${path.startsWith("/admin/jobs") ? "active" : ""}`} href="/admin/jobs" onClick={() => setOpen(false)}><BriefcaseBusiness />Tin tuyển dụng</Link>
        <Link className={`nav-item ${path === "/admin/interviews" ? "active" : ""}`} href="/admin/interviews" onClick={() => setOpen(false)}><Workflow />Quy trình phỏng vấn</Link>
        <Link className={`nav-item ${path.startsWith("/admin/interviews/") ? "active" : ""}`} href="/admin/interviews/schedule" onClick={() => setOpen(false)}><CalendarDays />Lịch & chi tiết phỏng vấn</Link>
        <div className="nav-item unavailable" title="Chưa triển khai"><UserRound />Hồ sơ cá nhân</div>
      </nav>
      <div className="nav-label admin-label">Quản trị</div><Link className={`nav-item ${path === "/admin/accounts" ? "active" : ""}`} href="/admin/accounts" onClick={() => setOpen(false)}><ShieldCheck />Quản lý tài khoản</Link>
    </aside>
    <div className="workspace"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Mở menu" onClick={() => setOpen(true)}><Menu size={21} /></button><span className="breadcrumb-parent">Tuyển dụng</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div><div className="topbar-right"><span className="workspace-label"><span className="tiny-dot" />Không gian HR</span><span className="topbar-divider" /><UserMenu
  userName={accountDetail?.accName || displayName}
  userRole={accountDetail?.roleName || (canManage ? "Trưởng phòng nhân sự" : "Nhân sự")}
/></div></header><main className="main-content">{children}</main><footer className="app-footer"></footer></div>
    
  </div>;
}
