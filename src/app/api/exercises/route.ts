export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import { uploadExerciseImage } from "@/lib/supabase-storage";
import type { DifficultyLevel, Exercise, ExerciseRequestPayload } from "@/types/exercise";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const DIFFICULTY_LEVELS: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeDifficulty(value: unknown): DifficultyLevel | null {
  if (typeof value !== "string") return null;
  return DIFFICULTY_LEVELS.includes(value as DifficultyLevel) ? (value as DifficultyLevel) : null;
}

function normalizeBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : true;
}

function normalizeTags(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const tags = value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
    return tags.length > 0 ? Array.from(new Set(tags)) : null;
  }

  if (typeof value === "string") {
    const tags = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return tags.length > 0 ? Array.from(new Set(tags)) : null;
  }

  return null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = normalizeString(url.searchParams.get("search"));
  const category = normalizeString(url.searchParams.get("category"));
  const muscleGroup = normalizeString(url.searchParams.get("muscle_group"));
  const difficulty = normalizeDifficulty(url.searchParams.get("difficulty_level"));
  const active = url.searchParams.get("active");

  const filters: string[] = [
    "select=id,name,muscle_group,category,subcategory,equipment,technique,common_mistakes,contraindications,image_url,video_url,difficulty_level,replacement_exercise,sport_tags,coach_notes,is_active,created_at",
    "order=created_at.desc",
  ];

  if (search) {
    filters.push(`or=(name.ilike.*${encodeURIComponent(search)}*,muscle_group.ilike.*${encodeURIComponent(search)}*,category.ilike.*${encodeURIComponent(search)}*,subcategory.ilike.*${encodeURIComponent(search)}*)`);
  }

  if (category) filters.push(`category=eq.${encodeURIComponent(category)}`);
  if (muscleGroup) filters.push(`muscle_group=eq.${encodeURIComponent(muscleGroup)}`);
  if (difficulty) filters.push(`difficulty_level=eq.${difficulty}`);
  if (active === "true" || active === "false") filters.push(`is_active=eq.${active}`);

  const result = await supabaseRest<Exercise[]>("exercises", {
    query: filters.join("&"),
  });

  if (result.error) {
    return NextResponse.json(
      { exercises: [], error: result.error, isConfigured: result.isConfigured },
      { status: result.isConfigured ? 500 : 200 },
    );
  }

  return NextResponse.json({ exercises: result.data || [], error: null, isConfigured: result.isConfigured });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ExerciseRequestPayload>;
    const name = normalizeString(body.name);

    if (!name) {
      return NextResponse.json({ error: "Введите название упражнения" }, { status: 400 });
    }

    let imageUrl: string | null = null;

    if (body.image) {
      if (!ALLOWED_IMAGE_TYPES.includes(body.image.contentType)) {
        return NextResponse.json({ error: "Разрешены только JPG, PNG или WEBP" }, { status: 400 });
      }

      if (body.image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: "Фото слишком большое. Максимум 5 MB" }, { status: 400 });
      }

      if (!body.image.base64 || !body.image.fileName) {
        return NextResponse.json({ error: "Некорректный файл фото" }, { status: 400 });
      }

      const uploadResult = await uploadExerciseImage({
        bucket: "exercise-images",
        fileName: body.image.fileName,
        contentType: body.image.contentType,
        base64: body.image.base64,
      });

      if (uploadResult.error) {
        return NextResponse.json({ error: uploadResult.error }, { status: uploadResult.isConfigured ? 500 : 503 });
      }

      imageUrl = uploadResult.publicUrl;
    }

    const result = await supabaseRest<Exercise[]>("exercises", {
      method: "POST",
      body: {
        name,
        muscle_group: normalizeString(body.muscle_group),
        category: normalizeString(body.category),
        subcategory: normalizeString(body.subcategory),
        equipment: normalizeString(body.equipment),
        technique: normalizeString(body.technique),
        common_mistakes: normalizeString(body.common_mistakes),
        contraindications: normalizeString(body.contraindications),
        image_url: imageUrl,
        video_url: normalizeString(body.video_url),
        difficulty_level: normalizeDifficulty(body.difficulty_level),
        replacement_exercise: normalizeString(body.replacement_exercise),
        sport_tags: normalizeTags(body.sport_tags),
        coach_notes: normalizeString(body.coach_notes),
        is_active: normalizeBoolean(body.is_active),
      },
      query: "select=id",
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    }

    return NextResponse.json(
      { message: "Упражнение успешно добавлено", exerciseId: result.data?.[0]?.id || null },
      { status: 201 },
    );
  } catch (error) {
    console.error("Exercise API error:", error);
    return NextResponse.json({ error: "Ошибка при добавлении упражнения" }, { status: 500 });
  }
}
