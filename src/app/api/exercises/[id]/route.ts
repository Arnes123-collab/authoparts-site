export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Exercise } from "@/types/exercise";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const id = context.params.id;
    const body = (await request.json()) as Partial<Exercise>;

    if (!id) {
      return NextResponse.json({ error: "Не указан ID упражнения" }, { status: 400 });
    }

    const payload: Partial<Exercise> = {};

    if (typeof body.is_active === "boolean") {
      payload.is_active = body.is_active;
    }

    if (typeof body.name === "string" && body.name.trim()) payload.name = body.name.trim();
    if (typeof body.category === "string") payload.category = body.category.trim() || null;
    if (typeof body.subcategory === "string") payload.subcategory = body.subcategory.trim() || null;
    if (typeof body.muscle_group === "string") payload.muscle_group = body.muscle_group.trim() || null;
    if (typeof body.equipment === "string") payload.equipment = body.equipment.trim() || null;
    if (typeof body.replacement_exercise === "string") payload.replacement_exercise = body.replacement_exercise.trim() || null;
    if (typeof body.coach_notes === "string") payload.coach_notes = body.coach_notes.trim() || null;

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "Нет данных для обновления" }, { status: 400 });
    }

    const result = await supabaseRest<Exercise[]>("exercises", {
      method: "PATCH",
      body: payload,
      query: `id=eq.${encodeURIComponent(id)}&select=id,is_active`,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    }

    return NextResponse.json({ message: "Упражнение обновлено", exercise: result.data?.[0] || null });
  } catch (error) {
    console.error("Exercise update API error:", error);
    return NextResponse.json({ error: "Ошибка при обновлении упражнения" }, { status: 500 });
  }
}
