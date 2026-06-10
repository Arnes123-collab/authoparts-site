import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapLeadNoteFromDb, type LeadNoteDbRow } from "@/types/lead-note";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId");

  if (!leadId) return NextResponse.json({ message: "leadId обязателен." }, { status: 400 });

  const { data, error } = await supabase
    .from("lead_notes")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .returns<LeadNoteDbRow[]>();

  if (error) return NextResponse.json({ message: "Не удалось загрузить заметки." }, { status: 500 });

  return NextResponse.json(data.map(mapLeadNoteFromDb));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { leadId?: string; note?: string };

  if (!body.leadId || !body.note?.trim()) {
    return NextResponse.json({ message: "leadId и note обязательны." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("lead_notes")
    .insert({ lead_id: body.leadId, note: body.note.trim() })
    .select("*")
    .single<LeadNoteDbRow>();

  if (error) return NextResponse.json({ message: "Не удалось сохранить заметку." }, { status: 500 });

  return NextResponse.json(mapLeadNoteFromDb(data), { status: 201 });
}
