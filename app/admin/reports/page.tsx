import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ReportsClient from "@/components/ReportsClient";
import { supabase } from "@/lib/supabase";
import {
  mapDailyReportFromDb,
  type DailyReportDbRow,
} from "@/types/daily-report";

export default async function ReportsPage() {
  const { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .order("report_date", { ascending: false })
    .returns<DailyReportDbRow[]>();

  const reports = data ? data.map(mapDailyReportFromDb) : [];

  return (
    <main>
      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-accent font-semibold mb-2">
              Контроль продавца
            </p>

            <h1 className="text-4xl font-bold">
              Дневные отчёты
            </h1>

            <p className="text-secondaryText mt-2">
              Смотрите не только заявки, но и реальные действия за день.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="btn-secondary">
              Назад в CRM
            </Link>

            <LogoutButton />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-danger p-4 text-white">
            Не удалось загрузить отчёты. Проверьте Supabase и SQL-таблицу daily_reports.
          </div>
        )}

        <ReportsClient initialReports={reports} />
      </div>
    </main>
  );
}
