"use client";

import { useState } from "react";
import type { DealStage, Lead, LeadPriority } from "@/types/lead";
import { dealStageLabels, priorityLabels } from "@/components/DealLabels";

type DealInfoPanelProps = {
  lead: Lead;
};

const dealStages: DealStage[] = [
  "new_request",
  "contacted",
  "price_requested",
  "offer_sent",
  "ordered",
  "completed",
  "lost",
];

const priorities: LeadPriority[] = ["low", "medium", "high"];

export default function DealInfoPanel({ lead }: DealInfoPanelProps) {
  const [dealStage, setDealStage] = useState<DealStage>(lead.dealStage);
  const [estimatedAmount, setEstimatedAmount] = useState(String(lead.estimatedAmount));
  const [nextContactDate, setNextContactDate] = useState(lead.nextContactDate);
  const [priority, setPriority] = useState<LeadPriority>(lead.priority);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveDeal() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/leads/${lead.id}/deal`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealStage,
          estimatedAmount: Number(estimatedAmount || 0),
          nextContactDate,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить данные сделки.");
      }

      setMessage("Данные сделки сохранены.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="card p-5 h-fit">
      <h2 className="text-2xl font-bold mb-5">Деньги и действия</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-secondaryText mb-2">Этап сделки</label>
          <select value={dealStage} onChange={(event) => setDealStage(event.target.value as DealStage)} className="input-dark">
            {dealStages.map((stage) => (
              <option key={stage} value={stage}>{dealStageLabels[stage]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">Предполагаемая сумма, тг</label>
          <input
            type="number"
            min="0"
            className="input-dark"
            value={estimatedAmount}
            onChange={(event) => setEstimatedAmount(event.target.value)}
            placeholder="Например: 45000"
          />
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">Следующий контакт</label>
          <input
            type="date"
            className="input-dark"
            value={nextContactDate}
            onChange={(event) => setNextContactDate(event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-secondaryText mb-2">Приоритет</label>
          <select value={priority} onChange={(event) => setPriority(event.target.value as LeadPriority)} className="input-dark">
            {priorities.map((item) => (
              <option key={item} value={item}>{priorityLabels[item]}</option>
            ))}
          </select>
        </div>

        <button type="button" onClick={saveDeal} disabled={isSaving} className="btn-primary w-full">
          {isSaving ? "Сохраняем..." : "Сохранить сделку"}
        </button>

        {message && <p className="text-success text-sm">{message}</p>}
        {error && <p className="text-danger text-sm">{error}</p>}
      </div>
    </div>
  );
}
