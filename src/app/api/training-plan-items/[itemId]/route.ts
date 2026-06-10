export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { itemId } = await context.params;

  const result = await supabaseRest<null>("training_plan_items", {
    method: "DELETE",
    query: `id=eq.${itemId}`,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
  }

  return NextResponse.json({ message: "Упражнение удалено из плана" });
}
