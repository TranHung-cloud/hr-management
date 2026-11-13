"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useRecruitment } from "@/components/recruitment/provider";

interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  avatarUrl?: string;
}

export function UserMenu({
  userName = "Người dùng",
  userEmail = "",
  userRole = "",
  avatarUrl,
}: UserMenuProps) {
  const { logout } = useRecruitment();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setOpen(false);
      await logout(); // Gọi DELETE /api/session của hệ thống và reset state về trang đăng nhập
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-[#f0f1e9] transition-colors cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#dfeae3] text-[#3d6c5c] flex items-center justify-center text-xs font-semibold">
            {initials || <User className="w-4 h-4" />}
          </div>
        )}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-neutral-800 leading-tight">
            {userName}
          </span>
          {userRole && (
            <span className="text-[11px] text-neutral-500 leading-tight">
              {userRole}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-[#e8e1d7] shadow-lg py-1.5 z-50">
          <div className="px-4 py-2.5 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {userName}
            </p>
            {userEmail && (
              <p className="text-xs text-neutral-500 truncate mt-0.5">
                {userEmail}
              </p>
            )}
          </div>

          <div className="p-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{loading ? "Đang đăng xuất..." : "Đăng xuất"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}