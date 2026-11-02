export type StageId = "screening" | "hr" | "technical" | "offer" | "hired";
export type InterviewStatus = "scheduled" | "passed" | "failed";

// UI view models; the approved CDM is unchanged.
export interface Interview {
  id: string; name: string; email: string; phone: string;
  job: string; department: string; stage: StageId; status: InterviewStatus;
  date: string; time: string; endTime: string; interviewer: string;
  method: "Trực tuyến" | "Trực tiếp"; location: string;
  experience: number; degree: string; skills: string[]; feedback: string;
  history: { title: string; date: string; note: string }[];
}
