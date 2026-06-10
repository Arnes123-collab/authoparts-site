"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Client } from "@/types/client";
import type { NutritionGoal, NutritionPlanListItem } from "@/types/nutrition";

type ClientsResponse = { clients: Client[]; error: string | null; isConfigured: boolean };
type NutritionResponse = { nutritionPlans: NutritionPlanListItem[]; error: string | null; isConfigured: boolean };

type NutritionForm = {
  client_id: string;
  title: string;
  goal: NutritionGoal;
  calories: string;
  protein: string;
  fats: string;
  carbs: string;
  water_liters: string;
  meals_per_day: string;
  meal_timing: string;
  food_preferences: string;
  restrictions: string;
  coach_notes: string;
};

const initialForm: NutritionForm = {
  client_id: "",
  title: "План питания на месяц",
  goal: "fat_loss",
  calories: "",
  protein: "",
  fats: "",
  carbs: "",
  water_liters: "",
  meals_per_day: "4",
  meal_timing: "",
  food_preferences: "",
  restrictions: "",
  coach_notes: "",
};

const goalLabels: Record<NutritionGoal, string> = {
  fat_loss: "Похудение",
  muscle_gain: "Набор мышц",
  maintenance: "Поддержание веса",
  recomposition: "Рекомпозиция",
  health_40_plus: "Здоровье 40+",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function macroLine(plan: NutritionPlanListItem) {
  const parts = [];
  if (plan.calories !== null) parts.push(`${plan.calories} ккал`);
  if (plan.protein !== null) parts.push(`Б ${plan.protein} г`);
  if (plan.fats !== null) parts.push(`Ж ${plan.fats} г`);
  if (plan.carbs !== null) parts.push(`У ${plan.carbs} г`);
  return parts.length ? parts.join(" / ") : "БЖУ не заполнены";
}

function buildWhatsappText(plan: NutritionPlanListItem) {
  return [
    "ПЛАН ПИТАНИЯ",
    `Клиент: ${plan.client_name || "клиент"}`,
    `Цель: ${goalLabels[plan.goal]}`,
    `Калории и БЖУ: ${macroLine(plan)}`,
    plan.water_liters !== null ? `Вода: ${plan.water_liters} л/день` : null,
    plan.meals_per_day !== null ? `Приёмов пищи: ${plan.meals_per_day}` : null,
    plan.meal_timing ? `Режим: ${plan.meal_timing}` : null,
    plan.food_preferences ? `Предпочтения: ${plan.food_preferences}` : null,
    plan.restrictions ? `Ограничения: ${plan.restrictions}` : null,
    plan.coach_notes ? `Рекомендации тренера: ${plan.coach_notes}` : null,
    "",
    "Отчёт по питанию:",
    "1. Вес утром",
    "2. Калории / БЖУ за день",
    "3. Вода",
    "4. Сон и самочувствие",
    "5. Что было сложно соблюдать",
  ].filter(Boolean).join("\n");
}

export function AdminNutritionManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [plans, setPlans] = useState<NutritionPlanListItem[]>([]);
  const [form, setForm] = useState<NutritionForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [clientsResponse, nutritionResponse] = await Promise.all([
        fetch("/api/clients", { cache: "no-store" }),
        fetch("/api/nutrition-plans", { cache: "no-store" }),
      ]);
      const clientsResult = (await clientsResponse.json()) as ClientsResponse;
      const nutritionResult = (await nutritionResponse.json()) as NutritionResponse;
      setIsConfigured(clientsResult.isConfigured && nutritionResult.isConfigured);
      setClients(clientsResult.clients || []);
      setPlans(nutritionResult.nutritionPlans || []);
      if (clientsResult.error) setError(clientsResult.error);
      if (nutritionResult.error) setError(nutritionResult.error);
    } catch {
      setError("Не удалось загрузить питание и клиентов");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    return plans.reduce((acc, plan) => {
      acc.total += 1;
      acc[plan.goal] = (acc[plan.goal] || 0) + 1;
      return acc;
    }, { total: 0 } as Record<string, number>);
  }, [plans]);

  function updateField<K extends keyof NutritionForm>(key: K, value: NutritionForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/nutrition-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка сохранения питания");
      setMessage(result.message || "План питания создан");
      setForm(initialForm);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения питания");
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePlan(planId: string) {
    if (!window.confirm("Удалить этот план питания?")) return;
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/nutrition-plans/${planId}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка удаления плана");
      setMessage(result.message || "План питания удалён");
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления плана");
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setMessage("Текст питания скопирован для WhatsApp");
  }

  if (isLoading) return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка питания...</div>;
  if (!isConfigured) return <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">Supabase не настроен или таблица nutrition_plans ещё не создана.</div>;

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[430px_1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl sport-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">Создать план питания</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Калории, БЖУ, вода, режим и рекомендации тренера.</p>

        <label className="mt-5 block text-sm font-black">Клиент</label>
        <select value={form.client_id} onChange={(event) => updateField("client_id", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
          <option value="">Выберите клиента</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
        </select>

        <label className="mt-4 block text-sm font-black">Название</label>
        <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" />

        <label className="mt-4 block text-sm font-black">Цель</label>
        <select value={form.goal} onChange={(event) => updateField("goal", event.target.value as NutritionGoal)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
          {Object.entries(goalLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <input placeholder="Калории" value={form.calories} onChange={(event) => updateField("calories", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Белки, г" value={form.protein} onChange={(event) => updateField("protein", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Жиры, г" value={form.fats} onChange={(event) => updateField("fats", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Углеводы, г" value={form.carbs} onChange={(event) => updateField("carbs", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Вода, л" value={form.water_liters} onChange={(event) => updateField("water_liters", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
          <input placeholder="Приёмов пищи" value={form.meals_per_day} onChange={(event) => updateField("meals_per_day", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" />
        </div>

        <textarea placeholder="Режим питания" value={form.meal_timing} onChange={(event) => updateField("meal_timing", event.target.value)} className="mt-4 min-h-20 w-full rounded-xl border border-[var(--border)] p-3" />
        <textarea placeholder="Предпочтения по продуктам" value={form.food_preferences} onChange={(event) => updateField("food_preferences", event.target.value)} className="mt-3 min-h-20 w-full rounded-xl border border-[var(--border)] p-3" />
        <textarea placeholder="Ограничения / аллергии" value={form.restrictions} onChange={(event) => updateField("restrictions", event.target.value)} className="mt-3 min-h-20 w-full rounded-xl border border-[var(--border)] p-3" />
        <textarea placeholder="Рекомендации тренера" value={form.coach_notes} onChange={(event) => updateField("coach_notes", event.target.value)} className="mt-3 min-h-24 w-full rounded-xl border border-[var(--border)] p-3" />

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}

        <button disabled={isSaving} className="mt-5 w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white disabled:opacity-60">
          {isSaving ? "Сохраняю..." : "Сохранить питание"}
        </button>
      </form>

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Всего планов</p><p className="mt-2 text-3xl font-black">{summary.total}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Похудение</p><p className="mt-2 text-3xl font-black">{summary.fat_loss || 0}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">40+</p><p className="mt-2 text-3xl font-black">{summary.health_40_plus || 0}</p></div>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-3xl sport-card p-8 text-center shadow-sm">Планов питания пока нет.</div>
        ) : plans.map((plan) => (
          <article key={plan.id} className="rounded-3xl sport-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">{goalLabels[plan.goal]}</p>
                <h3 className="mt-1 text-2xl font-black">{plan.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{plan.client_name || "Клиент не найден"} · {formatDate(plan.created_at)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyText(buildWhatsappText(plan))} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-black">WhatsApp</button>
                <button onClick={() => deletePlan(plan.id)} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700">Удалить</button>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[var(--background)] p-4 font-bold">{macroLine(plan)}</div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <p><b>Вода:</b> {plan.water_liters ?? "-"} л</p>
              <p><b>Приёмов пищи:</b> {plan.meals_per_day ?? "-"}</p>
              <p><b>Режим:</b> {plan.meal_timing || "-"}</p>
              <p><b>Ограничения:</b> {plan.restrictions || "-"}</p>
            </div>
            {plan.coach_notes && <p className="mt-4 rounded-2xl border border-[var(--border)] p-4 text-sm"><b>Рекомендации:</b> {plan.coach_notes}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
