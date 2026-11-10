"use client";

import React from "react";

interface AvatarProps {
  name?: string | null;
  size?: number;
  className?: string;
}

const PALETTES = [
  { bg: "#25483f", text: "#ffffff" }, // dark pine green (like MT in screenshot)
  { bg: "#fcdbc5", text: "#98471b" }, // soft peach orange (like MH)
  { bg: "#dbeef5", text: "#24617a" }, // light sky blue (like HN)
  { bg: "#e2ecf5", text: "#335e7c" }, // soft steel blue (like QT)
  { bg: "#fcd7d7", text: "#a42a2a" }, // soft rose red (like ĐT)
  { bg: "#d9e9e5", text: "#1f5f50" }, // soft sage green (like BN)
  { bg: "#fcd6db", text: "#992c42" }, // soft berry (like AT)
  { bg: "#daf0e8", text: "#1c6850" }, // mint green (like TT)
];

export function getAccountInitials(name?: string | null): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (first[0] + last[0]).toUpperCase();
}

function getPaletteIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % PALETTES.length;
}

export function AccountAvatar({
  name,
  size = 38,
  className = "",
}: AvatarProps) {
  const safeName = name?.trim() || "Account";
  const initials = getAccountInitials(safeName);
  const palette = PALETTES[getPaletteIndex(safeName)];
  const fontSize = Math.max(10, Math.round(size * 0.36));

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold select-none shrink-0 transition-transform ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: palette.bg,
        color: palette.text,
        fontSize: `${fontSize}px`,
      }}
      aria-label={safeName}
    >
      {initials}
    </div>
  );
}
