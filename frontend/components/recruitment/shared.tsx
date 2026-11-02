"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { initials, statusLabels } from "@/lib/recruitment-data";
import type { InterviewStatus } from "@/types/recruitment";
export function Avatar({ name, index = 0, large = false }: { name: string; index?: number; large?: boolean }) { return <span className={`avatar tone-${index % 5} ${large ? "large" : ""}`}>{initials(name)}</span>; }
export function Status({ status }: { status: InterviewStatus }) { return <span className={`status status-${status}`}><span />{statusLabels[status]}</span>; }
export function Empty({ children }: { children: ReactNode }) { return <div className="empty-state">{children}</div>; }
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog className="modal" ref={ref} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="modal-title"><div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Đóng"><X size={19} /></button></div>{children}</dialog>;
}
