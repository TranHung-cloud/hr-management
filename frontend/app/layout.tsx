import type { Metadata } from "next";
import { Suspense } from "react";
import { RecruitmentProvider } from "@/components/recruitment/provider";
import { AppShell } from "@/components/recruitment/app-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: "RecruitHR · Tuyển dụng & phỏng vấn",
  description: "Không gian quản lý tuyển dụng và phỏng vấn của đội ngũ nhân sự.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body><RecruitmentProvider><Suspense fallback={<div className="loading-screen" role="status">Đang mở không gian tuyển dụng…</div>}><AppShell>{children}</AppShell></Suspense></RecruitmentProvider></body></html>;
}
