import { supabase } from "@/lib/supabase";
import { csvResponse, toCsv } from "@/lib/csv";
import { type LeadDbRow } from "@/types/lead";

export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<LeadDbRow[]>();

  if (error) {
    return new Response("Export error", { status: 500 });
  }

  const csv = toCsv(
    ["id", "name", "phone", "car_brand", "car_model", "year", "vin", "part_request", "status", "deal_stage", "estimated_amount", "priority", "created_at"],
    data.map((item) => [
      item.id,
      item.name,
      item.phone,
      item.car_brand,
      item.car_model,
      item.year,
      item.vin,
      item.part_request,
      item.status,
      item.deal_stage,
      item.estimated_amount,
      item.priority,
      item.created_at,
    ])
  );

  return csvResponse("clients.csv", csv);
}
