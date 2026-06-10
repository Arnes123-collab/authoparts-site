"use client";

import { useEffect, useMemo, useState } from "react";
import type { TrainingPlanWithItems } from "@/types/training-plan";

const trainingDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

type PlanResponse = TrainingPlanWithItems & {
  error: string | null;
  isConfigured: boolean;
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

export function TrainingPlanPrintView({ planId }: { planId: string }) {
  const [planData, setPlanData] = useState<PlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlan() {
      try {
        const response = await fetch(`/api/training-plans/${planId}`, { cache: "no-store" });
        const result = (await response.json()) as PlanResponse;
        if (!response.ok || result.error) throw new Error(result.error || "Не удалось загрузить план");
        setPlanData(result);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить план");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlan();
  }, [planId]);

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
      setMessage("Текст для WhatsApp скопирован");
    } catch {
      setMessage("Не удалось скопировать. Выделите текст вручную.");
    }
  }

  if (isLoading) return <div className="rounded-3xl sport-card p-8 shadow-sm">Загрузка печатной версии...</div>;
  if (error) return <div className="rounded-3xl bg-red-50 p-8 font-bold text-red-700">{error}</div>;
  if (!planData?.plan) return <div className="rounded-3xl sport-card p-8 shadow-sm">План не найден</div>;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="no-print mb-6 flex flex-col gap-3 rounded-3xl sport-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black">Экспорт плана</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Нажмите “Скачать PDF”, затем выберите “Сохранить как PDF”.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => window.print()} className="rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white">Скачать PDF</button>
          <button type="button" onClick={copyWhatsappText} className="rounded-xl border border-[var(--border)] px-5 py-3 font-black">Скопировать WhatsApp</button>
          <a href={`/admin/plans/${planId}`} className="rounded-xl border border-[var(--border)] px-5 py-3 font-black">Назад к редактированию</a>
        </div>
        {message && <p className="basis-full rounded-xl bg-green-50 p-3 font-bold text-green-700">{message}</p>}
      </div>

      <article className="print-document rounded-3xl sport-card p-8 shadow-sm">
        <header className="border-b border-[var(--border)] pb-6">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--accent)]">Fitness Coach Pro</p>
          <h2 className="mt-3 text-4xl font-black">{planData.plan.title}</h2>
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <p><b>Клиент:</b> {planData.client?.name || "-"}</p>
            <p><b>Период:</b> {formatDate(planData.plan.start_date)} - {formatDate(planData.plan.end_date)}</p>
            <p><b>Цель клиента:</b> {planData.client?.goal || "-"}</p>
            <p><b>Цель плана:</b> {planData.plan.goal || "-"}</p>
          </div>
        </header>

        {groupedItems.length === 0 ? (
          <p className="mt-8 text-[var(--muted)]">В плане пока нет упражнений.</p>
        ) : (
          <div className="mt-8 space-y-10">
            {groupedItems.map(([day, items]) => (
              <section key={day} className="avoid-break">
                <h3 className="rounded-2xl bg-[var(--background)] px-5 py-4 text-2xl font-black">{day}</h3>
                <div className="mt-5 space-y-5">
                  {items.map((item, index) => (
                    <div key={item.id} className="avoid-break overflow-hidden rounded-2xl border border-[var(--border)] md:grid md:grid-cols-[170px_1fr]">
                      <div className="flex min-h-40 items-center justify-center bg-[#efe6d9]">
                        {item.exercise?.image_url ? <img src={item.exercise.image_url} alt={item.exercise.name} className="h-full max-h-52 w-full object-cover" /> : <span className="px-4 text-center text-sm font-bold text-[var(--muted)]">Фото нет</span>}
                      </div>
                      <div className="p-5">
                        <h4 className="text-xl font-black">{index + 1}. {item.exercise?.name || "Упражнение удалено"}</h4>
                        <p className="mt-1 font-bold text-[var(--accent)]">{item.exercise?.muscle_group || "Группа не указана"}</p>
                        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                          <p><b>Работа:</b> {showValue(item.sets)}×{showValue(item.reps)}</p>
                          <p><b>Вес / %:</b> {showValue(item.weight, " кг")} / {showValue(item.percent, "%")}</p>
                          <p><b>Отдых:</b> {showValue(item.rest_time)}</p>
                          <p><b>Темп:</b> {showValue(item.tempo)}</p>
                        </div>
                        {item.comment && <p className="mt-3 text-sm"><b>Комментарий тренера:</b> {item.comment}</p>}
                        {item.exercise?.technique && <p className="mt-3 text-sm"><b>Техника:</b> {item.exercise.technique}</p>}
                        {item.exercise?.common_mistakes && <p className="mt-3 text-sm"><b>Частые ошибки:</b> {item.exercise.common_mistakes}</p>}
                        {item.exercise?.contraindications && <p className="mt-3 text-sm"><b>Ограничения:</b> {item.exercise.contraindications}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <section className="avoid-break mt-10 rounded-2xl bg-[var(--background)] p-6">
          <h3 className="text-2xl font-black">Отчёт после тренировки</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
            <li>Выполнил / не выполнил тренировку.</li>
            <li>Написать рабочие веса и повторения.</li>
            <li>Оценить самочувствие.</li>
            <li>Указать боль по шкале 1-10.</li>
            <li>Отправить видео техники, если тренер попросил.</li>
          </ol>
        </section>
      </article>

      <div className="no-print mt-6 rounded-3xl sport-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">Текст для WhatsApp</h2>
        <textarea readOnly className="mt-4 h-96 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm outline-none" value={whatsappText} />
      </div>
    </div>
  );
}
