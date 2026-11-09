export type ApplicationStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED";
export type InterviewStatus = "UNSCHEDULED" | "SCHEDULED" | "COMPLETED" | "REJECTED";
export interface Option { id: string; name: string | null }
export interface Stage extends Option { order: number | null }
export interface Job { id: string; title: string | null; department: string | null; status: "DRAFT" | "PUBLISHED" }
export interface Candidate { id: string; name: string | null; email: string | null; phone: string | null; cvPath: string | null; experienceYears: number | null; degree: string | null; major: string | null; skills: string[] }
export interface InterviewKey { candidateId: string; jobId: string; stageId: string }
export interface Interview { id: InterviewKey; candidate: Candidate; job: Job; stage: Stage; status: InterviewStatus; createdAt: string | null; scheduledAt: string | null; feedback: string | null; interviewer: Option | null; method: Option | null; applicationStatus: ApplicationStatus }
export interface Application { candidateId: string; jobId: string; candidate: Candidate; job: Job; status: ApplicationStatus; currentInterview: Interview | null }
export interface Lookups { stages: Stage[]; methods: Option[]; interviewers: Option[]; jobs: Job[] }
export interface PageResult<T> { content: T[]; totalElements: number; page: number; size: number }
export interface Detail { interview: Interview; rounds: Interview[] }
export interface Dashboard { openJobs: number; totalApplications: number; totalCandidates: number; acceptedApplications: number; interviewsToday: number; upcomingInterviews: number; stages: { stageId: string; name: string; count: number }[]; applicationsWithoutStage: number; dailyInterviews: { date: string; count: number }[] }
