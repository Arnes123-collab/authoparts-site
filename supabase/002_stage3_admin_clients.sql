ALTER TABLE clients
ADD COLUMN IF NOT EXISTS status text DEFAULT 'new';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'clients_status_check'
  ) THEN
    ALTER TABLE clients
    ADD CONSTRAINT clients_status_check
    CHECK (status IN ('new', 'active', 'paused', 'finished'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS clients_status_idx ON clients (status);
CREATE INDEX IF NOT EXISTS clients_created_at_idx ON clients (created_at DESC);
