import React from "react";
import { Lock, Trash2 } from "lucide-react";

interface Props {
  selectedCount: number;
}

export function JobSelectedBar({ selectedCount }: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[#fcf8f2] border border-amber-200/60 p-2.5 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700">
          Đã chọn {selectedCount} vị trí công việc
        </span>
        <span className="text-slate-400 text-[11px]">
          (Thao tác đồng loạt trên danh sách `job_description`)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-md font-medium flex items-center gap-1 hover:bg-slate-50">
          <Lock className="w-3.5 h-3.5 text-slate-500" /> Chuyển sang DRAFT
        </button>
        <button className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md font-medium flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Xóa bản ghi
        </button>
      </div>
    </div>
  );
}