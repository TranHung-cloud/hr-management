import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
}

export function JobToast({ show, onClose }: Props) {
  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-white border border-slate-200 shadow-xl rounded-xl p-3 flex items-start gap-3 max-w-sm text-xs z-50 animate-in fade-in slide-in-from-bottom-3">
      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-slate-800">
          Đã đồng bộ thành công với Database
        </p>
        <p className="text-slate-500 text-[11px] mt-0.5">
          Dữ liệu hiển thị được tính toán từ các bảng `job_description`, `application` và `account`.
        </p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}