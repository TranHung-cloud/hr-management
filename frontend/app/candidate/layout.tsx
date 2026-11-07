import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CareersLayout } from "@/components/careers/careers-layout";
import { CandidateGate } from "@/components/careers/shared";

export const metadata: Metadata = { title: "Hồ sơ ứng viên · RecruitHR" };

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return <CareersLayout><CandidateGate>{children}</CandidateGate></CareersLayout>;
}
