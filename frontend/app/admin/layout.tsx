import { Suspense } from "react";
import { AppShell } from "@/components/recruitment/app-shell";
import { RecruitmentProvider } from "@/components/recruitment/provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecruitmentProvider>
      <Suspense fallback={<div className="loading-screen" role="status">Đang mở không gian tuyển dụng…</div>}>
        <AppShell>{children}</AppShell>
      </Suspense>
    </RecruitmentProvider>
  );
}
