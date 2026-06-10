export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { CoachSettings, CoachSettingsPayload } from "@/types/coach-settings";

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeColor(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(trimmed) ? trimmed : fallback;
}

export async function GET() {
  const result = await supabaseRest<CoachSettings[]>("coach_settings", {
    query: "select=id,coach_name,brand_name,specialization,logo_url,coach_photo_url,primary_color,secondary_color,accent_color,gold_color,instagram,whatsapp,email,city,offer_title,offer_description,created_at,updated_at&order=updated_at.desc&limit=1",
  });

  if (result.error) {
    return NextResponse.json({ settings: null, error: result.error, isConfigured: result.isConfigured }, { status: result.isConfigured ? 500 : 200 });
  }

  return NextResponse.json({ settings: result.data?.[0] || null, error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CoachSettingsPayload>;
    const coachName = normalizeString(body.coach_name);
    const brandName = normalizeString(body.brand_name);

    if (!coachName) return NextResponse.json({ error: "Введите имя тренера" }, { status: 400 });
    if (!brandName) return NextResponse.json({ error: "Введите название бренда" }, { status: 400 });

    const payload: CoachSettingsPayload = {
      coach_name: coachName,
      brand_name: brandName,
      specialization: normalizeString(body.specialization),
      logo_url: normalizeString(body.logo_url),
      coach_photo_url: normalizeString(body.coach_photo_url),
      primary_color: normalizeColor(body.primary_color, "#070707"),
      secondary_color: normalizeColor(body.secondary_color, "#151515"),
      accent_color: normalizeColor(body.accent_color, "#D62828"),
      gold_color: normalizeColor(body.gold_color, "#D6A84F"),
      instagram: normalizeString(body.instagram),
      whatsapp: normalizeString(body.whatsapp),
      email: normalizeString(body.email),
      city: normalizeString(body.city),
      offer_title: normalizeString(body.offer_title),
      offer_description: normalizeString(body.offer_description),
    };

    const existing = await supabaseRest<CoachSettings[]>("coach_settings", { query: "select=id&limit=1" });
    const existingId = existing.data?.[0]?.id;

    const selectQuery = "select=id,coach_name,brand_name,specialization,logo_url,coach_photo_url,primary_color,secondary_color,accent_color,gold_color,instagram,whatsapp,email,city,offer_title,offer_description,created_at,updated_at";
    const result = await supabaseRest<CoachSettings[]>("coach_settings", {
      method: existingId ? "PATCH" : "POST",
      body: existingId ? { ...payload, updated_at: new Date().toISOString() } : payload,
      query: existingId ? `id=eq.${existingId}&${selectQuery}` : selectQuery,
      prefer: "return=representation",
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    return NextResponse.json({ message: "Настройки бренда сохранены", settings: result.data?.[0] || null }, { status: 200 });
  } catch (error) {
    console.error("Coach settings API error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении настроек бренда" }, { status: 500 });
  }
}
