"use client";

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  className?: string;
}

export function Badge({
  children,
  color,
  bgColor,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap leading-tight transition-colors ${className}`}
      style={{
        color: color || "inherit",
        backgroundColor: bgColor || "transparent",
      }}
    >
      {children}
    </span>
  );
}
