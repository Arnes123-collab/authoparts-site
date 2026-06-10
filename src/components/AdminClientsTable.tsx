"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/types/client";

type ApiResponse = {
  clients: Client[];
  error: string | null;
  isConfigured: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function showValue(value: string | number | null) {
  return value === null || value === "" ? "-" : value;
}

const statusLabels: Record<string, string> = {
  new: "Новый",
  active: "Активный",
  paused: "Пауза",
  finished: "Завершён",
};

export function AdminClientsTable() {
  const [data, setData] = useState<ApiResponse>({ clients: [], error: null, isConfigured: true });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch("/api/clients", { cache: "no-store" });
        const result = (await response.json()) as ApiResponse;
        setData(result);
      } catch {
        setData({ clients: [], error: "Не удалось загрузить клиентов", isConfigured: true });
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, []);

  if (isLoading) {
    return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка клиентов...</div>;
  }

  if (!data.isConfigured) {
    return (
      <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">
        Supabase ещё не настроен. Таблица клиентов появится после заполнения .env.local.
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
        Ошибка загрузки клиентов: {data.error}
      </div>
    );
  }

  if (data.clients.length === 0) {
    return (
      <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">
        <h2 className="text-2xl font-black">Заявок пока нет</h2>
        <p className="mt-3 text-[var(--muted)]">Когда клиент отправит форму на сайте, он появится здесь.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-3xl sport-card shadow-sm">
      <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
        <thead className="bg-[var(--surface-strong)] text-white">
          <tr>
            {["Дата", "Статус", "Имя", "Возраст", "Вес", "Рост", "Цель", "Опыт", "Травмы", "Место", "Дней", "WhatsApp", "Instagram"].map((heading) => (
              <th key={heading} className="p-4">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.clients.map((client) => (
            <tr key={client.id} className="border-b border-[var(--border)] align-top">
              <td className="p-4 font-semibold">{formatDate(client.created_at)}</td>
              <td className="p-4"><span className="rounded-full bg-[var(--background)] px-3 py-1 font-black">{statusLabels[client.status] || client.status}</span></td>
              <td className="p-4 font-black">{client.name}</td>
              <td className="p-4">{showValue(client.age)}</td>
              <td className="p-4">{showValue(client.weight)}</td>
              <td className="p-4">{showValue(client.height)}</td>
              <td className="p-4 max-w-[220px]">{client.goal}</td>
              <td className="p-4">{showValue(client.experience)}</td>
              <td className="p-4 max-w-[220px]">{showValue(client.injuries)}</td>
              <td className="p-4">{showValue(client.training_place)}</td>
              <td className="p-4">{showValue(client.training_days)}</td>
              <td className="p-4">{showValue(client.whatsapp)}</td>
              <td className="p-4">{showValue(client.instagram)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
