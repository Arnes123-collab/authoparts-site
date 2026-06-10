export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Не найден ID плана питания" }, { status: 400 });

  const result = await supabaseRest<null>("nutrition_plans", {
    method: "DELETE",
    query: `id=eq.${encodeURIComponent(id)}`,
    prefer: "return=minimal",
  });

  if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
  return NextResponse.json({ message: "План питания удалён" });
}
