export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { ProgressReport, ProgressReportJoined, ProgressReportListItem, ProgressReportRequestPayload, WorkoutCompleted } from "@/types/progress-report";

const allowedWorkoutValues: WorkoutCompleted[] = ["yes", "partial", "no"];

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

function normalizeScore(value: unknown): number | null {
  const numberValue = normalizeNumber(value);
  if (numberValue === null) return null;
  return Math.max(1, Math.min(10, Math.round(numberValue)));
}

function normalizeWorkout(value: unknown): WorkoutCompleted {
  return allowedWorkoutValues.includes(value as WorkoutCompleted) ? (value as WorkoutCompleted) : "yes";
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function toListItem(report: ProgressReportJoined): ProgressReportListItem {
  return {
    id: report.id,
    client_id: report.client_id,
    client_name: report.client_name,
    whatsapp: report.whatsapp,
    report_date: report.report_date,
    workout_completed: report.workout_completed,
    body_weight: report.body_weight,
    sleep_hours: report.sleep_hours,
    sleep_quality: report.sleep_quality,
    energy_level: report.energy_level,
    pain_level: report.pain_level,
    water_liters: report.water_liters,
    calories: report.calories,
    protein: report.protein,
    fats: report.fats,
    carbs: report.carbs,
    comment: report.comment,
    created_at: report.created_at,
    linked_client_name: report.clients?.name || null,
    instagram: report.clients?.instagram || null,
  };
}

export async function GET() {
  const result = await supabaseRest<ProgressReportJoined[]>("progress_reports", {
    query: "select=id,client_id,client_name,whatsapp,report_date,workout_completed,body_weight,sleep_hours,sleep_quality,energy_level,pain_level,water_liters,calories,protein,fats,carbs,comment,created_at,clients(name,instagram)&order=created_at.desc",
  });

  if (result.error) {
    return NextResponse.json(
      { reports: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  return NextResponse.json({ reports: (result.data || []).map(toListItem), error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ProgressReportRequestPayload>;
    const clientId = normalizeString(body.client_id);
    const clientName = normalizeString(body.client_name);
    const whatsapp = normalizeString(body.whatsapp);

    if (!clientId && !clientName) return NextResponse.json({ error: "Укажите клиента или имя клиента" }, { status: 400 });

    const result = await supabaseRest<ProgressReport[]>("progress_reports", {
      method: "POST",
      body: {
        client_id: clientId,
        client_name: clientName,
        whatsapp,
        report_date: normalizeString(body.report_date) || todayIso(),
        workout_completed: normalizeWorkout(body.workout_completed),
        body_weight: normalizeNumber(body.body_weight),
        sleep_hours: normalizeNumber(body.sleep_hours),
        sleep_quality: normalizeScore(body.sleep_quality),
        energy_level: normalizeScore(body.energy_level),
        pain_level: normalizeScore(body.pain_level),
        water_liters: normalizeNumber(body.water_liters),
        calories: normalizeNumber(body.calories),
        protein: normalizeNumber(body.protein),
        fats: normalizeNumber(body.fats),
        carbs: normalizeNumber(body.carbs),
        comment: normalizeString(body.comment),
      },
      query: "select=id",
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });

    return NextResponse.json({ message: "Отчёт успешно отправлен", reportId: result.data?.[0]?.id || null }, { status: 201 });
  } catch (error) {
    console.error("Progress report API error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении отчёта" }, { status: 500 });
  }
}
