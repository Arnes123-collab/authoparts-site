import type { Client } from "@/types/client";
import type { Exercise } from "@/types/exercise";

export type TrainingPlan = {
  id: string;
  client_id: string;
  title: string;
  goal: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type TrainingPlanItem = {
  id: string;
  training_plan_id: string;
  exercise_id: string | null;
  training_day: string;
  exercise_order: number;
  sets: number | null;
  reps: string | null;
  weight: number | null;
  percent: number | null;
  rest_time: string | null;
  tempo: string | null;
  comment: string | null;
  created_at: string;
};

export type TrainingPlanListItem = TrainingPlan & {
  client_name: string | null;
};

export type TrainingPlanItemWithExercise = TrainingPlanItem & {
  exercise: Exercise | null;
};

export type TrainingPlanWithItems = {
  plan: TrainingPlan;
  client: Client | null;
  items: TrainingPlanItemWithExercise[];
};

export type TrainingPlanRequestPayload = {
  client_id: string;
  title: string;
  goal: string | null;
  start_date: string | null;
  end_date: string | null;
};

export type TrainingPlanItemRequestPayload = {
  exercise_id: string;
  training_day: string;
  exercise_order: number | string | null;
  sets: number | string | null;
  reps: string | null;
  weight: number | string | null;
  percent: number | string | null;
  rest_time: string | null;
  tempo: string | null;
  comment: string | null;
};
