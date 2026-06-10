import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  type DealStage,
  type LeadPriority,
  mapLeadFromDb,
  type LeadDbRow,
} from "@/types/lead";

const allowedStages: DealStage[] = [
  "new_request",
  "contacted",
  "price_requested",
  "offer_sent",
  "ordered",
  "completed",
  "lost",
];

const allowedPriorities: LeadPriority[] = ["low", "medium", "high"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    dealStage?: DealStage;
    estimatedAmount?: number;
    nextContactDate?: string;
    priority?: LeadPriority;
  };

  if (!body.dealStage || !allowedStages.includes(body.dealStage)) {
    return NextResponse.json(
      { message: "Некорректный этап сделки." },
      { status: 400 }
    );
  }

  if (!body.priority || !allowedPriorities.includes(body.priority)) {
    return NextResponse.json(
      { message: "Некорректный приоритет." },
      { status: 400 }
    );
  }

  const amount = Number(body.estimatedAmount ?? 0);

  if (Number.isNaN(amount) || amount < 0) {
    return NextResponse.json(
      { message: "Сумма сделки должна быть числом не меньше нуля." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .update({
      deal_stage: body.dealStage,
      estimated_amount: amount,
      next_contact_date: body.nextContactDate || null,
      priority: body.priority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("*")
    .single<LeadDbRow>();

  if (error) {
    return NextResponse.json(
      { message: "Не удалось обновить сделку." },
      { status: 500 }
    );
  }

  return NextResponse.json(mapLeadFromDb(data));
}
