"use client";

import { useApi } from "@/hooks/use-api";
import type { RoleView } from "@/types/role";

export function useRoles() {
  return useApi<RoleView[]>("roles");
}
