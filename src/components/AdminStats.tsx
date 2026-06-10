"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/types/client";

type ApiResponse = {
  clients: Client[];
  error: string | null;
  isConfigured: boolean;
};

export function AdminStats() {
  const [data, setData] = useState<ApiResponse>({ clients: [], error: null, isConfigured: true });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch("/api/clients", { cache: "no-store" });
        const result = (await response.json()) as ApiResponse;
        setData(result);
      } catch {
        setData({ clients: [], error: "Не удалось загрузить статистику", isConfigured: true });
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, []);

  const newClients = data.clients.filter((client) => client.status === "new").length;

  return (
    <>
      {!data.isConfigured && (
        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">
          Supabase ещё не настроен. Заполните .env.local, затем перезапустите проект.
        </div>
      )}
      {data.error && data.isConfigured && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
          Ошибка загрузки данных: {data.error}
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <p className="text-[var(--muted)]">Всего заявок</p>
          <p className="mt-3 text-4xl font-black">{isLoading ? "..." : data.clients.length}</p>
        </div>
        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <p className="text-[var(--muted)]">Новые заявки</p>
          <p className="mt-3 text-4xl font-black text-[var(--accent)]">{isLoading ? "..." : newClients}</p>
        </div>
        <div className="rounded-3xl sport-card p-6 shadow-sm">
          <p className="text-[var(--muted)]">Статус MVP</p>
          <p className="mt-3 text-2xl font-black">Этап 4</p>
        </div>
      </div>
    </>
  );
}
