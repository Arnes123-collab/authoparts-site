"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Client } from "@/types/client";
import type { PaymentListItem, PaymentStatus } from "@/types/payment";

type ClientsResponse = {
  clients: Client[];
  error: string | null;
  isConfigured: boolean;
};

type PaymentsResponse = {
  payments: PaymentListItem[];
  error: string | null;
  isConfigured: boolean;
};

type PaymentForm = {
  client_id: string;
  tariff: string;
  amount: string;
  currency: string;
  payment_date: string;
  start_date: string;
  expiry_date: string;
  status: PaymentStatus;
  note: string;
};

const initialForm: PaymentForm = {
  client_id: "",
  tariff: "Месячное сопровождение",
  amount: "40000",
  currency: "KZT",
  payment_date: "",
  start_date: "",
  expiry_date: "",
  status: "paid",
  note: "",
};

const statusLabels: Record<PaymentStatus, string> = {
  paid: "Оплачено",
  pending: "Ожидает",
  overdue: "Просрочено",
  paused: "Пауза",
  cancelled: "Отменено",
};

const tariffOptions = [
  "Разовая программа",
  "План на месяц",
  "Месячное сопровождение",
  "Премиум ведение",
  "Питание + тренировки",
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(dateValue: string, days: number) {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Number(amount || 0)) + ` ${currency}`;
}

function daysLeftLabel(daysLeft: number | null) {
  if (daysLeft === null) return "-";
  if (daysLeft < 0) return `Просрочено ${Math.abs(daysLeft)} дн.`;
  if (daysLeft === 0) return "Последний день";
  return `${daysLeft} дн.`;
}

