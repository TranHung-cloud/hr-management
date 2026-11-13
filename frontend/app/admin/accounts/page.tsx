"use client";

import React, { useState, useMemo, use } from "react";
import {
  Search,
  Lock,
  UserPlus,
  Pencil,
  KeyRound,
  Unlock,
  AlertCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import type { AccountStatus, AccountView, AdminAccountDetail, BaseAccountDetail, CandidateAccountDetail } from "@/types/account";
import { AccountAvatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Pagination } from "@/components/pagination";
import { AccountModal } from "@/components/account-modal";
import { formatPhone } from "@/lib/formatPhone";
import { useRoles } from "@/hooks/use-roles";
import { useDepartments } from "@/hooks/use-deparments";
import { get } from "http";

export default function AccountsPage() {
  const { data: roles, loading: rolesLoading, error: rolesError } = useRoles();
  const { data: departments, loading: departmentsLoading, error: departmentsError } = useDepartments();
  // Filters state
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create">("create");
  const [accountDetail, setAccountDetail] = useState<CandidateAccountDetail | AdminAccountDetail | null>(null);

  // Notification message
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
    createAccount,
    lockAccounts,
    unlockAccounts,
    getAccountDetails,
  } = useAccounts({
    keyword,
    page,
    size: pageSize,
  });

  // Client-side filtering for status and role if needed
  const rawAccounts = data?.content || [];

  const filteredAccounts = useMemo(() => {
    return rawAccounts.filter((acc) => {
      if (departmentFilter !== "" && acc.depName !== departmentFilter) {
      return false;
    }
    if (roleFilter !== "" && acc.roleName !== roleFilter) {
      return false;
    }
      return true;
    });
  }, [rawAccounts, departmentFilter, roleFilter]);

  const allVisibleIds = useMemo(
    () => filteredAccounts.map((a) => a.accId),
    [filteredAccounts]
  );

  const isAllSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.includes(id));

  // Role Badge Styling
  const getRoleBadge = (roleName?: string | null) => {
    const name = roleName || "Chưa có chức vụ";
    const lower = name.toLowerCase();

    if (lower === "trưởng phòng nhân sự") {
      return (
        <Badge bgColor="#fed7aa" color="#9a3412">
          {name}
        </Badge>
      );
    }
    if (lower === "nhân viên tuyển dụng") {
      return (
        <Badge bgColor="#e0f2fe" color="#0369a1">
          {name}
        </Badge>
      );
    }
    if (lower === "người phỏng vấn") {
      return (
        <Badge bgColor="#dcfce7" color="#15803d">
          {name}
        </Badge>
      );
    }
    return (
      <Badge bgColor="#f3f4f6" color="#374151">
        {name}
      </Badge>
    );
  };

  // Status Badge Styling
  const getStatusBadge = (status: AccountStatus) => {
    if (status === "ACTIVE") {
      return (
        <Badge bgColor="#dcfce7" color="#166534">
          Hoạt động
        </Badge>
      );
    }
    return (
      <Badge bgColor="#fee2e2" color="#991b1b">
        Đã khóa
      </Badge>
    );
  };

  // Department Badge Styling
  const getDepBadge = (depName?: string | null) => {
    if (!depName) {
      return "Không có phòng ban";
    }
    const name = depName;
    const colors = [
      { bg: "#fed7aa", text: "#9a3412" },
      { bg: "#e0f2fe", text: "#0369a1" },
      { bg: "#dcfce7", text: "#15803d" },
      { bg: "#ede9fe", text: "#6d28d9" },
      { bg: "#fce7f3", text: "#be185d" },
      { bg: "#fef9c3", text: "#a16207" },
      { bg: "#cffafe", text: "#0e7490" },
      { bg: "#f3e8ff", text: "#7e22ce" },
    ];

    // Hash tên phòng ban thành số cố định
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }

    // Chọn màu dựa trên hash
    const color = colors[Math.abs(hash) % colors.length];

    return (
      <Badge bgColor={color.bg} color={color.text}>
        {name}
      </Badge>
    );
  };

  // Row Actions
  const handleOpenView = async (accId: string) => {
    try {
      const details = await getAccountDetails(accId);

      setAccountDetail(details);
      setModalMode("view");
      setModalOpen(true);
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message || "Không thể tải thông tin tài khoản.");
    }
  };

  const handleOpenCreate = () => {
    setAccountDetail(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleToggleRowStatus = async (
    account: AccountView | BaseAccountDetail
  ) => {
    try {
      if (account.accStatus === "ACTIVE") {
        await lockAccounts([account.accId]);
        showToast(`Đã khóa tài khoản ${account.accEmail}.`);
      } else {
        await unlockAccounts([account.accId]);
        showToast(`Đã mở khóa tài khoản ${account.accEmail}.`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message || "Không thể thay đổi trạng thái.");
    }
  };

  const handleLockSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Bạn có chắc muốn khóa ${selectedIds.length} tài khoản đã chọn?`)) {
      return;
    }
    try {
      await lockAccounts(selectedIds);
      showToast(`Đã khóa ${selectedIds.length} tài khoản.`);
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message || "Thao tác thất bại.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 text-white text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2">
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
      <div className="rounded-2xl bg-white border border-[#e8e1d7] shadow-xs overflow-hidden">
        {/* Card Header & Filters */}
        <div className="p-6 pb-5 space-y-4">
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Thông tin tài khoản</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Theo dõi tiến độ tuyển dụng cho từng vị trí mở
            </p>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0);
                }}
                placeholder="Tìm theo tên, email, SĐT..."
                className="w-full !pl-9 pr-3 py-2 text-xs rounded-lg border border-[#dcded4] bg-[#fffefd] placeholder:text-neutral-400 focus:border-[#264e43] focus:ring-1 focus:ring-[#264e43] outline-none"
              />
            </div>

            {/* Selects & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
                className="w-[180px] px-3 py-2 rounded-lg border border-[#dcded4] bg-white text-xs text-neutral-700 outline-none focus:border-[#264e43]"
              >
                <option value="">Vai trò: Tất cả</option>
                {roles?.map((role) => (
                  <option key={role.roleId} value={role.roleName}>
                    Vai trò: {role.roleName}
                  </option>
                ))}
              </select>

              {/* Department filter */}
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setPage(0);
                }}
                className="w-[300px] px-3 py-2 rounded-lg border border-[#dcded4] bg-white text-xs text-neutral-700 outline-none focus:border-[#264e43]"
              >
                <option value="">Phòng ban: Tất cả</option>
                {departments?.map((dept) => (
                  <option key={dept.depId} value={dept.depName}>
                    Phòng ban: {dept.depName}
                  </option>
                ))}
              </select>

              {/* Lock Selected Button */}
              <button
                type="button"
                onClick={handleLockSelected}
                disabled={selectedIds.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 !rounded-lg !font-semibold !border !border-red-300 !text-red-600 !bg-white hover:!bg-red-50 !disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
              >
                <Lock size={14} />
                <span>Khóa đã chọn</span>
                {selectedIds.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-red-100 text-red-700 rounded-full text-[10px]">
                    {selectedIds.length}
                  </span>
                )}
              </button>

              {/* Create Account Button */}
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 !rounded-lg !font-semibold !bg-primary hover:!bg-[#285b53] !text-white !shadow-xs !transition-colors"
              >
                <UserPlus size={14} />
                <span>+ Tạo tài khoản</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mb-4 p-3 !rounded-lg !bg-red-50 !border !border-red-200 text-xs !text-red-700 flex items-center justify-between">
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
        <div className="overflow-x-auto border-t border-[#e8e1d7]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f5ede1] text-[#736e65] font-semibold select-none border-b border-[#e8e1d7]">
                <th className="py-3.5 pl-6 pr-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() => toggleSelectAll(allVisibleIds)}
                    aria-label="Chọn tất cả"
                    className="h-4 w-4 rounded accent-[#264e43] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 !font-semibold tracking-wider !text-black">NHÂN VIÊN</th>
                <th className="py-3.5 px-4 !font-semibold tracking-wider text-center !text-black">SỐ ĐIỆN THOẠI</th>
                <th className="py-3.5 px-4 !font-semibold tracking-wider text-center !text-black">VAI TRÒ</th>
                <th className="py-3.5 px-4 !font-semibold tracking-wider text-center !text-black">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 !font-semibold tracking-wider text-center !text-black">PHÒNG BAN</th>
                <th className="py-3.5 px-4 pr-6 !font-semibold tracking-wider text-right !text-black">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {loading && !filteredAccounts.length ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin text-[#264e43]" />
                      <span>Đang tải danh sách tài khoản…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Không tìm thấy tài khoản nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc, idx) => {
                  const isChecked = selectedIds.includes(acc.accId);
                  const isLocked = acc.accStatus === "INACTIVE";

                  return (
                    <tr
                      key={acc.accId}
                      className={`hover:bg-[#fbf9f6] transition-colors ${
                        isChecked ? "bg-[#f5f9f7]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 pl-6 pr-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(acc.accId)}
                          aria-label={`Chọn tài khoản ${acc.accName}`}
                          className="h-4 w-4 rounded accent-[#264e43] cursor-pointer"
                        />
                      </td>

                      {/* Employee Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <AccountAvatar name={acc.accName} size={38} />
                          <div>
                            <div className="font-bold text-neutral-900 leading-tight">
                              {acc.accName || "Chưa cập nhật"}
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              {acc.accEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-neutral-700 font-medium text-center">
                        {acc.accPhone ? formatPhone(acc.accPhone) : "Không có số điện thoại"}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {getRoleBadge(acc.roleName)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(acc.accStatus)}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-neutral-600 text-center">
                        {getDepBadge(acc.depName)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 pr-6 text-right">
                        <div className="inline-flex items-center justify-end gap-2 text-neutral-400">
                          {/* View modal */}
                          <button
                            type="button"
                            onClick={() => handleOpenView(acc.accId)}
                            title="Xem chi tiết"
                            className="p-1.5 !rounded-md hover:!text-neutral-700 hover:!bg-neutral-100 transition-colors"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Lock / Unlock */}
                          <button
                            type="button"
                            onClick={() => handleToggleRowStatus(acc)}
                            title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                            className={`p-1.5 !rounded-md transition-colors ${
                              isLocked
                                ? "hover:!text-emerald-600 hover:!bg-emerald-50"
                                : "hover:!text-red-700 hover:!bg-red-50"
                            }`}
                          >
                            {isLocked ? <Unlock size={15} /> : <Lock size={15} />}
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

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#e8e1d7] bg-[#fffdfa]">
          <Pagination
            page={page}
            total={data?.totalElements || filteredAccounts.length}
            size={pageSize}
            onPage={setPage}
            itemName="tài khoản"
          />
        </div>
      </div>

      {/* Account Modal (Xem chi tiết & Khóa/Mở khóa hoặc Tạo mới) */}
      <AccountModal
        isOpen={modalOpen}
        mode={modalMode}
        account={accountDetail}
        onClose={() => setModalOpen(false)}
        onCreate={async (dto) => {
          await createAccount(dto);
          showToast("Đã tạo tài khoản thành công!");
        }}
        onToggleStatus={async (acc) => {
          await handleToggleRowStatus(acc);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
