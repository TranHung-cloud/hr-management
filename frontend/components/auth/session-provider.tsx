"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Identity } from "@/types/careers";

interface AuthContext {
  user: Identity | null; ready: boolean;
  signIn: (email: string, password: string) => Promise<Identity>;
  logout: () => Promise<void>;
}
const Context = createContext<AuthContext | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Identity | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/session", { cache: "no-store", signal: controller.signal }).then(async response => response.ok ? response.json() : null)
      .then(value => { if (!controller.signal.aborted) { setUser(value?.username ? value : null); setReady(true); } })
      .catch(() => { if (!controller.signal.aborted) { setUser(null); setReady(true); } });
    const unauthorized = () => setUser(null);
    window.addEventListener("recruitment:unauthorized", unauthorized);
    return () => { controller.abort(); window.removeEventListener("recruitment:unauthorized", unauthorized); };
  }, []);
  const signIn = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: email.trim(), password }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || "Không đăng nhập được.");
    setUser(result); setReady(true); return result as Identity;
  }, []);
  const logout = useCallback(async () => {
    const response = await fetch("/api/session", { method: "DELETE" });
    if (!response.ok) throw new Error("Chưa đăng xuất được. Vui lòng thử lại.");
    setReady(false); setUser(null);
    window.location.replace("/jobs");
  }, []);
  return <Context.Provider value={{ user, ready, signIn, logout }}>{children}</Context.Provider>;
}
export function useSession() {
  const value = useContext(Context);
  if (!value) throw new Error("SessionProvider is required.");
  return value;
}
