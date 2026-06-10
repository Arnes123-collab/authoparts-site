"use client";

import { useState } from "react";
import type {
  DailyReport,
  DailyReportFormData,
} from "@/types/daily-report";

type DailyReportFormProps = {
  onCreated: (report: DailyReport) => void;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const initialForm: DailyReportFormData = {
  reportDate: todayIso(),
  processedLeads: 0,
  sentOffers: 0,
  clientReplies: 0,
  rejections: 0,
  salesCount: 0,
  salesAmount: 0,
  comment: "",
};

export default function DailyReportForm({ onCreated }: DailyReportFormProps) {
  const [form, setForm] = useState<DailyReportFormData>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateNumberField(
    key: keyof Omit<DailyReportFormData, "reportDate" | "comment">,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [key]: Number(value || 0),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/daily-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as DailyReport | { message?: string };

      if (!response.ok) {
        throw new Error("message" in data ? data.message : "Ошибка сохранения.");
      }

      onCreated(data as DailyReport);
      setSuccess("Отчёт сохранён.");
      setForm({
        ...initialForm,
        reportDate: todayIso(),
      });

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения отчёта.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-3xl font-bold mb-2">Дневной отчёт продавца</h2>
      <p className="text-secondaryText mb-6">
        Фиксируйте реальные действия за день: звонки, КП, ответы, отказы и продажи.
      </p>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-secondaryText mb-2">
            Дата отчёта
          </label>
          <input
            type="date"
            className="input-dark"
            value={form.reportDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                reportDate: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">
            Обработано клиентов
          </label>
          <input
            type="number"
            min="0"
            className="input-dark"
            value={form.processedLeads}
            onChange={(event) => updateNumberField("processedLeads", event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">
            КП отправлено
          </label>
          <input
            type="number"
            min="0"
            className="input-dark"
            value={form.sentOffers}
            onChange={(event) => updateNumberField("sentOffers", event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">
            Ответы клиентов
          </label>
          <input
            type="number"
            min="0"
            className="input-dark"
            value={form.clientReplies}
            onChange={(event) => updateNumberField("clientReplies", event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">
            Отказы
          </label>
          <input
            type="number"
            min="0"
            className="input-dark"
            value={form.rejections}
            onChange={(event) => updateNumberField("rejections", event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">
            Количество продаж
          </label>
          <input
            type="number"
            min="0"
            className="input-dark"
            value={form.salesCount}
            onChange={(event) => updateNumberField("salesCount", event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-secondaryText mb-2">
            Сумма продаж, тг
          </label>
          <input
            type="number"
            min="0"
            className="input-dark"
            value={form.salesAmount}
            onChange={(event) => updateNumberField("salesAmount", event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-secondaryText mb-2">
            Комментарий по дню
          </label>
          <textarea
            className="input-dark min-h-[120px]"
            value={form.comment}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                comment: event.target.value,
              }))
            }
            placeholder="Что сработало, где потеряли клиента, кому завтра написать..."
          />
        </div>

        {error && (
          <div className="rounded-xl bg-danger p-4 text-white md:col-span-2">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-success p-4 text-white md:col-span-2">
            {success}
          </div>
        )}

        <button type="submit" disabled={isSaving} className="btn-primary md:col-span-2">
          {isSaving ? "Сохраняем..." : "Сохранить отчёт"}
        </button>
      </form>
    </div>
  );
}
