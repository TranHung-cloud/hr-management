"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number; // 0-indexed
  total: number;
  size: number;
  onPage: (page: number) => void;
  itemName?: string;
  className?: string;
}

export function Pagination({
  page,
  total,
  size,
  onPage,
  itemName = "tài khoản",
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / size));
  const startItem = total === 0 ? 0 : page * size + 1;
  const endItem = Math.min((page + 1) * size, total);

  // Generate page numbers to show (e.g., 1, 2, 3...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (page <= 2) {
        pages.push(0, 1, 2, 3, "...", totalPages - 1);
      } else if (page >= totalPages - 3) {
        pages.push(0, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pages.push(0, "...", page - 1, page, page + 1, "...", totalPages - 1);
      }
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 pt-4 select-none ${className}`}
    >
      <div>
        Hiển thị{" "}
        <span className="font-semibold text-neutral-800">
          {startItem}–{endItem}
        </span>{" "}
        trên <span className="font-semibold text-neutral-800">{total}</span>{" "}
        {itemName}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Prev button */}
        <button
          type="button"
          onClick={() => onPage(Math.max(0, page - 1))}
          disabled={page <= 0}
          aria-label="Trang trước"
          className="h-8 w-8 flex items-center justify-center rounded border border-[#dcded4] bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="h-8 w-8 flex items-center justify-center text-neutral-400"
              >
                …
              </span>
            );
          }

          const pageIndex = p as number;
          const isActive = pageIndex === page;

          return (
            <button
              key={pageIndex}
              type="button"
              onClick={() => onPage(pageIndex)}
              className={`h-8 w-8 flex items-center justify-center rounded font-semibold transition-colors ${
                isActive
                  ? "bg-[#275347] text-white border border-[#275347] shadow-xs"
                  : "bg-white text-neutral-700 border border-[#dcded4] hover:bg-neutral-50"
              }`}
            >
              {pageIndex + 1}
            </button>
          );
        })}

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          aria-label="Trang sau"
          className="h-8 w-8 flex items-center justify-center rounded border border-[#dcded4] bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
