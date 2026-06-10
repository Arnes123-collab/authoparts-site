export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Client } from "@/types/client";
import type { Payment, PaymentListItem, PaymentRequestPayload, PaymentStatus } from "@/types/payment";

type PaymentJoined = Payment & {
  clients?: Pick<Client, "name" | "whatsapp" | "instagram"> | null;
};

const allowedStatuses: PaymentStatus[] = ["paid", "pending", "overdue", "paused", "cancelled"];

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeNumber(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function normalizeStatus(value: unknown): PaymentStatus {
  return allowedStatuses.includes(value as PaymentStatus) ? (value as PaymentStatus) : "paid";
}

function calculateDaysLeft(expiryDate: string | null): number | null {
  if (!expiryDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${expiryDate}T00:00:00`);
  if (Number.isNaN(expiry.getTime())) return null;
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function computeStatus(payment: Payment): PaymentStatus {
  if (payment.status === "paused" || payment.status === "cancelled" || payment.status === "pending") return payment.status;
  const daysLeft = calculateDaysLeft(payment.expiry_date);
  if (daysLeft !== null && daysLeft < 0) return "overdue";
  return payment.status;
}

export async function GET() {
  const result = await supabaseRest<PaymentJoined[]>("payments", {
    query: "select=id,client_id,tariff,amount,currency,payment_date,start_date,expiry_date,status,note,created_at,clients(name,whatsapp,instagram)&order=created_at.desc",
  });

  if (result.error) {
    return NextResponse.json(
      { payments: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  const payments: PaymentListItem[] = (result.data || []).map((payment) => ({
    id: payment.id,
    client_id: payment.client_id,
    tariff: payment.tariff,
    amount: payment.amount,
    currency: payment.currency,
    payment_date: payment.payment_date,
    start_date: payment.start_date,
    expiry_date: payment.expiry_date,
    status: payment.status,
    note: payment.note,
    created_at: payment.created_at,
    client_name: payment.clients?.name || null,
    whatsapp: payment.clients?.whatsapp || null,
    instagram: payment.clients?.instagram || null,
    days_left: calculateDaysLeft(payment.expiry_date),
    computed_status: computeStatus(payment),
  }));

  return NextResponse.json({ payments, error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PaymentRequestPayload>;
    const clientId = normalizeString(body.client_id);
    const tariff = normalizeString(body.tariff);
    const amount = normalizeNumber(body.amount);

    if (!clientId) return NextResponse.json({ error: "Выберите клиента" }, { status: 400 });
    if (!tariff) return NextResponse.json({ error: "Введите тариф" }, { status: 400 });
    if (amount === null || amount < 0) return NextResponse.json({ error: "Введите корректную сумму" }, { status: 400 });

    const result = await supabaseRest<Payment[]>("payments", {
      method: "POST",
      body: {
        client_id: clientId,
        tariff,
        amount,
        currency: normalizeString(body.currency) || "KZT",
        payment_date: normalizeString(body.payment_date),
        start_date: normalizeString(body.start_date),
        expiry_date: normalizeString(body.expiry_date),
        status: normalizeStatus(body.status),
        note: normalizeString(body.note),
      },
      query: "select=id,client_id,tariff,amount,currency,payment_date,start_date,expiry_date,status,note,created_at",
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    }

    return NextResponse.json({ message: "Оплата успешно добавлена", payment: result.data?.[0] || null }, { status: 201 });
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении оплаты" }, { status: 500 });
  }
}
