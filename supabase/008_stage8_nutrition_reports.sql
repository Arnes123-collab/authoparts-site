-- FITNESS COACH PRO - STAGE 8
-- Nutrition plans and client progress reports.

CREATE TABLE IF NOT EXISTS nutrition_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  goal text DEFAULT 'fat_loss',
  calories numeric,
  protein numeric,
  fats numeric,
  carbs numeric,
  water_liters numeric,
  meals_per_day integer,
  meal_timing text,
  food_preferences text,
  restrictions text,
  coach_notes text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS nutrition_plans_client_id_idx ON nutrition_plans(client_id);
CREATE INDEX IF NOT EXISTS nutrition_plans_created_at_idx ON nutrition_plans(created_at DESC);

CREATE TABLE IF NOT EXISTS progress_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  client_name text,
  whatsapp text,
  report_date date DEFAULT current_date,
  workout_completed text DEFAULT 'yes',
  body_weight numeric,
  sleep_hours numeric,
  sleep_quality integer,
  energy_level integer,
  pain_level integer,
  water_liters numeric,
  calories numeric,
  protein numeric,
  fats numeric,
  carbs numeric,
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS progress_reports_client_id_idx ON progress_reports(client_id);
CREATE INDEX IF NOT EXISTS progress_reports_report_date_idx ON progress_reports(report_date DESC);
CREATE INDEX IF NOT EXISTS progress_reports_created_at_idx ON progress_reports(created_at DESC);
