import { supabase } from "@/lib/supabase";
import { csvResponse, toCsv } from "@/lib/csv";
import { type DailyReportDbRow } from "@/types/daily-report";

export async function GET() {
  const { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .order("report_date", { ascending: false })
    .returns<DailyReportDbRow[]>();

  if (error) {
    return new Response("Export error", { status: 500 });
  }

  const csv = toCsv(
    ["id", "report_date", "processed_leads", "sent_offers", "client_replies", "rejections", "sales_count", "sales_amount", "comment", "created_at"],
    data.map((item) => [
      item.id,
      item.report_date,
      item.processed_leads,
      item.sent_offers,
      item.client_replies,
      item.rejections,
      item.sales_count,
      item.sales_amount,
      item.comment,
      item.created_at,
    ])
  );

  return csvResponse("daily-reports.csv", csv);
}
