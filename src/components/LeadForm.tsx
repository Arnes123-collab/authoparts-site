"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  experience: string;
  injuries: string;
  training_place: string;
  training_days: string;
  whatsapp: string;
  instagram: string;
};

const initialFormState: FormState = {
  name: "",
  age: "",
  weight: "",
  height: "",
  goal: "",
  experience: "",
  injuries: "",
  training_place: "",
  training_days: "",
  whatsapp: "",
  instagram: "",
};

const inputClass = "rounded-xl border border-[var(--border)] p-4 outline-none transition focus:border-[var(--accent)]";

export function LeadForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!form.name.trim()) {
      setError("Введите имя клиента");
      return;
    }

    if (!form.goal.trim()) {
      setError("Введите цель клиента");
      return;
    }

    if (!form.whatsapp.trim() && !form.instagram.trim()) {
      setError("Укажите WhatsApp или Instagram для связи");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Ошибка отправки заявки");
      }

      setMessage(result.message || "Заявка успешно отправлена");
      setForm(initialFormState);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ошибка отправки заявки");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Имя *"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Возраст"
          inputMode="numeric"
          value={form.age}
          onChange={(event) => updateField("age", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Вес"
          inputMode="decimal"
          value={form.weight}
          onChange={(event) => updateField("weight", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Рост"
          inputMode="decimal"
          value={form.height}
          onChange={(event) => updateField("height", event.target.value)}
        />
      </div>

      <textarea
        className={`${inputClass} min-h-28`}
        placeholder="Цель *: похудение, набор мышц, здоровье, после 40"
        value={form.goal}
        onChange={(event) => updateField("goal", event.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Опыт тренировок"
          value={form.experience}
          onChange={(event) => updateField("experience", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Где тренируется: зал / дом"
          value={form.training_place}
          onChange={(event) => updateField("training_place", event.target.value)}
        />
      </div>

      <textarea
        className={`${inputClass} min-h-24`}
        placeholder="Травмы, боли, ограничения"
        value={form.injuries}
        onChange={(event) => updateField("injuries", event.target.value)}
      />

      <input
        className={inputClass}
        placeholder="Сколько раз в неделю готов тренироваться"
        value={form.training_days}
        onChange={(event) => updateField("training_days", event.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputClass}
          placeholder="WhatsApp *"
          value={form.whatsapp}
          onChange={(event) => updateField("whatsapp", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Instagram *"
          value={form.instagram}
          onChange={(event) => updateField("instagram", event.target.value)}
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}
      {message && <p className="rounded-xl bg-green-50 p-4 font-bold text-green-700">{message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-[var(--accent)] px-7 py-4 font-black text-white transition hover:bg-[var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Отправляем..." : "Отправить заявку"}
      </button>
    </form>
  );
}
