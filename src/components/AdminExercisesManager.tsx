"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { DifficultyLevel, Exercise } from "@/types/exercise";

type ApiResponse = {
  exercises: Exercise[];
  error: string | null;
  isConfigured: boolean;
};

type FormState = {
  name: string;
  muscle_group: string;
  category: string;
  subcategory: string;
  equipment: string;
  technique: string;
  common_mistakes: string;
  contraindications: string;
  video_url: string;
  difficulty_level: DifficultyLevel | "";
  replacement_exercise: string;
  sport_tags: string;
  coach_notes: string;
  is_active: boolean;
};

type Filters = {
  search: string;
  category: string;
  muscle_group: string;
  difficulty_level: string;
  active: string;
};

const initialFormState: FormState = {
  name: "",
  muscle_group: "",
  category: "",
  subcategory: "",
  equipment: "",
  technique: "",
  common_mistakes: "",
  contraindications: "",
  video_url: "",
  difficulty_level: "",
  replacement_exercise: "",
  sport_tags: "",
  coach_notes: "",
  is_active: true,
};

const initialFilters: Filters = {
  search: "",
  category: "",
  muscle_group: "",
  difficulty_level: "",
  active: "",
};

const inputClass = "rounded-xl border border-[var(--border)] p-4 outline-none transition focus:border-[var(--accent)]";
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 5 * 1024 * 1024;

const difficultyLabels: Record<string, string> = {
  beginner: "Новичок",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

const categoryOptions = [
  "Грудь",
  "Спина",
  "Плечи",
  "Ноги",
  "Ягодицы",
  "Бицепс",
  "Трицепс",
  "Кор",
  "Кардио",
  "Мобилити",
  "Реабилитация",
];

const muscleOptions = [
  "Грудные",
  "Широчайшие",
  "Ромбовидные",
  "Трапеции",
  "Разгибатели спины",
  "Передняя дельта",
  "Средняя дельта",
  "Задняя дельта",
  "Квадрицепс",
  "Бицепс бедра",
  "Ягодичные",
  "Икроножные",
  "Бицепс",
  "Трицепс",
  "Пресс",
  "Косые мышцы живота",
];

function showValue(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "-";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Не удалось прочитать файл"));
        return;
      }

      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Не удалось подготовить фото"));
        return;
      }

      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function updateQuery(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.muscle_group) params.set("muscle_group", filters.muscle_group);
  if (filters.difficulty_level) params.set("difficulty_level", filters.difficulty_level);
  if (filters.active) params.set("active", filters.active);
  const query = params.toString();
  return query ? `/api/exercises?${query}` : "/api/exercises";
}

