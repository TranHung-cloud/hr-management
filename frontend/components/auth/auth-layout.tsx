import { Suspense, type ReactNode } from "react";
import { CareerBrand } from "@/components/careers/shared";
import { AuthBackLink, AuthMain } from "@/components/auth/layout-parts";


export function AuthLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="loading-screen" role="status">Đang mở trang tài khoản…</div>}>
    <div className="auth-app">
      <header className="auth-header"><CareerBrand /><AuthBackLink /></header>
      <AuthMain>
        <section className="auth-form-panel">{children}</section>
      </AuthMain>
      <footer className="auth-footer">RecruitHR · Kết nối công việc với người phù hợp.</footer>
    </div>
  </Suspense>;
}
