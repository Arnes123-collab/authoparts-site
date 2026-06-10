export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Template, TemplateCategory, TemplateRequestPayload, TemplateType } from "@/types/template";

const allowedTypes: TemplateType[] = ["training", "nutrition", "combined"];
const allowedCategories: TemplateCategory[] = ["fat_loss", "muscle_gain", "recomposition", "home_workout", "beginner", "advanced", "health_40_plus"];

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeInteger(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return null;
  return Math.max(0, Math.round(numberValue));
}

function normalizeType(value: unknown): TemplateType {
  return allowedTypes.includes(value as TemplateType) ? (value as TemplateType) : "training";
}

function normalizeCategory(value: unknown): TemplateCategory {
  return allowedCategories.includes(value as TemplateCategory) ? (value as TemplateCategory) : "fat_loss";
}

export async function GET() {
  const result = await supabaseRest<Template[]>("program_templates", {
    query: "select=id,title,template_type,category,description,duration_weeks,training_days_per_week,goal,level,content,nutrition_notes,is_active,created_at&order=created_at.desc",
  });

  if (result.error) {
    return NextResponse.json(
      { templates: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  return NextResponse.json({ templates: result.data || [], error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TemplateRequestPayload>;
    const title = normalizeString(body.title);
    const content = normalizeString(body.content);

    if (!title) return NextResponse.json({ error: "Введите название шаблона" }, { status: 400 });
    if (!content) return NextResponse.json({ error: "Заполните содержание шаблона" }, { status: 400 });

    const result = await supabaseRest<Template[]>("program_templates", {
      method: "POST",
      body: {
        title,
        template_type: normalizeType(body.template_type),
        category: normalizeCategory(body.category),
        description: normalizeString(body.description),
        duration_weeks: normalizeInteger(body.duration_weeks),
        training_days_per_week: normalizeInteger(body.training_days_per_week),
        goal: normalizeString(body.goal),
        level: normalizeString(body.level),
        content,
        nutrition_notes: normalizeString(body.nutrition_notes),
        is_active: Boolean(body.is_active ?? true),
      },
      query: "select=id,title,template_type,category,description,duration_weeks,training_days_per_week,goal,level,content,nutrition_notes,is_active,created_at",
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });

    return NextResponse.json({ message: "Шаблон успешно создан", template: result.data?.[0] || null }, { status: 201 });
  } catch (error) {
    console.error("Templates API error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении шаблона" }, { status: 500 });
  }
}
