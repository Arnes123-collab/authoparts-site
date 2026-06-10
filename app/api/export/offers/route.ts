import { supabase } from "@/lib/supabase";
import { csvResponse, toCsv } from "@/lib/csv";
import { type LeadOfferDbRow } from "@/types/lead-offer";

export async function GET() {
  const { data, error } = await supabase
    .from("lead_offers")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<LeadOfferDbRow[]>();

  if (error) {
    return new Response("Export error", { status: 500 });
  }

  const csv = toCsv(
    ["id", "lead_id", "requested_part", "offered_part", "supplier", "cost_price", "sale_price", "margin", "status", "comment", "created_at"],
    data.map((item) => [
      item.id,
      item.lead_id,
      item.requested_part,
      item.offered_part,
      item.supplier,
      item.cost_price,
      item.sale_price,
      item.margin,
      item.status,
      item.comment,
      item.created_at,
    ])
  );

  return csvResponse("offers.csv", csv);
}
