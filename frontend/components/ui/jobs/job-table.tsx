import React from "react";
import { AlertTriangle } from "lucide-react";
import { JobItem } from "@/types/jobs";

interface Props {
  jobs: JobItem[];
  onToggleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSelectOne: (id: string) => void;
}

export function JobTable({ jobs, onToggleSelectAll, onToggleSelectOne }: Props) {
  const selectedCount = jobs.filter((j) => j.checked).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 bg-slate-50/50">
            <th className="py-3 px-4 w-10 text-center">
              <input
                type="checkbox"
                checked={jobs.length > 0 && selectedCount === jobs.length}
                onChange={onToggleSelectAll}
                className="rounded border-slate-300 accent-emerald-700"
              />
            </th>
            <th className="py-3 px-2">Vị trí tuyển dụng (jd_title)</th>
            <th className="py-3 px-2">Phòng ban</th>
            <th className="py-3 px-2">Trạng thái (jd_status)</th>
            <th className="py-3 px-2">Mức lương (Min - Max)</th>
            <th className="py-3 px-2">Tuyển / Chỉ tiêu (jd_target)</th>
            <th className="py-3 px-2 text-center">Đơn ứng tuyển</th>
            <th className="py-3 px-2">Hạn nộp</th>
            <th className="py-3 px-2">Người phụ trách (recruiter)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {jobs.map((job) => (
            <tr
              key={job.id}
              className={`hover:bg-slate-50/80 transition ${
                job.checked ? "bg-amber-50/20" : ""
              }`}
            >
              <td className="py-3.5 px-4 text-center">
                <input
                  type="checkbox"
                  checked={!!job.checked}
                  onChange={() => onToggleSelectOne(job.id)}
                  className="rounded border-slate-300 accent-emerald-700"
                />
              </td>
              <td className="py-3.5 px-2">
                <p className="font-semibold text-slate-800 hover:text-emerald-700 cursor-pointer">
                  {job.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{job.code}</p>
              </td>
              <td className="py-3.5 px-2 text-slate-600 max-w-[120px] leading-tight">
                {job.department}
              </td>
              <td className="py-3.5 px-2">
                {job.status === "PUBLISHED" ? (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold">
                    PUBLISHED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-semibold">
                    DRAFT
                  </span>
                )}
              </td>
              <td className="py-3.5 px-2 text-slate-700 font-medium whitespace-nowrap">
                {job.salary}
              </td>
              <td className="py-3.5 px-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 min-w-[24px]">
                    {job.target}
                  </span>
                  <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        job.progress === 100 ? "bg-emerald-500" : "bg-teal-700"
                      }`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 min-w-[24px]">
                    {job.progress}%
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-2 text-center">
                <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-md font-bold text-xs">
                  {job.candidates}{" "}
                  <span className="font-normal text-[9px] text-amber-800">
                    hồ sơ
                  </span>
                </span>
              </td>
              <td className="py-3.5 px-2 whitespace-nowrap">
                {job.isWarning ? (
                  <div className="flex items-center gap-1 text-red-600 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{job.deadline}</span>
                  </div>
                ) : (
                  <span className="text-slate-600">{job.deadline}</span>
                )}
              </td>
              <td className="py-3.5 px-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {job.avatar}
                  </div>
                  <span className="text-slate-700 truncate max-w-[100px]">
                    {job.assignee}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}