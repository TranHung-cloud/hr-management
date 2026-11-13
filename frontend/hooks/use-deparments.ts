"use client";

import { useApi } from "@/hooks/use-api";
import type { DepartmentView } from "@/types/department";

export function useDepartments() {
  return useApi<DepartmentView[]>("departments");
}
