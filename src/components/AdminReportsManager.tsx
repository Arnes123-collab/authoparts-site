"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Client } from "@/types/client";
import type { ProgressReportListItem, WorkoutCompleted } from "@/types/progress-report";

type ClientsResponse = { clients: Client[]; error: string | null; isConfigured: boolean };
type ReportsResponse = { reports: ProgressReportListItem[]; error: string | null; isConfigured: boolean };

type ReportForm = {
  client_id: string;
  client_name: string;
  whatsapp: string;
  report_date: string;
  workout_completed: WorkoutCompleted;
  body_weight: string;
  sleep_hours: string;
  sleep_quality: string;
  energy_level: string;
  pain_level: string;
  water_liters: string;
  calories: string;
  protein: string;
  fats: string;
  carbs: string;
  comment: string;
};

const initialForm: ReportForm = {
  client_id: "",
  client_name: "",
  whatsapp: "",
  report_date: new Date().toISOString().slice(0, 10),
  workout_completed: "yes",
  body_weight: "",
  sleep_hours: "",
  sleep_quality: "",
  energy_level: "",
  pain_level: "",
  water_liters: "",
  calories: "",
  protein: "",
  fats: "",
  carbs: "",
  comment: "",
};

const workoutLabels: Record<WorkoutCompleted, string> = {
  yes: "Выполнил",
  partial: "Частично",
  no: "Не выполнил",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function score(value: number | null) {
  return value === null ? "-" : `${value}/10`;
}

export function AdminReportsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [reports, setReports] = useState<ProgressReportListItem[]>([]);
  const [form, setForm] = useState<ReportForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [clientsResponse, reportsResponse] = await Promise.all([
        fetch("/api/clients", { cache: "no-store" }),
        fetch("/api/progress-reports", { cache: "no-store" }),
      ]);
      const clientsResult = (await clientsResponse.json()) as ClientsResponse;
      const reportsResult = (await reportsResponse.json()) as ReportsResponse;
      setIsConfigured(clientsResult.isConfigured && reportsResult.isConfigured);
      setClients(clientsResult.clients || []);
      setReports(reportsResult.reports || []);
      if (clientsResult.error) setError(clientsResult.error);
      if (reportsResult.error) setError(reportsResult.error);
    } catch {
      setError("Не удалось загрузить отчёты клиентов");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        acc.total += 1;
        if (report.workout_completed === "yes") acc.done += 1;
        if ((report.pain_level || 0) >= 7) acc.highPain += 1;
        if ((report.energy_level || 0) <= 4 && report.energy_level !== null) acc.lowEnergy += 1;
        return acc;
      },
      { total: 0, done: 0, highPain: 0, lowEnergy: 0 },
    );
  }, [reports]);

  function updateField<K extends keyof ReportForm>(key: K, value: ReportForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectClient(clientId: string) {
    const client = clients.find((item) => item.id === clientId);
    setForm((current) => ({
      ...current,
      client_id: clientId,
      client_name: client?.name || current.client_name,
      whatsapp: client?.whatsapp || current.whatsapp,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/progress-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка сохранения отчёта");
      setMessage(result.message || "Отчёт добавлен");
      setForm(initialForm);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения отчёта");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteReport(reportId: string) {
    if (!window.confirm("Удалить отчёт клиента?")) return;
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/progress-reports/${reportId}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка удаления отчёта");
      setMessage(result.message || "Отчёт удалён");
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления отчёта");
    }
  }

  if (isLoading) return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка отчётов...</div>;
  if (!isConfigured) return <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">Supabase не настроен или таблица progress_reports ещё не создана.</div>;

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[430px_1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl sport-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">Добавить отчёт</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Тренировка, вес, сон, энергия, боль и питание за день.</p>

        <label className="mt-5 block text-sm font-black">Клиент из базы</label>
        <select value={form.client_id} onChange={(event) => selectClient(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
          <option value="">Без привязки</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
        </select>

        <input placeholder="Имя клиента" value={form.client_name} onChange={(event) => updateField("client_name", event.target.value)} className="mt-4 w-full rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="WhatsApp" value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} className="mt-3 w-full rounded-xl border border-[var(--border)] p-3" />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <input type="date" value={form.report_date} onChange={(event) => updateField("report_date", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <select value={form.workout_completed} onChange={(event) => updateField("workout_completed", event.target.value as WorkoutCompleted)} className="rounded-xl border border-[var(--border)] p-3">
            <option value="yes">Выполнил</option>
            <option value="partial">Частично</option>
            <option value="no">Не выполнил</option>
          </select>
          <input placeholder="Вес тела" value={form.body_weight} onChange={(event) => updateField("body_weight", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Сон, часов" value={form.sleep_hours} onChange={(event) => updateField("sleep_hours", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Сон 1-10" value={form.sleep_quality} onChange={(event) => updateField("sleep_quality", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Энергия 1-10" value={form.energy_level} onChange={(event) => updateField("energy_level", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Боль 1-10" value={form.pain_level} onChange={(event) => updateField("pain_level", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Вода, л" value={form.water_liters} onChange={(event) => updateField("water_liters", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Калории" value={form.calories} onChange={(event) => updateField("calories", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Белки, г" value={form.protein} onChange={(event) => updateField("protein", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Жиры, г" value={form.fats} onChange={(event) => updateField("fats", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Углеводы, г" value={form.carbs} onChange={(event) => updateField("carbs", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        </div>
        <textarea placeholder="Комментарий клиента / тренера" value={form.comment} onChange={(event) => updateField("comment", event.target.value)} className="mt-4 min-h-28 w-full rounded-xl border border-[var(--border)] p-3" />

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}

        <button disabled={isSaving} className="mt-5 w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white disabled:opacity-60">
          {isSaving ? "Сохраняю..." : "Сохранить отчёт"}
        </button>
      </form>

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Всего</p><p className="mt-2 text-3xl font-black">{summary.total}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Выполнено</p><p className="mt-2 text-3xl font-black">{summary.done}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Боль 7+</p><p className="mt-2 text-3xl font-black">{summary.highPain}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Энергия низкая</p><p className="mt-2 text-3xl font-black">{summary.lowEnergy}</p></div>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-3xl sport-card p-8 text-center shadow-sm">Отчётов пока нет.</div>
        ) : reports.map((report) => (
          <article key={report.id} className="rounded-3xl sport-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">{formatDate(report.report_date)} · {workoutLabels[report.workout_completed]}</p>
                <h3 className="mt-1 text-2xl font-black">{report.linked_client_name || report.client_name || "Клиент"}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">WhatsApp: {report.whatsapp || "-"}</p>
              </div>
              <button onClick={() => deleteReport(report.id)} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700">Удалить</button>
            </div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
              <p><b>Вес:</b> {report.body_weight ?? "-"} кг</p>
              <p><b>Сон:</b> {report.sleep_hours ?? "-"} ч / {score(report.sleep_quality)}</p>
              <p><b>Энергия:</b> {score(report.energy_level)}</p>
              <p><b>Боль:</b> {score(report.pain_level)}</p>
              <p><b>Вода:</b> {report.water_liters ?? "-"} л</p>
              <p><b>Ккал:</b> {report.calories ?? "-"}</p>
              <p><b>БЖУ:</b> {report.protein ?? "-"}/{report.fats ?? "-"}/{report.carbs ?? "-"}</p>
            </div>
            {report.comment && <p className="mt-4 rounded-2xl border border-[var(--border)] p-4 text-sm"><b>Комментарий:</b> {report.comment}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
