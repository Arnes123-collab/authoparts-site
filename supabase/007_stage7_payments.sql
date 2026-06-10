CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  tariff text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KZT',
  payment_date date,
  start_date date,
  expiry_date date,
  status text NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'overdue', 'paused', 'cancelled')),
  note text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_client_id_idx ON payments(client_id);
CREATE INDEX IF NOT EXISTS payments_expiry_date_idx ON payments(expiry_date);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);
