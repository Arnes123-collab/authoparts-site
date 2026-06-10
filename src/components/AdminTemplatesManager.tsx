"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Template, TemplateCategory, TemplateRequestPayload, TemplateType } from "@/types/template";

type TemplatesResponse = { templates: Template[]; error: string | null; isConfigured: boolean };

type TemplateForm = {
  title: string;
  template_type: TemplateType;
  category: TemplateCategory;
  description: string;
  duration_weeks: string;
  training_days_per_week: string;
  goal: string;
  level: string;
  content: string;
  nutrition_notes: string;
  is_active: boolean;
};

const initialForm: TemplateForm = {
  title: "",
  template_type: "training",
  category: "fat_loss",
  description: "",
  duration_weeks: "4",
  training_days_per_week: "3",
  goal: "",
  level: "Начальный",
  content: "",
  nutrition_notes: "",
  is_active: true,
};

const typeLabels: Record<TemplateType, string> = {
  training: "Тренировки",
  nutrition: "Питание",
  combined: "Тренировки + питание",
};

const categoryLabels: Record<TemplateCategory, string> = {
  fat_loss: "Похудение",
  muscle_gain: "Набор массы",
  recomposition: "Рекомпозиция",
  home_workout: "Домашние тренировки",
  beginner: "Начинающий",
  advanced: "Продвинутый",
  health_40_plus: "После 40",
};

