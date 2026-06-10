import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapLeadFromDb, type LeadDbRow, type LeadFormData } from "@/types/lead";

export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<LeadDbRow[]>();

  if (error) {
    return NextResponse.json({ message: "Не удалось загрузить клиентов." }, { status: 500 });
  }

  return NextResponse.json(data.map(mapLeadFromDb));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LeadFormData;

  if (!body.name?.trim() || !body.phone?.trim() || !body.partRequest?.trim()) {
    return NextResponse.json({ message: "Имя, телефон и нужная запчасть обязательны." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: body.name.trim(),
      phone: body.phone.trim(),
      car_brand: body.carBrand.trim(),
      car_model: body.carModel.trim(),
      year: body.year.trim(),
      vin: body.vin.trim(),
      part_request: body.partRequest.trim(),
      comment: body.comment.trim(),
      status: "new",
      deal_stage: "new_request",
      estimated_amount: 0,
      priority: "medium",
    })
    .select("*")
    .single<LeadDbRow>();

  if (error) {
    return NextResponse.json({ message: "Не удалось сохранить заявку." }, { status: 500 });
  }

  return NextResponse.json(mapLeadFromDb(data), { status: 201 });
}
