"use client";

import React, { useState, useEffect } from "react";
import { JobItem } from "@/types/jobs";
import { Sidebar } from "@/components/ui/jobs/sidebar";
import { Header } from "@/components/ui/jobs/header";
import { JobFilterTabs } from "@/components/ui/jobs/job-filter-tabs";
import { JobFilterBar } from "@/components/ui/jobs/job-filter-bar";
import { JobSelectedBar } from "@/components/ui/jobs/job-selected-bar";
import { JobTable } from "@/components/ui/jobs/job-table";
import { JobToast } from "@/components/ui/jobs/job-toast";

export default function Home() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/public/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể kết nối Backend");
        return res.json();
      })
      .then((data: JobItem[]) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải dữ liệu từ hr_db:", err);
        setLoading(false);
      });
  }, []);

  const selectedCount = jobs.filter((j) => j.checked).length;

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setJobs(jobs.map((j) => ({ ...j, checked })));
  };

  const handleToggleSelectOne = (id: string) => {
    setJobs(
      jobs.map((j) => (j.id === id ? { ...j, checked: !j.checked } : j))
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f4ece1]/30 font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <div className="p-6 space-y-4 max-w-[1400px]">
          <JobFilterTabs />
          <JobFilterBar />
          <JobSelectedBar selectedCount={selectedCount} />

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-500 font-medium">
              Đang tải danh sách tin tuyển dụng từ PostgreSQL...
            </div>
          ) : (
            <JobTable
              jobs={jobs}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectOne={handleToggleSelectOne}
            />
          )}
        </div>
        <JobToast show={showToast} onClose={() => setShowToast(false)} />
      </main>
    </div>
  );
}