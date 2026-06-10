import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  mapLeadOfferFromDb,
  type LeadOfferDbRow,
  type LeadOfferFormData,
  type LeadOfferStatus,
} from "@/types/lead-offer";

const allowedStatuses: LeadOfferStatus[] = [
  "draft",
  "offered",
  "accepted",
  "rejected",
  "purchased",
  "sold",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId");

  if (!leadId) {
    return NextResponse.json(
      { message: "leadId обязателен." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("lead_offers")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .returns<LeadOfferDbRow[]>();

  if (error) {
    return NextResponse.json(
      { message: "Не удалось загрузить предложения." },
      { status: 500 }
    );
  }

  return NextResponse.json(data.map(mapLeadOfferFromDb));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LeadOfferFormData;

  if (!body.leadId || !body.requestedPart?.trim() || !body.offeredPart?.trim()) {
    return NextResponse.json(
      { message: "leadId, requestedPart и offeredPart обязательны." },
      { status: 400 }
    );
  }

  if (!allowedStatuses.includes(body.status)) {
    return NextResponse.json(
      { message: "Некорректный статус предложения." },
      { status: 400 }
    );
  }

  const costPrice = Number(body.costPrice ?? 0);
  const salePrice = Number(body.salePrice ?? 0);

  if (Number.isNaN(costPrice) || Number.isNaN(salePrice) || costPrice < 0 || salePrice < 0) {
    return NextResponse.json(
      { message: "Закуп и продажа должны быть числами не меньше нуля." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("lead_offers")
    .insert({
      lead_id: body.leadId,
      requested_part: body.requestedPart.trim(),
      offered_part: body.offeredPart.trim(),
      supplier: body.supplier?.trim() || null,
      cost_price: costPrice,
      sale_price: salePrice,
      status: body.status,
      comment: body.comment?.trim() || null,
    })
    .select("*")
    .single<LeadOfferDbRow>();

  if (error) {
    return NextResponse.json(
      { message: "Не удалось сохранить предложение." },
      { status: 500 }
    );
  }

  return NextResponse.json(mapLeadOfferFromDb(data), { status: 201 });
}
