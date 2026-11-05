import React from "react";
import { Search, Filter, Plus } from "lucide-react";

export function JobFilterBar() {
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap flex-1">
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm vị trí tuyển dụng (jd_title)..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-600"
          />
        </div>

        {/* Lọc theo Phòng ban trong DB setup-sample_2.sql */}
        <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none">
          <option value="">Tất cả phòng ban</option>
          <option value="Công nghệ thông tin">Công nghệ thông tin</option>
          <option value="Kế toán">Kế toán</option>
          <option value="Tiếp thị">Tiếp thị</option>
          <option value="Chăm sóc khách hàng">Chăm sóc khách hàng</option>
        </select>

        {/* Lọc theo Người phụ trách/Recruiter trong DB */}
        <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none">
          <option value="">Tất cả người phụ trách</option>
          <option value="Trần Minh Quân">Trần Minh Quân</option>
          <option value="Lê Thu Hà">Lê Thu Hà</option>
        </select>

        <button className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <button className="bg-[#2d493f] hover:bg-[#233831] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-sm">
        <Plus className="w-4 h-4" />
        <span>Thêm Job Description</span>
      </button>
    </div>
  );
}