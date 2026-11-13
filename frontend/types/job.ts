import type { DepartmentView } from "./department";
import type { Option } from "./api";

export type JobStatus = "PUBLISHED" | "CLOSED" | "DRAFT";

export interface JobView {
  jdId: string;
  jdTitle: string;
  depName: string | null;
  jdSalMin: number | null;
  jdSalMax: number | null;
  hiredCount: number;
  jdTarget: number;
  jdStatus: JobStatus;
  recruiterName: string | null;
}

export interface JobDetail {
  jdId: string;
  jdTitle: string;
  jdDesc: string;
  jdSalMin: number | null;
  jdSalMax: number | null;
  jdStatus: JobStatus;
  jdTarget: number;
  hiredCount: number;
  jdMajor: string | null;
  depId: string;
  depName: string | null;
  recruiterId: string;
  recruiterName: string | null;
  dtId: string | null;
  dtName: string | null;
  skillIds: string[];
  skillNames: string[];
  campaignIds: string[];
}

export interface JobUpsertDTO {
  jdTitle: string;
  jdDesc: string;
  jdSalMin: number | null;
  jdSalMax: number | null;
  jdStatus: JobStatus;
  jdTarget: number;
  jdMajor: string | null;
  depId: string;
  recruiterId: string;
  dtId: string | null;
  skillIds: string[];
  campaignIds: string[];
}

export interface JobLookups {
  departments: DepartmentView[];
  recruiters: Option[];
  degreeTypes: Option[];
  skills: Option[];
  campaigns: Option[];
}

export interface JobFilterParams {
  keyword?: string;
  status?: JobStatus | "";
  depId?: string;
  page?: number;
  size?: number;
}