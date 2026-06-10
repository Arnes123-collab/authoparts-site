export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Template } from "@/types/template";

type Params = { params: { id: string } };

export async function DELETE(_request: Request, { params }: Params) {
  const templateId = params.id;
  if (!templateId) return NextResponse.json({ error: "ID шаблона не найден" }, { status: 400 });

  const result = await supabaseRest<Template[]>("program_templates", {
    method: "DELETE",
    query: `id=eq.${encodeURIComponent(templateId)}&select=id`,
  });

  if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
  return NextResponse.json({ message: "Шаблон удалён" });
}

export async function PATCH(request: Request, { params }: Params) {
  const templateId = params.id;
  if (!templateId) return NextResponse.json({ error: "ID шаблона не найден" }, { status: 400 });

  try {
    const body = (await request.json()) as Partial<Template>;
    const result = await supabaseRest<Template[]>("program_templates", {
      method: "PATCH",
      body: { is_active: Boolean(body.is_active) },
      query: `id=eq.${encodeURIComponent(templateId)}&select=id,title,is_active`,
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: result.isConfigured ? 500 : 503 });
    return NextResponse.json({ message: "Статус шаблона обновлён", template: result.data?.[0] || null });
  } catch {
    return NextResponse.json({ error: "Ошибка обновления шаблона" }, { status: 500 });
  }
}
