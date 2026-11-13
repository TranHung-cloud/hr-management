"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AccountView,
  AccountFilterParams,
  AdminAccountCreateDTO,
  PageResponse,
  AccountDetail,
} from "@/types/account";
import {api, useApi} from "@/hooks/use-api";

export function useAccounts(filters: AccountFilterParams) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(0);
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.keyword?.trim()) params.set("keyword", filters.keyword.trim());
    if (filters.roleId) params.set("roleId", filters.roleId);
    if (filters.depId) params.set("depId", filters.depId);
    params.set("page", String(filters.page ?? 0));
    params.set("size", String(filters.size ?? 10));
    return `admin/accounts?${params.toString()}&refresh=${refresh}`;
  }, [filters.keyword, filters.roleId, filters.depId, filters.page, filters.size, refresh]);
  
  const { data, loading, error, reload: reloadApi, } = useApi<PageResponse<AccountView>>(query);
  const reload = useCallback(() => {
    setRefresh((prev) => prev + 1);
    reloadApi();
  }, [reloadApi]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id] ); 
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => ids.length > 0 && ids.every((id) => prev.includes(id)) ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
  );}, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const createAccount = useCallback(async (dto: AdminAccountCreateDTO) => {
    await api<void>("admin/accounts/create", { method: "POST", body: JSON.stringify(dto) });
    reload();
  }, [reload]);

  const lockAccounts = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    await api<void>("admin/accounts/set-inactive", { method: "POST", body: JSON.stringify(ids) });
    clearSelection();
    reload();
  }, [clearSelection, reload]);

  const unlockAccounts = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    await api<void>("admin/accounts/set-active", { method: "POST", body: JSON.stringify(ids) });
    clearSelection();
    reload();
  }, [clearSelection, reload]);

  const getAccountDetails = useCallback(async (id: string): Promise<AccountDetail> => {
    return await api<AccountDetail>(`admin/accounts/${id}`, {
      method: "GET",
    });
  }, []);

  return { data, loading, error, selectedIds, toggleSelect, toggleSelectAll, clearSelection, createAccount, lockAccounts, unlockAccounts, getAccountDetails, reload };
}