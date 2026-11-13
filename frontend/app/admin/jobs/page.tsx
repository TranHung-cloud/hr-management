"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Lock,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useJobs, useJobLookups } from "@/hooks/use-jobs";
import type { JobDetail, JobStatus } from "@/types/job";
import { Badge } from "@/components/badge";
import { Pagination } from "@/components/pagination";
import { JobModal } from "@/components/job-modal";

export default function JobsPage() {
  const { data: lookups } = useJobLookups();

  // Filters state
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
  const [depFilter, setDepFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 8;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("create");
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);

  // Toast alert
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const {
    data,
    loading,
    error,
    reload,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    createJob,
    updateJob,
    closeJobs,
    deleteJob,
    getJobDetail,
  } = useJobs({
    keyword,
    status: statusFilter,
    depId: depFilter,
    page,
    size: pageSize,
  });

  const jobs = data?.content || [];

  const allVisibleIds = useMemo(() => jobs.map((j) => j.jdId), [jobs]);
  const isAllSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));

  // Format salary range (e.g., "35 – 45 triệu")
  const formatSalary = (min: number | null, max: number | null) => {
    if (min == null && max == null) return "Thỏa thuận";
    const toMillion = (val: number) => Math.round(val / 1_000_000);
    if (min != null && max != null) {
      return `${toMillion(min)} – ${toMillion(max)} triệu`;
    }
    if (min != null) return `Từ ${toMillion(min)} triệu`;
    return `Đến ${toMillion(max!)} triệu`;
  };

  // Status Badge Styling matching screenshot
  const getStatusBadge = (status: JobStatus) => {
    if (status === "PUBLISHED") {
      return (
        <Badge
          bgColor="#f0fdf4"
          color="#16a34a"
          className="border border-[#bbf7d0]"
        >
          Đang tuyển
        </Badge>
      );
    }
    if (status === "CLOSED") {
      return (
        <Badge bgColor="#fee2e2" color="#b91c1c">
          Đã dừng
        </Badge>
      );
    }
    return (
      <Badge bgColor="#f3e5d0" color="#8c5a2b">
        Bản nháp
      </Badge>
    );
  };

  // Row Actions
  const handleOpenView = async (jdId: string) => {
    try {
      const detail = await getJobDetail(jdId);
      setSelectedJob(detail);
      setModalMode("view");
      setModalOpen(true);
    } catch (err: unknown) {
      showToast((err as Error).message || "Không thể tải chi tiết tin tuyển dụng.");
    }
  };

  const handleOpenEdit = async (jdId: string) => {
    try {
      const detail = await getJobDetail(jdId);
      setSelectedJob(detail);
      setModalMode("edit");
      setModalOpen(true);
    } catch (err: unknown) {
      showToast((err as Error).message || "Không thể tải thông tin tin tuyển dụng.");
    }
  };

  const handleOpenCreate = () => {
    setSelectedJob(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleCloseSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Bạn có chắc muốn đóng ${selectedIds.length} tin tuyển dụng đã chọn?`)) {
      return;
    }
    try {
      await closeJobs(selectedIds);
      showToast(`Đã đóng ${selectedIds.length} tin tuyển dụng.`);
    } catch (err: unknown) {
      showToast((err as Error).message || "Thao tác thất bại.");
    }
  };

  const handleDeleteRow = async (jdId: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa tin tuyển dụng "${title}"?`)) {
      return;
    }
    try {
      await deleteJob(jdId);
      showToast(`Đã xóa tin tuyển dụng "${title}".`);
    } catch (err: unknown) {
      showToast((err as Error).message || "Không thể xóa tin tuyển dụng (có thể đã có hồ sơ ứng tuyển).");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 text-white text-xs shadow-xl">
          <span>{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-white ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="rounded-2xl bg-white border border-border shadow-xs overflow-hidden">
        {/* Card Header & Filters */}
        <div className="p-6 pb-5 space-y-4">
          <div>
            <h1 className="text-lg font-bold text-neutral-900">
              Tin tuyển dụng đang hoạt động
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Theo dõi tiến độ tuyển dụng và chỉ tiêu cho từng vị trí mở
            </p>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0);
                }}
                placeholder="Tìm theo tên vị trí, mã tin..."
                className="w-full pl-9! pr-3 py-2 text-xs rounded-lg border border-[#dcded4] bg-[#fffefd] placeholder:text-neutral-400 focus:border-[#264e43] outline-none"
              />
            </div>

            {/* Selects & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as JobStatus | "");
                  setPage(0);
                }}
                className="px-3 py-2 rounded-lg border border-[#dcded4] bg-white text-xs text-neutral-700 outline-none focus:border-[#264e43]"
              >
                <option value="">Trạng thái: Tất cả</option>
                <option value="PUBLISHED">Trạng thái: Đang tuyển</option>
                <option value="CLOSED">Trạng thái: Đã dừng</option>
                <option value="DRAFT">Trạng thái: Bản nháp</option>
              </select>

              {/* Department Filter */}
              <select
                value={depFilter}
                onChange={(e) => {
                  setDepFilter(e.target.value);
                  setPage(0);
                }}
                className="px-3 py-2 rounded-lg border border-[#dcded4] bg-white text-xs text-neutral-700 outline-none focus:border-[#264e43]"
              >
                <option value="">Phòng ban: Tất cả</option>
                {lookups?.departments.map((dept) => (
                  <option key={dept.depId} value={dept.depId}>
                    Phòng ban: {dept.depName}
                  </option>
                ))}
              </select>

              {/* Close Selected Button */}
              <button
                type="button"
                onClick={handleCloseSelected}
                disabled={selectedIds.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg! text-xs font-semibold! border! border-red-300! text-red-700! bg-white! hover:bg-red-50! disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Lock size={14} />
                <span>
                  Đóng đã chọn{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
                </span>
              </button>

              {/* Create Job Button */}
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg! text-xs font-semibold! bg-[#34594e]! hover:bg-[#28473e]! text-white! shadow-xs! transition-colors!"
              >
                <UserPlus size={14} />
                <span>+ Tạo tin tuyển dụng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button
              onClick={reload}
              className="inline-flex items-center gap-1 font-semibold text-red-800 underline hover:no-underline"
            >
              <RefreshCw size={12} /> Thử lại
            </button>
          </div>
        )}

        {/* Table Container */}
        <div className="overflow-x-auto border-t border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f3e6d5] text-neutral-800 font-semibold select-none border-b border-border">
                <th className="py-3.5 pl-6 pr-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() => toggleSelectAll(allVisibleIds)}
                    aria-label="Chọn tất cả"
                    className="h-4 w-4 rounded accent-[#264e43] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-bold tracking-wider text-neutral-900">
                  VỊ TRÍ TUYỂN DỤNG
                </th>
                <th className="py-3.5 px-4 font-bold tracking-wider text-neutral-900">
                  PHÒNG BAN
                </th>
                <th className="py-3.5 px-4 font-bold tracking-wider text-neutral-900">
                  MỨC LƯƠNG
                </th>
                <th className="py-3.5 px-4 font-bold tracking-wider text-neutral-900">
                  TIẾN ĐỘ
                </th>
                <th className="py-3.5 px-4 font-bold! tracking-wider text-neutral-900">
                  TRẠNG THÁI
                </th>
                <th className="py-3.5 px-4 font-bold! tracking-wider text-neutral-900">
                  NGƯỜI PHỤ TRÁCH
                </th>
                <th className="py-3.5 px-4 pr-6 font-bold! tracking-wider text-right text-neutral-900">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {loading && !jobs.length ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin text-[#264e43]" />
                      <span>Đang tải danh sách tin tuyển dụng…</span>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    Không tìm thấy tin tuyển dụng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const isChecked = selectedIds.includes(job.jdId);
                  const percent =
                    job.jdTarget > 0
                      ? Math.min(100, Math.round((job.hiredCount / job.jdTarget) * 100))
                      : 0;
                  const isFull = percent >= 100;

                  return (
                    <tr
                      key={job.jdId}
                      className={`hover:bg-[#fbf9f6] transition-colors ${
                        isChecked ? "bg-[#f5f9f7]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-6 pr-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(job.jdId)}
                          aria-label={`Chọn tin ${job.jdTitle}`}
                          className="h-4 w-4 rounded accent-[#264e43] cursor-pointer"
                        />
                      </td>

                      {/* Job Title */}
                      <td className="py-4 px-4 font-bold text-neutral-900 max-w-57.5 whitespace-normal">
                        {job.jdTitle}
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4 text-neutral-700 max-w-32.5 whitespace-normal">
                        {job.depName || "Chưa gán"}
                      </td>

                      {/* Salary */}
                      <td className="py-4 px-4 text-neutral-800 font-medium">
                        {formatSalary(job.jdSalMin, job.jdSalMax)}
                      </td>

                      {/* Progress */}
                      <td className="py-4 px-4 font-medium">
                        <span className="font-bold text-neutral-900">
                          {job.hiredCount}/{job.jdTarget}
                        </span>{" "}
                        <span
                          className={
                            isFull ? "text-emerald-600 font-bold" : "text-neutral-500"
                          }
                        >
                          ({percent}%)
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">{getStatusBadge(job.jdStatus)}</td>

                      {/* Recruiter */}
                      <td className="py-4 px-4 text-neutral-800">
                        {job.recruiterName || "Chưa phân công"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 pr-6 text-right">
                        <div className="inline-flex items-center justify-end gap-2 text-neutral-600">
                          <button
                            type="button"
                            onClick={() => handleOpenView(job.jdId)}
                            title="Xem chi tiết"
                            className="p-1.5 rounded-md hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(job.jdId)}
                            title="Chỉnh sửa"
                            className="p-1.5 rounded-md hover:text-[#264e43] hover:bg-emerald-50 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteRow(job.jdId, job.jdTitle)}
                            title="Xóa tin tuyển dụng"
                            className="p-1.5 rounded-md hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}.
        <div className="px-6 py-4 border-t border-border bg-[#fffdfa]">
          <Pagination
            page={page}
            total={data?.totalElements || 0}
            size={pageSize}
            onPage={setPage}
            itemName="tin tuyển dụng"
          />
        </div>
      </div>

      {/* Modal View / Create / Edit */}
      <JobModal
        isOpen={modalOpen}
        mode={modalMode}
        job={selectedJob}
        lookups={lookups}
        onClose={() => setModalOpen(false)}
        onSwitchToEdit={() => setModalMode("edit")}
        onSubmit={async (dto) => {
          if (modalMode === "create") {
            await createJob(dto);
            showToast("Đã tạo tin tuyển dụng thành công!");
          } else if (modalMode === "edit" && selectedJob) {
            await updateJob(selectedJob.jdId, dto);
            showToast("Đã cập nhật tin tuyển dụng!");
          }
        }}
      />
    </div>
  );
}