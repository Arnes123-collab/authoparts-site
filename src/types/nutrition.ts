import type { Client } from "@/types/client";

export type NutritionGoal = "fat_loss" | "muscle_gain" | "maintenance" | "recomposition" | "health_40_plus";

export type NutritionPlan = {
  id: string;
  client_id: string;
  title: string;
  goal: NutritionGoal;
  calories: number | null;
  protein: number | null;
  fats: number | null;
  carbs: number | null;
  water_liters: number | null;
  meals_per_day: number | null;
  meal_timing: string | null;
  food_preferences: string | null;
  restrictions: string | null;
  coach_notes: string | null;
  created_at: string;
};

export type NutritionPlanListItem = NutritionPlan & {
  client_name: string | null;
  whatsapp: string | null;
  instagram: string | null;
};

export type NutritionPlanRequestPayload = {
  client_id: string;
  title: string;
  goal: NutritionGoal;
  calories: number | string | null;
  protein: number | string | null;
  fats: number | string | null;
  carbs: number | string | null;
  water_liters: number | string | null;
  meals_per_day: number | string | null;
  meal_timing: string | null;
  food_preferences: string | null;
  restrictions: string | null;
  coach_notes: string | null;
};

export type NutritionJoined = NutritionPlan & {
  clients?: Pick<Client, "name" | "whatsapp" | "instagram"> | null;
};
