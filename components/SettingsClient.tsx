"use client";

import { useState } from "react";
import type {
  SiteSettings,
  SiteSettingsFormData,
} from "@/types/site-settings";

type SettingsClientProps = {
  initialSettings: SiteSettings;
};

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [form, setForm] = useState<SiteSettingsFormData>({
    name: initialSettings.name,
    slogan: initialSettings.slogan,
    logoText: initialSettings.logoText,
    logoSubtitle: initialSettings.logoSubtitle,
    phone1: initialSettings.phone1,
    phone2: initialSettings.phone2,
    whatsapp: initialSettings.whatsapp,
    email: initialSettings.email,
    address: initialSettings.address,
    workTime: initialSettings.workTime,
    instagram: initialSettings.instagram,
    facebook: initialSettings.facebook,
    telegram: initialSettings.telegram,
    heroTitle: initialSettings.heroTitle,
    heroSubtitle: initialSettings.heroSubtitle,
    aboutText: initialSettings.aboutText,
    footerText: initialSettings.footerText,
    requisites: initialSettings.requisites,
    commercialSignature: initialSettings.commercialSignature,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof SiteSettingsFormData>(
    key: K,
    value: SiteSettingsFormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as SiteSettings | { message?: string };

      if (!response.ok) {
        throw new Error("message" in data ? data.message : "Ошибка сохранения.");
      }

      setMessage("Настройки сохранены.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={saveSettings} className="space-y-8">
      <div className="card p-6">
        <h2 className="text-3xl font-bold mb-5">Компания и логотип</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <input className="input-dark" placeholder="Название магазина" value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
          <input className="input-dark" placeholder="Слоган" value={form.slogan} onChange={(event) => updateField("slogan", event.target.value)} />
          <input className="input-dark" placeholder="Текст логотипа" value={form.logoText} onChange={(event) => updateField("logoText", event.target.value)} />
          <input className="input-dark" placeholder="Подпись логотипа" value={form.logoSubtitle} onChange={(event) => updateField("logoSubtitle", event.target.value)} />
        </div>

        <div className="mt-6 rounded-2xl border border-borderColor bg-secondary p-5">
          <p className="text-sm text-secondaryText mb-2">Предпросмотр логотипа</p>
          <p className="text-4xl font-bold text-accent">{form.logoText || "JDM PARTS"}</p>
          <p className="text-secondaryText mt-2">{form.logoSubtitle}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-3xl font-bold mb-5">Контакты</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <input className="input-dark" placeholder="Телефон 1" value={form.phone1} onChange={(event) => updateField("phone1", event.target.value)} required />
          <input className="input-dark" placeholder="Телефон 2" value={form.phone2} onChange={(event) => updateField("phone2", event.target.value)} />
          <input className="input-dark" placeholder="WhatsApp" value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} required />
          <input className="input-dark" placeholder="Email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
          <input className="input-dark md:col-span-2" placeholder="Адрес" value={form.address} onChange={(event) => updateField("address", event.target.value)} />
          <input className="input-dark md:col-span-2" placeholder="Режим работы" value={form.workTime} onChange={(event) => updateField("workTime", event.target.value)} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-3xl font-bold mb-5">Социальные сети</h2>

        <div className="grid md:grid-cols-3 gap-5">
          <input className="input-dark" placeholder="Instagram" value={form.instagram} onChange={(event) => updateField("instagram", event.target.value)} />
          <input className="input-dark" placeholder="Facebook" value={form.facebook} onChange={(event) => updateField("facebook", event.target.value)} />
          <input className="input-dark" placeholder="Telegram" value={form.telegram} onChange={(event) => updateField("telegram", event.target.value)} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-3xl font-bold mb-5">Тексты главной страницы</h2>

        <div className="grid gap-5">
          <input className="input-dark" placeholder="Главный заголовок" value={form.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} />
          <textarea className="input-dark min-h-[100px]" placeholder="Подзаголовок" value={form.heroSubtitle} onChange={(event) => updateField("heroSubtitle", event.target.value)} />
          <textarea className="input-dark min-h-[120px]" placeholder="О компании" value={form.aboutText} onChange={(event) => updateField("aboutText", event.target.value)} />
          <textarea className="input-dark min-h-[100px]" placeholder="Текст футера" value={form.footerText} onChange={(event) => updateField("footerText", event.target.value)} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-3xl font-bold mb-5">Реквизиты и подпись КП</h2>

        <div className="grid gap-5">
          <textarea className="input-dark min-h-[160px]" placeholder="Реквизиты компании" value={form.requisites} onChange={(event) => updateField("requisites", event.target.value)} />
          <input className="input-dark" placeholder="Подпись в коммерческом предложении" value={form.commercialSignature} onChange={(event) => updateField("commercialSignature", event.target.value)} />
        </div>
      </div>

      {error && <div className="rounded-xl bg-danger p-4 text-white">{error}</div>}
      {message && <div className="rounded-xl bg-success p-4 text-white">{message}</div>}

      <button type="submit" disabled={isSaving} className="btn-primary w-full">
        {isSaving ? "Сохраняем..." : "Сохранить настройки сайта"}
      </button>
    </form>
  );
}
