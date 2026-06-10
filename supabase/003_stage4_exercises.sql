CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  muscle_group text,
  technique text,
  common_mistakes text,
  contraindications text,
  image_url text,
  video_url text,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced') OR difficulty_level IS NULL),
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exercises_created_at_idx ON exercises (created_at DESC);
CREATE INDEX IF NOT EXISTS exercises_muscle_group_idx ON exercises (muscle_group);
CREATE INDEX IF NOT EXISTS exercises_difficulty_level_idx ON exercises (difficulty_level);
