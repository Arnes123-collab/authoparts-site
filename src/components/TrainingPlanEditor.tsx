"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/types/exercise";
import type { TrainingPlanWithItems } from "@/types/training-plan";

type PlanResponse = TrainingPlanWithItems & {
  error: string | null;
  isConfigured: boolean;
};

type ExercisesResponse = {
  exercises: Exercise[];
  error: string | null;
  isConfigured: boolean;
};

const trainingDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const inputClass = "rounded-xl border border-[var(--border)] p-3 outline-none transition focus:border-[var(--accent)]";

const initialItemForm = {
  training_day: "Понедельник",
  exercise_id: "",
  exercise_order: "1",
  sets: "3",
  reps: "10",
  weight: "",
  percent: "",
  rest_time: "60-90 сек",
  tempo: "контроль",
  comment: "",
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function showValue(value: string | number | null | undefined, suffix = "") {
  if (value === null || value === undefined || value === "") return "-";
  return `${value}${suffix}`;
}

function itemLine(index: number, item: PlanResponse["items"][number]) {
  const exerciseName = item.exercise?.name || "Упражнение удалено из базы";
  const setsReps = `${showValue(item.sets)}×${showValue(item.reps)}`;
  const weight = item.weight !== null ? ` - ${item.weight} кг` : "";
  const percent = item.percent !== null ? ` - ${item.percent}%` : "";
  return `${index + 1}. ${exerciseName} - ${setsReps}${weight}${percent}`;
}

export function TrainingPlanEditor({ planId }: { planId: string }) {
  const [planData, setPlanData] = useState<PlanResponse | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [planResponse, exercisesResponse] = await Promise.all([
        fetch(`/api/training-plans/${planId}`, { cache: "no-store" }),
        fetch("/api/exercises?active=true", { cache: "no-store" }),
      ]);

      const planResult = (await planResponse.json()) as PlanResponse;
      const exercisesResult = (await exercisesResponse.json()) as ExercisesResponse;

      if (planResult.error) setError(planResult.error);
      if (exercisesResult.error) setError(exercisesResult.error);

      setPlanData(planResult);
      setExercises(exercisesResult.exercises || []);
    } catch {
      setError("Не удалось загрузить план");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [planId]);

  function updateItemField(field: keyof typeof itemForm, value: string) {
    setItemForm((current) => ({ ...current, [field]: value }));
  }

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!itemForm.training_day) {
      setError("Выберите день тренировки");
      return;
    }

    if (!itemForm.exercise_id) {
      setError("Выберите упражнение");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/training-plans/${planId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemForm),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) throw new Error(result.error || "Ошибка при добавлении упражнения");

      setMessage(result.message || "Упражнение добавлено в план");
      setItemForm((current) => ({ ...initialItemForm, training_day: current.training_day, exercise_order: String(Number(current.exercise_order || 1) + 1) }));
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ошибка при добавлении упражнения");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteItem(itemId: string) {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/training-plan-items/${itemId}`, { method: "DELETE" });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка при удалении упражнения");
      setMessage(result.message || "Упражнение удалено из плана");
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка при удалении упражнения");
    }
  }

  const groupedItems = useMemo(() => {
    const groups = new Map<string, PlanResponse["items"]>();
    for (const day of trainingDays) groups.set(day, []);
    for (const item of planData?.items || []) {
      const group = groups.get(item.training_day) || [];
      group.push(item);
      groups.set(item.training_day, group);
    }
    return Array.from(groups.entries()).filter(([, items]) => items.length > 0);
  }, [planData]);

  const whatsappText = useMemo(() => {
    if (!planData?.plan) return "";

    const lines: string[] = [
      "ПЛАН ТРЕНИРОВОК",
      `Клиент: ${planData.client?.name || "-"}`,
      `Цель: ${planData.plan.goal || planData.client?.goal || "-"}`,
      `Период: ${formatDate(planData.plan.start_date)} - ${formatDate(planData.plan.end_date)}`,
      "",
    ];

    for (const [day, items] of groupedItems) {
      lines.push(day.toUpperCase());
      items.forEach((item, index) => {
        lines.push(itemLine(index, item));
        if (item.rest_time) lines.push(`Отдых: ${item.rest_time}`);
        if (item.tempo) lines.push(`Темп: ${item.tempo}`);
        if (item.comment) lines.push(`Комментарий: ${item.comment}`);
        if (item.exercise?.technique) lines.push(`Техника: ${item.exercise.technique}`);
        lines.push("");
      });
    }

    lines.push("ОТЧЁТ ПОСЛЕ ТРЕНИРОВКИ:");
    lines.push("1. Выполнил / не выполнил");
    lines.push("2. Рабочие веса");
    lines.push("3. Самочувствие");
    lines.push("4. Где была боль по шкале 1-10");
    lines.push("5. Видео техники, если нужно");

    return lines.join("\n");
  }, [groupedItems, planData]);

  async function copyWhatsappText() {
    try {
      await navigator.clipboard.writeText(whatsappText);
      setMessage("Текст плана скопирован");
    } catch {
      setError("Не удалось скопировать текст. Выделите текст вручную.");
    }
  }

  if (isLoading) {
    return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка плана...</div>;
  }

  if (!planData?.plan) {
    return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">План не найден</div>;
  }

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
      <aside className="space-y-6">
        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h2 className="text-2xl font-black">{planData.plan.title}</h2>
            <a href={`/admin/plans/${planId}/print`} className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-sm font-black text-white">PDF / печать</a>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p><b>Клиент:</b> {planData.client?.name || "-"}</p>
            <p><b>Цель клиента:</b> {planData.client?.goal || "-"}</p>
            <p><b>Цель плана:</b> {planData.plan.goal || "-"}</p>
            <p><b>Период:</b> {formatDate(planData.plan.start_date)} - {formatDate(planData.plan.end_date)}</p>
          </div>
        </div>

        <form onSubmit={handleAddItem} className="rounded-3xl sport-card p-6 shadow-sm">
          <h2 className="text-2xl font-black">Добавить упражнение</h2>
          {exercises.length === 0 ? (
            <p className="mt-4 rounded-xl bg-yellow-50 p-4 font-bold text-yellow-900">Сначала добавьте упражнения в базу.</p>
          ) : (
            <div className="mt-5 grid gap-3">
              <select className={inputClass} value={itemForm.training_day} onChange={(event) => updateItemField("training_day", event.target.value)}>
                {trainingDays.map((day) => <option key={day} value={day}>{day}</option>)}
              </select>
              <select className={inputClass} value={itemForm.exercise_id} onChange={(event) => updateItemField("exercise_id", event.target.value)}>
                <option value="">Выберите упражнение *</option>
                {exercises.map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name} - {exercise.muscle_group || "без группы"}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} type="number" min="1" placeholder="Порядок" value={itemForm.exercise_order} onChange={(event) => updateItemField("exercise_order", event.target.value)} />
                <input className={inputClass} type="number" min="1" placeholder="Подходы" value={itemForm.sets} onChange={(event) => updateItemField("sets", event.target.value)} />
              </div>
              <input className={inputClass} placeholder="Повторения: 10 или 12-15" value={itemForm.reps} onChange={(event) => updateItemField("reps", event.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} type="number" step="0.5" placeholder="Вес" value={itemForm.weight} onChange={(event) => updateItemField("weight", event.target.value)} />
                <input className={inputClass} type="number" step="0.5" placeholder="% от 1ПМ" value={itemForm.percent} onChange={(event) => updateItemField("percent", event.target.value)} />
              </div>
              <input className={inputClass} placeholder="Отдых" value={itemForm.rest_time} onChange={(event) => updateItemField("rest_time", event.target.value)} />
              <input className={inputClass} placeholder="Темп" value={itemForm.tempo} onChange={(event) => updateItemField("tempo", event.target.value)} />
              <textarea className={inputClass} rows={3} placeholder="Комментарий тренера" value={itemForm.comment} onChange={(event) => updateItemField("comment", event.target.value)} />
            </div>
          )}

          {message && <p className="mt-5 rounded-xl bg-green-50 p-4 font-bold text-green-700">{message}</p>}
          {error && <p className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}

          <button type="submit" disabled={isSubmitting || exercises.length === 0} className="mt-6 w-full rounded-xl bg-[var(--accent)] px-6 py-4 font-black text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60">
            {isSubmitting ? "Добавляем..." : "Добавить в план"}
          </button>
        </form>
      </aside>

      <section className="space-y-8">
        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <h2 className="text-2xl font-black">Упражнения плана</h2>
          {groupedItems.length === 0 ? (
            <p className="mt-4 text-[var(--muted)]">В плане пока нет упражнений.</p>
          ) : (
            <div className="mt-5 space-y-6">
              {groupedItems.map(([day, items]) => (
                <div key={day}>
                  <h3 className="rounded-xl bg-[var(--background)] px-4 py-3 text-xl font-black">{day}</h3>
                  <div className="mt-4 grid gap-4">
                    {items.map((item, index) => (
                      <article key={item.id} className="overflow-hidden rounded-2xl border border-[var(--border)] md:grid md:grid-cols-[180px_1fr]">
                        <div className="flex min-h-44 items-center justify-center bg-[#efe6d9]">
                          {item.exercise?.image_url ? <img src={item.exercise.image_url} alt={item.exercise.name} className="h-full max-h-56 w-full object-cover" /> : <span className="px-4 text-center text-sm font-bold text-[var(--muted)]">Фото нет</span>}
                        </div>
                        <div className="p-5">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h4 className="text-xl font-black">{index + 1}. {item.exercise?.name || "Упражнение удалено"}</h4>
                              <p className="mt-1 font-bold text-[var(--accent)]">{item.exercise?.muscle_group || "Группа не указана"}</p>
                            </div>
                            <button type="button" onClick={() => handleDeleteItem(item.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-black text-red-700">Удалить</button>
                          </div>
                          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                            <p><b>Работа:</b> {showValue(item.sets)}×{showValue(item.reps)} - {showValue(item.weight, " кг")} - {showValue(item.percent, "%")}</p>
                            <p><b>Отдых:</b> {showValue(item.rest_time)}</p>
                            <p><b>Темп:</b> {showValue(item.tempo)}</p>
                            <p><b>Комментарий:</b> {showValue(item.comment)}</p>
                          </div>
                          {item.exercise?.technique && <p className="mt-3 text-sm"><b>Техника:</b> {item.exercise.technique}</p>}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Текст плана для WhatsApp</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Готовый текст формируется автоматически.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`/admin/plans/${planId}/print`} className="rounded-xl border border-[var(--border)] px-5 py-3 font-black">PDF / печать</a>
              <button type="button" onClick={copyWhatsappText} className="rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white">Скопировать текст</button>
            </div>
          </div>
          <textarea readOnly className="mt-5 h-96 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm outline-none" value={whatsappText} />
        </div>
      </section>
    </div>
  );
}