export function AdminExercisesManager() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<ApiResponse>({ exercises: [], error: null, isConfigured: true });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeCount = useMemo(() => data.exercises.filter((exercise) => exercise.is_active).length, [data.exercises]);
  const inactiveCount = data.exercises.length - activeCount;

  function updateField(field: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateFilter(field: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  async function loadExercises(customFilters = filters) {
    setIsLoading(true);
    try {
      const response = await fetch(updateQuery(customFilters), { cache: "no-store" });
      const result = (await response.json()) as ApiResponse;
      setData(result);
    } catch {
      setData({ exercises: [], error: "Не удалось загрузить упражнения", isConfigured: true });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExercises(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFileChange(file: File | null) {
    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setSelectedFile(null);
      setError("Разрешены только JPG, PNG или WEBP");
      return;
    }

    if (file.size > maxImageSize) {
      setSelectedFile(null);
      setError("Фото слишком большое. Максимум 5 MB");
      return;
    }

    setSelectedFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!form.name.trim()) {
      setError("Введите название упражнения");
      return;
    }

    setIsSubmitting(true);

    try {
      const image = selectedFile
        ? {
            fileName: selectedFile.name,
            contentType: selectedFile.type,
            size: selectedFile.size,
            base64: await fileToBase64(selectedFile),
          }
        : null;

      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sport_tags: parseTags(form.sport_tags), image }),
      });

      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Ошибка при добавлении упражнения");
      }

      setMessage(result.message || "Упражнение успешно добавлено");
      setForm(initialFormState);
      setSelectedFile(null);
      await loadExercises();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ошибка при добавлении упражнения");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleActive(exercise: Exercise) {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/exercises/${exercise.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !exercise.is_active }),
      });

      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Не удалось обновить упражнение");
      }

      setMessage(exercise.is_active ? "Упражнение выключено" : "Упражнение снова активно");
      await loadExercises();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Не удалось обновить упражнение");
    }
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadExercises(filters);
  }

  function resetFilters() {
    setFilters(initialFilters);
    loadExercises(initialFilters);
  }

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[430px_1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl sport-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">Добавить упражнение</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Этап 11: упражнение теперь хранит категорию, подкатегорию, оборудование, теги, замену и статус активности.</p>

        <div className="mt-6 grid gap-4">
          <input className={inputClass} placeholder="Название упражнения *" value={form.name} onChange={(event) => updateField("name", event.target.value)} />

          <select className={inputClass} value={form.category} onChange={(event) => updateField("category", event.target.value)}>
            <option value="">Категория</option>
            {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <input className={inputClass} placeholder="Подкатегория: верх груди, задняя дельта, ягодичные" value={form.subcategory} onChange={(event) => updateField("subcategory", event.target.value)} />

          <select className={inputClass} value={form.muscle_group} onChange={(event) => updateField("muscle_group", event.target.value)}>
            <option value="">Мышечная группа</option>
            {muscleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <input className={inputClass} placeholder="Оборудование: штанга, гантели, тренажёр, резина" value={form.equipment} onChange={(event) => updateField("equipment", event.target.value)} />

          <select className={inputClass} value={form.difficulty_level} onChange={(event) => updateField("difficulty_level", event.target.value)}>
            <option value="">Уровень сложности</option>
            <option value="beginner">Новичок</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>

          <textarea className={inputClass} rows={4} placeholder="Техника выполнения" value={form.technique} onChange={(event) => updateField("technique", event.target.value)} />
          <textarea className={inputClass} rows={3} placeholder="Частые ошибки" value={form.common_mistakes} onChange={(event) => updateField("common_mistakes", event.target.value)} />
          <textarea className={inputClass} rows={3} placeholder="Противопоказания / ограничения" value={form.contraindications} onChange={(event) => updateField("contraindications", event.target.value)} />
          <input className={inputClass} placeholder="Чем заменить упражнение" value={form.replacement_exercise} onChange={(event) => updateField("replacement_exercise", event.target.value)} />
          <input className={inputClass} placeholder="Спорт-теги через запятую: похудение, 40+, дом" value={form.sport_tags} onChange={(event) => updateField("sport_tags", event.target.value)} />
          <textarea className={inputClass} rows={3} placeholder="Заметки тренера" value={form.coach_notes} onChange={(event) => updateField("coach_notes", event.target.value)} />
          <input className={inputClass} placeholder="Видео-ссылка" value={form.video_url} onChange={(event) => updateField("video_url", event.target.value)} />

          <label className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-bold">
            <input type="checkbox" checked={form.is_active} onChange={(event) => updateField("is_active", event.target.checked)} />
            Активно в базе упражнений
          </label>

          <label className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] p-4">
            <span className="block font-black">Фото упражнения</span>
            <span className="mt-1 block text-sm text-[var(--muted)]">JPG, PNG или WEBP до 5 MB</span>
            <input
              className="mt-3 block w-full text-sm"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
            />
            {selectedFile && <span className="mt-2 block text-sm font-bold text-[var(--accent)]">Выбрано: {selectedFile.name}</span>}
          </label>
        </div>

        {message && <p className="mt-5 rounded-xl bg-green-50 p-4 font-bold text-green-700">{message}</p>}
        {error && <p className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-[var(--accent)] px-6 py-4 font-black text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
        >
          {isSubmitting ? "Сохраняем..." : "Сохранить упражнение"}
        </button>
      </form>

      <section>
        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-black">CMS упражнений</h2>
              <p className="mt-2 text-[var(--muted)]">Поиск, фильтры, теги, замены и включение/выключение упражнений.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl bg-[var(--background)] p-3"><b className="block text-xl">{data.exercises.length}</b>Всего</div>
              <div className="rounded-2xl bg-green-50 p-3 text-green-800"><b className="block text-xl">{activeCount}</b>Активно</div>
              <div className="rounded-2xl bg-red-50 p-3 text-red-800"><b className="block text-xl">{inactiveCount}</b>Скрыто</div>
            </div>
          </div>

          <form onSubmit={applyFilters} className="mt-6 grid gap-3 lg:grid-cols-5">
            <input className={inputClass} placeholder="Поиск" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} />
            <select className={inputClass} value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
              <option value="">Все категории</option>
              {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <select className={inputClass} value={filters.muscle_group} onChange={(event) => updateFilter("muscle_group", event.target.value)}>
              <option value="">Все мышцы</option>
              {muscleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <select className={inputClass} value={filters.active} onChange={(event) => updateFilter("active", event.target.value)}>
              <option value="">Все статусы</option>
              <option value="true">Активные</option>
              <option value="false">Скрытые</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl bg-[var(--accent)] px-4 py-3 font-black text-white" type="submit">Фильтр</button>
              <button className="rounded-xl border border-[var(--border)] px-4 py-3 font-black" type="button" onClick={resetFilters}>Сброс</button>
            </div>
          </form>
        </div>

        {isLoading && <div className="mt-5 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка упражнений...</div>}

        {!isLoading && !data.isConfigured && (
          <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">
            Supabase ещё не настроен. Заполните .env.local и выполните SQL Этапа 11.
          </div>
        )}

        {!isLoading && data.error && data.isConfigured && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
            Ошибка загрузки упражнений: {data.error}
          </div>
        )}

        {!isLoading && !data.error && data.exercises.length === 0 && (
          <div className="mt-5 rounded-3xl sport-card p-8 text-center shadow-sm">
            <h3 className="text-2xl font-black">Упражнений пока нет</h3>
            <p className="mt-3 text-[var(--muted)]">Добавьте первое упражнение или сбросьте фильтры.</p>
          </div>
        )}

        <div className="mt-5 grid gap-5">
          {data.exercises.map((exercise) => (
            <article key={exercise.id} className={`overflow-hidden rounded-3xl sport-card shadow-sm md:grid md:grid-cols-[220px_1fr] ${exercise.is_active ? "" : "opacity-65"}`}>
              <div className="flex min-h-52 items-center justify-center bg-[#efe6d9]">
                {exercise.image_url ? (
                  <img src={exercise.image_url} alt={exercise.name} className="h-full max-h-64 w-full object-cover" />
                ) : (
                  <span className="px-6 text-center font-bold text-[var(--muted)]">Фото не добавлено</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black">{exercise.name}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${exercise.is_active ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                        {exercise.is_active ? "Активно" : "Скрыто"}
                      </span>
                    </div>
                    <p className="mt-1 font-bold text-[var(--accent)]">{showValue(exercise.category)} / {showValue(exercise.subcategory)}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">Мышцы: {showValue(exercise.muscle_group)} | Оборудование: {showValue(exercise.equipment)}</p>
                  </div>
                  <span className="rounded-full bg-[var(--background)] px-3 py-1 text-sm font-black">
                    {exercise.difficulty_level ? difficultyLabels[exercise.difficulty_level] : "Уровень не указан"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                  <p><b>Техника:</b> {showValue(exercise.technique)}</p>
                  <p><b>Ошибки:</b> {showValue(exercise.common_mistakes)}</p>
                  <p><b>Ограничения:</b> {showValue(exercise.contraindications)}</p>
                  <p><b>Замена:</b> {showValue(exercise.replacement_exercise)}</p>
                  <p><b>Заметки:</b> {showValue(exercise.coach_notes)}</p>
                  <p><b>Дата:</b> {formatDate(exercise.created_at)}</p>
                </div>

                {exercise.sport_tags && exercise.sport_tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exercise.sport_tags.map((tag) => (
                      <span key={`${exercise.id}-${tag}`} className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-black">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {exercise.video_url && (
                    <a href={exercise.video_url} target="_blank" rel="noreferrer" className="inline-block rounded-xl border border-[var(--border)] px-4 py-2 font-bold">
                      Открыть видео
                    </a>
                  )}
                  <button type="button" onClick={() => toggleActive(exercise)} className="rounded-xl border border-[var(--border)] px-4 py-2 font-bold">
                    {exercise.is_active ? "Выключить" : "Включить"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
