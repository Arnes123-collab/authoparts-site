export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Payment, PaymentStatus } from "@/types/payment";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const allowedStatuses: PaymentStatus[] = ["paid", "pending", "overdue", "paused", "cancelled"];

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as { status?: PaymentStatus };

  if (!allowedStatuses.includes(body.status as PaymentStatus)) {
    return NextResponse.json({ error: "Некорректный статус оплаты" }, { status: 400 });
  }

  const result = await supabaseRest<Payment[]>("payments", {
    method: "PATCH",
    body: { status: body.status },
    query: `id=eq.${id}&select=id,client_id,tariff,amount,currency,payment_date,start_date,expiry_date,status,note,created_at`,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
  }

  return NextResponse.json({ message: "Статус оплаты обновлён", payment: result.data?.[0] || null });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const result = await supabaseRest<null>("payments", {
    method: "DELETE",
    query: `id=eq.${id}`,
    prefer: "return=minimal",
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
  }

  return NextResponse.json({ message: "Оплата удалена" });
}
