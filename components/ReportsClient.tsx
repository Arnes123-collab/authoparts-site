"use client";

import { useState } from "react";
import type { DailyReport } from "@/types/daily-report";
import ReportStats from "@/components/ReportStats";
import DailyReportForm from "@/components/DailyReportForm";
import DailyReportsTable from "@/components/DailyReportsTable";

type ReportsClientProps = {
  initialReports: DailyReport[];
};

export default function ReportsClient({ initialReports }: ReportsClientProps) {
  const [reports, setReports] = useState<DailyReport[]>(initialReports);

  function handleCreated(report: DailyReport) {
    setReports((current) => [report, ...current]);
  }

  return (
    <>
      <ReportStats reports={reports} />

      <div className="grid lg:grid-cols-[minmax(0,1fr)] gap-8 mb-8">
        <DailyReportForm onCreated={handleCreated} />
      </div>

      <DailyReportsTable reports={reports} />
    </>
  );
}
