-- Этап 11 - расширенная CMS упражнений.
-- Выполнить после SQL Этапа 4.

ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS subcategory text,
ADD COLUMN IF NOT EXISTS equipment text,
ADD COLUMN IF NOT EXISTS replacement_exercise text,
ADD COLUMN IF NOT EXISTS sport_tags text[],
ADD COLUMN IF NOT EXISTS coach_notes text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS exercises_category_idx ON exercises (category);
CREATE INDEX IF NOT EXISTS exercises_muscle_group_idx ON exercises (muscle_group);
CREATE INDEX IF NOT EXISTS exercises_difficulty_level_idx ON exercises (difficulty_level);
CREATE INDEX IF NOT EXISTS exercises_is_active_idx ON exercises (is_active);
CREATE INDEX IF NOT EXISTS exercises_sport_tags_idx ON exercises USING gin (sport_tags);

UPDATE exercises
SET is_active = true
WHERE is_active IS NULL;
