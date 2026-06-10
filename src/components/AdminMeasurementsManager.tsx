"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Client } from "@/types/client";
import type { BodyMeasurementListItem } from "@/types/body-measurement";

type ClientsResponse = { clients: Client[]; error: string | null; isConfigured: boolean };
type MeasurementsResponse = { measurements: BodyMeasurementListItem[]; error: string | null; isConfigured: boolean };

type MeasurementForm = {
  client_id: string;
  measurement_date: string;
  body_weight: string;
  chest: string;
  waist: string;
  hips: string;
  thigh: string;
  arm: string;
  shoulder: string;
  comment: string;
};

const initialForm: MeasurementForm = {
  client_id: "",
  measurement_date: new Date().toISOString().slice(0, 10),
  body_weight: "",
  chest: "",
  waist: "",
  hips: "",
  thigh: "",
  arm: "",
  shoulder: "",
  comment: "",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function cm(value: number | null) {
  return value === null ? "-" : `${value} см`;
}

function kg(value: number | null) {
  return value === null ? "-" : `${value} кг`;
}

export function AdminMeasurementsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurementListItem[]>([]);
  const [form, setForm] = useState<MeasurementForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [clientsResponse, measurementsResponse] = await Promise.all([
        fetch("/api/clients", { cache: "no-store" }),
        fetch("/api/body-measurements", { cache: "no-store" }),
      ]);
      const clientsResult = (await clientsResponse.json()) as ClientsResponse;
      const measurementsResult = (await measurementsResponse.json()) as MeasurementsResponse;
      setIsConfigured(clientsResult.isConfigured && measurementsResult.isConfigured);
      setClients(clientsResult.clients || []);
      setMeasurements(measurementsResult.measurements || []);
      if (clientsResult.error) setError(clientsResult.error);
      if (measurementsResult.error) setError(measurementsResult.error);
    } catch {
      setError("Не удалось загрузить замеры тела");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    const uniqueClients = new Set(measurements.map((item) => item.client_id)).size;
    const withWaist = measurements.filter((item) => item.waist !== null).length;
    const withWeight = measurements.filter((item) => item.body_weight !== null).length;
    return { total: measurements.length, uniqueClients, withWaist, withWeight };
  }, [measurements]);

  function updateField<K extends keyof MeasurementForm>(key: K, value: MeasurementForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/body-measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка сохранения замера");
      setMessage(result.message || "Замер сохранён");
      setForm(initialForm);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения замера");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteMeasurement(measurementId: string) {
    if (!window.confirm("Удалить замер тела?")) return;
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/body-measurements/${measurementId}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка удаления замера");
      setMessage(result.message || "Замер удалён");
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления замера");
    }
  }

  if (isLoading) return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка замеров...</div>;
  if (!isConfigured) return <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">Supabase не настроен или таблица body_measurements ещё не создана.</div>;

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[430px_1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl sport-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">Добавить замер</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Вес и сантиметры: талия, грудь, бёдра, бедро, рука, плечи.</p>

        <label className="mt-5 block text-sm font-black">Клиент</label>
        <select value={form.client_id} onChange={(event) => updateField("client_id", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" required>
          <option value="">Выбрать клиента</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
        </select>

        <input type="date" value={form.measurement_date} onChange={(event) => updateField("measurement_date", event.target.value)} className="mt-4 w-full rounded-xl border border-[var(--border)] p-3" />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <input placeholder="Вес, кг" value={form.body_weight} onChange={(event) => updateField("body_weight", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Грудь, см" value={form.chest} onChange={(event) => updateField("chest", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Талия, см" value={form.waist} onChange={(event) => updateField("waist", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Бёдра, см" value={form.hips} onChange={(event) => updateField("hips", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Бедро, см" value={form.thigh} onChange={(event) => updateField("thigh", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Рука, см" value={form.arm} onChange={(event) => updateField("arm", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Плечи, см" value={form.shoulder} onChange={(event) => updateField("shoulder", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        </div>

        <textarea placeholder="Комментарий" value={form.comment} onChange={(event) => updateField("comment", event.target.value)} className="mt-4 min-h-24 w-full rounded-xl border border-[var(--border)] p-3" />

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}

        <button disabled={isSaving || clients.length === 0} className="mt-5 w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white disabled:opacity-60">
          {isSaving ? "Сохраняю..." : "Сохранить замер"}
        </button>
      </form>

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Всего замеров</p><p className="mt-2 text-3xl font-black">{summary.total}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Клиентов</p><p className="mt-2 text-3xl font-black">{summary.uniqueClients}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">С талией</p><p className="mt-2 text-3xl font-black">{summary.withWaist}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">С весом</p><p className="mt-2 text-3xl font-black">{summary.withWeight}</p></div>
        </div>

        {measurements.length === 0 ? (
          <div className="rounded-3xl sport-card p-8 text-center shadow-sm">Замеров пока нет.</div>
        ) : measurements.map((item) => (
          <article key={item.id} className="rounded-3xl sport-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-black">{item.client_name || "Клиент"}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{formatDate(item.measurement_date)}</p>
              </div>
              <button onClick={() => deleteMeasurement(item.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-black text-red-700">Удалить</button>
            </div>
            <div className="mt-5 grid gap-3 text-sm md:grid-cols-4">
              <div className="rounded-2xl bg-[var(--background)] p-3"><b>Вес:</b> {kg(item.body_weight)}</div>
              <div className="rounded-2xl bg-[var(--background)] p-3"><b>Талия:</b> {cm(item.waist)}</div>
              <div className="rounded-2xl bg-[var(--background)] p-3"><b>Грудь:</b> {cm(item.chest)}</div>
              <div className="rounded-2xl bg-[var(--background)] p-3"><b>Бёдра:</b> {cm(item.hips)}</div>
              <div className="rounded-2xl bg-[var(--background)] p-3"><b>Бедро:</b> {cm(item.thigh)}</div>
              <div className="rounded-2xl bg-[var(--background)] p-3"><b>Рука:</b> {cm(item.arm)}</div>
              <div className="rounded-2xl bg-[var(--background)] p-3"><b>Плечи:</b> {cm(item.shoulder)}</div>
            </div>
            {item.comment && <p className="mt-4 rounded-2xl bg-[var(--background)] p-4 text-sm text-[var(--muted)]">{item.comment}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
