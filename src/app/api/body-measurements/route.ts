export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { BodyMeasurement, BodyMeasurementJoined, BodyMeasurementListItem, BodyMeasurementRequestPayload } from "@/types/body-measurement";

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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function toListItem(item: BodyMeasurementJoined): BodyMeasurementListItem {
  return {
    id: item.id,
    client_id: item.client_id,
    measurement_date: item.measurement_date,
    body_weight: item.body_weight,
    chest: item.chest,
    waist: item.waist,
    hips: item.hips,
    thigh: item.thigh,
    arm: item.arm,
    shoulder: item.shoulder,
    comment: item.comment,
    created_at: item.created_at,
    client_name: item.clients?.name || null,
    whatsapp: item.clients?.whatsapp || null,
    instagram: item.clients?.instagram || null,
  };
}

export async function GET() {
  const result = await supabaseRest<BodyMeasurementJoined[]>("body_measurements", {
    query: "select=id,client_id,measurement_date,body_weight,chest,waist,hips,thigh,arm,shoulder,comment,created_at,clients(name,whatsapp,instagram)&order=measurement_date.desc",
  });

  if (result.error) {
    return NextResponse.json(
      { measurements: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  return NextResponse.json({ measurements: (result.data || []).map(toListItem), error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BodyMeasurementRequestPayload>;
    const clientId = normalizeString(body.client_id);
    if (!clientId) return NextResponse.json({ error: "Выберите клиента" }, { status: 400 });

    const result = await supabaseRest<BodyMeasurement[]>("body_measurements", {
      method: "POST",
      body: {
        client_id: clientId,
        measurement_date: normalizeString(body.measurement_date) || todayIso(),
        body_weight: normalizeNumber(body.body_weight),
        chest: normalizeNumber(body.chest),
        waist: normalizeNumber(body.waist),
        hips: normalizeNumber(body.hips),
        thigh: normalizeNumber(body.thigh),
        arm: normalizeNumber(body.arm),
        shoulder: normalizeNumber(body.shoulder),
        comment: normalizeString(body.comment),
      },
      query: "select=id",
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });

    return NextResponse.json({ message: "Замер успешно сохранён", measurementId: result.data?.[0]?.id || null }, { status: 201 });
  } catch (error) {
    console.error("Body measurement API error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении замера" }, { status: 500 });
  }
}
