import type { Identity } from "../types/careers";

export function isStaff(user: Identity | null | undefined) {
  return !!user?.roles.some(role => ["HR_MANAGER", "RECRUITER", "INTERVIEWER"].includes(role));
}
export function safeCandidateReturn(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.includes("\\")) return "/jobs";
  try {
    const url = new URL(value, "https://recruithr.invalid");
    if (url.origin !== "https://recruithr.invalid") return "/jobs";
    if (url.pathname === "/jobs" || url.pathname === "/candidate/profile" || /^\/jobs\/[0-9a-f-]{36}$/i.test(url.pathname)) return url.pathname + url.search;
  } catch { /* Invalid return targets fall back to the public catalogue. */ }
  return "/jobs";
}
export function loginDestination(user: Identity, next?: string | null) {
  return isStaff(user) ? "/admin/dashboard" : safeCandidateReturn(next);
}
