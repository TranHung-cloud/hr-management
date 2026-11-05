import React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Award,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
  ChevronDown,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#233831] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Logo & Header Workspace */}
        <div className="p-4 flex items-center gap-3 border-b border-emerald-800/40">
          <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center font-bold text-lg text-white">
            R
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">RecruitHR</h1>
            <p className="text-xs text-emerald-200/70">Quản lý Nhân sự & Tuyển dụng</p>
          </div>
        </div>

        {/* Nút Tạo tin tuyển dụng */}
        <div className="p-4">
          <button className="w-full bg-[#2d493f] hover:bg-[#37584c] text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition text-sm shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Tạo tin tuyển dụng</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-2 space-y-1 text-sm">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-100/80 hover:bg-emerald-800/30 transition">
            <LayoutDashboard className="w-4 h-4" /> Tổng quan
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-100/80 hover:bg-emerald-800/30 transition">
            <Users className="w-4 h-4" /> Quản lý ứng viên
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2d493f] text-white font-medium transition">
            <Briefcase className="w-4 h-4" /> Quản lý tin tuyển dụng
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-100/80 hover:bg-emerald-800/30 transition">
            <Calendar className="w-4 h-4" /> Quy trình phỏng vấn
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-100/80 hover:bg-emerald-800/30 transition">
            <Award className="w-4 h-4" /> Đánh giá & Tuyển chọn
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-100/80 hover:bg-emerald-800/30 transition">
            <BarChart3 className="w-4 h-4" /> Báo cáo chiến dịch
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-100/80 hover:bg-emerald-800/30 transition">
            <Settings className="w-4 h-4" /> Cài đặt hệ thống
          </a>
        </nav>
      </div>

      {/* Footer Profile từ Trưởng phòng nhân sự trong DB */}
      <div className="p-3 border-t border-emerald-800/40 text-xs">
        <a href="#" className="flex items-center gap-2 text-emerald-200/70 hover:text-white mb-4 px-2">
          <HelpCircle className="w-4 h-4" /> Hỗ trợ hệ thống
        </a>
        <div className="flex items-center justify-between bg-[#1b2b26] p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center font-bold text-white text-xs">
              NTL
            </div>
            <div>
              <p className="font-semibold text-white">Nguyễn Thị Lan</p>
              <p className="text-[10px] text-emerald-200/60">Trưởng phòng NS</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-emerald-200/60" />
        </div>
      </div>
    </aside>
  );
}