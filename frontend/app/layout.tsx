import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "RecruitHR · Tuyển dụng & phỏng vấn",
  description: "Không gian quản lý tuyển dụng và phỏng vấn của đội ngũ nhân sự.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
