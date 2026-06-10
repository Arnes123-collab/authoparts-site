-- Stage 12: trainer branding and dark sport theme settings
CREATE TABLE IF NOT EXISTS coach_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_name text NOT NULL DEFAULT 'Fitness Coach',
  brand_name text NOT NULL DEFAULT 'Fitness Coach Pro',
  specialization text,
  logo_url text,
  coach_photo_url text,
  primary_color text NOT NULL DEFAULT '#070707',
  secondary_color text NOT NULL DEFAULT '#151515',
  accent_color text NOT NULL DEFAULT '#D62828',
  gold_color text NOT NULL DEFAULT '#D6A84F',
  instagram text,
  whatsapp text,
  email text,
  city text,
  offer_title text,
  offer_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

INSERT INTO coach_settings (
  coach_name,
  brand_name,
  specialization,
  primary_color,
  secondary_color,
  accent_color,
  gold_color,
  offer_title,
  offer_description
)
SELECT
  'Fitness Coach',
  'Fitness Coach Pro',
  'Похудение, набор мышц, онлайн-ведение и тренировки после 40+',
  '#070707',
  '#151515',
  '#D62828',
  '#D6A84F',
  'Сильное тело без хаоса',
  'Тренировки, питание, отчёты и прогресс в одной системе.'
WHERE NOT EXISTS (SELECT 1 FROM coach_settings);
