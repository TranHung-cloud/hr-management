import type { Metadata } from "next";
import "./globals.css";
import "./careers.css";
import { SessionProvider } from "@/components/auth/session-provider";
export const metadata: Metadata = {
  title: "RecruitHR · Tuyển dụng & phỏng vấn",
  description: "Không gian quản lý tuyển dụng và phỏng vấn của đội ngũ nhân sự.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body><SessionProvider>{children}</SessionProvider></body></html>;
}
