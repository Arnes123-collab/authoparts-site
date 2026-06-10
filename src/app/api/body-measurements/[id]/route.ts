export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";

type RouteContext = { params: { id: string } };

export async function DELETE(_request: Request, context: RouteContext) {
  const measurementId = context.params.id;
  if (!measurementId) return NextResponse.json({ error: "Не указан ID замера" }, { status: 400 });

  const result = await supabaseRest<null>("body_measurements", {
    method: "DELETE",
    query: `id=eq.${measurementId}`,
  });

  if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });

  return NextResponse.json({ message: "Замер удалён" });
}
