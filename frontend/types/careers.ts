export interface Identity { accountId: string; username: string; displayName: string | null; roles: string[] }
export interface CareerOption { id: string; name: string }
export interface CareerFilters { departments: CareerOption[]; degrees: CareerOption[] }
export interface CareerJob {
  id: string; title: string; description: string; department: string | null; departmentId: string | null;
  salaryMin: number | null; salaryMax: number | null; target: number; major: string | null;
  degree: string | null; degreeId: string | null; skills: string[];
}
export interface CareerPage { content: CareerJob[]; totalElements: number; page: number; size: number }
export interface CandidateProfile {
  name: string; email: string; phone: string | null; experienceYears: number | null; major: string | null;
  degree: string | null; skills: string[]; hasCv: boolean; cvName: string | null;
}
export interface ApplicationReceipt { applicationId: string; status: string; createdAt: string }
export interface ApplicationState { applied: boolean; application: ApplicationReceipt | null }
