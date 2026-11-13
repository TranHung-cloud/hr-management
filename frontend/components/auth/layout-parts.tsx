"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { safeCandidateReturn } from "@/lib/auth-routing";

export function AuthBackLink() {
  const params = useSearchParams();
  const returnTo = safeCandidateReturn(params.get("next"));
  return <Link className="career-back" href={returnTo}><ArrowLeft size={15} />Quay lại tuyển dụng</Link>;
}

export function AuthMain({ children }: { children: ReactNode }) {
  const register = usePathname() === "/register";
  return <main className={`auth-layout ${register ? "register" : ""}`}>{children}</main>;
}
