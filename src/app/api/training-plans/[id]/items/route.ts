export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { TrainingPlanItem, TrainingPlanItemRequestPayload } from "@/types/training-plan";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

function normalizeInteger(value: unknown, fallback: number): number {
  const numberValue = normalizeNumber(value);
  if (numberValue === null) return fallback;
  return Math.max(1, Math.trunc(numberValue));
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<TrainingPlanItemRequestPayload>;
    const trainingDay = normalizeString(body.training_day);
    const exerciseId = normalizeString(body.exercise_id);

    if (!trainingDay) return NextResponse.json({ error: "Выберите день тренировки" }, { status: 400 });
    if (!exerciseId) return NextResponse.json({ error: "Выберите упражнение" }, { status: 400 });

    const result = await supabaseRest<TrainingPlanItem[]>("training_plan_items", {
      method: "POST",
      body: {
        training_plan_id: id,
        exercise_id: exerciseId,
        training_day: trainingDay,
        exercise_order: normalizeInteger(body.exercise_order, 1),
        sets: normalizeInteger(body.sets, 1),
        reps: normalizeString(body.reps),
        weight: normalizeNumber(body.weight),
        percent: normalizeNumber(body.percent),
        rest_time: normalizeString(body.rest_time),
        tempo: normalizeString(body.tempo),
        comment: normalizeString(body.comment),
      },
      query: "select=id",
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    }

    return NextResponse.json({ message: "Упражнение добавлено в план", itemId: result.data?.[0]?.id || null }, { status: 201 });
  } catch (error) {
    console.error("Training plan item API error:", error);
    return NextResponse.json({ error: "Ошибка при добавлении упражнения в план" }, { status: 500 });
  }
}
