import type { Client } from "@/types/client";

export type WorkoutCompleted = "yes" | "partial" | "no";

export type ProgressReport = {
  id: string;
  client_id: string | null;
  client_name: string | null;
  whatsapp: string | null;
  report_date: string;
  workout_completed: WorkoutCompleted;
  body_weight: number | null;
  sleep_hours: number | null;
  sleep_quality: number | null;
  energy_level: number | null;
  pain_level: number | null;
  water_liters: number | null;
  calories: number | null;
  protein: number | null;
  fats: number | null;
  carbs: number | null;
  comment: string | null;
  created_at: string;
};

export type ProgressReportListItem = ProgressReport & {
  linked_client_name: string | null;
  instagram: string | null;
};

export type ProgressReportRequestPayload = {
  client_id: string | null;
  client_name: string | null;
  whatsapp: string | null;
  report_date: string | null;
  workout_completed: WorkoutCompleted;
  body_weight: number | string | null;
  sleep_hours: number | string | null;
  sleep_quality: number | string | null;
  energy_level: number | string | null;
  pain_level: number | string | null;
  water_liters: number | string | null;
  calories: number | string | null;
  protein: number | string | null;
  fats: number | string | null;
  carbs: number | string | null;
  comment: string | null;
};

export type ProgressReportJoined = ProgressReport & {
  clients?: Pick<Client, "name" | "instagram"> | null;
};
