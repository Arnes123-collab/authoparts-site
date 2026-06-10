CREATE TABLE IF NOT EXISTS body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  measurement_date date NOT NULL DEFAULT CURRENT_DATE,
  body_weight numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  thigh numeric,
  arm numeric,
  shoulder numeric,
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_body_measurements_client_id ON body_measurements(client_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_date ON body_measurements(measurement_date DESC);
