"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initialInterviews } from "@/lib/recruitment-data";
import type { Interview } from "@/types/recruitment";
const RecruitmentContext = createContext<{ interviews: Interview[]; updateInterview: (id: string, changes: Partial<Interview>) => void; notify: (text: string) => void } | null>(null);
export function RecruitmentProvider({ children }: { children: ReactNode }) {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [message]);
  function notify(text: string) { setMessage(text); }
  function updateInterview(id: string, changes: Partial<Interview>) { setInterviews(rows => rows.map(row => row.id === id ? { ...row, ...changes } : row)); }
  return <RecruitmentContext.Provider value={{ interviews, updateInterview, notify }}>{children}{message && <div className="toast" role="status"><span>{message}</span><button aria-label="Đóng thông báo" onClick={() => setMessage("")}>×</button></div>}</RecruitmentContext.Provider>;
}
export function useRecruitment() { const value = useContext(RecruitmentContext); if (!value) throw new Error("RecruitmentProvider is required"); return value; }
