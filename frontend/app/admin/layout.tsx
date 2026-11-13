"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { RecruitmentProvider, useRecruitment } from "@/components/recruitment/provider";
import { initials } from "@/lib/recruitment";
import { LayoutDashboard, UsersRound, BriefcaseBusiness, Workflow, CalendarDays, UserRound, ShieldCheck, ChevronDown, Menu, X, Sprout } from "lucide-react";
function AdminWorkspace({ children }: { children: React.ReactNode }) {
  const { displayName, canManage, logout } = useRecruitment(); const path = usePathname(); const [open, setOpen] = useState(false);
  const title = path === "/admin/dashboard" ? "Dashboard" : path === "/admin/interviews" ? "Quy trình phỏng vấn" : path === "/admin/interviews/schedule" ? "Lịch phỏng vấn" : "Chi tiết phỏng vấn";
  return <div className="app-shell">
    {open && <button className="nav-backdrop" aria-label="Đóng menu" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <Link href="/admin/dashboard" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><Sprout size={24} /></span><span>Recruit<span className="brand-hr">HR</span><small>Tuyển dụng & nhân sự</small></span></Link>
      <button className="mobile-close icon-button" aria-label="Đóng menu" onClick={() => setOpen(false)}><X size={20} /></button>
      <div className="nav-label">Không gian làm việc</div>
      <nav aria-label="Điều hướng chính">
        <Link className={`nav-item ${path === "/admin/dashboard" ? "active" : ""}`} href="/admin/dashboard" onClick={() => setOpen(false)}><LayoutDashboard />Dashboard</Link>
        <div className="nav-item unavailable" title="Chưa triển khai"><UsersRound />Quản lý ứng viên</div>
        <div className="nav-item unavailable" title="Chưa triển khai"><BriefcaseBusiness />Tin tuyển dụng</div>
        <Link className={`nav-item ${path === "/admin/interviews" ? "active" : ""}`} href="/admin/interviews" onClick={() => setOpen(false)}><Workflow />Quy trình phỏng vấn</Link>
        <Link className={`nav-item ${path.startsWith("/admin/interviews/") ? "active" : ""}`} href="/admin/interviews/schedule" onClick={() => setOpen(false)}><CalendarDays />Lịch & chi tiết phỏng vấn</Link>
        <div className="nav-item unavailable" title="Chưa triển khai"><UserRound />Hồ sơ cá nhân</div>
      </nav>
      <div className="nav-label admin-label">Quản trị</div><div className="nav-item unavailable"><ShieldCheck />Quản lý tài khoản</div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Mở menu" onClick={() => setOpen(true)}><Menu size={21} /></button><span className="breadcrumb-parent">Tuyển dụng</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div><div className="topbar-right"><span className="avatar tone-0 small">{initials(displayName)}</span><span className="topbar-name">{displayName}<small>{canManage ? "Nhân sự" : "Người phỏng vấn"}</small></span><ChevronDown size={14} /><button className="text-link" onClick={() => void logout()}>Đăng xuất</button></div></header><main className="main-content">{children}</main></div>
  </div>;
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="loading-screen" role="status">Đang mở không gian tuyển dụng…</div>}>
    <RecruitmentProvider><AdminWorkspace>{children}</AdminWorkspace></RecruitmentProvider>
  </Suspense>;
}
