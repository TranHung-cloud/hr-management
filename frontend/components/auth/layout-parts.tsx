"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { safeCandidateReturn } from "@/lib/auth-routing";

export function AuthBackLink() {
  const params = useSearchParams();
  const returnTo = safeCandidateReturn(params.get("next"));
  return <Link className="career-back" href={returnTo}><ArrowLeft size={15} />Quay lại tuyển dụng</Link>;
}

export function AuthStory() {
  const register = usePathname() === "/register";
  return <aside className="auth-story">
    <p className="auth-context">Tuyển dụng tại RecruitHR</p>
    <h1>{register ? "Một hồ sơ.\nNhiều cơ hội." : "Tiếp tục hành trình\ncủa bạn."}</h1>
    <p>{register
      ? "Tạo hồ sơ và tải CV một lần. Bạn có thể dùng lại hồ sơ này khi ứng tuyển những vị trí phù hợp."
      : "Đăng nhập để ứng tuyển bằng hồ sơ đã lưu. Bạn sẽ quay lại tin tuyển dụng sau khi đăng nhập."}</p>
    <div className="auth-shared-note"><FileText size={20} /><span>CV chung trong hồ sơ<strong>Quản lý và cập nhật bất cứ lúc nào.</strong></span></div>
  </aside>;
}


export function AuthMain({ children }: { children: ReactNode }) {
  const register = usePathname() === "/register";
  return <main className={`auth-layout ${register ? "register" : ""}`}>{children}</main>;
}
