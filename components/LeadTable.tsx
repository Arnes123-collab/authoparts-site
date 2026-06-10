"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DealStage, Lead, LeadPriority } from "@/types/lead";
import LeadStatusBadge from "@/components/LeadStatusBadge";
import DealStageBadge from "@/components/DealStageBadge";
import PriorityBadge from "@/components/PriorityBadge";
import { dealStageLabels, priorityLabels } from "@/components/DealLabels";

type LeadTableProps = { leads: Lead[] };

function getCarName(lead: Lead) {
  const car = `${lead.carBrand} ${lead.carModel}`.trim();
  return car || "Не указано";
}

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export default function LeadTable({ leads }: LeadTableProps) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<DealStage | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<LeadPriority | "all">("all");

  const filteredLeads = useMemo(() => {
    const value = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesQuery = !value || [
        lead.name,
        lead.phone,
        lead.vin,
        lead.carBrand,
        lead.carModel,
        lead.partRequest,
      ].join(" ").toLowerCase().includes(value);

      const matchesStage = stageFilter === "all" || lead.dealStage === stageFilter;
      const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;

      return matchesQuery && matchesStage && matchesPriority;
    });
  }, [query, leads, stageFilter, priorityFilter]);

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold">Клиенты и сделки</h2>
          <input className="input-dark md:max-w-sm" placeholder="Поиск: имя, телефон, VIN, авто..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value as DealStage | "all")} className="input-dark">
            <option value="all">Все этапы сделки</option>
            {(Object.keys(dealStageLabels) as DealStage[]).map((stage) => (
              <option key={stage} value={stage}>{dealStageLabels[stage]}</option>
            ))}
          </select>

          <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as LeadPriority | "all")} className="input-dark">
            <option value="all">Все приоритеты</option>
            {(Object.keys(priorityLabels) as LeadPriority[]).map((priority) => (
              <option key={priority} value={priority}>{priorityLabels[priority]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-borderColor text-left text-secondaryText">
              <th className="py-4 pr-4">Клиент</th>
              <th className="py-4 pr-4">Телефон</th>
              <th className="py-4 pr-4">Авто</th>
              <th className="py-4 pr-4">Запрос</th>
              <th className="py-4 pr-4">Этап сделки</th>
              <th className="py-4 pr-4">Сумма</th>
              <th className="py-4 pr-4">Контакт</th>
              <th className="py-4 pr-4">Приоритет</th>
              <th className="py-4 pr-4">Статус</th>
              <th className="py-4 pr-4">Действие</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-borderColor/70">
                <td className="py-4 pr-4 font-semibold">{lead.name}</td>
                <td className="py-4 pr-4 text-secondaryText">{lead.phone}</td>
                <td className="py-4 pr-4 text-secondaryText">{getCarName(lead)}</td>
                <td className="py-4 pr-4 text-secondaryText">{lead.partRequest}</td>
                <td className="py-4 pr-4"><DealStageBadge stage={lead.dealStage} /></td>
                <td className="py-4 pr-4 text-secondaryText">{money(lead.estimatedAmount)} тг</td>
                <td className="py-4 pr-4 text-secondaryText">{lead.nextContactDate || "Не назначен"}</td>
                <td className="py-4 pr-4"><PriorityBadge priority={lead.priority} /></td>
                <td className="py-4 pr-4"><LeadStatusBadge status={lead.status} /></td>
                <td className="py-4 pr-4">
                  <Link href={`/admin/leads/${lead.id}`} className="btn-secondary px-4 py-2">Открыть</Link>
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-secondaryText">Клиенты не найдены.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
