import { Suspense, type ReactNode } from "react";
import { CareerHeader } from "@/components/careers/shared";


export function CareersLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="loading-screen" role="status">Đang mở trang tuyển dụng…</div>}>
    <div className="career-app">
      <a href="#career-content" className="career-skip">Đến nội dung chính</a>
      <CareerHeader />
      <main id="career-content" className="career-main">
        <Suspense fallback={<div className="career-container career-loading" role="status">Đang tải nội dung…</div>}>{children}</Suspense>
      </main>
    </div>
  </Suspense>;
}
