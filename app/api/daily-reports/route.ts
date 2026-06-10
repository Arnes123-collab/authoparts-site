import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  mapDailyReportFromDb,
  type DailyReportDbRow,
  type DailyReportFormData,
} from "@/types/daily-report";

function toNonNegativeInteger(value: number | undefined) {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue) || numberValue < 0) {
    return null;
  }
  return Math.floor(numberValue);
}

function toNonNegativeNumber(value: number | undefined) {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue) || numberValue < 0) {
    return null;
  }
  return numberValue;
}

export async function GET() {
  const { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .order("report_date", { ascending: false })
    .returns<DailyReportDbRow[]>();

  if (error) {
    return NextResponse.json(
      { message: "Не удалось загрузить отчёты." },
      { status: 500 }
    );
  }

  return NextResponse.json(data.map(mapDailyReportFromDb));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as DailyReportFormData;

  if (!body.reportDate) {
    return NextResponse.json(
      { message: "Дата отчёта обязательна." },
      { status: 400 }
    );
  }

  const processedLeads = toNonNegativeInteger(body.processedLeads);
  const sentOffers = toNonNegativeInteger(body.sentOffers);
  const clientReplies = toNonNegativeInteger(body.clientReplies);
  const rejections = toNonNegativeInteger(body.rejections);
  const salesCount = toNonNegativeInteger(body.salesCount);
  const salesAmount = toNonNegativeNumber(body.salesAmount);

  if (
    processedLeads === null ||
    sentOffers === null ||
    clientReplies === null ||
    rejections === null ||
    salesCount === null ||
    salesAmount === null
  ) {
    return NextResponse.json(
      { message: "Все числовые поля должны быть не меньше нуля." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("daily_reports")
    .insert({
      report_date: body.reportDate,
      processed_leads: processedLeads,
      sent_offers: sentOffers,
      client_replies: clientReplies,
      rejections,
      sales_count: salesCount,
      sales_amount: salesAmount,
      comment: body.comment?.trim() || null,
    })
    .select("*")
    .single<DailyReportDbRow>();

  if (error) {
    return NextResponse.json(
      { message: "Не удалось сохранить отчёт." },
      { status: 500 }
    );
  }

  return NextResponse.json(mapDailyReportFromDb(data), { status: 201 });
}
