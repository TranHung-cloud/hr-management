"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, UsersRound, BriefcaseBusiness, Workflow, CalendarDays, UserRound, ShieldCheck, ChevronDown, Menu, X, ArrowUpRight, Sprout } from "lucide-react";
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  const title = path === "/" ? "Dashboard" : path === "/interviews" ? "Quy trình phỏng vấn" : path === "/interviews/schedule" ? "Lịch phỏng vấn" : "Chi tiết phỏng vấn";
  return <div className="app-shell">
    {open && <button className="nav-backdrop" aria-label="Đóng menu" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <Link href="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><Sprout size={24} /></span><span>Recruit<span className="brand-hr">HR</span><small>Tuyển dụng & nhân sự</small></span></Link>
      <button className="mobile-close icon-button" aria-label="Đóng menu" onClick={() => setOpen(false)}><X size={20} /></button>
      <div className="nav-label">Không gian làm việc</div>
      <nav aria-label="Điều hướng chính">
        <Link className={`nav-item ${path === "/" ? "active" : ""}`} href="/" onClick={() => setOpen(false)}><LayoutDashboard />Dashboard</Link>
        <div className="nav-item unavailable" title="Chưa triển khai"><UsersRound />Quản lý ứng viên<span className="soon">Sau</span></div>
        <div className="nav-item unavailable" title="Chưa triển khai"><BriefcaseBusiness />Tin tuyển dụng<span className="soon">Sau</span></div>
        <Link className={`nav-item ${path === "/interviews" ? "active" : ""}`} href="/interviews" onClick={() => setOpen(false)}><Workflow />Quy trình phỏng vấn</Link>
        <Link className={`nav-item ${path.startsWith("/interviews/") ? "active" : ""}`} href="/interviews/schedule" onClick={() => setOpen(false)}><CalendarDays />Lịch & chi tiết phỏng vấn</Link>
        <div className="nav-item unavailable" title="Chưa triển khai"><UserRound />Hồ sơ cá nhân<span className="soon">Sau</span></div>
      </nav>
      <div className="nav-label admin-label">Quản trị</div><div className="nav-item unavailable"><ShieldCheck />Quản lý tài khoản<span className="soon">Sau</span></div>
      <div className="sidebar-bottom"><div className="demo-card"><span className="tiny-dot" />Bản thiết kế giao diện<p>Dữ liệu minh họa · 02/11/2026<br />Thay đổi chỉ lưu trong phiên xem.</p><span className="demo-caption">Dành cho đội ngũ nhân sự <ArrowUpRight size={13} /></span></div><div className="account"><span className="avatar tone-0">MT</span><span><strong>Nguyễn Minh Tuấn</strong><small>Lead HR</small></span><span className="online-dot" /></div></div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Mở menu" onClick={() => setOpen(true)}><Menu size={21} /></button><span className="breadcrumb-parent">Tuyển dụng</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div><div className="topbar-right"><span className="workspace-label"><span className="tiny-dot" />Không gian HR</span><span className="topbar-divider" /><span className="avatar tone-0 small">MT</span><span className="topbar-name">Minh Tuấn<small>Lead HR</small></span><ChevronDown size={14} /></div></header><main className="main-content">{children}</main><footer className="app-footer"><span>RecruitHR · Cùng xây dựng đội ngũ tốt hơn</span><span>Bản xem trước giao diện</span></footer></div>
  </div>;
}
