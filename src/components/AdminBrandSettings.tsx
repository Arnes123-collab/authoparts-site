"use client";

import { useEffect, useState } from "react";
import type { CoachSettings, CoachSettingsPayload } from "@/types/coach-settings";

const defaultForm: CoachSettingsPayload = {
  coach_name: "Fitness Coach",
  brand_name: "Fitness Coach Pro",
  specialization: "Похудение, набор мышц, тренировки после 40+",
  logo_url: "",
  coach_photo_url: "",
  primary_color: "#070707",
  secondary_color: "#151515",
  accent_color: "#D62828",
  gold_color: "#D6A84F",
  instagram: "",
  whatsapp: "",
  email: "",
  city: "",
  offer_title: "Сильное тело без хаоса",
  offer_description: "Тренировки, питание, отчёты и прогресс в одной системе.",
};

const inputClass = "mt-2 w-full rounded-xl border border-[var(--border)] p-3";

export function AdminBrandSettings() {
  const [form, setForm] = useState<CoachSettingsPayload>(defaultForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const response = await fetch("/api/coach-settings");
      const data = (await response.json()) as { settings: CoachSettings | null; error?: string };
      if (data.settings) {
        setForm({
          coach_name: data.settings.coach_name,
          brand_name: data.settings.brand_name,
          specialization: data.settings.specialization || "",
          logo_url: data.settings.logo_url || "",
          coach_photo_url: data.settings.coach_photo_url || "",
          primary_color: data.settings.primary_color,
          secondary_color: data.settings.secondary_color,
          accent_color: data.settings.accent_color,
          gold_color: data.settings.gold_color,
          instagram: data.settings.instagram || "",
          whatsapp: data.settings.whatsapp || "",
          email: data.settings.email || "",
          city: data.settings.city || "",
          offer_title: data.settings.offer_title || "",
          offer_description: data.settings.offer_description || "",
        });
      }
      setIsLoading(false);
    }
    void loadSettings();
  }, []);

  function updateField<K extends keyof CoachSettingsPayload>(field: K, value: CoachSettingsPayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch("/api/coach-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { message?: string; error?: string };
    setMessage(response.ok ? data.message || "Сохранено" : data.error || "Ошибка сохранения");
    setIsSaving(false);
  }

  if (isLoading) return <div className="mt-8 rounded-3xl sport-card p-8 text-center">Загрузка настроек...</div>;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl sport-card p-6">
        <h2 className="text-2xl font-black">Бренд тренера</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Эти настройки нужны для продажи шаблона другим тренерам: имя, контакты, цвета, фото и оффер.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="font-bold">Имя тренера<input value={form.coach_name} onChange={(event) => updateField("coach_name", event.target.value)} className={inputClass} /></label>
          <label className="font-bold">Название бренда<input value={form.brand_name} onChange={(event) => updateField("brand_name", event.target.value)} className={inputClass} /></label>
        </div>

        <label className="mt-4 block font-bold">Специализация<input value={form.specialization || ""} onChange={(event) => updateField("specialization", event.target.value)} className={inputClass} /></label>
        <label className="mt-4 block font-bold">Главный оффер<input value={form.offer_title || ""} onChange={(event) => updateField("offer_title", event.target.value)} className={inputClass} /></label>
        <label className="mt-4 block font-bold">Описание оффера<textarea value={form.offer_description || ""} onChange={(event) => updateField("offer_description", event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border)] p-3" /></label>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="font-bold">Фото тренера URL<input value={form.coach_photo_url || ""} onChange={(event) => updateField("coach_photo_url", event.target.value)} className={inputClass} /></label>
          <label className="font-bold">Логотип URL<input value={form.logo_url || ""} onChange={(event) => updateField("logo_url", event.target.value)} className={inputClass} /></label>
          <label className="font-bold">Instagram<input value={form.instagram || ""} onChange={(event) => updateField("instagram", event.target.value)} className={inputClass} /></label>
          <label className="font-bold">WhatsApp<input value={form.whatsapp || ""} onChange={(event) => updateField("whatsapp", event.target.value)} className={inputClass} /></label>
          <label className="font-bold">Email<input value={form.email || ""} onChange={(event) => updateField("email", event.target.value)} className={inputClass} /></label>
          <label className="font-bold">Город<input value={form.city || ""} onChange={(event) => updateField("city", event.target.value)} className={inputClass} /></label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="font-bold">Фон<input type="color" value={form.primary_color} onChange={(event) => updateField("primary_color", event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] p-1" /></label>
          <label className="font-bold">Карточки<input type="color" value={form.secondary_color} onChange={(event) => updateField("secondary_color", event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] p-1" /></label>
          <label className="font-bold">Красный<input type="color" value={form.accent_color} onChange={(event) => updateField("accent_color", event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] p-1" /></label>
          <label className="font-bold">Золото<input type="color" value={form.gold_color} onChange={(event) => updateField("gold_color", event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] p-1" /></label>
        </div>

        <button disabled={isSaving} className="mt-6 rounded-xl bg-[var(--accent)] px-6 py-3 font-black text-white disabled:opacity-60">
          {isSaving ? "Сохраняю..." : "Сохранить бренд"}
        </button>
        {message && <p className="mt-4 font-bold text-[var(--accent-gold)]">{message}</p>}
      </form>

      <section className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#1f1f1f] to-[#090909] p-6">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--accent-gold)]">Предпросмотр</p>
        <h2 className="mt-4 text-4xl font-black">{form.brand_name}</h2>
        <p className="mt-2 text-[var(--muted)]">{form.specialization}</p>
        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-black/45 p-6">
          <p className="text-sm font-bold text-[var(--accent)]">{form.coach_name}</p>
          <h3 className="mt-3 text-3xl font-black text-white">{form.offer_title}</h3>
          <p className="mt-4 leading-7 text-[var(--muted)]">{form.offer_description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-black">
            <span className="rounded-full bg-[var(--accent)] px-4 py-2 text-white">Старт</span>
            <span className="rounded-full border border-[var(--accent-gold)] px-4 py-2 text-[var(--accent-gold)]">Премиум</span>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-white">40+</span>
          </div>
        </div>
      </section>
    </div>
  );
}
