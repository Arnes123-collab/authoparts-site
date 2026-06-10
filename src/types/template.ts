export type TemplateCategory =
  | "fat_loss"
  | "muscle_gain"
  | "recomposition"
  | "home_workout"
  | "beginner"
  | "advanced"
  | "health_40_plus";

export type TemplateType = "training" | "nutrition" | "combined";

export type Template = {
  id: string;
  title: string;
  template_type: TemplateType;
  category: TemplateCategory;
  description: string | null;
  duration_weeks: number | null;
  training_days_per_week: number | null;
  goal: string | null;
  level: string | null;
  content: string;
  nutrition_notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type TemplateRequestPayload = {
  title: string;
  template_type: TemplateType;
  category: TemplateCategory;
  description: string | null;
  duration_weeks: number | string | null;
  training_days_per_week: number | string | null;
  goal: string | null;
  level: string | null;
  content: string;
  nutrition_notes: string | null;
  is_active: boolean;
};
