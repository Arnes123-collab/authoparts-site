export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Client } from "@/types/client";
import type { Exercise } from "@/types/exercise";
import type { TrainingPlan, TrainingPlanItem, TrainingPlanItemWithExercise } from "@/types/training-plan";

type PlanJoined = TrainingPlan & { clients?: Client | null };
type ItemJoined = TrainingPlanItem & { exercises?: Exercise | null };

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const planResult = await supabaseRest<PlanJoined[]>("training_plans", {
    query: `select=id,client_id,title,goal,start_date,end_date,created_at,clients(id,name,age,weight,height,goal,experience,injuries,training_place,training_days,whatsapp,instagram,status,created_at)&id=eq.${id}`,
  });

  if (planResult.error) {
    return NextResponse.json({ plan: null, client: null, items: [], error: planResult.error, isConfigured: planResult.isConfigured }, { status: planResult.isConfigured ? 500 : 200 });
  }

  const plan = planResult.data?.[0];

  if (!plan) {
    return NextResponse.json({ plan: null, client: null, items: [], error: "План не найден", isConfigured: planResult.isConfigured }, { status: 404 });
  }

  const itemsResult = await supabaseRest<ItemJoined[]>("training_plan_items", {
    query: `select=id,training_plan_id,exercise_id,training_day,exercise_order,sets,reps,weight,percent,rest_time,tempo,comment,created_at,exercises(id,name,muscle_group,category,subcategory,equipment,technique,common_mistakes,contraindications,image_url,video_url,difficulty_level,replacement_exercise,sport_tags,coach_notes,is_active,created_at)&training_plan_id=eq.${id}&order=training_day.asc,exercise_order.asc,created_at.asc`,
  });

  if (itemsResult.error) {
    return NextResponse.json({ plan, client: plan.clients || null, items: [], error: itemsResult.error, isConfigured: itemsResult.isConfigured }, { status: itemsResult.isConfigured ? 500 : 200 });
  }

  const items: TrainingPlanItemWithExercise[] = (itemsResult.data || []).map((item) => ({
    id: item.id,
    training_plan_id: item.training_plan_id,
    exercise_id: item.exercise_id,
    training_day: item.training_day,
    exercise_order: item.exercise_order,
    sets: item.sets,
    reps: item.reps,
    weight: item.weight,
    percent: item.percent,
    rest_time: item.rest_time,
    tempo: item.tempo,
    comment: item.comment,
    created_at: item.created_at,
    exercise: item.exercises || null,
  }));

  return NextResponse.json({
    plan: {
      id: plan.id,
      client_id: plan.client_id,
      title: plan.title,
      goal: plan.goal,
      start_date: plan.start_date,
      end_date: plan.end_date,
      created_at: plan.created_at,
    },
    client: plan.clients || null,
    items,
    error: null,
    isConfigured: planResult.isConfigured,
  });
}
