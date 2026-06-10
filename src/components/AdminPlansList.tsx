"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TrainingPlanListItem } from "@/types/training-plan";

type ApiResponse = {
  plans: TrainingPlanListItem[];
  error: string | null;
  isConfigured: boolean;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

export function AdminPlansList() {
  const [data, setData] = useState<ApiResponse>({ plans: [], error: null, isConfigured: true });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch("/api/training-plans", { cache: "no-store" });
        const result = (await response.json()) as ApiResponse;
        setData(result);
      } catch {
        setData({ plans: [], error: "Не удалось загрузить тренировочные планы", isConfigured: true });
      } finally {
        setIsLoading(false);
      }
    }

    loadPlans();
  }, []);

  if (isLoading) {
    return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка планов...</div>;
  }

  if (!data.isConfigured) {
    return <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">Supabase ещё не настроен. Создайте таблицы training_plans и training_plan_items.</div>;
  }

  if (data.error) {
    return <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">Ошибка: {data.error}</div>;
  }

  if (data.plans.length === 0) {
    return (
      <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">
        <h2 className="text-2xl font-black">Планов пока нет</h2>
        <p className="mt-3 text-[var(--muted)]">Создайте первый тренировочный план для клиента.</p>
        <Link href="/admin/plans/new" className="mt-6 inline-block rounded-xl bg-[var(--accent)] px-6 py-3 font-black text-white">Создать план</Link>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl sport-card shadow-sm">
      <div className="border-b border-[var(--border)] p-6">
        <h2 className="text-2xl font-black">Список тренировочных планов</h2>
        <p className="mt-2 text-[var(--muted)]">Новые планы показываются сверху.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[var(--background)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="p-4">План</th>
              <th className="p-4">Клиент</th>
              <th className="p-4">Цель</th>
              <th className="p-4">Период</th>
              <th className="p-4">Действие</th>
            </tr>
          </thead>
          <tbody>
            {data.plans.map((plan) => (
              <tr key={plan.id} className="border-t border-[var(--border)] align-top">
                <td className="p-4 font-black">{plan.title}</td>
                <td className="p-4">{plan.client_name || "Клиент не найден"}</td>
                <td className="p-4">{plan.goal || "-"}</td>
                <td className="p-4">{formatDate(plan.start_date)} - {formatDate(plan.end_date)}</td>
                <td className="p-4">
                  <Link href={`/admin/plans/${plan.id}`} className="rounded-xl border border-[var(--border)] px-4 py-2 font-bold">Открыть</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
