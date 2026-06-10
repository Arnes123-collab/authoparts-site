"use client";

import { FormEvent, useState } from "react";
import type { WorkoutCompleted } from "@/types/progress-report";

type ReportForm = {
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

export function ClientReportForm() {
  const [form, setForm] = useState<ReportForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function updateField<K extends keyof ReportForm>(key: K, value: ReportForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
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
        body: JSON.stringify({ ...form, client_id: null }),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка отправки отчёта");
      setMessage("Отчёт отправлен тренеру");
      setForm(initialForm);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка отправки отчёта");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-3xl rounded-3xl sport-card p-6 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <input required placeholder="Ваше имя" value={form.client_name} onChange={(event) => updateField("client_name", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="WhatsApp" value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input type="date" value={form.report_date} onChange={(event) => updateField("report_date", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <select value={form.workout_completed} onChange={(event) => updateField("workout_completed", event.target.value as WorkoutCompleted)} className="rounded-xl border border-[var(--border)] p-3">
          <option value="yes">Тренировку выполнил</option>
          <option value="partial">Выполнил частично</option>
          <option value="no">Не выполнил</option>
        </select>
        <input placeholder="Вес тела" value={form.body_weight} onChange={(event) => updateField("body_weight", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Сон, часов" value={form.sleep_hours} onChange={(event) => updateField("sleep_hours", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Качество сна 1-10" value={form.sleep_quality} onChange={(event) => updateField("sleep_quality", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Энергия 1-10" value={form.energy_level} onChange={(event) => updateField("energy_level", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Боль 1-10" value={form.pain_level} onChange={(event) => updateField("pain_level", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Вода, л" value={form.water_liters} onChange={(event) => updateField("water_liters", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Калории" value={form.calories} onChange={(event) => updateField("calories", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Белки, г" value={form.protein} onChange={(event) => updateField("protein", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Жиры, г" value={form.fats} onChange={(event) => updateField("fats", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        <input placeholder="Углеводы, г" value={form.carbs} onChange={(event) => updateField("carbs", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
      </div>
      <textarea placeholder="Комментарий: что было тяжело, где болело, что не получилось" value={form.comment} onChange={(event) => updateField("comment", event.target.value)} className="mt-3 min-h-32 w-full rounded-xl border border-[var(--border)] p-3" />
      {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
      {message && <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}
      <button disabled={isSaving} className="mt-5 w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white disabled:opacity-60">
        {isSaving ? "Отправляю..." : "Отправить отчёт"}
      </button>
    </form>
  );
}
