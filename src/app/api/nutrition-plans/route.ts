export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { NutritionGoal, NutritionJoined, NutritionPlan, NutritionPlanListItem, NutritionPlanRequestPayload } from "@/types/nutrition";

const allowedGoals: NutritionGoal[] = ["fat_loss", "muscle_gain", "maintenance", "recomposition", "health_40_plus"];

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

function normalizeInteger(value: unknown): number | null {
  const numberValue = normalizeNumber(value);
  return numberValue === null ? null : Math.round(numberValue);
}

function normalizeGoal(value: unknown): NutritionGoal {
  return allowedGoals.includes(value as NutritionGoal) ? (value as NutritionGoal) : "fat_loss";
}

function toListItem(plan: NutritionJoined): NutritionPlanListItem {
  return {
    id: plan.id,
    client_id: plan.client_id,
    title: plan.title,
    goal: plan.goal,
    calories: plan.calories,
    protein: plan.protein,
    fats: plan.fats,
    carbs: plan.carbs,
    water_liters: plan.water_liters,
    meals_per_day: plan.meals_per_day,
    meal_timing: plan.meal_timing,
    food_preferences: plan.food_preferences,
    restrictions: plan.restrictions,
    coach_notes: plan.coach_notes,
    created_at: plan.created_at,
    client_name: plan.clients?.name || null,
    whatsapp: plan.clients?.whatsapp || null,
    instagram: plan.clients?.instagram || null,
  };
}

export async function GET() {
  const result = await supabaseRest<NutritionJoined[]>("nutrition_plans", {
    query: "select=id,client_id,title,goal,calories,protein,fats,carbs,water_liters,meals_per_day,meal_timing,food_preferences,restrictions,coach_notes,created_at,clients(name,whatsapp,instagram)&order=created_at.desc",
  });

  if (result.error) {
    return NextResponse.json(
      { nutritionPlans: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  return NextResponse.json({ nutritionPlans: (result.data || []).map(toListItem), error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<NutritionPlanRequestPayload>;
    const clientId = normalizeString(body.client_id);
    const title = normalizeString(body.title);

    if (!clientId) return NextResponse.json({ error: "Выберите клиента" }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Введите название плана питания" }, { status: 400 });

    const result = await supabaseRest<NutritionPlan[]>("nutrition_plans", {
      method: "POST",
      body: {
        client_id: clientId,
        title,
        goal: normalizeGoal(body.goal),
        calories: normalizeNumber(body.calories),
        protein: normalizeNumber(body.protein),
        fats: normalizeNumber(body.fats),
        carbs: normalizeNumber(body.carbs),
        water_liters: normalizeNumber(body.water_liters),
        meals_per_day: normalizeInteger(body.meals_per_day),
        meal_timing: normalizeString(body.meal_timing),
        food_preferences: normalizeString(body.food_preferences),
        restrictions: normalizeString(body.restrictions),
        coach_notes: normalizeString(body.coach_notes),
      },
      query: "select=id,client_id,title,goal,calories,protein,fats,carbs,water_liters,meals_per_day,meal_timing,food_preferences,restrictions,coach_notes,created_at",
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });

    return NextResponse.json({ message: "План питания успешно создан", nutritionPlan: result.data?.[0] || null }, { status: 201 });
  } catch (error) {
    console.error("Nutrition plan API error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении плана питания" }, { status: 500 });
  }
}
