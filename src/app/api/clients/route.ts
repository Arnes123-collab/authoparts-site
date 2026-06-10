export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Client, ClientRequestPayload } from "@/types/client";

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

export async function GET() {
  const result = await supabaseRest<Client[]>("clients", {
    query:
      "select=id,name,age,weight,height,goal,experience,injuries,training_place,training_days,whatsapp,instagram,status,created_at&order=created_at.desc",
  });

  if (result.error) {
    return NextResponse.json(
      { clients: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  return NextResponse.json({ clients: result.data || [], error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ClientRequestPayload>;
    const name = normalizeString(body.name);
    const goal = normalizeString(body.goal);
    const whatsapp = normalizeString(body.whatsapp);
    const instagram = normalizeString(body.instagram);

    if (!name) return NextResponse.json({ error: "Введите имя клиента" }, { status: 400 });
    if (!goal) return NextResponse.json({ error: "Введите цель клиента" }, { status: 400 });
    if (!whatsapp && !instagram) {
      return NextResponse.json({ error: "Укажите WhatsApp или Instagram для связи" }, { status: 400 });
    }

    const result = await supabaseRest<Client[]>("clients", {
      method: "POST",
      body: {
        name,
        age: normalizeNumber(body.age),
        weight: normalizeNumber(body.weight),
        height: normalizeNumber(body.height),
        goal,
        experience: normalizeString(body.experience),
        injuries: normalizeString(body.injuries),
        training_place: normalizeString(body.training_place),
        training_days: normalizeString(body.training_days),
        whatsapp,
        instagram,
        status: "new",
      },
      query: "select=id",
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    }

    return NextResponse.json({ message: "Заявка успешно отправлена", clientId: result.data?.[0]?.id || null }, { status: 201 });
  } catch (error) {
    console.error("Client request API error:", error);
    return NextResponse.json({ error: "Ошибка обработки заявки" }, { status: 500 });
  }
}