const starterTemplates: Array<Pick<TemplateForm, "title" | "template_type" | "category" | "description" | "duration_weeks" | "training_days_per_week" | "goal" | "level" | "content" | "nutrition_notes">> = [
  {
    title: "Похудение 40+ - 3 тренировки в неделю",
    template_type: "combined",
    category: "health_40_plus",
    description: "Мягкий старт для клиента после 40 лет: силовая база, суставная профилактика и контроль питания.",
    duration_weeks: "4",
    training_days_per_week: "3",
    goal: "Снижение веса, укрепление мышц, здоровье суставов",
    level: "Начальный / средний",
    content: "Понедельник: ноги + корпус\n1. Присед с гантелью - 3×10\n2. Румынская тяга - 3×10\n3. Тяга горизонтального блока - 3×12\n4. Планка - 3×30 сек\n\nСреда: верх тела\n1. Жим гантелей лёжа - 3×10\n2. Тяга верхнего блока - 3×12\n3. Жим гантелей сидя - 2×12\n4. Face pull - 3×15\n\nПятница: всё тело\n1. Жим ногами - 3×12\n2. Гиперэкстензия - 3×12\n3. Отжимания от опоры - 3×8-12\n4. Ходьба 20-30 минут",
    nutrition_notes: "Дефицит 10-15%, белок 1.6-2.0 г/кг, вода 30 мл/кг, шаги 7000-9000 в день.",
  },
  {
    title: "Набор мышц - базовый зал",
    template_type: "training",
    category: "muscle_gain",
    description: "Шаблон для клиента без травм, который хочет набрать мышцы и тренируется в зале.",
    duration_weeks: "6",
    training_days_per_week: "4",
    goal: "Гипертрофия и рост рабочих весов",
    level: "Средний",
    content: "День 1: грудь + трицепс\nДень 2: спина + бицепс\nДень 3: ноги\nДень 4: плечи + корпус\n\nОсновные упражнения: 3-4 подхода по 6-12 повторений. Изоляция: 2-4 подхода по 10-15 повторений. Прогрессия: +1-2 повтора или +2.5 кг при сохранении техники.",
    nutrition_notes: "Профицит 5-10%, белок 1.8-2.2 г/кг, углеводы вокруг тренировки.",
  },
  {
    title: "Домашные тренировки - без зала",
    template_type: "training",
    category: "home_workout",
    description: "Шаблон для клиента с гантелями, резинками или собственным весом.",
    duration_weeks: "4",
    training_days_per_week: "3",
    goal: "Форма, тонус, регулярность",
    level: "Начальный",
    content: "День 1: приседания, отжимания от опоры, тяга резинки, планка\nДень 2: выпады, ягодичный мост, жим гантелей, скручивания\nДень 3: румынская тяга с гантелями, тяга гантели, махи в стороны, ходьба\n\nРабочий диапазон: 3×10-15. Отдых: 60-90 сек.",
    nutrition_notes: "Простое питание из обычных продуктов, контроль порций, белок в каждом приёме пищи.",
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function buildTemplateText(template: Template) {
  return [
    `ШАБЛОН: ${template.title}`,
    `Тип: ${typeLabels[template.template_type]}`,
    `Категория: ${categoryLabels[template.category]}`,
    template.goal ? `Цель: ${template.goal}` : null,
    template.level ? `Уровень: ${template.level}` : null,
    template.duration_weeks ? `Длительность: ${template.duration_weeks} недель` : null,
    template.training_days_per_week ? `Тренировок в неделю: ${template.training_days_per_week}` : null,
    "",
    template.content,
    template.nutrition_notes ? `\nПитание:\n${template.nutrition_notes}` : null,
  ].filter(Boolean).join("\n");
}

export function AdminTemplatesManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState<TemplateForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | TemplateCategory>("all");

  async function loadTemplates() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/templates", { cache: "no-store" });
      const result = (await response.json()) as TemplatesResponse;
      setIsConfigured(result.isConfigured);
      setTemplates(result.templates || []);
      if (result.error) setError(result.error);
    } catch {
      setError("Не удалось загрузить шаблоны");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    if (filter === "all") return templates;
    return templates.filter((template) => template.category === filter);
  }, [filter, templates]);

  const summary = useMemo(() => {
    return templates.reduce((acc, template) => {
      acc.total += 1;
      acc[template.template_type] = (acc[template.template_type] || 0) + 1;
      return acc;
    }, { total: 0 } as Record<string, number>);
  }, [templates]);

  function updateField<K extends keyof TemplateForm>(key: K, value: TemplateForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyStarterTemplate(index: number) {
    setForm({ ...initialForm, ...starterTemplates[index], is_active: true });
    setMessage("Стартовый шаблон подставлен в форму. Проверьте и сохраните.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const payload: TemplateRequestPayload = {
      ...form,
      duration_weeks: form.duration_weeks,
      training_days_per_week: form.training_days_per_week,
    };

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка сохранения шаблона");
      setMessage(result.message || "Шаблон создан");
      setForm(initialForm);
      await loadTemplates();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения шаблона");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTemplate(templateId: string) {
    if (!window.confirm("Удалить этот шаблон?")) return;
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/templates/${templateId}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка удаления шаблона");
      setMessage(result.message || "Шаблон удалён");
      await loadTemplates();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления шаблона");
    }
  }

  async function toggleTemplate(template: Template) {
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !template.is_active }),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка изменения статуса");
      setMessage(result.message || "Статус обновлён");
      await loadTemplates();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Ошибка изменения статуса");
    }
  }

  async function copyText(template: Template) {
    await navigator.clipboard.writeText(buildTemplateText(template));
    setMessage("Шаблон скопирован. Его можно вставить клиенту или использовать как основу плана.");
  }

  if (isLoading) return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка шаблонов...</div>;
  if (!isConfigured) return <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">Supabase не настроен или таблица program_templates ещё не создана.</div>;

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[440px_1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl sport-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">Создать шаблон</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Шаблоны нужны, чтобы тренер не собирал похудение, набор массы или 40+ с нуля.</p>

        <div className="mt-5 grid gap-2">
          {starterTemplates.map((template, index) => (
            <button key={template.title} type="button" onClick={() => applyStarterTemplate(index)} className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left text-sm font-bold hover:bg-white">
              Быстрый старт: {template.title}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm font-black">Название</label>
        <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" placeholder="Например: Похудение 40+" />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-black">Тип</label>
            <select value={form.template_type} onChange={(event) => updateField("template_type", event.target.value as TemplateType)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
              {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-black">Категория</label>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value as TemplateCategory)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
              {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} className="mt-4 min-h-20 w-full rounded-xl border border-[var(--border)] p-3" placeholder="Краткое описание шаблона" />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <input value={form.duration_weeks} onChange={(event) => updateField("duration_weeks", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" placeholder="Недель" />
          <input value={form.training_days_per_week} onChange={(event) => updateField("training_days_per_week", event.target.value)} className="rounded-xl border border-[var(--border)] p-3" placeholder="Тренировок/нед" />
        </div>

        <input value={form.goal} onChange={(event) => updateField("goal", event.target.value)} className="mt-4 w-full rounded-xl border border-[var(--border)] p-3" placeholder="Цель" />
        <input value={form.level} onChange={(event) => updateField("level", event.target.value)} className="mt-3 w-full rounded-xl border border-[var(--border)] p-3" placeholder="Уровень" />
        <textarea value={form.content} onChange={(event) => updateField("content", event.target.value)} className="mt-3 min-h-52 w-full rounded-xl border border-[var(--border)] p-3 font-mono text-sm" placeholder="Структура тренировок / программы" />
        <textarea value={form.nutrition_notes} onChange={(event) => updateField("nutrition_notes", event.target.value)} className="mt-3 min-h-28 w-full rounded-xl border border-[var(--border)] p-3" placeholder="Заметки по питанию" />

        <label className="mt-4 flex items-center gap-3 text-sm font-bold">
          <input type="checkbox" checked={form.is_active} onChange={(event) => updateField("is_active", event.target.checked)} />
          Шаблон активен
        </label>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}

        <button disabled={isSaving} className="mt-5 w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white disabled:opacity-60">
          {isSaving ? "Сохраняю..." : "Сохранить шаблон"}
        </button>
      </form>

      <div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Всего</p><p className="text-3xl font-black">{summary.total || 0}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Тренировки</p><p className="text-3xl font-black">{summary.training || 0}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Питание</p><p className="text-3xl font-black">{summary.nutrition || 0}</p></div>
          <div className="rounded-3xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Комбо</p><p className="text-3xl font-black">{summary.combined || 0}</p></div>
        </div>

        <div className="mt-5 rounded-3xl sport-card p-5 shadow-sm">
          <label className="text-sm font-black">Фильтр категории</label>
          <select value={filter} onChange={(event) => setFilter(event.target.value as "all" | TemplateCategory)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3 md:w-80">
            <option value="all">Все категории</option>
            {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>

        <div className="mt-5 space-y-4">
          {filteredTemplates.length === 0 ? (
            <div className="rounded-3xl sport-card p-8 text-center text-[var(--muted)] shadow-sm">Шаблонов пока нет.</div>
          ) : filteredTemplates.map((template) => (
            <article key={template.id} className="rounded-3xl sport-card p-6 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide">
                    <span className="rounded-full bg-[var(--background)] px-3 py-1">{typeLabels[template.template_type]}</span>
                    <span className="rounded-full bg-[var(--background)] px-3 py-1">{categoryLabels[template.category]}</span>
                    <span className={`rounded-full px-3 py-1 ${template.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{template.is_active ? "Активен" : "Выключен"}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-black">{template.title}</h3>
                  {template.description && <p className="mt-2 text-[var(--muted)]">{template.description}</p>}
                  <p className="mt-2 text-sm text-[var(--muted)]">Создан: {formatDate(template.created_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => copyText(template)} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-black text-white">Скопировать</button>
                  <button onClick={() => toggleTemplate(template)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">{template.is_active ? "Выключить" : "Включить"}</button>
                  <button onClick={() => deleteTemplate(template.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700">Удалить</button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl bg-[var(--background)] p-4"><p className="text-xs text-[var(--muted)]">Цель</p><p className="font-bold">{template.goal || "-"}</p></div>
                <div className="rounded-2xl bg-[var(--background)] p-4"><p className="text-xs text-[var(--muted)]">Уровень</p><p className="font-bold">{template.level || "-"}</p></div>
                <div className="rounded-2xl bg-[var(--background)] p-4"><p className="text-xs text-[var(--muted)]">Недель</p><p className="font-bold">{template.duration_weeks || "-"}</p></div>
                <div className="rounded-2xl bg-[var(--background)] p-4"><p className="text-xs text-[var(--muted)]">Дней/нед</p><p className="font-bold">{template.training_days_per_week || "-"}</p></div>
              </div>

              <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-[#111] p-4 text-sm text-white">{template.content}</pre>
              {template.nutrition_notes && <div className="mt-4 rounded-2xl border border-[var(--border)] p-4"><p className="font-black">Питание</p><p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">{template.nutrition_notes}</p></div>}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
