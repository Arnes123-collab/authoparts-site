"use client";

import { useState } from "react";
import type { LeadStatus } from "@/types/lead";

type LeadStatusSelectProps = { leadId: string; initialStatus: LeadStatus };

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "ordered", label: "Заказано" },
  { value: "completed", label: "Выполнено" },
  { value: "cancelled", label: "Отказ" },
];

export default function LeadStatusSelect({ leadId, initialStatus }: LeadStatusSelectProps) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(nextStatus: LeadStatus) {
    setStatus(nextStatus);
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("Не удалось обновить статус.");
    } catch (err) {
      setStatus(initialStatus);
      setError(err instanceof Error ? err.message : "Ошибка обновления.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <label className="block text-sm text-secondaryText mb-2">Статус заявки</label>
      <select value={status} disabled={isSaving} onChange={(event) => handleChange(event.target.value as LeadStatus)} className="input-dark">
        {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      {isSaving && <p className="text-sm text-secondaryText mt-2">Сохраняем...</p>}
      {error && <p className="text-sm text-danger mt-2">{error}</p>}
    </div>
  );
}
