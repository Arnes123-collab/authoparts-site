export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { TrainingPlan, TrainingPlanListItem, TrainingPlanRequestPayload } from "@/types/training-plan";

type TrainingPlanJoined = TrainingPlan & {
  clients?: { name: string | null } | null;
};

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  const result = await supabaseRest<TrainingPlanJoined[]>("training_plans", {
    query: "select=id,client_id,title,goal,start_date,end_date,created_at,clients(name)&order=created_at.desc",
  });

  if (result.error) {
    return NextResponse.json(
      { plans: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  const plans: TrainingPlanListItem[] = (result.data || []).map((plan) => ({
    id: plan.id,
    client_id: plan.client_id,
    title: plan.title,
    goal: plan.goal,
    start_date: plan.start_date,
    end_date: plan.end_date,
    created_at: plan.created_at,
    client_name: plan.clients?.name || null,
  }));

  return NextResponse.json({ plans, error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TrainingPlanRequestPayload>;
    const clientId = normalizeString(body.client_id);
    const title = normalizeString(body.title);

    if (!clientId) return NextResponse.json({ error: "Выберите клиента" }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Введите название плана" }, { status: 400 });

    const result = await supabaseRest<TrainingPlan[]>("training_plans", {
      method: "POST",
      body: {
        client_id: clientId,
        title,
        goal: normalizeString(body.goal),
        start_date: normalizeString(body.start_date),
        end_date: normalizeString(body.end_date),
      },
      query: "select=id,client_id,title,goal,start_date,end_date,created_at",
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    }

    return NextResponse.json({ message: "План успешно создан", plan: result.data?.[0] || null }, { status: 201 });
  } catch (error) {
    console.error("Training plan API error:", error);
    return NextResponse.json({ error: "Ошибка при создании плана" }, { status: 500 });
  }
}
