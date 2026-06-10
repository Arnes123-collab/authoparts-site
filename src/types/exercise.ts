export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type ExerciseStatus = "active" | "inactive";

export type Exercise = {
  id: string;
  name: string;
  muscle_group: string | null;
  category: string | null;
  subcategory: string | null;
  equipment: string | null;
  technique: string | null;
  common_mistakes: string | null;
  contraindications: string | null;
  image_url: string | null;
  video_url: string | null;
  difficulty_level: DifficultyLevel | null;
  replacement_exercise: string | null;
  sport_tags: string[] | null;
  coach_notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type ExerciseImagePayload = {
  fileName: string;
  contentType: string;
  size: number;
  base64: string;
};

export type ExerciseRequestPayload = {
  name: string;
  muscle_group: string | null;
  category: string | null;
  subcategory: string | null;
  equipment: string | null;
  technique: string | null;
  common_mistakes: string | null;
  contraindications: string | null;
  video_url: string | null;
  difficulty_level: DifficultyLevel | null;
  replacement_exercise: string | null;
  sport_tags: string[] | string | null;
  coach_notes: string | null;
  is_active: boolean;
  image: ExerciseImagePayload | null;
};