export function AdminPaymentsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [form, setForm] = useState<PaymentForm>({ ...initialForm, payment_date: todayIso(), start_date: todayIso(), expiry_date: addDaysIso(todayIso(), 30) });

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [clientsResponse, paymentsResponse] = await Promise.all([
        fetch("/api/clients", { cache: "no-store" }),
        fetch("/api/payments", { cache: "no-store" }),
      ]);

      const clientsResult = (await clientsResponse.json()) as ClientsResponse;
      const paymentsResult = (await paymentsResponse.json()) as PaymentsResponse;

      setIsConfigured(clientsResult.isConfigured && paymentsResult.isConfigured);
      setClients(clientsResult.clients || []);
      setPayments(paymentsResult.payments || []);

      if (clientsResult.error) setError(clientsResult.error);
      if (paymentsResult.error) setError(paymentsResult.error);
    } catch {
      setError("Не удалось загрузить оплаты и клиентов");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    return payments.reduce(
      (acc, payment) => {
        acc.total += Number(payment.amount || 0);
        if (payment.computed_status === "paid") acc.paid += 1;
        if (payment.computed_status === "overdue") acc.overdue += 1;
        if (payment.computed_status === "paused") acc.paused += 1;
        return acc;
      },
      { total: 0, paid: 0, overdue: 0, paused: 0 },
    );
  }, [payments]);

  function updateField<K extends keyof PaymentForm>(key: K, value: PaymentForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setQuickPeriod(days: number) {
    const start = form.start_date || todayIso();
    updateField("expiry_date", addDaysIso(start, days));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка сохранения оплаты");
      setMessage(result.message || "Оплата добавлена");
      setForm({ ...initialForm, payment_date: todayIso(), start_date: todayIso(), expiry_date: addDaysIso(todayIso(), 30) });
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения оплаты");
    } finally {
      setIsSaving(false);
    }
  }

  async function updatePaymentStatus(paymentId: string, status: PaymentStatus) {
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка изменения статуса");
      setMessage(result.message || "Статус обновлён");
      await loadData();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Ошибка изменения статуса");
    }
  }

  async function deletePayment(paymentId: string) {
    if (!window.confirm("Удалить эту запись оплаты?")) return;
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/payments/${paymentId}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка удаления оплаты");
      setMessage(result.message || "Оплата удалена");
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления оплаты");
    }
  }

  if (isLoading) {
    return <div className="mt-8 rounded-3xl sport-card p-8 text-center shadow-sm">Загрузка оплат...</div>;
  }

  if (!isConfigured) {
    return <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-900">Supabase не настроен или таблица payments ещё не создана.</div>;
  }

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl sport-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">Добавить оплату</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Фиксируйте тариф, срок действия и статус клиента.</p>

        <label className="mt-5 block text-sm font-black">Клиент</label>
        <select value={form.client_id} onChange={(event) => updateField("client_id", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
          <option value="">Выберите клиента</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
        </select>

        <label className="mt-4 block text-sm font-black">Тариф</label>
        <select value={form.tariff} onChange={(event) => updateField("tariff", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
          {tariffOptions.map((tariff) => <option key={tariff} value={tariff}>{tariff}</option>)}
        </select>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-black">Сумма</label>
            <input value={form.amount} onChange={(event) => updateField("amount", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" inputMode="numeric" />
          </div>
          <div>
            <label className="block text-sm font-black">Валюта</label>
            <input value={form.currency} onChange={(event) => updateField("currency", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-black">Дата оплаты</label>
            <input type="date" value={form.payment_date} onChange={(event) => updateField("payment_date", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" />
          </div>
          <div>
            <label className="block text-sm font-black">Старт</label>
            <input type="date" value={form.start_date} onChange={(event) => updateField("start_date", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" />
          </div>
          <div>
            <label className="block text-sm font-black">Окончание</label>
            <input type="date" value={form.expiry_date} onChange={(event) => updateField("expiry_date", event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setQuickPeriod(14)} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm font-bold">+14 дней</button>
          <button type="button" onClick={() => setQuickPeriod(30)} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm font-bold">+30 дней</button>
          <button type="button" onClick={() => setQuickPeriod(90)} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm font-bold">+90 дней</button>
        </div>

        <label className="mt-4 block text-sm font-black">Статус</label>
        <select value={form.status} onChange={(event) => updateField("status", event.target.value as PaymentStatus)} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3">
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>

        <label className="mt-4 block text-sm font-black">Комментарий</label>
        <textarea value={form.note} onChange={(event) => updateField("note", event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border)] p-3" placeholder="Например: оплатил Kaspi, тариф с питанием" />

        {error && <div className="mt-4 rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-xl bg-green-50 p-4 font-bold text-green-700">{message}</div>}

        <button disabled={isSaving || clients.length === 0} className="mt-5 w-full rounded-xl bg-[var(--accent)] px-6 py-4 font-black text-white disabled:opacity-60">
          {isSaving ? "Сохраняем..." : "Сохранить оплату"}
        </button>
      </form>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Сумма</p><p className="mt-1 text-2xl font-black">{formatMoney(summary.total, "KZT")}</p></div>
          <div className="rounded-2xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Оплачено</p><p className="mt-1 text-2xl font-black">{summary.paid}</p></div>
          <div className="rounded-2xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Просрочено</p><p className="mt-1 text-2xl font-black text-red-700">{summary.overdue}</p></div>
          <div className="rounded-2xl sport-card p-5 shadow-sm"><p className="text-sm text-[var(--muted)]">Пауза</p><p className="mt-1 text-2xl font-black">{summary.paused}</p></div>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-3xl sport-card p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black">Оплат пока нет</h2>
            <p className="mt-3 text-[var(--muted)]">Добавьте первую оплату клиента.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl sport-card shadow-sm">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-[var(--surface-strong)] text-white">
                <tr>
                  {["Клиент", "Тариф", "Сумма", "Период", "Осталось", "Статус", "Контакт", "Действия"].map((heading) => <th key={heading} className="p-4">{heading}</th>)}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[var(--border)] align-top">
                    <td className="p-4 font-black">{payment.client_name || "Клиент не найден"}</td>
                    <td className="p-4">{payment.tariff}<div className="mt-1 text-xs text-[var(--muted)]">Оплата: {formatDate(payment.payment_date)}</div></td>
                    <td className="p-4 font-bold">{formatMoney(payment.amount, payment.currency)}</td>
                    <td className="p-4">{formatDate(payment.start_date)} - {formatDate(payment.expiry_date)}</td>
                    <td className="p-4 font-black">{daysLeftLabel(payment.days_left)}</td>
                    <td className="p-4"><span className="rounded-full bg-[var(--background)] px-3 py-1 font-black">{statusLabels[payment.computed_status]}</span></td>
                    <td className="p-4">{payment.whatsapp || payment.instagram || "-"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => updatePaymentStatus(payment.id, "paid")} className="rounded-lg border border-[var(--border)] px-3 py-2 font-bold">Оплачено</button>
                        <button onClick={() => updatePaymentStatus(payment.id, "paused")} className="rounded-lg border border-[var(--border)] px-3 py-2 font-bold">Пауза</button>
                        <button onClick={() => deletePayment(payment.id)} className="rounded-lg border border-red-200 px-3 py-2 font-bold text-red-700">Удалить</button>
                      </div>
                      {payment.note && <p className="mt-2 max-w-[240px] text-xs text-[var(--muted)]">{payment.note}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
