import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { LeadStatus } from "@/types/lead";
import { mapLeadFromDb, type LeadDbRow } from "@/types/lead";

const allowedStatuses: LeadStatus[] = ["new", "in_progress", "ordered", "completed", "cancelled"];

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single<LeadDbRow>();

  if (error) return NextResponse.json({ message: "Клиент не найден." }, { status: 404 });

  return NextResponse.json(mapLeadFromDb(data));
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = (await request.json()) as { status?: LeadStatus };

  if (!body.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ message: "Некорректный статус заявки." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("leads")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select("*")
    .single<LeadDbRow>();

  if (error) return NextResponse.json({ message: "Не удалось обновить статус." }, { status: 500 });

  return NextResponse.json(mapLeadFromDb(data));
}
