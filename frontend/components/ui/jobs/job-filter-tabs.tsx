import React from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  counts?: {
    all: number;
    published: number;
    draft: number;
  };
}

export function JobFilterTabs({
  activeTab = "ALL",
  onTabChange,
  counts = { all: 6, published: 5, draft: 1 },
}: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTabChange?.("ALL")}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm transition ${
            activeTab === "ALL"
              ? "bg-[#2d493f] text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Tất cả{" "}
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              activeTab === "ALL" ? "bg-emerald-900/60 text-white" : "text-slate-400"
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => onTabChange?.("PUBLISHED")}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm transition ${
            activeTab === "PUBLISHED"
              ? "bg-[#2d493f] text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Đang tuyển (PUBLISHED){" "}
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              activeTab === "PUBLISHED" ? "bg-emerald-900/60 text-white" : "text-slate-400"
            }`}
          >
            {counts.published}
          </span>
        </button>

        <button
          onClick={() => onTabChange?.("DRAFT")}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm transition ${
            activeTab === "DRAFT"
              ? "bg-[#2d493f] text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Bản nháp (DRAFT){" "}
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              activeTab === "DRAFT" ? "bg-emerald-900/60 text-white" : "text-slate-400"
            }`}
          >
            {counts.draft}
          </span>
        </button>
      </div>

      <div className="text-xs text-slate-400 flex items-center gap-1">
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Kết nối trực tiếp PostgreSQL DB</span>
      </div>
    </div>
  );
}