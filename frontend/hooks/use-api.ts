"use client";
import { useCallback, useEffect, useState } from "react";
import { useRecruitment } from "@/components/recruitment/provider";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`/api/backend/${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    if (response.status === 401) {
      window.dispatchEvent(new Event("recruitment:unauthorized"));
    }

    throw new ApiError(
      response.status,
      error.detail || error.message || `Lỗi HTTP ${response.status}`
    );
  }

  // Xử lý response không có body
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text.trim()) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export function useApi<T>(path: string | null) {
  const { revision } = useRecruitment();
  const [retry, setRetry] = useState(0);
  const key = `${path}:${revision}:${retry}`;
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>({ key: "" });
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    api<T>(path, { signal: controller.signal }).then(data => {
      if (!controller.signal.aborted) setState({ key, data });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ key, error: error.message || "Không tải được dữ liệu." });
    });
    return () => controller.abort();
  }, [path, key]);
  const reload = useCallback(() => setRetry(n => n + 1), []);
  return { data: state.key === key ? state.data : undefined, error: state.key === key ? state.error : undefined, loading: !!path && state.key !== key, reload };
}
