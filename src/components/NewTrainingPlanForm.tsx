"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/types/client";
import type { TrainingPlan } from "@/types/training-plan";

type ClientsResponse = {
  clients: Client[];
  error: string | null;
  isConfigured: boolean;
};

const inputClass = "rounded-xl border border-[var(--border)] p-4 outline-none transition focus:border-[var(--accent)]";

export function NewTrainingPlanForm() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ client_id: "", title: "", goal: "", start_date: "", end_date: "" });

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch("/api/clients", { cache: "no-store" });
        const result = (await response.json()) as ClientsResponse;
        if (result.error) setError(result.error);
        setClients(result.clients || []);
      } catch {
        setError("Не удалось загрузить клиентов");
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.client_id) {
      setError("Выберите клиента");
      return;
    }

    if (!form.title.trim()) {
      setError("Введите название плана");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/training-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { plan?: TrainingPlan | null; error?: string };

      if (!response.ok || !result.plan) {
        throw new Error(result.error || "Ошибка при создании плана");
      }

      router.push(`/admin/plans/${result.plan.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ошибка при создании плана");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка клиентов...</div>;
  }

  if (clients.length === 0) {
    return (
      <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">
        <h2 className="text-2xl font-black">Сначала добавьте клиента</h2>
        <p className="mt-3 text-[var(--muted)]">План невозможно создать без клиента в базе.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-3xl rounded-3xl sport-card p-6 shadow-sm">
      <h2 className="text-2xl font-black">Новый тренировочный план</h2>
      <div className="mt-6 grid gap-4">
        <select className={inputClass} value={form.client_id} onChange={(event) => updateField("client_id", event.target.value)}>
          <option value="">Выберите клиента *</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.goal}</option>)}
        </select>
        <input className={inputClass} placeholder="Название плана *" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
        <textarea className={inputClass} rows={3} placeholder="Цель плана" value={form.goal} onChange={(event) => updateField("goal", event.target.value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 font-bold">Дата начала<input className={inputClass} type="date" value={form.start_date} onChange={(event) => updateField("start_date", event.target.value)} /></label>
          <label className="grid gap-2 font-bold">Дата окончания<input className={inputClass} type="date" value={form.end_date} onChange={(event) => updateField("end_date", event.target.value)} /></label>
        </div>
      </div>

      {error && <p className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="mt-6 rounded-xl bg-[var(--accent)] px-6 py-4 font-black text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60">
        {isSubmitting ? "Создаём..." : "Создать план"}
      </button>
    </form>
  );
}
