export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";
import type { Client } from "@/types/client";
import type { ProgressReport } from "@/types/progress-report";
import type { BodyMeasurement } from "@/types/body-measurement";
import type { ClientAnalyticsSummary } from "@/types/analytics";

type TrainingPlanRow = { id: string; client_id: string | null };
type PaymentRow = { id: string; client_id: string | null };

function average(values: Array<number | null | undefined>) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (valid.length === 0) return null;
  return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
}

function percent(part: number, total: number) {
  if (total === 0) return null;
  return Math.round((part / total) * 100);
}

function numberChange(first: number | null, last: number | null) {
  if (first === null || last === null) return null;
  return Math.round((last - first) * 10) / 10;
}

function firstLast<T extends { measurement_date?: string; report_date?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aDate = a.measurement_date || a.report_date || "";
    const bDate = b.measurement_date || b.report_date || "";
    return aDate.localeCompare(bDate);
  });
}

export async function GET() {
  const [clientsResult, reportsResult, measurementsResult, plansResult, paymentsResult] = await Promise.all([
    supabaseRest<Client[]>("clients", { query: "select=id,name,whatsapp,instagram,status,age,weight,height,goal,experience,injuries,training_place,training_days,created_at&order=created_at.desc" }),
    supabaseRest<ProgressReport[]>("progress_reports", { query: "select=id,client_id,report_date,workout_completed,body_weight,sleep_quality,energy_level,pain_level,created_at&order=report_date.asc" }),
    supabaseRest<BodyMeasurement[]>("body_measurements", { query: "select=id,client_id,measurement_date,body_weight,chest,waist,hips,thigh,arm,shoulder,comment,created_at&order=measurement_date.asc" }),
    supabaseRest<TrainingPlanRow[]>("training_plans", { query: "select=id,client_id" }),
    supabaseRest<PaymentRow[]>("payments", { query: "select=id,client_id" }),
  ]);

  const firstError = [clientsResult, reportsResult, measurementsResult, plansResult, paymentsResult].find((item) => item.error);
  if (firstError?.error) {
    return NextResponse.json(
      { analytics: [], error: firstError.error, isConfigured: firstError.isConfigured },
      { status: firstError.isConfigured ? 500 : 200 },
    );
  }

  const reports = reportsResult.data || [];
  const measurements = measurementsResult.data || [];
  const plans = plansResult.data || [];
  const payments = paymentsResult.data || [];

  const analytics: ClientAnalyticsSummary[] = (clientsResult.data || []).map((client) => {
    const clientReports = reports.filter((report) => report.client_id === client.id);
    const clientMeasurements = measurements.filter((measurement) => measurement.client_id === client.id);
    const sortedReports = firstLast(clientReports);
    const sortedMeasurements = firstLast(clientMeasurements);
    const firstMeasurement = sortedMeasurements[0] || null;
    const lastMeasurement = sortedMeasurements[sortedMeasurements.length - 1] || null;
    const firstReportWithWeight = sortedReports.find((report) => typeof report.body_weight === "number") || null;
    const lastReportWithWeight = [...sortedReports].reverse().find((report) => typeof report.body_weight === "number") || null;
    const firstBodyWeight = firstMeasurement?.body_weight ?? firstReportWithWeight?.body_weight ?? null;
    const lastBodyWeight = lastMeasurement?.body_weight ?? lastReportWithWeight?.body_weight ?? null;
    const done = clientReports.filter((report) => report.workout_completed === "yes").length;
    const partial = clientReports.filter((report) => report.workout_completed === "partial").length;
    const missed = clientReports.filter((report) => report.workout_completed === "no").length;

    return {
      client_id: client.id,
      client_name: client.name,
      whatsapp: client.whatsapp,
      instagram: client.instagram,
      reports_count: clientReports.length,
      measurements_count: clientMeasurements.length,
      plans_count: plans.filter((plan) => plan.client_id === client.id).length,
      payments_count: payments.filter((payment) => payment.client_id === client.id).length,
      first_body_weight: firstBodyWeight,
      last_body_weight: lastBodyWeight,
      body_weight_change: numberChange(firstBodyWeight, lastBodyWeight),
      first_waist: firstMeasurement?.waist ?? null,
      last_waist: lastMeasurement?.waist ?? null,
      waist_change: numberChange(firstMeasurement?.waist ?? null, lastMeasurement?.waist ?? null),
      avg_pain_level: average(clientReports.map((report) => report.pain_level)),
      avg_energy_level: average(clientReports.map((report) => report.energy_level)),
      workout_done_count: done,
      workout_partial_count: partial,
      workout_missed_count: missed,
      completion_rate: percent(done, clientReports.length),
      last_report_date: sortedReports[sortedReports.length - 1]?.report_date || null,
      last_measurement_date: sortedMeasurements[sortedMeasurements.length - 1]?.measurement_date || null,
    };
  });

  return NextResponse.json({ analytics, error: null, isConfigured: true });
}
