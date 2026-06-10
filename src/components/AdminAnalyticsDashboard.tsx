"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClientAnalyticsSummary } from "@/types/analytics";

type AnalyticsResponse = { analytics: ClientAnalyticsSummary[]; error: string | null; isConfigured: boolean };

function valueOrDash(value: number | null, suffix = "") {
  return value === null ? "-" : `${value}${suffix}`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function changeClass(value: number | null) {
  if (value === null) return "text-[var(--muted)]";
  if (value < 0) return "text-green-700";
  if (value > 0) return "text-red-700";
  return "text-[var(--muted)]";
}

function barWidth(value: number | null) {
  return `${Math.max(0, Math.min(100, value || 0))}%`;
}

export function AdminAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<ClientAnalyticsSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAnalytics() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analytics", { cache: "no-store" });
      const result = (await response.json()) as AnalyticsResponse;
      setIsConfigured(result.isConfigured);
      setAnalytics(result.analytics || []);
      if (result.error) setError(result.error);
    } catch {
      setError("Не удалось загрузить аналитику прогресса");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const totals = useMemo(() => {
    const clientsWithReports = analytics.filter((item) => item.reports_count > 0).length;
    const clientsWithMeasurements = analytics.filter((item) => item.measurements_count > 0).length;
    const avgCompletion = analytics.length === 0
      ? null
      : Math.round(analytics.reduce((sum, item) => sum + (item.completion_rate || 0), 0) / analytics.length);
    const highPain = analytics.filter((item) => (item.avg_pain_level || 0) >= 7).length;
    return { clients: analytics.length, clientsWithReports, clientsWithMeasurements, avgCompletion, highPain };
  }, [analytics]);

  const bestCompletion = [...analytics]
    .filter((item) => item.completion_rate !== null)
    .sort((a, b) => (b.completion_rate || 0) - (a.completion_rate || 0))
    .slice(0, 5);

  if (isLoading) return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка аналитики...</div>;
  if (!isConfigured) return <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">Supabase не настроен или таблицы аналитики ещё не созданы.</div>;

  return (
    <div className="mt-8 space-y-6">
      {error && <div className="rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Клиентов</p><p className="mt-2 text-3xl font-black">{totals.clients}</p></div>
        <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">С отчётами</p><p className="mt-2 text-3xl font-black">{totals.clientsWithReports}</p></div>
        <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">С замерами</p><p className="mt-2 text-3xl font-black">{totals.clientsWithMeasurements}</p></div>
        <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Выполнение</p><p className="mt-2 text-3xl font-black">{valueOrDash(totals.avgCompletion, "%")}</p></div>
        <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Риск боли</p><p className="mt-2 text-3xl font-black">{totals.highPain}</p></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <h2 className="text-2xl font-black">Сводка по клиентам</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="py-3 pr-3">Клиент</th>
                  <th className="py-3 pr-3">Отчёты</th>
                  <th className="py-3 pr-3">Замеры</th>
                  <th className="py-3 pr-3">Вес</th>
                  <th className="py-3 pr-3">Талия</th>
                  <th className="py-3 pr-3">Выполнение</th>
                  <th className="py-3 pr-3">Боль</th>
                  <th className="py-3 pr-3">Энергия</th>
                  <th className="py-3 pr-3">Последний отчёт</th>
                </tr>
              </thead>
              <tbody>
                {analytics.length === 0 ? (
                  <tr><td colSpan={9} className="py-8 text-center text-[var(--muted)]">Данных пока нет.</td></tr>
                ) : analytics.map((item) => (
                  <tr key={item.client_id} className="border-b border-[var(--border)] align-top">
                    <td className="py-4 pr-3 font-black">{item.client_name}</td>
                    <td className="py-4 pr-3">{item.reports_count}</td>
                    <td className="py-4 pr-3">{item.measurements_count}</td>
                    <td className="py-4 pr-3"><span className={changeClass(item.body_weight_change)}>{valueOrDash(item.body_weight_change, " кг")}</span></td>
                    <td className="py-4 pr-3"><span className={changeClass(item.waist_change)}>{valueOrDash(item.waist_change, " см")}</span></td>
                    <td className="py-4 pr-3">{valueOrDash(item.completion_rate, "%")}</td>
                    <td className="py-4 pr-3">{valueOrDash(item.avg_pain_level, "/10")}</td>
                    <td className="py-4 pr-3">{valueOrDash(item.avg_energy_level, "/10")}</td>
                    <td className="py-4 pr-3">{formatDate(item.last_report_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <h2 className="text-2xl font-black">Топ выполнения</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Клиенты с лучшей дисциплиной по отчётам.</p>
          <div className="mt-5 space-y-4">
            {bestCompletion.length === 0 ? <p className="text-sm text-[var(--muted)]">Пока нет отчётов для расчёта.</p> : bestCompletion.map((item) => (
              <div key={item.client_id}>
                <div className="flex justify-between gap-3 text-sm font-black">
                  <span>{item.client_name}</span>
                  <span>{valueOrDash(item.completion_rate, "%")}</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--background)]">
                  <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: barWidth(item.completion_rate) }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[var(--background)] p-4 text-sm text-[var(--muted)]">
            Красный флаг: средняя боль 7/10 и выше. Такого клиента лучше сразу переводить на облегчённую программу и проверять технику.
          </div>
        </div>
      </div>
    </div>
  );
}
