"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  BriefcaseBusiness,
  Building2,
  Users,
  DollarSign,
  GraduationCap,
  UserCheck,
  Pencil,
} from "lucide-react";
import type { JobDetail, JobLookups, JobStatus, JobUpsertDTO } from "@/types/job";
import { Badge } from "./badge";

export interface JobModalProps {
  isOpen: boolean;
  mode: "view" | "create" | "edit";
  job?: JobDetail | null;
  lookups?: JobLookups;
  onClose: () => void;
  onSwitchToEdit?: () => void;
  onSubmit?: (dto: JobUpsertDTO) => Promise<void>;
}



export function JobModal({
  isOpen,
  mode,
  job,
  lookups,
  onClose,
  onSwitchToEdit,
  onSubmit,
}: JobModalProps) {
  const [jdTitle, setJdTitle] = useState("");
  const [jdDesc, setJdDesc] = useState("");
  const [jdSalMin, setJdSalMin] = useState("");
  const [jdSalMax, setJdSalMax] = useState("");
  const [jdTarget, setJdTarget] = useState("1");
  const [jdStatus, setJdStatus] = useState<JobStatus>("PUBLISHED");
  const [jdMajor, setJdMajor] = useState("");
  const [depId, setDepId] = useState("");
  const [recruiterId, setRecruiterId] = useState("");
  const [dtId, setDtId] = useState("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [campaignIds, setCampaignIds] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormError(null);
    if ((mode === "edit" || mode === "view") && job) {
      setJdTitle(job.jdTitle || "");
      setJdDesc(job.jdDesc || "");
      setJdSalMin(job.jdSalMin != null ? String(job.jdSalMin / 1_000_000) : "");
      setJdSalMax(job.jdSalMax != null ? String(job.jdSalMax / 1_000_000) : "");
      setJdTarget(String(job.jdTarget || 1));
      setJdStatus(job.jdStatus || "PUBLISHED");
      setJdMajor(job.jdMajor || "");
      setDepId(job.depId || "");
      setRecruiterId(job.recruiterId || "");
      setDtId(job.dtId || "");
      setSkillIds(job.skillIds || []);
      setCampaignIds(job.campaignIds || []);
    } else {
      setJdTitle("");
      setJdDesc("");
      setJdSalMin("");
      setJdSalMax("");
      setJdTarget("1");
      setJdStatus("PUBLISHED");
      setJdMajor("");
      setDepId("");
      setRecruiterId("");
      setDtId("");
      setSkillIds([]);
      setCampaignIds([]);
    }
  }, [isOpen, mode, job]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleArrayItem = (list: string[], id: string) =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdTitle.trim() || !jdDesc.trim() || !depId || !recruiterId) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc (*).");
      return;
    }

    const minVal = jdSalMin.trim() ? Math.round(Number(jdSalMin) * 1_000_000) : null;
    const maxVal = jdSalMax.trim() ? Math.round(Number(jdSalMax) * 1_000_000) : null;

    if (minVal != null && maxVal != null && minVal > maxVal) {
      setFormError("Mức lương tối thiểu không được lớn hơn mức lương tối đa.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      if (onSubmit) {
        await onSubmit({
          jdTitle: jdTitle.trim(),
          jdDesc: jdDesc.trim(),
          jdSalMin: minVal,
          jdSalMax: maxVal,
          jdTarget: Math.max(1, Number(jdTarget) || 1),
          jdStatus,
          jdMajor: jdMajor.trim() || null,
          depId,
          recruiterId,
          dtId: dtId || null,
          skillIds,
          campaignIds,
        });
      }
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Không thể lưu tin tuyển dụng.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status: JobStatus) => {
    if (status === "PUBLISHED") {
      return (
        <Badge bgColor="#dcfce7" color="#166534">
          Đang tuyển
        </Badge>
      );
    }
    if (status === "CLOSED") {
      return (
        <Badge bgColor="#fee2e2" color="#991b1b">
          Đã dừng
        </Badge>
      );
    }
    return (
      <Badge bgColor="#f3e8d8" color="#8c5a2b">
        Bản nháp
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-[#fbf9f6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#264e43]/10 text-[#264e43] flex items-center justify-center">
              <BriefcaseBusiness size={18} />
            </div>
            <h2 className="text-base font-bold text-neutral-800">
              {mode === "create"
                ? "Tạo tin tuyển dụng mới"
                : mode === "edit"
                ? "Chỉnh sửa tin tuyển dụng"
                : "Chi tiết tin tuyển dụng"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {formError}
            </div>
          )}

          {mode === "view" && job ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#f7f5f0] border border-[#ebe5dc] flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{job.jdTitle}</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {job.depName || "Chưa gán phòng ban"} · Chuyên ngành: {job.jdMajor || "Không yêu cầu"}
                  </p>
                </div>
                {renderStatusBadge(job.jdStatus)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/60">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <DollarSign size={14} />
                    <span>Mức lương đề xuất</span>
                  </div>
                  <div className="font-semibold text-neutral-800">
                    {job.jdSalMin != null && job.jdSalMax != null
                      ? `${Math.round(job.jdSalMin / 1_000_000)} – ${Math.round(job.jdSalMax / 1_000_000)} triệu`
                      : "Thỏa thuận"}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/60">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <Users size={14} />
                    <span>Tiến độ chỉ tiêu</span>
                  </div>
                  <div className="font-semibold text-neutral-800">
                    {job.hiredCount}/{job.jdTarget} (
                    {job.jdTarget > 0 ? Math.round((job.hiredCount / job.jdTarget) * 100) : 0}%)
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/60">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <UserCheck size={14} />
                    <span>Người phụ trách</span>
                  </div>
                  <div className="font-semibold text-neutral-800">
                    {job.recruiterName || "Chưa phân công"}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/60">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <GraduationCap size={14} />
                    <span>Trình độ tối thiểu</span>
                  </div>
                  <div className="font-semibold text-neutral-800">
                    {job.dtName || "Không yêu cầu"}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-neutral-700">Mô tả công việc</div>
                <div className="p-3.5 rounded-lg border border-neutral-100 bg-neutral-50/40 text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                  {job.jdDesc}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-neutral-700">Kỹ năng yêu cầu</div>
                <div className="flex flex-wrap gap-1.5">
                  {job.skillNames.length > 0 ? (
                    job.skillNames.map((s) => (
                      <Badge key={s} bgColor="#edf2ed" color="#2c655b">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400">Chưa gắn kỹ năng</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
                {onSwitchToEdit && (
                  <button
                    type="button"
                    onClick={onSwitchToEdit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-[#dcded4] text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <Pencil size={13} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-[#285b53] transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Tên vị trí tuyển dụng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jdTitle}
                  onChange={(e) => setJdTitle(e.target.value)}
                  placeholder="VD: Lập trình viên Backend Senior"
                  className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={depId}
                    onChange={(e) => setDepId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  >
                    <option value="">-- Chọn phòng ban --</option>
                    {lookups?.departments.map((d) => (
                      <option key={d.depId} value={d.depId}>
                        {d.depName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Người phụ trách <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={recruiterId}
                    onChange={(e) => setRecruiterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  >
                    <option value="">-- Chọn người phụ trách --</option>
                    {lookups?.recruiters.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Lương tối thiểu (triệu)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={jdSalMin}
                    onChange={(e) => setJdSalMin(e.target.value)}
                    placeholder="VD: 20"
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Lương tối đa (triệu)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={jdSalMax}
                    onChange={(e) => setJdSalMax(e.target.value)}
                    placeholder="VD: 35"
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Chỉ tiêu tuyển <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={jdTarget}
                    onChange={(e) => setJdTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jdStatus}
                    onChange={(e) => setJdStatus(e.target.value as JobStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  >
                    <option value="PUBLISHED">Đang tuyển</option>
                    <option value="DRAFT">Bản nháp</option>
                    {mode === "edit" && <option value="CLOSED">Đã dừng</option>}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Trình độ học vấn
                  </label>
                  <select
                    value={dtId}
                    onChange={(e) => setDtId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  >
                    <option value="">Không yêu cầu</option>
                    {lookups?.degreeTypes.map((dt) => (
                      <option key={dt.id} value={dt.id}>
                        {dt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Chuyên ngành
                  </label>
                  <input
                    type="text"
                    value={jdMajor}
                    onChange={(e) => setJdMajor(e.target.value)}
                    placeholder="VD: Công nghệ thông tin"
                    className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Mô tả công việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={jdDesc}
                  onChange={(e) => setJdDesc(e.target.value)}
                  placeholder="Nhập mô tả chi tiết công việc, yêu cầu ứng viên và quyền lợi..."
                  className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white focus:border-[#264e43] outline-none"
                />
              </div>

              {lookups && lookups.skills.length > 0 && (
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">
                    Kỹ năng yêu cầu{" "}
                    {skillIds.length > 0 && (
                      <span className="text-[#264e43] font-bold">
                        (Đã chọn {skillIds.length})
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 rounded-lg border border-[#dcded4] bg-[#fbf9f6]">
                    {lookups.skills.map((s) => {
                      const active = skillIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSkillIds((prev) => toggleArrayItem(prev, s.id))}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full! text-xs font-medium border! transition-colors cursor-pointer ${
                            active
                              ? "bg-[#264e43]! text-white! border-[#264e43]! font-semibold"
                              : "bg-white! text-neutral-700! border-neutral-300! hover:border-[#264e43]! hover:bg-neutral-50!"
                          }`}
                        >
                          <span>{active ? "✓" : "+"}</span>
                          <span>{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg font-semibold bg-primary hover:bg-[#1e3f36] text-white shadow-xs disabled:opacity-50 transition-colors"
                >
                  {submitting
                    ? "Đang lưu…"
                    : mode === "create"
                    ? "Tạo tin tuyển dụng"
                    : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}