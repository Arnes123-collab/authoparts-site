CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer,
  weight numeric,
  height numeric,
  goal text NOT NULL,
  experience text,
  injuries text,
  training_place text,
  training_days text,
  whatsapp text,
  instagram text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'active', 'paused', 'finished')),
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clients_created_at_idx ON clients (created_at DESC);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients (status);
