"use client";
import { useCallback, useEffect, useState } from "react";
export class CareerError extends Error { constructor(public status: number, message: string) { super(message); } }
export async function careerRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (options?.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...options, headers, cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new CareerError(response.status, data.detail || data.message || "Không tải được dữ liệu.");
  return data;
}
export function useCareerQuery<T>(url: string | null) {
  const [attempt, setAttempt] = useState(0);
  const key = `${url}:${attempt}`;
  const [state, setState] = useState<{ key: string; data?: T; error?: CareerError }>({ key: "" });
  useEffect(() => {
    if (!url) return;
    const abort = new AbortController();
    careerRequest<T>(url, { signal: abort.signal }).then(data => { if (!abort.signal.aborted) setState({ key, data }); })
      .catch(error => { if (!abort.signal.aborted) setState({ key, error: error instanceof CareerError ? error : new CareerError(0, "Chưa kết nối được hệ thống tuyển dụng.") }); });
    return () => abort.abort();
  }, [url, key]);
  const reload = useCallback(() => setAttempt(n => n + 1), []);
  return { data: state.key === key ? state.data : undefined, error: state.key === key ? state.error : undefined, loading: !!url && state.key !== key, reload };
}
