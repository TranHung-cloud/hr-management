"use client";

import { useCallback, useMemo, useState } from "react";
import type { PageResponse } from "@/types/account";
import type { JobDetail, JobFilterParams, JobLookups, JobUpsertDTO, JobView } from "@/types/job";
import { api, useApi } from "@/hooks/use-api";

export function useJobLookups() {
  return useApi<JobLookups>("admin/jobs/lookups");
}

export function useJobs(filters: JobFilterParams) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.keyword?.trim()) params.set("keyword", filters.keyword.trim());
    if (filters.status) params.set("status", filters.status);
    if (filters.depId) params.set("depId", filters.depId);
    params.set("page", String(filters.page ?? 0));
    params.set("size", String(filters.size ?? 8));
    return `admin/jobs?${params.toString()}&refresh=${refresh}`;
  }, [filters.keyword, filters.status, filters.depId, filters.page, filters.size, refresh]);

  const { data, loading, error, reload: reloadApi } = useApi<PageResponse<JobView>>(query);

  const reload = useCallback(() => {
    setRefresh((prev) => prev + 1);
    reloadApi();
  }, [reloadApi]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) =>
      ids.length > 0 && ids.every((id) => prev.includes(id))
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const createJob = useCallback(
    async (dto: JobUpsertDTO) => {
      await api<void>("admin/jobs/create", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      reload();
    },
    [reload]
  );

  const updateJob = useCallback(
    async (id: string, dto: JobUpsertDTO) => {
      await api<void>(`admin/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      });
      reload();
    },
    [reload]
  );

  const closeJobs = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return;
      await api<void>("admin/jobs/close", {
        method: "POST",
        body: JSON.stringify(ids),
      });
      clearSelection();
      reload();
    },
    [clearSelection, reload]
  );

  const deleteJob = useCallback(
    async (id: string) => {
      await api<void>(`admin/jobs/${id}`, {
        method: "DELETE",
      });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      reload();
    },
    [reload]
  );

  const getJobDetail = useCallback(async (id: string): Promise<JobDetail> => {
    return await api<JobDetail>(`admin/jobs/${id}`, {
      method: "GET",
    });
  }, []);

  return {
    data,
    loading,
    error,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    createJob,
    updateJob,
    closeJobs,
    deleteJob,
    getJobDetail,
    reload,
  };
}