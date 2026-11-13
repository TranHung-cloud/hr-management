"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Mail,
  Phone,
  Briefcase,
  Building,
  ShieldCheck,
  FileText,
  ExternalLink,
  Download,
} from "lucide-react";
import type {
  AccountView,
  AdminAccountCreateDTO,
  AdminAccountDetail,
  BaseAccountDetail,
  CandidateAccountDetail,
} from "@/types/account";
import { AccountAvatar } from "./avatar";
import { Badge } from "./badge";
import { useRoles } from "@/hooks/use-roles";
import { useDepartments } from "@/hooks/use-deparments";
import { formatPhone } from "@/lib/formatPhone";

export interface AccountModalProps {
  isOpen: boolean;
  mode: "view" | "create";
  account?: CandidateAccountDetail | AdminAccountDetail | null;
  onClose: () => void;
  onCreate?: (data: AdminAccountCreateDTO) => Promise<void>;
  onToggleStatus?: (account: AccountView | BaseAccountDetail) => Promise<void>;
}

export function AccountModal({
  isOpen,
  mode,
  account,
  onClose,
  onCreate,
  onToggleStatus,
}: AccountModalProps) {
  // Form states for create mode
  const { data: roles } = useRoles();
  const { data: departments } = useDepartments();
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [depId, setDepId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Status/action states for view mode
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setRoleId("");
      setDepId("");
      setFormError(null);
      setActionSuccess(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isCandidate = mode === "view" && account && !("roleName" in account);
  const isLocked = account?.accStatus === "INACTIVE";

  const cvUrl =
    isCandidate && account && "candCvPath" in account && account.candCvPath
      ? account.candCvPath
      : "/uploads/cv/sample-cv.pdf";

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setFormError("Vui lòng nhập email hợp lệ.");
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);
      if (onCreate) {
        await onCreate({
          email: email.trim(),
          roleId: roleId,
          depId: depId,
        });
      }
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Không thể tạo tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!account || !onToggleStatus) return;
    try {
      setActionLoading(true);
      await onToggleStatus(account);
      setActionSuccess(
        account.accStatus === "ACTIVE"
          ? "Đã khóa tài khoản thành công."
          : "Đã kích hoạt lại tài khoản thành công."
      );
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Thao tác thất bại.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-xs">
      <div
        className={`w-full ${
          isCandidate ? "max-w-5xl xl:max-w-6xl" : "max-w-lg"
        } rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-[#fbf9f6] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#264e43]/10 text-[#264e43] flex items-center justify-center font-bold">
              {mode === "create" ? "+" : <ShieldCheck size={18} />}
            </div>
            <h2 className="text-base font-bold text-neutral-800">
              {mode === "create"
                ? "Tạo tài khoản mới"
                : isCandidate
                ? "Thông tin ứng viên & Hồ sơ CV"
                : "Chi tiết tài khoản"}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {formError}
            </div>
          )}

          {actionSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              {actionSuccess}
            </div>
          )}

          {mode === "view" && account ? (
            isCandidate ? (
              /* ================= CANDIDATE VIEW: 2 COLUMNS (INFO + PDF CV) ================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Column: Candidate Information */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f7f5f0] border border-[#ebe5dc]">
                      <AccountAvatar name={account.accName} size={56} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-neutral-900 truncate">
                          {account.accName || "Chưa cập nhật tên"}
                        </h3>
                        <p className="text-xs text-neutral-500 truncate">{account.accEmail}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            bgColor={isLocked ? "#fde8e8" : "#def7ec"}
                            color={isLocked ? "#b91c1c" : "#03543f"}
                          >
                            {isLocked ? "Đã khóa" : "Hoạt động"}
                          </Badge>
                          <Badge bgColor="#fed7aa" color="#9a3412">
                            Ứng viên
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {/* Số điện thoại */}
                      <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60">
                        <div className="flex items-center gap-1.5 text-neutral-400 mb-0.5">
                          <Phone size={13} />
                          <span>Số điện thoại</span>
                        </div>
                        <div className="font-semibold text-neutral-800">
                          {account.accPhone ? formatPhone(account.accPhone) : "Chưa cập nhật"}
                        </div>
                      </div>

                      {/* Giới tính */}
                      <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60">
                        <div className="flex items-center gap-1.5 text-neutral-400 mb-0.5">
                          <ShieldCheck size={13} />
                          <span>Giới tính</span>
                        </div>
                        <div className="font-semibold text-neutral-800">
                          {account.accIsMale == null
                            ? "Chưa cập nhật"
                            : account.accIsMale
                            ? "Nam"
                            : "Nữ"}
                        </div>
                      </div>

                      {/* Ngày sinh */}
                      <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60">
                        <div className="flex items-center gap-1.5 text-neutral-400 mb-0.5">
                          <Briefcase size={13} />
                          <span>Ngày sinh</span>
                        </div>
                        <div className="font-semibold text-neutral-800">
                          {account.accDob
                            ? new Date(account.accDob).toLocaleDateString("vi-VN")
                            : "Chưa cập nhật"}
                        </div>
                      </div>

                      {/* Kinh nghiệm */}
                      <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60">
                        <div className="flex items-center gap-1.5 text-neutral-400 mb-0.5">
                          <Briefcase size={13} />
                          <span>Kinh nghiệm</span>
                        </div>
                        <div className="font-semibold text-neutral-800">
                          {account.candExpYear ?? 0} năm
                        </div>
                      </div>

                      {/* Chuyên ngành */}
                      <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60">
                        <div className="flex items-center gap-1.5 text-neutral-400 mb-0.5">
                          <Briefcase size={13} />
                          <span>Chuyên ngành</span>
                        </div>
                        <div className="font-semibold text-neutral-800 truncate">
                          {account.candMajor || "Chưa cập nhật"}
                        </div>
                      </div>

                      {/* Trình độ học vấn */}
                      <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60">
                        <div className="flex items-center gap-1.5 text-neutral-400 mb-0.5">
                          <Building size={13} />
                          <span>Trình độ học vấn</span>
                        </div>
                        <div className="font-semibold text-neutral-800 truncate">
                          {account.dtName || "Chưa cập nhật"}
                        </div>
                      </div>

                      {/* Kỹ năng */}
                      <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60 sm:col-span-2">
                        <div className="flex items-center gap-1.5 text-neutral-400 mb-1.5">
                          <Briefcase size={13} />
                          <span>Kỹ năng</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {account.skills && account.skills.length > 0 ? (
                            account.skills.map((skill, index) => (
                              <Badge key={index} bgColor="#e0f2fe" color="#0369a1">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-neutral-500">Chưa cập nhật kỹ năng</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Candidate */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleStatus}
                        disabled={actionLoading}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                          isLocked
                            ? "!border-emerald-300 !bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100"
                            : "!border-red-300 !bg-red-50 !text-red-700 hover:!bg-red-100"
                        }`}
                      >
                        {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                        {isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                </div>

                {/* Right Column: PDF CV Preview */}
                <div className="lg:col-span-6 flex flex-col h-[520px] lg:h-[600px] rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden shadow-inner">
                  {/* CV Header Bar */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-neutral-200 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                      <FileText size={16} className="text-[#264e43]" />
                      <span>Hồ sơ ứng viên (CV)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 hover:text-[#264e43] hover:bg-neutral-100 rounded-md transition-colors"
                        title="Mở trong tab mới"
                      >
                        <ExternalLink size={13} />
                        <span>Mở tab mới</span>
                      </a>
                      <a
                        href={cvUrl}
                        download
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#264e43] hover:bg-[#1e3f36] rounded-md transition-colors shadow-xs"
                        title="Tải xuống CV"
                      >
                        <Download size={13} />
                        <span>Tải về</span>
                      </a>
                    </div>
                  </div>

                  {/* CV PDF Embed Viewer */}
                  <div className="flex-1 w-full h-full bg-[#525659] relative">
                    <iframe
                      src={`${cvUrl}#toolbar=0&navpanes=0`}
                      className="w-full h-full border-0"
                      title={`CV - ${account.accName || "Ứng viên"}`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* ================= ADMIN VIEW (SINGLE COLUMN COMPACT) ================= */
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f7f5f0] border border-[#ebe5dc]">
                  <AccountAvatar name={account.accName} size={58} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-neutral-900 truncate">
                      {account.accName || "Chưa cập nhật tên"}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate">{account.accEmail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        bgColor={isLocked ? "#fde8e8" : "#def7ec"}
                        color={isLocked ? "#b91c1c" : "#03543f"}
                      >
                        {isLocked ? "Đã khóa" : "Hoạt động"}
                      </Badge>
                      <Badge bgColor="#fed7aa" color="#9a3412">
                        {"roleName" in account ? account.roleName : "Quản trị viên"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Số điện thoại */}
                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                      <Phone size={14} />
                      <span>Số điện thoại</span>
                    </div>
                    <div className="font-semibold text-neutral-800">
                      {account.accPhone ? formatPhone(account.accPhone) : "Chưa cập nhật"}
                    </div>
                  </div>

                  {/* Giới tính */}
                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                      <ShieldCheck size={14} />
                      <span>Giới tính</span>
                    </div>
                    <div className="font-semibold text-neutral-800">
                      {account.accIsMale == null
                        ? "Chưa cập nhật"
                        : account.accIsMale
                        ? "Nam"
                        : "Nữ"}
                    </div>
                  </div>

                  {/* Ngày sinh */}
                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                      <Briefcase size={14} />
                      <span>Ngày sinh</span>
                    </div>
                    <div className="font-semibold text-neutral-800">
                      {account.accDob
                        ? new Date(account.accDob).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật"}
                    </div>
                  </div>

                  {/* Phòng ban */}
                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                      <Building size={14} />
                      <span>Phòng ban</span>
                    </div>
                    <div className="font-semibold text-neutral-800">
                      {"depName" in account && account.depName
                        ? account.depName
                        : "Chưa có phòng ban"}
                    </div>
                  </div>
                </div>

                {/* View Actions */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleStatus}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        isLocked
                          ? "!border-emerald-300 !bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100"
                          : "!border-red-300 !bg-red-50 !text-red-700 hover:!bg-red-100"
                      }`}
                    >
                      {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                      {isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )
          ) : (
            /* ================= CREATE ACCOUNT FORM ================= */
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Email nhân viên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vidu@congty.com"
                    className="w-full !pl-9 pr-3 py-2 rounded-lg border border-[#dcded4] bg-white text-xs focus:border-[#264e43] focus:ring-1 focus:ring-[#264e43] outline-none"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Mật khẩu khởi tạo ngẫu nhiên sẽ được gửi tự động tới email này.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Vai trò phân quyền <span className="text-red-500">*</span>
                </label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white text-xs focus:border-[#264e43] focus:ring-1 focus:ring-[#264e43] outline-none"
                >
                  <option value="">-- Chọn vai trò --</option>
                  {roles?.map((r) => {
                    if (r.roleName === "Ứng viên") return null;
                    return (
                      <option key={r.roleId} value={r.roleId}>
                        {r.roleName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Phòng ban <span className="text-red-500">*</span>
                </label>
                <select
                  value={depId}
                  onChange={(e) => setDepId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#dcded4] bg-white text-xs focus:border-[#264e43] focus:ring-1 focus:ring-[#264e43] outline-none"
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departments?.map((d) => (
                    <option key={d.depId} value={d.depId}>
                      {d.depName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 !border-t !border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 !rounded-lg text-xs !font-semibold !text-neutral-600 !hover:bg-neutral-100 !transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 !rounded-lg text-xs !font-semibold !bg-primary !hover:bg-[#1e3f36] !text-white !shadow-xs !disabled:opacity-50 !transition-colors"
                >
                  {submitting ? "Đang xử lý…" : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
