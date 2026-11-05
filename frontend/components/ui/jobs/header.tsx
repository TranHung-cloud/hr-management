import React from "react";
import { Bell, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Hệ thống HR</span>
        <span>&gt;</span>
        <span className="font-medium text-slate-800">Bảng tin tuyển dụng (Job Description)</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center text-xs font-bold">
            TMQ
          </div>
          <span className="text-xs font-semibold text-slate-700">Trần Minh Quân (Recruiter)</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}